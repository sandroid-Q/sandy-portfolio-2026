"use client";

import NextImage from "next/image";
import type { CSSProperties } from "react";
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

/**
 * Thin wrapper over next/image that pulls intrinsic dimensions from the
 * generated manifest (src/lib/imageDims.ts). next/image then serves AVIF/WebP
 * with an automatic fallback to the source format for older browsers, and a
 * per-device resized variant driven by `sizes` — so phones download small
 * images. Falls back to a plain <img> if the src isn't in the manifest.
 *
 * Inside a carousel (CarouselLoadContext): while the carousel is off-screen it
 * renders a same-size placeholder (no download); once the carousel nears the
 * viewport it mounts the image eagerly — so every card loads together as one
 * unit, rather than one-per-swipe.
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

  // In a carousel that hasn't neared the viewport: reserve the space, defer load.
  if (carouselLoad === false) {
    const placeholder: CSSProperties = { ...style };
    if (!fill && dims && !placeholder.aspectRatio) {
      placeholder.aspectRatio = `${dims[0]} / ${dims[1]}`;
    }
    return <div aria-hidden className={className} style={placeholder} />;
  }

  // carouselLoad === true → force eager so off-screen carousel cards load too.
  const loading = carouselLoad ? "eager" : undefined;

  // Not in the manifest (e.g. a gif) — plain <img>.
  if (!dims && !fill) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading={loading ?? (priority ? undefined : "lazy")} style={style} className={className} />;
  }

  const common = {
    src,
    alt,
    sizes,
    quality,
    priority,
    loading: priority ? undefined : loading,
    className,
    style,
  } as const;

  if (fill) return <NextImage {...common} fill />;
  const [w, h] = dims!;
  return <NextImage {...common} width={w} height={h} />;
}
