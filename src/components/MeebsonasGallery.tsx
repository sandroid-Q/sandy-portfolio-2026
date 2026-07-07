"use client";

import { useEffect, useRef, useState } from "react";

// Number of items in the first row of the wide (5 + 4) layout.
const ROW1 = 5;

// Layout breakpoints (measured on the gallery's own width, not the viewport):
//   >= 700px → two centred rows (5 on top, 4 below), all equal size
//   >= 440px → 3 × 3 grid
//   <  440px → swipeable carousel with a flat-line indicator
const WIDE = 700;
const MID = 440;

export default function MeebsonasGallery({ images }: { images: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(WIDE);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mode = width >= WIDE ? "rows" : width >= MID ? "grid" : "carousel";

  const img = (src: string, i: number) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img key={i} src={src} alt={`Meebsona ${i + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />
  );

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

  const goTo = (i: number) => {
    const child = scrollRef.current?.children[i] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div ref={wrapRef} style={{ width: "100%" }}>
      {mode === "rows" && (
        // 5 + 4, both rows centred; every card is the same width (1/5 of the row).
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {[images.slice(0, ROW1), images.slice(ROW1)].map((row, r) => (
            <div key={r} style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              {row.map((src, i) => (
                <div key={i} style={{ width: "calc((100% - 64px) / 5)", flexShrink: 0 }}>
                  {img(src, r * ROW1 + i)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {mode === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: 16, rowGap: 32 }}>
          {images.map((src, i) => img(src, i))}
        </div>
      )}

      {mode === "carousel" && (
        <div>
          <style>{`.meebs-carousel::-webkit-scrollbar{display:none}`}</style>
          <div
            ref={scrollRef}
            className="meebs-carousel"
            onScroll={onScroll}
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {images.map((src, i) => (
              <div key={i} style={{ flex: "0 0 80%", scrollSnapAlign: "center" }}>
                {img(src, i)}
              </div>
            ))}
          </div>
          {/* Flat-line carousel indicator */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 24 }}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to Meebsona ${i + 1}`}
                onClick={() => goTo(i)}
                style={{
                  flex: "1 1 0",
                  maxWidth: 28,
                  height: 3,
                  borderRadius: 2,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  backgroundColor: i === active ? "var(--color-on-surface-primary)" : "var(--color-on-surface-tertiary)",
                  transition: "background-color 0.2s",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
