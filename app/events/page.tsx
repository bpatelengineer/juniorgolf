import Link from "next/link";
import { Suspense } from "react";
import Badge from "@/components/Badge";
import EventFilterBar from "@/components/EventFilterBar";
import { EVENT_TYPES, formatDateRange, formatFee } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function deadlineBadge(deadline: Date | null) {
  if (!deadline) return null;
  const days = Math.ceil((deadline.getTime() - Date.now()) / 86_400_000);
  if (days < 0) return <Badge color="stone">Registration closed</Badge>;
  if (days <= 3) return <Badge color="amber">⏰ Closes in {days}d</Badge>;
  return null;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; skill?: string; free?: string }>;
}) {
  const params = await searchParams;

  const events = await prisma.event.findMany({
    where: {
      dateStart: { gte: new Date() },
      ...(params.type ? { eventType: params.type } : {}),
      ...(params.skill ? { skillLevel: params.skill } : {}),
      ...(params.free === "1" ? { entryFee: 0 } : {}),
    },
    orderBy: { dateStart: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold">Upcoming events</h1>
      <p className="mt-1 text-sm text-stone-600">
        Tournaments, clinics, camps &amp; leagues near Dallas–Fort Worth
      </p>

      <div className="mt-4">
        <Suspense>
          <EventFilterBar />
        </Suspense>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {events.length === 0 && (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
            <p className="font-medium">No upcoming events match.</p>
            <p className="mt-1 text-sm text-stone-600">Try fewer filters.</p>
          </div>
        )}
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block rounded-lg border border-stone-200 bg-white p-4 hover:border-green-700 hover:shadow-sm transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-center shrink-0">
                  <div className="text-xs font-medium text-green-800 uppercase">
                    {event.dateStart.toLocaleDateString("en-US", { month: "short" })}
                  </div>
                  <div className="text-xl font-bold text-green-900 leading-none">
                    {event.dateStart.getDate()}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="mt-0.5 text-sm text-stone-600">
                    {formatDateRange(event.dateStart, event.dateEnd)} ·{" "}
                    {event.venueName}, {event.city}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge color="green">{EVENT_TYPES[event.eventType]}</Badge>
                    <Badge color="blue">{event.ageDivisions}</Badge>
                    {event.tourAffiliation && (
                      <Badge>{event.tourAffiliation}</Badge>
                    )}
                    {deadlineBadge(event.registrationDeadline)}
                    {event.spotsRemaining !== null &&
                      event.spotsRemaining <= 10 && (
                        <Badge color="amber">
                          {event.spotsRemaining} spots left
                        </Badge>
                      )}
                  </div>
                </div>
              </div>
              <span className="font-semibold text-green-900">
                {formatFee(event.entryFee)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
