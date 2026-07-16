"use client";

import { useEffect, useState } from "react";
import SwipeCarousel from "../gallery/SwipeCarousel";
import Caption from "./Caption";

/**
 * The RECIPIENT (PAYEE) vs PAYER comparison from the Beem Beeps flow: two
 * constrained swipe carousels sitting side-by-side (split by a thin divider) on
 * wide screens, stacking vertically on narrow ones. Reuses the shared
 * SwipeCarousel (4-point-star counter, centre-peek) so behaviour matches the
 * carousels elsewhere on the site.
 */

const PAYEE = ["/beem beeps/requestor-1.png", "/beem beeps/requestor-2.png", "/beem beeps/requestor-3.png"];
const PAYER = ["/beem beeps/payer-1.png", "/beem beeps/payer-2.png", "/beem beeps/payer-3.png"];

const DIVIDER = "color-mix(in srgb, var(--color-on-surface-tertiary) 55%, transparent)";

const STACK_W = 640;

function shot(src: string, i: number, label: string) {
  // Constrained so the single card leaves side gutters for the arrows.
  // eslint-disable-next-line @next/next/no-img-element
  return <img key={i} src={src} alt={`${label} ${i + 1}`} loading="lazy" style={{ display: "block", width: "100%", maxWidth: 280, borderRadius: 20, border: "1px solid var(--color-surface-secondary)", boxShadow: "var(--phone-shadow)" }} />;
}

function Column({ label, items }: { label: string; items: string[] }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <Caption>{label}</Caption>
      <SwipeCarousel fullBleed={false} peek={false} arrows label={label} cards={items.map((s, i) => shot(s, i, label))} />
    </div>
  );
}

export default function PayeePayerCarousels() {
  const [stack, setStack] = useState(false);

  useEffect(() => {
    const update = () => setStack(window.innerWidth < STACK_W);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: stack ? "column" : "row",
        alignItems: "stretch",
        gap: stack ? 40 : 40,
      }}
    >
      <Column label="Recipient (Payee)" items={PAYEE} />
      <div
        style={
          stack
            ? { height: 1, width: "70%", alignSelf: "center", backgroundColor: DIVIDER }
            : { width: 1, alignSelf: "stretch", backgroundColor: DIVIDER }
        }
      />
      <Column label="Payer" items={PAYER} />
    </div>
  );
}
