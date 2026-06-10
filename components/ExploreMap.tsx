"use client";

import L from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { METRO_CENTER } from "@/lib/format";

export type MapListing = {
  id: string;
  name: string;
  type: string;
  city: string;
  lat: number;
  lng: number;
  priceTier: number;
};

const TYPE_EMOJI: Record<string, string> = {
  course: "⛳",
  range: "🏌️",
  instructor: "🎓",
  academy: "🏫",
  camp: "🏕️",
};

function markerIcon(type: string) {
  return L.divIcon({
    className: "jl-marker",
    html: `<div class="jl-marker-pin"><span>${TYPE_EMOJI[type] ?? "⛳"}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

export default function ExploreMap({ listings }: { listings: MapListing[] }) {
  return (
    <MapContainer
      center={[METRO_CENTER.lat, METRO_CENTER.lng]}
      zoom={10}
      scrollWheelZoom
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {listings.map((l) => (
        <Marker key={l.id} position={[l.lat, l.lng]} icon={markerIcon(l.type)}>
          <Popup>
            <div className="text-sm">
              <Link
                href={`/listings/${l.id}`}
                className="font-semibold text-green-900 underline"
              >
                {l.name}
              </Link>
              <div className="text-stone-600">
                {l.city} · {"$".repeat(l.priceTier)}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
