"use client";

import { cn } from "@/lib/utils/cn";

/**
 * The page's signature motif: a dashed flight-path line connecting two
 * points, drawn in on mount. `interrupted` renders a broken route (used on
 * the offline page) instead of a completed one.
 */
export function RouteLine({
  interrupted = false,
  className,
}: {
  interrupted?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 120"
      className={cn("w-full overflow-visible", className)}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="40" cy="70" r="6" className="fill-(--color-primary)" />
      <circle cx="360" cy="70" r="6" className={interrupted ? "fill-(--color-foreground)/25" : "fill-(--color-secondary)"} />

      {interrupted ? (
        <>
          <path
            d="M40,70 Q120,20 180,55"
            pathLength={1}
            className="route-line route-draw"
            style={{ animationDelay: "0s" }}
          />
          <path
            d="M220,60 Q300,90 360,70"
            pathLength={1}
            className="route-line route-draw opacity-40"
            style={{ animationDelay: "0.5s" }}
          />
          <g transform="translate(200,57)" className="text-(--color-terracotta)">
            <circle r="11" className="fill-(--color-background)" stroke="currentColor" strokeWidth="2" />
            <path d="M-4,-4 L4,4 M4,-4 L-4,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </g>
        </>
      ) : (
        <path d="M40,70 Q200,10 360,70" pathLength={1} className="route-line route-draw" />
      )}
    </svg>
  );
}
