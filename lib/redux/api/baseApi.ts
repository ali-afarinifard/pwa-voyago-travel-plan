import { createApi } from "@reduxjs/toolkit/query/react";
import { hybridBaseQuery } from "./hybridBaseQuery";

/**
 * Single API slice for the whole app. Both REST and GraphQL endpoints
 * are injected into this slice (see countriesApi.ts, travelApi.ts) so
 * that caching, tag invalidation, and loading/error states all live in
 * one place — a deliberate "one data layer" architecture rather than
 * mixing RTK Query with a separate GraphQL client library.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: hybridBaseQuery,
  tagTypes: ["Country", "Continent", "CountryDetails", "Weather", "Currency"],
  endpoints: () => ({}),
});
