"use client";

import { useState } from "react";
import { useAudio } from "@/contexts/AudioContext";

// Speaker glyph — sound waves when audible, a cross when muted.
function SpeakerIcon({ muted, color }: { muted: boolean; color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 L6 9 H3 v6 h3 l5 4 z" fill={color} />
      {muted ? (
        <>
          <line x1="16" y1="9" x2="21" y2="15" />
          <line x1="21" y1="9" x2="16" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.5 8.8 a4.5 4.5 0 0 1 0 6.4" />
          <path d="M18.5 6 a8 8 0 0 1 0 12" />
        </>
      )}
    </svg>
  );
}

/**
 * A small speaker toggle meant to sit next to a section heading, controlling a
 * single video's audio. Shows muted whenever the site is muted (which overrides
 * this toggle) or the toggle itself is off.
 */
export default function VideoSoundToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  const { muted: siteMuted } = useAudio();
  const [hovered, setHovered] = useState(false);
  const effectiveMuted = siteMuted || muted;
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={effectiveMuted ? "Unmute video" : "Mute video"}
      aria-pressed={!effectiveMuted}
      style={{
        width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
        background: hovered ? "var(--color-surface-transparent)" : "transparent",
        transition: "background-color 0.15s",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}
    >
      <SpeakerIcon muted={effectiveMuted} color="var(--color-on-surface-primary)" />
    </button>
  );
}
