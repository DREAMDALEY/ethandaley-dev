import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Ethan Daley — Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0a",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: 28,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Ethan Daley · Dev
        </div>
        <div
          style={{
            color: "#efefef",
            fontSize: 130,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          Ethan Daley
        </div>
        <div
          style={{
            color: "#efefef",
            fontSize: 72,
            fontWeight: 400,
            lineHeight: 1,
            marginTop: 8,
            opacity: 0.85,
          }}
        >
          Developer
        </div>
        <div
          style={{
            marginTop: 56,
            width: 220,
            height: 8,
            background: "#c8102e",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
