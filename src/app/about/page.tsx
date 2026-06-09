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

const STICKY_YELLOW = "#FFF1B5";
const QUOTE_MARK_COLOR = "#E4C298";

const SKILLS = [
  {
    label: "Product Design",
    gemColor: "#00CFE8",
    items: ["UX/UI Design", "Product Strategy", "Project Management", "Copywriting", "UX Research"],
  },
  {
    label: "Visual / Graphic Design",
    gemColor: "#F064A8",
    items: ["Brand Design", "Art Direction", "Animation", "Digital Design", "Print Design"],
  },
  {
    label: "Web Development",
    gemColor: "#54B87A",
    items: ["Static Website Development (via prompt-coding)"],
  },
  {
    label: "Software & Tools",
    gemColor: "#8468C8",
    items: ["Figma", "Claude Code", "Amazon Kiro", "Adobe Suite (PS, AI, AE, ID)", "Lottie", "Jira/Confluence"],
  },
];

const TESTIMONIALS = [
  {
    name: "JASON BACKHOUSE",
    title: "CODO (Chief Operations & Delivery Officer)",
    company: "AP+ / Beem",
    photo: "/jb.jpeg",
    quote: "Sandy is an amazing product focused designer who can bring in the strategic needs of the business into the validation and problem solving of the product problems she solves.\n\nShe works incredibly well with the team, able to communicate and mediate between competing objectives across the business.\n\nI would recommend her for any role where you need an adept problem solver who also happens to know how to design great experiences and create a great vibe.",
  },
  {
    name: "KHALIL YARAK",
    title: "General Manager of Engineering",
    company: "AP+",
    photo: "/ky.jpeg",
    quote: "Testimonial text here.",
  },
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
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {WORK.map((job) => (
          <div key={job.company} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Label>{job.company}</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

// Stepped diamond pixel-art gem icon — 7 wide × 11 tall (portrait)
const GEM_FULL  = "M3,0 L4,0 L4,1 L5,1 L5,2 L6,2 L6,3 L7,3 L7,8 L6,8 L6,9 L5,9 L5,10 L4,10 L4,11 L3,11 L3,10 L2,10 L2,9 L1,9 L1,8 L0,8 L0,3 L1,3 L1,2 L2,2 L2,1 L3,1 Z";
const GEM_TOP   = "M3,0 L4,0 L4,1 L5,1 L5,2 L6,2 L6,3 L7,3 L7,5 L0,5 L0,3 L1,3 L1,2 L2,2 L2,1 L3,1 Z";
const GEM_BOT   = "M0,5 L7,5 L7,8 L6,8 L6,9 L5,9 L5,10 L4,10 L4,11 L3,11 L3,10 L2,10 L2,9 L1,9 L1,8 L0,8 Z";
const GEM_SHINE = "M3,1 L4,1 L4,3 L3,3 Z";

function PixelGem({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg
      width={size * (7 / 11)}
      height={size}
      viewBox="0 0 7 11"
      style={{ imageRendering: "pixelated", flexShrink: 0 }}
    >
      <path d={GEM_FULL}  fill={color} />
      <path d={GEM_TOP}   fill="white" opacity={0.22} />
      <path d={GEM_BOT}   fill="black" opacity={0.18} />
      <path d={GEM_SHINE} fill="white" opacity={0.72} />
    </svg>
  );
}

function SkillsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionHeader>Skills</SectionHeader>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px" }}>
        {SKILLS.map((skill) => (
          <div key={skill.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <PixelGem color={skill.gemColor} size={16} />
              <Label>{skill.label}</Label>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {skill.items.map((item) => (
                <Detail key={item}>{item}</Detail>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StickyNote({ t, rotate, width = 340, color = STICKY_YELLOW, quoteColor = QUOTE_MARK_COLOR }: { t: typeof TESTIMONIALS[0]; rotate: number; width?: number; color?: string; quoteColor?: string }) {
  return (
    <div style={{
      position: "relative",
      width,
      backgroundColor: color,
      padding: 32,
      display: "flex",
      flexDirection: "column",
      gap: 40,
      transform: `rotate(${rotate}deg)`,
      borderRadius: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0 }}>
          <Image src={t.photo} fill alt={t.name} style={{ objectFit: "cover", objectPosition: "center top" }} />
        </div>
        <div style={{ padding: "4px 12px", border: `0.5px solid ${BROWN}`, borderRadius: 100 }}>
          <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 400, fontSize: 13, color: BROWN }}>
            {t.company}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <span style={{
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 300,
          fontSize: 72,
          letterSpacing: "-0.03em",
          color: quoteColor,
          lineHeight: 0.75,
          display: "block",
          marginBottom: -20,
        }}>
          &ldquo;
        </span>
        <p style={{
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 300,
          fontSize: 13,
          letterSpacing: "-0.03em",
          color: BROWN,
          margin: 0,
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
        }}>
          {t.quote}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 13, letterSpacing: "0.04em", color: BROWN }}>
          {t.name}
        </span>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 12, letterSpacing: "-0.03em", color: BROWN }}>
          {t.title}
        </span>
      </div>
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
              <SkillsSection />
              <EducationSection />
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
                <SkillsSection />
                <div style={{ height: 240 }} />
                <EducationSection />
              </div>
            </div>
          )}
        </div>

        {/* Shoutouts */}
        <div style={{ padding: `0 ${sidePad}`, marginTop: -236 }}>
          <SectionHeader>Shoutouts</SectionHeader>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 16, alignItems: "stretch", marginTop: 24 }}>
            <StickyNote t={TESTIMONIALS[0]} rotate={0} width={400} />
            <StickyNote t={TESTIMONIALS[1]} rotate={0} width={400} color="#D9D0FB" quoteColor="#A994EA" />
          </div>
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
