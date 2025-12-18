import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Armada Housecall™ telehealth platform by Armada MD"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          padding: "64px",
          background: "radial-gradient(circle at 20% 20%, #1d2b64, #151820 55%)",
          color: "#f6f7fb",
          fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#8dd7ff",
            fontSize: 28,
            letterSpacing: 0.2,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
              boxShadow: "0 0 0 6px rgba(141, 215, 255, 0.12)",
            }}
          />
          <span>Armada MD</span>
        </div>

        <h1
          style={{
            marginTop: 28,
            marginBottom: 16,
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: -1.6,
            maxWidth: 900,
          }}
        >
          Armada Housecall
          <span
            style={{
              fontSize: 22,
              verticalAlign: "super",
              marginLeft: 8,
            }}
          >
            ™
          </span>
        </h1>

        <p
          style={{
            fontSize: 34,
            lineHeight: 1.4,
            color: "#d7e3ff",
            maxWidth: 900,
            margin: 0,
          }}
        >
          Telehealth built for physicians—seamless scheduling, documentation, and patient care in one secure platform.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 32,
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "14px 22px",
              borderRadius: 999,
              border: "1px solid rgba(255, 255, 255, 0.14)",
              background: "linear-gradient(135deg, rgba(81, 156, 255, 0.36), rgba(72, 84, 255, 0.18))",
              color: "#0c1024",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            Demo Ready
          </div>

          <div
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              color: "#e4ecff",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Ethical AI • Patient-first • Secure by design
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
