import Link from "next/link";
import { db } from "@/server/db";

export const metadata = { title: "Forum" };

export default async function ForumIndexPage() {
  const communities = await db.forumCommunity.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Forum</h1>
        <p className="mt-1 text-sm text-gray-500">Connect with junior golf families, coaches, and players</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {communities.map((c) => (
          <Link
            key={c.id}
            href={`/forum/${c.slug}`}
            className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl">
              {c.iconUrl ?? "💬"}
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{c.name}</h2>
              {c.description && (
                <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{c.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">{c._count.posts} posts</p>
            </div>
          </Link>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">💬</p>
          <p>No communities yet — seed data to populate.</p>
        </div>
      )}
    </div>
  );
}
