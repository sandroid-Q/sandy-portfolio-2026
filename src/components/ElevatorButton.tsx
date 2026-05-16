"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const BROWN = "#4E3A34";
const CREAM = "#F3F2F0";
const ORANGE = "#FF3600";

interface ElevatorButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export default function ElevatorButton({ isOpen, onClick, className }: ElevatorButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const bgColor = pressed ? BROWN : hovered ? ORANGE : CREAM;
  const iconColor = pressed ? CREAM : BROWN;

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.12 }}
      className={className}
      style={{
        width: 60,
        height: 120,
        border: `2px solid ${BROWN}`,
        padding: "19px 12px 60px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg width={32} height={32} viewBox="-1 -1 34 34" fill="none">
        <circle
          cx={16}
          cy={16}
          r={16}
          stroke={iconColor}
          strokeWidth={1.5}
          style={{ transition: "stroke 0.12s" }}
        />
        <path
          d="M16 6.5L25 23H7L16 6.5Z"
          fill={iconColor}
          style={{ transition: "fill 0.12s" }}
        />
      </svg>
    </motion.button>
  );
}
