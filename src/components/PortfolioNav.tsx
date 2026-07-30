"use client";

import { useRef, useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";
import TransitionOverlay from "./TransitionOverlay";
import { useAudio } from "@/contexts/AudioContext";
import { useScrollLock } from "@/hooks/useScrollLock";

const BROWN = "#4E3A34";
const TEXT_NAV = "#232122";
const HOVER_COLOR = "#72503C";
const NAV_LIGHT = "#F3F2F0";
const DARK_RED = "#AE1819";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Smooth eased fade for the frosted nav's edge — many alpha stops approximating
// an ease curve, so the blur tapers off gently with no kink/banding (unlike a
// plain `black 50%, transparent 100%` linear ramp).
const FADE_STOPS =
  "rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.96) 49%, rgba(0,0,0,0.88) 57%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.58) 72%, rgba(0,0,0,0.4) 79%, rgba(0,0,0,0.24) 86%, rgba(0,0,0,0.11) 93%, rgba(0,0,0,0.03) 97%, rgba(0,0,0,0) 100%";
const FADE_MASK_TOP = `linear-gradient(to bottom, ${FADE_STOPS})`;
const FADE_MASK_BOTTOM = `linear-gradient(to top, ${FADE_STOPS})`;

// Mobile-menu level items — "L{n} / {name}", each linking to /project/{n}.
const LEVELS: { n: number; name: string }[] = [
  { n: 1, name: "Moomoo" },
  { n: 2, name: "Beem App" },
  { n: 3, name: "Beemlantis" },
  { n: 4, name: "Totally Beem" },
  { n: 5, name: "AP+ Portals" },
  { n: 6, name: "Beem Beeps" },
];

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
          fontSize: 64,
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

// Level link — a small "L{n}" index (Space Grotesk Light) next to the project
// name at the full menu size. Same hover (indent + colour) + active behaviour.
function LevelLink({ label, name, onClick, active }: { label: string; name: string; onClick: () => void; active?: boolean }) {
  const { playNav } = useAudio();
  const [hovered, setHovered] = useState(false);
  const INDENT = 24;
  const color = (active || hovered) ? "var(--color-interactive-hover)" : "var(--color-on-surface-primary)";
  return (
    <button
      onClick={() => { playNav(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "block", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
    >
      <motion.div
        animate={{ x: hovered ? INDENT : 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
      >
        <span
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 300,
            fontSize: "10pt",
            lineHeight: 1,
            whiteSpace: "nowrap",
            color,
            transition: "color 0.15s",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 500,
            fontSize: 64,
            letterSpacing: "-0.055em",
            lineHeight: 0.88,
            whiteSpace: "nowrap",
            color,
            transition: "color 0.15s",
          }}
        >
          {name}
        </span>
      </motion.div>
    </button>
  );
}

// The illustrated "sandy" wordmark. The letters use currentColor so they
// follow the nav's ink (theme-aware — white in dark, near-black in light); the
// sparkle stays the pink feature accent. On hover the whole wordmark shifts to
// the pink accent (a colour change in place of the old scramble).
function LogoButton({ onClick, color }: { onClick: () => void; color: string }) {
  const { playNav } = useAudio();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => { playNav(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="sandy — home"
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
    >
      <svg
        width={114}
        height={28}
        viewBox="0 0 126 31"
        fill="none"
        aria-hidden
        style={{ display: "block", color: hovered ? "var(--color-feature-primary)" : color, transition: "color 0.2s" }}
      >
        <path d="M8.09383 9.44103C8.60077 9.26742 9.02852 9.20861 9.53138 9.11011C11.3346 8.75915 13.2361 8.81448 14.9119 9.62869C16.8958 10.5926 16.8441 13.5449 15.0739 14.6817C14.9137 14.7847 14.1221 14.2773 13.9335 14.1841C12.7933 13.6203 11.415 13.2229 10.1543 13.5872C9.61396 13.7433 9.23512 14.3001 10.0031 14.5252C10.4476 14.6481 10.9095 14.6769 11.3637 14.7468C13.3382 15.0505 15.8937 15.4133 16.7205 17.5457C17.1691 18.7025 17.3128 20.032 16.7871 21.1887C16.1292 22.6362 14.7729 23.642 13.3447 24.2552C12.9827 24.4109 12.5974 24.5428 12.2285 24.6807C11.5781 24.9019 10.9711 25.0301 10.3035 25.1616C8.35101 25.5459 6.0994 25.6837 4.33716 24.5959C3.22765 23.9109 2.67161 22.5969 3.06283 21.3348C3.21603 20.8405 3.6302 20.1528 4.10582 19.9091C4.37608 19.9188 4.74107 20.1583 5.03363 20.2715C6.40561 20.7945 7.98378 21.1969 9.43479 20.7687C9.9993 20.6021 10.0412 20.173 9.49349 19.9537C9.0926 19.8146 8.6236 19.7617 8.20593 19.6922C6.22616 19.3625 4.23222 18.7734 3.50566 16.6754C3.04288 15.339 2.97855 14.0689 3.62443 12.7725C4.52892 10.9569 6.26224 10.067 8.09383 9.44103Z" fill="currentColor" />
        <path d="M36.8717 6.7343C37.392 6.46636 37.6931 6.43955 38.2376 6.3603C40.1183 6.0767 41.9955 6.81415 42.6337 8.72091C42.8378 9.33056 42.7812 9.24147 43.1136 8.79569C44.3052 7.19722 45.9801 6.04956 48.0214 5.96943C49.1729 5.92424 50.2304 6.02013 51.1993 6.73053C53.4816 8.39901 53.0113 11.6539 52.3275 14.0107C52.1058 14.7747 51.9483 15.6724 51.725 16.4514C51.5918 16.9163 51.5024 17.6532 51.4989 18.1202C51.4933 18.8797 51.9812 19.265 52.6137 19.5603C52.7495 19.6281 52.1782 20.5091 52.0857 20.5825C51.3771 21.3388 50.3589 21.7858 49.328 21.8447C48.0338 21.928 46.3163 21.9832 45.2852 21.0654C43.5691 19.5381 44.5458 16.9667 44.9966 15.0938C45.1943 14.2723 45.7907 12.6766 45.0282 11.9811C44.3802 11.4992 43.3636 11.6933 42.911 12.3499C42.7881 12.5282 42.6512 13.5088 42.5982 13.7788L41.8264 17.5244C41.5638 18.7528 41.4368 19.9477 40.6002 20.9652C40.4614 20.8968 40.4398 20.9761 40.335 21.0794C40.2902 21.1084 39.9771 21.3553 39.9704 21.387C39.965 21.4125 39.9655 21.4406 39.9655 21.4666C39.7653 21.5591 39.5717 21.6437 39.3554 21.6931C38.6332 21.8578 37.2521 21.864 36.52 21.7119C35.8762 21.5782 35.165 21.2238 34.7956 20.6575C34.5294 20.2495 34.4301 19.683 34.4502 19.2031C34.4738 18.6405 34.6119 18.0691 34.7234 17.5187L35.2064 15.158L36.8717 6.7343Z" fill="currentColor" />
        <path d="M78.087 28.9971C78.0268 29.0614 77.8544 29.1578 77.7717 29.2156C76.9549 29.7647 75.9897 30.113 75.0052 30.1515C72.554 30.2468 69.8544 29.5513 69.9434 26.5541C69.9656 25.8087 70.3775 24.961 70.8507 24.3926C70.9477 24.276 71.1235 24.3785 71.2353 24.4204C71.6538 24.6115 72.1131 24.697 72.5652 24.7657C72.7189 24.7885 72.9229 24.7445 73.0774 24.7305C73.6341 24.683 74.1229 24.4567 74.536 24.083C74.7373 23.9118 75.4859 23.1332 75.507 22.8785C75.4816 22.8334 75.2594 22.7289 75.1897 22.6735C74.3105 21.976 74.3456 20.8257 74.2365 19.8285C74.115 18.7176 73.9626 17.6159 73.8879 16.4999C73.8379 15.7526 73.7407 15.0414 73.642 14.3022C73.5482 13.5996 73.4553 12.9966 73.0613 12.3802C72.8492 12.0519 72.5668 11.7978 72.215 11.629C72.0726 11.5608 71.6484 11.4915 71.702 11.2959C71.8862 10.6226 72.4928 9.85624 73.048 9.4455C73.7078 8.95732 74.5679 8.72598 75.3693 8.65254C75.6615 8.61587 75.9259 8.59893 76.2184 8.6449C76.7286 8.72508 77.4073 8.84588 77.8661 9.09279C79.2033 9.81246 79.7598 11.3485 79.9554 12.7705C80.0783 13.6639 79.9873 14.612 80.0522 15.515C80.0644 15.6814 80.0124 16.2056 80.1001 16.3235C80.1751 16.3154 80.1974 16.2445 80.2326 16.1836C80.5094 15.7053 80.7856 15.2061 81.0706 14.7339L83.6013 10.5494C83.8145 10.1969 84.3432 9.18128 84.6184 8.9659C84.8061 8.97547 84.9927 9.00045 85.1763 9.04057C86.4753 9.32228 88.0242 9.85467 88.8313 11.0073C89.2934 11.6672 89.3839 12.5553 89.1966 13.3209C88.9961 14.1404 88.4572 14.9815 87.9649 15.6526C87.1934 16.7878 86.4032 17.895 85.6484 19.0408C85.3043 19.5631 84.8941 20.0926 84.5351 20.6111L81.6574 24.7871C81.103 25.5864 80.5035 26.4831 79.9007 27.2441C79.5304 27.7063 79.1206 28.1355 78.6758 28.5265C78.5964 28.5952 78.5291 28.6708 78.4404 28.7271C78.2701 28.7562 78.0931 28.7804 78.087 28.9971Z" fill="currentColor" />
        <path d="M113.319 20.5556C113.457 20.3725 113.393 20.1399 113.442 19.9321C113.505 19.6921 113.529 19.4379 113.581 19.1994C113.755 18.4027 113.949 17.6285 114.097 16.8263C114.252 15.9905 114.508 15.1597 114.659 14.321C114.707 14.0574 114.832 13.7431 114.884 13.4737C114.949 12.9298 115.098 12.4474 115.225 11.9218C115.525 10.6786 116.186 9.1991 117.634 9.04901C118.728 8.93573 120.123 8.9002 121.126 9.39446C121.697 9.67594 122.24 10.2894 122.271 10.9519C122.289 11.2093 122.252 11.4389 122.261 11.6796C122.293 12.5275 122.027 13.3128 121.848 14.131L120.968 18.0226C120.936 18.1632 120.787 19.0656 120.748 19.1118L120.694 19.1048C120.61 19.179 120.566 19.4918 120.593 19.5934L120.605 19.5999L120.621 19.5737L120.638 19.5963C120.386 20.5957 120.034 22.1334 121.055 22.7877C121.164 22.857 121.257 22.9155 121.348 23.0087C121.097 23.915 119.624 24.6079 118.745 24.6206C118.66 24.6078 118.408 24.6113 118.307 24.6099C117.984 24.6041 117.661 24.6019 117.338 24.6037C117.046 24.6043 116.605 24.5809 116.335 24.6009C116.283 24.6021 116.081 24.5623 116.022 24.5511C115.442 24.4434 114.989 24.2533 114.525 23.8948L114.513 23.8326C114.479 23.8157 114.1 23.3771 114.016 23.3015C113.963 23.2944 113.983 23.293 113.932 23.3139C113.886 23.1997 113.744 23.0506 113.694 22.9181C113.609 22.6912 113.499 22.4273 113.439 22.1944C113.408 22.0661 113.41 21.9173 113.379 21.7909C113.28 21.3784 113.31 20.9778 113.319 20.5556ZM120.289 21.279C120.302 21.1937 120.332 21.0164 120.285 20.9401C120.275 21.0323 120.258 21.19 120.289 21.279Z" fill="currentColor" />
        <path d="M117.138 3.51608C117.043 3.25198 117.33 3.01332 117.572 3.15519L118.456 3.6724C119.301 4.16753 120.323 4.26162 121.245 3.92924L122.207 3.58204C122.471 3.4868 122.71 3.77387 122.568 4.01614L122.051 4.89936C121.556 5.74486 121.462 6.76658 121.794 7.68829L122.141 8.65111C122.237 8.91521 121.95 9.15387 121.707 9.012L120.824 8.49479C119.979 7.99966 118.957 7.90557 118.035 8.23795L117.072 8.58515C116.808 8.68039 116.57 8.39331 116.711 8.15105L117.229 7.26783C117.724 6.42233 117.818 5.40061 117.485 4.4789L117.138 3.51608Z" style={{ fill: "var(--color-feature-primary)" }} />
        <path d="M30.5318 7.13092C31.4643 6.71659 33.2286 6.43786 34.1982 6.83561C34.2985 6.87679 34.6459 7.03894 34.667 7.13779C34.7634 7.60314 34.6297 8.22169 34.6093 8.67318C34.5809 9.30445 34.4923 9.89266 34.4378 10.5028L34.0033 15.2655L33.8195 17.0448C33.736 17.8931 33.6666 18.8184 33.9507 19.6476C34.0611 19.969 34.4539 20.2455 34.7448 20.3617C34.7723 20.3987 34.8109 20.4437 34.8406 20.4803C34.835 20.5165 34.8286 20.5532 34.8214 20.5889C34.7201 21.0794 34.1916 21.6293 33.8009 21.8862C32.8906 22.4847 31.5577 22.6043 30.504 22.5766C30.2885 22.5709 29.7977 22.4624 29.5838 22.4089C28.8575 22.0801 28.2118 21.6364 27.8683 20.8372C27.7828 20.6381 27.6935 20.2815 27.5863 20.1296L27.5609 20.1308C27.3537 20.3513 27.3156 20.5915 27.1608 20.8187C27.0437 20.9904 26.8643 21.2952 26.741 21.4468C25.9616 22.4036 24.983 23.0931 23.8102 23.3476C23.5737 23.3989 23.3016 23.4193 23.0644 23.4484C21.7794 23.6056 20.8225 23.3985 19.7444 22.6141C18.5235 21.7256 17.8587 20.1932 17.5806 18.6811C17.2335 16.7929 17.5474 14.2846 18.1714 12.5016C18.4037 11.838 18.8754 10.9619 19.2496 10.3774C19.5413 9.92182 19.9362 9.4797 20.3166 9.11113C21.4777 7.98626 22.3047 7.69337 23.7956 7.39312C24.0384 7.34537 24.2127 7.36326 24.4522 7.35148C25.9682 7.27678 27.5898 7.97027 28.3675 9.44281C28.4924 9.22327 28.6268 8.94025 28.7517 8.72638C29.0825 8.16016 29.946 7.39128 30.5318 7.13092ZM25.7342 12.4527C25.6659 12.255 25.3874 12.2511 25.313 12.4467L25.0413 13.1597C24.7815 13.8427 24.232 14.3755 23.5411 14.6134L22.8191 14.8617C22.6215 14.93 22.6168 15.2084 22.8121 15.2829L23.526 15.5536C24.2089 15.8134 24.7418 16.363 24.9797 17.0538L25.2281 17.7758C25.2962 17.9737 25.5737 17.9783 25.6482 17.7828L25.9199 17.0689C26.1797 16.3861 26.7294 15.854 27.4202 15.6162L28.1422 15.3678C28.3401 15.2997 28.3446 15.0212 28.1491 14.9467L27.4352 14.675C26.7524 14.4152 26.2203 13.8656 25.9825 13.1747L25.7342 12.4527Z" fill="currentColor" />
        <path d="M69.9292 1.59522C72.1644 1.59812 73.7365 2.63595 73.1228 5.05521C72.9454 5.75422 72.7501 6.59612 72.5632 7.3263L71.6727 10.7379L70.0177 17.0718C69.7386 18.1435 69.2717 19.3627 69.3553 20.4587C69.4082 21.1494 69.8058 21.3753 70.2771 21.7669C69.9968 22.5818 68.7409 23.1676 67.926 23.2606C65.8764 23.494 63.3669 23.0885 62.7708 20.7591C62.7409 20.6424 62.7162 20.3056 62.5994 20.2688C62.5134 20.3509 62.4106 20.5961 62.3309 20.7057C62.1456 20.9606 61.9241 21.23 61.6954 21.4449C61.5058 21.6353 61.2674 21.7644 61.057 21.9246C60.2109 22.569 59.1646 22.9084 58.0861 22.8694C56.5125 22.8151 55.5597 22.5598 54.3283 21.5462C52.9595 20.4194 52.5937 18.8385 52.4522 17.1531C52.3049 15.3954 52.7907 13.7406 53.3902 12.1222C54.3577 9.51066 56.8298 7.14868 59.7234 7.08008C61.4582 7.02838 63.0241 7.48425 64.2573 8.76549C64.3672 8.87987 64.709 9.39661 64.7948 9.40355C64.9806 9.14387 65.4346 6.82447 65.6215 6.25418C66.0253 5.0229 66.1512 3.5892 67.0239 2.51754C67.6156 1.79104 68.1462 1.65745 69.0284 1.56489C69.3101 1.56369 69.665 1.5949 69.9292 1.59522ZM61.6656 12.2952C61.6308 12.089 61.3579 12.039 61.2522 12.2196L60.866 12.8782C60.4969 13.5088 59.8671 13.9436 59.1464 14.064L58.3941 14.1892C58.1876 14.2237 58.1367 14.4977 58.3174 14.6035L58.976 14.9887C59.6066 15.3577 60.0414 15.9877 60.1619 16.7083L60.287 17.4616C60.3215 17.668 60.5954 17.7185 60.7013 17.5383L61.0866 16.8787C61.4557 16.248 62.0864 15.8143 62.8071 15.6939L63.5595 15.5677C63.766 15.5332 63.8168 15.2592 63.6361 15.1534L62.9766 14.7681C62.3461 14.399 61.9121 13.7691 61.7917 13.0486L61.6656 12.2952Z" fill="currentColor" />
        <path d="M112.283 8.40796C112.999 8.42354 114.239 8.50964 114.719 9.11342C114.709 9.82944 114.549 10.4498 114.393 11.1405L114.018 12.805C113.869 13.4399 113.754 14.1367 113.616 14.7769C113.541 15.1255 113.442 15.4698 113.367 15.8186L112.327 20.7524C112.25 21.1128 112.122 21.4694 112.049 21.8245L111.426 24.7364C111.097 26.3233 110.78 28.9239 108.876 29.4089C108.311 29.5527 106.479 29.5136 105.913 29.3827C103.186 28.7501 103.996 26.2323 104.395 24.2543C104.44 24.0354 104.812 22.6263 104.732 22.4845C104.635 22.5017 104.414 22.734 104.311 22.8144C104.223 22.8361 104.211 22.8706 104.154 22.869L104.173 22.8529C103.954 22.9797 103.917 23.0126 103.731 23.1868C103.728 23.2123 103.724 23.2544 103.718 23.2778C103.241 23.679 102.222 23.9477 101.592 23.9901C100.083 24.0866 98.5957 23.8502 97.4177 22.8338C96.8992 22.3863 96.578 22.0107 96.2257 21.4322C95.6426 20.4746 95.3437 19.1643 95.3137 18.0493C95.2675 15.7644 95.8072 13.4564 97.0409 11.5232C98.307 9.53928 100.132 8.22598 102.53 8.11566C104.484 8.0259 106.347 8.78128 107.48 10.4166C107.547 10.5127 107.643 10.6978 107.72 10.7658C107.835 10.7782 107.832 10.6672 107.885 10.5742C108.804 8.97994 110.52 8.36966 112.283 8.40796ZM104.692 13.6086C104.651 13.4034 104.375 13.3613 104.275 13.5451L103.911 14.2159C103.563 14.8582 102.947 15.3132 102.231 15.457L101.483 15.6068C101.277 15.648 101.236 15.9237 101.42 16.0235L102.091 16.3869C102.733 16.7353 103.187 17.3515 103.331 18.068L103.482 18.8163C103.523 19.0214 103.799 19.0628 103.899 18.8788L104.262 18.2079C104.61 17.5655 105.226 17.1105 105.942 16.9667L106.69 16.8169C106.896 16.7757 106.938 16.5003 106.754 16.4004L106.082 16.0368C105.44 15.6885 104.986 15.0729 104.842 14.3567L104.692 13.6086Z" fill="currentColor" />
      </svg>
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
  const [isPending, startTransition] = useTransition();
  const [navLoading, setNavLoading] = useState(false);
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

  useScrollLock(menuOpen);

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

  // Mobile-menu navigation: wrap the route change in a transition so we can
  // detect when it's still pending. Only reveal the full-screen sparkle overlay
  // once the navigation has stayed pending past a short threshold — instant
  // navigations don't flash it. (Same overlay as the cover → home transition.)
  const navigate = (target: string | (() => void)) => {
    setMenuOpen(false);
    startTransition(() => {
      if (typeof target === "string") router.push(target);
      else target();
    });
  };

  useEffect(() => {
    if (!isPending) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNavLoading(false);
      return;
    }
    const t = setTimeout(() => setNavLoading(true), 150);
    return () => clearTimeout(t);
  }, [isPending]);

  // While floating over the cover image (isLightNav) the nav ink is pinned to
  // whatever is legible on that cover — dark ink for a bright cover (forceLight),
  // light ink for a dark cover — regardless of theme, since the cover never
  // changes. Once scrolled onto the body it follows the theme.
  const ink = isLightNav
    ? (forceLight ? "#161719" : "#F8F8F8")
    : "var(--color-on-surface-primary)";
  const hamburgerColor = ink;
  const navLinkColor = ink;

  // The bottom nav sits at the viewport bottom, always over the page body
  // surface — never over the cover (the hero is 100svh-64px and the bottom nav
  // is desktop-only). So it must follow the body ink, not the cover-based `ink`;
  // otherwise a light-cover project's dark ink lands on the dark body (dark
  // mode) — or a dark-cover project's light ink on the light body (light mode)
  // — and the copyright + About text becomes invisible at default load.
  const bottomInk = "var(--color-on-surface-primary)";

  const frostBg = mobileBgColor.startsWith("#")
    ? hexToRgba(mobileBgColor, 0.45)
    : `color-mix(in srgb, ${mobileBgColor} 50%, transparent)`;
  const subtleBg = "transparent";

  const showFrost = isProject ? !isLightNav : (blurTop || (isMobile && scrolled));
  const navBg = showFrost ? frostBg : (isProject ? subtleBg : "transparent");
  const navBlur = (showFrost || isProject) ? "blur(6px)" : "none";

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
      {/* Full-screen sparkle overlay — logo/Exit exit, or a slow menu navigation */}
      <TransitionOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting || navLoading ? 1 : 0 }}
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
              // Kill any touch panning / chaining inside the overlay itself.
              touchAction: "none",
              overscrollBehavior: "none",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: 88,
              paddingBottom: 128,
              paddingLeft: 16,
              gap: 0,
            }}
          >
            {/* Home */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.06 }}
            >
              <MenuLink onClick={() => navigate("/home")} active={isHome}>Home</MenuLink>
            </motion.div>

            {/* Levels — small "L{n}" index + project name (menu size). Replaces
                the single "Projects" item; each links to its project page. */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[...LEVELS].reverse().map(({ n, name }, idx) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.12 + idx * 0.04 }}
                >
                  <LevelLink
                    label={`L${n}`}
                    name={name}
                    onClick={() => navigate(`/project/${n}`)}
                    active={pathname === `/project/${n}`}
                  />
                </motion.div>
              ))}
            </div>

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.4 }}
            >
              <MenuLink onClick={() => navigate("/about")} active={isAbout}>About</MenuLink>
            </motion.div>

            {/* Exit */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.46 }}
            >
              <MenuLink onClick={handleLogoClick} active={false}>Exit</MenuLink>
            </motion.div>

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
        {/* Blur layer — smoothly fades out toward the bottom edge */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: navBg,
            backdropFilter: navBlur,
            WebkitBackdropFilter: navBlur,
            maskImage: FADE_MASK_TOP,
            WebkitMaskImage: FADE_MASK_TOP,
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
          {/* Blur layer — smoothly fades out toward the top edge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: blurBottom ? frostBg : "transparent",
              backdropFilter: blurBottom ? "blur(6px)" : "none",
              WebkitBackdropFilter: blurBottom ? "blur(6px)" : "none",
              maskImage: FADE_MASK_BOTTOM,
              WebkitMaskImage: FADE_MASK_BOTTOM,
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
                color: bottomInk,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              © Sandy Qi 2026
            </span>
            <div style={{ pointerEvents: "auto", position: "relative", display: "inline-block" }}>
              <NavLink href="/about" color={bottomInk}>
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
