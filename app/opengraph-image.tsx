import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Safety Net — the agent that keeps you out of liquidation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0c0c0c",
          color: "#f4f3ee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#1fd189",
            }}
          />
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>Safety Net</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: -3,
              maxWidth: 980,
            }}
          >
            Never get liquidated again.
          </div>
          <div style={{ fontSize: 28, color: "#9a9890", maxWidth: 880 }}>
            An autonomous on-chain guardian. Watches every Aave loan, Uniswap range and token —
            and acts before you bleed.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            color: "#1fd189",
          }}
        >
          <div
            style={{ width: 10, height: 10, borderRadius: 10, background: "#1fd189" }}
          />
          mainnet · 14ms · per-block
        </div>
      </div>
    ),
    { ...size }
  );
}
