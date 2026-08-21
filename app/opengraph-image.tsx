import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Milk Design Studio — Strategy, Product & Brand Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAFA",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top-left dot */}
        <div style={{ position: "absolute", top: 48, left: 56, width: 10, height: 10, borderRadius: "50%", background: "#0C0C12" }} />

        {/* Wordmark */}
        <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: "-6px", color: "#0C0C12", lineHeight: 1 }}>
          Milk
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 26, color: "#565656", marginTop: 20, letterSpacing: "-0.5px" }}>
          Strategy · Product · Brand
        </div>

        {/* URL */}
        <div style={{ position: "absolute", bottom: 48, right: 56, fontSize: 18, color: "#B0B0B0", letterSpacing: "-0.3px" }}>
          milk.design
        </div>
      </div>
    ),
    { ...size }
  );
}
