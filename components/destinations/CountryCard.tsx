import { memo } from "react";
import Link from "next/link";
import { ArrowUpRight, Languages, MapPin } from "lucide-react";
import type { Country } from "@/lib/types/travel";

export const CountryCard = memo(function CountryCard({
  country,
}: {
  country: Country;
}) {
  return (
    <Link
      href={`/destinations/${country.code.toLowerCase()}`}
      className="boarding-pass group flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5"
      style={{ contentVisibility: "auto", containIntrinsicSize: "260px" }}
    >
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-4xl leading-none" aria-hidden="true">
            {country.emoji}
          </span>
          <ArrowUpRight
            size={18}
            className="text-(--color-foreground)/30 transition-colors group-hover:text-(--color-primary)"
            aria-hidden="true"
          />
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold leading-tight text-(--color-foreground)">
            {country.name}
          </h3>
          {country.native !== country.name && (
            <p className="text-sm text-(--color-foreground)/55">
              {country.native}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-1.5 text-sm text-(--color-foreground)/70">
          {country.capital && (
            <span className="flex items-center gap-1.5">
              <MapPin
                size={14}
                className="text-(--color-secondary)"
                aria-hidden="true"
              />
              {country.capital}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Languages
              size={14}
              className="text-(--color-secondary)"
              aria-hidden="true"
            />
            {country.languages.map((l) => l.name).join(", ")}
          </span>
        </div>
      </div>

      <hr className="stub-divider mx-5" />

      <div className="flex items-center justify-between px-5 py-3 font-tabular text-xs text-(--color-foreground)/60">
        <span>{country.continent.name}</span>
        <span>
          {country.code}
          {country.currency ? ` · ${country.currency}` : ""}
        </span>
      </div>
    </Link>
  );
});
