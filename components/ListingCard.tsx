import Link from "next/link";
import Badge from "./Badge";
import Stars from "./Stars";
import {
  LISTING_TYPES,
  SKILL_LEVELS,
  averageRating,
  priceTierLabel,
} from "@/lib/format";
import type { Listing, Review } from "@prisma/client";

export default function ListingCard({
  listing,
  distance,
}: {
  listing: Listing & { reviews: Review[] };
  distance?: number;
}) {
  const rating = averageRating(listing.reviews);
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block rounded-lg border border-stone-200 bg-white p-4 hover:border-green-700 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-900">{listing.name}</h3>
        <span className="text-sm text-stone-500 shrink-0">
          {priceTierLabel(listing.priceTier)}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm text-stone-600">
        <span>{LISTING_TYPES[listing.type]}</span>
        <span aria-hidden>·</span>
        <span>{listing.city}, {listing.state}</span>
        {distance !== undefined && (
          <>
            <span aria-hidden>·</span>
            <span>{distance.toFixed(1)} mi</span>
          </>
        )}
      </div>
      <div className="mt-2">
        <Stars rating={rating} count={listing.reviews.length} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge color="blue">
          Ages {listing.ageMin}–{listing.ageMax}
        </Badge>
        {listing.skillLevels.split(",").map((s) => (
          <Badge key={s}>{SKILL_LEVELS[s]}</Badge>
        ))}
        {listing.verified && <Badge color="green">✓ Verified</Badge>}
        {!listing.claimed && <Badge color="amber">Unclaimed</Badge>}
      </div>
    </Link>
  );
}
