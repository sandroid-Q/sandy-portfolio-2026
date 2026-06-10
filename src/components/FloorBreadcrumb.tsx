"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const BROWN = "#4E3A34";
const GOLD = "#E4C298";

const FLOORS = [
  { key: "G", label: "Ground", href: "/home" },
  { key: "1", label: "Level 1", href: "/project/1" },
  { key: "2", label: "Level 2", href: "/project/2" },
  { key: "3", label: "Level 3", href: "/project/3" },
  { key: "4", label: "Level 4", href: "/project/4" },
  { key: "5", label: "Level 5", href: "/project/5" },
  { key: "6", label: "Level 6", href: "/project/6" },
  { key: "about", label: "About me", href: "/about" },
];

function FloorLink({ label, href, isActive }: { label: string; href: string; isActive: boolean }) {
  const [hovered, setHovered] = useState(false);

  const isBold = isActive || hovered;
  const underlineColor = isActive ? GOLD : BROWN;
  const underlineHeight = isActive ? 2 : 1;

  const inner = (
    <span
      style={{
        position: "relative",
        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        fontWeight: isBold ? 700 : 400,
        fontSize: 14,
        color: BROWN,
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
                color: BROWN,
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
