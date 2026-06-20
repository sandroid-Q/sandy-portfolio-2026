"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface ParallaxLayerProps {
  /** Normalised cursor position from useMouseParallax. */
  mx: MotionValue<number>;
  my: MotionValue<number>;
  /** When false, renders a plain div with no transforms (e.g. on mobile). */
  enabled?: boolean;
  /** Max translation in px; the layer drifts toward the cursor by this much. */
  shift?: number;
  /** Max 3D tilt in degrees toward the cursor. */
  tilt?: number;
  /** Extra scale applied as the cursor nears the viewport centre (e.g. 0.03). */
  scaleBoost?: number;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * A layer that drifts, tilts, and subtly scales with the cursor to create a
 * sense of depth. Give different layers different `shift`/`tilt` so they move
 * at different rates. Wrap in a container with `perspective` for the 3D tilt.
 */
export default function ParallaxLayer({
  mx,
  my,
  enabled = true,
  shift = 0,
  tilt = 0,
  scaleBoost = 0,
  style,
  children,
}: ParallaxLayerProps) {
  const x = useTransform(mx, [-1, 1], [-shift, shift]);
  const y = useTransform(my, [-1, 1], [-shift, shift]);
  const rotateY = useTransform(mx, [-1, 1], [tilt, -tilt]);
  const rotateX = useTransform(my, [-1, 1], [-tilt, tilt]);
  const scale = useTransform([mx, my], ([vx, vy]: number[]) =>
    1 + (1 - Math.min(1, Math.hypot(vx, vy))) * scaleBoost
  );

  if (!enabled) return <div style={style}>{children}</div>;

  return (
    <motion.div style={{ x, y, rotateX, rotateY, scale, transformStyle: "preserve-3d", ...style }}>
      {children}
    </motion.div>
  );
}
