import { ImageResponse } from "next/og"

export const alt = "Dr. Ali Ghahary — projects, writing and ideas"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f7f7f5",
          color: "#171717",
          padding: 88,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#666", marginBottom: 36 }}>alighahary.com</div>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3 }}>Dr. Ali Ghahary</div>
        <div style={{ fontSize: 32, color: "#555", marginTop: 28 }}>Projects, writing and ideas.</div>
      </div>
    ),
    size,
  )
}
