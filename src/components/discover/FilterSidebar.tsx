"use client";

import { ListingType, SkillLevel, PriceTier } from "@prisma/client";
import { LISTING_TYPE_LABELS, SKILL_LEVEL_LABELS, PRICE_TIER_LABELS } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export interface FilterState {
  query: string;
  types: ListingType[];
  skillLevels: SkillLevel[];
  priceTiers: PriceTier[];
  ageMin: string;
  ageMax: string;
  radiusMiles: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const RADIUS_OPTIONS = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
];

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${active ? "border-green-600 bg-green-600 text-white" : "border-gray-300 text-gray-600 hover:border-green-400"}`}
    >
      {label}
    </button>
  );
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-5">
      <Input
        label="Search"
        placeholder="Name or city…"
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
        leftIcon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" /></svg>}
      />

      <Select
        label="Radius"
        options={RADIUS_OPTIONS}
        value={String(filters.radiusMiles)}
        onChange={(e) => onChange({ ...filters, radiusMiles: Number(e.target.value) })}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Type</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(LISTING_TYPE_LABELS).map(([k, label]) => (
            <Toggle
              key={k}
              label={label}
              active={filters.types.includes(k as ListingType)}
              onClick={() => onChange({ ...filters, types: toggleItem(filters.types, k as ListingType) })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Skill Level</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SKILL_LEVEL_LABELS).map(([k, label]) => (
            <Toggle
              key={k}
              label={label}
              active={filters.skillLevels.includes(k as SkillLevel)}
              onClick={() => onChange({ ...filters, skillLevels: toggleItem(filters.skillLevels, k as SkillLevel) })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Price</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRICE_TIER_LABELS).map(([k, label]) => (
            <Toggle
              key={k}
              label={label}
              active={filters.priceTiers.includes(k as PriceTier)}
              onClick={() => onChange({ ...filters, priceTiers: toggleItem(filters.priceTiers, k as PriceTier) })}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Age (min)"
          type="number"
          min={0}
          max={18}
          placeholder="5"
          value={filters.ageMin}
          onChange={(e) => onChange({ ...filters, ageMin: e.target.value })}
        />
        <Input
          label="Age (max)"
          type="number"
          min={0}
          max={18}
          placeholder="18"
          value={filters.ageMax}
          onChange={(e) => onChange({ ...filters, ageMax: e.target.value })}
        />
      </div>

      <button
        type="button"
        className="text-sm text-gray-400 hover:text-red-500 underline"
        onClick={() =>
          onChange({ query: "", types: [], skillLevels: [], priceTiers: [], ageMin: "", ageMax: "", radiusMiles: 25 })
        }
      >
        Clear all filters
      </button>
    </aside>
  );
}
