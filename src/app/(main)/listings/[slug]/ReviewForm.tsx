"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { StarRating } from "@/components/ui/StarRating";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function ReviewForm({ listingId, onSubmitted }: { listingId: string; onSubmitted?: () => void }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const create = trpc.reviews.create.useMutation({
    onSuccess: () => { setDone(true); onSubmitted?.(); },
    onError: (e) => setError(e.message),
  });

  if (!session?.user) {
    return (
      <p className="text-sm text-gray-500">
        <a href="/login" className="text-green-700 font-medium hover:underline">Sign in</a> to leave a review.
      </p>
    );
  }

  if (done) {
    return <p className="text-sm font-medium text-green-700">Thanks for your review!</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Write a Review</h3>
      <div>
        <p className="mb-1 text-sm font-medium text-gray-700">Rating</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <Input label="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarize your experience" />
      <Textarea label="Your Review" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tell other families what you experienced…" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={() => {
          if (rating === 0) { setError("Please select a rating."); return; }
          if (!body.trim()) { setError("Please write a review body."); return; }
          create.mutate({ listingId, rating, title: title || undefined, body });
        }}
        disabled={create.isPending}
        className="rounded-xl bg-green-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
      >
        {create.isPending ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}
