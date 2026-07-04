/**
 * design tokens — "Map & Boarding Pass"
 *
 * This is the JS-side mirror of the CSS custom properties defined in
 * `app/globals.css` (@theme block). Tailwind utilities read the CSS
 * variables directly; Ant Design's `ConfigProvider` needs raw values
 * for its CSS-in-JS theme algorithm, so we keep a small JS source of
 * truth here. If you change a color/radius in globals.css, mirror the
 * change here too.
 */

export const palette = {
  ink: "#0F1B33",
  inkSoft: "#1B2C4D",
  inkLine: "#2A3B5C",
  parchment: "#FAF6F0",
  parchmentSoft: "#F1EADD",
  compass: "#F2A93B",
  compassSoft: "#FFD89B",
  sage: "#4A6358",
  sageLight: "#7A9B8E",
  mist: "#8FB3CC",
  terracotta: "#C2553D",
} as const;

export const radii = {
  card: 20, // 1.25rem
  pill: 999,
  stamp: 8,
} as const;

export const fontFamilies = {
  display: "var(--font-fraunces)",
  sans: "var(--font-manrope)",
  mono: "var(--font-jetbrains-mono)",
} as const;

/** Shared tokens that don't change between light/dark */
export const sharedTokens = {
  fontFamily: fontFamilies.sans,
  borderRadius: radii.card / 2, // antd uses smaller base radii than cards
  borderRadiusLG: radii.card,
  colorPrimary: palette.compass,
  colorInfo: palette.mist,
  colorSuccess: palette.sage,
  colorWarning: palette.compass,
  colorError: palette.terracotta,
  // Compass gold is a light, warm color — pair it with dark ink text
  // for sufficient contrast on primary buttons/tags.
  colorTextLightSolid: palette.ink,
};

export const lightTokens = {
  colorBgBase: palette.parchment,
  colorTextBase: palette.ink,
  colorBgContainer: "#FFFFFF",
  colorBgLayout: palette.parchment,
  colorBorder: "#E4DCC9",
  colorBorderSecondary: "#EDE4D2",
};

export const darkTokens = {
  colorBgBase: palette.ink,
  colorTextBase: palette.parchment,
  colorBgContainer: palette.inkSoft,
  colorBgLayout: palette.ink,
  colorBorder: palette.inkLine,
  colorBorderSecondary: palette.inkLine,
};
