"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import IDCard from "@/components/IDCard";
import ElevatorPad from "@/components/ElevatorPad";

const BROWN = "#4E3A34";
const TEXT_NAV = "#232122";
const RED = "#DE211D";

function NavLink({
  href,
  onClick,
  children,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 4, cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 500,
          fontSize: 14,
          color: TEXT_NAV,
        }}
      >
        {children}
      </span>
      <div
        style={{
          height: 1,
          backgroundColor: RED,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s",
        }}
      />
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={{ background: "none", border: "none", padding: 0 }}
      >
        {inner}
      </button>
    );
  }
  return (
    <Link href={href!} style={{ textDecoration: "none" }}>
      {inner}
    </Link>
  );
}

const BG_BUTTON = "#F3F2F0";
const HOVER_BROWN = "#D3BA9F";
const BEIGE = "#E5E0D7";

function ArrowDown({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 0.75L12 23.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 12.75L12 23.25L22.5 12.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUp({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 23.25L12 0.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.5 11.25L12 0.75L1.5 11.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconButton({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: (color: string) => React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? HOVER_BROWN : BG_BUTTON,
        borderRadius: 12,
        width: 48,
        height: 48,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.15s",
      }}
    >
      {icon(BROWN)}
    </button>
  );
}

// Card center sits at 442px below the IDCard top (213px to card top + 229px to card center).
// strapExtension = vh/2 - 442 → grows the strap so card is vertically centered.
// When negative (small screens) clamp to 0 and shift the whole component up instead.
const SCALE_MIN = 0.8;

export default function HomePage() {
  const topRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);
  const [vh, setVh] = useState(900);
  const [vw, setVw] = useState(1200);

  useEffect(() => {
    const update = () => { setVh(window.innerHeight); setVw(window.innerWidth); };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // strapExtension ≥ 0: grow the strap to center the card on large screens.
  // cardMarginTop < 0: shift the whole component up on small screens (clips strap at top).
  const raw = vh / 2 - 442;
  const strapExtension = Math.max(0, raw);
  const cardMarginTop = Math.min(0, raw);

  // Scale only for very narrow viewports
  const scale = Math.min(1, vw < 340 ? Math.max(SCALE_MIN, vw / 340) : 1);
  const shrink = (276 * (1 - scale)) / 2;

  const scrollToPad = () =>
    padRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        minHeight: "100vh",
      }}
    >
      {/* Top nav — transparent, fixed */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 36px",
          zIndex: 100,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontFamily: "var(--font-silkscreen)",
            fontSize: 24,
            color: TEXT_NAV,
            lineHeight: 1,
          }}
        >
          SANDY QI
        </Link>
        <NavLink onClick={scrollToPad}>My work</NavLink>
      </div>

      {/* Bottom nav — transparent, fixed */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 36px",
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 300,
            fontSize: 10,
            color: "#000",
          }}
        >
          © Sandy Qi 2026
        </span>
        <NavLink href="/about">About me</NavLink>
      </div>

      {/* Section 1: IDCard — strap always starts at top of screen, card is centered */}
      <div
        ref={topRef}
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 48,
        }}
      >
        <div
          style={{
            marginTop: cardMarginTop,
            marginLeft: -shrink,
            marginRight: -shrink,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <IDCard strapExtension={strapExtension} />
        </div>
      </div>

      {/* Section 2: scroll anchor + ElevatorPad */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 64,
          paddingBottom: 168,
        }}
      >
        <IconButton onClick={scrollToPad} icon={(c) => <ArrowDown color={c} />} />

        <div
          ref={padRef}
          style={{ width: "100%", display: "flex", justifyContent: "center", scrollMarginTop: 32 }}
        >
          <ElevatorPad />
        </div>

        <IconButton onClick={scrollToTop} icon={(c) => <ArrowUp color={c} />} />
      </div>
    </div>
  );
}
