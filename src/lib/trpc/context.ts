import { auth } from "@/server/auth";
import { db } from "@/server/db";
import type { NextRequest } from "next/server";

export async function createTRPCContext(opts: { req: NextRequest }) {
  const session = await auth();
  return {
    db,
    session,
    req: opts.req,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
