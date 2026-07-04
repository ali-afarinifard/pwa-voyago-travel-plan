"use client";

import { WifiOff } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";

export function OfflineIndicator() {
  const isOnline = useAppSelector((state) => state.ui.isOnline);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-1.5 rounded-full border border-(--color-terracotta)/30 bg-(--color-terracotta)/10 px-3 py-1 text-xs font-medium text-(--color-terracotta)"
    >
      <WifiOff size={13} aria-hidden="true" />
      <span>Offline — showing saved data</span>
    </div>
  );
}
