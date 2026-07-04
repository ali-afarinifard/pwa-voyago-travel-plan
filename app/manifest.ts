import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Voyago — Travel Explorer & Offline Trip Planner",
    short_name: "Voyago",
    description:
      "Discover destinations worldwide, check live weather and exchange rates, and plan a day-by-day itinerary that works offline.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FAF6F0",
    theme_color: "#0F1B33",
    categories: ["travel", "lifestyle", "navigation"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Explore destinations",
        short_name: "Explore",
        description: "Browse and filter destinations worldwide",
        url: "/destinations",
        icons: [{ src: "/icons/shortcut-explore.png", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "My trips",
        short_name: "Trips",
        description: "View your saved offline itineraries",
        url: "/trips",
        icons: [{ src: "/icons/shortcut-trips.png", sizes: "96x96", type: "image/png" }],
      },
    ],
  };
}
