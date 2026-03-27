"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { Avatar } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Textarea";

type Reply = {
  id: string;
  body: string;
  upvoteCount: number;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
  childReplies?: Reply[];
};

function timeAgo(date: Date | string) {
  const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function ReplyItem({ reply, postId, onReplyAdded }: { reply: Reply; postId: string; onReplyAdded: () => void }) {
  const { data: session } = useSession();
  const [replying, setReplying] = useState(false);
  const [body, setBody] = useState("");
  const createReply = trpc.forum.createReply.useMutation({
    onSuccess: () => { setBody(""); setReplying(false); onReplyAdded(); },
  });
  const upvote = trpc.forum.upvoteReply.useMutation({ onSuccess: onReplyAdded });

  return (
    <div className="flex gap-3">
      <Avatar src={reply.author.image} name={reply.author.name} size="sm" className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="rounded-lg bg-gray-50 px-4 py-3">
          <p className="text-xs font-medium text-gray-700 mb-1">{reply.author.name}</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.body}</p>
        </div>
        <div className="mt-1 flex items-center gap-3 px-1 text-xs text-gray-400">
          <span>{timeAgo(reply.createdAt)}</span>
          <button
            onClick={() => session?.user && upvote.mutate({ replyId: reply.id })}
            className="flex items-center gap-1 hover:text-green-600 transition-colors"
          >
            ▲ {reply.upvoteCount}
          </button>
          {session?.user && !session.user.isMinor && (
            <button onClick={() => setReplying((v) => !v)} className="hover:text-green-600 transition-colors">
              Reply
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-2 space-y-2">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="Write a reply…"
            />
            <div className="flex gap-2">
              <button
                onClick={() => createReply.mutate({ postId, body, parentReplyId: reply.id })}
                disabled={!body.trim() || createReply.isPending}
                className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800 disabled:opacity-50"
              >
                {createReply.isPending ? "Posting…" : "Post Reply"}
              </button>
              <button onClick={() => setReplying(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {reply.childReplies && reply.childReplies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-gray-100 pl-4">
            {reply.childReplies.map((child) => (
              <ReplyItem key={child.id} reply={child} postId={postId} onReplyAdded={onReplyAdded} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ForumReplySection({
  postId,
  communitySlug,
  initialReplies,
}: {
  postId: string;
  communitySlug: string;
  initialReplies: Reply[];
}) {
  const { data: session } = useSession();
  const [body, setBody] = useState("");
  const utils = trpc.useUtils();
  const [replies, setReplies] = useState(initialReplies);

  const createReply = trpc.forum.createReply.useMutation({
    onSuccess: (newReply) => {
      setBody("");
      // Refresh from server
      utils.forum.getPost.invalidate({ postId });
    },
  });

  // Refetch post replies on mutation
  const { data: postData } = trpc.forum.getPost.useQuery({ postId }, {
    initialData: undefined,
    refetchOnMount: false,
  });

  const currentReplies = postData?.replies ?? replies;

  return (
    <div>
      <h2 className="mb-4 font-semibold text-gray-900">{currentReplies.length} Replies</h2>

      {/* Reply form */}
      {session?.user ? (
        session.user.isMinor ? (
          <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-700">
            Posting requires parental consent. Please ask a parent to enable forum access.
          </div>
        ) : (
          <div className="mb-6 space-y-3">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Write a reply…"
            />
            <button
              onClick={() => createReply.mutate({ postId, body })}
              disabled={!body.trim() || createReply.isPending}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
            >
              {createReply.isPending ? "Posting…" : "Post Reply"}
            </button>
          </div>
        )
      ) : (
        <div className="mb-6 rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-500 text-center">
          <a href="/login" className="text-green-700 font-medium hover:underline">Sign in</a> to reply
        </div>
      )}

      {/* Replies list */}
      <div className="space-y-5">
        {currentReplies.map((reply) => (
          <ReplyItem
            key={reply.id}
            reply={reply as Reply}
            postId={postId}
            onReplyAdded={() => utils.forum.getPost.invalidate({ postId })}
          />
        ))}
      </div>
    </div>
  );
}
