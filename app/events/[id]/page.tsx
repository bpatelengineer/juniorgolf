import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import { EVENT_TYPES, formatDateRange, formatFee } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isPastDeadline(deadline: Date | null): boolean {
  return deadline !== null && deadline.getTime() < Date.now();
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const deadlinePassed = isPastDeadline(event.registrationDeadline);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/events" className="text-sm text-green-800 hover:underline">
        ← Back to Events
      </Link>

      <div className="mt-3 rounded-lg border border-stone-200 bg-white p-6">
        <div className="flex flex-wrap gap-1.5">
          <Badge color="green">{EVENT_TYPES[event.eventType]}</Badge>
          {event.tourAffiliation && <Badge>{event.tourAffiliation}</Badge>}
        </div>
        <h1 className="mt-2 text-2xl font-bold">{event.title}</h1>
        <p className="mt-1 text-stone-600">
          {formatDateRange(event.dateStart, event.dateEnd)} · {event.venueName},{" "}
          {event.city}, {event.state}
        </p>

        <p className="mt-4 text-stone-700 leading-relaxed">
          {event.description}
        </p>

        <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="font-medium text-stone-500">Age divisions</dt>
            <dd>{event.ageDivisions}</dd>
          </div>
          {event.format && (
            <div>
              <dt className="font-medium text-stone-500">Format</dt>
              <dd>{event.format}</dd>
            </div>
          )}
          <div>
            <dt className="font-medium text-stone-500">Entry fee</dt>
            <dd className="font-semibold">{formatFee(event.entryFee)}</dd>
          </div>
          <div>
            <dt className="font-medium text-stone-500">Organizer</dt>
            <dd>{event.organizerName}</dd>
          </div>
          <div>
            <dt className="font-medium text-stone-500">Location</dt>
            <dd>
              {event.venueName}, {event.address}, {event.city}, {event.state}
            </dd>
          </div>
          {event.registrationDeadline && (
            <div>
              <dt className="font-medium text-stone-500">
                Registration deadline
              </dt>
              <dd className={deadlinePassed ? "text-red-700 font-medium" : ""}>
                {event.registrationDeadline.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
                {deadlinePassed && " (closed)"}
              </dd>
            </div>
          )}
          {event.maxParticipants !== null && (
            <div>
              <dt className="font-medium text-stone-500">Field</dt>
              <dd>
                {event.spotsRemaining !== null
                  ? `${event.spotsRemaining} of ${event.maxParticipants} spots remaining`
                  : `Max ${event.maxParticipants} players`}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-md px-5 py-2.5 text-sm font-semibold text-white ${
              deadlinePassed
                ? "bg-stone-400 pointer-events-none"
                : "bg-green-800 hover:bg-green-900"
            }`}
            aria-disabled={deadlinePassed}
          >
            {deadlinePassed ? "Registration closed" : "Register ↗"}
          </a>
          <button
            type="button"
            className="rounded-md border border-green-800 px-5 py-2.5 text-sm font-semibold text-green-800 hover:bg-green-50"
          >
            ♡ Save
          </button>
        </div>
        <p className="mt-3 text-xs text-stone-500">
          Registration is handled by the organizer&apos;s site. In-platform
          registration arrives in Phase 2.
        </p>
      </div>
    </div>
  );
}
