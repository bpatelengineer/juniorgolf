"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc/client";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { EVENT_TYPE_LABELS, SKILL_LEVEL_LABELS } from "@/types";
import type { EventType, SkillLevel } from "@prisma/client";

const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }));
const SKILL_OPTIONS = Object.entries(SKILL_LEVEL_LABELS).map(([v, l]) => ({ value: v, label: l }));

const AGE_DIVISIONS = ["7-9", "10-11", "12-13", "14-15", "16-18", "Open"];

export default function NewEventPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({
    title: "", description: "", eventType: "TOURNAMENT" as EventType,
    city: "", state: "TX", address: "",
    dateStart: "", dateEnd: "", registrationDeadline: "",
    ageDivisions: [] as string[], skillLevels: [] as SkillLevel[],
    entryFee: "", maxParticipants: "", registrationUrl: "",
    format: "", tourAffiliation: "",
  });
  const [error, setError] = useState("");

  const createEvent = trpc.events.create.useMutation({
    onSuccess: () => router.push("/dashboard/events"),
    onError: (e) => setError(e.message),
  });

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleArr<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  if (!session?.user || !["ORGANIZER", "COACH", "ADMIN"].includes(session.user.role)) {
    return <div className="py-20 text-center text-gray-500">You must be an organizer or coach to post events.</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create New Event</h1>

      <div className="space-y-5">
        <Input label="Event Title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. DFW Junior Open" />

        <Select label="Event Type" options={EVENT_TYPE_OPTIONS} value={form.eventType} onChange={(e) => set("eventType", e.target.value)} />

        <Textarea label="Description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the event…" />

        <div className="grid grid-cols-2 gap-4">
          <Input label="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
          <Input label="State" value={form.state} onChange={(e) => set("state", e.target.value)} maxLength={2} />
        </div>

        <Input label="Address (optional)" value={form.address} onChange={(e) => set("address", e.target.value)} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date & Time" type="datetime-local" value={form.dateStart} onChange={(e) => set("dateStart", e.target.value)} />
          <Input label="End Date (optional)" type="datetime-local" value={form.dateEnd} onChange={(e) => set("dateEnd", e.target.value)} />
        </div>

        <Input label="Registration Deadline (optional)" type="datetime-local" value={form.registrationDeadline} onChange={(e) => set("registrationDeadline", e.target.value)} />

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Age Divisions</p>
          <div className="flex flex-wrap gap-2">
            {AGE_DIVISIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => set("ageDivisions", toggleArr(form.ageDivisions, d))}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${form.ageDivisions.includes(d) ? "border-green-600 bg-green-600 text-white" : "border-gray-300 text-gray-600 hover:border-green-400"}`}
              >
                Ages {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Skill Levels</p>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => set("skillLevels", toggleArr(form.skillLevels, value as SkillLevel))}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${form.skillLevels.includes(value as SkillLevel) ? "border-green-600 bg-green-600 text-white" : "border-gray-300 text-gray-600 hover:border-green-400"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Entry Fee ($, 0 for free)" type="number" min={0} value={form.entryFee} onChange={(e) => set("entryFee", e.target.value)} placeholder="0" />
          <Input label="Max Participants" type="number" min={1} value={form.maxParticipants} onChange={(e) => set("maxParticipants", e.target.value)} />
        </div>

        <Input label="Registration URL (external)" type="url" value={form.registrationUrl} onChange={(e) => set("registrationUrl", e.target.value)} placeholder="https://…" />
        <Input label="Format (e.g. Stroke Play)" value={form.format} onChange={(e) => set("format", e.target.value)} />
        <Input label="Tour Affiliation (e.g. PGA Jr. League)" value={form.tourAffiliation} onChange={(e) => set("tourAffiliation", e.target.value)} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={() => {
            if (!form.title || !form.city || !form.dateStart) { setError("Title, city, and start date are required."); return; }
            createEvent.mutate({
              title: form.title,
              description: form.description || undefined,
              eventType: form.eventType,
              city: form.city,
              state: form.state,
              address: form.address || undefined,
              dateStart: new Date(form.dateStart).toISOString(),
              dateEnd: form.dateEnd ? new Date(form.dateEnd).toISOString() : undefined,
              registrationDeadline: form.registrationDeadline ? new Date(form.registrationDeadline).toISOString() : undefined,
              ageDivisions: form.ageDivisions,
              skillLevels: form.skillLevels,
              entryFee: form.entryFee ? Math.round(parseFloat(form.entryFee) * 100) : undefined,
              maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
              registrationUrl: form.registrationUrl || undefined,
              format: form.format || undefined,
              tourAffiliation: form.tourAffiliation || undefined,
            });
          }}
          disabled={createEvent.isPending}
          className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {createEvent.isPending ? "Creating…" : "Create Event (Save as Draft)"}
        </button>
      </div>
    </div>
  );
}
