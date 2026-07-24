"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, animate, useMotionValue, useSpring, useVelocity, useTransform, type MotionValue } from "framer-motion";
import { useAudio } from "@/contexts/AudioContext";

const CLIP_FILL   = "#667390";
const CLIP_RING   = "#C8CFDE";
const PHOTO_BG    = "#C8CFDE";
const SLEEVE_FILL = "#F8F8F8";

const STRAP_SPRING = { type: "spring" as const, stiffness: 55, damping: 18 };
const CARD_SPRING  = { type: "spring" as const, stiffness: 28, damping: 13, mass: 1.5 };
const TILT_SPRING  = { type: "spring" as const, stiffness: 55, damping: 18 };

// Mobile tap-to-swing: stiff, light, lightly-damped springs → a quick natural
// pendulum swing that eases out and settles back to vertical in ~1s. (Soft/heavy
// springs oscillate in slow motion and look laggy / stuck mid-swing.)
const TAP_STRAP_SPRING = { type: "spring" as const, stiffness: 130, damping: 12, mass: 1 };
const TAP_CARD_SPRING  = { type: "spring" as const, stiffness: 95,  damping: 8,  mass: 1 };
// Impulse strength: a full-strength tap (screen edge) injects this much angular
// velocity (deg/s) into each hinge. Card swings more than the strap. Kept low on
// the strap so its velocity-driven chain reaction settles quickly too.
const TAP_STRAP_VELOCITY = 90;
const TAP_CARD_VELOCITY  = 460;
// Gravity lean from device orientation: gamma (left-right tilt, deg) → hang
// angle, scaled and clamped so extreme tilts don't over-rotate the lanyard.
const GRAVITY_SCALE = 0.8;
const GRAVITY_MAX   = 32;

interface LanyardColors {
  strapTop: string;
  clipStroke: string;
  mainStroke: string;
  clipDot: string;
}

function Lanyard({ ext = 0, colors }: { ext?: number; colors: LanyardColors }) {
  const { strapTop, clipStroke, mainStroke, clipDot } = colors;
  const h  = 235 + ext;
  const sy = 118 + ext;
  const cy = 122.418 + ext;
  const by = 126 + ext;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: 276 }}>
      <svg width={64} height={h} viewBox={`0 0 64 ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={`M0 0H64V${sy}C64 ${cy} 60.4183 ${by} 56 ${by}H8C3.58172 ${by} 0 ${cy} 0 ${sy}V0Z`} fill={strapTop}/>
        <g transform={`translate(0,${ext})`}>
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" fill="rgba(22,23,25,0.15)"/>
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" stroke={clipStroke}/>
          <rect x="17.3999" y="167.8" width="28.8" height="28.8" rx="14.4" fill={CLIP_FILL}/>
          <circle cx="31.8" cy="182.2" r="10.8" fill={CLIP_RING}/>
          <circle cx="31.8001" cy="182.2" r="7.2" fill={CLIP_FILL}/>
          <circle cx="31.8001" cy="143.2" r="6.7" fill={CLIP_FILL} stroke="#F8F8F8"/>
          <circle cx="31.7997" cy="182.2" r="3.6" fill={clipDot}/>
          <circle cx="31.7997" cy="143.2" r="3.1" fill="#F8F8F8" stroke={mainStroke}/>
          <path d="M32 109.7C35.0376 109.7 37.5 112.162 37.5 115.2V139.2C37.5 142.238 35.0376 144.7 32 144.7C28.9624 144.7 26.5 142.238 26.5 139.2V115.2C26.5 112.162 28.9624 109.7 32 109.7Z" fill={CLIP_FILL} stroke={clipStroke}/>
        </g>
      </svg>
    </div>
  );
}

const FIELDS = [
  { label: "ROLE",     value: "SENIOR PRODUCT DESIGNER" },
  { label: "COMPANY",  value: "BEEM · AP+"              },
  { label: "LOCATION", value: "SYDNEY, DHARUG COUNTRY"  },
];

function ClipTabOverlay({ ext = 0, clipStroke }: { ext?: number; clipStroke: string }) {
  return (
    <div style={{ position: "absolute", top: 130.7 + ext, left: 106, zIndex: 2, pointerEvents: "none" }}>
      <svg width={64} height={104.3} viewBox="0 0 64 104.3" fill="none">
        <g transform="translate(0, -130.7)">
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" fill="rgba(22,23,25,0.06)"/>
          <path d="M22.2002 130.7H41.7998C45.5001 130.7 48.5 133.7 48.5 137.4V227C48.5 230.7 45.5001 233.7 41.7998 233.7H22.2002C18.4999 233.7 15.5 230.7 15.5 227V137.4C15.5 133.7 18.4999 130.7 22.2002 130.7Z" stroke={clipStroke}/>
        </g>
      </svg>
    </div>
  );
}

export default function IDCard({ strapExtension = 0 }: { strapExtension?: number }) {
  const { muted }    = useAudio();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseVel     = useRef({ x: 0, t: 0, vx: 0 });
  const hadSwingRef  = useRef(false);
  const orientOnRef  = useRef(false);
  const little1Ref   = useRef<HTMLAudioElement | null>(null);
  const little2Ref   = useRef<HTMLAudioElement | null>(null);
  const bigSndRef    = useRef<HTMLAudioElement | null>(null);

  const [isLight, setIsLight] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const detect = () => setIsTouch(window.matchMedia?.("(pointer: coarse)").matches ?? false);
    detect();
  }, []);

  useEffect(() => {
    const update = () => setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const mainStroke      = isLight ? "#161719" : "#0127BA";
  const strapTop        = isLight ? "#161719" : "#FFB3D8";
  const clipStroke      = isLight ? "#161719" : "#F8F8F8";
  const cardOuterFill   = isLight ? "rgba(22,23,25,0.1)" : "rgba(22,23,25,0.15)";
  const cardOuterStroke = isLight ? "#161719" : "#F8F8F8";
  const sleeveBorder    = isLight ? "#161719" : "#FFB3D8";
  const holeFill        = isLight ? "#F8F8F8" : "#C8CFDE";
  const clipDot         = isLight ? "#F8F8F8" : "#0127BA";

  const lanyardColors: LanyardColors = { strapTop, clipStroke, mainStroke, clipDot };

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 300,
    letterSpacing: "0.04em",
    color: mainStroke,
    textTransform: "uppercase",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: mainStroke,
    textTransform: "uppercase",
  };

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
    little1Ref.current = new Audio("/swipe-little.mp3");
    little2Ref.current = new Audio("/swipe-little.mp3");
    bigSndRef.current  = new Audio("/swipe-big.mp3");
  }, []);

  // ── Hinge 1 — top attachment: strap barely swings ────────────────────────
  const lanyardZ = useMotionValue(0);

  // ── Hinge 2 — clip connection: card swings relative to the strap ─────────
  const cardRelMouse = useMotionValue(0);

  // ── Real-world gravity lean (mobile) — from device orientation ───────────
  // The whole assembly hangs from the top attachment, so tilting the strap by
  // the phone's roll makes both strap and card (its child) lean toward gravity.
  // Smoothed via a spring so sensor jitter doesn't make the card twitch.
  const gravityTarget = useMotionValue(0);
  const gravityZ = useSpring(gravityTarget, { stiffness: 40, damping: 12, mass: 1 });

  // ── 3-D tilt from vertical mouse movement ────────────────────────────────
  const mouseX = useMotionValue(0);

  // Chain-pendulum physics: when the strap accelerates, the card at the clip
  // hinge deflects the opposite way (inertia lag), then springs back.
  const strapVelocity = useVelocity(lanyardZ);
  const chainInput    = useTransform(strapVelocity, (v: number) => -v * 0.018);
  const cardChain     = useSpring(chainInput, { stiffness: 22, damping: 8, mass: 2.5 });

  const lanyardRotate = useTransform(
    [lanyardEntry, gravityZ, lanyardZ] as MotionValue<number>[],
    ([e, g, z]: number[]) => e + g + z
  );
  const cardRelativeRotate = useTransform(
    [cardEntry, cardRelMouse, cardChain] as MotionValue<number>[],
    ([e, m, c]: number[]) => e + m + c
  );

  const playSwipe = useCallback((big: boolean) => {
    if (muted) return;
    if (big) {
      const snd = bigSndRef.current;
      if (!snd) return;
      snd.currentTime = 0;
      snd.play().catch(() => {});
    } else {
      for (const snd of [little1Ref.current, little2Ref.current]) {
        if (!snd) continue;
        snd.currentTime = 0;
        snd.play().catch(() => {});
      }
    }
  }, [muted]);

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseVel.current = { x: e.clientX, t: performance.now(), vx: 0 };
    hadSwingRef.current = false;
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

    if (Math.abs(nx) > 0.12) hadSwingRef.current = true;

    animate(lanyardZ,     nx * 3.5, STRAP_SPRING);
    animate(cardRelMouse, nx * 8,   CARD_SPRING);
    animate(mouseX,       ny * -4,  TILT_SPRING);
  };

  const handleMouseLeave = () => {
    const vx    = mouseVel.current.vx;
    const absVx = Math.abs(vx);

    if (absVx > 300) {
      playSwipe(true);
    } else if (hadSwingRef.current || absVx > 50) {
      playSwipe(false);
    }

    animate(lanyardZ,     0, { ...STRAP_SPRING, velocity: vx * 0.01 });
    animate(cardRelMouse, 0, { ...CARD_SPRING,  velocity: vx * 0.03 });
    animate(mouseX,       0, TILT_SPRING);
    mouseVel.current.vx = 0;
    hadSwingRef.current = false;
  };

  // ── Device orientation → gravity lean (mobile) ───────────────────────────
  const handleOrient = useCallback((e: DeviceOrientationEvent) => {
    // gamma = left-right tilt in degrees. Tilt the phone right → the hanging
    // lanyard leans right; tilt left → leans left. Scaled + clamped so a big
    // tilt doesn't swing it past a natural hang.
    const gamma = e.gamma ?? 0;
    const angle = Math.max(-GRAVITY_MAX, Math.min(GRAVITY_MAX, gamma * GRAVITY_SCALE));
    gravityTarget.set(angle);
  }, [gravityTarget]);

  // Attach the orientation listener once. iOS 13+ only grants access after an
  // explicit permission request tied to a user gesture, so there it waits for
  // the first tap (see handlePointerDown). Everywhere else it can start on mount.
  const enableOrientation = useCallback(async () => {
    if (orientOnRef.current) return;
    const DOE = window.DeviceOrientationEvent as unknown as
      { requestPermission?: () => Promise<"granted" | "denied"> } | undefined;
    if (!DOE || typeof DOE.requestPermission !== "function") return;
    orientOnRef.current = true;
    try {
      if ((await DOE.requestPermission()) !== "granted") return;
    } catch {
      return;
    }
    window.addEventListener("deviceorientation", handleOrient);
  }, [handleOrient]);

  useEffect(() => {
    if (!isTouch) return;
    const DOE = window.DeviceOrientationEvent as unknown as
      { requestPermission?: () => Promise<"granted" | "denied"> } | undefined;
    // No permission gate (Android, older iOS): follow gravity immediately.
    if (DOE && typeof DOE.requestPermission !== "function") {
      orientOnRef.current = true;
      window.addEventListener("deviceorientation", handleOrient);
    }
    return () => window.removeEventListener("deviceorientation", handleOrient);
  }, [isTouch, handleOrient]);

  // ── Tap-to-swing (mobile) ────────────────────────────────────────────────
  // No cursor to swipe with, so a tap gives the pendulum a push. Tapping left of
  // centre swings the card right (and vice-versa); the further from centre, the
  // harder the push. The springs settle back to 0, i.e. to the gravity rest.
  // Down+up are tracked so a vertical scroll that starts on the card is NOT read
  // as a tap — only a real tap (little movement, short hold) swings it.
  const tapStart = useRef({ x: 0, y: 0, t: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    enableOrientation();
    tapStart.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const { x, y, t } = tapStart.current;
    const moved = Math.hypot(e.clientX - x, e.clientY - y);
    if (moved > 10 || performance.now() - t > 500) return; // a drag/scroll, not a tap
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // [-1,1], left negative
    const strength = Math.max(-1, Math.min(1, -nx)); // tap left → positive (swing right)
    if (Math.abs(strength) < 0.02) return;
    animate(lanyardZ,     0, { ...TAP_STRAP_SPRING, velocity: strength * TAP_STRAP_VELOCITY });
    animate(cardRelMouse, 0, { ...TAP_CARD_SPRING,  velocity: strength * TAP_CARD_VELOCITY });
    playSwipe(Math.abs(strength) > 0.6);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={isTouch ? undefined : handleMouseEnter}
      onMouseMove={isTouch ? undefined : handleMouseMove}
      onMouseLeave={isTouch ? undefined : handleMouseLeave}
      onPointerDown={isTouch ? handlePointerDown : undefined}
      onPointerUp={isTouch ? handlePointerUp : undefined}
      style={{ position: "relative", width: 276, perspective: "800px", touchAction: "pan-y" }}
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
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 276,
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {/* Strap extension above — no visible cut-off during drop */}
          <div style={{
            position: "absolute",
            top: -1000, left: 106,
            width: 64, height: 1000,
            backgroundColor: strapTop,
            pointerEvents: "none",
          }} />

          {/* Strap SVG */}
          <Lanyard ext={strapExtension} colors={lanyardColors} />

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
            <div style={{ position: "absolute", inset: 0, backgroundColor: cardOuterFill, borderRadius: 22.5, border: `2px solid ${cardOuterStroke}` }} />
            {/* Sleeve */}
            <div style={{ position: "absolute", left: "50%", top: 37.2, transform: "translateX(-50%)", width: 258.92, height: 412.77, backgroundColor: SLEEVE_FILL, borderRadius: 18.76, border: `2px solid ${sleeveBorder}` }} />
            {/* Lanyard hole */}
            <div style={{ position: "absolute", left: 110.7, top: 13.13, width: 54.04, height: 13.51, backgroundColor: holeFill, borderRadius: 999, border: `1px solid ${mainStroke}` }} />

            <span style={{ position: "absolute", left: 23.43, top: 43.8, ...labelStyle }}>DESIGN PORTFOLIO</span>
            <span style={{ position: "absolute", left: 235.43, top: 43.8, width: 16, textAlign: "right", display: "block", ...labelStyle }}>001</span>
            <div style={{ position: "absolute", left: 8.43, right: 8.43, top: 62.8, height: 1, backgroundColor: mainStroke }} />

            <div style={{ position: "absolute", left: 70.43, top: 84.8, width: 135.59, height: 165, backgroundColor: PHOTO_BG, overflow: "hidden", border: `2px solid ${mainStroke}` }}>
              <Image src="/new-sandy-ID.png" alt="Sandy Qi" fill priority sizes="136px" style={{ objectFit: "cover", objectPosition: "center top" }} />
            </div>

            <div style={{ position: "absolute", left: 70.43, top: 255.8, width: 141, fontSize: 28, fontWeight: 700, letterSpacing: "0.08em", color: mainStroke, textTransform: "uppercase", lineHeight: 1 }}>
              SANDY QI
            </div>

            <div style={{ position: "absolute", left: 29.43, top: 307, width: 216, display: "flex", flexDirection: "column", gap: 8 }}>
              {FIELDS.map(({ label, value }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={labelStyle}>{label}</span>
                  <span style={valueStyle}>{value}</span>
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
          <ClipTabOverlay ext={strapExtension} clipStroke={clipStroke} />
        </motion.div>
      </motion.div>
    </div>
  );
}
