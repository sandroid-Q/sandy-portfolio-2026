"use client";

import { useState } from "react";

interface ElevatorButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export default function ElevatorButton({ isOpen, onClick, className }: ElevatorButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className={className}
      style={{
        width: 60,
        height: 120,
        border: "2px solid var(--color-on-surface-primary)",
        padding: "19px 12px 60px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        backgroundColor: pressed
          ? "var(--color-surface-quaternary)"
          : hovered
          ? "var(--color-on-surface-primary)"
          : "var(--color-surface-primary)",
        color: hovered && !pressed
          ? "var(--color-surface-primary)"
          : "var(--color-on-surface-primary)",
        transition: "background-color 0.12s, color 0.12s",
      }}
    >
      <svg width={32} height={32} viewBox="-1 -1 34 34" fill="none">
        <circle cx={16} cy={16} r={16} stroke="currentColor" strokeWidth={1.5} />
        <path d="M16 6.5L25 23H7L16 6.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
