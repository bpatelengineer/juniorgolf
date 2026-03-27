import { notFound } from "next/navigation";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { formatDate } from "@/lib/utils";
import { LISTING_TYPE_LABELS, PRICE_TIER_LABELS, SKILL_LEVEL_LABELS } from "@/types";
import { ReviewForm } from "./ReviewForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TYPE_BADGE_VARIANT: Record<string, "green" | "blue" | "yellow" | "purple" | "gray"> = {
  COURSE: "green",
  RANGE: "blue",
  COACH: "purple",
  ACADEMY: "yellow",
  TEAM: "gray",
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const listing = await db.listing.findUnique({ where: { slug }, select: { name: true, city: true, state: true } });
  if (!listing) return { title: "Not Found" };
  return { title: `${listing.name} — ${listing.city}, ${listing.state}` };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();

  const listing = await db.listing.findUnique({
    where: { slug },
    include: {
      photos: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      reviews: {
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });

  if (!listing || !listing.isActive) notFound();

  const avgRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : null;

  const primaryPhoto = listing.photos.find((p) => p.isPrimary) ?? listing.photos[0];
  const galleryPhotos = listing.photos.filter((p) => p.id !== primaryPhoto?.id);

  const hours = listing.hours as Record<string, string> | null;

  const userHasReviewed = session?.user?.id
    ? listing.reviews.some((r) => r.authorId === session.user.id)
    : false;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden bg-gray-200 mb-6">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto.url}
            alt={listing.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-50">
            <span className="text-green-300 text-7xl">⛳</span>
          </div>
        )}
      </div>

      {/* Name / Type / Badges */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={TYPE_BADGE_VARIANT[listing.type] ?? "gray"}>
              {LISTING_TYPE_LABELS[listing.type]}
            </Badge>
            {listing.isVerified && (
              <Badge variant="green">✓ Verified</Badge>
            )}
            {listing.isJuniorFriendly && (
              <Badge variant="blue">Junior Friendly</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{listing.name}</h1>
          <p className="text-gray-500 mt-1">
            {listing.city}, {listing.state}
            {listing.address ? ` · ${listing.address}` : ""}
          </p>
          {avgRating !== null && (
            <div className="flex items-center gap-2 mt-2">
              <StarRating value={Math.round(avgRating)} readonly size="sm" />
              <span className="text-sm text-gray-600">
                {avgRating.toFixed(1)} ({listing.reviews.length} review{listing.reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>

        {listing.website && (
          <a
            href={listing.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors shrink-0"
          >
            Visit Website
          </a>
        )}
      </div>

      {/* Claim Banner */}
      {!listing.isClaimed && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-900 text-sm">Is this your listing?</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Claim it to update information, add photos, and respond to reviews.
            </p>
          </div>
          <Link
            href={`/claim/${listing.id}`}
            className="shrink-0 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            Claim Listing
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          {listing.description && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{listing.description}</p>
            </section>
          )}

          {/* Photo Gallery */}
          {galleryPhotos.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={photo.url}
                      alt={photo.caption ?? listing.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reviews{listing.reviews.length > 0 ? ` (${listing.reviews.length})` : ""}
            </h2>

            {listing.reviews.length === 0 && (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
            )}

            <div className="space-y-5">
              {listing.reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-xl p-5 bg-white">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar src={review.author.image} name={review.author.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{review.author.name ?? "Anonymous"}</p>
                      <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                    <StarRating value={review.rating} readonly size="sm" />
                  </div>
                  {review.title && (
                    <p className="font-semibold text-gray-900 text-sm mb-1">{review.title}</p>
                  )}
                  <p className="text-gray-700 text-sm leading-relaxed">{review.body}</p>
                </div>
              ))}
            </div>

            {/* Review Form */}
            {session?.user && !userHasReviewed && (
              <div className="mt-6">
                <ReviewForm listingId={listing.id} />
              </div>
            )}
            {!session?.user && (
              <p className="mt-4 text-sm text-gray-500">
                <Link href="/login" className="text-green-700 hover:underline font-medium">Sign in</Link> to leave a review.
              </p>
            )}
            {userHasReviewed && (
              <p className="mt-4 text-sm text-gray-500">You have already reviewed this listing.</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Contact Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <h3 className="font-semibold text-gray-900">Contact & Info</h3>

            {listing.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${listing.phone}`} className="hover:text-green-700">{listing.phone}</a>
              </div>
            )}

            {listing.address && (
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{listing.address}<br />{listing.city}, {listing.state} {listing.zipCode}</span>
              </div>
            )}

            {listing.website && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline truncate">
                  {listing.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <h3 className="font-semibold text-gray-900">Details</h3>

            {(listing.ageMin !== null || listing.ageMax !== null) && (
              <div className="text-sm">
                <span className="text-gray-500">Age Range: </span>
                <span className="text-gray-900 font-medium">
                  {listing.ageMin ?? "Any"}–{listing.ageMax ?? "Any"}
                </span>
              </div>
            )}

            {listing.skillLevels.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-500 block mb-1">Skill Levels:</span>
                <div className="flex flex-wrap gap-1">
                  {listing.skillLevels.map((s) => (
                    <Badge key={s} variant="gray">{SKILL_LEVEL_LABELS[s]}</Badge>
                  ))}
                </div>
              </div>
            )}

            {listing.priceTier && (
              <div className="text-sm">
                <span className="text-gray-500">Price: </span>
                <span className="text-gray-900 font-medium">{PRICE_TIER_LABELS[listing.priceTier]}</span>
              </div>
            )}

            {listing.programTypes.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-500 block mb-1">Programs:</span>
                <div className="flex flex-wrap gap-1">
                  {listing.programTypes.map((p) => (
                    <Badge key={p} variant="blue">{p}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hours */}
          {hours && Object.keys(hours).length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Hours</h3>
              <div className="space-y-1.5">
                {Object.entries(hours).map(([day, time]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-gray-500 capitalize">{day}</span>
                    <span className="text-gray-900">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
