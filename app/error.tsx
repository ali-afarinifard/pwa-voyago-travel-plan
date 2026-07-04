"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-display text-3xl font-semibold text-(--color-foreground) sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mx-auto mt-3 max-w-md text-(--color-foreground)/65">
        An unexpected error occurred. You can try refreshing the page or
        returning home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-(--color-primary) px-5 py-2.5 text-sm font-semibold text-(--color-primary-foreground) transition-opacity hover:opacity-90"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-(--color-foreground) transition-colors hover:bg-(--color-surface-muted)"
        >
          Go home
        </Link>
      </div>
    </Container>
  );
}
