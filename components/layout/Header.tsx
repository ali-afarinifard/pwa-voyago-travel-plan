"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "antd";
import { Compass, Map, Menu, Send, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/", label: "Discover" },
  { href: "/destinations", label: "Explore" },
  { href: "/trips", label: "My Trips" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-(--color-background)/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-(--container-page) items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-(--color-foreground)"
        >
          <Compass
            size={22}
            className="text-(--color-primary)"
            aria-hidden="true"
          />
          Voyago
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-(--color-primary)/15 text-(--color-primary)"
                    : "text-(--color-foreground)/70 hover:text-(--color-foreground)",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <OfflineIndicator />
          </div>
          <ThemeToggle />
          <Link
            href="/trips/new"
            className="hidden items-center gap-1.5 rounded-full bg-(--color-primary) px-4 py-2 text-sm font-semibold text-(--color-primary-foreground) transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <Send size={15} aria-hidden="true" />
            Plan a trip
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-(--color-foreground) md:hidden"
          >
            <Menu size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Drawer
        title={
          <span className="flex items-center gap-2 font-display text-lg font-semibold">
            <Compass
              size={20}
              className="text-(--color-primary)"
              aria-hidden="true"
            />
            Voyago
          </span>
        }
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        closeIcon={<X size={18} />}
        styles={{ body: { padding: 0 } }}
      >
        <nav aria-label="Mobile" className="flex flex-col p-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-(--color-foreground) hover:bg-(--color-surface-muted)"
            >
              <Map
                size={18}
                className="text-(--color-primary)"
                aria-hidden="true"
              />
              {link.label}
            </Link>
          ))}
          <Link
            href="/trips/new"
            onClick={() => setOpen(false)}
            className="mx-4 mt-2 flex items-center justify-center gap-1.5 rounded-full bg-(--color-primary) px-4 py-2.5 text-sm font-semibold text-(--color-primary-foreground)"
          >
            <Send size={15} aria-hidden="true" />
            Plan a trip
          </Link>
          <div className="px-4 pt-4">
            <OfflineIndicator />
          </div>
        </nav>
      </Drawer>
    </header>
  );
}
