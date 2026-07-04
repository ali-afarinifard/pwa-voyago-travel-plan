"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CountryCard } from "./CountryCard";
import { DestinationFilters, type SortOrder } from "./DestinationFilters";
import { useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";
import type { Continent, Country } from "@/lib/types/travel";

const PAGE_SIZE = 16;

interface DestinationExplorerProps {
  countries: Country[];
  continents: Continent[];
  initialQuery?: string;
}

function matches(country: Country, query: string) {
  const haystack = [country.name, country.native, country.capital ?? ""]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function DestinationExplorer({
  countries,
  continents,
  initialQuery = "",
}: DestinationExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialQuery);
  const [continent, setContinent] = useState(
    searchParams.get("continent") ?? "all",
  );
  const [sort, setSort] = useState<SortOrder>(
    (searchParams.get("sort") as SortOrder) ?? "az",
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (continent !== "all") params.set("continent", continent);
      if (sort !== "az") params.set("sort", sort);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, continent, sort, pathname, router]);

  // Defer the search term so typing stays responsive while ~250 cards re-filter.
  const deferredSearch = useDeferredValue(search);

  const filtered = useMemo(() => {
    let result = countries;
    if (continent !== "all") {
      result = result.filter((c) => c.continent.code === continent);
    }
    if (deferredSearch.trim()) {
      result = result.filter((c) => matches(c, deferredSearch.trim()));
    }
    result = [...result].sort((a, b) =>
      sort === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
    return result;
  }, [countries, continent, deferredSearch, sort]);

  // enters the viewport, shows a loading state, then reveals the next 16 items.
  const { visibleCount, hasMore, isLoadingMore, sentinelRef } =
    useInfiniteScroll({
      total: filtered.length,
      pageSize: PAGE_SIZE,
      rootMargin: "0px",
      minLoadingMs: 400,
    });

  const visibleItems = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  return (
    <div className="flex flex-col gap-6">
      <DestinationFilters
        search={search}
        onSearchChange={setSearch}
        continent={continent}
        onContinentChange={setContinent}
        continents={continents}
        sort={sort}
        onSortChange={setSort}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-border py-16 text-center">
          <p className="font-display text-lg font-semibold text-(--color-foreground)">
            No destinations match your filters
          </p>
          <p className="mt-1 text-sm text-(--color-foreground)/60">
            Try a different search term or continent.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleItems.map((country) => (
              <CountryCard key={country.code} country={country} />
            ))}
          </div>

          {hasMore && (
            <>
              {/* Sentinel: invisible element placed right after the currently visible
                  cards. IntersectionObserver fires loadMore() only when the user has
                  actually scrolled to the end of the rendered list. */}
              <div
                ref={sentinelRef}
                aria-hidden="true"
                className="h-px w-full"
              />

              {isLoadingMore && (
                <div
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  role="status"
                  aria-label="Loading more destinations"
                >
                  {Array.from({
                    length: Math.min(PAGE_SIZE, filtered.length - visibleCount),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="h-48 animate-pulse rounded-card bg-surface"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {!hasMore && (
            <p className="py-4 text-center text-sm text-(--color-foreground)/45">
              You’ve reached the end — {filtered.length}{" "}
              {filtered.length === 1 ? "destination" : "destinations"}
            </p>
          )}
        </>
      )}
    </div>
  );
}
