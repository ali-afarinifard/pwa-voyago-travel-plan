import { Container } from "@/components/ui/Container";
import { RouteLine } from "@/components/ui/RouteLine";
import { DestinationSearch } from "./DestinationSearch";

export function Hero() {
  return (
    <section className="bg-topo relative overflow-hidden border-b border-border">
      <Container className="flex flex-col items-start gap-8 py-20 sm:py-28">
        <span className="font-tabular rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-(--color-foreground)/55">
          250+ destinations · live data · works offline
        </span>

        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-(--color-foreground) sm:text-6xl">
          Plan your next trip,{" "}
          <span className="text-(--color-primary)">even off the grid.</span>
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-(--color-foreground)/65 sm:text-lg">
          Explore every country&apos;s weather, currency, and culture, then
          sketch a day-by-day itinerary that stays saved on your device — no
          signal required.
        </p>

        <DestinationSearch />

        <RouteLine className="max-w-md text-(--color-secondary)" />
      </Container>
    </section>
  );
}
