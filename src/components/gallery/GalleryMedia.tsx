"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import OptimizedImage from "@/components/ui/OptimizedImage";

const VIDEO_EXT = /\.(mp4|mov|webm)$/i;

/**
 * A single media element: a looping, in-view-only video for video files, an
 * image (incl. animated GIFs) otherwise. `style` is merged over the base sizing
 * (full width, auto height) — pass `aspectRatio`/`borderRadius` there. `sizes`
 * is the responsive width hint for next/image (default assumes ~full width).
 */
export default function GalleryMedia({ src, alt, style, sizes }: { src: string; alt: string; style?: React.CSSProperties; sizes?: string }) {
  const isVideo = VIDEO_EXT.test(src);
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });

  useEffect(() => {
    if (!isVideo) return;
    const v = ref.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, isVideo]);

  const base: React.CSSProperties = { display: "block", width: "100%", height: "auto", ...style };

  if (isVideo) {
    return <video ref={ref} src={src} muted loop playsInline preload="none" style={base} />;
  }
  return <OptimizedImage src={src} alt={alt} sizes={sizes ?? "(max-width: 800px) 100vw, 700px"} style={{ ...base, objectFit: "cover" }} />;
}
