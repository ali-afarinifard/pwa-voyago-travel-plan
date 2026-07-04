import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F1B33",
          color: "#FAF6F0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "8px solid #F2A93B",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "20px solid transparent",
              borderRight: "20px solid transparent",
              borderBottom: "78px solid #F2A93B",
            }}
          />
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>Voyago</div>
        <div style={{ fontSize: 32, color: "#F2A93B", marginTop: 14 }}>
          Explore destinations, plan trips offline
        </div>
      </div>
    ),
    { ...size },
  );
}
