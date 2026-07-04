"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useGetExchangeRatesQuery } from "@/lib/redux/api/travelApi";
import { useAppSelector } from "@/lib/redux/hooks";
import type { ExchangeRatesResponse } from "@/lib/types/travel";

interface CurrencyConverterProps {
  destinationCurrency?: string | null;
  initialRates: ExchangeRatesResponse | null;
}

export function CurrencyConverter({
  destinationCurrency,
  initialRates,
}: CurrencyConverterProps) {
  const base = useAppSelector((state) => state.ui.currencyBase);
  const { data = initialRates ?? undefined } = useGetExchangeRatesQuery({
    base,
  });
  const [amount, setAmount] = useState(100);

  if (!destinationCurrency) return null;
  if (destinationCurrency === base) return null;

  const rate = data?.rates[destinationCurrency];
  if (!data || !rate) {
    return (
      <div className="boarding-pass p-5 text-sm text-(--color-foreground)/60">
        Exchange rate unavailable right now.
      </div>
    );
  }

  const converted = amount * rate;

  return (
    <div className="boarding-pass p-5">
      <h3 className="font-display text-base font-semibold text-(--color-foreground)">
        Currency converter
      </h3>
      <div className="mt-4 flex items-center gap-3">
        <label className="flex-1">
          <span className="text-xs font-medium uppercase tracking-wide text-(--color-foreground)/50">
            {base}
          </span>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={amount}
            onChange={(e) =>
              setAmount(Math.max(0, Number(e.target.value) || 0))
            }
            className="font-tabular mt-1 w-full rounded-xl border border-border bg-(--color-background) px-3 py-2 text-lg text-(--color-foreground) focus:outline-none focus-visible:outline-2 focus-visible:outline-(--color-primary)"
          />
        </label>
        <ArrowLeftRight
          size={18}
          className="mt-5 text-(--color-secondary)"
          aria-hidden="true"
        />
        <div className="flex-1">
          <span className="text-xs font-medium uppercase tracking-wide text-(--color-foreground)/50">
            {destinationCurrency}
          </span>
          <p className="font-tabular mt-1 truncate rounded-xl border border-border bg-(--color-surface-muted) px-3 py-2 text-lg text-(--color-foreground)">
            {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      <p className="font-tabular mt-3 text-xs text-(--color-foreground)/45">
        1 {base} = {rate.toFixed(4)} {destinationCurrency} · rates as of{" "}
        {data.date}
      </p>
    </div>
  );
}
