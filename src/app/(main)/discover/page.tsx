"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { trpc } from "@/lib/trpc/client";
import { FilterSidebar, type FilterState } from "@/components/discover/FilterSidebar";
import { ListingCard } from "@/components/discover/ListingCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useDebounce } from "@/hooks/useDebounce";
import type { ListingType, SkillLevel, PriceTier } from "@prisma/client";

const DiscoverMap = dynamic(
  () => import("@/components/map/DiscoverMap").then((m) => m.DiscoverMap),
  { ssr: false, loading: () => <div className="h-full rounded-xl bg-gray-200 animate-pulse" /> }
);

const DEFAULT_FILTERS: FilterState = {
  query: "",
  types: [],
  skillLevels: [],
  priceTiers: [],
  ageMin: "",
  ageMax: "",
  radiusMiles: 25,
};

export default function DiscoverPage() {
  const geo = useGeolocation();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [view, setView] = useState<"map" | "list">("map");
  const debouncedQuery = useDebounce(filters.query, 300);

  const { data, isLoading } = trpc.listings.search.useQuery(
    {
      lat: geo.lat,
      lng: geo.lng,
      radiusMiles: filters.radiusMiles,
      types: filters.types.length ? filters.types : undefined,
      skillLevels: filters.skillLevels.length ? (filters.skillLevels as SkillLevel[]) : undefined,
      priceTiers: filters.priceTiers.length ? (filters.priceTiers as PriceTier[]) : undefined,
      ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
      ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
      query: debouncedQuery || undefined,
    },
    { enabled: !geo.loading }
  );

  const listings = data?.items ?? [];

  const mapListings = listings
    .filter((l) => l.lat !== null && l.lng !== null)
    .map((l) => ({ id: l.id, slug: l.slug, name: l.name, type: l.type as ListingType, lat: l.lat!, lng: l.lng!, avgRating: l.avgRating, city: l.city, state: l.state }));

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Filter sidebar */}
      <div className="hidden lg:flex lg:flex-col w-72 shrink-0 border-r border-gray-100 bg-white overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-bold text-gray-900">Filters</h2>
          <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">{listings.length}</span>
        </div>
        <div className="p-5">
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3 shadow-sm">
          <h1 className="font-bold text-gray-900 text-sm sm:text-base">
            Junior Golf · {geo.loading ? "Locating…" : "DFW Area"}
          </h1>
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                view === "map" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              Map
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                view === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              List
            </button>
          </div>
        </div>

        {/* Mobile filters */}
        <div className="lg:hidden border-b border-gray-100 bg-white px-4 py-3 overflow-x-auto">
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {/* Content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Map */}
          {view === "map" && (
            <div className="flex-1 p-3">
              <DiscoverMap listings={mapListings} centerLat={geo.lat} centerLng={geo.lng} />
            </div>
          )}

          {/* List panel */}
          <div className={`${view === "map" ? "hidden lg:flex" : "flex"} w-full lg:w-96 flex-col overflow-y-auto border-l border-gray-100 bg-gray-50`}>
            <div className="p-3 space-y-2.5">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : listings.length === 0
                ? (
                  <div className="py-16 text-center text-gray-400">
                    <div className="mb-4 text-5xl">⛳</div>
                    <p className="font-semibold text-gray-600">No results found</p>
                    <p className="text-sm mt-1">Try expanding your radius or clearing filters</p>
                  </div>
                )
                : listings.map((l) => (
                  <ListingCard key={l.id} listing={{ ...l, avgRating: l.avgRating ?? null }} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
