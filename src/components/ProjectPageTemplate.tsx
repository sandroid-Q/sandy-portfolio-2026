"use client";

import { useRef, useState, useEffect } from "react";
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

function NavLink({ href, children, color = TEXT_NAV }: { href: string; children: React.ReactNode; color?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 4, cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color, transition: "color 0.3s" }}>
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

function ProjectInfo({ project, isMobile }: { project: ProjectData; isMobile: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: isMobile ? "100%" : 320 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: BG }}>
          {project.year}
        </span>
        <span
          style={{
            fontFamily: "var(--font-silkscreen)", fontWeight: 400,
            fontSize: isMobile ? 24 : 32,
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
  );
}

export default function ProjectPageTemplate(project: ProjectData) {
  const topRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1280);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!heroImgRef.current) return;
      // Switch when the cover photo's bottom edge clears the top nav (72px)
      setPastHero(heroImgRef.current.getBoundingClientRect().bottom <= 72);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navColor = pastHero ? TEXT_NAV : BG;

  const isMobile = vw < 640;
  const isTablet = vw < 1024;

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
          style={{
            textDecoration: "none", fontFamily: "var(--font-silkscreen)", fontSize: 24,
            color: navColor, lineHeight: 1,
            transition: "color 0.3s",
          }}
        >
          SANDY QI
        </Link>
        <NavLink href="/home" color={navColor}>Designs</NavLink>
      </div>

      {/* Fixed bottom nav — pointer-events: none on the container so the down arrow below
          the hero stays clickable; re-enabled on the actual links inside */}
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 36px", zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 12, color: TEXT }}>
          © Sandy Qi 2026
        </span>
        <div style={{ pointerEvents: "auto" }}>
          <NavLink href="/about">About me</NavLink>
        </div>
      </div>

      {/* Hero — (100svh - 64px) on desktop so the down arrow peeks below; auto-height on mobile */}
      <div ref={topRef}>
        <div
          ref={heroImgRef}
          style={{
            position: "relative",
            ...(isMobile
              ? { minHeight: "calc(100svh - 72px)" }
              : { height: "calc(100svh - 72px)", minHeight: 600 }
            ),
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

          {isMobile ? (
            /* Mobile: stack project info → elevator pad */
            <div
              style={{
                position: "relative",
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 32, padding: "88px 24px 48px",
              }}
            >
              <ProjectInfo project={project} isMobile />
              <div
                style={{
                  transform: `scale(${Math.min(1, (vw - 48) / 340)})`,
                  transformOrigin: "top center",
                  marginBottom: `${340 * (1 - Math.min(1, (vw - 48) / 340)) * -0.5}px`,
                }}
              >
                <ElevatorPad activeFloor={project.floor} />
              </div>
            </div>
          ) : (
            /* Desktop/tablet: CSS grid keeps elevator pad at true horizontal center.
               1fr | elevator pad (auto) | 1fr — left and right columns are equal so
               the center column is exactly at 50% of the content area. */
            <div
              style={{
                position: "absolute", inset: 0,
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                padding: isTablet ? "72px 48px" : "72px 96px",
              }}
            >
              {/* Left column: project info, right-aligned so it sits close to the pad */}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 48 }}>
                <ProjectInfo project={project} isMobile={false} />
              </div>

              {/* Center column: elevator pad — sits at true page center */}
              <ElevatorPad activeFloor={project.floor} />

              {/* Right column: empty mirror so the grid stays symmetric */}
              <div />
            </div>
          )}
        </div>

        {/* Down arrow — sits in the 72px gap below the hero */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 72 }}>
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
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            gap: isMobile ? 32 : 0,
            padding: isMobile ? "32px 24px 0" : isTablet ? "32px 48px 0" : "32px 96px 0",
            scrollMarginTop: 72,
          }}
        >
          {/* Metadata columns */}
          <div style={{ display: "flex", flexDirection: "row", gap: 32, flexWrap: "wrap" }}>
            <MetaField label="Role" value={project.role} />
            <MetaField label="Year" value={project.yearRange} />
            <MetaField label="Platform" value={project.platform} />
          </div>

          {/* Overview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: isMobile ? "100%" : 400 }}>
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
              padding: isMobile ? "0 24px" : isTablet ? "0 48px" : "0 96px",
            }}
          >
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 20, color: TEXT, alignSelf: "center" }}>
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
