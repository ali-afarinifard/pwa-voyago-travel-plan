"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function DestinationSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    router.push(
      query ? `/destinations?q=${encodeURIComponent(query)}` : "/destinations",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="boarding-pass flex w-full max-w-xl items-center gap-2 p-2 pl-5"
    >
      <Search
        size={18}
        className="text-(--color-foreground)/40"
        aria-hidden="true"
      />
      <label htmlFor="destination-search" className="sr-only">
        Search destinations
      </label>
      <input
        id="destination-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search a country, capital, or region…"
        className="flex-1 bg-transparent py-3 px-2 text-sm text-(--color-foreground) placeholder:text-(--color-foreground)/40 focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-(--color-primary) px-5 py-2.5 text-sm font-semibold text-(--color-primary-foreground) transition-opacity hover:opacity-90"
      >
        Explore
      </button>
    </form>
  );
}
