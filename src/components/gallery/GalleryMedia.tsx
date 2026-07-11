"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const VIDEO_EXT = /\.(mp4|mov|webm)$/i;

/**
 * A single media element: a looping, in-view-only video for video files, an
 * image (incl. animated GIFs) otherwise. `style` is merged over the base sizing
 * (full width, auto height) — pass `aspectRatio`/`borderRadius` there.
 */
export default function GalleryMedia({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
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
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" style={{ ...base, objectFit: "cover" }} />;
}
