"use client";

import { useRef, useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import ElevatorPad from "./ElevatorPad";
import FloorBreadcrumb from "./FloorBreadcrumb";
import PortfolioNav from "./PortfolioNav";
import ContactModal from "./ContactModal";
import { useAudio } from "@/contexts/AudioContext";

const BG = "#F3F2F0";
const BG_SECONDARY = "#E5E0D7";

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
  /** Overrides the metadata "Focus" field; falls back to `tags` when unset. */
  focus?: string[];
  coverImage?: string;
  coverBg?: string;
  /** Black scrim opacity (0–1) laid over the cover image, e.g. 0.6 for a 60% overlay */
  coverScrim?: number;
  /** Cover image is bright — render nav, pad and blurb with light-theme (dark) ink */
  lightCover?: boolean;
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

function IconButton({ onClick, icon }: { onClick: () => void; icon: (c: string, h: boolean) => React.ReactNode }) {
  const { playButton } = useAudio();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const update = () => setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const containerBg = pressed
    ? (isLight ? "#161719" : "#0034FF")
    : hovered
    ? (isLight ? "#0034FF" : "#F8F8F8")
    : (isLight ? "#E7EAF1" : "transparent");

  const borderColor = !isLight ? "#F8F8F8" : pressed ? "#F8F8F8" : "transparent";

  const arrowColor = isLight
    ? (hovered || pressed ? "#F8F8F8" : "#161719")
    : (hovered && !pressed ? "#161719" : "#F8F8F8");

  return (
    <button
      onClick={() => { playButton(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        backgroundColor: containerBg,
        borderRadius: 12,
        width: 48,
        height: 48,
        border: `1px solid ${borderColor}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.15s",
        overflow: "hidden",
      }}
    >
      {icon(arrowColor, hovered)}
    </button>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", columnGap: 64, padding: "10px 0" }}>
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 13, color: "var(--color-on-surface-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: "var(--color-on-surface-primary)", textAlign: "right" }}>
        {value.includes(", ")
          ? value.split(", ").map((phrase, i, all) => (
              <Fragment key={i}>
                {/* Keep each comma-phrase intact; only the space after a comma can break. */}
                <span style={{ whiteSpace: "nowrap" }}>{phrase}{i < all.length - 1 ? "," : ""}</span>
                {i < all.length - 1 ? " " : ""}
              </Fragment>
            ))
          : value}
      </span>
    </div>
  );
}

function MetaDivider() {
  return <div style={{ height: 1, backgroundColor: "var(--color-on-surface-primary)", opacity: 0.15 }} />;
}

function ProjectInfo({ project, isMobile }: { project: ProjectData; isMobile: boolean }) {
  // Bright covers (level 3/4) use light-theme ink so text stays legible.
  const ink = project.lightCover ? "#161719" : BG;
  const pillBorder = project.lightCover ? "rgba(22, 23, 25, 0.4)" : "rgba(243, 242, 240, 0.5)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: isMobile ? "100%" : 320 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: ink }}>
          {project.year}
        </span>
        <span
          style={{
            fontFamily: "var(--font-silkscreen)", fontWeight: 400,
            fontSize: isMobile ? 24 : 32,
            color: ink, textTransform: "uppercase", lineHeight: 1.1,
          }}
        >
          {project.name}
        </span>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: ink }}>
          {project.blurb}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 300,
              fontSize: 13,
              color: ink,
              border: `0.5px solid ${pillBorder}`,
              borderRadius: 100,
              padding: "4px 12px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

const VIDEO_EXT = /\.(mov|mp4|webm)$/i;

// Media fills the width of its (1000px-capped) content column and keeps its
// natural aspect ratio via height:auto — so no cropping and no letterbox bars.
const MEDIA_STYLE = { width: "100%", height: "auto", display: "block" as const, borderRadius: 28 };

// These clips have a faint edge; crop it off then round — done in one clip-path
// inset (top/bottom, then left/right) so the rounding is applied to the cropped
// rectangle, not clipped away. Per-source since the crop amounts differ.
const CROP_CLIP: Record<string, string> = {
  "/TST-1.mp4": "inset(2px 4px round 28px)",
  "/TST-2.mp4": "inset(2px 4px round 28px)",
  "/UC-1.mp4": "inset(1px 2px round 28px)",
};

// Looping section video — lazy: preload="none" means it isn't downloaded until
// it nears the viewport, then it plays only while in view and pauses when
// scrolled away. Keeps several videos on one page from all loading at once.
function SectionVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  const clip = CROP_CLIP[src];
  if (clip) {
    return (
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        style={{ display: "block", width: "100%", height: "auto", clipPath: clip, WebkitClipPath: clip }}
      />
    );
  }

  return <video ref={ref} src={src} muted loop playsInline preload="none" style={MEDIA_STYLE} />;
}

// A single content-section media item — looping video for video files
// (.mov/.mp4/.webm), an image otherwise.
function SectionMedia({ src, title, index }: { src: string; title: string; index: number }) {
  if (VIDEO_EXT.test(src)) return <SectionVideo src={src} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`${title} ${index + 1}`} style={MEDIA_STYLE} />;
}

export default function ProjectPageTemplate(project: ProjectData) {
  const topRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [blurBottom, setBlurBottom] = useState(false);
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
      setPastHero(heroImgRef.current.getBoundingClientRect().bottom <= 72);
      if (introRef.current) {
        setBlurBottom(introRef.current.getBoundingClientRect().top < window.innerHeight);
      }
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

  // Intro layout: the Project Info column is 1/3 of the screen but never below
  // 240px; once it would shrink past that, the intro stacks (Project Overview
  // drops below the 4 rows). Mirrors the CSS calc above in JS to find the point.
  const introSidePad = Math.min(96, Math.max(32, -32 + 0.1 * vw));
  const stackIntro = vw / 3 - introSidePad < 240;

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
    <div style={{ backgroundColor: "var(--color-project-surface)", minHeight: "100vh" }}>

      <PortfolioNav
        projectsAction={goToProjects}
        isLightNav={!pastHero}
        forceLight={project.lightCover}
        mobileBgColor="var(--color-project-surface)"
        showSound
        blurBottom={blurBottom}
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

          {/* Black scrim over the cover image */}
          {project.coverImage && project.coverScrim != null && (
            <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(0, 0, 0, ${project.coverScrim})` }} />
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
                <ElevatorPad activeFloor={project.floor} dark={project.darkPad} forceTheme={project.lightCover ? "light" : "dark"} onContact={() => setContactOpen(true)} />
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
            flexDirection: stackIntro ? "column" : "row",
            justifyContent: "space-between",
            gap: stackIntro ? 72 : 192,
            padding: `96px ${sidePad} 0`,
            marginBottom: 32,
            scrollMarginTop: 72,
          }}
        >
          {/* Metadata columns */}
          <div style={{ display: "flex", flexDirection: "column", width: stackIntro ? "100%" : "calc(33.333vw - clamp(32px, calc(-32px + 10vw), 96px))", minWidth: stackIntro ? undefined : 240 }}>
            <MetaField label="Role" value={project.role} />
            <MetaDivider />
            <MetaField label="Year" value={project.yearRange} />
            <MetaDivider />
            <MetaField label="Platform" value={project.platform} />
            <MetaDivider />
            <MetaField label="Focus" value={(project.focus ?? project.tags).join(", ")} />
            <MetaDivider />
          </div>

          {/* Overview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, width: stackIntro ? "100%" : "calc(66.667vw - clamp(32px, calc(-32px + 10vw), 96px) - 192px)" }}>
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 13, color: "var(--color-on-surface-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Project overview
            </span>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 18, color: "var(--color-on-surface-primary)", margin: 0, lineHeight: 1.6 }}>
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
            <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 20, color: "var(--color-on-surface-primary)", alignSelf: "center" }}>
              {section.title}
            </span>
            {(section.images ?? []).length === 0 ? (
              <div
                style={{
                  width: "100%", height: 400,
                  backgroundColor: "var(--color-surface-transparent)",
                  borderRadius: 26,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: "var(--color-on-surface-secondary)" }}>
                  Images coming soon
                </span>
              </div>
            ) : (
              <div style={{ width: "100%", maxWidth: 1000, display: "flex", flexDirection: "column", gap: 144, alignItems: "center" }}>
                {section.images!.map((src, i) => (
                  <SectionMedia key={i} src={src} title={section.title} index={i} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Up arrow — above breadcrumb on wide; moves below pad on narrow */}
        {!isNarrow && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton onClick={scrollToTop} icon={(c, h) => <ArrowUp color={c} hovered={h} />} />
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
            <IconButton onClick={scrollToTop} icon={(c, h) => <ArrowUp color={c} hovered={h} />} />
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
              color: "var(--color-on-surface-tertiary)",
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
