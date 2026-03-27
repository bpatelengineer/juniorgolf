import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/server/db";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { POST_FLAIR_LABELS } from "@/types";
import { ForumReplySection } from "@/components/forum/ForumReplySection";
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

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ community: string; postId: string }>;
}) {
  const { community, postId } = await params;
  const post = await db.post.findUnique({
    where: { id: postId },
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

  if (!post || post.isRemoved) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href={`/forum/${community}`} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-700">
        ← {post.community.name}
      </Link>

      {/* Post */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant={FLAIR_COLOR[post.flair]}>{POST_FLAIR_LABELS[post.flair]}</Badge>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-700 whitespace-pre-wrap">{post.body}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-gray-400 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1">
            <Avatar src={post.author.image} name={post.author.name} size="xs" />
            {post.author.name}
          </span>
          <span>{post.upvoteCount} upvotes</span>
          <span>{post.replyCount} replies</span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>
      </div>

      {/* Replies (client component for interactivity) */}
      <ForumReplySection postId={postId} communitySlug={community} initialReplies={post.replies} />
    </div>
  );
}
