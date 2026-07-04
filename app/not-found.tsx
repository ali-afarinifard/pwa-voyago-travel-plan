import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { RouteLine } from "@/components/ui/RouteLine";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <RouteLine interrupted className="mb-8 max-w-sm" />
      <Compass
        size={40}
        className="mb-4 text-(--color-primary)"
        aria-hidden="true"
      />
      <h1 className="font-display text-3xl font-semibold text-(--color-foreground) sm:text-4xl">
        Page not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-(--color-foreground)/65">
        This destination doesn&apos;t exist on our map. Try exploring from the
        home page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-(--color-primary) px-5 py-2.5 text-sm font-semibold text-(--color-primary-foreground) transition-opacity hover:opacity-90"
      >
        Back to Voyago
      </Link>
    </Container>
  );
}
