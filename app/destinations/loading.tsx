import { Container } from "@/components/ui/Container";

function CardSkeleton() {
  return (
    <div className="boarding-pass animate-pulse overflow-hidden">
      <div className="flex flex-col gap-3 p-5">
        <div className="h-10 w-10 rounded-full bg-(--color-surface-muted)" />
        <div className="h-5 w-3/4 rounded bg-(--color-surface-muted)" />
        <div className="h-4 w-1/2 rounded bg-(--color-surface-muted)" />
        <div className="mt-2 h-4 w-2/3 rounded bg-(--color-surface-muted)" />
      </div>
      <hr className="stub-divider mx-5" />
      <div className="flex justify-between px-5 py-3">
        <div className="h-3 w-20 rounded bg-(--color-surface-muted)" />
        <div className="h-3 w-12 rounded bg-(--color-surface-muted)" />
      </div>
    </div>
  );
}

export default function DestinationsLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-(--color-surface-muted)" />
      <div className="mb-6 flex gap-3">
        <div className="h-10 flex-1 animate-pulse rounded-full bg-(--color-surface-muted) sm:max-w-sm" />
        <div className="h-10 w-40 animate-pulse rounded bg-(--color-surface-muted)" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </Container>
  );
}
