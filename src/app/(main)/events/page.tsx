"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EVENT_TYPE_LABELS } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { EventType } from "@prisma/client";

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All upcoming" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

const EVENT_TYPE_OPTIONS = [
  { value: "", label: "All types" },
  ...Object.entries(EVENT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const TYPE_BADGE: Record<EventType, "green" | "blue" | "yellow" | "purple" | "red" | "gray"> = {
  TOURNAMENT: "green",
  CLINIC: "blue",
  CAMP: "purple",
  LEAGUE: "yellow",
  SHOWCASE: "blue",
  SCRAMBLE: "green",
  QUALIFIER: "red",
  OTHER: "gray",
};

export default function EventsPage() {
  const { data: session } = useSession();
  const [eventType, setEventType] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [cityFilter, setCityFilter] = useState("");

  const now = new Date().toISOString();
  const weekOut = new Date(Date.now() + 7 * 86400000).toISOString();
  const monthOut = new Date(Date.now() + 30 * 86400000).toISOString();

  const { data, isLoading } = trpc.events.list.useQuery({
    eventType: (eventType as EventType) || undefined,
    city: cityFilter || undefined,
    dateFrom: now,
    dateTo: dateRange === "week" ? weekOut : dateRange === "month" ? monthOut : undefined,
  });

  const rsvpMutation = trpc.events.rsvp.useMutation();
  const utils = trpc.useUtils();

  const events = data?.items ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events & Tournaments</h1>
          <p className="mt-1 text-sm text-gray-500">Upcoming junior golf events in the DFW area</p>
        </div>
        {session?.user.role === "ORGANIZER" || session?.user.role === "COACH" || session?.user.role === "ADMIN" ? (
          <Link href="/dashboard/events/new" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
            + Post Event
          </Link>
        ) : null}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="w-44">
          <Select options={EVENT_TYPE_OPTIONS} value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="All types" />
        </div>
        <div className="w-40">
          <Select options={DATE_RANGE_OPTIONS} value={dateRange} onChange={(e) => setDateRange(e.target.value)} />
        </div>
        <div className="w-44">
          <Input placeholder="City…" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
        </div>
      </div>

      {/* Event list */}
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : events.length === 0
          ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-400">
              <p className="text-4xl mb-3">🏆</p>
              <p className="font-medium">No events found</p>
              <p className="text-sm mt-1">Try changing your filters</p>
            </div>
          )
          : events.map((ev) => (
            <div key={ev.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant={TYPE_BADGE[ev.eventType]}>{EVENT_TYPE_LABELS[ev.eventType]}</Badge>
                    {ev.tourAffiliation && <Badge variant="gray">{ev.tourAffiliation}</Badge>}
                  </div>
                  <h2 className="font-semibold text-gray-900 truncate">
                    <Link href={`/events/${ev.slug}`} className="hover:text-green-700">{ev.title}</Link>
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(ev.dateStart)}{ev.dateEnd ? ` – ${formatDate(ev.dateEnd)}` : ""} · {ev.city}, {ev.state}
                  </p>
                  {ev.ageDivisions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {ev.ageDivisions.map((d) => (
                        <span key={d} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">Ages {d}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {ev.entryFee !== null && ev.entryFee !== undefined && (
                    <p className="font-semibold text-gray-900">{ev.entryFee === 0 ? "Free" : formatCurrency(ev.entryFee)}</p>
                  )}
                  {ev.spotsRemaining !== null && ev.spotsRemaining !== undefined && (
                    <p className="text-xs text-gray-400 mt-0.5">{ev.spotsRemaining} spots left</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Link href={`/events/${ev.slug}`} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      Details
                    </Link>
                    {session?.user && (
                      <button
                        onClick={() => rsvpMutation.mutate({ eventId: ev.id }, { onSuccess: () => utils.events.list.invalidate() })}
                        className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800"
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
