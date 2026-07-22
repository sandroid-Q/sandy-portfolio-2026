"use client";

import { useRef, useState } from "react";

/**
 * Swipe carousel with a 4-point-star counter. Renders arbitrary card nodes
 * (each card decides its own aspect); side-scroll, click a star, or (with
 * `arrows`) use the side arrows to advance. Matches the mobile carousel used by
 * MediaGallery.
 *
 * `fullBleed` (default) breaks out to span the viewport; set it false to keep
 * the carousel inside its container (e.g. two carousels sitting side-by-side).
 * `peek` (default) shows shrunken neighbours either side of the active card;
 * set it false to show a single card at a time. `arrows` adds prev/next side
 * arrows.
 */
export default function SwipeCarousel({
  cards,
  label = "Item",
  fullBleed = true,
  peek = true,
  arrows = false,
}: {
  cards: React.ReactNode[];
  label?: string;
  fullBleed?: boolean;
  peek?: boolean;
  arrows?: boolean;
}) {
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
    const clamped = Math.max(0, Math.min(cards.length - 1, i));
    const child = el?.children[clamped] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    // Full-bleed breaks out of the page's side padding to span the viewport;
    // constrained mode stays within its container.
    <div style={fullBleed ? { width: "100vw", marginLeft: "calc(50% - 50vw)" } : { width: "100%" }}>
      <style>{`.sc-scroll::-webkit-scrollbar{display:none}`}</style>
      <div style={{ position: "relative" }}>
        <div
          ref={scrollRef}
          className="sc-scroll"
          onScroll={onScroll}
          style={{ display: "flex", gap: 16, overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              onClick={() => { if (peek && i !== active) goTo(i); }}
              style={{
                flex: peek ? "0 0 70%" : "0 0 100%",
                scrollSnapAlign: "center",
                marginLeft: peek && i === 0 ? "15%" : 0,
                marginRight: peek && i === cards.length - 1 ? "15%" : 0,
                cursor: peek && i !== active ? "pointer" : "default",
                transform: !peek || i === active ? "scale(1)" : "scale(0.88)",
                transformOrigin: "center center",
                transition: "transform 0.35s ease",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {card}
            </div>
          ))}
        </div>

        {arrows && (
          <>
            <Arrow dir="prev" onClick={() => goTo(active - 1)} disabled={active === 0} label={label} />
            <Arrow dir="next" onClick={() => goTo(active + 1)} disabled={active === cards.length - 1} label={label} />
          </>
        )}
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

function Arrow({ dir, onClick, disabled, label }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean; label: string }) {
  const isPrev = dir === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${isPrev ? "Previous" : "Next"} ${label.toLowerCase()}`}
      style={{
        position: "absolute",
        top: "50%",
        [isPrev ? "left" : "right"]: 4,
        transform: "translateY(-50%)",
        width: 34, height: 34, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "0.5px solid color-mix(in srgb, var(--color-on-surface-tertiary) 45%, transparent)",
        backgroundColor: "color-mix(in srgb, var(--color-project-surface) 92%, transparent)",
        color: "var(--color-on-surface-primary)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        transition: "opacity 0.2s",
        zIndex: 2,
      }}
    >
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
        <path d={isPrev ? "M15 5L8 12L15 19" : "M9 5L16 12L9 19"} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
