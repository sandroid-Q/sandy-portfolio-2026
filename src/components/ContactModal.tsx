"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/contexts/AudioContext";

// ─── Coffee title pixel-art SVG with LED-flicker hover ───────────────────────

const TW = 381, TH = 112, TR = 4.445, TX0 = 6.98514, TY0 = 6.98514, TSTEP = 10.79;

const PINK_SET = new Set([
  "4,2","5,2","8,2","9,2","12,2","13,2","14,2","16,2","17,2","18,2","20,2","21,2","22,2","24,2","25,2","26,2","29,2","30,2",
  "3,3","7,3","10,3","12,3","16,3","20,3","24,3","28,3","31,3",
  "3,4","7,4","10,4","12,4","13,4","14,4","16,4","17,4","18,4","20,4","21,4","22,4","24,4","25,4","26,4","31,4",
  "3,5","7,5","10,5","12,5","16,5","20,5","24,5","29,5","30,5",
  "3,6","7,6","10,6","12,6","16,6","20,6","24,6","29,6",
  "4,7","5,7","8,7","9,7","12,7","16,7","20,7","21,7","22,7","24,7","25,7","26,7",
  "29,8",
]);

const ALL_DOTS: { cx: number; cy: number; isPink: boolean }[] = [];
for (let j = 0; j < 10; j++)
  for (let i = 0; i < 35; i++)
    ALL_DOTS.push({ cx: TX0 + i * TSTEP, cy: TY0 + j * TSTEP, isPink: PINK_SET.has(`${i},${j}`) });

const PINK_INDICES = ALL_DOTS.map((d, i) => d.isPink ? i : -1).filter(i => i >= 0);
const DARK_INDICES = ALL_DOTS.map((d, i) => !d.isPink ? i : -1).filter(i => i >= 0);

function sampleN(arr: number[], n: number): number[] {
  const result: number[] = [];
  const seen = new Set<number>();
  while (result.length < n) {
    const pick = arr[Math.floor(Math.random() * arr.length)];
    if (!seen.has(pick)) { seen.add(pick); result.push(pick); }
  }
  return result;
}

function CoffeeTitleArt() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleEnter = () => {
    if (timerRef.current) return; // already mid-flicker

    const next = new Set<number>();
    // mostly pink→gray flips, a couple dark→pink
    sampleN(PINK_INDICES, 8 + Math.floor(Math.random() * 6)).forEach(i => next.add(i));
    sampleN(DARK_INDICES, 1 + Math.floor(Math.random() * 2)).forEach(i => next.add(i));
    setFlipped(next);

    timerRef.current = setTimeout(() => {
      setFlipped(new Set());
      timerRef.current = null;
    }, 220);
  };

  return (
    <svg
      width={TW} height={TH} viewBox={`0 0 ${TW} ${TH}`}
      fill="none"
      style={{ width: "100%", height: "auto", display: "block", cursor: "default" }}
      onMouseEnter={handleEnter}
    >
      <defs>
        <clipPath id="ct-clip">
          <rect x="2.54014" y="2.54014" width="375.92" height="106.045" rx="3.80838" />
        </clipPath>
      </defs>
      <g clipPath="url(#ct-clip)">
        <rect x="2.54014" y="2.54014" width="375.92" height="106.045" rx="3.80838" fill="#161719" />
        {ALL_DOTS.map((d, i) => (
          <circle
            key={i}
            cx={d.cx} cy={d.cy} r={TR}
            fill={(d.isPink !== flipped.has(i)) ? "#FF82B8" : "#2F3134"}
            style={{ transition: "fill 0.07s" }}
          />
        ))}
      </g>
      <rect x="1.27068" y="1.27068" width="378.459" height="108.584" rx="5.07784"
        stroke="#161719" strokeWidth="2.53892" />
    </svg>
  );
}

function CoffeeCupDots({ onSurface, hoverFill }: { onSurface: string; hoverFill: string }) {
  const R = 3;
  const W = 138;
  const H = 149;
  const [hovered, setHovered] = useState(false);
  const { muted } = useAudio();
  const talkRef = useRef<HTMLAudioElement | null>(null);
  const talkRef2 = useRef<HTMLAudioElement | null>(null);
  const talkRef3 = useRef<HTMLAudioElement | null>(null);
  const talkRef4 = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    talkRef.current = new Audio("/talk.mp3");
    talkRef2.current = new Audio("/talk.mp3");
    talkRef3.current = new Audio("/talk.mp3");
    talkRef4.current = new Audio("/talk.mp3");
  }, []);

  const positions: [number, number][] = [
    // Steam
    [36,0],[60,0],
    [48,13],[72,13],
    [36,26],[60,26],
    // Rim
    [12,39],[24,39],[36,39],[48,39],[60,39],[72,39],[84,39],
    // Left/right walls
    [0,52],[96,52],
    // Body
    [0,65],[12,65],[24,65],[36,65],[48,65],[60,65],[72,65],[84,65],[96,65],[108,65],[120,65],
    [0,78],[12,78],[24,78],[36,78],[48,78],[60,78],[72,78],[84,78],[96,78],[120,78],[132,78],
    [0,91],[12,91],[24,91],[36,91],[48,91],[60,91],[72,91],[84,91],[96,91],[132,91],
    [0,104],[12,104],[24,104],[36,104],[48,104],[60,104],[72,104],[84,104],[96,104],[120,104],[132,104],
    [0,117],[12,117],[24,117],[36,117],[48,117],[60,117],[72,117],[84,117],[96,117],[108,117],[120,117],
    // Base
    [12,130],[24,130],[36,130],[48,130],[60,130],[72,130],[84,130],
    [24,143],[36,143],[48,143],[60,143],[72,143],
  ];

  const handleClick = () => {
    if (muted) return;
    [talkRef, talkRef2, talkRef3, talkRef4].forEach(ref => {
      const t = ref.current;
      if (!t) return;
      t.currentTime = 0;
      t.play().catch(() => {});
    });
  };

  return (
    <svg
      width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ display: "block", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {positions.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x + R} cy={y + R} r={R}
          style={{ fill: hovered ? hoverFill : onSurface, transition: "fill 0.12s" }}
        />
      ))}
    </svg>
  );
}

function EnvelopeIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <rect x="0.6" y="0.6" width="12.8" height="8.8" rx="1.4" stroke={color} strokeWidth="1.2" />
      <path d="M1 1.5L7 5.8L13 1.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ClipboardIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="17" viewBox="0 0 46 44" fill="none" style={{ flexShrink: 0 }}>
      <rect x="14.5" y="12.5" width="30" height="30" rx="8.5" stroke={color} strokeWidth="3" />
      <path d="M7.32129 29.4697C8.14248 29.8103 9.04533 30 10 30V33C8.64374 33 7.35119 32.7284 6.17188 32.2393L7.32129 29.4697ZM13.25 30V33H10V30H13.25ZM0 23V19.75H3V23C3 23.9547 3.18974 24.8575 3.53027 25.6787L0.759766 26.8271C0.333131 25.7982 0.0719299 24.6831 0.0126953 23.5146L0 23ZM0 10C0 8.64387 0.270678 7.3511 0.759766 6.17188L3.53027 7.32129C3.18974 8.14248 3 9.04533 3 10V13.25H0V10ZM33 13.25H30V10C30 9.04533 29.8103 8.14248 29.4697 7.32129L32.2393 6.17188C32.7284 7.35119 33 8.64374 33 10V13.25ZM13.25 0V3H10C9.04533 3 8.14248 3.18974 7.32129 3.53027L6.17188 0.759766C7.3511 0.270678 8.64387 0 10 0H13.25ZM23.5146 0.0126953C24.6831 0.0719299 25.7982 0.333131 26.8271 0.759766L25.6787 3.53027C24.8575 3.18974 23.9547 3 23 3H19.75V0H23L23.5146 0.0126953Z" fill={color} />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmailButton({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        backgroundColor: hovered ? "#F8F8F8" : "#E7EAF1",
        boxShadow: hovered ? "0 0 0 3px #BBC3D5" : "0 0 0 0px transparent",
      }}
      transition={{ duration: 0.12 }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        padding: "6px 16px 6px 6px",
        borderRadius: 9999,
        border: "none",
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Left badge: rounded square with inner circle + envelope icon */}
      <motion.div
        animate={{ backgroundColor: hovered ? "#FF82B8" : "#C8CFDE" }}
        transition={{ duration: 0.12 }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          border: "1.4px solid #161719",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 29,
          height: 29,
          borderRadius: "50%",
          backgroundColor: "#E7EAF1",
          border: "1.6px solid #161719",
        }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <EnvelopeIcon color="#161719" />
        </div>
      </motion.div>

      {/* Right: email text + copy icon, width locked to email address */}
      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        {/* Ghost — preserves width when switching to "copied!" */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, visibility: "hidden" }}>
          <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 400, fontSize: 14, whiteSpace: "nowrap" }}>
            sandra.jxq@gmail.com
          </span>
          <ClipboardIcon color="transparent" />
        </div>
        {/* Actual content */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transform: copied ? "translateX(-2px)" : "none" }}>
          <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 400, fontSize: 14, color: "#161719", whiteSpace: "nowrap" }}>
            {copied ? "copied email" : "sandra.jxq@gmail.com"}
          </span>
          {copied ? <CheckIcon color="#161719" /> : <ClipboardIcon color="#161719" />}
        </div>
      </div>
    </motion.button>
  );
}

const COFFEE_DROPS = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  left: (i / 35) * 96 + (Math.random() - 0.5) * 2.5,
  rotation: Math.random() * 360,
  rotationDelta: (Math.random() - 0.5) * 540,
  delay: Math.random() * 0.7,
  duration: 1.4 + Math.random() * 0.9,
}));

function CoffeeRain({ onDone }: { onDone: () => void }) {
  const screenH = typeof window !== "undefined" ? window.innerHeight : 900;
  const drops = COFFEE_DROPS;

  useEffect(() => {
    const maxMs = Math.max(...drops.map(d => (d.delay + d.duration) * 1000));
    const t = setTimeout(onDone, maxMs + 200);
    return () => clearTimeout(t);
  }, [drops, onDone]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 500, overflow: "hidden" }}>
      {drops.map(drop => (
        <motion.div
          key={drop.id}
          initial={{ y: -80, rotate: drop.rotation }}
          animate={{ y: screenH + 80, rotate: drop.rotation + drop.rotationDelta }}
          transition={{ duration: drop.duration, delay: drop.delay, ease: "easeIn" }}
          style={{ position: "absolute", top: 0, left: `${drop.left}vw`, fontSize: 80, lineHeight: 1 }}
        >
          ☕️
        </motion.div>
      ))}
    </div>
  );
}

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const { muted } = useAudio();
  const bellRef = useRef<HTMLAudioElement | null>(null);
  const beansRef = useRef<HTMLAudioElement | null>(null);
  const beansTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);
  const [rainKey, setRainKey] = useState(0);

  useEffect(() => {
    bellRef.current = new Audio("/bell.mp3");
    beansRef.current = new Audio("/beans.mp3");
    return () => { if (beansTimerRef.current) clearTimeout(beansTimerRef.current); };
  }, []);

  useEffect(() => {
    if (open && bellRef.current && !muted) {
      bellRef.current.currentTime = 0;
      bellRef.current.play().catch(() => {});
    }
  }, [open, muted]);

  const copyEmail = async () => {
    const email = "sandra.jxq@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setRainKey(k => k + 1);
    const beans = beansRef.current;
    if (beans && !muted) {
      beans.currentTime = 0;
      beans.play().catch(() => {});
      if (beansTimerRef.current) clearTimeout(beansTimerRef.current);
      beansTimerRef.current = setTimeout(() => { beans.pause(); beans.currentTime = 0; }, 2000);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {rainKey > 0 && <CoffeeRain key={rainKey} onDone={() => setRainKey(0)} />}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "var(--color-surface-transparent)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                zIndex: 200,
              }}
            />

            {/* Centering shell */}
            <div style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 201,
              pointerEvents: "none",
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{
                  pointerEvents: "auto",
                  position: "relative",
                  backgroundColor: "#C8CFDE",
                  border: "2px solid #5B667D",
                  borderRadius: 0,
                  padding: "56px 40px 80px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 64,
                  width: "fit-content",
                  maxWidth: "calc(100vw - 64px)",
                  maxHeight: "calc(100dvh - 64px)",
                  overflowY: "auto",
                }}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#161719",
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: 15,
                    lineHeight: 1,
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  ✕
                </button>

                {/* Top section: text + dot art */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 48,
                  alignSelf: "stretch",
                }}>
                  {/* Text */}
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    alignSelf: "stretch",
                  }}>
                    <CoffeeTitleArt />
                    <span style={{
                      fontFamily: "var(--font-space-mono), monospace",
                      fontWeight: 400,
                      fontSize: 12,
                      color: "#161719",
                      letterSpacing: "-0.05em",
                      textAlign: "center",
                      lineHeight: 1.5,
                    }}>
                      or whatever floats your goat 🐐
                    </span>
                  </div>

                  {/* Dot art — 172px container, right-aligned within it */}
                  <div style={{ width: 172, display: "flex", justifyContent: "flex-end" }}>
                    <CoffeeCupDots onSurface="#5B667D" hoverFill="#161719" />
                  </div>
                </div>

                {/* Email button */}
                <EmailButton onClick={copyEmail} copied={copied} />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
