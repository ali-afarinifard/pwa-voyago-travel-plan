/**
 * Domain types shared across the data layer (RTK Query endpoints,
 * Redux slices) and UI components.
 */

// Countries GraphQL API (https://countries.trevorblades.com/graphql)

export interface Language {
  code: string;
  name: string;
  native?: string;
  rtl?: boolean;
}

export interface Continent {
  code: string;
  name: string;
}

export interface Country {
  code: string;
  name: string;
  native: string;
  capital?: string | null;
  currency?: string | null;
  emoji: string;
  phone?: string;
  continent: Continent;
  languages: Language[];
}

// REST Countries API (https://restcountries.com)

export interface CountryDetails {
  latlng: [number, number] | null;
  flagPng: string | null;
  flagAlt: string | null;
  population: number | null;
  subregion: string | null;
}

// Open-Meteo weather API (https://open-meteo.com)

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
}

export interface WeatherSummary {
  temperature: number;
  windspeed: number;
  weatherCode: number;
  condition: string;
  icon: string;
  observedAt: string;
  timezone: string;
}

// Frankfurter currency API (https://www.frankfurter.app)

export interface ExchangeRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Trip planner domain model (stored locally, offline-first)

export type ActivityCategory =
  | "sightseeing"
  | "food"
  | "transport"
  | "lodging"
  | "activity"
  | "other";

export interface TripActivity {
  id: string;
  title: string;
  time?: string;
  note?: string;
  cost?: number;
  category: ActivityCategory;
}

export interface TripDay {
  id: string;
  date: string;
  activities: TripActivity[];
}

export type SyncStatus = "synced" | "pending" | "offline";

export interface Trip {
  id: string;
  destinationCode: string;
  destinationName: string;
  destinationEmoji: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  days: TripDay[];
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

// Offline mutation queue (background sync)

export type OfflineMutationKind = "trip:create" | "trip:update" | "trip:delete";

export interface OfflineQueueItem {
  id: string;
  kind: OfflineMutationKind;
  payload: unknown;
  createdAt: string;
}
