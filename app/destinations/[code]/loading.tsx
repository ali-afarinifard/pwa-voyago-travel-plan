import { Container } from "@/components/ui/Container";
import { MapSkeleton } from "@/components/destinations/MapSkeleton";

export default function DestinationLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="flex items-center gap-4">
        <div className="h-16 w-24 animate-pulse rounded-xl bg-(--color-surface-muted)" />
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 animate-pulse rounded-xl bg-(--color-surface-muted)" />
          <div className="h-5 w-32 animate-pulse rounded bg-(--color-surface-muted)" />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-28 animate-pulse rounded-full bg-(--color-surface-muted)" />
        ))}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MapSkeleton />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-32 animate-pulse rounded-card bg-(--color-surface-muted)" />
          <div className="h-40 animate-pulse rounded-card bg-(--color-surface-muted)" />
        </div>
      </div>
    </Container>
  );
}
