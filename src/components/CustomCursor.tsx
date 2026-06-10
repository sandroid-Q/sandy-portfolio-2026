"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const CURSOR_COLOR = "#FFFFFF";
const RING_SIZE = 40;
const DOT_DEFAULT = 9;

const INTERACTIVE_TAGS = new Set(["a", "button", "input", "select", "textarea", "label", "summary"]);

function isClickable(el: HTMLElement): boolean {
  let node: HTMLElement | null = el;
  while (node && node !== document.documentElement) {
    if (INTERACTIVE_TAGS.has(node.tagName.toLowerCase())) return true;
    const role = node.getAttribute("role");
    if (role === "button" || role === "link") return true;
    // React sets cursor via inline style — readable even under cursor:none !important
    if (node.style.cursor === "pointer") return true;
    node = node.parentElement;
  }
  return false;
}

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring uses manually-driven motion values so we can snap or spring at will
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const clickableRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animX = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animY = useRef<any>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      mouseX.set(cx);
      mouseY.set(cy);

      // Clickable detection
      const el = document.elementFromPoint(cx, cy) as HTMLElement | null;
      if (el) {
        const nowClickable = isClickable(el);
        if (nowClickable !== clickableRef.current) {
          clickableRef.current = nowClickable;
          setClickable(nowClickable);
        }
      }

      if (clickableRef.current) {
        // Snap ring directly to cursor — no lag
        animX.current?.stop();
        animY.current?.stop();
        ringX.set(cx);
        ringY.set(cy);
      } else {
        // Spring follow with lag
        animX.current?.stop();
        animY.current?.stop();
        animX.current = animate(ringX, cx, { type: "spring", stiffness: 220, damping: 22, mass: 0.2 });
        animY.current = animate(ringY, cy, { type: "spring", stiffness: 220, damping: 22, mass: 0.2 });
      }

      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      animX.current?.stop();
      animY.current?.stop();
    };
  }, [mouseX, mouseY, ringX, ringY]);

  if (isTouch) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 99999,
        mixBlendMode: "difference",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* Ring — spring lag when idle, snaps to dot when clickable */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: RING_SIZE,
          height: RING_SIZE,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "50%",
          border: `0.7px solid ${CURSOR_COLOR}`,
          backgroundColor: "transparent",
        }}
      />

      {/* Dot — always on cursor, grows to fill ring on clickable */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "50%",
          backgroundColor: CURSOR_COLOR,
        }}
        animate={{
          width: clickable ? RING_SIZE : DOT_DEFAULT,
          height: clickable ? RING_SIZE : DOT_DEFAULT,
        }}
        transition={{
          duration: 0.18,
          ease: clickable ? "easeIn" : "easeOut",
        }}
      />
    </div>
  );
}
