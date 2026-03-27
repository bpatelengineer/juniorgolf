import { z } from "zod";
import { PostFlair } from "@prisma/client";

export const postCreateSchema = z.object({
  communityId: z.string(),
  title: z.string().min(3).max(300),
  body: z.string().min(10).max(10000),
  flair: z.nativeEnum(PostFlair).default("GENERAL"),
});

export const replyCreateSchema = z.object({
  postId: z.string(),
  body: z.string().min(2).max(5000),
  parentReplyId: z.string().optional(),
});

export const postListSchema = z.object({
  communitySlug: z.string(),
  sort: z.enum(["new", "hot", "top"]).default("hot"),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
});

export type PostCreateInput = z.infer<typeof postCreateSchema>;
export type ReplyCreateInput = z.infer<typeof replyCreateSchema>;
