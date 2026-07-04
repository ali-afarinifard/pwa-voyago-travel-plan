import { ImageResponse } from "next/og";
import { getCountry } from "@/lib/api/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const country = await getCountry(code.toUpperCase());

  const name = country?.name ?? "Destination";
  const subtitle = country
    ? `${country.continent.name} · ${country.code}${country.currency ? ` · ${country.currency}` : ""}`
    : "Voyago travel guide";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#0F1B33",
          color: "#FAF6F0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: "4px solid #F2A93B" }} />
          <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#F2A93B" }}>
            Voyago
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontSize: 32, color: "#8FB3CC", marginTop: 18 }}>{subtitle}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
