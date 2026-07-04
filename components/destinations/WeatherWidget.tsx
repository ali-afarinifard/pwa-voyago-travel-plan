"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  RefreshCw,
  Sun,
} from "lucide-react";
import { useGetCurrentWeatherQuery } from "@/lib/redux/api/travelApi";
import { useAppSelector } from "@/lib/redux/hooks";
import type { WeatherSummary } from "@/lib/types/travel";

const WEATHER_ICONS: Record<string, typeof Sun> = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
};

interface WeatherWidgetProps {
  lat: number;
  lon: number;
  initialWeather: WeatherSummary | null;
}

export function WeatherWidget({ lat, lon, initialWeather }: WeatherWidgetProps) {
  const tempUnit = useAppSelector((state) => state.ui.tempUnit);
  const {
    data = initialWeather ?? undefined,
    isFetching,
    refetch,
  } = useGetCurrentWeatherQuery({ lat, lon });

  if (!data) {
    return (
      <div className="boarding-pass p-5 text-sm text-(--color-foreground)/60">
        Weather is unavailable right now.
      </div>
    );
  }

  const Icon = WEATHER_ICONS[data.icon] ?? Cloud;
  const temperature =
    tempUnit === "fahrenheit" ? (data.temperature * 9) / 5 + 32 : data.temperature;

  return (
    <div className="boarding-pass p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-primary)/15 text-(--color-primary)">
            <Icon size={26} aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold leading-tight text-(--color-foreground)">
              {Math.round(temperature)}°{tempUnit === "fahrenheit" ? "F" : "C"}
            </p>
            <p className="text-sm text-(--color-foreground)/60">{data.condition}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          aria-label="Refresh weather"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-(--color-foreground)/60 transition-colors hover:bg-(--color-surface-muted)"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} aria-hidden="true" />
        </button>
      </div>
      <p className="font-tabular mt-3 text-xs text-(--color-foreground)/45">
        Wind {Math.round(data.windspeed)} km/h · {data.timezone}
      </p>
    </div>
  );
}
