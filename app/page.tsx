import { Suspense } from "react";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import MapPanel from "@/components/MapPanel";
import { METRO_CENTER, distanceMiles } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  type?: string;
  age?: string;
  skill?: string;
  price?: string;
  radius?: string;
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const all = await prisma.listing.findMany({ include: { reviews: true } });

  const age = params.age ? parseInt(params.age, 10) : null;
  const price = params.price ? parseInt(params.price, 10) : null;
  const radius = params.radius ? parseInt(params.radius, 10) : null;
  const q = params.q?.toLowerCase().trim();

  const results = all
    .map((listing) => ({
      listing,
      distance: distanceMiles(
        METRO_CENTER.lat,
        METRO_CENTER.lng,
        listing.lat,
        listing.lng
      ),
    }))
    .filter(({ listing, distance }) => {
      if (params.type && listing.type !== params.type) return false;
      if (age !== null && (age < listing.ageMin || age > listing.ageMax))
        return false;
      if (params.skill && !listing.skillLevels.split(",").includes(params.skill))
        return false;
      if (price !== null && listing.priceTier !== price) return false;
      if (radius !== null && distance > radius) return false;
      if (
        q &&
        !listing.name.toLowerCase().includes(q) &&
        !listing.city.toLowerCase().includes(q)
      )
        return false;
      return true;
    })
    // Relevance blend per PRD: rating-weighted, then proximity,
    // with a small boost for verified listings.
    .sort((a, b) => {
      const score = (x: { listing: (typeof all)[number]; distance: number }) => {
        const avg =
          x.listing.reviews.length > 0
            ? x.listing.reviews.reduce((s, r) => s + r.rating, 0) /
              x.listing.reviews.length
            : 3;
        return avg * 2 - x.distance / 10 + (x.listing.verified ? 0.5 : 0);
      };
      return score(b) - score(a);
    });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold">Junior golf near Dallas–Fort Worth</h1>
      <p className="mt-1 text-sm text-stone-600">
        {results.length} of {all.length} resources · lessons, courses, camps
        &amp; more
      </p>

      <div className="mt-4">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_420px]">
        <div className="h-[420px] lg:h-[640px] lg:sticky lg:top-20 rounded-lg overflow-hidden border border-stone-200 order-first lg:order-last z-0">
          <MapPanel
            listings={results.map(({ listing }) => ({
              id: listing.id,
              name: listing.name,
              type: listing.type,
              city: listing.city,
              lat: listing.lat,
              lng: listing.lng,
              priceTier: listing.priceTier,
            }))}
          />
        </div>

        <div className="flex flex-col gap-3">
          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
              <p className="font-medium">No matches in this area yet.</p>
              <p className="mt-1 text-sm text-stone-600">
                Try widening your filters — or tell us where to expand
                coverage next.
              </p>
            </div>
          ) : (
            results.map(({ listing, distance }) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                distance={distance}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
