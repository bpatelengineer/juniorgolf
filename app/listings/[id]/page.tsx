import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import Stars from "@/components/Stars";
import {
  LISTING_TYPES,
  SKILL_LEVELS,
  averageRating,
  priceTierLabel,
} from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PROGRAM_LABELS: Record<string, string> = {
  lessons: "Lessons",
  clinics: "Clinics",
  leagues: "Leagues",
  camps: "Camps",
  tournaments: "Tournaments",
};

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { reviews: { orderBy: { createdAt: "desc" } } },
  });
  if (!listing) notFound();

  const rating = averageRating(listing.reviews);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/" className="text-sm text-green-800 hover:underline">
        ← Back to Explore
      </Link>

      <div className="mt-3 rounded-lg border border-stone-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{listing.name}</h1>
            <p className="mt-1 text-sm text-stone-600">
              {LISTING_TYPES[listing.type]} · {listing.city}, {listing.state} ·{" "}
              {priceTierLabel(listing.priceTier)}
            </p>
          </div>
          <Stars rating={rating} count={listing.reviews.length} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge color="blue">
            Ages {listing.ageMin}–{listing.ageMax}
          </Badge>
          {listing.skillLevels.split(",").map((s) => (
            <Badge key={s}>{SKILL_LEVELS[s]}</Badge>
          ))}
          {listing.programs.split(",").map((p) => (
            <Badge key={p} color="green">
              {PROGRAM_LABELS[p]}
            </Badge>
          ))}
          {listing.verified && <Badge color="green">✓ Verified junior-friendly</Badge>}
        </div>

        {!listing.claimed && (
          <div className="mt-4 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
            This listing hasn&apos;t been claimed by its owner yet. Details may
            be incomplete.{" "}
            <span className="font-medium">Own this business? Claim it free.</span>
          </div>
        )}

        <p className="mt-4 text-stone-700 leading-relaxed">
          {listing.description}
        </p>

        <dl className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 text-sm">
          <div>
            <dt className="font-medium text-stone-500">Address</dt>
            <dd>
              {listing.address}, {listing.city}, {listing.state} {listing.zip}
            </dd>
          </div>
          {listing.hours && (
            <div>
              <dt className="font-medium text-stone-500">Hours</dt>
              <dd>{listing.hours}</dd>
            </div>
          )}
          {listing.phone && (
            <div>
              <dt className="font-medium text-stone-500">Phone</dt>
              <dd>
                <a href={`tel:${listing.phone}`} className="text-green-800 hover:underline">
                  {listing.phone}
                </a>
              </dd>
            </div>
          )}
          {listing.website && (
            <div>
              <dt className="font-medium text-stone-500">Website</dt>
              <dd>
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-800 hover:underline"
                >
                  Visit website ↗
                </a>
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex gap-3">
          {listing.phone && (
            <a
              href={`tel:${listing.phone}`}
              className="rounded-md bg-green-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-900"
            >
              Contact
            </a>
          )}
          {listing.website && (
            <a
              href={listing.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-green-800 px-5 py-2.5 text-sm font-semibold text-green-800 hover:bg-green-50"
            >
              Book a lesson
            </a>
          )}
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-bold">
          Reviews ({listing.reviews.length})
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {listing.reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-stone-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-sm">{review.authorName}</span>
                <Stars rating={review.rating} />
                {review.verifiedVisit && (
                  <Badge color="green">✓ Verified visit</Badge>
                )}
                <span className="ml-auto text-xs text-stone-400">
                  {review.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-700">{review.body}</p>
            </div>
          ))}
          {listing.reviews.length === 0 && (
            <p className="text-sm text-stone-500">
              No reviews yet. Be the first to share your experience.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
