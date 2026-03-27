"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { LISTING_TYPE_LABELS } from "@/types";

export default function DashboardListingsPage() {
  const { data: listings, isLoading } = trpc.listings.getOwned.useQuery();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
        <Link href="/claim" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
          + Claim a Listing
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : listings?.length === 0
          ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-medium">No listings yet</p>
              <p className="text-sm mt-1">Claim a listing to manage it here</p>
            </div>
          )
          : listings?.map((l) => {
            const avgRating = l.reviews.length > 0
              ? l.reviews.reduce((s, r) => s + r.rating, 0) / l.reviews.length
              : null;
            const photo = l.photos[0];

            return (
              <div key={l.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
                <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-2xl">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.url} alt={l.name} className="h-full w-full object-cover" />
                  ) : "⛳"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="font-semibold text-gray-900 truncate">{l.name}</h2>
                    <Badge variant="gray">{LISTING_TYPE_LABELS[l.type]}</Badge>
                    {l.isVerified && <Badge variant="green">Verified</Badge>}
                  </div>
                  <p className="text-sm text-gray-500">{l.city}, {l.state}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {l.reviews.length} reviews{avgRating !== null ? ` · ${avgRating.toFixed(1)} ★` : ""}
                  </p>
                </div>
                <Link
                  href={`/listings/${l.slug}`}
                  className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  View
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
}
