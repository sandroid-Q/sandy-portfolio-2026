"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Caption from "./Caption";
import BeforeAfterSlider from "./BeforeAfterSlider";
import SwipeCarousel from "../gallery/SwipeCarousel";

const BEFORE = "/beem beeps/before-new.png";

/**
 * "New Activity Filters" — the before/after Pending screen on top fans out to
 * the four filtered result screens below. Rounded right-angle connectors exit
 * the left/right edges of the top screen (two per side) and drop down to the
 * top-centre of each result screen, so they stay in the gutters and never cross
 * the screenshots. Re-measured on resize; hidden when the results reflow to a
 * 2-up grid on narrow screens.
 */

const TOP = "/beem beeps/filter-before-after.png";
const RESULTS = [
  { src: "/beem beeps/filter-they-owe.png", alt: "They owe filter", caption: "Requests" },
  { src: "/beem beeps/filter-you-owe.png", alt: "You owe filter", caption: "Pay" },
  { src: "/beem beeps/filter-groups.png", alt: "Groups filter", caption: "Groups" },
  { src: "/beem beeps/filter-scheduled.png", alt: "Scheduled filter", caption: "Scheduled" },
];

// Where on the top screen's side edge the connectors start (fraction of its
// height). Both lines on a side share this one point, then branch down to their
// screens — so the inner (centre) screen leaves from the same point as the outer.
const START_FRAC = 0.32;
// Corner radius for the rounded 90° turn (capped per-line to what fits).
const RADIUS = 38;

const LINE = "color-mix(in srgb, var(--color-on-surface-tertiary) 60%, transparent)";
const DOT = "var(--color-feature-secondary)";
// Below this the results reflow to a 2-up grid.
const STACK_W = 640;
// At/below this the results become a swipe carousel.
const CAROUSEL_W = 400;
// Below this the row compresses enough that the connectors would overlap the
// top screen, so they're hidden (while the images stay in a row down to STACK_W).
const LINES_W = 880;

type Seg = { d: string; sx: number; sy: number; ex: number; ey: number };

export default function ActivityFilters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [segs, setSegs] = useState<Seg[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [stack, setStack] = useState(false);
  const [carousel, setCarousel] = useState(false);

  const measure = useCallback(() => {
    const c = containerRef.current;
    const top = topRef.current;
    if (!c) return;
    const vw = window.innerWidth;
    setStack(vw < STACK_W);
    setCarousel(vw <= CAROUSEL_W);
    const cr = c.getBoundingClientRect();
    setSize({ w: cr.width, h: cr.height });
    // Hide the connectors once the row compresses enough to overlap the top screen.
    if (vw < LINES_W || !top) { setSegs([]); return; }
    const tr = top.getBoundingClientRect();
    const next: Seg[] = [];
    RESULTS.forEach((_, i) => {
      const el = resultRefs.current[i];
      if (!el) return;
      const br = el.getBoundingClientRect();
      const left = i < 2;
      // Start on the top screen's left/right edge; drop to the result's top-centre.
      const sx = (left ? tr.left : tr.right) - cr.left;
      const sy = tr.top - cr.top + tr.height * START_FRAC - 22;
      const cx = br.left - cr.left + br.width / 2;
      // End (and dot) sit 6px above the result's caption.
      const ey = br.top - cr.top - 6;
      const r = Math.max(2, Math.min(RADIUS, Math.abs(cx - sx) - 1, Math.abs(ey - sy) - 1));
      const approachX = left ? cx + r : cx - r;
      // Horizontal out to the corner, rounded turn, then straight down.
      const d = `M ${sx} ${sy} L ${approachX} ${sy} Q ${cx} ${sy} ${cx} ${sy + r} L ${cx} ${ey}`;
      next.push({ d, sx, sy, ex: cx, ey });
    });
    setSegs(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const c = containerRef.current;
    const ro = new ResizeObserver(measure);
    if (c) ro.observe(c);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure]);

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 72 }}>
      {/* Connector overlay — rounded right-angle lines routed through the gutters. */}
      <svg
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible", zIndex: 2 }}
        aria-hidden
      >
        {segs.map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke={LINE} strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {/* Pink dot at each line's end, just above its result caption. */}
        {segs.map((s, i) => <circle key={`end${i}`} cx={s.ex} cy={s.ey} r={2.5} fill={DOT} />)}
        {/* One pink dot per side, where the lines meet the top image. */}
        {segs.map((s, i) => ((i === 0 || i === 2) ? <circle key={`dot${i}`} cx={s.sx} cy={s.sy} r={2.5} fill={DOT} /> : null))}
      </svg>

      {/* Top: before/after Pending screen — draggable comparison slider */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
        <Caption>Before vs After</Caption>
        <BeforeAfterSlider
          ref={topRef}
          before={BEFORE}
          after={TOP}
          beforeAlt="Pending activity — before"
          afterAlt="Pending activity — after"
          style={{ width: 200, maxWidth: "60vw", aspectRatio: "1125 / 2436" }}
        />
      </div>

      {/* Bottom: four filtered result screens — swipe carousel on the narrowest
          screens, else a centred grid/row. */}
      {carousel ? (
        <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
          <SwipeCarousel label="Filter" cards={RESULTS.map((r) => <ResultCard key={r.src} r={r} />)} />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            display: stack ? "grid" : "flex",
            gridTemplateColumns: stack ? "repeat(2, 1fr)" : undefined,
            justifyContent: "center",
            gap: stack ? 24 : "clamp(16px, 4vw, 40px)",
            position: "relative", zIndex: 1,
          }}
        >
          {RESULTS.map((r, i) => (
            <div
              key={r.src}
              ref={(el) => { resultRefs.current[i] = el; }}
              style={{ width: "100%", maxWidth: stack ? "100%" : 186, justifySelf: "center" }}
            >
              <ResultCard r={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultCard({ r }: { r: (typeof RESULTS)[number] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <Caption>{r.caption}</Caption>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={r.src}
        alt={r.alt}
        loading="lazy"
        style={{ display: "block", width: "100%", borderRadius: 16, border: "1px solid var(--color-surface-secondary)", boxShadow: "var(--phone-shadow)" }}
      />
    </div>
  );
}
