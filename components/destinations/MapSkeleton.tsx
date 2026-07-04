export function MapSkeleton() {
  return (
    <div
      className="flex h-80 w-full animate-pulse items-center justify-center rounded-card border border-border bg-(--color-surface-muted) text-sm text-(--color-foreground)/40"
      role="status"
      aria-label="Loading map"
    >
      Loading map…
    </div>
  );
}
