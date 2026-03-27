import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/server/db";
import { Badge } from "@/components/ui/Badge";
import { EVENT_TYPE_LABELS } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { EventType } from "@prisma/client";

const TYPE_BADGE: Record<EventType, "green" | "blue" | "yellow" | "purple" | "red" | "gray"> = {
  TOURNAMENT: "green", CLINIC: "blue", CAMP: "purple", LEAGUE: "yellow",
  SHOWCASE: "blue", SCRAMBLE: "green", QUALIFIER: "red", OTHER: "gray",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug }, select: { title: true, description: true } });
  if (!event) return {};
  return { title: event.title, description: event.description?.slice(0, 160) };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await db.event.findUnique({
    where: { slug },
    include: {
      organizer: { select: { id: true, name: true, image: true } },
      venue: { select: { id: true, name: true, slug: true, address: true, city: true, state: true } },
      _count: { select: { rsvps: true } },
    },
  });

  if (!event || !event.isPublished) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Back */}
      <Link href="/events" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-700">
        ← Back to Events
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant={TYPE_BADGE[event.eventType]}>{EVENT_TYPE_LABELS[event.eventType]}</Badge>
          {event.tourAffiliation && <Badge variant="gray">{event.tourAffiliation}</Badge>}
          {event.isCanceled && <Badge variant="red">Canceled</Badge>}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
        <p className="mt-2 text-gray-500">
          {formatDate(event.dateStart)}{event.dateEnd ? ` – ${formatDate(event.dateEnd)}` : ""} · {event.city}, {event.state}
        </p>
      </div>

      {/* Key info grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {event.entryFee !== null && (
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Entry Fee</p>
            <p className="font-semibold text-gray-900">{event.entryFee === 0 ? "Free" : formatCurrency(event.entryFee)}</p>
          </div>
        )}
        {event.maxParticipants && (
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Field Size</p>
            <p className="font-semibold text-gray-900">{event.maxParticipants}</p>
          </div>
        )}
        {event.registrationDeadline && (
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Reg. Deadline</p>
            <p className="font-semibold text-gray-900">{formatDate(event.registrationDeadline)}</p>
          </div>
        )}
        <div className="rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Saved by</p>
          <p className="font-semibold text-gray-900">{event._count.rsvps} players</p>
        </div>
      </div>

      {/* Age divisions */}
      {event.ageDivisions.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 font-semibold text-gray-900">Age Divisions</h2>
          <div className="flex flex-wrap gap-2">
            {event.ageDivisions.map((d) => (
              <span key={d} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">Ages {d}</span>
            ))}
          </div>
        </div>
      )}

      {/* Format */}
      {event.format && (
        <div className="mb-6">
          <h2 className="mb-1 font-semibold text-gray-900">Format</h2>
          <p className="text-gray-600">{event.format}</p>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="mb-8">
          <h2 className="mb-2 font-semibold text-gray-900">About This Event</h2>
          <div className="prose prose-sm text-gray-600 whitespace-pre-wrap">{event.description}</div>
        </div>
      )}

      {/* Venue */}
      {event.venue && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-1 font-semibold text-gray-900">Venue</h2>
          <Link href={`/listings/${event.venue.slug}`} className="font-medium text-green-700 hover:underline">
            {event.venue.name}
          </Link>
          {event.venue.address && (
            <p className="text-sm text-gray-500 mt-0.5">{event.venue.address}, {event.venue.city}, {event.venue.state}</p>
          )}
        </div>
      )}

      {/* Organizer */}
      <div className="mb-8 text-sm text-gray-500">
        Organized by <span className="font-medium text-gray-700">{event.organizer.name}</span>
      </div>

      {/* CTA */}
      {event.registrationUrl && !event.isCanceled && (
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl bg-green-700 px-8 py-3 text-base font-semibold text-white hover:bg-green-800 transition-colors"
        >
          Register Now →
        </a>
      )}
    </div>
  );
}
