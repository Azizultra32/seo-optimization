import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Armada Housecall™ telehealth platform by Armada MD"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

const brandGradient = "linear-gradient(135deg, #0B1627 0%, #102A4F 35%, #0E5E9E 70%, #15A1F2 100%)"
const accentColor = "#9FE870"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          color: "#F8FBFF",
          backgroundImage: brandGradient,
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: accentColor,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "9999px",
              backgroundColor: accentColor,
              boxShadow: `0 0 0 6px rgba(159, 232, 112, 0.16)`,
            }}
          />
          Armada MD
        </div>

        <div style={{ height: 36 }} />

        <div
          style={{
            maxWidth: "80%",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
            Armada Housecall™
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#E7F4FF" }}>
            Ethical telehealth platform delivering high-quality virtual care with secure scheduling, documentation, and patient management.
          </div>
        </div>

        <div style={{ height: 40 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#E7F4FF" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            HC
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Virtual care without compromise</div>
            <div style={{ fontSize: 20, color: "#D7E8F5" }}>
              Seamless scheduling, AI-assisted charting, and secure patient data flows across your practice.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
