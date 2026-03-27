"use client";

import { useState, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LISTING_TYPE_LABELS } from "@/types";

export default function ClaimFormPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = use(params);
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [pgaNumber, setPgaNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { data: listings } = trpc.listings.search.useQuery({ limit: 1 }, { enabled: false });
  const statusQuery = trpc.claims.getMyStatus.useQuery({ listingId }, { enabled: !!session?.user });

  const listing = trpc.listings.getBySlug.useQuery({ slug: "" }, { enabled: false });

  const submitClaim = trpc.claims.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => setError(e.message),
  });

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-gray-500">Please <Link href="/login" className="text-green-700 font-medium hover:underline">sign in</Link> to claim a listing.</p>
      </div>
    );
  }

  const existingClaim = statusQuery.data;

  if (submitted || existingClaim) {
    const status = existingClaim?.status ?? "PENDING";
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mb-4 text-5xl">{status === "APPROVED" ? "✅" : status === "REJECTED" ? "❌" : "⏳"}</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {status === "APPROVED" ? "Claim Approved!" : status === "REJECTED" ? "Claim Rejected" : "Claim Submitted"}
        </h1>
        <p className="text-gray-500 mb-4">
          {status === "APPROVED"
            ? "You now own this listing. Go to your dashboard to manage it."
            : status === "REJECTED"
            ? existingClaim?.rejectionReason ?? "Your claim was reviewed and rejected."
            : "Our team will review your claim within 24–48 hours."}
        </p>
        <Badge variant={status === "APPROVED" ? "green" : status === "REJECTED" ? "red" : "yellow"}>{status}</Badge>
        <div className="mt-6">
          <Link href="/dashboard" className="text-green-700 font-medium hover:underline">Go to Dashboard →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <Link href="/claim" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-700">← Back to Search</Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Claim This Listing</h1>
      <p className="text-sm text-gray-500 mb-6">
        Listing ID: <code className="bg-gray-100 px-1 rounded text-xs">{listingId}</code>
      </p>

      <div className="space-y-5">
        <Input
          label="PGA Member Number (if applicable)"
          placeholder="e.g. 1234567"
          value={pgaNumber}
          onChange={(e) => setPgaNumber(e.target.value)}
        />
        <Textarea
          label="Tell us why you own this listing"
          placeholder="Describe your role (e.g. I am the head instructor, I manage this facility, etc.)"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
          <strong>What happens next:</strong> Our team reviews your claim within 24–48 hours. You may be contacted for additional verification.
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={() => submitClaim.mutate({ listingId, message, documentKeys: pgaNumber ? [pgaNumber] : [] })}
          disabled={submitClaim.isPending || !message.trim()}
          className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {submitClaim.isPending ? "Submitting…" : "Submit Claim"}
        </button>
      </div>
    </div>
  );
}
