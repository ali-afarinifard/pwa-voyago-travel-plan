import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DestinationExplorer } from "@/components/destinations/DestinationExplorer";
import { getAllCountries, getContinents } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Explore destinations",
  description:
    "Browse 250+ countries with details on capitals, languages, and currencies. Filter by continent and search to plan your next trip.",
};

interface DestinationsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const [countries, continents] = await Promise.all([getAllCountries(), getContinents()]);
  const { q } = await searchParams;

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-(--color-foreground) sm:text-4xl">
          Explore destinations
        </h1>
        <p className="mt-2 text-(--color-foreground)/65">
          Search and filter every country, then open a destination for live weather, currency
          conversion, and an interactive map.
        </p>
      </div>

      <DestinationExplorer countries={countries} continents={continents} initialQuery={q} />
    </Container>
  );
}
