"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const BROWN = "#4E3A34";
const PILASTER = 36; // width of the side rectangles flanking the doors
const BEVEL = 12;    // chamfer depth — how far the cornice diagonals travel

interface ElevatorClosedProps {
  logoText?: string;
  welcomeText?: string;
}

export default function ElevatorClosed({
  logoText = "SQ",
  welcomeText = "WELCOME",
}: ElevatorClosedProps) {
  const doorAreaRef = useRef<HTMLDivElement>(null);
  const [doorSize, setDoorSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = doorAreaRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setDoorSize({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = doorSize;
  const P = PILASTER;
  const B = BEVEL;

  return (
    <div className="flex flex-col items-center">
      {/*
        SQ badge — a semicircle (flat bottom) centred above the cabinet.
        marginBottom: 0 keeps the cabinet's top border fully visible as a
        clear separator line between the badge and the WELCOME bar.
      */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "min(120px, 40%)",
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
          width: "min(340px, calc(100vw - 48px))",
          border: `2px solid ${BROWN}`,
          backgroundColor: "var(--color-bg-primary)",
        }}
      >
        {/* WELCOME bar */}
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            height: 56,
            borderBottom: `2px solid ${BROWN}`,
          }}
        >
          <span
            className="font-silkscreen"
            style={{ color: BROWN, fontSize: 20 }}
          >
            {welcomeText}
          </span>
        </div>

        {/*
          Door area — overflow:hidden clips the panels when they eventually
          animate open. The two motion.divs are the actual door panels; the
          SVG overlay paints the surround frame on top of them.
        */}
        <div
          ref={doorAreaRef}
          className="relative overflow-hidden"
          style={{
            height: "min(512px, calc(100vh - 220px))",
            minHeight: "min(372px, calc(100vw - 48px))",
          }}
        >
          {/* Left door panel */}
          <motion.div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: "50%",
              backgroundColor: "var(--color-bg-primary)",
            }}
          />

          {/* Right door panel */}
          <motion.div
            className="absolute right-0 top-0 bottom-0"
            style={{
              width: "50%",
              backgroundColor: "var(--color-bg-primary)",
            }}
          />

          {/*
            SVG surround overlay.

            Geometry (P = pilaster width, B = bevel depth):
              • Pilaster edges: full-height verticals at x=P and x=w-P.
              • Inner box: a rectangle inset (P+B, B) → (w-P-B, h-B) that
                frames the door opening — 4 lines total.
              • Cornice diagonals: connect each pilaster top/bottom inner
                corner to the matching inner-box corner, creating the
                bevelled necker-cube depth effect.
              • Centre seam: splits the inner box top-to-bottom.
          */}
          {w > 0 && h > 0 && (
            <svg
              width={w}
              height={h}
              viewBox={`0 0 ${w} ${h}`}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                pointerEvents: "none",
                display: "block",
              }}
            >
              {/* Pilaster edges — full height */}
              <line x1={P}     y1={0} x2={P}     y2={h} stroke={BROWN} strokeWidth={2} />
              <line x1={w - P} y1={0} x2={w - P} y2={h} stroke={BROWN} strokeWidth={2} />

              {/* Inner box — top, bottom, left, right */}
              <line x1={P + B}     y1={B}     x2={w - P - B} y2={B}     stroke={BROWN} strokeWidth={2} />
              <line x1={P + B}     y1={h - B} x2={w - P - B} y2={h - B} stroke={BROWN} strokeWidth={2} />
              <line x1={P + B}     y1={B}     x2={P + B}     y2={h - B} stroke={BROWN} strokeWidth={2} />
              <line x1={w - P - B} y1={B}     x2={w - P - B} y2={h - B} stroke={BROWN} strokeWidth={2} />

              {/* Cornice diagonals — pilaster inner edge → inner box corner */}
              <line x1={P}     y1={0} x2={P + B}     y2={B}     stroke={BROWN} strokeWidth={2} />
              <line x1={w - P} y1={0} x2={w - P - B} y2={B}     stroke={BROWN} strokeWidth={2} />
              <line x1={P}     y1={h} x2={P + B}     y2={h - B} stroke={BROWN} strokeWidth={2} />
              <line x1={w - P} y1={h} x2={w - P - B} y2={h - B} stroke={BROWN} strokeWidth={2} />

              {/* Centre door seam */}
              <line x1={w / 2} y1={B} x2={w / 2} y2={h - B} stroke={BROWN} strokeWidth={2} />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
