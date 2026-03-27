import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/lib/trpc/trpc";
import { reviewCreateSchema, reviewFlagSchema } from "@/lib/validations/review";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const reviewsRouter = createTRPCRouter({
  listByListing: publicProcedure
    .input(z.object({ listingId: z.string(), cursor: z.string().optional(), limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.db.review.findMany({
        where: { listingId: input.listingId, isFlagged: false },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true, image: true } } },
      });
      let nextCursor: string | undefined;
      if (reviews.length > input.limit) nextCursor = reviews.pop()!.id;
      return { items: reviews, nextCursor };
    }),

  create: protectedProcedure
    .input(reviewCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.review.findUnique({
        where: { listingId_authorId: { listingId: input.listingId, authorId: ctx.session.user.id } },
      });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "You already reviewed this listing." });

      return ctx.db.review.create({
        data: { ...input, authorId: ctx.session.user.id },
      });
    }),

  flag: protectedProcedure
    .input(reviewFlagSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.review.update({
        where: { id: input.reviewId },
        data: { isFlagged: true, flagReason: input.reason },
      });
    }),
});
