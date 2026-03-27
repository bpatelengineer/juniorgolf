import { createTRPCRouter, publicProcedure, protectedProcedure, adultProcedure } from "@/lib/trpc/trpc";
import { postCreateSchema, replyCreateSchema, postListSchema } from "@/lib/validations/forum";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const forumRouter = createTRPCRouter({
  listCommunities: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.forumCommunity.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    });
  }),

  getCommunity: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const community = await ctx.db.forumCommunity.findUnique({ where: { slug: input.slug } });
      if (!community) throw new TRPCError({ code: "NOT_FOUND" });
      return community;
    }),

  getPosts: publicProcedure
    .input(postListSchema)
    .query(async ({ ctx, input }) => {
      const community = await ctx.db.forumCommunity.findUnique({ where: { slug: input.communitySlug } });
      if (!community) throw new TRPCError({ code: "NOT_FOUND" });

      const orderBy =
        input.sort === "new"
          ? { createdAt: "desc" as const }
          : input.sort === "top"
          ? { upvoteCount: "desc" as const }
          : { upvoteCount: "desc" as const }; // "hot" simplification

      const posts = await ctx.db.post.findMany({
        where: { communityId: community.id, isRemoved: false },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy,
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
          _count: { select: { replies: true, upvotes: true } },
        },
      });

      let nextCursor: string | undefined;
      if (posts.length > input.limit) nextCursor = posts.pop()!.id;
      return { items: posts, nextCursor, community };
    }),

  getPost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
          community: true,
          replies: {
            where: { isRemoved: false, parentReplyId: null },
            orderBy: { upvoteCount: "desc" },
            include: {
              author: { select: { id: true, name: true, image: true } },
              childReplies: {
                where: { isRemoved: false },
                orderBy: { createdAt: "asc" },
                include: { author: { select: { id: true, name: true, image: true } } },
              },
            },
          },
        },
      });
      if (!post || post.isRemoved) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  createPost: adultProcedure
    .input(postCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: { ...input, authorId: ctx.session.user.id },
      });
    }),

  createReply: adultProcedure
    .input(replyCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const [reply] = await ctx.db.$transaction([
        ctx.db.reply.create({
          data: { ...input, authorId: ctx.session.user.id },
        }),
        ctx.db.post.update({
          where: { id: input.postId },
          data: { replyCount: { increment: 1 } },
        }),
      ]);
      return reply;
    }),

  upvotePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.upvote.findUnique({
        where: { userId_postId: { userId: ctx.session.user.id, postId: input.postId } },
      });
      if (existing) {
        await ctx.db.$transaction([
          ctx.db.upvote.delete({ where: { id: existing.id } }),
          ctx.db.post.update({ where: { id: input.postId }, data: { upvoteCount: { decrement: 1 } } }),
        ]);
        return { action: "removed" };
      }
      await ctx.db.$transaction([
        ctx.db.upvote.create({ data: { userId: ctx.session.user.id, postId: input.postId } }),
        ctx.db.post.update({ where: { id: input.postId }, data: { upvoteCount: { increment: 1 } } }),
      ]);
      return { action: "added" };
    }),

  upvoteReply: protectedProcedure
    .input(z.object({ replyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.upvote.findUnique({
        where: { userId_replyId: { userId: ctx.session.user.id, replyId: input.replyId } },
      });
      if (existing) {
        await ctx.db.$transaction([
          ctx.db.upvote.delete({ where: { id: existing.id } }),
          ctx.db.reply.update({ where: { id: input.replyId }, data: { upvoteCount: { decrement: 1 } } }),
        ]);
        return { action: "removed" };
      }
      await ctx.db.$transaction([
        ctx.db.upvote.create({ data: { userId: ctx.session.user.id, replyId: input.replyId } }),
        ctx.db.reply.update({ where: { id: input.replyId }, data: { upvoteCount: { increment: 1 } } }),
      ]);
      return { action: "added" };
    }),

  flagPost: protectedProcedure
    .input(z.object({ postId: z.string(), reason: z.string().max(500) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({ where: { id: input.postId }, data: { isFlagged: true } });
    }),
});
