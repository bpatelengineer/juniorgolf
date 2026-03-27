import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/lib/trpc/trpc";
import { eventCreateSchema, eventUpdateSchema, eventSearchSchema } from "@/lib/validations/event";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

function generateSlug(title: string, city: string): string {
  const base = `${title}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export const eventsRouter = createTRPCRouter({
  list: publicProcedure
    .input(eventSearchSchema)
    .query(async ({ ctx, input }) => {
      const where: Prisma.EventWhereInput = {
        isPublished: true,
        isCanceled: false,
        dateStart: {
          gte: input.dateFrom ? new Date(input.dateFrom) : new Date(),
          ...(input.dateTo ? { lte: new Date(input.dateTo) } : {}),
        },
        ...(input.eventType ? { eventType: input.eventType } : {}),
        ...(input.city ? { city: { contains: input.city, mode: "insensitive" } } : {}),
        ...(input.state ? { state: input.state } : {}),
      };

      const events = await ctx.db.event.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { dateStart: "asc" },
        include: {
          organizer: { select: { id: true, name: true, image: true } },
          venue: { select: { id: true, name: true, slug: true } },
          photos: { take: 1 },
          _count: { select: { rsvps: true } },
        },
      });

      let nextCursor: string | undefined;
      if (events.length > input.limit) nextCursor = events.pop()!.id;
      return { items: events, nextCursor };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({
        where: { slug: input.slug },
        include: {
          organizer: { select: { id: true, name: true, image: true } },
          venue: true,
          photos: true,
          _count: { select: { rsvps: true } },
        },
      });
      if (!event) throw new TRPCError({ code: "NOT_FOUND" });
      return event;
    }),

  create: protectedProcedure
    .input(eventCreateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!["ADMIN", "ORGANIZER", "COACH"].includes(ctx.session.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const slug = generateSlug(input.title, input.city);
      return ctx.db.event.create({
        data: {
          ...input,
          slug,
          organizerId: ctx.session.user.id,
          dateStart: new Date(input.dateStart),
          dateEnd: input.dateEnd ? new Date(input.dateEnd) : undefined,
          registrationDeadline: input.registrationDeadline ? new Date(input.registrationDeadline) : undefined,
        },
      });
    }),

  update: protectedProcedure
    .input(eventUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({ where: { id: input.id } });
      if (!event) throw new TRPCError({ code: "NOT_FOUND" });
      if (event.organizerId !== ctx.session.user.id && ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { id, ...data } = input;
      return ctx.db.event.update({ where: { id }, data });
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db.event.findUnique({ where: { id: input.id } });
      if (!event) throw new TRPCError({ code: "NOT_FOUND" });
      if (event.organizerId !== ctx.session.user.id && ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return ctx.db.event.update({ where: { id: input.id }, data: { isPublished: true } });
    }),

  rsvp: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.eventRsvp.upsert({
        where: { eventId_userId: { eventId: input.eventId, userId: ctx.session.user.id } },
        create: { eventId: input.eventId, userId: ctx.session.user.id },
        update: {},
      });
    }),

  unrsvp: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.eventRsvp.deleteMany({
        where: { eventId: input.eventId, userId: ctx.session.user.id },
      });
    }),

  myRsvps: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.eventRsvp.findMany({
      where: { userId: ctx.session.user.id },
      include: { event: { include: { venue: { select: { name: true, slug: true } } } } },
      orderBy: { event: { dateStart: "asc" } },
    });
  }),

  getOrganizerEvents: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.event.findMany({
      where: { organizerId: ctx.session.user.id },
      orderBy: { dateStart: "desc" },
      include: { _count: { select: { rsvps: true } } },
    });
  }),
});
