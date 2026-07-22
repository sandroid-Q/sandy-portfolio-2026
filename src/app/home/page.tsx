"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import TransitionOverlay from "@/components/TransitionOverlay";
import PortfolioNav from "@/components/PortfolioNav";
import IDCard from "@/components/IDCard";
import ElevatorPad from "@/components/ElevatorPad";
import ContactModal from "@/components/ContactModal";
import ParallaxLayer from "@/components/ParallaxLayer";
import { useMouseParallax } from "@/components/useMouseParallax";
import { useAudio } from "@/contexts/AudioContext";

const SCALE_MIN = 0.8;

interface FloorPreview {
  year: string;
  name: string;
  blurb: string;
  tags: string[];
  // Hover/preview cover asset — .mp4 renders as a looping video, .gif/.webp as an image.
  cover?: string;
}

const FLOOR_DATA: Record<string, FloorPreview> = {
  "1": { year: "2023", name: "MOOMOO: POWER LAUNCH", blurb: "Landing pages, marketing assets & brand strategy for the trading platforms’ power launch in Sydney", tags: ["Web", "Digital Design", "OOH Design", "Brand Direction"], cover: "/cover-moomoo.webp" },
  "2": { year: "2023", name: "BEEM APP", blurb: "Animated stickers, brand alignment & more", tags: ["Mobile", "Animation"], cover: "/cover-beem-app.gif" },
  "3": { year: "2023", name: "BEEMLANTIS", blurb: "Beem’s 2023 gamified Year in Review experience with an underwater theme", tags: ["Mobile", "Web", "Project Management", "Animation"], cover: "/cover-beemlantis2.mp4" },
  "4": { year: "2024", name: "TOTALLY BEEM", blurb: "Beem’s 2024 Year in Review experience with a nostalgic twist", tags: ["Mobile", "Web", "Project Management", "Product Strategy", "Animation"], cover: "/cover-totallybeem2.mp4" },
  "5": { year: "2025", name: "AP+ PORTALS", blurb: "Harmonising AP+'s developer, testing automation and role management experiences", tags: ["Web", "Design system"], cover: "/cover-portals.mp4" },
  "6": { year: "2026", name: "BEEM BEEPS: REMINDERS", blurb: "Highly requested new app feature development", tags: ["Mobile", "User Research", "Product Strategy"], cover: "/cover-beembeeps.mp4" },
};

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

function IconButton({ onClick, icon }: { onClick: () => void; icon: (color: string, hovered: boolean) => React.ReactNode }) {
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

function ProjectBlurb({ data }: { data: FloorPreview }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-space-mono), monospace", fontWeight: 400, fontSize: 13, letterSpacing: "0.1em", color: "var(--color-on-surface-primary)" }}>
          {data.year}
        </span>
        <span style={{ fontFamily: "var(--font-silkscreen)", fontWeight: 400, fontSize: 32, color: "var(--color-on-surface-primary)", textTransform: "uppercase", lineHeight: 1.1 }}>
          {data.name}
        </span>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: "var(--color-on-surface-primary)" }}>
          {data.blurb}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 300,
              fontSize: 13,
              color: "var(--color-on-surface-primary)",
              border: "0.5px solid var(--color-on-surface-tertiary)",
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

function AboutHoverCard() {
  // Offset "stacked card" speech bubble — colours from CSS design tokens
  // (auto-switch per theme). Matches Figma dark 40000160-3373 / light 40000160-3375:
  // a bright back card peeks along the top + left edges, the panel card sits
  // shifted down-right on top, and the bright tail pokes from behind it.
  const bubble = "var(--color-speech-bubble)"; // back card + tail
  const panel = "var(--color-speech-panel)";   // front card fill
  const ink = "var(--color-speech-ink)";        // borders + text

  const OX = 10, OY = 10;              // front card offset from back card
  const BW = 208, BH = 127;            // back card size
  const FW = 202, FH = 121;            // front card size
  const totalW = OX + FW;              // 212
  const totalH = OY + FH;              // 131
  const tailW = 52, tailH = 42;        // tail (top half hidden behind front card)
  const tailLeft = OX + 26;            // 36
  const tailTop = totalH - 12;         // overlap front card so the seam is hidden

  const textStyle = {
    fontFamily: "var(--font-silkscreen)",
    fontSize: 32,
    lineHeight: 1.25,
    color: ink,
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {/* Speech bubble */}
      <div style={{ position: "relative", width: totalW, height: tailTop + tailH }}>
        {/* Back card */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: BW, height: BH,
          backgroundColor: "var(--color-speech-back)", border: "var(--color-speech-back-border)", borderRadius: 28,
          boxSizing: "border-box",
        }} />
        {/* Tail — drawn before the front card so its top seam is hidden behind it */}
        <svg
          width={tailW} height={tailH} viewBox={`0 0 ${tailW} ${tailH}`}
          style={{ position: "absolute", left: tailLeft, top: tailTop }}
        >
          <path d={`M0 0 L${tailW / 2} ${tailH} L${tailW} 0 Z`} style={{ fill: bubble }} />
          <path d={`M0 0 L${tailW / 2} ${tailH} L${tailW} 0`} style={{ fill: "none", stroke: ink, strokeWidth: 2.5, strokeLinejoin: "round" }} />
        </svg>
        {/* Front card (panel) — text vertically centred, left-aligned per Figma */}
        <div style={{
          position: "absolute", top: OY, left: OX, width: FW, height: FH,
          backgroundColor: panel, border: `2.5px solid ${ink}`, borderRadius: 20,
          boxSizing: "border-box",
          display: "flex", flexDirection: "column", justifyContent: "center",
          paddingLeft: 26,
        }}>
          <span style={textStyle}>Ello</span>
          <span style={textStyle}>Gov&rsquo;na!</span>
        </div>
      </div>
      {/* Nicolas Cage "'ello" gif — offset right of the bubble */}
      <Image
        src="/hello-nicolas-cage.gif"
        alt="Nicolas Cage saying 'ello"
        width={totalW}
        height={Math.round(totalW * 318 / 500)}
        unoptimized
        style={{ display: "block", transform: "translate(96px, -12px)" }}
      />
    </div>
  );
}

// Remembers each cover video's playback position so re-hovering resumes from
// where it left off instead of restarting from the beginning.
const coverPlaybackTimes = new Map<string, number>();

function CoverMedia({ data }: { data: FloorPreview }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = data.cover;
  if (!src) return null;
  const style = { width: "100%", height: "100%", objectFit: "cover" as const, display: "block" };
  if (src.endsWith(".mp4")) {
    return (
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        onLoadedMetadata={() => {
          const t = coverPlaybackTimes.get(src);
          if (t && videoRef.current) videoRef.current.currentTime = t;
        }}
        onTimeUpdate={() => {
          if (videoRef.current) coverPlaybackTimes.set(src, videoRef.current.currentTime);
        }}
        style={style}
      />
    );
  }
  // .gif / .webp — a plain <img> keeps animated gifs playing.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={data.name} style={style} />;
}

export default function HomePage() {
  const topRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);
  const projectsListRef = useRef<HTMLDivElement>(null);
  const [vh, setVh] = useState(900);
  const [vw, setVw] = useState(1200);
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [topNavBlur, setTopNavBlur] = useState(false);
  const [bottomNavBlur, setBottomNavBlur] = useState(false);
  const [padInView, setPadInView] = useState(false);

  const isMobile = vw < 768;
  const isCondensed = vw < 1190;    // no hover panels; show list below pad
  const isStackedProject = vw < 768; // stack video above blurb within each project row

  useLayoutEffect(() => {
    // clientWidth/clientHeight (not innerWidth/innerHeight): iOS Safari inflates
    // the window.inner* values when content overflows horizontally, which would
    // both flip us out of the mobile layout and balloon the ID-card lanyard
    // (strapExtension = vh/2 - 442). The client* values track the true viewport.
    const update = () => {
      const el = document.documentElement;
      setVh(el.clientHeight || window.innerHeight);
      setVw(el.clientWidth || window.innerWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("scrollToPad") === "1") {
      sessionStorage.removeItem("scrollToPad");
      padRef.current?.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    const check = () => {
      const el = projectsListRef.current;
      if (!el) {
        setTopNavBlur(false);
        setBottomNavBlur(false);
        return;
      }
      const rect = el.getBoundingClientRect();
      setBottomNavBlur(rect.top <= window.innerHeight - 72);
      setTopNavBlur(rect.top <= 72);
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const el = padRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPadInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const raw = vh / 2 - 442;
  const strapExtension = Math.max(0, raw);
  const cardMarginTop = Math.min(0, raw);

  const scale = Math.min(1, vw < 340 ? Math.max(SCALE_MIN, vw / 340) : 1);
  const shrink = (276 * (1 - scale)) / 2;

  const PAD_W = 392;
  const PAD_H = 772;
  const padScale = Math.min(1, (vw - 32) / PAD_W);
  const padShrinkX = (PAD_W * (1 - padScale)) / 2;
  const padShrinkY = PAD_H * (1 - padScale);

  const scrollToPad = () => padRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  // Cursor-driven depth: the hero card floats/tilts toward the mouse, the pad
  // drifts more gently behind it. Disabled on mobile (and coarse pointers /
  // reduced-motion, handled inside the hook).
  const { mx, my } = useMouseParallax(!isMobile);

  return (
    <div style={{ backgroundColor: "var(--color-bg-secondary)", minHeight: "100vh" }}>

      {/* Entry: fade out from brown on arrival */}
      <TransitionOverlay
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        stagedExit
      />

      <PortfolioNav
        projectsAction={scrollToPad}
        projectsActive={padInView}
        showSound
        mobileBgColor="var(--color-surface-primary)"
        blurTop={topNavBlur}
        blurBottom={bottomNavBlur}
        onLogoClick={() => sessionStorage.setItem("fromHome", "1")}
      />

      {/* Section 1: IDCard */}
      <div
        ref={topRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 48,
          perspective: "1200px",
        }}
      >
        <ParallaxLayer mx={mx} my={my} enabled={!isMobile} shift={18} tilt={8} scaleBoost={0.03}>
          <div
            style={{
              marginTop: cardMarginTop,
              marginLeft: -shrink,
              marginRight: -shrink,
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <IDCard strapExtension={strapExtension} />
          </div>
        </ParallaxLayer>
      </div>

      {/* Section 2: ElevatorPad */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 64,
          paddingBottom: isMobile ? 60 : 168,
        }}
      >
        <IconButton onClick={scrollToPad} icon={(c, h) => <ArrowDown color={c} hovered={h} />} />

        <div ref={padRef} id="elevator-pad" style={{ scrollMarginTop: 32 }}>
          <ParallaxLayer mx={mx} my={my} enabled={!isMobile} shift={7}>
          {isMobile ? (
            /* Mobile: scaled pad, no panels */
            <div
              style={{
                transform: `scale(${padScale})`,
                transformOrigin: "top center",
                marginLeft: -padShrinkX,
                marginRight: -padShrinkX,
                marginBottom: -padShrinkY,
              }}
            >
              <ElevatorPad onHeaderClick={scrollToPad} bg="var(--color-surface-primary)" onContact={() => setContactOpen(true)} scrollReveal />
            </div>
          ) : isCondensed ? (
            /* Condensed (768–1189px): plain pad, list renders below */
            <ElevatorPad onHeaderClick={scrollToPad} bg="var(--color-surface-primary)" scrollReveal />
          ) : (
            /* Wide (≥1190px): three-column hover layout */
            <div style={{ display: "flex", alignItems: "center", gap: 48 }}>

              {/* Left: project title-and-blurb */}
              <div style={{ width: 320, flexShrink: 0 }}>
                <AnimatePresence mode="wait">
                  {hoveredFloor && FLOOR_DATA[hoveredFloor] && (
                    <motion.div
                      key={hoveredFloor}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{ display: "flex", flexDirection: "column", gap: 16 }}
                    >
                      <ProjectBlurb data={FLOOR_DATA[hoveredFloor]} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Centre: elevator pad */}
              <ElevatorPad onHeaderClick={scrollToPad} bg="var(--color-surface-primary)" onFloorHover={setHoveredFloor} onContact={() => setContactOpen(true)} scrollReveal />

              {/* Right: video preview or about card */}
              <div style={{ width: 320, height: 320, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AnimatePresence mode="wait">
                  {hoveredFloor === "about" ? (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <AboutHoverCard />
                    </motion.div>
                  ) : hoveredFloor && FLOOR_DATA[hoveredFloor] ? (
                    <motion.div
                      key={hoveredFloor}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{ width: 320, height: 320, marginLeft: 12, borderRadius: 0, overflow: "hidden", backgroundColor: "var(--color-on-surface-primary)" }}
                    >
                      <CoverMedia data={FLOOR_DATA[hoveredFloor]} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

            </div>
          )}
          </ParallaxLayer>
        </div>

        {/* Condensed projects list — shown at <1190px, above the up arrow */}
        {isCondensed && (
          <div
            ref={projectsListRef}
            style={{
              width: isStackedProject ? "min(400px, calc(100vw - 64px))" : "min(768px, calc(100vw - 64px))",
              display: "flex",
              flexDirection: "column",
              gap: isStackedProject ? 96 : 72,
              alignItems: isStackedProject ? "flex-start" : undefined,
            }}
          >
            {(["6", "5", "4", "3", "2", "1"] as const).map((floor) => {
              const data = FLOOR_DATA[floor];
              return (
                <div
                  key={floor}
                  style={
                    isStackedProject
                      ? { display: "flex", flexDirection: "column", gap: 24, width: "100%" }
                      : { display: "flex", flexDirection: "row", alignItems: "center", gap: 32 }
                  }
                >
                  {/* Video — on top when stacked */}
                  {isStackedProject && (
                    <Link href={`/project/${floor}`} style={{ display: "block", width: "100%" }}>
                      <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 22, overflow: "hidden", backgroundColor: "var(--color-on-surface-primary)" }}>
                        <CoverMedia data={data} />
                      </div>
                    </Link>
                  )}

                  {/* Blurb */}
                  <div style={isStackedProject ? {} : { width: 336, flexShrink: 0 }}>
                    <ProjectBlurb data={data} />
                  </div>

                  {/* Video — on right when side-by-side, fills remaining width */}
                  {!isStackedProject && (
                    <Link href={`/project/${floor}`} style={{ display: "block", flex: 1, minWidth: 280, maxWidth: 400 }}>
                      <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 22, overflow: "hidden", backgroundColor: "var(--color-on-surface-primary)" }}>
                        <CoverMedia data={data} />
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <IconButton onClick={scrollToTop} icon={(c, h) => <ArrowUp color={c} hovered={h} />} />
      </div>

      {/* Copyright — mobile only, static at page bottom */}
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
