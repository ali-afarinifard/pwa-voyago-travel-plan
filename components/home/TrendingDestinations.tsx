import Link from "next/link";
import { CountryCard } from "@/components/destinations/CountryCard";
import type { Country } from "@/lib/types/travel";

const TRENDING_CODES = ["JP", "IT", "FR", "TH", "BR", "AE", "GR", "MA"];

export function TrendingDestinations({ countries }: { countries: Country[] }) {
  const trending = TRENDING_CODES.map((code) =>
    countries.find((c) => c.code === code),
  ).filter((c): c is Country => Boolean(c));

  if (trending.length === 0) return null;

  return (
    <section aria-labelledby="trending-heading">
      <div className="flex items-end justify-between gap-4">
        <h2
          id="trending-heading"
          className="font-display text-2xl font-semibold text-(--color-foreground) sm:text-3xl"
        >
          Trending destinations
        </h2>
        <Link
          href="/destinations"
          className="shrink-0 text-sm font-medium text-(--color-primary) hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trending.map((country) => (
          <CountryCard key={country.code} country={country} />
        ))}
      </div>
    </section>
  );
}
