import { z } from "zod";

export const reviewCreateSchema = z.object({
  listingId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(10).max(2000),
});

export const reviewFlagSchema = z.object({
  reviewId: z.string(),
  reason: z.string().max(500),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
