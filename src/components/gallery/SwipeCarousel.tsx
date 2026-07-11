"use client";

import { useRef, useState } from "react";

/**
 * Full-bleed, centre-peek swipe carousel with a 4-point-star counter. Renders
 * arbitrary card nodes (each card decides its own aspect); the active card is
 * enlarged, neighbours peek and shrink, and clicking a peek or star advances.
 * Matches the mobile carousel used by MediaGallery.
 */
export default function SwipeCarousel({ cards, label = "Item" }: { cards: React.ReactNode[]; label?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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
    const el = scrollRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    // Full-bleed: break out of the page's side padding to span the viewport.
    <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
      <style>{`.sc-scroll::-webkit-scrollbar{display:none}`}</style>
      <div
        ref={scrollRef}
        className="sc-scroll"
        onScroll={onScroll}
        style={{ display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => { if (i !== active) goTo(i); }}
            style={{
              flex: "0 0 70%",
              scrollSnapAlign: "center",
              marginLeft: i === 0 ? "15%" : 0,
              marginRight: i === cards.length - 1 ? "15%" : 0,
              cursor: i === active ? "default" : "pointer",
              transform: i === active ? "scale(1)" : "scale(0.88)",
              transformOrigin: "center center",
              transition: "transform 0.35s ease",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {card}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginTop: 24 }}>
        {cards.map((_, i) => (
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
  );
}
