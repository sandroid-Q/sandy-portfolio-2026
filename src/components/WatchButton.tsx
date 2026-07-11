"use client";

import { useEffect, useState } from "react";

function ArrowUpRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A pill link that mirrors the up/down arrow IconButton's theming: transparent
 *  with a white outline in dark mode, a light-grey fill in light mode, and a
 *  blue/white flip on hover. */
export default function WatchButton({ href, label }: { href: string; label: string }) {
  const [isLight, setIsLight] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const update = () => setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const bg = hovered ? (isLight ? "#0034FF" : "#F8F8F8") : (isLight ? "#E7EAF1" : "transparent");
  const border = isLight ? "transparent" : "#F8F8F8";
  const color = isLight ? (hovered ? "#F8F8F8" : "#161719") : (hovered ? "#161719" : "#F8F8F8");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "10px 20px",
        borderRadius: 14,
        border: `1px solid ${border}`,
        backgroundColor: bg,
        color,
        fontFamily: "var(--font-space-grotesk)",
        fontWeight: 500,
        fontSize: 16,
        textDecoration: "none",
        cursor: "pointer",
        transition: "background-color 0.15s, color 0.15s, border-color 0.15s",
      }}
    >
      {label} <ArrowUpRight />
    </a>
  );
}
