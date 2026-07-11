"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useAudio } from "@/contexts/AudioContext";

// Below this viewport (screen) width the grid becomes a swipe carousel.
const CAROUSEL_VW = 600;
// At/above this viewport width, a `rows` gallery uses its centred-rows layout
// (e.g. 5 + 4); below it (down to CAROUSEL_VW) it falls back to the grid.
const ROWS_VW = 1000;
// Container width at which the desktop grid gap reaches its 16px minimum.
const GRID_MIN_W = 540;

const VIDEO_EXT = /\.(mp4|mov|webm)$/i;

// A single gallery item — a looping, in-view-only video for video files, an
// image otherwise. `clip` applies a clip-path (crop + rounding); `aspectRatio`
// reserves height so nothing collapses before the media loads. `sound` marks the
// one item that plays audio; `soundMuted` is its externally-controlled mute.
function GalleryItem({ src, clip, aspectRatio, objectPosition, alt, sound, soundMuted }: { src: string; clip?: string; aspectRatio?: string; objectPosition?: string; alt: string; sound?: boolean; soundMuted?: boolean }) {
  const isVideo = VIDEO_EXT.test(src);
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const { muted: siteMuted } = useAudio();
  // A video may only play *with sound* after the document has been user-activated.
  // Sticky activation carries across SPA navigation (same document), so arriving
  // via a link click already satisfies it (navigator.userActivation.hasBeenActive);
  // otherwise we unmute on the first gesture. Until then the item autoplays muted.
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!sound) return;
    const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot: activation already carried over from SPA nav
    if (ua?.hasBeenActive) { setActivated(true); return; }
    const act = () => setActivated(true);
    const opts: AddEventListenerOptions = { once: true };
    window.addEventListener("pointerdown", act, opts);
    window.addEventListener("keydown", act, opts);
    window.addEventListener("touchstart", act, opts);
    return () => {
      window.removeEventListener("pointerdown", act);
      window.removeEventListener("keydown", act);
      window.removeEventListener("touchstart", act);
    };
  }, [sound]);

  // The sound item wants audio unless the site or the (external) toggle muted it;
  // everything else — and a sound item before activation — stays muted so autoplay
  // works. The site mute always overrides.
  const wantSound = !!sound && !siteMuted && !soundMuted;
  const playMuted = !wantSound || !activated;

  useEffect(() => {
    if (!isVideo) return;
    const v = ref.current;
    if (!v) return;
    v.muted = playMuted;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [isVideo, inView, playMuted]);

  const style: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "auto",
    ...(aspectRatio ? { aspectRatio } : {}),
    ...(clip ? { clipPath: clip, WebkitClipPath: clip } : {}),
  };

  if (isVideo) {
    return <video ref={ref} src={src} muted={playMuted} loop playsInline preload="none" style={style} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" style={{ ...style, objectFit: "cover", ...(objectPosition ? { objectPosition } : {}) }} />;
}

interface MediaGalleryProps {
  /** Media srcs (videos and/or images), rendered in order. */
  items: string[];
  /** Desktop grid column count. Defaults to 3. */
  columns?: number;
  /** Optional clip-path (crop + rounding) applied to every item. */
  clip?: string;
  /** Optional aspect-ratio (e.g. "540 / 960") to reserve item height. */
  aspectRatio?: string;
  /** Per-item crop applied only in the mobile carousel/stack tiers: an
   *  aspect-ratio (crops via object-fit cover) and optional object-position
   *  (e.g. "top" to crop from the bottom). null/omitted → that item stays
   *  natural. Indexed to `items`. */
  carouselCrops?: ({ aspectRatio: string; objectPosition?: string } | null)[];
  /** Accessible label base, e.g. "Meebsona" → "Meebsona 1". */
  label?: string;
  /** Item counts per row for the widest tier (e.g. [5, 4]); centred rows of
   *  equal-size items. Above ROWS_VW only; below it uses the grid. */
  rows?: number[];
  /** What the gallery becomes below CAROUSEL_VW. "carousel" (default) is the
   *  swipe carousel; "stack" is a centred vertical stack sized to match the
   *  carousel card width (70vw). */
  mobileLayout?: "carousel" | "stack";
  /** Index of the one item that plays with audio (bound to the site mute). All
   *  other items stay muted. */
  soundIndex?: number;
  /** Externally-controlled mute for the `soundIndex` item (the toggle lives
   *  outside the gallery, e.g. next to the section heading). The site mute
   *  always overrides this. */
  soundMuted?: boolean;
}

/**
 * Responsive media gallery: a fluid multi-column grid on desktop that becomes a
 * full-bleed, centre-peek swipe carousel below 600px viewport width — with a
 * 4-point-star counter, scale-on-active, click/tap-to-advance, and an eased
 * height on the layout swap.
 */
export default function MediaGallery({ items, columns = 3, clip, aspectRatio, carouselCrops, label = "Item", rows, mobileLayout = "carousel", soundIndex, soundMuted }: MediaGalleryProps) {
  // Per-item aspect/object-position for the mobile tiers (falls back to natural).
  const mobileAspect = (i: number) => carouselCrops?.[i]?.aspectRatio ?? aspectRatio;
  const mobilePos = (i: number) => carouselCrops?.[i]?.objectPosition;
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);        // container width (for grid gap)
  const [vw, setVw] = useState(CAROUSEL_VW + 1);   // viewport width (for the breakpoint)
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

  const belowCarousel = vw < CAROUSEL_VW;
  const isCarousel = belowCarousel && mobileLayout === "carousel";
  // Layout tier: below CAROUSEL_VW → carousel or centred stack (per mobileLayout);
  // else centred rows (≥1000, if `rows` given), else grid.
  const mode: "carousel" | "stack" | "rows" | "grid" = belowCarousel
    ? (mobileLayout === "stack" ? "stack" : "carousel")
    : (rows && vw >= ROWS_VW ? "rows" : "grid");

  // Split items into the per-row groups for the rows layout; every item is sized
  // to 1/maxPerRow so the shorter row matches the longer one and centres.
  const maxPerRow = rows ? Math.max(...rows) : columns;
  const rowGroups: { src: string; i: number }[][] = [];
  if (rows) {
    let idx = 0;
    for (const count of rows) {
      rowGroups.push(items.slice(idx, idx + count).map((src, k) => ({ src, i: idx + k })));
      idx += count;
    }
  }

  // Desktop grid gap shrinks from 72px (at the 1000px max) down to 16px as the
  // container narrows, so the gap absorbs the change and the items stay large.
  const gridGap = Math.round(Math.max(16, Math.min(72, 16 + ((width - GRID_MIN_W) / (1000 - GRID_MIN_W)) * (72 - 16))));

  // Entering carousel mode: start centred on (and enlarge) the first card.
  useEffect(() => {
    if (!isCarousel) return;
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot reset on entering the carousel
    setActive(0);
  }, [isCarousel]);

  // On any layout swap the tiers have different heights; ease the gallery's
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
  }, [mode]);

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
        mode === "stack" ? (
        // Centred vertical stack; each item matches the carousel card width (70vw)
        // so it reads at the same size as the swipe carousel would.
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          {items.map((src, i) => (
            <div key={i} style={{ width: "70vw" }}>
              <GalleryItem src={src} clip={clip} aspectRatio={mobileAspect(i)} objectPosition={mobilePos(i)} alt={`${label} ${i + 1}`} sound={i === soundIndex} soundMuted={soundMuted} />
            </div>
          ))}
        </div>
      ) : mode === "carousel" ? (
        // Full-bleed: break out of the page's side padding so the carousel
        // spans the whole viewport width. `calc(50% - 50vw)` resolves to
        // -sidePad, pinning the left edge to the screen edge.
        <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
          <style>{`.mg-carousel::-webkit-scrollbar{display:none}`}</style>
          {/* Centre-aligned active card with the neighbours peeking; swipe, or
              click a peek / counter star to advance. End margins let the first
              and last cards centre too. */}
          <div
            ref={scrollRef}
            className="mg-carousel"
            onScroll={onScroll}
            style={{ position: "relative", display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((src, i) => (
              <div
                key={i}
                onClick={() => { if (i !== active) goTo(i); }}
                style={{
                  flex: "0 0 70%",
                  scrollSnapAlign: "center",
                  marginLeft: i === 0 ? "15%" : 0,
                  marginRight: i === items.length - 1 ? "15%" : 0,
                  cursor: i === active ? "default" : "pointer",
                  // Neighbours sit a little smaller; the active card enlarges
                  // smoothly as it becomes centred.
                  transform: i === active ? "scale(1)" : "scale(0.88)",
                  transformOrigin: "center center",
                  transition: "transform 0.35s ease",
                }}
              >
                <GalleryItem src={src} clip={clip} aspectRatio={mobileAspect(i)} objectPosition={mobilePos(i)} alt={`${label} ${i + 1}`} sound={i === soundIndex} soundMuted={soundMuted} />
              </div>
            ))}
          </div>
          {/* 4-pointed-star carousel counter */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginTop: 24 }}>
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to ${label.toLowerCase()} ${i + 1}`}
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
      ) : mode === "rows" ? (
        // Widest tier: centred rows (e.g. 5 + 4); every item is 1/maxPerRow wide
        // so the shorter row matches the longer one and centres.
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {rowGroups.map((group, r) => (
            <div key={r} style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              {group.map(({ src, i }) => (
                <div key={i} style={{ width: `calc((100% - ${(maxPerRow - 1) * 16}px) / ${maxPerRow})`, flexShrink: 0 }}>
                  <GalleryItem src={src} clip={clip} aspectRatio={aspectRatio} alt={`${label} ${i + 1}`} sound={i === soundIndex} soundMuted={soundMuted} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        // Mid tier: fixed-column layout; gap shrinks with the viewport (min 16px).
        // Flex-wrap (not CSS grid) so an incomplete last row centres — e.g. the
        // 7th of 7 across 3 columns, or a row of 3 under a row of 4. Items are
        // sized to a column width (minus 0.5px slack so rounding never overflows
        // and wraps a full row early).
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: gridGap, alignItems: "flex-start" }}>
          {items.map((src, i) => (
            <div key={i} style={{ width: `calc((100% - ${(columns - 1) * gridGap}px) / ${columns} - 0.5px)` }}>
              <GalleryItem src={src} clip={clip} aspectRatio={aspectRatio} alt={`${label} ${i + 1}`} sound={i === soundIndex} soundMuted={soundMuted} />
            </div>
          ))}
        </div>
        )
      )}
    </div>
  );
}
