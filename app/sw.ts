/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import {
  CacheableResponsePlugin,
  CacheFirst,
  ExpirationPlugin,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * Runtime caching for the external travel data sources used by this app.
 * These run *before* Next.js's `defaultCache` rules so they take priority
 * for the hosts they match.
 */
const travelApiCaching: RuntimeCaching[] = [
  // REST Countries: flags, coordinates, population — effectively static.
  {
    matcher: ({ url }) => url.hostname === "restcountries.com",
    handler: new CacheFirst({
      cacheName: "voyago-rest-countries",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 7 }),
      ],
    }),
  },
  // Open-Meteo current weather — refresh in the background, serve cached
  // value instantly while offline or on a slow connection.
  {
    matcher: ({ url }) => url.hostname === "api.open-meteo.com",
    handler: new StaleWhileRevalidate({
      cacheName: "voyago-weather",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 60 * 30 }),
      ],
    }),
  },
  // Frankfurter exchange rates — change a few times a day at most.
  {
    matcher: ({ url }) => url.hostname === "api.frankfurter.app" || url.hostname === "api.frankfurter.dev",
    handler: new StaleWhileRevalidate({
      cacheName: "voyago-exchange-rates",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 6 }),
      ],
    }),
  },
  // OpenStreetMap tiles for the destination map — cache recently viewed
  // areas so the map stays usable offline.
  {
    matcher: ({ url }) => /tile\.openstreetmap\.org$/.test(url.hostname),
    handler: new CacheFirst({
      cacheName: "voyago-map-tiles",
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 14 }),
      ],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...travelApiCaching, ...defaultCache],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
