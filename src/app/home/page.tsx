"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TransitionOverlay from "@/components/TransitionOverlay";
import PortfolioNav from "@/components/PortfolioNav";
import IDCard from "@/components/IDCard";
import ElevatorPad from "@/components/ElevatorPad";

const BROWN = "#4E3A34";
const HOVER_BROWN = "#D3BA9F";
const BG_BUTTON = "#F3F2F0";
const SCALE_MIN = 0.8;

interface FloorPreview {
  year: string;
  name: string;
  blurb: string;
  tags: string[];
  video?: string;
}

const FLOOR_DATA: Record<string, FloorPreview> = {
  "1": { year: "2021", name: "MOOMOO: POWER LAUNCH", blurb: "Launching moomoo's investment platform into the Australian market", tags: ["Mobile", "Web", "Product design"] },
  "2": { year: "2022", name: "BEEM APP", blurb: "Designing the core payments experience for Beem's flagship mobile app", tags: ["Mobile", "Product design"] },
  "3": { year: "2023", name: "BEEMLANTIS", blurb: "Building Beem's internal design system and component library from the ground up", tags: ["Design system", "Web", "Mobile"] },
  "4": { year: "2024", name: "TOTALLY BEEM", blurb: "A full rebrand and product redesign for Beem's peer-to-peer payments experience", tags: ["Mobile", "Brand", "Product design"] },
  "5": { year: "2025", name: "AP+ PORTALS", blurb: "Harmonising AP+'s developer, testing automation and role management experiences", tags: ["Web", "Design system"] },
  "6": { year: "2025", name: "BEEM BEEPS & SEARCH", blurb: "Sound design and search experience for the Beem payments app", tags: ["Mobile", "Sound design", "Product design"] },
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
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? HOVER_BROWN : BG_BUTTON,
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

function ProjectBlurb({ data }: { data: FloorPreview }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: BROWN }}>
          {data.year}
        </span>
        <span style={{ fontFamily: "var(--font-silkscreen)", fontSize: 32, color: BROWN, textTransform: "uppercase", lineHeight: 1.1 }}>
          {data.name}
        </span>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 14, color: BROWN }}>
          {data.blurb}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {data.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 400,
              fontSize: 14,
              color: BROWN,
              border: `1px solid ${BROWN}`,
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

function VideoPreview({ data }: { floor: string; data: FloorPreview }) {
  if (!data.video) return null;
  return (
    <video
      src={data.video}
      autoPlay
      muted
      loop
      playsInline
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

export default function HomePage() {
  const topRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);
  const projectsListRef = useRef<HTMLDivElement>(null);
  const [vh, setVh] = useState(900);
  const [vw, setVw] = useState(1200);
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);
  const [topNavBlur, setTopNavBlur] = useState(false);
  const [bottomNavBlur, setBottomNavBlur] = useState(false);

  const isMobile = vw < 768;
  const isCondensed = vw < 1190;    // no hover panels; show list below pad
  const isStackedProject = vw < 768; // stack video above blurb within each project row

  useEffect(() => {
    const update = () => { setVh(window.innerHeight); setVw(window.innerWidth); };
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
        showSound
        mobileBgColor="#E5E0D7"
        blurTop={topNavBlur}
        blurBottom={bottomNavBlur}
        onLogoClick={() => sessionStorage.setItem("fromHome", "1")}
      />

      {/* Section 1: IDCard */}
      <div
        ref={topRef}
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: 48,
        }}
      >
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
              <ElevatorPad onHeaderClick={scrollToPad} />
            </div>
          ) : isCondensed ? (
            /* Condensed (768–1189px): plain pad, list renders below */
            <ElevatorPad onHeaderClick={scrollToPad} />
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
              <ElevatorPad onHeaderClick={scrollToPad} onFloorHover={setHoveredFloor} />

              {/* Right: video preview */}
              <div style={{ width: 320, height: 320, flexShrink: 0 }}>
                <AnimatePresence mode="wait">
                  {hoveredFloor && FLOOR_DATA[hoveredFloor] && (
                    <motion.div
                      key={hoveredFloor}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{ width: "100%", height: "100%", borderRadius: 22, overflow: "hidden", backgroundColor: BROWN }}
                    >
                      <VideoPreview floor={hoveredFloor} data={FLOOR_DATA[hoveredFloor]} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          )}
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
                      <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 22, overflow: "hidden", backgroundColor: BROWN }}>
                        <VideoPreview floor={floor} data={data} />
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
                      <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 22, overflow: "hidden", backgroundColor: BROWN }}>
                        <VideoPreview floor={floor} data={data} />
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
              color: "#72503C",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            © Sandy Qi 2026
          </span>
        </div>
      )}
    </div>
  );
}
