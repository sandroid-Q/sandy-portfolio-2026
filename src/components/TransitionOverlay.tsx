"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Match the elevator interior hover state colours from Elevator.tsx
const DARK_BG = "#0034FF";   // SURFACE_QUATERNARY — hover bg in dark mode
const LIGHT_BG = "#161719";  // SURFACE_SECONDARY  — hover bg in light mode
const SPARKLE = "#F8F8F8";   // ON_SURFACE_PRIMARY — sparkle colour in both modes

const SPARKLE_DUR = 2.0;
const SPARKLE_REPEAT_DELAY = 3.0;
const CYCLE = SPARKLE_DUR + SPARKLE_REPEAT_DELAY;
const STRIDE = 31;

const SPARKLE_POSITIONS: [number, number, number][] = [
  [0.04,0.04,6],[0.15,0.03,5],[0.26,0.05,7],[0.37,0.04,5],[0.48,0.02,6],[0.59,0.05,7],[0.70,0.03,5],[0.81,0.04,6],[0.92,0.05,5],[0.99,0.03,7],
  [0.09,0.15,5],[0.20,0.13,7],[0.31,0.15,6],[0.42,0.14,5],[0.53,0.16,7],[0.64,0.14,6],[0.75,0.13,5],[0.86,0.15,7],[0.97,0.14,6],[0.99,0.16,5],
  [0.04,0.25,7],[0.15,0.23,6],[0.26,0.24,5],[0.37,0.26,7],[0.48,0.24,6],[0.59,0.23,5],[0.70,0.25,7],[0.81,0.24,6],[0.92,0.23,5],[0.99,0.25,6],
  [0.09,0.33,6],[0.20,0.35,5],[0.31,0.34,7],[0.42,0.33,6],[0.53,0.35,5],[0.64,0.33,7],[0.75,0.35,6],[0.86,0.34,5],[0.97,0.33,7],[0.99,0.35,6],
  [0.04,0.45,5],[0.15,0.43,7],[0.26,0.44,6],[0.37,0.46,5],[0.48,0.44,7],[0.59,0.43,6],[0.70,0.45,5],[0.81,0.44,7],[0.92,0.46,6],[0.99,0.44,5],
  [0.09,0.53,7],[0.20,0.55,6],[0.31,0.54,5],[0.42,0.53,7],[0.53,0.55,6],[0.64,0.53,5],[0.75,0.55,7],[0.86,0.54,6],[0.97,0.53,5],[0.99,0.55,7],
  [0.04,0.65,6],[0.15,0.63,5],[0.26,0.64,7],[0.37,0.66,6],[0.48,0.64,5],[0.59,0.63,7],[0.70,0.65,6],[0.81,0.64,5],[0.92,0.63,7],[0.99,0.65,6],
  [0.09,0.75,5],[0.20,0.73,7],[0.31,0.74,6],[0.42,0.76,5],[0.53,0.74,7],[0.64,0.73,6],[0.75,0.75,5],[0.86,0.74,7],[0.97,0.75,6],[0.99,0.73,5],
  [0.04,0.83,7],[0.15,0.85,6],[0.26,0.84,5],[0.37,0.83,7],[0.48,0.85,6],[0.59,0.84,5],[0.70,0.83,7],[0.81,0.85,6],[0.92,0.84,5],[0.99,0.83,7],
  [0.09,0.95,6],[0.20,0.93,5],[0.31,0.94,7],[0.42,0.95,6],[0.53,0.93,5],[0.64,0.95,7],[0.75,0.94,6],[0.86,0.93,5],[0.97,0.94,7],[0.99,0.95,6],
];

const N = SPARKLE_POSITIONS.length;
const SPARKLES = SPARKLE_POSITIONS.map(([xf, yf, r], i) => ({
  xf, yf, r,
  delay: ((i * STRIDE) % N) / N * CYCLE,
}));

function sparklePath(r: number): string {
  const s = r * 0.18;
  return `M 0 ${-r} L ${s} ${-s} L ${r} 0 L ${s} ${s} L 0 ${r} L ${-s} ${s} L ${-r} 0 L ${-s} ${-s} Z`;
}

interface TransitionOverlayProps {
  initial: { opacity: number };
  animate: { opacity: number };
  transition: object;
  zIndex?: number;
  // Staged exit: sparkles animate directly to zero before background fades
  stagedExit?: boolean;
}

export default function TransitionOverlay({
  initial,
  animate,
  transition,
  zIndex = 1000,
  stagedExit = false,
}: TransitionOverlayProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const bgColor = isDark ? DARK_BG : LIGHT_BG;

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: bgColor,
        zIndex,
        pointerEvents: "none",
      }}
    >
      {/* Unmount sparkles immediately on staged exit — the background is still
          fully opaque so the instant removal is invisible, and avoids the
          mid-cycle snap that happens when interrupting repeat:Infinity. */}
      {!stagedExit && (
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          {SPARKLES.map((sp, i) => (
            <motion.g
              key={i}
              style={{ x: sp.xf * 1000, y: sp.yf * 1000 }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: SPARKLE_DUR,
                delay: sp.delay,
                repeat: Infinity,
                repeatDelay: SPARKLE_REPEAT_DELAY,
                ease: "easeInOut",
              }}
            >
              <path d={sparklePath(sp.r)} fill={SPARKLE} />
            </motion.g>
          ))}
        </svg>
      )}
    </motion.div>
  );
}
