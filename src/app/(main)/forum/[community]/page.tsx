"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { POST_FLAIR_LABELS } from "@/types";
import type { PostFlair } from "@prisma/client";

const FLAIR_COLOR: Record<PostFlair, "green" | "blue" | "yellow" | "purple" | "red" | "gray"> = {
  QUESTION: "blue", REVIEW: "green", TOURNAMENT_REPORT: "yellow",
  TIPS: "purple", RECRUITING: "red", NEWS: "gray", GENERAL: "gray",
};

function timeAgo(date: Date | string) {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default function CommunityPage({ params }: { params: Promise<{ community: string }> }) {
  const { community } = use(params);
  const { data: session } = useSession();
  const [sort, setSort] = useState<"hot" | "new" | "top">("hot");

  const { data, isLoading } = trpc.forum.getPosts.useQuery({ communitySlug: community, sort });
  const upvoteMutation = trpc.forum.upvotePost.useMutation();
  const utils = trpc.useUtils();

  const posts = data?.items ?? [];
  const communityData = data?.community;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/forum" className="text-sm text-gray-500 hover:text-green-700">← Forum</Link>
          <h1 className="mt-1 text-xl font-bold text-gray-900">{communityData?.name ?? community}</h1>
          {communityData?.description && <p className="text-sm text-gray-500 mt-0.5">{communityData.description}</p>}
        </div>
        {session?.user && !session.user.isMinor && (
          <Link href={`/forum/new?community=${community}`} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
            + New Post
          </Link>
        )}
      </div>

      {/* Sort tabs */}
      <div className="mb-4 flex gap-1 border-b border-gray-200">
        {(["hot", "new", "top"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${sort === s ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
          : posts.length === 0
          ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">💬</p>
              <p>No posts yet — be the first!</p>
            </div>
          )
          : posts.map((post) => (
            <div key={post.id} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4">
              {/* Upvote */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => session?.user && upvoteMutation.mutate({ postId: post.id }, { onSuccess: () => utils.forum.getPosts.invalidate() })}
                  className="text-gray-400 hover:text-green-600 transition-colors"
                  aria-label="Upvote"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-xs font-semibold text-gray-600">{post.upvoteCount}</span>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant={FLAIR_COLOR[post.flair]}>{POST_FLAIR_LABELS[post.flair]}</Badge>
                </div>
                <Link href={`/forum/${community}/${post.id}`} className="font-semibold text-gray-900 hover:text-green-700 line-clamp-2">
                  {post.title}
                </Link>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.body}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Avatar src={post.author.image} name={post.author.name} size="xs" />
                    {post.author.name}
                  </span>
                  <span>{post._count.replies} replies</span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
