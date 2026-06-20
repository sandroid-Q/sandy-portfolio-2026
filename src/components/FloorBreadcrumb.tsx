"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAudio } from "@/contexts/AudioContext";

const TEXT_DEFAULT = "var(--color-on-surface-tertiary)";
const TEXT_EMPHASIS = "var(--color-on-surface-primary)";
const UNDERLINE = "var(--color-nav-underline)";

const FLOORS = [
  { key: "G", label: "Ground", href: "/home" },
  { key: "1", label: "Level 1", href: "/project/1" },
  { key: "2", label: "Level 2", href: "/project/2" },
  { key: "3", label: "Level 3", href: "/project/3" },
  { key: "4", label: "Level 4", href: "/project/4" },
  { key: "5", label: "Level 5", href: "/project/5" },
  { key: "6", label: "Level 6", href: "/project/6" },
];

function FloorLink({ label, href, isActive }: { label: string; href: string; isActive: boolean }) {
  const { playNav, playHover } = useAudio();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isEmphasized = isActive || hovered || pressed;
  const isBold = isEmphasized;
  const underlineColor = UNDERLINE;
  const underlineHeight = 2;

  const inner = (
    <span
      style={{
        position: "relative",
        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        fontWeight: isBold ? 500 : 300,
        fontSize: 12,
        color: isEmphasized ? TEXT_EMPHASIS : TEXT_DEFAULT,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        whiteSpace: "nowrap",
        display: "inline-block",
        paddingBottom: 3,
      }}
    >
      {label}
      <motion.span
        initial={{ scaleX: isActive ? 1 : 0 }}
        animate={{ scaleX: isActive || hovered ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: underlineHeight,
          backgroundColor: underlineColor,
          transformOrigin: "left",
          display: "block",
        }}
      />
    </span>
  );

  if (isActive) {
    // Not interactive — already on this page
    return (
      <span
        style={{ cursor: "default" }}
        onMouseEnter={() => setHovered(false)}
      >
        {inner}
      </span>
    );
  }

  return (
    <Link
      href={href}
      style={{ textDecoration: "none" }}
      onClick={() => playNav()}
      onMouseEnter={() => { setHovered(true); playHover(); }}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {inner}
    </Link>
  );
}

export default function FloorBreadcrumb({ activeFloor }: { activeFloor: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "0 32px",
      }}
    >
      {FLOORS.map((floor, i) => (
        <React.Fragment key={floor.key}>
          {i > 0 && (
            <span
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                fontWeight: 300,
                fontSize: 14,
                color: TEXT_DEFAULT,
                lineHeight: 1,
              }}
            >
              ·
            </span>
          )}
          <FloorLink
            label={floor.label}
            href={floor.href}
            isActive={floor.key === activeFloor}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
