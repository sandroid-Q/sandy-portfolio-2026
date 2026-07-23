"use client";

import { useRef, useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";
import Image from "next/image";
import ElevatorPad from "./ElevatorPad";
import FloorBreadcrumb from "./FloorBreadcrumb";
import PortfolioNav from "./PortfolioNav";
import ContactModal from "./ContactModal";
import { scaleRadius } from "@/lib/radius";
import IconButton from "@/components/ui/IconButton";

const BG = "#F3F2F0";
const BG_SECONDARY = "#E5E0D7";

// Scroll-in reveal (matches the About page): rows fade up from nothing, one after
// another, with a smooth ease-in-out — triggered once as they scroll into view.
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
};
// Divider lines "draw" in left-to-right (scaleX) as their row reveals.
const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } },
};
const STAGGER_VIEWPORT = { once: true, amount: 0.2 } as const;

// Generic scroll-in reveal: a subtle fade + gentle upward drift (a light
// parallax rise) as the element scrolls into view. Fires once. Height-agnostic
// trigger (margin-based) so tall media reveal as their top edge nears the fold.
function Reveal({
  children,
  y = 28,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  y?: number;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** A stacked media item: a src string (full-width, 28px radius) or an object
 *  overriding width (px, not full-width) and/or corner radius. */
export type SectionMediaItem = string | { src: string; width?: number; radius?: number };

export interface ProjectSection {
  title: string;
  /** Rendered inline to the right of the section title (e.g. a sound toggle). */
  titleAccessory?: React.ReactNode;
  /** Custom content rendered above the stacked media (e.g. a bespoke gallery). */
  content?: React.ReactNode;
  /** Media rendered full-width (or a fixed width), stacked. */
  images?: SectionMediaItem[];
  /** Media rendered side-by-side in a responsive grid (e.g. phone screens). */
  grid?: string[];
  /** Fixed column count for the grid (collapses to 1 on mobile). Omit for a responsive auto-fit grid. */
  gridColumns?: number;
  /** Gap between grid items — px number or any CSS length (e.g. a clamp()). Defaults to 24. */
  gridGap?: number | string;
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
  /** object-position for the cover image (e.g. "left bottom"). Defaults to center. */
  coverPosition?: string;
  /** Shift the (bottom-anchored) cover left as the screen narrows, clamped in JS
   *  to the real overflow so the image always fills the width. */
  coverShiftLeft?: boolean;
  /** Right-pin the (centre-anchored) cover, but freeze the horizontal position
   *  once the screen narrows past this width (px) — so the composition below it
   *  stays put (keeping a right-side subject clear of the left-hand text) and the
   *  far edge crops instead of the subject shifting further in. */
  coverPinRightFreezeW?: number;
  coverBg?: string;
  /** Black scrim opacity (0–1) laid over the cover image, e.g. 0.6 for a 60% overlay */
  coverScrim?: number;
  /** Cover image is bright — render nav, pad and blurb with light-theme (dark) ink */
  lightCover?: boolean;
  darkPad?: boolean;
  role: string;
  yearRange: string;
  platform: string;
  /** Optional "In collaboration with" metadata row. */
  collaborators?: string;
  /** Optional "Design Team" metadata row (rendered above Focus). */
  designTeam?: string;
  overview?: string;
  /** Multi-part overview: each block is an optional sub-heading + body paragraph.
   *  Takes precedence over `overview`. */
  overviewBlocks?: { heading?: string; body: string }[];
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
        <motion.path d="M12 0.75L12 23.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeInOut" }} />
        <motion.path d="M1.5 12.75L12 23.25L22.5 12.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeInOut", delay: 0.35 }} />
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
        <motion.path d="M12 23.25L12 0.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeInOut" }} />
        <motion.path d="M22.5 11.25L12 0.75L1.5 11.25" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeInOut", delay: 0.35 }} />
      </svg>
    </motion.div>
  );
}


function MetaField({ label, value, phraseWrap = true }: { label: string; value: string; phraseWrap?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", columnGap: 64, padding: "10px 0" }}>
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 13, color: "var(--color-on-surface-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: "var(--color-on-surface-primary)", textAlign: "right" }}>
        {phraseWrap && value.includes(", ")
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
  return (
    <motion.div
      variants={drawLine}
      style={{ height: 1, backgroundColor: "var(--color-on-surface-primary)", opacity: 0.15, transformOrigin: "left" }}
    />
  );
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
            fontSize: 32,
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

// Default desktop corner radius for full-width content media.
const MEDIA_RADIUS = 28;

// Media fills the width of its (1000px-capped) content column and keeps its
// natural aspect ratio via height:auto — so no cropping and no letterbox bars.
const MEDIA_BASE = { width: "100%", height: "auto", display: "block" as const };

// These clips have a faint edge; crop it off then round — done in one clip-path
// inset (top/bottom, then left/right) so the rounding is applied to the cropped
// rectangle, not clipped away. Per-source since the crop amounts differ. The
// `round` radius is filled in at render so it can scale with the viewport.
const CROP_INSET: Record<string, string> = {
  "/TST-1.mp4": "2px 4px",
  "/TST-2.mp4": "2px 4px",
  "/UC-1.mp4": "1px 2px",
};

// Looping section video — lazy: preload="none" means it isn't downloaded until
// it nears the viewport, then it plays only while in view and pauses when
// scrolled away. Keeps several videos on one page from all loading at once.
// `radius` is a resolved CSS length (scales with the viewport on content media).
function SectionVideo({ src, radius }: { src: string; radius: string | number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  const inset = CROP_INSET[src];
  if (inset) {
    const clip = `inset(${inset} round ${typeof radius === "number" ? `${radius}px` : radius})`;
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

  return <video ref={ref} src={src} muted loop playsInline preload="none" style={{ ...MEDIA_BASE, borderRadius: radius }} />;
}

// A single content-section media item — looping video for video files
// (.mov/.mp4/.webm), an image otherwise. `width` (px) renders it at a fixed
// width (centered, not full-width); `radius` overrides the corner rounding.
// By default the radius scales down with the viewport so full-width content
// isn't over-rounded on mobile; pass `scale={false}` for phone-screen grids
// whose fixed rounding should be preserved.
function SectionMedia({ src, title, index, width, radius, scale = true }: { src: string; title: string; index: number; width?: number; radius?: number; scale?: boolean }) {
  const base = radius ?? MEDIA_RADIUS;
  const rad: string | number = scale ? scaleRadius(base) : base;
  if (VIDEO_EXT.test(src)) return <SectionVideo src={src} radius={rad} />;
  const style = {
    ...MEDIA_BASE,
    borderRadius: rad,
    ...(width != null ? { width, maxWidth: "100%" } : {}),
  };
  // loading="lazy" keeps these below-the-fold images from being eagerly
  // preloaded (which triggers "preloaded but not used" warnings).
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`${title} ${index + 1}`} loading="lazy" style={style} />;
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
  const [coverAspect, setCoverAspect] = useState<number | null>(null);
  const [coverX, setCoverX] = useState(0);

  // Delay before the cover slides down. On a first-visit deep-link the intro
  // LoadingScreen covers the page for ~4s (it sets `loadingShown` on mount, and
  // begins fading at ~3.9s — see LoadingScreen.tsx), so hold the reveal until
  // then; otherwise (in-app navigation, later loads) reveal immediately.
  const [coverDelay] = useState(() => {
    if (typeof window === "undefined") return 0;
    return sessionStorage.getItem("loadingShown") ? 0 : 3.9;
  });

  // Cover slide-in. Guards keep it from ever looking glitchy on a janky load:
  // (1) it only starts once the image has actually decoded, so a slow load can't
  // reveal an empty frame; (2) it only starts while the tab is visible, so it's
  // never missed to a paused-while-hidden rAF; (3) the slide is a CSS transform
  // transition (below), which runs on the compositor thread and stays smooth
  // even while the main thread is busy — unlike a JS/framer-motion animation.
  const [imgReady, setImgReady] = useState(!project.coverImage);
  const [delayDone, setDelayDone] = useState(coverDelay === 0);
  const [coverRevealed, setCoverRevealed] = useState(false);

  useEffect(() => {
    if (coverDelay === 0) return;
    const t = setTimeout(() => setDelayDone(true), coverDelay * 1000);
    return () => clearTimeout(t);
  }, [coverDelay]);

  useEffect(() => {
    // Wait for the image to actually decode on every viewport (not just desktop):
    // revealing before it's painted makes the cover slide down into an empty
    // frame and pop in late — which reads as "the cover didn't load", especially
    // on a first, uncached mobile load. The 2.5s cap below bounds the wait.
    if (coverRevealed || !delayDone || vw === 0 || !imgReady) return;

    let raf1 = 0;
    let raf2 = 0;
    const reveal = () => {
      // Double rAF so the initial translateY(-100%) is guaranteed to have painted
      // before we flip to translateY(0) — the browser then has a baseline to
      // transition from. A single rAF can flip in the same frame as the first
      // paint, and the cover snaps in with no slide.
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setCoverRevealed(true));
      });
    };

    // requestAnimationFrame never fires while the page is hidden (a background
    // tab, or iOS Safari mid-navigation), which would leave the cover stuck at
    // translateY(-100%). Only start once the tab is visible so the slide plays
    // on screen; if it's hidden now, wait for it to be shown.
    if (document.visibilityState === "visible") {
      reveal();
      return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
    }
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", onVisible);
      reveal();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [imgReady, delayDone, coverRevealed, vw]);

  useEffect(() => {
    // Safety net: reveal even if onLoad never fires (e.g. a cached image), so
    // the cover can never get stuck hidden.
    const cap = setTimeout(() => setCoverRevealed(true), coverDelay * 1000 + 2500);
    return () => clearTimeout(cap);
  }, [coverDelay]);

  useEffect(() => {
    const update = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Cover left-shift: shift the image left as the screen narrows, but clamp it in
  // JS to the actual overflow (measured hero size × image aspect) so the right
  // edge always stays covered. Recomputes on resize and once the aspect is known.
  useEffect(() => {
    const el = heroImgRef.current;
    if (!project.coverShiftLeft || !coverAspect || !el) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const desired = Math.min(0, (W - 1600) * 0.12);
    const overflow = Math.max(0, H * coverAspect - W);
    setCoverX(Math.max(desired, -overflow));
  }, [coverAspect, vw, vh, project.coverShiftLeft]);

  // Right-pin with freeze: right-pin the cover (crops the left as it narrows),
  // but stop shifting once the width drops below `coverPinRightFreezeW` by
  // clamping the overflow to that width — so the subject holds its position and
  // the far edge crops instead of it sliding into the left-hand text.
  useEffect(() => {
    const el = heroImgRef.current;
    const freezeW = project.coverPinRightFreezeW;
    if (!freezeW || !coverAspect || !el) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const overflow = Math.max(0, H * coverAspect - Math.max(W, freezeW));
    setCoverX(-overflow);
  }, [coverAspect, vw, vh, project.coverPinRightFreezeW]);

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
    <div style={{ backgroundColor: "var(--color-project-surface)", minHeight: "100vh", overflowX: "clip" }}>

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
            borderRadius: `0 0 ${scaleRadius(32)} ${scaleRadius(32)}`,
            overflow: "hidden",
          }}
        >
          {/* Cover image or placeholder */}
          {project.coverImage ? (
            <>
              {/* Backdrop matches the page surface (theme-aware) so the slide-down
                  reveal blends seamlessly with the rest of the site */}
              <div style={{ position: "absolute", inset: 0, backgroundColor: "var(--color-project-surface)" }} />
              {/* Cover descends into the hero frame — a nod to the elevator arriving.
                  CSS transform transition (compositor-driven) so it stays smooth
                  even if the main thread is busy while the page loads. */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: coverRevealed ? "translateY(0)" : "translateY(-100%)",
                  transition: `transform ${isMobile ? 0.95 : 1.35}s cubic-bezier(0.5, 0, 0.2, 1)`,
                }}
              >
                <Image
                  src={project.coverImage}
                  fill
                  alt={project.name}
                  priority
                  sizes="100vw"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if ((project.coverShiftLeft || project.coverPinRightFreezeW) && img.naturalWidth && img.naturalHeight) {
                      setCoverAspect(img.naturalWidth / img.naturalHeight);
                    }
                    setImgReady(true);
                  }}
                  style={{ objectFit: "cover", objectPosition: project.coverShiftLeft ? `${coverX}px bottom` : project.coverPinRightFreezeW ? `${coverX}px center` : project.coverPosition }}
                />
              </div>
            </>
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
                style={{ maxWidth: 320 }}
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
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={STAGGER_VIEWPORT}
            style={{ display: "flex", flexDirection: "column", width: stackIntro ? "100%" : "calc(33.333vw - clamp(32px, calc(-32px + 10vw), 96px))", minWidth: stackIntro ? undefined : 240 }}
          >
            <motion.div variants={fadeUpItem}><MetaField label="Role" value={project.role} /></motion.div>
            <MetaDivider />
            <motion.div variants={fadeUpItem}><MetaField label="Year" value={project.yearRange} /></motion.div>
            <MetaDivider />
            <motion.div variants={fadeUpItem}><MetaField label="Platform" value={project.platform} /></motion.div>
            <MetaDivider />
            {project.collaborators && (
              <>
                <motion.div variants={fadeUpItem}><MetaField label="In collaboration with" value={project.collaborators} phraseWrap={false} /></motion.div>
                <MetaDivider />
              </>
            )}
            {project.designTeam && (
              <>
                <motion.div variants={fadeUpItem}><MetaField label="Design Support" value={project.designTeam} phraseWrap={false} /></motion.div>
                <MetaDivider />
              </>
            )}
            <motion.div variants={fadeUpItem}><MetaField label="Focus" value={(project.focus ?? project.tags).join(", ")} /></motion.div>
            <MetaDivider />
          </motion.div>

          {/* Overview */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={STAGGER_VIEWPORT}
            style={{ display: "flex", flexDirection: "column", gap: 16, width: stackIntro ? "100%" : "calc(66.667vw - clamp(32px, calc(-32px + 10vw), 96px) - 192px)" }}
          >
            <motion.span variants={fadeUpItem} style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 13, color: "var(--color-on-surface-tertiary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Project overview
            </motion.span>
            {project.overviewBlocks ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {project.overviewBlocks.map((block, i) => (
                  <motion.div variants={fadeUpItem} key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {block.heading && (
                      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 20, color: "var(--color-on-surface-primary)" }}>
                        {block.heading}
                      </span>
                    )}
                    <p style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 18, color: "var(--color-on-surface-primary)", margin: 0, lineHeight: 1.6 }}>
                      {block.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p variants={fadeUpItem} style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 18, color: "var(--color-on-surface-primary)", margin: 0, lineHeight: 1.6 }}>
                {project.overview}
              </motion.p>
            )}
          </motion.div>
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
            <Reveal y={20} style={{ display: "flex", alignItems: "center", gap: 8, alignSelf: "center" }}>
              <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 20, color: "var(--color-on-surface-primary)" }}>
                {section.title}
              </span>
              {section.titleAccessory}
            </Reveal>
            {section.content == null && (section.grid?.length ?? 0) === 0 && (section.images?.length ?? 0) === 0 ? (
              <Reveal
                style={{
                  width: "100%", height: 400,
                  backgroundColor: "var(--color-surface-transparent)",
                  borderRadius: scaleRadius(26),
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: "var(--color-on-surface-secondary)" }}>
                  Images coming soon
                </span>
              </Reveal>
            ) : (
              <div style={{ width: "100%", maxWidth: 1000, display: "flex", flexDirection: "column", gap: 144, alignItems: "center" }}>
                {section.content && (
                  <Reveal style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    {section.content}
                  </Reveal>
                )}
                {section.grid && section.grid.length > 0 && (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={STAGGER_VIEWPORT}
                    style={{
                      width: "100%", display: "grid",
                      gridTemplateColumns: section.gridColumns
                        ? `repeat(${isMobile ? 1 : section.gridColumns}, 1fr)`
                        : "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
                      gap: section.gridGap ?? 24,
                      alignItems: "start",
                    }}
                  >
                    {section.grid.map((src, i) => (
                      <motion.div variants={fadeUpItem} key={`g${i}`}>
                        {/* Grid = phone screens — keep their fixed rounding */}
                        <SectionMedia src={src} title={section.title} index={i} scale={false} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                {(section.images ?? []).map((item, i) => {
                  const media = typeof item === "string" ? { src: item } : item;
                  return (
                    <Reveal key={i} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                      <SectionMedia src={media.src} title={section.title} index={i} width={media.width} radius={media.radius} />
                    </Reveal>
                  );
                })}
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
              {/* Sits on the page, so its hover center fill must match the page
                  surface (charcoal in dark mode) — not the default surface-primary
                  which is blue in dark mode. */}
              <ElevatorPad activeFloor={project.floor} bg="var(--color-project-surface)" onContact={() => setContactOpen(true)} />
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
