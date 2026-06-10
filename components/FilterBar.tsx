"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Option = { value: string; label: string };

const FIELDS: { name: string; label: string; options: Option[] }[] = [
  {
    name: "type",
    label: "Resource type",
    options: [
      { value: "", label: "All types" },
      { value: "course", label: "Golf courses" },
      { value: "range", label: "Driving ranges" },
      { value: "instructor", label: "Instructors" },
      { value: "academy", label: "Academies" },
      { value: "camp", label: "Camps" },
    ],
  },
  {
    name: "age",
    label: "Child's age",
    options: [
      { value: "", label: "Any age" },
      ...Array.from({ length: 15 }, (_, i) => {
        const age = i + 4;
        return { value: String(age), label: `${age} years old` };
      }),
    ],
  },
  {
    name: "skill",
    label: "Skill level",
    options: [
      { value: "", label: "Any skill level" },
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "competitive", label: "Competitive" },
    ],
  },
  {
    name: "price",
    label: "Price",
    options: [
      { value: "", label: "Any price" },
      { value: "1", label: "$ Budget" },
      { value: "2", label: "$$ Mid-range" },
      { value: "3", label: "$$$ Premium" },
    ],
  },
  {
    name: "radius",
    label: "Distance",
    options: [
      { value: "", label: "Any distance" },
      { value: "5", label: "Within 5 mi" },
      { value: "10", label: "Within 10 mi" },
      { value: "25", label: "Within 25 mi" },
      { value: "50", label: "Within 50 mi" },
    ],
  },
];

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(name, value);
      else params.delete(name);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const hasFilters = FIELDS.some((f) => searchParams.get(f.name)) || searchParams.get("q");

  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="flex flex-col gap-1 text-xs font-medium text-stone-600 grow sm:grow-0">
        Search
        <input
          type="search"
          placeholder="Name or city…"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => setParam("q", e.target.value)}
          className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-green-700"
        />
      </label>
      {FIELDS.map((field) => (
        <label
          key={field.name}
          className="flex flex-col gap-1 text-xs font-medium text-stone-600"
        >
          {field.label}
          <select
            value={searchParams.get(field.name) ?? ""}
            onChange={(e) => setParam(field.name, e.target.value)}
            className="rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-700"
          >
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      {hasFilters && (
        <button
          onClick={() => router.replace(pathname, { scroll: false })}
          className="text-sm text-green-800 underline underline-offset-2 py-1.5"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
