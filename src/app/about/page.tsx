"use client";

import PortfolioNav from "@/components/PortfolioNav";

const BG = "#F3F2F0";
const TEXT = "#000000";
const BROWN = "#4E3A34";

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
      <PortfolioNav projectsAction="/home" mobileBgColor="#F3F2F0" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "72px 32px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-silkscreen)",
            fontSize: 32,
            color: BROWN,
            textTransform: "uppercase",
          }}
        >
          About me
        </span>
        <p
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 300,
            fontSize: 14,
            color: TEXT,
            marginTop: 24,
          }}
        >
          Coming soon.
        </p>
      </div>
    </div>
  );
}
