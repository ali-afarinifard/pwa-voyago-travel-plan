# Voyago

**Travel explorer & offline trip planner — a Progressive Web App built with Next.js 16**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PWA](https://img.shields.io/badge/PWA-Serwist-5A0FC8?logo=pwa&logoColor=white)](https://serwist.pages.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Voyago lets you explore destinations worldwide — with live weather and exchange rates — and build a day‑by‑day trip itinerary that keeps working with no internet connection at all. It's built as a frontend portfolio piece, so the emphasis throughout is on architecture and engineering decisions, not just shipping features.

**[Live demo →](#)** &nbsp;·&nbsp; **[Repository](https://github.com/ali-afarinifard/voyago-travel-plan)**

<!--
  TODO: replace the placeholders above/below once deployed.
  A short screen recording (GIF/MP4) of: browsing destinations → dragging an
  activity between days → toggling the browser offline → reloading the page,
  does more to sell this project than any paragraph of text below it.
-->

---

## Why this project exists

Most portfolio apps stop at "fetch some data and render a list." Voyago was built to answer a more interesting question: **what does it take for a data-heavy app to keep working when the network doesn't?** That constraint touches almost every layer of the stack — state management, caching, service workers, and API design all have to cooperate.

A few decisions worth a reviewer's attention:

| Concern | Approach |
|---|---|
| One data layer, two protocols | A custom `hybridBaseQuery` lets a single RTK Query `createApi` instance serve both REST and GraphQL endpoints, with unified error handling and cache tags — see [`lib/redux/api/hybridBaseQuery.ts`](./lib/redux/api/hybridBaseQuery.ts) |
| Real, working offline support | A Serwist service worker with **per-source caching strategies** (see below), not a generic "cache everything" fallback |
| Offline-first persistence | Trips are written straight to IndexedDB via `redux-persist` + `localforage`, so they survive reloads and work with zero backend |
| Zero backend | Every data source is a free, keyless public API — the entire app runs from static hosting |
| SEO & metadata | `generateMetadata`, JSON-LD, dynamic OG images, ISR, `sitemap.ts`, `robots.ts` |
| Accessibility | Skip-to-content link, `aria-*` on interactive elements, keyboard-operable drag-and-drop, visible focus rings |

---

## Features

- 🌍 **Explore destinations** — filterable grid of every country, backed by a GraphQL API, with flags/coordinates/population from a REST source and current weather layered on top
- 🗺️ **Interactive maps** — Leaflet, lazy-loaded so it never blocks the initial page load
- 💱 **Live currency conversion** — daily exchange rates, cached to stay usable offline
- 🧳 **Drag-and-drop itinerary board** — plan a trip day by day, reorder or move activities between days with `@dnd-kit` (mouse, touch, and keyboard)
- 📶 **True offline mode** — install the app, go offline, and previously visited destinations, weather, exchange rates, map tiles, and your saved trips are all still there
- 🎨 **Custom design system** — a "map & boarding pass" visual identity, CSS custom properties mirrored into Ant Design's theme tokens
- 🌗 **Light/dark theme** with no flash-of-wrong-theme on load

---

## How the offline layer actually works

This is the part most "PWA" side projects fake with a copy-pasted service worker, so here's the real breakdown. `app/sw.ts` defines **per-source strategies** instead of one blanket rule:

| Source | Strategy | Reasoning |
|---|---|---|
| REST Countries (flags, coordinates) | `CacheFirst`, 7-day expiry | Effectively static data |
| Open-Meteo (weather) | `StaleWhileRevalidate`, 30-min expiry | Show a cached value instantly, refresh quietly in the background |
| Frankfurter (exchange rates) | `StaleWhileRevalidate`, 6-hour expiry | Changes a few times a day at most |
| OpenStreetMap tiles | `CacheFirst`, 14-day expiry | Keeps recently viewed map areas usable offline |
| Everything else (app shell, pages) | Serwist's Next.js defaults | Battle-tested precaching for the app shell |

Trip data never touches the network layer at all — trips, days, and activities are Redux state persisted directly to **IndexedDB**, so creating or editing an itinerary works identically online or offline.

> **Note on `next build`:** Serwist doesn't yet have stable Turbopack support ([serwist/serwist#54](https://github.com/serwist/serwist/issues/54)), so the production build runs on Webpack (`next build --webpack`) while `next dev` still uses Turbopack for fast local iteration. This is a deliberate, documented trade-off — see [`package.json`](./package.json).

### Roadmap
- [ ] Wire the existing `offlineQueue` Redux slice (already IndexedDB-persisted, currently unused) up to a real mutation-sync flow once/if a write-capable backend is introduced
- [ ] Playwright coverage for the offline install → go offline → reload flow

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router, Server Components, ISR) |
| Language | **TypeScript 5** (strict mode) |
| State & data | **Redux Toolkit 2** · **RTK Query** (hybrid REST/GraphQL base query) · **redux-persist** → IndexedDB |
| UI | **Tailwind CSS v4** · **Ant Design 6** |
| Maps | **Leaflet** / **react-leaflet** (lazy-loaded) |
| Drag & drop | **@dnd-kit** |
| PWA | **Serwist** (Workbox's actively maintained successor) |
| Fonts | Fraunces · Manrope · JetBrains Mono |

## Data sources

Every source below is public and requires no API key — the app has no backend of its own.

| Source | Used for |
|---|---|
| [countries.trevorblades.com](https://countries.trevorblades.com/graphql) | GraphQL — countries, continents, languages |
| [restcountries.com](https://restcountries.com) | REST — flags, coordinates, population |
| [open-meteo.com](https://open-meteo.com) | REST — current weather |
| [frankfurter.dev](https://frankfurter.dev) | REST — daily exchange rates |
| OpenStreetMap | Map tiles (cached by the service worker) |

---

## Getting started

```bash
git clone https://github.com/ali-afarinifard/voyago-travel-plan.git
cd voyago-travel-plan
npm install
cp .env.local.example .env.local
npm run dev
```

Production build (service worker only runs in production):

```bash
npm run build && npm start
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Type-check the service worker, then build for production (Webpack) |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `node scripts/generate-icons.js` | Regenerate PWA icons and maskable variants |

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical deployment URL, used by `sitemap.ts` and OG metadata |

---

## Project structure

```
voyago/
├── app/                  # App Router: routes, layouts, sw.ts, metadata files
│   ├── destinations/     # Explore grid + destination detail pages
│   ├── trips/            # Trip list, detail, and creation flow
│   ├── api/               # Route handlers (exchange-rate proxy)
│   └── sw.ts             # Serwist service worker source
├── components/
│   ├── destinations/     # Explorer, filters, map, weather, currency widgets
│   ├── trips/            # Itinerary board, activity modal/list, budget bar
│   ├── pwa/               # Install prompt, offline indicator
│   ├── layout/ · ui/      # Header/footer/theme toggle, shared primitives
├── lib/
│   ├── redux/             # Store, slices, RTK Query APIs (incl. hybridBaseQuery)
│   ├── graphql/           # GraphQL documents
│   ├── theme/             # Theme provider + design tokens
│   └── types/             # Shared TypeScript types
├── public/icons/          # PWA icons (maskable + standard)
└── scripts/               # Icon generation
```

---

## License

MIT — see [`LICENSE`](./LICENSE).
