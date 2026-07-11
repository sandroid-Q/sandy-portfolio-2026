"use client";

import { useEffect, useState } from "react";
import GalleryMedia from "./gallery/GalleryMedia";
import SwipeCarousel from "./gallery/SwipeCarousel";

const TALL_AR = "9 / 22"; // 1080 × 2640 sticker recordings

const ITEMS = [
  { src: "/beem-app-stickers/sticker-1.gif", ar: "1 / 1" },
  { src: "/beem-app-stickers/sticker-2.mp4", ar: TALL_AR },
  { src: "/beem-app-stickers/sticker-3.mp4", ar: TALL_AR },
  { src: "/beem-app-stickers/sticker-4.mp4", ar: TALL_AR },
  { src: "/beem-app-stickers/sticker-5.gif", ar: "1 / 1" },
];

// Figma landing frame (1000 × 555.27): five 170.07-wide (17.007%) stickers.
// The three tall videos (2,3,4) sit low with the middle one raised to the top;
// the two square gifs (1,5) cap the ends, aligned with the side videos' tops.
const STAGGER = [
  { left: 0, top: 25.116 },
  { left: 20.748, top: 25.116 },
  { left: 41.497, top: 0 },
  { left: 62.245, top: 25.116 },
  { left: 82.993, top: 25.116 },
];
const ITEM_W = 17.007; // % of frame width
const RADIUS = 12;

export default function BeemStickers() {
  const [vw, setVw] = useState(0);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!vw) return null; // render once measured so the right tier paints first

  const media = (i: number) => (
    <GalleryMedia src={ITEMS[i].src} alt={`Beem sticker ${i + 1}`} style={{ aspectRatio: ITEMS[i].ar, borderRadius: RADIUS }} />
  );

  // Mobile: the three videos in one carousel, the two gifs in a second below —
  // they're different shapes, so they get their own carousels.
  if (vw < 600) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 48, width: "100%" }}>
        <SwipeCarousel label="Beem sticker" cards={[1, 2, 3].map((i) => media(i))} />
        <SwipeCarousel label="Beem sticker" cards={[0, 4].map((i) => media(i))} />
      </div>
    );
  }

  // Mid: the three videos in a row, the two gifs centred on a row below.
  if (vw < 1000) {
    const itemW = "clamp(110px, 19vw, 180px)";
    const row: React.CSSProperties = { display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 24, flexWrap: "wrap", width: "100%" };
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
        <div style={row}>
          {[1, 2, 3].map((i) => <div key={i} style={{ width: itemW }}>{media(i)}</div>)}
        </div>
        <div style={row}>
          {[0, 4].map((i) => <div key={i} style={{ width: itemW }}>{media(i)}</div>)}
        </div>
      </div>
    );
  }

  // Landing: the staggered Figma row of five.
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1000 / 555.27" }}>
      {ITEMS.map((_, i) => (
        <div key={i} style={{ position: "absolute", left: `${STAGGER[i].left}%`, top: `${STAGGER[i].top}%`, width: `${ITEM_W}%` }}>
          {media(i)}
        </div>
      ))}
    </div>
  );
}
