"use client";

import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function AdminClaimsPage() {
  const { data: claims, isLoading } = trpc.claims.listPending.useQuery();
  const reviewMutation = trpc.claims.review.useMutation();
  const utils = trpc.useUtils();

  function handle(claimId: string, action: "APPROVED" | "REJECTED", reason?: string) {
    reviewMutation.mutate({ claimId, action, rejectionReason: reason }, {
      onSuccess: () => utils.claims.listPending.invalidate(),
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-xl font-bold text-gray-900">Pending Claim Requests</h1>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : claims?.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-400">
          <p className="text-4xl mb-3">✅</p>
          <p>No pending claims — all clear!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims?.map((claim) => (
            <div key={claim.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <Link href={`/listings/${claim.listing.slug}`} className="font-semibold text-gray-900 hover:text-green-700">
                    {claim.listing.name}
                  </Link>
                  <p className="text-sm text-gray-500">{claim.listing.city}, {claim.listing.state}</p>
                </div>
                <Badge variant="yellow">PENDING</Badge>
              </div>

              <div className="mb-3 text-sm">
                <p className="text-gray-500">Claimant: <span className="font-medium text-gray-700">{claim.claimant.name}</span> ({claim.claimant.email})</p>
                <p className="text-gray-500">Role: <span className="capitalize">{claim.claimant.role.toLowerCase()}</span></p>
                {claim.documentKeys.length > 0 && (
                  <p className="text-gray-500">Documents: <span className="font-mono text-xs text-gray-700">{claim.documentKeys.join(", ")}</span></p>
                )}
              </div>

              {claim.message && (
                <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                  {claim.message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handle(claim.id, "APPROVED")}
                  disabled={reviewMutation.isPending}
                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    const reason = window.prompt("Rejection reason (optional):");
                    handle(claim.id, "REJECTED", reason ?? undefined);
                  }}
                  disabled={reviewMutation.isPending}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
