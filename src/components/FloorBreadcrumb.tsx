"use client";

import React, { useState } from "react";
import Link from "next/link";

const BROWN = "#4E3A34";
const GOLD = "#E4C298";

const FLOORS = [
  { key: "G", label: "Ground", href: "/home" },
  { key: "1", label: "Floor 1", href: "/project/1" },
  { key: "2", label: "Floor 2", href: "/project/2" },
  { key: "3", label: "Floor 3", href: "/project/3" },
  { key: "4", label: "Floor 4", href: "/project/4" },
  { key: "5", label: "Floor 5", href: "/project/5" },
  { key: "6", label: "Level 6", href: "/project/6" },
];

function FloorLink({ label, href, isActive }: { label: string; href: string; isActive: boolean }) {
  const [hovered, setHovered] = useState(false);

  const isBold = isActive || hovered;
  const textColor = isActive ? BROWN : BROWN;
  const underlineColor = isActive ? GOLD : BROWN;
  const underlineHeight = isActive ? 2 : 1;
  const showUnderline = isActive || hovered;

  const inner = (
    <span
      style={{
        fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
        fontWeight: isBold ? 700 : 400,
        fontSize: 14,
        color: textColor,
        whiteSpace: "nowrap",
        display: "inline-block",
        // underline via box-shadow so it stays at text-bottom without adding layout height
        boxShadow: showUnderline
          ? `0 ${underlineHeight}px 0 ${underlineColor}`
          : "none",
        paddingBottom: 3,
        transition: "box-shadow 0.15s, font-weight 0.1s",
      }}
    >
      {label}
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
        alignItems: "center",
        gap: 12,
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
