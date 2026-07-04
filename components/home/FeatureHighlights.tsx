import {
  CloudSun,
  Download,
  MapPinned,
  Plane,
  Wallet,
  WifiOff,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const FEATURES = [
  {
    icon: WifiOff,
    title: "Works offline",
    description:
      "Saved trips and recently viewed destinations stay available even without a connection.",
  },
  {
    icon: Download,
    title: "Installable app",
    description:
      "Add Voyago to your home screen for a fast, app-like experience on any device.",
  },
  {
    icon: CloudSun,
    title: "Live weather",
    description:
      "Real-time conditions for every destination, sourced from Open-Meteo.",
  },
  {
    icon: Wallet,
    title: "Currency converter",
    description:
      "Up-to-date exchange rates so your trip budget always reflects reality.",
  },
  {
    icon: MapPinned,
    title: "Interactive maps",
    description:
      "An embedded map for each destination, with tiles cached for offline viewing.",
  },
  {
    icon: Plane,
    title: "Day-by-day planner",
    description:
      "Drag activities across days and track spend against your trip budget.",
  },
];

export function FeatureHighlights() {
  return (
    <section
      aria-labelledby="features-heading"
      className="border-t border-border bg-(--color-surface-muted)"
    >
      <Container className="py-16">
        <h2
          id="features-heading"
          className="max-w-2xl font-display text-2xl font-semibold text-(--color-foreground) sm:text-3xl"
        >
          Built for travel, designed to keep working offline
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-card border border-border bg-surface p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-primary)/15 text-(--color-primary)">
                <Icon size={20} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-(--color-foreground)">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-(--color-foreground)/65">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
