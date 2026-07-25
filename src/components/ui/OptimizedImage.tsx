"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { IMAGE_DIMS } from "@/lib/imageDims";
import { useCarouselLoad } from "./carouselLoad";

type Props = {
  src: string;
  alt: string;
  /** Responsive size hint — how wide the image renders at various breakpoints. */
  sizes?: string;
  style?: CSSProperties;
  className?: string;
  priority?: boolean;
  quality?: number;
  /** Fill a positioned parent (for fixed-aspect / object-fit crop containers). */
  fill?: boolean;
};

// Start loading this far ahead of the viewport (~1.5–2 screens) so images finish
// downloading before they scroll in and their reveal animation fires — avoids the
// "pop / lag" on slow connections while keeping the initial load light.
const LOAD_AHEAD = "1500px 0px";

/**
 * Thin wrapper over next/image that pulls intrinsic dimensions from the
 * generated manifest (src/lib/imageDims.ts). next/image then serves AVIF/WebP
 * with an automatic fallback to the source format for older browsers, and a
 * per-device resized variant driven by `sizes` — so phones download small images.
 *
 * Loading strategy:
 *  - `priority` → load immediately (above-the-fold hero images).
 *  - inside a carousel (CarouselLoadContext) → hold a reserved-space placeholder
 *    until the carousel nears the viewport, then load every card together.
 *  - otherwise → hold a placeholder until the image is within ~1.5 screens of the
 *    viewport, then load it (a wider lead than the browser's default lazy).
 */
export default function OptimizedImage({
  src,
  alt,
  sizes = "100vw",
  style,
  className,
  priority,
  quality = 75,
  fill,
}: Props) {
  const carouselLoad = useCarouselLoad();
  const dims = IMAGE_DIMS[src];
  const standalone = carouselLoad == null;

  // Standalone load-ahead gate.
  const holderRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!standalone || priority || near) return;
    const el = holderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: LOAD_AHEAD }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [standalone, priority, near]);

  const show = priority || carouselLoad === true || (standalone && near);

  if (!show) {
    // Reserved-space placeholder (no download yet). Ref'd so the load-ahead
    // observer can watch its position.
    const ph: CSSProperties = fill
      ? { position: "absolute", inset: 0, ...style }
      : { ...style, ...(dims && !style?.aspectRatio ? { aspectRatio: `${dims[0]} / ${dims[1]}` } : {}) };
    return <div ref={holderRef} aria-hidden className={className} style={ph} />;
  }

  // Only mounted once it should load, so eager (priority manages its own preload).
  const loading = priority ? undefined : "eager";

  if (!dims && !fill) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading={loading} style={style} className={className} />;
  }

  const common = { src, alt, sizes, quality, priority, loading, className, style } as const;
  if (fill) return <NextImage {...common} fill />;
  const [w, h] = dims!;
  return <NextImage {...common} width={w} height={h} />;
}
