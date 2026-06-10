"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TYPE_OPTIONS = [
  { value: "", label: "All event types" },
  { value: "tournament", label: "Tournaments" },
  { value: "clinic", label: "Clinics" },
  { value: "league", label: "Leagues" },
  { value: "camp", label: "Camps" },
  { value: "showcase", label: "Showcases" },
  { value: "scramble", label: "Scrambles" },
  { value: "qualifier", label: "Qualifiers" },
];

const SKILL_OPTIONS = [
  { value: "", label: "Any skill level" },
  { value: "beginner", label: "Beginner" },
  { value: "competitive", label: "Competitive" },
  { value: "all", label: "Open to all" },
];

export default function EventFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
        Event type
        <select
          value={searchParams.get("type") ?? ""}
          onChange={(e) => setParam("type", e.target.value)}
          className="rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
        Skill level
        <select
          value={searchParams.get("skill") ?? ""}
          onChange={(e) => setParam("skill", e.target.value)}
          className="rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          {SKILL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-stone-700 pb-2">
        <input
          type="checkbox"
          checked={searchParams.get("free") === "1"}
          onChange={(e) => setParam("free", e.target.checked ? "1" : "")}
          className="accent-green-800"
        />
        Free events only
      </label>
    </div>
  );
}
