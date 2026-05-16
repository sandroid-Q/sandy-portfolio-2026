"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const BROWN = "#4E3A34";
const TEXT_INVERSE = "#E5E0D7";
// Hover: full inversion. Pressed: both colours lightened ~20%.
const BROWN_PRESSED = "#71615D";
const TEXT_INVERSE_PRESSED = "#EFECE7";
const PILASTER = 36;
const BEVEL = 12;
const DEPTH = 16;
const FLOOR_DEPTH = 44; // how far up the back-wall bottom sits — larger = longer floor illusion

// All sparkles share the same dur/repeatDelay for consistent rhythm.
// ~40% on-time × 100 sparkles ≈ 40 visible at any moment.
const SPARKLE_DUR = 2.0;
const SPARKLE_REPEAT_DELAY = 3.0;
const CYCLE = SPARKLE_DUR + SPARKLE_REPEAT_DELAY; // 5.0 s

// Stride 31 is coprime with 100 → full permutation, so same-row sparkles
// get delays spread evenly across the cycle rather than bunching.
const STRIDE = 31;

interface SparkleSpec { xf: number; yf: number; r: number; delay: number }

// 10 rows × 10 cols = 100 sparkles. Even rows and odd rows stagger x by half
// pitch so the pattern looks organic. Sizes r=5–7 for visible weight.
const SPARKLE_POSITIONS: [number, number, number][] = [
  // row 1  y≈0.04  (even x origin)
  [0.04,0.04,6],[0.15,0.03,5],[0.26,0.05,7],[0.37,0.04,5],[0.48,0.02,6],[0.59,0.05,7],[0.70,0.03,5],[0.81,0.04,6],[0.92,0.05,5],[0.99,0.03,7],
  // row 2  y≈0.14  (odd x origin, shifted +0.05)
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
  xf,
  yf,
  r,
  delay: ((i * STRIDE) % N) / N * CYCLE,
}));

function sparklePath(r: number): string {
  const s = r * 0.18;
  return `M 0 ${-r} L ${s} ${-s} L ${r} 0 L ${s} ${s} L 0 ${r} L ${-s} ${s} L ${-r} 0 L ${-s} ${-s} Z`;
}

interface ElevatorOpenedProps {
  logoText?: string;
  welcomeText?: string;
}

export default function ElevatorOpened({
  logoText = "SQ",
  welcomeText = "WELCOME",
}: ElevatorOpenedProps) {
  const doorAreaRef = useRef<HTMLDivElement>(null);
  const [doorSize, setDoorSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const bgColor = pressed ? BROWN_PRESSED  : hovered ? BROWN         : TEXT_INVERSE;
  const fgColor = pressed ? TEXT_INVERSE_PRESSED : hovered ? TEXT_INVERSE : BROWN;

  useEffect(() => {
    const el = doorAreaRef.current;
    if (!el) return;
    const update = () => {
      setDoorSize({ w: el.offsetWidth, h: el.offsetHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = doorSize;
  const P = PILASTER;
  const B = BEVEL;
  const D = DEPTH;

  // Inner box (same geometry as ElevatorClosed)
  const ix1 = P + B;
  const iy1 = B;
  const ix2 = w - P - B;
  const iy2 = h - B;

  // Back wall — inset from inner box by DEPTH (floor bottom raised further for depth illusion)
  const bx1 = ix1 + D;
  const by1 = iy1 + D;
  const bx2 = ix2 - D;
  const by2 = iy2 - FLOOR_DEPTH;

  // Inner box dimensions for sparkle placement
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

      {/* Main cabinet */}
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

        {/* Interior area */}
        <div
          ref={doorAreaRef}
          className="relative overflow-hidden"
          style={{
            height: "min(512px, calc(100vh - 220px))",
            minHeight: 372,
            cursor: "pointer",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setPressed(false); }}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
        >
          {w > 0 && h > 0 && (
            <svg
              width={w}
              height={h}
              viewBox={`0 0 ${w} ${h}`}
              style={{ position: "absolute", inset: 0, display: "block" }}
            >
              <defs>
                <clipPath id="interior-clip">
                  <rect x={ix1} y={iy1} width={ix2 - ix1} height={iy2 - iy1} />
                </clipPath>
              </defs>

              {/* Interior background */}
              <motion.rect
                x={ix1} y={iy1}
                width={ix2 - ix1} height={iy2 - iy1}
                animate={{ fill: bgColor }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />

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

              {/* Back wall + depth diagonals — colour inherits from motion.g */}
              <motion.g
                animate={{ color: fgColor }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <line x1={bx1} y1={by1} x2={bx2} y2={by1} stroke="currentColor" strokeWidth={1} />
                <line x1={bx1} y1={by2} x2={bx2} y2={by2} stroke="currentColor" strokeWidth={1} />
                <line x1={bx1} y1={by1} x2={bx1} y2={by2} stroke="currentColor" strokeWidth={1} />
                <line x1={bx2} y1={by1} x2={bx2} y2={by2} stroke="currentColor" strokeWidth={1} />
                <line x1={ix1} y1={iy1} x2={bx1} y2={by1} stroke="currentColor" strokeWidth={1} />
                <line x1={ix2} y1={iy1} x2={bx2} y2={by1} stroke="currentColor" strokeWidth={1} />
                <line x1={ix1} y1={iy2} x2={bx1} y2={by2} stroke="currentColor" strokeWidth={1} />
                <line x1={ix2} y1={iy2} x2={bx2} y2={by2} stroke="currentColor" strokeWidth={1} />
              </motion.g>

              {/* Sparkles — clipped to the inner-box boundary, colour inherits from motion.g */}
              <g clipPath="url(#interior-clip)">
                <motion.g
                  animate={{ color: fgColor }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {iw > 0 && ih > 0 && SPARKLES.map((sp, i) => (
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
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
