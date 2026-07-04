"use client";

import Link from "next/link";
import { PlusCircle, Plane } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { Container } from "@/components/ui/Container";
import { TripCard } from "@/components/trips/TripCard";

export default function TripsPage() {
  const trips = useAppSelector((state) => state.trips.items);

  return (
    <Container className="py-12 sm:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-(--color-foreground) sm:text-4xl">
            My trips
          </h1>
          <p className="mt-1 text-(--color-foreground)/60">
            Saved on this device · available offline
          </p>
        </div>
        <Link
          href="/trips/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-(--color-primary) px-4 py-2.5 text-sm font-semibold text-(--color-primary-foreground) transition-opacity hover:opacity-90"
        >
          <PlusCircle size={16} aria-hidden="true" />
          New trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <Plane size={40} className="text-(--color-foreground)/25" aria-hidden="true" />
          <p className="font-display text-xl font-semibold text-(--color-foreground)">
            No trips yet
          </p>
          <p className="max-w-sm text-sm text-(--color-foreground)/60">
            Plan your first trip — it&apos;ll be saved here and stay accessible even offline.
          </p>
          <Link
            href="/trips/new"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-(--color-primary) px-5 py-2.5 text-sm font-semibold text-(--color-primary-foreground) transition-opacity hover:opacity-90"
          >
            <PlusCircle size={16} aria-hidden="true" />
            Plan a trip
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </Container>
  );
}
