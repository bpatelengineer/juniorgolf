"use client";

import { useEffect, useRef, useCallback } from "react";
import type { ListingType } from "@prisma/client";

interface MapListing {
  id: string;
  slug: string;
  name: string;
  type: ListingType;
  lat: number;
  lng: number;
  avgRating: number | null;
  city: string;
  state: string;
}

interface BBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface DiscoverMapProps {
  listings: MapListing[];
  centerLat: number;
  centerLng: number;
  onBoundsChange?: (bbox: BBox) => void;
}

const TYPE_COLORS: Record<ListingType, string> = {
  COURSE: "#16a34a",
  RANGE: "#ca8a04",
  COACH: "#2563eb",
  ACADEMY: "#9333ea",
  TEAM: "#6b7280",
};

export function DiscoverMap({ listings, centerLat, centerLng, onBoundsChange }: DiscoverMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const handleBoundsChange = useCallback(
    (map: mapboxgl.Map) => {
      if (!onBoundsChange) return;
      const bounds = map.getBounds();
      if (!bounds) return;
      onBoundsChange({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast(),
      });
    },
    [onBoundsChange]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return; // Map won't render without token

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container: containerRef.current!,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [centerLng, centerLat],
        zoom: 10,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), "top-right");

      map.on("moveend", () => handleBoundsChange(map));
      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add/update markers when listings change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      // Remove existing markers
      document.querySelectorAll(".jl-marker").forEach((el) => el.remove());

      listings.forEach((listing) => {
        const el = document.createElement("div");
        el.className = "jl-marker";
        el.style.cssText = `
          width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
          background: ${TYPE_COLORS[listing.type]};
          border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer; transform: rotate(-45deg);
        `;
        el.setAttribute("aria-label", listing.name);

        const popup = new mapboxgl.Popup({ offset: 20, closeButton: false, maxWidth: "240px" }).setHTML(`
          <div style="padding:8px">
            <p style="font-weight:600;font-size:14px;margin:0 0 2px">${listing.name}</p>
            <p style="color:#6b7280;font-size:12px;margin:0 0 6px">${listing.city}, ${listing.state}</p>
            ${listing.avgRating !== null ? `<p style="font-size:12px;margin:0 0 6px">⭐ ${listing.avgRating.toFixed(1)}</p>` : ""}
            <a href="/listings/${listing.slug}" style="font-size:12px;color:#16a34a;font-weight:500">View details →</a>
          </div>
        `);

        new mapboxgl.Marker(el)
          .setLngLat([listing.lng, listing.lat])
          .setPopup(popup)
          .addTo(map);
      });
    });
  }, [listings]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl bg-gray-100 text-gray-500">
        <p className="text-sm">Map unavailable — add NEXT_PUBLIC_MAPBOX_TOKEN to .env</p>
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" />
      <div ref={containerRef} className="h-full w-full rounded-xl overflow-hidden" />
    </>
  );
}
