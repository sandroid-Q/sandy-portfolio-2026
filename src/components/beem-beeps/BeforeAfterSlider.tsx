"use client";

import { forwardRef, useRef, useState } from "react";

/**
 * A draggable before/after image comparison. The `after` image is the base; the
 * `before` image is revealed from the left as the divider is dragged right — so
 * dragging all the way right shows `before` in full, all the way left shows
 * `after`. Drag (or click) anywhere on the image to move the divider. Forwards a
 * ref to the container so callers can measure it.
 */
const BeforeAfterSlider = forwardRef<HTMLDivElement, {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  style?: React.CSSProperties;
}>(function BeforeAfterSlider({ before, after, beforeAlt, afterAlt, style }, ref) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setRefs = (el: HTMLDivElement | null) => {
    innerRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const update = (clientX: number) => {
    const el = innerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  const onDown = (e: React.PointerEvent) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); update(e.clientX); };
  const onMove = (e: React.PointerEvent) => { if (dragging.current) update(e.clientX); };
  const stop = () => { dragging.current = false; };

  const imgStyle: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" };
  const reveal = `inset(0 ${100 - pos}% 0 0)`;

  return (
    <div
      ref={setRefs}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      role="slider"
      aria-label="Drag to compare before and after"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        border: "1px solid var(--color-surface-secondary)",
        boxShadow: "var(--phone-shadow)",
        touchAction: "none",
        userSelect: "none",
        cursor: "ew-resize",
        ...style,
      }}
    >
      {/* Base: after */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterAlt} draggable={false} style={imgStyle} />
      {/* Overlay: before, revealed from the left up to the divider */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={before} alt={beforeAlt} draggable={false} style={{ ...imgStyle, clipPath: reveal, WebkitClipPath: reveal }} />

      {/* Divider + handle */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: 2, backgroundColor: "#FF82B8", pointerEvents: "none" }}>
        {/* Depth shadow: darkest right against the divider, fading smoothly left. */}
        <div style={{ position: "absolute", right: "100%", top: 0, bottom: 0, width: 18, background: "linear-gradient(to left, rgba(0, 0, 0, 0.09) 0%, rgba(0, 0, 0, 0.03) 45%, rgba(0, 0, 0, 0) 100%)", pointerEvents: "none" }} />
        <div
          style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 30, height: 30, borderRadius: "50%",
            backgroundColor: "#F8F8F8", border: "2px solid #FF82B8",
            boxShadow: "0 1px 5px rgba(0, 0, 0, 0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width={16} height={12} viewBox="0 0 16 12" fill="none">
            <path d="M6 2L2 6L6 10" stroke="#FF82B8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 2L14 6L10 10" stroke="#FF82B8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
});

export default BeforeAfterSlider;
