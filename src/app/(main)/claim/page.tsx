"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useDebounce } from "@/hooks/useDebounce";
import { LISTING_TYPE_LABELS } from "@/types";

export default function ClaimLandingPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data } = trpc.listings.search.useQuery(
    { query: debouncedQuery, limit: 10 },
    { enabled: debouncedQuery.length > 1 }
  );

  const results = data?.items ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Claim Your Listing</h1>
        <p className="mt-3 text-gray-500">
          Are you a coach, course, or facility on JuniorLinks? Claim your listing to manage your profile, respond to reviews, and reach more junior golf families — for free.
        </p>
      </div>

      {/* How it works */}
      <div className="mb-10 grid grid-cols-3 gap-4 text-center">
        {[
          { step: "1", label: "Find your listing" },
          { step: "2", label: "Submit your credentials" },
          { step: "3", label: "Get verified & go live" },
        ].map((s) => (
          <div key={s.step} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">{s.step}</div>
            <p className="text-sm text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <Input
        label="Search for your listing"
        placeholder="Type a course name, coach name, or city…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftIcon={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
          </svg>
        }
      />

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
          {results.map((l) => (
            <Link
              key={l.id}
              href={`/claim/${l.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{l.name}</p>
                <p className="text-sm text-gray-500">{l.city}, {l.state}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="gray">{LISTING_TYPE_LABELS[l.type]}</Badge>
                {l.isClaimed ? (
                  <Badge variant="green">Claimed</Badge>
                ) : (
                  <span className="text-sm font-medium text-green-700">Claim →</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {debouncedQuery.length > 1 && results.length === 0 && (
        <p className="mt-4 text-center text-sm text-gray-400">No listings found for "{debouncedQuery}"</p>
      )}

      <p className="mt-8 text-center text-sm text-gray-400">
        Don&apos;t see your listing?{" "}
        <Link href="/forum/coaches-corner" className="text-green-700 hover:underline">Contact us in the forum</Link>
      </p>
    </div>
  );
}
