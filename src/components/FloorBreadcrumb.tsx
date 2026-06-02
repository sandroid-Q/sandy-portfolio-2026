"use client";

import { useState } from "react";
import Link from "next/link";

const RED = "#FF3600";
const TEXT = "#232122";

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

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 60, height: 22 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            fontWeight: isActive ? 500 : 400,
            fontSize: 14,
            color: TEXT,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <div
          style={{
            height: 1,
            width: "100%",
            backgroundColor: RED,
            opacity: isActive || hovered ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        />
      </div>
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
        justifyContent: "center",
        gap: 6,
      }}
    >
      {FLOORS.map((floor, i) => (
        <div key={floor.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && (
            <span
              style={{
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                fontWeight: 300,
                fontSize: 14,
                color: TEXT,
              }}
            >
              ·
            </span>
          )}
          <FloorLink label={floor.label} href={floor.href} isActive={floor.key === activeFloor} />
        </div>
      ))}
    </div>
  );
}
