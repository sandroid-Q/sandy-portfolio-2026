"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const BROWN = "#4E3A34";
const TEXT_INVERSE = "#E5E0D7";
const BROWN_PRESSED = "#71615D";
const TEXT_INVERSE_PRESSED = "#EFECE7";
const PILASTER = 36;
const BEVEL = 12;
const DEPTH = 16;
const FLOOR_DEPTH = 44;

const SPARKLE_DUR = 2.0;
const SPARKLE_REPEAT_DELAY = 3.0;
const CYCLE = SPARKLE_DUR + SPARKLE_REPEAT_DELAY;
const STRIDE = 31;

const DOOR_DURATION = 1.1;
const DOOR_EASE_OPEN  = [0.4, 0, 1, 1] as const; // ease-in: smooth acceleration out
const DOOR_EASE_CLOSE = [0, 0, 0.3, 1] as const; // ease-out: instant entry, gentle stop

interface SparkleSpec { xf: number; yf: number; r: number; delay: number }

const SPARKLE_POSITIONS: [number, number, number][] = [
  // row 1  y≈0.04
  [0.04,0.04,6],[0.15,0.03,5],[0.26,0.05,7],[0.37,0.04,5],[0.48,0.02,6],[0.59,0.05,7],[0.70,0.03,5],[0.81,0.04,6],[0.92,0.05,5],[0.99,0.03,7],
  // row 2  y≈0.14
  [0.09,0.15,5],[0.20,0.13,7],[0.31,0.15,6],[0.42,0.14,5],[0.53,0.16,7],[0.64,0.14,6],[0.75,0.13,5],[0.86,0.15,7],[0.97,0.14,6],[0.99,0.16,5],
  // row 3  y≈0.24
  [0.04,0.25,7],[0.15,0.23,6],[0.26,0.24,5],[0.37,0.26,7],[0.48,0.24,6],[0.59,0.23,5],[0.70,0.25,7],[0.81,0.24,6],[0.92,0.23,5],[0.99,0.25,6],
  // row 4  y≈0.34
  [0.09,0.33,6],[0.20,0.35,5],[0.31,0.34,7],[0.42,0.33,6],[0.53,0.35,5],[0.64,0.33,7],[0.75,0.35,6],[0.86,0.34,5],[0.97,0.33,7],[0.99,0.35,6],
  // row 5  y≈0.44
  [0.04,0.45,5],[0.15,0.43,7],[0.26,0.44,6],[0.37,0.46,5],[0.48,0.44,7],[0.59,0.43,6],[0.70,0.45,5],[0.81,0.44,7],[0.92,0.46,6],[0.99,0.44,5],
  // row 6  y≈0.54
  [0.09,0.53,7],[0.20,0.55,6],[0.31,0.54,5],[0.42,0.53,7],[0.53,0.55,6],[0.64,0.53,5],[0.75,0.55,7],[0.86,0.54,6],[0.97,0.53,5],[0.99,0.55,7],
  // row 7  y≈0.64
  [0.04,0.65,6],[0.15,0.63,5],[0.26,0.64,7],[0.37,0.66,6],[0.48,0.64,5],[0.59,0.63,7],[0.70,0.65,6],[0.81,0.64,5],[0.92,0.63,7],[0.99,0.65,6],
  // row 8  y≈0.74
  [0.09,0.75,5],[0.20,0.73,7],[0.31,0.74,6],[0.42,0.76,5],[0.53,0.74,7],[0.64,0.73,6],[0.75,0.75,5],[0.86,0.74,7],[0.97,0.75,6],[0.99,0.73,5],
  // row 9  y≈0.84
  [0.04,0.83,7],[0.15,0.85,6],[0.26,0.84,5],[0.37,0.83,7],[0.48,0.85,6],[0.59,0.84,5],[0.70,0.83,7],[0.81,0.85,6],[0.92,0.84,5],[0.99,0.83,7],
  // row 10  y≈0.94
  [0.09,0.95,6],[0.20,0.93,5],[0.31,0.94,7],[0.42,0.95,6],[0.53,0.93,5],[0.64,0.95,7],[0.75,0.94,6],[0.86,0.93,5],[0.97,0.94,7],[0.99,0.95,6],
];

const N = SPARKLE_POSITIONS.length;
const SPARKLES: SparkleSpec[] = SPARKLE_POSITIONS.map(([xf, yf, r], i) => ({
  xf, yf, r,
  delay: ((i * STRIDE) % N) / N * CYCLE,
}));

function sparklePath(r: number): string {
  const s = r * 0.18;
  return `M 0 ${-r} L ${s} ${-s} L ${r} 0 L ${s} ${s} L 0 ${r} L ${-s} ${s} L ${-r} 0 L ${-s} ${-s} Z`;
}

interface ElevatorProps {
  isOpen: boolean;
  logoText?: string;
  welcomeText?: string;
  onEnter?: () => void;
}

export default function Elevator({
  isOpen,
  logoText = "SQ",
  welcomeText = "WELCOME",
  onEnter,
}: ElevatorProps) {
  const doorAreaRef = useRef<HTMLDivElement>(null);
  const [doorSize, setDoorSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  // Defer mounting sparkles until doors have opened at least once
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setHasOpened(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else { setHovered(false); setPressed(false); }
  }, [isOpen]);

  const bgColor = pressed ? BROWN_PRESSED : hovered ? BROWN         : TEXT_INVERSE;
  const fgColor = pressed ? TEXT_INVERSE_PRESSED : hovered ? TEXT_INVERSE : BROWN;

  useEffect(() => {
    const el = doorAreaRef.current;
    if (!el) return;
    const update = () => { setDoorSize({ w: el.offsetWidth, h: el.offsetHeight }); };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = doorSize;
  const P = PILASTER;
  const B = BEVEL;
  const D = DEPTH;

  const ix1 = P + B;
  const iy1 = B;
  const ix2 = w - P - B;
  const iy2 = h - B;

  const bx1 = ix1 + D;
  const by1 = iy1 + D;
  const bx2 = ix2 - D;
  const by2 = iy2 - FLOOR_DEPTH;

  const iw = ix2 - ix1;
  const ih = iy2 - iy1;

  return (
    <div className="flex flex-col items-center">
      {/* SQ badge */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 120,
          aspectRatio: "2 / 1",
          borderTopLeftRadius: "50% 100%",
          borderTopRightRadius: "50% 100%",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          border: `2px solid ${BROWN}`,
          borderBottom: "none",
          backgroundColor: "var(--color-bg-primary)",
          marginBottom: 0,
          zIndex: 1,
        }}
      >
        <span
          className="font-silkscreen"
          style={{ color: BROWN, fontSize: 40, lineHeight: 1, letterSpacing: -3 }}
        >
          {logoText}
        </span>
      </div>

      {/* Cabinet */}
      <div
        className="flex flex-col"
        style={{
          width: 340,
          border: `2px solid ${BROWN}`,
          backgroundColor: "var(--color-bg-primary)",
        }}
      >
        {/* WELCOME bar */}
        <div
          className="flex items-center justify-center shrink-0"
          style={{ height: 56, borderBottom: `2px solid ${BROWN}` }}
        >
          <span className="font-silkscreen" style={{ color: BROWN, fontSize: 20 }}>
            {welcomeText}
          </span>
        </div>

        {/*
          Door area — overflow:hidden clips the sliding panels.
          Layer order (bottom → top):
            1. Interior SVG  (back wall, sparkles)
            2. Left door panel  ← slides out left when open
            3. Right door panel ← slides out right when open
            4. Frame SVG overlay (pilasters, inner box, seam)
        */}
        <div
          ref={doorAreaRef}
          className="relative overflow-hidden"
          style={{
            height: "min(512px, calc(100vh - 220px))",
            minHeight: 372,
            cursor: isOpen ? "pointer" : "default",
          }}
          onMouseEnter={() => { if (isOpen) setHovered(true); }}
          onMouseLeave={() => { setHovered(false); setPressed(false); }}
          onPointerDown={() => { if (isOpen) setPressed(true); }}
          onPointerUp={() => setPressed(false)}
          onClick={() => { if (isOpen) onEnter?.(); }}
        >
          {/* 1. Interior */}
          {w > 0 && h > 0 && (
            <svg
              width={w} height={h} viewBox={`0 0 ${w} ${h}`}
              style={{ position: "absolute", inset: 0, display: "block" }}
            >
              <defs>
                <clipPath id="interior-clip">
                  <rect x={ix1} y={iy1} width={ix2 - ix1} height={iy2 - iy1} />
                </clipPath>
              </defs>

              <motion.rect
                x={ix1} y={iy1} width={ix2 - ix1} height={iy2 - iy1}
                animate={{ fill: bgColor }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />

              <motion.g animate={{ color: fgColor }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                <line x1={bx1} y1={by1} x2={bx2} y2={by1} stroke="currentColor" strokeWidth={1} />
                <line x1={bx1} y1={by2} x2={bx2} y2={by2} stroke="currentColor" strokeWidth={1} />
                <line x1={bx1} y1={by1} x2={bx1} y2={by2} stroke="currentColor" strokeWidth={1} />
                <line x1={bx2} y1={by1} x2={bx2} y2={by2} stroke="currentColor" strokeWidth={1} />
                <line x1={ix1} y1={iy1} x2={bx1} y2={by1} stroke="currentColor" strokeWidth={1} />
                <line x1={ix2} y1={iy1} x2={bx2} y2={by1} stroke="currentColor" strokeWidth={1} />
                <line x1={ix1} y1={iy2} x2={bx1} y2={by2} stroke="currentColor" strokeWidth={1} />
                <line x1={ix2} y1={iy2} x2={bx2} y2={by2} stroke="currentColor" strokeWidth={1} />
              </motion.g>

              {hasOpened && iw > 0 && ih > 0 && (
                <g clipPath="url(#interior-clip)">
                  <motion.g animate={{ color: fgColor }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                    {SPARKLES.map((sp, i) => (
                      <motion.g
                        key={i}
                        style={{ x: ix1 + sp.xf * iw, y: iy1 + sp.yf * ih }}
                        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                        transition={{
                          duration: SPARKLE_DUR,
                          delay: sp.delay,
                          repeat: Infinity,
                          repeatDelay: SPARKLE_REPEAT_DELAY,
                          ease: "easeInOut",
                        }}
                      >
                        <path d={sparklePath(sp.r)} fill="currentColor" />
                      </motion.g>
                    ))}
                  </motion.g>
                </g>
              )}
            </svg>
          )}

          {/* 2. Left door panel */}
          <motion.div
            className="absolute left-0 top-0 bottom-0"
            style={{ width: "50%", backgroundColor: "var(--color-bg-primary)" }}
            animate={{ x: isOpen ? "-100%" : "0%" }}
            transition={{ duration: DOOR_DURATION, ease: isOpen ? DOOR_EASE_OPEN : DOOR_EASE_CLOSE }}
          />

          {/* 3. Right door panel */}
          <motion.div
            className="absolute right-0 top-0 bottom-0"
            style={{ width: "50%", backgroundColor: "var(--color-bg-primary)" }}
            animate={{ x: isOpen ? "100%" : "0%" }}
            transition={{ duration: DOOR_DURATION, ease: isOpen ? DOOR_EASE_OPEN : DOOR_EASE_CLOSE }}
          />

          {/*
            4. Door edge lines — HTML overflow:hidden container fixes them to the
            inner-box region. CSS overflow always clips in the parent's own
            coordinate space, so the clip stays put regardless of the child
            CSS transform. Both lines start at the door centre (w/2 − ix1 from
            container left) and slide the same distance as their door panel.
          */}
          {w > 0 && h > 0 && (
            <div
              style={{
                position: "absolute",
                left: ix1, top: iy1,
                width: ix2 - ix1, height: iy2 - iy1,
                overflow: "hidden",
                zIndex: 9,
                pointerEvents: "none",
              }}
            >
              {/* Left door edge */}
              <motion.div
                style={{
                  position: "absolute",
                  left: w / 2 - ix1,
                  top: 0, bottom: 0, width: 2,
                  backgroundColor: BROWN,
                }}
                animate={{ x: isOpen ? -(w / 2) : 0 }}
                transition={{ duration: DOOR_DURATION, ease: isOpen ? DOOR_EASE_OPEN : DOOR_EASE_CLOSE }}
              />
              {/* Right door edge */}
              <motion.div
                style={{
                  position: "absolute",
                  left: w / 2 - ix1,
                  top: 0, bottom: 0, width: 2,
                  backgroundColor: BROWN,
                }}
                animate={{ x: isOpen ? w / 2 : 0 }}
                transition={{ duration: DOOR_DURATION, ease: isOpen ? DOOR_EASE_OPEN : DOOR_EASE_CLOSE }}
              />
            </div>
          )}

          {/* 5. Frame overlay — always on top */}
          {w > 0 && h > 0 && (
            <svg
              width={w} height={h} viewBox={`0 0 ${w} ${h}`}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                pointerEvents: "none",
                display: "block",
              }}
            >
              {/* Pilaster edges */}
              <line x1={P}     y1={0} x2={P}     y2={h} stroke={BROWN} strokeWidth={2} />
              <line x1={w - P} y1={0} x2={w - P} y2={h} stroke={BROWN} strokeWidth={2} />

              {/* Inner box */}
              <line x1={ix1} y1={iy1} x2={ix2} y2={iy1} stroke={BROWN} strokeWidth={2} />
              <line x1={ix1} y1={iy2} x2={ix2} y2={iy2} stroke={BROWN} strokeWidth={2} />
              <line x1={ix1} y1={iy1} x2={ix1} y2={iy2} stroke={BROWN} strokeWidth={2} />
              <line x1={ix2} y1={iy1} x2={ix2} y2={iy2} stroke={BROWN} strokeWidth={2} />

              {/* Cornice diagonals */}
              <line x1={P}     y1={0} x2={ix1} y2={iy1} stroke={BROWN} strokeWidth={2} />
              <line x1={w - P} y1={0} x2={ix2} y2={iy1} stroke={BROWN} strokeWidth={2} />
              <line x1={P}     y1={h} x2={ix1} y2={iy2} stroke={BROWN} strokeWidth={2} />
              <line x1={w - P} y1={h} x2={ix2} y2={iy2} stroke={BROWN} strokeWidth={2} />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
