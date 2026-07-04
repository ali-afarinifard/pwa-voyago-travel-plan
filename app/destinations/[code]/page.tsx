import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StatChip } from "@/components/ui/StatChip";
import { WeatherWidget } from "@/components/destinations/WeatherWidget";
import { CurrencyConverter } from "@/components/destinations/CurrencyConverter";
import { DestinationMapLoader } from "@/components/destinations/DestinationMapLoader";
import type { CountryDetails } from "@/lib/types/travel";
import {
  getAllCountries,
  getCountry,
  getCountryDetails,
  getExchangeRates,
  getWeather,
} from "@/lib/api/server";

interface DestinationPageProps {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  const countries = await getAllCountries();
  return countries.map((country) => ({ code: country.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { code } = await params;
  const country = await getCountry(code.toUpperCase());

  if (!country) {
    return { title: "Destination not found" };
  }

  const title = `${country.name} travel guide`;
  const description = `Plan a trip to ${country.name}: live weather, currency conversion${
    country.currency ? ` to ${country.currency}` : ""
  }, and an interactive map centered on ${country.capital ?? country.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/destinations/${code.toLowerCase()}` },
    openGraph: { title, description },
  };
}

export default async function DestinationPage({
  params,
}: DestinationPageProps) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  const country = await getCountry(upperCode);
  if (!country) notFound();

  const detailsRaw = await getCountryDetails(upperCode);
  // Normalise: REST Countries v3 may return an array or a plain object
  const details: CountryDetails | null = await getCountryDetails(upperCode);
  const lat = details?.latlng?.[0];
  const lon = details?.latlng?.[1];
  const hasCoordinates = typeof lat === "number" && typeof lon === "number";

  const [weather, rates] = await Promise.all([
    hasCoordinates ? getWeather(lat, lon) : Promise.resolve(null),
    country.currency ? getExchangeRates("USD") : Promise.resolve(null),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: country.name,
    description: `${country.name} (${country.native}) in ${country.continent.name}. Capital: ${
      country.capital ?? "—"
    }. Currency: ${country.currency ?? "—"}.`,
    ...(hasCoordinates
      ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lon } }
      : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Explore",
        item: "/destinations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: country.name,
        item: `/destinations/${code.toLowerCase()}`,
      },
    ],
  };

  return (
    <Container className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {details?.flagPng ? (
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-border">
              <Image
                src={details.flagPng}
                alt={details.flagAlt ?? `Flag of ${country.name}`}
                fill
                sizes="96px"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <span className="text-6xl" aria-hidden="true">
              {country.emoji}
            </span>
          )}
          <div>
            <h1 className="font-display text-3xl font-semibold leading-tight text-(--color-foreground) sm:text-4xl">
              {country.name}
            </h1>
            {country.native !== country.name && (
              <p className="text-(--color-foreground)/55">{country.native}</p>
            )}
          </div>
        </div>

        <Link
          href={`/trips/new?destination=${country.code}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-(--color-primary) px-5 py-2.5 text-sm font-semibold text-(--color-primary-foreground) transition-opacity hover:opacity-90"
        >
          <Send size={16} aria-hidden="true" />
          Plan a trip here
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5 text-sm">
        <StatChip label="Continent" value={country.continent.name} />
        {country.capital && (
          <StatChip label="Capital" value={country.capital} />
        )}
        <StatChip
          label="Languages"
          value={country.languages.map((l) => l.name).join(", ")}
        />
        {country.currency && (
          <StatChip label="Currency" value={country.currency} />
        )}
        {details?.subregion && (
          <StatChip label="Subregion" value={details.subregion} />
        )}
        {details?.population && (
          <StatChip
            label="Population"
            value={details.population.toLocaleString()}
          />
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {hasCoordinates ? (
            <DestinationMapLoader lat={lat} lon={lon} label={country.name} />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-card border border-border bg-(--color-surface-muted) text-sm text-(--color-foreground)/50">
              Map unavailable for this destination
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {hasCoordinates && (
            <WeatherWidget lat={lat} lon={lon} initialWeather={weather} />
          )}
          <CurrencyConverter
            destinationCurrency={country.currency}
            initialRates={rates}
          />
        </div>
      </div>
    </Container>
  );
}
