"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import ElevatorPad from "@/components/ElevatorPad";
import FloorBreadcrumb from "@/components/FloorBreadcrumb";
import PortfolioNav from "@/components/PortfolioNav";
import ContactModal from "@/components/ContactModal";

const BG = "#F3F2F0";
const BG_SECONDARY = "#E6E5E2";
const HERO_BG = "#E5E0D7";
const BROWN = "#4E3A34";
const HOVER_BROWN = "#D3BA9F";

const INTRO_TEXT =
  "Hello, it's Sandy here. A senior product designer who loves her cat, Soup 🐈‍⬛";

const WORK = [
  {
    company: "Beem / AP+",
    roles: [
      { title: "Senior Product Designer", period: "Oct 2024 – present" },
      { title: "Product Designer", period: "Oct 2023 – Sept 2024" },
      { title: "Senior Visual Designer", period: "Oct 2022 – Sept 2023" },
    ],
  },
  {
    company: "moomoo / FUTU",
    roles: [{ title: "Senior Visual Designer", period: "April 2022 – Oct 2022" }],
  },
  {
    company: "Meriton Suites",
    roles: [{ title: "Mid-weight Graphic Designer", period: "May 2021 – April 2022" }],
  },
  {
    company: "OPPO Australia",
    roles: [{ title: "Graphic Designer", period: "April 2019 – May 2021" }],
  },
  {
    company: "Liquor Tailor",
    roles: [{ title: "Brand Designer (Freelance)", period: "2017–2021" }],
  },
];

const EDUCATION_DETAILS = [
  "Bachelor of Commerce / Bachelor of Design (Honours)",
  "Majors: Marketing, Graphic Design, Spatial Design",
  "WAM: Distinction",
  "",
  "Extracurricular: NSW Touch State Cup, Vawdon Cup, UNSW South Sydney Rabbitohs Touch Club, Unisports Nationals Div 1, O-Week Yellow Shirts, UNSW Business Society, HPAIR Sydney",
];

const DISCIPLINES = [
  "Product (UX/UI) Design",
  "Product Strategy",
  "Project Management",
  "UX copywriting",
  "Brand Design",
  "Animation",
  "Art Direction",
  "Digital Design",
  "Print Design",
];

const TOOLS = [
  "Figma",
  "Kiro / VS code (WIP)",
  "Adobe PS / AI / ID / AE",
  "Lottie",
  "Jira / Confluence",
  "Miro",
];

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--font-space-grotesk)",
        fontWeight: 500,
        fontSize: 24,
        color: BROWN,
      }}
    >
      {children}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--font-space-grotesk)",
        fontWeight: 500,
        fontSize: 14,
        color: BROWN,
      }}
    >
      {children}
    </span>
  );
}

function Detail({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--font-space-grotesk)",
        fontWeight: 300,
        fontSize: 14,
        color: BROWN,
        lineHeight: 1.6,
      }}
    >
      {children}
    </span>
  );
}

function WorkSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionHeader>Work</SectionHeader>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {WORK.map((job) => (
          <div key={job.company} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Label>{job.company}</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {job.roles.map((r) => (
                <Detail key={r.title}>
                  {r.title}
                  <br />
                  {r.period}
                </Detail>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionHeader>Education</SectionHeader>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Label>University of New South Wales</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {EDUCATION_DETAILS.map((line, i) =>
            line === "" ? (
              <div key={i} style={{ height: 8 }} />
            ) : (
              <Detail key={i}>{line}</Detail>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function SkillsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionHeader>Skills</SectionHeader>
      <div style={{ display: "flex", flexDirection: "row", gap: 32 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <Label>Disciplinaries</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {DISCIPLINES.map((d) => (
              <Detail key={d}>{d}</Detail>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <Label>Tools</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TOOLS.map((t) => (
              <Detail key={t}>{t}</Detail>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferencesSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionHeader>References</SectionHeader>
      <Label>Upon request</Label>
    </div>
  );
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

function IconButton({
  onClick,
  icon,
  bg = BG,
}: {
  onClick: () => void;
  icon: (c: string, h: boolean) => React.ReactNode;
  bg?: string;
}) {
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

export default function AboutPage() {
  const topRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);
  const [blurTop, setBlurTop] = useState(false);
  const [blurBottom, setBlurBottom] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (introRef.current) {
        setBlurTop(introRef.current.getBoundingClientRect().top <= 72);
      }
      const remaining =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      setBlurBottom(remaining > 72 && window.scrollY > 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isNarrow = vw < 800;
  const isMobile = vw < 640;
  const sidePad = "clamp(32px, calc(-32px + 10vw), 96px)";
  const clampedVh = Math.max(700, vh);
  const PAD_NATURAL_H = 774;
  const desktopPadScale = isNarrow ? 1 : Math.min(1, (clampedVh - 216) / PAD_NATURAL_H);

  const router = useRouter();
  const scrollToIntro = () => introRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });
  const goToProjects = () => {
    sessionStorage.setItem("scrollToPad", "1");
    router.push("/home");
  };

  return (
    <div style={{ backgroundColor: HERO_BG, minHeight: "100vh" }}>
      <PortfolioNav
        projectsAction={goToProjects}
        isLightNav={false}
        mobileBgColor={HERO_BG}
        blurTop={blurTop}
        blurBottom={blurBottom}
        showSound
      />

      <div ref={topRef}>
        <div
          style={{
            position: "relative",
            backgroundColor: HERO_BG,
            ...(isNarrow
              ? { minHeight: "calc(100svh - 72px)" }
              : { height: "calc(100svh - 72px)", minHeight: 600 }),
            borderRadius: "0 0 32px 32px",
            overflow: "hidden",
          }}
        >
          {isNarrow ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 32,
                padding: `72px ${sidePad} 64px`,
              }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontWeight: 500,
                  fontSize: isMobile ? 28 : 36,
                  lineHeight: 1.2,
                  color: BROWN,
                  margin: 0,
                  maxWidth: 480,
                }}
              >
                {INTRO_TEXT}
              </motion.p>
              <div
                style={{
                  width: 180,
                  height: 240,
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 8,
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/sandy-qi.jpeg"
                  fill
                  alt="Sandy Qi"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  priority
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "start",
                padding: `72px ${sidePad}`,
              }}
            >
              {/* Left: blurb */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  paddingRight: 64,
                  height: clampedVh - 72 - 144,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 500,
                    fontSize: 46,
                    lineHeight: "54px",
                    letterSpacing: "-0.02em",
                    color: BROWN,
                    margin: 0,
                    width: 340,
                  }}
                >
                  {"Hello, it's"}
                  <br />
                  {INTRO_TEXT.slice("Hello, it's".length)}
                </p>
              </motion.div>

              {/* Center: elevator pad */}
              <div style={{ transform: `scale(${desktopPadScale})`, transformOrigin: "top center" }}>
                <ElevatorPad activeFloor="about" onContact={() => setContactOpen(true)} />
              </div>

              {/* Right: photo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingLeft: 80,
                  height: clampedVh - 72 - 144,
                }}
              >
                <div
                  style={{
                    width: 280,
                    height: 373,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src="/sandy-qi.jpeg"
                    fill
                    alt="Sandy Qi"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                    priority
                  />
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Down arrow */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 72 }}>
          <IconButton onClick={scrollToIntro} icon={(c, h) => <ArrowDown color={c} hovered={h} />} />
        </div>
      </div>

      {/* CV content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 144, paddingBottom: 168 }}>
        <div
          ref={introRef}
          style={{ padding: `32px ${sidePad} 0`, scrollMarginTop: 72 }}
        >
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              <WorkSection />
              <EducationSection />
              <SkillsSection />
              <ReferencesSection />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 64,
              }}
            >
              <div style={{ width: 494, flexShrink: 0 }}>
                <WorkSection />
              </div>
              <div style={{ width: 400, flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <EducationSection />
                <div style={{ height: 64 }} />
                <SkillsSection />
                <div style={{ height: 32 }} />
                <ReferencesSection />
              </div>
            </div>
          )}
        </div>

        {/* Up arrow — desktop */}
        {!isNarrow && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton onClick={scrollToTop} icon={(c, h) => <ArrowUp color={c} hovered={h} />} bg={BG} />
          </div>
        )}

        {/* Floor nav */}
        {isNarrow ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                transform: `scale(${Math.min(1, (vw - 48) / 340)})`,
                transformOrigin: "top center",
                marginBottom: `${340 * (1 - Math.min(1, (vw - 48) / 340)) * -0.5}px`,
              }}
            >
              <ElevatorPad activeFloor="about" onContact={() => setContactOpen(true)} />
            </div>
          </div>
        ) : (
          <FloorBreadcrumb activeFloor="about" />
        )}

        {/* Up arrow — narrow only */}
        {isNarrow && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton onClick={scrollToTop} icon={(c, h) => <ArrowUp color={c} hovered={h} />} bg={BG} />
          </div>
        )}
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
