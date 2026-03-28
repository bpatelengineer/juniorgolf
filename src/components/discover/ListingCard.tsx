import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { LISTING_TYPE_LABELS, PRICE_TIER_LABELS } from "@/types";
import type { ListingType, PriceTier } from "@prisma/client";

interface ListingCardProps {
  listing: {
    id: string;
    slug: string;
    name: string;
    type: ListingType;
    city: string;
    state: string;
    priceTier?: PriceTier | null;
    isVerified: boolean;
    isJuniorFriendly: boolean;
    avgRating: number | null;
    reviewCount: number;
    distance: number | null;
    photos: { url: string; caption?: string | null }[];
    programTypes: string[];
    ageMin?: number | null;
    ageMax?: number | null;
  };
}

const TYPE_BADGE_COLOR: Record<ListingType, "green" | "blue" | "yellow" | "purple" | "gray"> = {
  COURSE: "green",
  RANGE: "yellow",
  COACH: "blue",
  ACADEMY: "purple",
  TEAM: "gray",
};

export function ListingCard({ listing }: ListingCardProps) {
  const photo = listing.photos[0];

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Photo */}
      <div className="relative h-44 w-full bg-gray-100">
        {photo ? (
          <Image
            src={photo.url}
            alt={photo.caption ?? listing.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 text-5xl text-green-300">⛳</div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5">
          <Badge variant={TYPE_BADGE_COLOR[listing.type]}>{LISTING_TYPE_LABELS[listing.type]}</Badge>
        </div>
        {listing.isVerified && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant="green" className="gap-1 bg-green-700 text-white ring-0">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Verified
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">{listing.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {listing.city}, {listing.state}
          {listing.distance !== null && <span className="text-gray-400"> · {listing.distance.toFixed(1)} mi</span>}
        </p>

        <div className="mt-3 flex items-center justify-between">
          {listing.avgRating !== null ? (
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-800">
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {listing.avgRating.toFixed(1)}
              <span className="text-xs text-gray-400 font-normal">({listing.reviewCount})</span>
            </span>
          ) : (
            <span className="text-xs text-gray-400">No reviews yet</span>
          )}
          {listing.priceTier && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">{PRICE_TIER_LABELS[listing.priceTier]}</span>
          )}
        </div>

        {listing.ageMin !== null && (
          <p className="mt-2 text-xs text-gray-400">Ages {listing.ageMin}–{listing.ageMax ?? 18}</p>
        )}

        {listing.programTypes.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {listing.programTypes.slice(0, 3).map((p) => (
              <span key={p} className="rounded-full bg-gray-50 border border-gray-200 px-2 py-0.5 text-xs text-gray-600 capitalize">{p}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
