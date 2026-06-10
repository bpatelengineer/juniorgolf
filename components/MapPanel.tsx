"use client";

import dynamic from "next/dynamic";
import type { MapListing } from "./ExploreMap";

// Leaflet touches `window` at import time, so the map must skip SSR.
const ExploreMap = dynamic(() => import("./ExploreMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-lg bg-stone-100 flex items-center justify-center text-sm text-stone-500">
      Loading map…
    </div>
  ),
});

export default function MapPanel({ listings }: { listings: MapListing[] }) {
  return <ExploreMap listings={listings} />;
}
