"use client";

import { Select } from "antd";
import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";
import type { Continent } from "@/lib/types/travel";

export type SortOrder = "az" | "za";

interface DestinationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  continent: string;
  onContinentChange: (value: string) => void;
  continents: Continent[];
  sort: SortOrder;
  onSortChange: (value: SortOrder) => void;
  resultCount: number;
}

export function DestinationFilters({
  search,
  onSearchChange,
  continent,
  onContinentChange,
  continents,
  sort,
  onSortChange,
  resultCount,
}: DestinationFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-sm">
          <span className="sr-only">Search destinations</span>
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-foreground)/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by country, capital, or region…"
            className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-(--color-foreground) placeholder:text-(--color-foreground)/40 focus:outline-none focus-visible:outline-2 focus-visible:outline-(--color-primary)"
          />
        </label>

        <Select
          value={continent}
          onChange={onContinentChange}
          aria-label="Filter by continent"
          className="w-full sm:w-48"
          options={[
            { value: "all", label: "All continents" },
            ...continents.map((c) => ({ value: c.code, label: c.name })),
          ]}
        />

        <Select
          value={sort}
          onChange={onSortChange}
          aria-label="Sort destinations"
          className="w-full sm:w-44"
          options={[
            {
              value: "az",
              label: (
                <span className="flex items-center gap-1.5">
                  <ArrowDownAZ size={14} aria-hidden="true" /> Name A–Z
                </span>
              ),
            },
            {
              value: "za",
              label: (
                <span className="flex items-center gap-1.5">
                  <ArrowUpAZ size={14} aria-hidden="true" /> Name Z–A
                </span>
              ),
            },
          ]}
        />
      </div>

      <p className="font-tabular shrink-0 text-sm text-(--color-foreground)/55">
        {resultCount} {resultCount === 1 ? "destination" : "destinations"}
      </p>
    </div>
  );
}
