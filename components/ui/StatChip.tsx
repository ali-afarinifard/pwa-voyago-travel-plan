export function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-border bg-surface px-4 py-1.5">
      <span className="text-(--color-foreground)/45">{label}: </span>
      <span className="font-tabular text-(--color-foreground)">{value}</span>
    </div>
  );
}
