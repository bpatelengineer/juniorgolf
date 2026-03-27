import { createTRPCRouter, protectedProcedure, adminProcedure } from "@/lib/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const claimsRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(z.object({
      listingId: z.string(),
      documentKeys: z.array(z.string()).default([]),
      message: z.string().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const listing = await ctx.db.listing.findUnique({ where: { id: input.listingId } });
      if (!listing) throw new TRPCError({ code: "NOT_FOUND" });
      if (listing.isClaimed) throw new TRPCError({ code: "CONFLICT", message: "This listing is already claimed." });

      return ctx.db.claimRequest.upsert({
        where: { listingId_claimantId: { listingId: input.listingId, claimantId: ctx.session.user.id } },
        create: { listingId: input.listingId, claimantId: ctx.session.user.id, ...input },
        update: { documentKeys: input.documentKeys, message: input.message, status: "PENDING" },
      });
    }),

  getMyStatus: protectedProcedure
    .input(z.object({ listingId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.claimRequest.findUnique({
        where: { listingId_claimantId: { listingId: input.listingId, claimantId: ctx.session.user.id } },
      });
    }),

  listPending: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.claimRequest.findMany({
      where: { status: "PENDING" },
      include: {
        listing: { select: { id: true, name: true, slug: true, city: true, state: true } },
        claimant: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }),

  review: adminProcedure
    .input(z.object({
      claimId: z.string(),
      action: z.enum(["APPROVED", "REJECTED"]),
      rejectionReason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const claim = await ctx.db.claimRequest.findUnique({ where: { id: input.claimId } });
      if (!claim) throw new TRPCError({ code: "NOT_FOUND" });

      const updated = await ctx.db.claimRequest.update({
        where: { id: input.claimId },
        data: {
          status: input.action,
          reviewedBy: ctx.session.user.id,
          reviewedAt: new Date(),
          rejectionReason: input.rejectionReason,
        },
      });

      if (input.action === "APPROVED") {
        await ctx.db.listing.update({
          where: { id: claim.listingId },
          data: { isClaimed: true, ownerId: claim.claimantId, isVerified: true, verifiedAt: new Date() },
        });
      }

      return updated;
    }),
});
