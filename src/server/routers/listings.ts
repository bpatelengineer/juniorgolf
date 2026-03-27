import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "@/lib/trpc/trpc";
import { listingSearchSchema, listingCreateSchema, listingUpdateSchema } from "@/lib/validations/listing";
import { getBoundingBox, haversineDistance } from "@/lib/geo";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

function generateSlug(name: string, city: string): string {
  const base = `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export const listingsRouter = createTRPCRouter({
  search: publicProcedure
    .input(listingSearchSchema)
    .query(async ({ ctx, input }) => {
      let bbox: { minLat: number; maxLat: number; minLng: number; maxLng: number };

      if (input.minLat !== undefined && input.maxLat !== undefined) {
        bbox = { minLat: input.minLat, maxLat: input.maxLat, minLng: input.minLng!, maxLng: input.maxLng! };
      } else if (input.lat !== undefined && input.lng !== undefined) {
        bbox = getBoundingBox(input.lat, input.lng, input.radiusMiles);
      } else {
        // Default: DFW metro
        bbox = { minLat: 32.5, maxLat: 33.2, minLng: -97.5, maxLng: -96.5 };
      }

      const where: Prisma.ListingWhereInput = {
        isActive: true,
        lat: { gte: bbox.minLat, lte: bbox.maxLat },
        lng: { gte: bbox.minLng, lte: bbox.maxLng },
        ...(input.types?.length ? { type: { in: input.types } } : {}),
        ...(input.skillLevels?.length ? { skillLevels: { hasSome: input.skillLevels } } : {}),
        ...(input.priceTiers?.length ? { priceTier: { in: input.priceTiers } } : {}),
        ...(input.ageMin !== undefined ? { ageMax: { gte: input.ageMin } } : {}),
        ...(input.ageMax !== undefined ? { ageMin: { lte: input.ageMax } } : {}),
        ...(input.query
          ? { OR: [{ name: { contains: input.query, mode: "insensitive" } }, { city: { contains: input.query, mode: "insensitive" } }] }
          : {}),
      };

      const listings = await ctx.db.listing.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { name: "asc" },
        include: {
          photos: { where: { isPrimary: true }, take: 1 },
          reviews: { select: { rating: true } },
        },
      });

      let nextCursor: string | undefined;
      if (listings.length > input.limit) {
        nextCursor = listings.pop()!.id;
      }

      const results = listings.map((l) => {
        const avgRating =
          l.reviews.length > 0
            ? l.reviews.reduce((sum, r) => sum + r.rating, 0) / l.reviews.length
            : null;
        const distance =
          input.lat && input.lng && l.lat && l.lng
            ? haversineDistance(input.lat, input.lng, l.lat, l.lng)
            : null;
        return { ...l, avgRating, reviewCount: l.reviews.length, distance };
      });

      return { items: results, nextCursor };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const listing = await ctx.db.listing.findUnique({
        where: { slug: input.slug },
        include: {
          photos: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
          reviews: {
            include: { author: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: "desc" },
            take: 20,
          },
          coaches: { include: { user: { select: { id: true, name: true, image: true } } } },
          events: {
            where: { isPublished: true, dateStart: { gte: new Date() } },
            orderBy: { dateStart: "asc" },
            take: 5,
          },
        },
      });
      if (!listing) throw new TRPCError({ code: "NOT_FOUND" });

      const avgRating =
        listing.reviews.length > 0
          ? listing.reviews.reduce((s, r) => s + r.rating, 0) / listing.reviews.length
          : null;

      return { ...listing, avgRating };
    }),

  create: protectedProcedure
    .input(listingCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!["ADMIN", "ORGANIZER"].includes(ctx.session.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const slug = generateSlug(input.name, input.city);
      return ctx.db.listing.create({ data: { ...input, slug } });
    }),

  update: protectedProcedure
    .input(listingUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const listing = await ctx.db.listing.findUnique({ where: { id: input.id } });
      if (!listing) throw new TRPCError({ code: "NOT_FOUND" });
      const isOwner = listing.ownerId === ctx.session.user.id;
      const isAdmin = ctx.session.user.role === "ADMIN";
      if (!isOwner && !isAdmin) throw new TRPCError({ code: "FORBIDDEN" });
      const { id, ...data } = input;
      return ctx.db.listing.update({ where: { id }, data });
    }),

  addPhoto: protectedProcedure
    .input(z.object({ listingId: z.string(), s3Key: z.string(), url: z.string(), caption: z.string().optional(), isPrimary: z.boolean().default(false) }))
    .mutation(async ({ ctx, input }) => {
      const listing = await ctx.db.listing.findUnique({ where: { id: input.listingId } });
      if (!listing) throw new TRPCError({ code: "NOT_FOUND" });
      if (listing.ownerId !== ctx.session.user.id && ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (input.isPrimary) {
        await ctx.db.listingPhoto.updateMany({ where: { listingId: input.listingId }, data: { isPrimary: false } });
      }
      return ctx.db.listingPhoto.create({ data: { ...input, uploadedBy: ctx.session.user.id } });
    }),

  getOwned: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.listing.findMany({
      where: { ownerId: ctx.session.user.id },
      include: { photos: { where: { isPrimary: true }, take: 1 }, reviews: { select: { rating: true } } },
    });
  }),

  adminList: adminProcedure
    .input(z.object({ cursor: z.string().optional(), limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.listing.findMany({
        take: input.limit,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: { photos: { where: { isPrimary: true }, take: 1 } },
      });
    }),
});
