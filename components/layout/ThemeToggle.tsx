"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setTheme, type ThemeMode } from "@/lib/redux/slices/uiSlice";
import { cn } from "@/lib/utils/cn";

const ORDER: ThemeMode[] = ["light", "dark", "system"];

const ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<ThemeMode, string> = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
};

export function ThemeToggle({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const Icon = ICONS[theme];

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    dispatch(setTheme(next));
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${LABELS[theme]}. Activate to switch theme.`}
      title={LABELS[theme]}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-(--color-foreground) transition-colors hover:bg-(--color-surface-muted)",
        className,
      )}
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
