"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { Badge } from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EVENT_TYPE_LABELS } from "@/types";
import { formatDate } from "@/lib/utils";
import type { EventType } from "@prisma/client";

const TYPE_BADGE: Record<EventType, "green" | "blue" | "yellow" | "purple" | "red" | "gray"> = {
  TOURNAMENT: "green", CLINIC: "blue", CAMP: "purple", LEAGUE: "yellow",
  SHOWCASE: "blue", SCRAMBLE: "green", QUALIFIER: "red", OTHER: "gray",
};

export default function DashboardEventsPage() {
  const { data: events, isLoading } = trpc.events.getOrganizerEvents.useQuery();
  const publishMutation = trpc.events.publish.useMutation();
  const utils = trpc.useUtils();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">My Events</h1>
        <Link href="/dashboard/events/new" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
          + New Event
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : events?.length === 0
          ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🏆</p>
              <p className="font-medium">No events yet</p>
              <p className="text-sm mt-1"><Link href="/dashboard/events/new" className="text-green-700 hover:underline">Create your first event</Link></p>
            </div>
          )
          : events?.map((ev) => (
            <div key={ev.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h2 className="font-semibold text-gray-900 truncate">{ev.title}</h2>
                  <Badge variant={TYPE_BADGE[ev.eventType]}>{EVENT_TYPE_LABELS[ev.eventType]}</Badge>
                  {!ev.isPublished && <Badge variant="yellow">Draft</Badge>}
                  {ev.isCanceled && <Badge variant="red">Canceled</Badge>}
                </div>
                <p className="text-sm text-gray-500">{formatDate(ev.dateStart)} · {ev.city}, {ev.state}</p>
                <p className="text-xs text-gray-400 mt-0.5">{ev._count.rsvps} RSVPs</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!ev.isPublished && !ev.isCanceled && (
                  <button
                    onClick={() => publishMutation.mutate({ id: ev.id }, { onSuccess: () => utils.events.getOrganizerEvents.invalidate() })}
                    className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800"
                  >
                    Publish
                  </button>
                )}
                <Link href={`/events/${ev.slug}`} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  View
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
