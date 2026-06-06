"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { motion, animate, useMotionValue, useSpring, useVelocity, useTransform, type MotionValue } from "framer-motion";
import { useAudio } from "@/contexts/AudioContext";

const BROWN = "#4E3A34";
const CARD_OUTER = "#DCD8D6";
const SLEEVE = "#F3F2F0";
const PHOTO_BG = "#E5E0D7";

// Spring configs — tuned for smooth, unhurried motion
const STRAP_SPRING = { type: "spring" as const, stiffness: 55, damping: 18 };
const CARD_SPRING  = { type: "spring" as const, stiffness: 28, damping: 13, mass: 1.5 };
const TILT_SPRING  = { type: "spring" as const, stiffness: 55, damping: 18 };

function Lanyard({ ext = 0 }: { ext?: number }) {
  const h = 235 + ext;
  const sy = 118 + ext;
  const cy = 122.418 + ext;
  const by = 126 + ext;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: 276 }}>
      <svg width={64} height={h} viewBox={`0 0 64 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={`M0 0H64V${sy}C64 ${cy} 60.4183 ${by} 56 ${by}H8C3.58172 ${by} 0 ${cy} 0 ${sy}V0Z`} fill="#4E3A34"/>
        <g transform={`translate(0,${ext})`}>
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" fill="#4E3A34" fillOpacity="0.1"/>
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" stroke="#4E3A34"/>
          <rect x="17.3999" y="167.8" width="28.8" height="28.8" rx="14.4" fill="#4E3A34"/>
          <circle cx="31.8" cy="182.2" r="10.8" fill="#837571"/>
          <circle cx="31.8001" cy="182.2" r="7.2" fill="#4E3A34"/>
          <circle cx="31.8001" cy="143.2" r="6.7" fill="#B8B0AE" stroke="#4E3A34"/>
          <circle cx="31.7997" cy="182.2" r="3.6" fill="#B8B0AE"/>
          <circle cx="31.7997" cy="143.2" r="3.1" fill="#E5E0D7" stroke="#4E3A34"/>
          <path d="M32 109.7C35.0376 109.7 37.5 112.162 37.5 115.2V139.2C37.5 142.238 35.0376 144.7 32 144.7C28.9624 144.7 26.5 142.238 26.5 139.2V115.2C26.5 112.162 28.9624 109.7 32 109.7Z" fill="#837571" stroke="#4E3A34"/>
        </g>
      </svg>
    </div>
  );
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 300,
  letterSpacing: "0.04em",
  color: BROWN,
  textTransform: "uppercase",
};

const VALUE_STYLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: BROWN,
  textTransform: "uppercase",
};

const FIELDS = [
  { label: "ROLE",     value: "SENIOR PRODUCT DESIGNER" },
  { label: "COMPANY",  value: "BEEM · AP+"              },
  { label: "LOCATION", value: "SYDNEY, AUS"             },
];

function ClipTabOverlay({ ext = 0 }: { ext?: number }) {
  return (
    // zIndex 2 keeps the clip outline above the nested card (zIndex 1)
    <div style={{ position: "absolute", top: 130.7 + ext, left: 106, zIndex: 2, pointerEvents: "none" }}>
      <svg width={64} height={104.3} viewBox="0 0 64 104.3" fill="none">
        <g transform="translate(0, -130.7)">
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" fill="#4E3A34" fillOpacity="0.06"/>
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" stroke="#4E3A34"/>
        </g>
      </svg>
    </div>
  );
}

export default function IDCard({ strapExtension = 0 }: { strapExtension?: number }) {
  const { muted }     = useAudio();
  const containerRef  = useRef<HTMLDivElement>(null);
  const mouseVel      = useRef({ x: 0, t: 0, vx: 0 });
  const hadSwingRef   = useRef(false);
  const littleSndRef  = useRef<HTMLAudioElement | null>(null);
  const bigSndRef     = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef   = useRef<AudioContext | null>(null);

  // ── Entrance springs ──────────────────────────────────────────────────────
  const y            = useSpring(-680, { stiffness: 80, damping: 12, mass: 1 });
  const lanyardEntry = useSpring(-5,   { stiffness: 16, damping: 3,  mass: 0.5 });
  const cardEntry    = useSpring(4,    { stiffness: 38, damping: 9,  mass: 1.4 });

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      y.set(0);
      lanyardEntry.set(0);
      cardEntry.set(0);
    });
    return () => cancelAnimationFrame(raf);
  }, [y, lanyardEntry, cardEntry]);

  useEffect(() => {
    const ctx    = new AudioContext();
    const little = new Audio("/swipe-little.mp3");
    const big    = new Audio("/swipe-big.mp3");

    // Boost gain above the 1.0 HTMLAudioElement ceiling
    const gainNode = ctx.createGain();
    gainNode.gain.value = 2.2;
    gainNode.connect(ctx.destination);

    for (const audio of [little, big]) {
      const src = ctx.createMediaElementSource(audio);
      src.connect(gainNode);
    }

    audioCtxRef.current  = ctx;
    littleSndRef.current = little;
    bigSndRef.current    = big;

    return () => { ctx.close(); };
  }, []);

  // ── Hinge 1 — top attachment: strap barely swings ────────────────────────
  const lanyardZ = useMotionValue(0);

  // ── Hinge 2 — clip connection: card swings relative to the strap ─────────
  const cardRelMouse = useMotionValue(0);

  // ── 3-D tilt from vertical mouse movement ────────────────────────────────
  const mouseX = useMotionValue(0);

  // Chain-pendulum physics: when the strap accelerates, the card at the clip
  // hinge deflects the opposite way (inertia lag), then springs back.
  const strapVelocity = useVelocity(lanyardZ);
  const chainInput    = useTransform(strapVelocity, (v: number) => -v * 0.018);
  const cardChain     = useSpring(chainInput, { stiffness: 22, damping: 8, mass: 2.5 });

  // Final rotation values consumed by JSX
  // lanyardRotate = entrance spring + mouse spring (hinge 1)
  const lanyardRotate = useTransform(
    [lanyardEntry, lanyardZ] as MotionValue<number>[],
    ([e, z]: number[]) => e + z
  );
  // cardRelativeRotate = entrance + mouse + chain physics (relative to strap at hinge 2)
  // Because the card is NESTED inside the strap motion.div, the card's ABSOLUTE
  // rotation = lanyardRotate + cardRelativeRotate — true two-hinge chain physics.
  const cardRelativeRotate = useTransform(
    [cardEntry, cardRelMouse, cardChain] as MotionValue<number>[],
    ([e, m, c]: number[]) => e + m + c
  );

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseVel.current = { x: e.clientX, t: performance.now(), vx: 0 };
    hadSwingRef.current = false;
    // Entry kick — strap just a nudge, card gets the bigger bounce
    animate(lanyardZ,     nx * 4,  STRAP_SPRING);
    animate(cardRelMouse, nx * 12, CARD_SPRING);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

    const now = performance.now();
    const dt  = now - mouseVel.current.t;
    if (dt > 0 && dt < 100) {
      mouseVel.current.vx = (e.clientX - mouseVel.current.x) / dt * 1000;
    }
    mouseVel.current.x = e.clientX;
    mouseVel.current.t = now;

    // Mark that meaningful swing happened (used to pick the exit sound)
    if (Math.abs(nx) > 0.12) hadSwingRef.current = true;

    // Strap barely follows (±3.5°), card swings more at clip hinge (±8°)
    // Card absolute angle at max = strap(3.5°) + card_rel(8°) = 11.5°
    animate(lanyardZ,     nx * 3.5, STRAP_SPRING);
    animate(cardRelMouse, nx * 8,   CARD_SPRING);
    animate(mouseX,       ny * -4,  TILT_SPRING);
  };

  const handleMouseLeave = () => {
    const vx = mouseVel.current.vx; // px/sec at exit
    const absVx = Math.abs(vx);

    // Play swipe sound: big for fast exits, little for any meaningful swing
    const playSwipe = (big: boolean) => {
      const snd = big ? bigSndRef.current : littleSndRef.current;
      if (!snd || muted) return;
      const ctx = audioCtxRef.current;
      const resume = ctx && ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
      resume.then(() => { snd.currentTime = 0; snd.play().catch(() => {}); });
    };
    if (absVx > 300) {
      playSwipe(true);
    } else if (hadSwingRef.current || absVx > 50) {
      playSwipe(false);
    }

    // Seed the springs with exit velocity so a fast pass-through gives a visible
    // swing-and-return. Strap gets a tiny kick; card gets the full momentum.
    animate(lanyardZ,     0, { ...STRAP_SPRING, velocity: vx * 0.01 });
    animate(cardRelMouse, 0, { ...CARD_SPRING,  velocity: vx * 0.03 });
    animate(mouseX,       0, TILT_SPRING);
    mouseVel.current.vx = 0;
    hadSwingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", width: 276, perspective: "800px" }}
    >
      {/* Outer wrapper: fall + 3-D tilt only (no lateral swing here) */}
      <motion.div style={{ y, rotateX: mouseX, transformOrigin: "top center", width: 276 }}>

        {/*
          Strap motion.div — rotates from the TOP ATTACHMENT POINT (hinge 1).
          The card is a child, so it physically follows the clip's position as
          the strap swings — true chain-pendulum inheritance via CSS transforms.
        */}
        <motion.div
          style={{
            rotate: lanyardRotate,
            transformOrigin: "top center",
            position: "relative",       // so ClipTabOverlay & BrownExtension can use position:absolute
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 276,
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {/* Brown extension above strap — no visible cut-off during drop */}
          <div style={{
            position: "absolute",
            top: -1000, left: 106,
            width: 64, height: 1000,
            backgroundColor: BROWN,
            pointerEvents: "none",
          }} />

          {/* Strap SVG */}
          <Lanyard ext={strapExtension} />

          {/*
            Card motion.div — nested inside the strap, so it moves with the clip.
            cardRelativeRotate is the card's own swing AT the clip hinge (hinge 2).
            transformOrigin "top center" = pivot at the clip connection point.
          */}
          <motion.div
            style={{
              rotate: cardRelativeRotate,
              transformOrigin: "top center",
              position: "relative",
              width: 275,
              height: 458,
              marginTop: -22,
              zIndex: 1,
              flexShrink: 0,
            }}
          >
            {/* Outer card shell */}
            <div style={{ position: "absolute", inset: 0, backgroundColor: CARD_OUTER, borderRadius: 22.5, border: `2px solid ${BROWN}` }} />
            {/* Sleeve */}
            <div style={{ position: "absolute", left: "50%", top: 37.2, transform: "translateX(-50%)", width: 258.92, height: 412.77, backgroundColor: SLEEVE, borderRadius: 18.76, border: `2px solid ${BROWN}` }} />
            {/* Lanyard hole */}
            <div style={{ position: "absolute", left: 110.7, top: 13.13, width: 54.04, height: 13.51, backgroundColor: SLEEVE, borderRadius: 999, border: "1px solid #000" }} />

            <span style={{ position: "absolute", left: 23.43, top: 43.8, ...LABEL_STYLE }}>DESIGN PORTFOLIO</span>
            <span style={{ position: "absolute", left: 235.43, top: 43.8, width: 16, textAlign: "right", display: "block", ...LABEL_STYLE }}>001</span>
            <div style={{ position: "absolute", left: 8.43, right: 8.43, top: 62.8, height: 1, backgroundColor: BROWN }} />

            <div style={{ position: "absolute", left: 70.43, top: 84.8, width: 135.59, height: 165, backgroundColor: PHOTO_BG, overflow: "hidden", border: `2px solid ${BROWN}` }}>
              <Image src="/ID-pic.png" alt="Sandy Qi" fill priority sizes="136px" style={{ objectFit: "cover", objectPosition: "center top" }} />
            </div>

            <div style={{ position: "absolute", left: 70.43, top: 255.8, width: 141, fontSize: 28, fontWeight: 700, letterSpacing: "0.08em", color: BROWN, textTransform: "uppercase", lineHeight: 1 }}>
              SANDY QI
            </div>

            <div style={{ position: "absolute", left: 29.43, top: 307, width: 216, display: "flex", flexDirection: "column", gap: 8 }}>
              {FIELDS.map(({ label, value }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={LABEL_STYLE}>{label}</span>
                  <span style={VALUE_STYLE}>{value}</span>
                </div>
              ))}
            </div>

            {[
              { src: "/graffiti%20svgs/graffiti-neckers-cube.svg", left: 208.43, top: 38,     width: 23.61, height: 24.88 },
              { src: "/graffiti%20svgs/graffiti-sparkles.svg",     left: 50.69,  top: 91.26,  width: 13,    height: 31    },
              { src: "/graffiti%20svgs/graffiti-flowers.svg",      left: 216.43, top: 158.8,  width: 37,    height: 52    },
              { src: "/graffiti%20svgs/graffiti-s.svg",            left: 46.39,  top: 255.84, width: 45,    height: 57    },
            ].map(({ src, left, top, width, height }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" style={{ position: "absolute", left, top, width, height, pointerEvents: "none" }} />
            ))}
          </motion.div>

          {/*
            ClipTabOverlay: absolutely positioned within the strap wrapper so it
            rotates with the strap. Rendered after the card → always on top (zIndex 2).
          */}
          <ClipTabOverlay ext={strapExtension} />
        </motion.div>
      </motion.div>
    </div>
  );
}
