"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Signals whether images inside a carousel should load yet:
 *   null  → not inside a carousel (normal lazy behaviour)
 *   false → inside a carousel that hasn't neared the viewport → hold
 *   true  → carousel is near the viewport → load now, all together
 *
 * OptimizedImage reads this so an off-screen carousel loads its images as one
 * unit when scrolled to, instead of one-per-swipe.
 */
export const CarouselLoadContext = createContext<boolean | null>(null);

export function useCarouselLoad() {
  return useContext(CarouselLoadContext);
}

/**
 * Attach to a carousel via `useCarouselReady(ref)`: returns `ready`, which flips
 * true once the referenced element is within `rootMargin` of the viewport.
 */
export function useCarouselReady(ref: React.RefObject<HTMLElement | null>, rootMargin = "400px 0px") {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || ready) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, ready]);
  return ready;
}

/** Convenience wrapper: a div that provides the load signal to its children. */
export function CarouselLoad({ children, style, rootMargin }: { children: ReactNode; style?: React.CSSProperties; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useCarouselReady(ref, rootMargin);
  return (
    <div ref={ref} style={style}>
      <CarouselLoadContext.Provider value={ready}>{children}</CarouselLoadContext.Provider>
    </div>
  );
}
