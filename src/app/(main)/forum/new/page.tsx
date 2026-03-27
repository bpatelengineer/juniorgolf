"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { POST_FLAIR_LABELS } from "@/types";
import type { PostFlair } from "@prisma/client";

const FLAIR_OPTIONS = Object.entries(POST_FLAIR_LABELS).map(([v, l]) => ({ value: v, label: l }));

function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const { data: communities } = trpc.forum.listCommunities.useQuery();
  const [communityId, setCommunityId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [flair, setFlair] = useState<PostFlair>("GENERAL");
  const [error, setError] = useState("");

  const defaultSlug = searchParams.get("community") ?? "";

  const createPost = trpc.forum.createPost.useMutation({
    onSuccess: (post) => {
      const community = communities?.find((c) => c.id === post.communityId);
      if (community) router.push(`/forum/${community.slug}/${post.id}`);
      else router.push("/forum");
    },
    onError: (e) => setError(e.message),
  });

  if (!session?.user) {
    return <div className="py-20 text-center text-gray-500">Please <a href="/login" className="text-green-700 font-medium">sign in</a> to post.</div>;
  }
  if (session.user.isMinor) {
    return <div className="py-20 text-center text-yellow-700 bg-yellow-50 rounded-xl p-6">Parental consent is required to post in the forum.</div>;
  }

  const communityOptions = (communities ?? []).map((c) => ({ value: c.id, label: c.name }));

  // Pre-select community from query param
  const resolvedCommunityId = communityId || (communities?.find((c) => c.slug === defaultSlug)?.id ?? "");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New Post</h1>
      <div className="space-y-5">
        <Select
          label="Community"
          options={communityOptions}
          value={resolvedCommunityId}
          onChange={(e) => setCommunityId(e.target.value)}
          placeholder="Select a community…"
        />
        <Select
          label="Flair"
          options={FLAIR_OPTIONS}
          value={flair}
          onChange={(e) => setFlair(e.target.value as PostFlair)}
        />
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind?"
        />
        <Textarea
          label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          placeholder="Share details, ask a question, or start a discussion…"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={() => {
            if (!resolvedCommunityId || !title.trim() || !body.trim()) {
              setError("Please fill in all fields.");
              return;
            }
            createPost.mutate({ communityId: resolvedCommunityId, title, body, flair });
          }}
          disabled={createPost.isPending}
          className="rounded-xl bg-green-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {createPost.isPending ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading…</div>}>
      <NewPostForm />
    </Suspense>
  );
}
