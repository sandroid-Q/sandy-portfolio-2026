"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";
import TransitionOverlay from "./TransitionOverlay";
import { useAudio } from "@/contexts/AudioContext";

const BROWN = "#4E3A34";
const TEXT_NAV = "#232122";
const HOVER_COLOR = "#72503C";
const NAV_LIGHT = "#F3F2F0";
const DARK_RED = "#AE1819";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface PortfolioNavProps {
  /** "Projects" link: pass a href string, or a scroll-to handler */
  projectsAction: string | (() => void);
  /** When true, renders in light colors (floating over a dark hero image) */
  isLightNav?: boolean;
  /** Pin nav text/icons to light-theme (dark) ink — for bright cover images */
  forceLight?: boolean;
  /** Background hex for the mobile frosted-glass — should match page bg */
  mobileBgColor?: string;
  /** Show the sound toggle (home page only) */
  showSound?: boolean;
  /** Fired just before logo-click navigation (e.g. for sessionStorage writes) */
  onLogoClick?: () => void;
  /** When true, forces the Projects underline active (e.g. elevator pad in view) */
  projectsActive?: boolean;
  /** Force frosted-glass blur on the top nav */
  blurTop?: boolean;
  /** Force frosted-glass blur on the bottom nav */
  blurBottom?: boolean;
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
  const { playNav } = useAudio();
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

  const computedColor = color ?? "var(--color-on-surface-primary)";

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
      <button onClick={() => { playNav(); onClick(); }} style={{ background: "none", border: "none", padding: 0 }}>
        {inner}
      </button>
    );
  }
  return (
    <Link href={href!} style={{ textDecoration: "none" }} onClick={() => playNav()}>
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

function MenuEmailLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href="mailto:sandra.jxq@gmail.com"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: "0.01em",
          textDecoration: "none",
          display: "block",
          paddingBottom: 3,
          color: hovered ? "var(--color-interactive-hover)" : "var(--color-on-surface-primary)",
          transition: "color 0.2s",
        }}
      >
        sandra.jxq@gmail.com
      </a>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1.5,
          backgroundColor: "var(--color-interactive-hover)",
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

function LinkedInButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="https://www.linkedin.com/in/sandra-qi/"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12.18,
          border: `2.7px solid var(--color-on-surface-primary)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: hovered ? "var(--color-interactive-hover)" : "rgba(0,0,0,0)",
          transition: "background-color 0.15s ease-out",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 500,
            fontSize: 32,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: hovered ? "var(--color-surface-primary)" : "var(--color-on-surface-primary)",
            transition: "color 0.15s ease-out",
          }}
        >
          in
        </span>
      </div>
    </a>
  );
}

function MenuLink({ href, onClick, children, active }: { href?: string; onClick?: () => void; children: string; active?: boolean }) {
  const { playNav } = useAudio();
  const [hovered, setHovered] = useState(false);
  const INDENT = 24;

  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", cursor: "pointer" }}
    >
      <motion.div
        animate={{ x: hovered ? INDENT : 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 500,
          fontSize: 72,
          letterSpacing: "-0.055em",
          lineHeight: 0.88,
          color: (active || hovered) ? "var(--color-interactive-hover)" : "var(--color-on-surface-primary)",
          transition: "color 0.15s",
        }}
      >
        {children}
      </motion.div>
    </div>
  );

  if (onClick) {
    return <button onClick={() => { playNav(); onClick(); }} style={{ background: "none", border: "none", padding: 0 }}>{inner}</button>;
  }
  return <Link href={href!} style={{ textDecoration: "none" }} onClick={() => playNav()}>{inner}</Link>;
}


function LogoButton({ onClick, color }: { onClick: () => void; color: string }) {
  const { playNav } = useAudio();
  const LOGO_TEXT = "SANDY QI";
  const [hovered, setHovered] = useState(false);
  const [displayChars, setDisplayChars] = useState(LOGO_TEXT.split(""));
  const [charWidths, setCharWidths] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const computedColor = color;

  useEffect(() => {
    const measure = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = `400 24px "Silkscreen", system-ui, sans-serif`;
      setCharWidths(
        LOGO_TEXT.split("").map((ch) => ctx.measureText(ch === " " ? " " : ch).width)
      );
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    } else {
      measure();
    }
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const scramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let frame = 0;
    const chars = LOGO_TEXT.split("");
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
        setDisplayChars(LOGO_TEXT.split(""));
      }
    }, 45);
  };

  const handleEnter = () => {
    setHovered(true);
    scramble();
  };

  const handleLeave = () => {
    setHovered(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayChars(LOGO_TEXT.split(""));
  };

  return (
    <button
      onClick={() => { playNav(); onClick(); }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}
    >
      {displayChars.map((ch, i) => (
        <span
          key={i}
          style={{
            fontFamily: "var(--font-silkscreen)",
            fontWeight: 400,
            fontSize: 24,
            color: computedColor,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            transition: "color 0.15s",
            display: "inline-block",
            textAlign: "center",
            width: charWidths[i] != null ? charWidths[i] : "auto",
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </button>
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
  projectsActive = false,
  isLightNav = false,
  forceLight = false,
  mobileBgColor = "#E5E0D7",
  showSound = false,
  onLogoClick,
  blurTop = false,
  blurBottom = false,
}: PortfolioNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { muted, setMuted } = useAudio();

  const isHome = pathname === "/home";
  const isProject = pathname.startsWith("/project/");
  const isAbout = pathname === "/about";
  const [exiting, setExiting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projectsAnchored, setProjectsAnchored] = useState(false);
  const [vw, setVw] = useState(1200);

  const isMobile = vw < 768;

  useEffect(() => {
    // Use clientWidth, not innerWidth: iOS Safari inflates window.innerWidth when
    // any content overflows horizontally, which would wrongly flip us to the
    // desktop nav (and push the right-hand controls off-screen). clientWidth
    // always reports the true layout width.
    const update = () => setVw(document.documentElement.clientWidth || window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
      if (window.scrollY < 50) setProjectsAnchored(false);
    };
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

  // While floating over the cover image (isLightNav) the nav ink is pinned to
  // whatever is legible on that cover — dark ink for a bright cover (forceLight),
  // light ink for a dark cover — regardless of theme, since the cover never
  // changes. Once scrolled onto the body it follows the theme.
  const ink = isLightNav
    ? (forceLight ? "#161719" : "#F8F8F8")
    : "var(--color-on-surface-primary)";
  const hamburgerColor = ink;
  const navLinkColor = ink;

  const frostBg = mobileBgColor.startsWith("#")
    ? hexToRgba(mobileBgColor, 0.75)
    : `color-mix(in srgb, ${mobileBgColor} 80%, transparent)`;
  const subtleBg = "transparent";

  const showFrost = isProject ? !isLightNav : (blurTop || (isMobile && scrolled));
  const navBg = showFrost ? frostBg : (isProject ? subtleBg : "transparent");
  const navBlur = (showFrost || isProject) ? "blur(8px)" : "none";

  const projectsNavLink =
    typeof projectsAction === "string" ? (
      <NavLink href={projectsAction} color={navLinkColor}>
        Projects
      </NavLink>
    ) : (
      <NavLink
        onClick={() => {
          (projectsAction as () => void)();
          setProjectsAnchored(true);
          setMenuOpen(false);
        }}
        color={navLinkColor}
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
              backgroundColor: mobileBgColor.startsWith("#") ? hexToRgba(mobileBgColor, 0.88) : `color-mix(in srgb, ${mobileBgColor} 88%, transparent)`,
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingTop: "35vh",
              paddingLeft: 36,
              gap: 0,
            }}
          >
            {[
              { label: "Home", active: isHome, action: () => { router.push("/home"); setMenuOpen(false); } },
              {
                label: "Projects", active: isProject || (isHome && (projectsAnchored || projectsActive)), action: () => {
                  if (typeof projectsAction === "string") router.push(projectsAction);
                  else (projectsAction as () => void)();
                  setMenuOpen(false);
                },
              },
              { label: "About", active: isAbout, action: () => { router.push("/about"); setMenuOpen(false); } },
              { label: "Exit", active: false, action: handleLogoClick },
            ].map(({ label, active, action }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.06 + i * 0.07 }}
              >
                <MenuLink onClick={action} active={active}>{label}</MenuLink>
              </motion.div>
            ))}

            {/* Bottom row: email left, LinkedIn right */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.32 }}
              style={{
                position: "absolute",
                bottom: 40,
                left: 36,
                right: 36,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <MenuEmailLink />
              <LinkedInButton />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 72, zIndex: 100 }}>
        {/* Blur layer — mask fades out toward the bottom edge */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: navBg,
            backdropFilter: navBlur,
            WebkitBackdropFilter: navBlur,
            maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
            transition: "background 0.3s ease, backdrop-filter 0.3s ease",
          }}
        />
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "0 12px 0 24px" : "0 24px 0 36px",
          }}
        >
        <LogoButton onClick={handleLogoClick} color={ink} />

        {isMobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ position: "relative", top: -2, left: 4 }}>
              <ThemeToggle color={ink} />
            </div>
            {showSound && (
              <div style={{ position: "relative", top: -2 }}>
                <SoundToggle muted={muted} onClick={() => setMuted(!muted)} color={navLinkColor} />
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
            <div style={{ position: "relative", top: -2, display: "inline-block" }}>
              {projectsNavLink}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: projectsAnchored || projectsActive ? 1 : 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  bottom: -5,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: "var(--color-nav-underline)",
                  transformOrigin: "left",
                }}
              />
            </div>
            <div style={{ position: "relative", top: -2, left: 4 }}>
              <ThemeToggle color={ink} />
            </div>
            {showSound && (
              <div style={{ position: "relative", top: -2 }}>
                <SoundToggle muted={muted} onClick={() => setMuted(!muted)} color={navLinkColor} />
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Bottom nav — desktop only */}
      {!isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 72, zIndex: 100, pointerEvents: "none" }}>
          {/* Blur layer — mask fades out toward the top edge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: blurBottom ? frostBg : "transparent",
              backdropFilter: blurBottom ? "blur(8px)" : "none",
              WebkitBackdropFilter: blurBottom ? "blur(8px)" : "none",
              maskImage: "linear-gradient(to top, black 50%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, black 50%, transparent 100%)",
              transition: "background 0.3s ease, backdrop-filter 0.3s ease",
            }}
          />
          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 36px",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 300,
                fontSize: 10,
                color: ink,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              © Sandy Qi 2026
            </span>
            <div style={{ pointerEvents: "auto", position: "relative", display: "inline-block" }}>
              <NavLink href="/about" color={ink}>
                About
              </NavLink>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isAbout ? 1 : 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  bottom: -5,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: "var(--color-nav-underline)",
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
