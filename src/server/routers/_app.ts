import { createTRPCRouter } from "@/lib/trpc/trpc";
import { usersRouter } from "./users";
import { listingsRouter } from "./listings";
import { reviewsRouter } from "./reviews";
import { eventsRouter } from "./events";
import { forumRouter } from "./forum";
import { claimsRouter } from "./claims";

export const appRouter = createTRPCRouter({
  users: usersRouter,
  listings: listingsRouter,
  reviews: reviewsRouter,
  events: eventsRouter,
  forum: forumRouter,
  claims: claimsRouter,
});

export type AppRouter = typeof appRouter;
