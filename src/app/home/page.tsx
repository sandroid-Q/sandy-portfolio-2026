"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TransitionOverlay from "@/components/TransitionOverlay";
import SoundToggle from "@/components/SoundToggle";
import { useAudio } from "@/contexts/AudioContext";
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
      <button onClick={onClick} style={{ background: "none", border: "none", padding: 0 }}>
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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <line x1="5" y1="5" x2="19" y2="19" stroke={BROWN} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="19" y1="5" x2="5" y2="19" stroke={BROWN} strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="3" y1="5"  x2="21" y2="5"  stroke={BROWN} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="12" x2="19" y2="12" stroke={BROWN} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="19" x2="16" y2="19" stroke={BROWN} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

const BG_BUTTON = "#F3F2F0";
const HOVER_BROWN = "#D3BA9F";

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

function IconButton({ onClick, icon }: { onClick: () => void; icon: (color: string) => React.ReactNode }) {
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

const SCALE_MIN = 0.8;

export default function HomePage() {
  const router = useRouter();
  const { muted, setMuted } = useAudio();
  const topRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);
  const [vh, setVh] = useState(900);
  const [vw, setVw] = useState(1200);
  const [exiting, setExiting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isMobile = vw < 768;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = () => {
    if (exiting) return;
    setExiting(true);
    setMenuOpen(false);
    setTimeout(() => {
      sessionStorage.setItem("fromHome", "1");
      router.push("/");
    }, 430);
  };

  useEffect(() => {
    const update = () => { setVh(window.innerHeight); setVw(window.innerWidth); };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Close menu if viewport grows past breakpoint
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const raw = vh / 2 - 442;
  const strapExtension = Math.max(0, raw);
  const cardMarginTop = Math.min(0, raw);

  const scale = Math.min(1, vw < 340 ? Math.max(SCALE_MIN, vw / 340) : 1);
  const shrink = (276 * (1 - scale)) / 2;

  const PAD_W = 392;
  const PAD_H = 772;
  const padScale = Math.min(1, (vw - 32) / PAD_W);
  const padShrinkX = (PAD_W * (1 - padScale)) / 2;
  const padShrinkY = PAD_H * (1 - padScale);

  const scrollToPad = () => {
    setMenuOpen(false);
    padRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ backgroundColor: "var(--color-bg-secondary)", minHeight: "100vh" }}>

      {/* Entry: fade out from brown on arrival */}
      <TransitionOverlay
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        stagedExit
      />
      {/* Exit: fade to brown on logo click */}
      <TransitionOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        zIndex={150}
      />

      {/* Mobile hamburger menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              top: 72,
              backgroundColor: "var(--color-bg-secondary)",
              zIndex: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 48,
            }}
          >
            <NavLink onClick={scrollToPad}>My work</NavLink>
            <NavLink href="/about">About me</NavLink>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top nav */}
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
          padding: isMobile ? "0 18px 0 24px" : "0 18px 0 36px",
          zIndex: 100,
          background: isMobile && scrolled ? "rgba(229, 224, 215, 0.75)" : "transparent",
          backdropFilter: isMobile && scrolled ? "blur(8px)" : "none",
          WebkitBackdropFilter: isMobile && scrolled ? "blur(8px)" : "none",
          transition: "background 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        <button
          onClick={handleLogoClick}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--font-silkscreen)",
            fontSize: 24,
            color: TEXT_NAV,
            lineHeight: 1,
          }}
        >
          SANDY QI
        </button>

        {isMobile ? (
          /* Mobile: sound + hamburger */
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", top: -2 }}>
              <SoundToggle muted={muted} onClick={() => setMuted(!muted)} />
            </div>
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{
                background: "none",
                border: "none",
                padding: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                top: -2,
              }}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        ) : (
          /* Desktop: my work + sound */
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <NavLink onClick={scrollToPad}>My work</NavLink>
            <div style={{ position: "relative", top: -2 }}>
              <SoundToggle muted={muted} onClick={() => setMuted(!muted)} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav — desktop only */}
      {!isMobile && (
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
      )}

      {/* Section 1: IDCard */}
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

      {/* Section 2: ElevatorPad */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 64,
          paddingBottom: isMobile ? 60 : 168,
        }}
      >
        <IconButton onClick={scrollToPad} icon={(c) => <ArrowDown color={c} />} />

        <div ref={padRef} style={{ scrollMarginTop: 32 }}>
          <div
            style={{
              transform: `scale(${padScale})`,
              transformOrigin: "top center",
              marginLeft: -padShrinkX,
              marginRight: -padShrinkX,
              marginBottom: -padShrinkY,
            }}
          >
            <ElevatorPad />
          </div>
        </div>

        <IconButton onClick={scrollToTop} icon={(c) => <ArrowUp color={c} />} />
      </div>

      {/* Copyright — mobile only, static at page bottom */}
      {isMobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 32,
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
        </div>
      )}
    </div>
  );
}
