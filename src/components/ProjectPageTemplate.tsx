"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import ElevatorPad from "./ElevatorPad";
import FloorBreadcrumb from "./FloorBreadcrumb";
import PortfolioNav from "./PortfolioNav";
import ContactModal from "./ContactModal";

const BROWN = "#4E3A34";
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
  darkPad?: boolean;
  role: string;
  yearRange: string;
  platform: string;
  overview: string;
  sections?: ProjectSection[];
}

function ArrowDown({ color, hovered }: { color: string; hovered: boolean }) {
  const controls = useAnimation();

  useEffect(() => {
    if (hovered) {
      controls.start({
        y: [0, 52, -52, 0],
        transition: { duration: 0.4, times: [0, 0.42, 0.43, 1], ease: ["easeIn", "linear", "easeOut"] },
      });
    } else {
      controls.stop();
      controls.set({ y: 0 });
    }
  }, [hovered, controls]);

  return (
    <motion.div animate={controls}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 0.75L12 23.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.5 12.75L12 23.25L22.5 12.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function ArrowUp({ color, hovered }: { color: string; hovered: boolean }) {
  const controls = useAnimation();

  useEffect(() => {
    if (hovered) {
      controls.start({
        y: [0, -52, 52, 0],
        transition: { duration: 0.4, times: [0, 0.42, 0.43, 1], ease: ["easeIn", "linear", "easeOut"] },
      });
    } else {
      controls.stop();
      controls.set({ y: 0 });
    }
  }, [hovered, controls]);

  return (
    <motion.div animate={controls}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 23.25L12 0.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22.5 11.25L12 0.75L1.5 11.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

function IconButton({ onClick, icon, bg = BG }: { onClick: () => void; icon: (c: string, h: boolean) => React.ReactNode; bg?: string }) {
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
        overflow: "hidden",
      }}
    >
      {icon(BROWN, hovered)}
    </button>
  );
}

function MetaField({ label, value, flex }: { label: string; value: string; flex?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, ...(flex ? { flex: 1, minWidth: 0 } : { width: 144 }) }}>
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 13, color: BROWN, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: BROWN }}>
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
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const update = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
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

  const isMobile = vw < 640;
  const isNarrow = vw < 800;
  const isTablet = vw < 1024;
  // Fluid side padding: 32px at 640px → 96px at 1280px, continuous
  const sidePad = "clamp(32px, calc(-32px + 10vw), 96px)";

  // Clamp vh for the left-column height calculation (freezes at 700px).
  const clampedVh = Math.max(700, vh);
  // Natural pad height ≈ 774px. Scale = 1 when it fits; shrinks only when
  // the hero would clip it (available height < pad natural height).
  const PAD_NATURAL_H = 774;
  const desktopPadScale = isMobile ? 1 : Math.min(1, (clampedVh - 216) / PAD_NATURAL_H);

  const router = useRouter();
  const scrollToIntro = () => introRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });
  const goToProjects = () => {
    sessionStorage.setItem("scrollToPad", "1");
    router.push("/home");
  };

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh" }}>

      <PortfolioNav
        projectsAction={goToProjects}
        isLightNav={!pastHero}
        mobileBgColor="#F3F2F0"
        showSound
      />

      {/* Hero — (100svh - 64px) on desktop so the down arrow peeks below; auto-height on mobile */}
      <div ref={topRef}>
        <div
          ref={heroImgRef}
          style={{
            position: "relative",
            ...(isNarrow
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

          {isNarrow ? (
            /* Narrow (<800px): project info only, centre-left — pad moves to page bottom */
            <div
              style={{
                position: "absolute", inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: `72px ${sidePad} 64px`,
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ maxWidth: 336 }}
              >
                <ProjectInfo project={project} isMobile={isMobile} />
              </motion.div>
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
                alignItems: "start",
                padding: `72px ${sidePad}`,
              }}
            >
              {/* Left column: project info fades in; pad has no transition */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 48, height: clampedVh - 72 - 144 }}
              >
                <ProjectInfo project={project} isMobile={false} />
              </motion.div>

              {/* Center column: elevator pad — no animation, just updates active floor */}
              <div style={{ transform: `scale(${desktopPadScale})`, transformOrigin: "top center" }}>
                <ElevatorPad activeFloor={project.floor} dark={project.darkPad} onContact={() => setContactOpen(true)} />
              </div>

              {/* Right column: empty mirror so the grid stays symmetric */}
              <div />
            </div>
          )}
        </div>

        {/* Down arrow — sits in the 72px gap below the hero */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 72 }}>
          <IconButton onClick={scrollToIntro} icon={(c, h) => <ArrowDown color={c} hovered={h} />} />
        </div>
      </div>

      {/* All scrollable content below hero */}
      <div
        style={{
          display: "flex", flexDirection: "column",
          gap: 144, paddingBottom: 168,
        }}
      >
        {/* Project intro */}
        <div
          ref={introRef}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            gap: isMobile ? 32 : 0,
            padding: `32px ${sidePad} 0`,
            scrollMarginTop: 72,
          }}
        >
          {/* Metadata columns */}
          <div style={{ display: "flex", flexDirection: "row", gap: 32, flexWrap: "wrap" }}>
            <MetaField label="Role" value={project.role} flex={isMobile} />
            <MetaField label="Year" value={project.yearRange} flex={isMobile} />
            <MetaField label="Platform" value={project.platform} flex={isMobile} />
          </div>

          {/* Overview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: isMobile ? "100%" : 400 }}>
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 13, color: BROWN, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Project overview
            </span>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: BROWN, margin: 0, lineHeight: 1.6 }}>
              {project.overview}
            </p>
          </div>
        </div>

        {/* Project content sections */}
        {(project.sections ?? []).map((section) => (
          <div
            key={section.title}
            style={{
              width: "100%",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 48,
              padding: `0 ${sidePad}`,
            }}
          >
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 20, color: BROWN, alignSelf: "center" }}>
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

        {/* Up arrow — above breadcrumb on wide; moves below pad on narrow */}
        {!isNarrow && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton onClick={scrollToTop} icon={(c, h) => <ArrowUp color={c} hovered={h} />} bg="#E6E5E2" />
          </div>
        )}

        {/* Floor nav: breadcrumb on wide screens, elevator pad on narrow */}
        {isNarrow ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                transform: `scale(${Math.min(1, (vw - 48) / 340)})`,
                transformOrigin: "top center",
                marginBottom: `${340 * (1 - Math.min(1, (vw - 48) / 340)) * -0.5}px`,
              }}
            >
              <ElevatorPad activeFloor={project.floor} onContact={() => setContactOpen(true)} />
            </div>
          </div>
        ) : (
          <FloorBreadcrumb activeFloor={project.floor} />
        )}

        {/* Up arrow — below pad on narrow only */}
        {isNarrow && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton onClick={scrollToTop} icon={(c, h) => <ArrowUp color={c} hovered={h} />} bg="#E6E5E2" />
          </div>
        )}
      </div>

      {/* Copyright — mobile only */}
      {isMobile && (
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 32 }}>
          <span
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 300,
              fontSize: 10,
              color: "#72503C",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            © Sandy Qi 2026
          </span>
        </div>
      )}

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
