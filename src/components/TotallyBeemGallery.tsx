"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// Crop + rounding, as percentages so it scales with the video (no gap
// discrepancies as things resize). ~0.99% v / ~1.40% h ≈ 5px / 4px at the
// widest (~285×507) grid cell.
const CLIP = "inset(0.99% 1.4% round 16.5px)";

// Below this viewport (screen) width the grid becomes a swipe carousel.
const CAROUSEL_VW = 600;
// Container width at which the desktop grid gap reaches its 16px minimum.
const GRID_MIN_W = 540;

function CroppedVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });

  // Play whenever visible (covers the centred card and the peeking neighbours);
  // off-screen cards pause. aspect-ratio reserves the correct height before the
  // video loads so the peek never collapses to an empty rectangle.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        style={{ display: "block", width: "100%", height: "auto", aspectRatio: "540 / 960", clipPath: CLIP, WebkitClipPath: CLIP }}
      />
    </div>
  );
}

export default function TotallyBeemGallery({ videos }: { videos: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);   // container width (for grid gap)
  const [vw, setVw] = useState(CAROUSEL_VW + 1); // viewport width (for the breakpoint)
  const [active, setActive] = useState(0);
  // Gates rendering until we've measured, so the correct layout paints first
  // (via useLayoutEffect) instead of flashing the wrong one on mount.
  const [ready, setReady] = useState(false);
  // Last measured height, used to ease the height change on a layout swap.
  const lastHeight = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => { setWidth(el.clientWidth); setVw(window.innerWidth); setReady(true); };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isCarousel = vw < CAROUSEL_VW;

  // Desktop grid gap shrinks from 72px (at the 1000px max) down to 16px as the
  // container narrows, so the gap absorbs the change and the videos stay large.
  const gridGap = Math.round(Math.max(16, Math.min(72, 16 + ((width - GRID_MIN_W) / (1000 - GRID_MIN_W)) * (72 - 16))));

  // Entering carousel mode: start centred on (and enlarge) the first card.
  useEffect(() => {
    if (!isCarousel) return;
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot reset on entering the carousel
    setActive(0);
  }, [isCarousel]);

  // On a layout swap (grid ↔ carousel) the two heights differ; ease the gallery's
  // occupied height from the old to the new so the content below slides into
  // place instead of jumping. No overflow clipping (it would fight the carousel's
  // full-bleed) — the brief grow overflow is absorbed by the section gap below.
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const from = lastHeight.current;
    const to = el.offsetHeight;
    if (from != null && from > 0 && to > 0 && from !== to) {
      el.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 240, easing: "ease-in-out" });
    }
  }, [isCarousel]);

  // Record the height after every render (defined after the ease effect so that
  // one reads the pre-swap height first).
  useLayoutEffect(() => {
    if (wrapRef.current) lastHeight.current = wrapRef.current.offsetHeight;
  });

  // Track the centred card as the carousel scrolls.
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const child = c as HTMLElement;
      const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    setActive(best);
  };

  // Centre card i within the carousel (reliable manual scroll — scrollIntoView
  // is flaky inside a horizontal snap container). onScroll then updates `active`.
  const goTo = (i: number) => {
    const el = scrollRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      {ready && (
        isCarousel ? (
        // Full-bleed: break out of the page's side padding so the carousel
        // spans the whole viewport width. `calc(50% - 50vw)` resolves to
        // -sidePad, pinning the left edge to the screen edge.
        <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
          <style>{`.tb-carousel::-webkit-scrollbar{display:none}`}</style>
          {/* Centre-aligned active card with the neighbours peeking; swipe, or
              click a peek / counter dot to advance. End margins let the first
              and last cards centre too. */}
          <div
            ref={scrollRef}
            className="tb-carousel"
            onScroll={onScroll}
            style={{ position: "relative", display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((src, i) => (
              <div
                key={i}
                onClick={() => { if (i !== active) goTo(i); }}
                style={{
                  flex: "0 0 70%",
                  scrollSnapAlign: "center",
                  marginLeft: i === 0 ? "15%" : 0,
                  marginRight: i === videos.length - 1 ? "15%" : 0,
                  cursor: i === active ? "default" : "pointer",
                  // Neighbours sit a little smaller; the active card enlarges
                  // smoothly as it becomes centred.
                  transform: i === active ? "scale(1)" : "scale(0.88)",
                  transformOrigin: "center center",
                  transition: "transform 0.35s ease",
                }}
              >
                <CroppedVideo src={src} />
              </div>
            ))}
          </div>
          {/* 4-pointed-star carousel counter */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginTop: 24 }}>
            {videos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to video ${i + 1}`}
                onClick={() => goTo(i)}
                style={{ border: "none", padding: 0, background: "none", cursor: "pointer", display: "flex", lineHeight: 0 }}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" style={{ display: "block" }}>
                  <path
                    d="M12 0L15.36 8.64L24 12L15.36 15.36L12 24L8.64 15.36L0 12L8.64 8.64Z"
                    fill={i === active
                      ? "var(--color-on-surface-primary)"
                      : "color-mix(in srgb, var(--color-on-surface-tertiary) 50%, transparent)"}
                    style={{ transition: "fill 0.2s" }}
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Desktop: 3-column grid; gap shrinks with the viewport (min 16px).
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: gridGap, alignItems: "start" }}>
          {videos.map((src, i) => (
            <CroppedVideo key={i} src={src} />
          ))}
        </div>
        )
      )}
    </div>
  );
}
