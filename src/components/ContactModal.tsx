"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/contexts/AudioContext";

// ─── Palette ──────────────────────────────────────────────────────────────────

const CARD_BG = "#FBD5E8";      // pink card (same in light + dark)
const INK = "#0034FF";          // blue ink for art, text, button fill
const PAPER = "#F8F8F8";        // off-white button text/icon
const COFFEE_HOVER = "#FF82B8"; // coffee art hover

// ─── Coffee cup dot art ─────────────────────────────────────────────────────
// Dot coordinates lifted from the Figma "new coffee" art (viewBox 126×136).

const COFFEE_R = 2.73826;
const COFFEE_DOTS: [number, number][] = [
  [24.6439, 133.261], [24.6439, 121.396], [24.6439, 109.53], [24.6439, 97.6645], [24.6439, 85.7982], [24.6439, 73.933], [24.6439, 62.0667], [24.6439, 38.3351],
  [57.5033, 133.261], [57.5033, 121.396], [57.5033, 109.53], [57.5033, 97.6645], [57.5033, 85.7982], [57.5033, 73.933], [57.5033, 62.0667], [57.5033, 38.3351],
  [35.5977, 133.261], [35.5977, 121.396], [35.5977, 109.53], [35.5977, 97.6645], [35.5977, 85.7982], [35.5977, 73.933], [35.5977, 62.0667], [35.5977, 38.3351], [35.5977, 26.4698],
  [57.5033, 26.4698], [46.5505, 14.6036], [68.4561, 14.6036], [35.5977, 2.73826], [57.5033, 2.73826],
  [68.4561, 133.261], [68.4561, 121.396], [68.4561, 109.53], [68.4561, 97.6645], [68.4561, 85.7982], [68.4561, 73.933], [68.4561, 62.0667], [68.4561, 38.3351],
  [46.5505, 133.261], [46.5505, 121.396], [46.5505, 109.53], [46.5505, 97.6645], [46.5505, 85.7982], [46.5505, 73.933], [46.5505, 62.0667], [46.5505, 38.3351],
  [79.4098, 121.396], [79.4098, 109.53], [101.315, 109.53], [112.269, 97.6645], [112.269, 73.933], [101.315, 62.0667], [79.4098, 97.6645], [79.4098, 85.7982], [79.4098, 73.933], [79.4098, 62.0667], [79.4098, 38.3351],
  [13.6911, 121.396], [13.6911, 109.53], [13.6911, 97.6645], [13.6911, 85.7982], [13.6911, 73.933], [13.6911, 62.0667], [13.6911, 38.3351],
  [2.73826, 109.53], [2.73826, 97.6645], [2.73826, 85.7982], [2.73826, 73.933], [2.73826, 62.0667], [2.73826, 50.2014],
  [90.3626, 50.2014], [90.3626, 109.53], [112.269, 109.53], [123.222, 97.6645], [123.222, 85.7982], [123.222, 73.933], [112.269, 62.0667], [90.3626, 97.6645], [90.3626, 85.7982], [90.3626, 73.933], [90.3626, 62.0667],
];

function CoffeeCupDots() {
  const [hovered, setHovered] = useState(false);
  const { muted } = useAudio();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    fetch("/talk.mp3")
      .then(r => r.arrayBuffer())
      .then(ab => ctx.decodeAudioData(ab))
      .then(buf => { bufferRef.current = buf; })
      .catch(() => {});
    return () => { ctx.close(); };
  }, []);

  const handleClick = () => {
    if (muted) return;
    const ctx = audioCtxRef.current;
    const buffer = bufferRef.current;
    if (!ctx || !buffer) return;
    ctx.resume().then(() => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 5;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    });
  };

  return (
    <svg
      width="126" height="136" viewBox="0 0 126 136" fill="none"
      style={{ display: "block", cursor: "pointer", color: hovered ? COFFEE_HOVER : INK }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {COFFEE_DOTS.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx} cy={cy} r={COFFEE_R}
          fill="currentColor"
          style={{ transition: "fill 0.12s" }}
        />
      ))}
    </svg>
  );
}

// ─── Email button ─────────────────────────────────────────────────────────────

function CopyIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="23" viewBox="0 0 24 23" fill="none" style={{ flexShrink: 0 }}>
      <rect x="7.55459" y="6.51176" width="15.6741" height="15.6741" rx="4.37312" stroke={color} strokeWidth="1.54345" />
      <path d="M3.81985 15.3757C4.2483 15.5534 4.71936 15.6524 5.21746 15.6524V17.2176C4.50983 17.2176 3.83545 17.0759 3.22015 16.8207L3.81985 15.3757ZM6.91313 15.6524V17.2176H5.21746V15.6524H6.91313ZM0 12.0001V10.3045H1.56524V12.0001C1.56524 12.4982 1.66423 12.9693 1.8419 13.3978L0.396404 13.9969C0.17381 13.4601 0.0375291 12.8783 0.00662372 12.2687L0 12.0001ZM0 5.21746C2.06352e-08 4.5099 0.141225 3.8354 0.396404 3.22015L1.8419 3.81985C1.66423 4.2483 1.56524 4.71936 1.56524 5.21746V6.91313H0V5.21746ZM17.2176 6.91313H15.6524V5.21746C15.6524 4.71936 15.5534 4.2483 15.3757 3.81985L16.8207 3.22015C17.0759 3.83545 17.2176 4.50983 17.2176 5.21746V6.91313ZM6.91313 0V1.56524H5.21746C4.71936 1.56524 4.2483 1.66423 3.81985 1.8419L3.22015 0.396404C3.8354 0.141225 4.5099 2.06346e-08 5.21746 0H6.91313ZM12.2687 0.00662372C12.8783 0.0375291 13.4601 0.17381 13.9969 0.396404L13.3978 1.8419C12.9693 1.66423 12.4982 1.56524 12.0001 1.56524H10.3045V0H12.0001L12.2687 0.00662372Z" fill={color} />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmailButton({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  const [hovered, setHovered] = useState(false);

  // Hover inverts the button's own two colors.
  const bg = hovered ? PAPER : INK;
  const fg = hovered ? INK : PAPER;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ backgroundColor: bg }}
      transition={{ duration: 0.12 }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "12px 24px",
        borderRadius: 16,
        border: "none",
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Width-stable label: invisible spacer reserves the email's width */}
      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 400, fontSize: 14, whiteSpace: "nowrap", visibility: "hidden" }}>
          sandra.jxq@gmail.com
        </span>
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-space-grotesk)", fontWeight: 400, fontSize: 14, whiteSpace: "nowrap",
          color: fg, transition: "color 0.12s",
          transform: copied ? "translateX(8px)" : "none",
        }}>
          {copied ? "copied email" : "sandra.jxq@gmail.com"}
        </span>
      </div>
      <div style={{
        transition: "color 0.12s", color: fg,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 24, height: 23, flexShrink: 0,
      }}>
        {copied ? <CheckIcon color={fg} /> : <CopyIcon color={fg} />}
      </div>
    </motion.button>
  );
}

// ─── Coffee rain easter egg ───────────────────────────────────────────────────

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

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const { muted } = useAudio();
  const bellRef = useRef<HTMLAudioElement | null>(null);
  const beansRef = useRef<HTMLAudioElement | null>(null);
  const closeRef = useRef<HTMLAudioElement | null>(null);
  const beansTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);
  const [rainKey, setRainKey] = useState(0);

  useEffect(() => {
    bellRef.current = new Audio("/bell.mp3");
    beansRef.current = new Audio("/beans.mp3");
    closeRef.current = new Audio("/close-2.mp3");
    return () => { if (beansTimerRef.current) clearTimeout(beansTimerRef.current); };
  }, []);

  const handleClose = () => {
    if (closeRef.current && !muted) {
      closeRef.current.currentTime = 0;
      closeRef.current.play().catch(() => {});
    }
    onClose();
  };

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
                  backgroundColor: CARD_BG,
                  borderRadius: 20,
                  padding: "48px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 32,
                  width: 300,
                  maxWidth: "calc(100vw - 32px)",
                  maxHeight: "calc(100dvh - 64px)",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                {/* Close button */}
                <button
                  onClick={handleClose}
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
                    color: INK,
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: 15,
                    lineHeight: 1,
                    zIndex: 1,
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(0,52,255,0.12)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  ✕
                </button>

                {/* Coffee cup dot art — right-aligned in a 150px box */}
                <div style={{ width: 150, display: "flex", justifyContent: "flex-end" }}>
                  <CoffeeCupDots />
                </div>

                {/* Title + subtitle */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  alignSelf: "stretch",
                }}>
                  <span style={{
                    fontFamily: "var(--font-silkscreen)",
                    fontWeight: 400,
                    fontSize: 47,
                    letterSpacing: "-0.1em",
                    color: INK,
                    textAlign: "center",
                    lineHeight: 1,
                  }}>
                    Coffee?
                  </span>
                  <span style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 300,
                    fontSize: 14,
                    color: INK,
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}>
                    Or whatever floats your goat...
                  </span>
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
