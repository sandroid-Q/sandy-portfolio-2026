"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

/**
 * Tracks the cursor as a normalised position from the viewport centre
 * (-1 … 1 on each axis) and returns spring-smoothed motion values. Feed these
 * into ParallaxLayer to give elements a sense of depth as the mouse moves.
 *
 * No-ops (stays centred) when disabled, on coarse pointers (touch), or when the
 * user prefers reduced motion.
 */
export function useMouseParallax(enabled = true): { mx: MotionValue<number>; my: MotionValue<number> } {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (!enabled) { mx.set(0); my.set(0); return; }
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) { mx.set(0); my.set(0); return; }

    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, mx, my]);

  return { mx: sx, my: sy };
}
