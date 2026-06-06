"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SoundToggle from "./SoundToggle";
import TransitionOverlay from "./TransitionOverlay";
import { useAudio } from "@/contexts/AudioContext";

const BROWN = "#4E3A34";
const TEXT_NAV = "#232122";
const HOVER_COLOR = "#72503C";
const NAV_LIGHT = "#F3F2F0";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface PortfolioNavProps {
  /** "Projects" link: pass a href string, or a scroll-to handler */
  projectsAction: string | (() => void);
  /** When true, renders in light colors (floating over a dark hero image) */
  isLightNav?: boolean;
  /** Background hex for the mobile frosted-glass — should match page bg */
  mobileBgColor?: string;
  /** Show the sound toggle (home page only) */
  showSound?: boolean;
  /** Fired just before logo-click navigation (e.g. for sessionStorage writes) */
  onLogoClick?: () => void;
}

function NavLink({
  href,
  onClick,
  children,
  menu = false,
  color,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  menu?: boolean;
  color?: string;
}) {
  const originalText = (typeof children === "string" ? children : "").toUpperCase();
  const fontSize = menu ? 18 : 14;
  const [hovered, setHovered] = useState(false);
  const [displayChars, setDisplayChars] = useState(originalText.split(""));
  const [charWidths, setCharWidths] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const measure = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = `300 ${fontSize}px "Space Grotesk", system-ui, sans-serif`;
      setCharWidths(
        originalText.split("").map((ch) => ctx.measureText(ch === " " ? " " : ch).width)
      );
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    } else {
      measure();
    }
  }, [originalText, fontSize]);

  const scramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let frame = 0;
    const chars = originalText.split("");
    const STAGGER = 2;
    const DURATION = 3;
    intervalRef.current = setInterval(() => {
      setDisplayChars(
        chars.map((ch, i) => {
          if (ch === " ") return " ";
          const start = i * STAGGER;
          const lock = start + DURATION;
          if (frame < start) return ch;
          if (frame < lock) return SCRAMBLE_CHARS[Math.floor(Math.random() * 26)];
          return ch;
        })
      );
      frame++;
      if (frame >= chars.length * STAGGER + DURATION) {
        clearInterval(intervalRef.current!);
        setDisplayChars(originalText.split(""));
      }
    }, 45);
  };

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  const handleEnter = () => {
    setHovered(true);
    scramble();
  };
  const handleLeave = () => {
    setHovered(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayChars(originalText.split(""));
  };

  const computedColor = color ?? (hovered ? TEXT_NAV : HOVER_COLOR);

  const inner = (
    <div
      style={{ cursor: "pointer", display: "flex" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {displayChars.map((ch, i) => (
        <span
          key={i}
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 300,
            fontSize,
            color: computedColor,
            textTransform: "uppercase",
            transition: "color 0.15s",
            display: "inline-block",
            textAlign: "center",
            width: charWidths[i] != null ? charWidths[i] : "auto",
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
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

function HamburgerIcon({ open, color = BROWN }: { open: boolean; color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {open ? (
        <>
          <line x1="5" y1="5" x2="19" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="19" y1="5" x2="5" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="3" y1="5" x2="21" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="3" y1="19" x2="16" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function PortfolioNav({
  projectsAction,
  isLightNav = false,
  mobileBgColor = "#E5E0D7",
  showSound = false,
  onLogoClick,
}: PortfolioNavProps) {
  const router = useRouter();
  const { muted, setMuted } = useAudio();
  const [exiting, setExiting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [vw, setVw] = useState(1200);

  const isMobile = vw < 768;

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = () => {
    if (exiting) return;
    setExiting(true);
    setMenuOpen(false);
    onLogoClick?.();
    setTimeout(() => router.push("/"), 430);
  };

  const logoColor = isLightNav ? NAV_LIGHT : TEXT_NAV;
  const hamburgerColor = isLightNav ? NAV_LIGHT : BROWN;
  const navLinkColor = isLightNav ? NAV_LIGHT : undefined;

  const frostBg = mobileBgColor.startsWith("#")
    ? hexToRgba(mobileBgColor, 0.75)
    : mobileBgColor;

  const projectsNavLink =
    typeof projectsAction === "string" ? (
      <NavLink href={projectsAction} color={navLinkColor}>
        Projects
      </NavLink>
    ) : (
      <NavLink
        onClick={() => {
          (projectsAction as () => void)();
          setMenuOpen(false);
        }}
        color={navLinkColor}
      >
        Projects
      </NavLink>
    );

  const projectsMenuLink =
    typeof projectsAction === "string" ? (
      <NavLink href={projectsAction} menu>
        Projects
      </NavLink>
    ) : (
      <NavLink
        onClick={() => {
          (projectsAction as () => void)();
          setMenuOpen(false);
        }}
        menu
      >
        Projects
      </NavLink>
    );

  return (
    <>
      {/* Exit overlay — fades to brown when logo is clicked */}
      <TransitionOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        zIndex={150}
      />

      {/* Mobile full-screen menu */}
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
            {projectsMenuLink}
            <NavLink href="/about" menu>
              About me
            </NavLink>
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
          background: isMobile && scrolled ? frostBg : "transparent",
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
            color: logoColor,
            lineHeight: 1,
            transition: "color 0.3s",
          }}
        >
          SANDY QI
        </button>

        {isMobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {showSound && (
              <div style={{ position: "relative", top: -2 }}>
                <SoundToggle muted={muted} onClick={() => setMuted(!muted)} />
              </div>
            )}
            <button
              onClick={() => setMenuOpen((v) => !v)}
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
              <HamburgerIcon open={menuOpen} color={hamburgerColor} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", top: -2 }}>{projectsNavLink}</div>
            {showSound && (
              <div style={{ position: "relative", top: -2 }}>
                <SoundToggle muted={muted} onClick={() => setMuted(!muted)} />
              </div>
            )}
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
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 300,
              fontSize: 10,
              color: HOVER_COLOR,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            © Sandy Qi 2026
          </span>
          <div style={{ pointerEvents: "auto" }}>
            <NavLink href="/about">
              About me
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
}
