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
      <div className="hidden lg:flex lg:flex-col w-72 shrink-0 border-r border-gray-200 bg-white overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          <span className="text-xs text-gray-400">{listings.length} results</span>
        </div>
        <FilterSidebar filters={filters} onChange={setFilters} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <h1 className="font-semibold text-gray-900 text-sm sm:text-base">
            Junior Golf Near {geo.loading ? "You" : "DFW"}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("map")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${view === "map" ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Map
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${view === "list" ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Mobile filters */}
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-3 overflow-x-auto">
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

          {/* List panel (always visible on desktop beside map) */}
          <div className={`${view === "map" ? "hidden lg:flex" : "flex"} w-full lg:w-96 flex-col overflow-y-auto border-l border-gray-200 bg-white`}>
            <div className="p-4 space-y-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : listings.length === 0
                ? (
                  <div className="py-12 text-center text-gray-400">
                    <p className="text-4xl mb-3">⛳</p>
                    <p className="font-medium">No results found</p>
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
