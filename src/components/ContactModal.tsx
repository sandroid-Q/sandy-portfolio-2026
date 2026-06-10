"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/contexts/AudioContext";

const BROWN = "#4E3A34";
const BG = "#F3F2F0";
const RED = "#DE211D";

function CoffeeCupDots() {
  const R = 2.5;
  const W = 138;
  const H = 110;
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
    [12,0],[24,0],[36,0],[48,0],[60,0],[72,0],[84,0],
    [0,13],[96,13],
    [0,26],[12,26],[24,26],[36,26],[48,26],[60,26],[72,26],[84,26],[96,26],[108,26],[120,26],
    [0,39],[12,39],[24,39],[36,39],[48,39],[60,39],[72,39],[84,39],[96,39],[120,39],[132,39],
    [0,52],[12,52],[24,52],[36,52],[48,52],[60,52],[72,52],[84,52],[96,52],[132,52],
    [0,65],[12,65],[24,65],[36,65],[48,65],[60,65],[72,65],[84,65],[96,65],[120,65],[132,65],
    [0,78],[12,78],[24,78],[36,78],[48,78],[60,78],[72,78],[84,78],[96,78],[108,78],[120,78],
    [12,91],[24,91],[36,91],[48,91],[60,91],[72,91],[84,91],
    [24,104],[36,104],[48,104],[60,104],[72,104],
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
      style={{ display: "block", cursor: "pointer", transition: "opacity 0.12s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {positions.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x + R} cy={y + R} r={R} fill={hovered ? RED : "#898989"} style={{ transition: "fill 0.12s" }} />
      ))}
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
  const iconColor = copied || hovered ? BG : BROWN;
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        backgroundColor: copied || hovered ? BROWN : BG,
        color: copied || hovered ? BG : BROWN,
        borderColor: BROWN,
      }}
      transition={{ duration: 0.12 }}
      style={{
        border: `2px solid ${BROWN}`,
        fontFamily: "var(--font-space-grotesk)",
        fontWeight: 400,
        fontSize: 13,
        letterSpacing: "0.04em",
        padding: "12px 28px",
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {copied ? "copied" : "sandra.jxq@gmail.com"}
      {copied ? <CheckIcon color={iconColor} /> : <ClipboardIcon color={iconColor} />}
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
              backgroundColor: "rgba(78, 58, 52, 0.55)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              zIndex: 200,
            }}
          />

          {/* Centering shell — keeps Framer Motion's y/scale clean */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 201,
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                pointerEvents: "auto",
                position: "relative",
                backgroundColor: "rgba(243, 242, 240, 0.72)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `2px solid ${BROWN}`,
                padding: "112px 60px 116px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                width: "min(440px, calc(100vw - 48px))",
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
                  color: BROWN,
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: 15,
                  lineHeight: 1,
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D3BA9F")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ✕
              </button>

              {/* Coffee cup speaker grill */}
              <div style={{ marginBottom: 40 }}>
                <CoffeeCupDots />
              </div>

              {/* Headline */}
              <span
                style={{
                  fontFamily: "var(--font-silkscreen)",
                  fontSize: 48,
                  color: BROWN,
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                Coffee?
              </span>

              {/* Subheading */}
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: BROWN,
                  textAlign: "center",
                  lineHeight: 1.6,
                  marginBottom: 36,
                }}
              >
                or whatever floats your goat 🐐
              </span>

              {/* Email copy button */}
              <EmailButton onClick={copyEmail} copied={copied} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
