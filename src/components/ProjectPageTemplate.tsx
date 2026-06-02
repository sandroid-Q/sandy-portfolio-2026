"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ElevatorPad from "./ElevatorPad";
import FloorBreadcrumb from "./FloorBreadcrumb";

const BROWN = "#4E3A34";
const TEXT = "#000000";
const TEXT_NAV = "#232122";
const RED = "#DE211D";
const BG = "#F3F2F0";
const BG_SECONDARY = "#E5E0D7";
const HOVER_BROWN = "#D3BA9F";

export interface ProjectSection {
  title: string;
  images?: string[];
}

export interface ProjectData {
  floor: string;
  year: string;
  name: string;
  blurb: string;
  tags: string[];
  coverImage?: string;
  coverBg?: string;
  role: string;
  yearRange: string;
  platform: string;
  overview: string;
  sections?: ProjectSection[];
}

function ArrowDown({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 0.75L12 23.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 12.75L12 23.25L22.5 12.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUp({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 23.25L12 0.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.5 11.25L12 0.75L1.5 11.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconButton({ onClick, icon, bg = BG }: { onClick: () => void; icon: (c: string) => React.ReactNode; bg?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? HOVER_BROWN : bg,
        borderRadius: 12,
        width: 48,
        height: 48,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.15s",
      }}
    >
      {icon(BROWN)}
    </button>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 4, cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: TEXT_NAV }}>
          {children}
        </span>
        <div style={{ height: 1, backgroundColor: RED, opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }} />
      </div>
    </Link>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 144 }}>
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: TEXT }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: TEXT }}>
        {value}
      </span>
    </div>
  );
}

export default function ProjectPageTemplate(project: ProjectData) {
  const topRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  const scrollToIntro = () => introRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh" }}>

      {/* Fixed top nav */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 36px", zIndex: 100,
        }}
      >
        <Link
          href="/"
          style={{ textDecoration: "none", fontFamily: "var(--font-silkscreen)", fontSize: 24, color: TEXT_NAV, lineHeight: 1 }}
        >
          SANDY QI
        </Link>
        <NavLink href="/home">Designs</NavLink>
      </div>

      {/* Fixed bottom nav */}
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 36px", zIndex: 100,
        }}
      >
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 12, color: TEXT }}>
          © Sandy Qi 2026
        </span>
        <NavLink href="/about">About me</NavLink>
      </div>

      {/* Hero — always (100svh - 48px) tall so the down arrow peeks below */}
      <div ref={topRef}>
        <div
          style={{
            position: "relative",
            height: "calc(100svh - 48px)",
            minHeight: 600,
            borderRadius: "0 0 32px 32px",
            overflow: "hidden",
          }}
        >
          {/* Cover image or placeholder */}
          {project.coverImage ? (
            <Image src={project.coverImage} fill alt={project.name} style={{ objectFit: "cover" }} priority />
          ) : (
            <div style={{ position: "absolute", inset: 0, backgroundColor: project.coverBg ?? BG_SECONDARY }} />
          )}

          {/* Content overlay: project info (left) + elevator pad (right) */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "row",
              alignItems: "center", justifyContent: "center",
              gap: 48, padding: "72px 96px",
            }}
          >
            {/* Project info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320, flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: BG }}>
                  {project.year}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-silkscreen)", fontWeight: 400, fontSize: 32,
                    color: BG, textTransform: "uppercase", lineHeight: 1.1,
                  }}
                >
                  {project.name}
                </span>
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: BG }}>
                  {project.blurb}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-space-grotesk)", fontWeight: 400, fontSize: 14, color: BG,
                      border: `1px solid ${BG}`, borderRadius: 100, padding: "4px 12px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Elevator pad */}
            <ElevatorPad activeFloor={project.floor} />
          </div>
        </div>

        {/* Down arrow — sits in the 48px gap below the hero, enticing the scroll */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 48 }}>
          <IconButton onClick={scrollToIntro} icon={(c) => <ArrowDown color={c} />} />
        </div>
      </div>

      {/* All scrollable content below hero */}
      <div
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 144, paddingBottom: 168,
        }}
      >
        {/* Project intro */}
        <div
          ref={introRef}
          style={{
            width: "100%", maxWidth: 1280,
            display: "flex", flexDirection: "row", justifyContent: "space-between",
            padding: "32px 96px 0", scrollMarginTop: 72,
          }}
        >
          {/* Metadata columns */}
          <div style={{ display: "flex", flexDirection: "row", gap: 32 }}>
            <MetaField label="Role" value={project.role} />
            <MetaField label="Year" value={project.yearRange} />
            <MetaField label="Platform" value={project.platform} />
          </div>

          {/* Overview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 400 }}>
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: TEXT }}>
              Project overview
            </span>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: TEXT, margin: 0, lineHeight: 1.6 }}>
              {project.overview}
            </p>
          </div>
        </div>

        {/* Project content sections */}
        {(project.sections ?? []).map((section) => (
          <div
            key={section.title}
            style={{
              width: "100%", maxWidth: 1280,
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 48,
              padding: "0 96px",
            }}
          >
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 20, color: TEXT, alignSelf: "flex-start" }}>
              {section.title}
            </span>
            {(section.images ?? []).length === 0 ? (
              <div
                style={{
                  width: "100%", height: 400,
                  backgroundColor: BG_SECONDARY,
                  borderRadius: 26,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: BROWN }}>
                  Images coming soon
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 144 }}>
                {section.images!.map((src, i) => (
                  <div key={i} style={{ position: "relative", width: 1000, height: 721, borderRadius: 26, overflow: "hidden" }}>
                    <Image src={src} fill alt={`${section.title} ${i + 1}`} style={{ objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Up arrow */}
        <IconButton onClick={scrollToTop} icon={(c) => <ArrowUp color={c} />} bg="#E6E5E2" />

        {/* Floor breadcrumb nav */}
        <FloorBreadcrumb activeFloor={project.floor} />
      </div>
    </div>
  );
}
