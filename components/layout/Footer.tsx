import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-(--color-foreground)">
          <Compass
            size={20}
            className="text-(--color-primary)"
            aria-hidden="true"
          />
          Voyago
        </div>
        <p className="max-w-md text-sm leading-relaxed text-(--color-foreground)/60">
          A travel-exploration and offline trip-planning concept, built as a
          frontend architecture showcase. Destination data from the{" "}
          <a
            className="underline decoration-border hover:text-(--color-foreground)"
            href="https://countries.trevorblades.com/"
            target="_blank"
            rel="noreferrer"
          >
            Countries GraphQL API
          </a>{" "}
          and{" "}
          <a
            className="underline decoration-border hover:text-(--color-foreground)"
            href="https://restcountries.com/"
            target="_blank"
            rel="noreferrer"
          >
            REST Countries
          </a>
          ; weather from{" "}
          <a
            className="underline decoration-border hover:text-(--color-foreground)"
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
          >
            Open-Meteo
          </a>
          ; exchange rates from{" "}
          <a
            className="underline decoration-border hover:text-(--color-foreground)"
            href="https://frankfurter.dev/"
            target="_blank"
            rel="noreferrer"
          >
            Frankfurter
          </a>
          .
        </p>
      </Container>
    </footer>
  );
}
