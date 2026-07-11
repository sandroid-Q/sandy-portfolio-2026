"use client";

import { useEffect, useState } from "react";
import GalleryMedia from "./gallery/GalleryMedia";
import SwipeCarousel from "./gallery/SwipeCarousel";

const ITEMS = Array.from({ length: 14 }, (_, i) => `/reskin/reskin-${i + 1}.png`);
const AR = "375 / 812"; // 750 × 1624 phone screens
const RADIUS = 16;
const GAP = 16;

// Centred rows of equal-size items; each item is 1/maxPerRow wide so a shorter
// last row (e.g. the 4 in 5,5,4) sits centred under the full rows.
function Rows({ rows }: { rows: number[] }) {
  const maxPerRow = Math.max(...rows);
  const groups: { src: string; i: number }[][] = [];
  let idx = 0;
  for (const count of rows) {
    groups.push(ITEMS.slice(idx, idx + count).map((src, k) => ({ src, i: idx + k })));
    idx += count;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {groups.map((group, r) => (
        <div key={r} style={{ display: "flex", gap: GAP, justifyContent: "center" }}>
          {group.map(({ src, i }) => (
            <div key={i} style={{ width: `calc((100% - ${(maxPerRow - 1) * GAP}px) / ${maxPerRow})`, flexShrink: 0 }}>
              <GalleryMedia src={src} alt={`Re-skin ${i + 1}`} style={{ aspectRatio: AR, borderRadius: RADIUS }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ReskinGallery() {
  const [vw, setVw] = useState(0);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!vw) return null;

  // Mobile: two stacked carousels of seven.
  if (vw < 600) {
    const card = (src: string, i: number) => (
      <GalleryMedia key={i} src={src} alt={`Re-skin ${i + 1}`} style={{ aspectRatio: AR, borderRadius: RADIUS }} />
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 48, width: "100%" }}>
        <SwipeCarousel label="Re-skin" cards={ITEMS.slice(0, 7).map((s, i) => card(s, i))} />
        <SwipeCarousel label="Re-skin" cards={ITEMS.slice(7).map((s, i) => card(s, i + 7))} />
      </div>
    );
  }

  // Widest: 7 + 7. Mid: 5 + 5 + 4 (last row centred).
  return <Rows rows={vw < 1000 ? [5, 5, 4] : [7, 7]} />;
}
