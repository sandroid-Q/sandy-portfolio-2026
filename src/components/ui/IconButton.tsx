"use client";

import { useEffect, useState } from "react";
import { useAudio } from "@/contexts/AudioContext";

/**
 * The 48px square arrow button used for the scroll-down / back-to-top anchors.
 *
 * Interaction is driven by pointer events rather than mouse events so the
 * pressed/hover styling can't get stuck:
 *  - `hovered` is only ever set by a real mouse. Touch taps emit synthesised
 *    mouseenter (and never a matching mouseleave), which used to leave the
 *    button parked in its hover/active look after a tap.
 *  - `pressed` is released from a window-level listener, so a pointerup that
 *    lands outside the button — or a pointercancel when the tap turns into a
 *    scroll — still clears it.
 */
export default function IconButton({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: (color: string, hovered: boolean) => React.ReactNode;
}) {
  const { playButton } = useAudio();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const update = () => setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pressed) return;
    const release = () => setPressed(false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
    };
  }, [pressed]);

  useEffect(() => {
    if (!hovered) return;
    // The button can scroll out from under a stationary cursor (it triggers the
    // scroll itself), and no mouseleave ever fires — drop hover on window blur
    // or tab switch so it doesn't linger.
    const clear = () => setHovered(false);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [hovered]);

  const containerBg = pressed
    ? (isLight ? "#161719" : "#0034FF")
    : hovered
    ? (isLight ? "#0034FF" : "#F8F8F8")
    : (isLight ? "#E7EAF1" : "transparent");

  const borderColor = !isLight ? "#F8F8F8" : pressed ? "#F8F8F8" : "transparent";

  const arrowColor = isLight
    ? (hovered || pressed ? "#F8F8F8" : "#161719")
    : (hovered && !pressed ? "#161719" : "#F8F8F8");

  return (
    <button
      onClick={() => { playButton(); onClick(); }}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => { setHovered(false); setPressed(false); }}
      onBlur={() => { setHovered(false); setPressed(false); }}
      style={{
        backgroundColor: containerBg,
        borderRadius: 12,
        width: 48,
        height: 48,
        border: `1px solid ${borderColor}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.15s",
        overflow: "hidden",
        // Stop the tap from being interpreted as a pan/double-tap-zoom gesture,
        // which is what turns a press into a pointercancel mid-tap on mobile.
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {icon(arrowColor, hovered)}
    </button>
  );
}
