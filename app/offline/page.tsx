import type { Metadata } from "next";
import Link from "next/link";
import { Compass, RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RouteLine } from "@/components/ui/RouteLine";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <RouteLine
        interrupted
        className="mb-8 max-w-sm text-(--color-secondary)"
      />

      <Compass
        size={40}
        className="mb-4 text-(--color-primary)"
        aria-hidden="true"
      />
      <h1 className="font-display text-3xl font-semibold text-(--color-foreground) sm:text-4xl">
        You&apos;re off the map
      </h1>
      <p className="mx-auto mt-3 max-w-md text-(--color-foreground)/65">
        No connection right now. Pages and destinations you&apos;ve already
        opened — and every trip you&apos;ve planned — are still saved on this
        device.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-(--color-primary) px-5 py-2.5 text-sm font-semibold text-(--color-primary-foreground) transition-opacity hover:opacity-90"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </a>
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-(--color-foreground) transition-colors hover:bg-(--color-surface-muted)"
        >
          Open my trips
        </Link>
      </div>
    </Container>
  );
}
