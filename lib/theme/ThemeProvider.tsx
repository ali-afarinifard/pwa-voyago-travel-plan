"use client";

import { useEffect, useMemo, useState } from "react";
import { App as AntdApp, ConfigProvider, theme as antdTheme } from "antd";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  darkTokens,
  fontFamilies,
  lightTokens,
  radii,
  sharedTokens,
} from "./design-tokens";

type ResolvedMode = "light" | "dark";

function resolveMode(themeMode: string, prefersDark: boolean): ResolvedMode {
  if (themeMode === "dark") return "dark";
  if (themeMode === "light") return "light";
  return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useAppSelector((state) => state.ui.theme);
  const [resolvedMode, setResolvedMode] = useState<ResolvedMode>("light");

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setResolvedMode(resolveMode(themeMode, mql.matches));
    update();

    if (themeMode === "system") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedMode === "dark");
    document.documentElement.style.colorScheme = resolvedMode;
  }, [resolvedMode]);

  const themeConfig = useMemo(
    () => ({
      algorithm: resolvedMode === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        ...sharedTokens,
        ...(resolvedMode === "dark" ? darkTokens : lightTokens),
        fontFamily: fontFamilies.sans,
      },
      components: {
        Button: { borderRadius: radii.card / 2.5, fontWeight: 600 },
        Card: { borderRadiusLG: radii.card },
        Tag: { borderRadiusSM: radii.pill },
        Input: { borderRadius: radii.card / 2.5 },
        Select: { borderRadius: radii.card / 2.5 },
      },
    }),
    [resolvedMode],
  );

  return (
    <ConfigProvider theme={themeConfig}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}

/**
 * Inline script injected into <head> to apply the persisted theme class
 * before React hydrates, avoiding a flash of the wrong theme. Reads the
 * same redux-persist storage key used by the `ui` slice.
 */
export const noFlashThemeScript = `
(function () {
  try {
    var raw = localStorage.getItem('persist:voyago:ui');
    var mode = 'system';
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.theme) mode = JSON.parse(parsed.theme);
    }
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = mode === 'dark' || (mode === 'system' && prefersDark);
    if (dark) document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();
`;
