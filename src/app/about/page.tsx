"use client";

import { useRef, useState, useEffect, useLayoutEffect, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation, useInView, type Variants } from "framer-motion";
import Image from "next/image";
import ElevatorPad from "@/components/ElevatorPad";
import FloorBreadcrumb from "@/components/FloorBreadcrumb";
import PortfolioNav from "@/components/PortfolioNav";
import ContactModal from "@/components/ContactModal";
import ParallaxLayer from "@/components/ParallaxLayer";
import { useMouseParallax } from "@/components/useMouseParallax";
import { useAudio } from "@/contexts/AudioContext";

const BG = "var(--color-surface-primary)";
const HERO_BG = "var(--color-surface-primary)";
const BROWN = "var(--color-on-surface-primary)";
const HOVER_BROWN = "var(--color-on-surface-secondary)";
// Body text: on-surface-secondary in dark mode, on-surface-primary in light mode
const BODY = "var(--color-about-body)";
const FEATURE = "var(--color-feature-primary)";

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
    company: "Meriton",
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

const EDUCATION_DETAILS: Array<{ full?: string; title?: string; value?: string; empty?: true }> = [
  { full: "Bachelor of Commerce / Bachelor of Design (Honours)" },
  { title: "Majors", value: "Marketing, Graphic Design, Spatial Design" },
  { title: "WAM", value: "Distinction" },
  { empty: true },
  { title: "Extracurricular", value: "NSW Touch State Cup, Vawdon Cup, UNSW South Sydney Rabbitohs Touch Club, Unisports Nationals Div 1, O-Week Yellow Shirts, UNSW Business Society, HPAIR Sydney" },
];

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
    items: ["Static Website Development"],
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
  {
    name: "BRIDIE ALLAN",
    title: "Creative Director",
    company: "AP+ / Beem",
    photo: "/ba.png",
    quote: "TBA",
  },
];

const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz";

// Scroll-in reveal: body rows fade up from nothing, one after another, with smooth ease-in-out.
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
};
const STAGGER_VIEWPORT = { once: true, amount: 0.2 } as const;

function ScrambleSpan({
  defaultText,
  hoverText,
  baseColor,
}: {
  defaultText: string;
  hoverText: string;
  baseColor: string;
}) {
  const displayRef = useRef(defaultText);
  const [displayState, setDisplayState] = useState(defaultText);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [fixedWidth, setFixedWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (spanRef.current) setFixedWidth(spanRef.current.offsetWidth);
  }, []);

  const updateDisplay = (val: string) => {
    displayRef.current = val;
    setDisplayState(val);
  };

  const runScramble = (to: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const from = displayRef.current;
    const fromChars = from.split("");
    const toChars = to.split("");
    const n = to.length;
    let frame = 0;
    const DURATION = 4;
    const TOTAL_STAGGER = 4;

    intervalRef.current = setInterval(() => {
      const next = Array.from({ length: n }, (_, i) => {
        const tCh = toChars[i];
        const sCh = fromChars[i] ?? " ";
        if (!tCh || tCh === " ") return tCh ?? "";
        // ease-in-out stagger so wave accelerates through the middle
        const t = n > 1 ? i / (n - 1) : 0;
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const start = Math.round(eased * TOTAL_STAGGER);
        const lock = start + DURATION;
        if (frame < start) return sCh !== " " ? sCh : tCh;
        if (frame < lock) return SCRAMBLE_CHARS[Math.floor(Math.random() * 26)];
        return tCh;
      });
      updateDisplay(next.join(""));
      frame++;
      if (frame >= TOTAL_STAGGER + DURATION) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        updateDisplay(to);
      }
    }, 40);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current!); }, []);

  return (
    <span
      ref={spanRef}
      onMouseEnter={() => { setHovered(true); runScramble(hoverText); }}
      onMouseLeave={() => {
        setHovered(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        updateDisplay(defaultText);
      }}
      style={{ display: "inline-block", width: fixedWidth, color: hovered ? FEATURE : baseColor, transition: "color 0.2s", cursor: "default" }}
    >
      {displayState}
    </span>
  );
}

// The intro as ordered segments. "scramble"/"soup" become interactive (hover) once typing finishes.
const INTRO_SEGMENTS: Array<{ kind: "text" | "br" | "scramble" | "soup"; text?: string }> = [
  { kind: "text", text: "Hello, it's" },
  { kind: "br" },
  { kind: "text", text: " Sandy here. A " },
  { kind: "scramble", text: "senior product designer" },
  { kind: "text", text: " who loves her cat, " },
  { kind: "soup", text: "Soup 🐈‍⬛" },
];
const INTRO_PLAIN = INTRO_SEGMENTS.map((s) => s.text ?? " ").join("");

interface GraphemeSegmenter { segment(input: string): Iterable<{ segment: string }> }
type SegmenterCtor = new (locales?: string, options?: { granularity: "grapheme" }) => GraphemeSegmenter;

// Split into user-perceived characters so multi-codepoint emoji (🐈‍⬛) reveal as one unit.
function toGraphemes(str: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: SegmenterCtor }).Segmenter;
  if (Seg) return Array.from(new Seg(undefined, { granularity: "grapheme" }).segment(str), (s) => s.segment);
  return Array.from(str);
}

// Per-character delay: quick base + jitter, with longer pauses after punctuation so it reads as natural typing.
function typingDelay(justTyped: string): number {
  let d = 12 + Math.random() * 26;
  if (justTyped === ",") d += 130;
  else if (justTyped === ".") d += 210;
  else if (justTyped === "'") d += 22;
  else if (justTyped === " ") d += 8;
  return d;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
}

// Blinking caret in feature-primary, sized relative to the surrounding text.
function Caret() {
  return (
    <motion.span
      aria-hidden
      style={{
        display: "inline-block",
        width: "0.07em",
        height: "0.92em",
        backgroundColor: FEATURE,
        marginLeft: "0.06em",
        borderRadius: 1,
        verticalAlign: "-0.12em",
      }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

// Renders every grapheme up front (so layout is final from the first frame) and reveals them
// in place via visibility. The caret is injected at the current reveal boundary.
function RevealChars({ graphemes, start, count }: { graphemes: string[]; start: number; count: number }) {
  return (
    <>
      {graphemes.map((g, i) => {
        const gi = start + i;
        return (
          <Fragment key={i}>
            {gi === count && <Caret />}
            <span style={{ visibility: gi < count ? "visible" : "hidden" }}>{g}</span>
          </Fragment>
        );
      })}
    </>
  );
}

// Types the intro on landing. The full paragraph is laid out from frame 1 (characters hidden, not
// removed), so text reveals exactly where it finally lands — no reflow. scramble/soup swap to their
// interactive versions on completion, at identical width, so there's no shift afterwards either.
function IntroParagraph({
  pStyle,
  soupHovered,
  setSoupHovered,
}: {
  pStyle: React.CSSProperties;
  soupHovered: boolean;
  setSoupHovered: (v: boolean) => void;
}) {
  const segs = useMemo(() => {
    const perSeg = INTRO_SEGMENTS.map((s) => (s.text ? toGraphemes(s.text) : []));
    return INTRO_SEGMENTS.map((s, i) => ({
      ...s,
      graphemes: perSeg[i],
      start: perSeg.slice(0, i).reduce((sum, g) => sum + g.length, 0),
    }));
  }, []);
  const flat = useMemo(() => segs.flatMap((s) => s.graphemes), [segs]);
  const total = flat.length;

  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const { playKeeb } = useAudio();

  useEffect(() => {
    if (prefersReducedMotion()) {
      const raf = requestAnimationFrame(() => {
        setCount(total);
        setDone(true);
      });
      return () => cancelAnimationFrame(raf);
    }
    // Boosted keyboard sound loops alongside the typing, stopping when it finishes.
    const stopKeeb = playKeeb();
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i++;
      setCount(i);
      if (i >= total) {
        setDone(true);
        stopKeeb();
        return;
      }
      timer = setTimeout(tick, typingDelay(flat[i - 1]));
    };
    timer = setTimeout(tick, 220);
    return () => {
      clearTimeout(timer);
      stopKeeb();
    };
  }, [flat, total, playKeeb]);

  return (
    <p style={pStyle} aria-label={INTRO_PLAIN}>
      {segs.map((s, idx) => {
        if (s.kind === "br") return <br key={idx} />;
        if (s.kind === "scramble") {
          return done ? (
            <ScrambleSpan
              key={idx}
              defaultText="senior product designer"
              hoverText="hobby & meme collector"
              baseColor={BODY}
            />
          ) : (
            <span key={idx} style={{ display: "inline-block" }}>
              <RevealChars graphemes={s.graphemes} start={s.start} count={count} />
            </span>
          );
        }
        if (s.kind === "soup") {
          return done ? (
            <span
              key={idx}
              onMouseEnter={() => setSoupHovered(true)}
              onMouseLeave={() => setSoupHovered(false)}
              style={{ color: soupHovered ? FEATURE : BODY, transition: "color 0.2s", cursor: "default" }}
            >
              Soup 🐈‍⬛
            </span>
          ) : (
            <RevealChars key={idx} graphemes={s.graphemes} start={s.start} count={count} />
          );
        }
        return <RevealChars key={idx} graphemes={s.graphemes} start={s.start} count={count} />;
      })}
    </p>
  );
}

// Background-coloured panel covering a photo, sliding down on landing to reveal the image top-first.
function RevealCurtain() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (!prefersReducedMotion()) return;
    const raf = requestAnimationFrame(() => setReduce(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      initial={{ y: 0 }}
      animate={{ y: "101%" }}
      transition={{ duration: 1.25, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
      style={{ position: "absolute", inset: 0, backgroundColor: HERO_BG, zIndex: 4 }}
    />
  );
}

// Types `text` once it scrolls into view, with the same blinking caret as the intro
// (caret disappears on completion).
function TypewriterText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const graphemes = useMemo(() => toGraphemes(text), [text]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      const raf = requestAnimationFrame(() => setCount(graphemes.length));
      return () => cancelAnimationFrame(raf);
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i++;
      setCount(i);
      if (i >= graphemes.length) return;
      timer = setTimeout(tick, typingDelay(graphemes[i - 1]));
    };
    timer = setTimeout(tick, 80);
    return () => clearTimeout(timer);
  }, [inView, graphemes]);

  return (
    <span ref={ref} style={style} aria-label={text}>
      <RevealChars graphemes={graphemes} start={0} count={count} />
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <TypewriterText
      text={typeof children === "string" ? children : String(children)}
      style={{
        display: "block",
        fontFamily: "var(--font-silkscreen)",
        fontWeight: 400,
        fontSize: 24,
        color: BROWN,
      }}
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--font-space-grotesk)",
        fontWeight: 300,
        fontSize: 13,
        color: BODY,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
      }}
    >
      {children}
    </span>
  );
}

function Detail({ children, weight = 300 }: { children: React.ReactNode; weight?: number }) {
  return (
    <span
      style={{
        display: "block",
        fontFamily: "var(--font-space-grotesk)",
        fontWeight: weight,
        fontSize: 14,
        color: BODY,
        lineHeight: 1.6,
      }}
    >
      {children}
    </span>
  );
}

function WorkSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionHeader>Work</SectionHeader>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={STAGGER_VIEWPORT}
        style={{ display: "flex", flexDirection: "column", gap: 28 }}
      >
        {WORK.map((job) => (
          <motion.div variants={fadeUpItem} key={job.company} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Label>{job.company}</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {job.roles.map((r) => (
                <div key={r.title} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "block", fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: BODY, lineHeight: 1.6 }}>{r.title}</span>
                  <Detail>{r.period}</Detail>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function EducationSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionHeader>Education</SectionHeader>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={STAGGER_VIEWPORT}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <motion.div variants={fadeUpItem}>
          <Label>University of New South Wales</Label>
        </motion.div>
        <motion.div variants={fadeUpItem} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {EDUCATION_DETAILS.map((item, i) =>
            item.empty ? (
              <div key={i} style={{ height: 8 }} />
            ) : item.full ? (
              <Detail key={i} weight={500}>{item.full}</Detail>
            ) : (
              <span key={i} style={{ display: "block", fontFamily: "var(--font-space-grotesk)", fontSize: 14, color: BODY, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 500 }}>{item.title}</span>
                <span style={{ fontWeight: 300 }}>: {item.value}</span>
              </span>
            )
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function SkillsSection({ oneCol = false }: { oneCol?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionHeader>Skills</SectionHeader>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={STAGGER_VIEWPORT}
        style={{ display: "grid", gridTemplateColumns: oneCol ? "1fr" : "1fr 1fr", gap: "24px 32px" }}
      >
        {SKILLS.map((skill) => (
          <motion.div variants={fadeUpItem} key={skill.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ display: "block", fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: BODY }}>{skill.label}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {skill.items.map((item) => (
                <Detail key={item}>{item}</Detail>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function StickyNote({ t, color = "#FBD5E8", quoteColor = "var(--color-on-surface-secondary)" }: { t: typeof TESTIMONIALS[0]; color?: string; quoteColor?: string }) {
  return (
    <motion.div
      variants={fadeUpItem}
      className="testimonial-card"
      whileHover={{ rotate: -1.5, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 18 } }}
      style={{
        position: "relative",
        flex: 1,
        backgroundColor: color,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 40,
        borderRadius: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0, backgroundColor: HOVER_BROWN }}>
          {t.photo && <Image src={t.photo} fill sizes="56px" alt={t.name} style={{ objectFit: "cover", objectPosition: "center top" }} />}
        </div>
        <div style={{ padding: "4px 12px", backgroundColor: "var(--color-on-surface-secondary)", borderRadius: 100 }}>
          <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 400, fontSize: 13, color: "var(--color-surface-primary)" }}>
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
          fontFamily: "var(--font-space-mono), monospace",
          fontWeight: 400,
          fontSize: 13,
          letterSpacing: "-0.03em",
          color: "var(--color-on-surface-secondary)",
          margin: 0,
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
        }}>
          {t.quote}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 13, letterSpacing: "0.04em", color: "var(--color-on-surface-secondary)" }}>
          {t.name}
        </span>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 12, letterSpacing: "-0.03em", color: "var(--color-on-surface-secondary)" }}>
          {t.title}
        </span>
      </div>
    </motion.div>
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

export default function AboutPage() {
  const topRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);
  const [blurTop, setBlurTop] = useState(false);
  const [blurBottom, setBlurBottom] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [soupHovered, setSoupHovered] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);

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

  const isNarrow = vw < 850;
  const isMobile = vw < 640;
  const isMedium = !isNarrow && vw < 1200;

  // Cursor-driven depth across the hero (multi-column layouts only). Disabled on
  // the narrow single-column layout, coarse pointers, and reduced-motion.
  const { mx, my } = useMouseParallax(!isNarrow);
  const sidePad = "clamp(32px, calc(-32px + 10vw), 96px)";
  const sidePadWide = "clamp(148px, calc(84px + 10vw), 212px)";
  const sidePadPx = Math.min(96, Math.max(32, vw * 0.1 - 32));
  const clampedVh = Math.max(700, vh);
  const PAD_NATURAL_H = 774;
  const desktopPadScale = isNarrow ? 1 : Math.min(1, (clampedVh - 216) / PAD_NATURAL_H);
  // Narrow: scale text+photo together once viewport gets too small to fit 340px content
  const narrowScale = isNarrow ? Math.min(1, Math.max(0.5, (vw - 2 * sidePadPx) / 340)) : 1;
  // Shared vertical offset: how far down the content block sits within the hero (grows with viewport height)
  const heroContentOffset = Math.max(24, Math.min(80, clampedVh - 774));
  // Medium: grid adds its own 72px top padding, so motion.div only needs heroContentOffset
  const mediumPaddingTop = isMedium ? heroContentOffset : 0;
  const mediumPhotoH = isMedium ? Math.max(140, Math.min(280, clampedVh - 594 - mediumPaddingTop)) : 280;
  // Narrow: no grid padding, so add 72px to match medium's visual position exactly
  const narrowTopPad = isNarrow ? 72 + heroContentOffset : 0;
  const narrowPhotoH = isNarrow ? Math.max(100, Math.min(280 * narrowScale, vh > 0 ? vh - 72 - narrowTopPad - 330 * narrowScale - 48 - 64 : 200)) : 280;
  const cvIsStack = vw < 680;
  const cvIsCompact = vw >= 680 && vw < 1000;
  // Wide layout (≥1000px): content is centered within the 1200px cap; keep a 32px min side gutter.
  const cvSidePad = cvIsStack || cvIsCompact ? "clamp(32px, 5vw, 96px)" : "32px";


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
              ? { height: "calc(100svh - 72px)" }
              : { height: "calc(100svh - 72px)", minHeight: 600 }),
            borderRadius: "0 0 32px 32px",
            overflow: "hidden",
          }}
        >
          {isNarrow ? (
            <div style={{ padding: `${narrowTopPad}px ${sidePad} 64px`, position: "relative" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ display: "flex", flexDirection: "column", gap: 48 }}
              >
                <IntroParagraph
                  pStyle={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 500,
                    fontSize: 46 * narrowScale,
                    lineHeight: `${54 * narrowScale}px`,
                    letterSpacing: "-0.02em",
                    color: BODY,
                    margin: 0,
                    width: 340 * narrowScale,
                  }}
                  soupHovered={soupHovered}
                  setSoupHovered={setSoupHovered}
                />
                <div
                  onMouseEnter={() => setProfileHovered(true)}
                  onMouseLeave={() => setProfileHovered(false)}
                  style={{ width: 210 * narrowScale, height: narrowPhotoH, position: "relative", flexShrink: 0 }}
                >
                  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                    <Image src="/sandy-qi.jpeg" fill sizes="210px" alt="Sandy Qi"
                      style={{ objectFit: "cover", objectPosition: "center top" }} priority />
                    <RevealCurtain />
                  </div>
                  {profileHovered && (
                    <Image src="/me-azer.JPG" width={345} height={230} alt="Sandy alt"
                      style={{ position: "absolute", top: "calc(50% + 10px)", left: -40,
                        transform: "translateY(-50%)", zIndex: 2, display: "block",
                        width: 345 * narrowScale, height: 230 * narrowScale, maxWidth: "none" }} />
                  )}
                </div>
              </motion.div>
              {soupHovered && (
                <video src="/soup-boing-vid.mp4" autoPlay muted loop playsInline
                  style={{ position: "absolute", bottom: 292, right: sidePad, width: 180, pointerEvents: "none" }} />
              )}
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: isMedium ? "auto auto" : "1fr auto 1fr",
                justifyContent: isMedium ? "center" : undefined,
                alignItems: "start",
                padding: `72px ${sidePadWide}`,
              }}
            >
              {/* Left column: intro text (always here); photo stacks below on medium */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: isMedium ? "center" : "flex-end",
                  alignItems: isMedium ? "flex-start" : "center",
                  paddingRight: isMedium ? 48 : 64,
                  ...(isMedium ? { paddingTop: mediumPaddingTop } : { height: clampedVh - 72 - 144 }),
                }}
              >
                <ParallaxLayer mx={mx} my={my} enabled={!isNarrow} shift={11} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: isMedium ? 48 : 24 }}>
                  <IntroParagraph
                    pStyle={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontWeight: 500,
                      fontSize: 46,
                      lineHeight: "54px",
                      letterSpacing: "-0.02em",
                      color: BODY,
                      margin: 0,
                      width: 340,
                    }}
                    soupHovered={soupHovered}
                    setSoupHovered={setSoupHovered}
                  />

                  {/* Medium only: photo under the text in the left column */}
                  {isMedium && (
                    <div
                      onMouseEnter={() => setProfileHovered(true)}
                      onMouseLeave={() => setProfileHovered(false)}
                      style={{ width: 210, height: mediumPhotoH, flexShrink: 0, position: "relative" }}
                    >
                      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                        <Image src="/sandy-qi.jpeg" fill sizes="280px" alt="Sandy Qi"
                          style={{ objectFit: "cover", objectPosition: "center top" }} priority />
                        <RevealCurtain />
                      </div>
                      {profileHovered && (
                        <Image src="/me-azer.JPG" width={345} height={230} alt="Sandy alt"
                          style={{ position: "absolute", top: "calc(50% + 10px)", left: -40,
                            transform: "translateY(-50%)", zIndex: 2, display: "block",
                            width: 345, height: 230, maxWidth: "none" }} />
                      )}
                    </div>
                  )}
                </ParallaxLayer>
                {soupHovered && (
                  <video src="/soup-boing-vid.mp4" autoPlay muted loop playsInline
                    style={{ position: "absolute", bottom: 292, right: 72, width: 220, pointerEvents: "none" }} />
                )}
              </motion.div>

              {/* Center: elevator pad */}
              <ParallaxLayer mx={mx} my={my} enabled={!isNarrow} shift={8}>
                <div style={{ transform: `scale(${desktopPadScale})`, transformOrigin: "top center" }}>
                  <ElevatorPad activeFloor="about" bg={HERO_BG} onContact={() => setContactOpen(true)} />
                </div>
              </ParallaxLayer>

              {/* Right column: photo on wide (≥1200px), empty mirror on medium */}
              {!isMedium ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingLeft: 80,
                    height: clampedVh - 72 - 144,
                    perspective: "1200px",
                  }}
                >
                  <ParallaxLayer mx={mx} my={my} enabled={!isNarrow} shift={12} tilt={8} scaleBoost={0.03}>
                    {/* Hover on the exact photo box only; nested overflow so overlay can spill outside */}
                    <div
                      onMouseEnter={() => setProfileHovered(true)}
                      onMouseLeave={() => setProfileHovered(false)}
                      style={{ width: 280, height: 373, position: "relative", flexShrink: 0 }}
                    >
                      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                        <Image src="/sandy-qi.jpeg" fill sizes="280px" alt="Sandy Qi"
                          style={{ objectFit: "cover", objectPosition: "center top" }} priority />
                        <RevealCurtain />
                      </div>
                      {profileHovered && (
                        <Image src="/me-azer.JPG" width={460} height={307} alt="Sandy alt"
                          style={{ position: "absolute", top: "50%", left: -40,
                            transform: "translateY(-50%)", zIndex: 2, display: "block",
                            width: 460, height: 307, maxWidth: "none" }} />
                      )}
                    </div>
                  </ParallaxLayer>
                </div>
              ) : null}
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
          style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: `32px ${cvSidePad} 0`, scrollMarginTop: 72 }}
        >
          {cvIsStack ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              <WorkSection />
              <SkillsSection oneCol />
              <EducationSection />
            </div>
          ) : cvIsCompact ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
              <div style={{ display: "flex", gap: 48 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <WorkSection />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SkillsSection oneCol />
                </div>
              </div>
              <EducationSection />
            </div>
          ) : (
            <div style={{ display: "flex", gap: "clamp(64px, calc(8vw - 16px), 200px)", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <WorkSection />
              </div>
              <div style={{ width: 360, flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <SkillsSection />
                <div style={{ height: "0.7px", backgroundColor: BROWN, margin: "48px 0" }} />
                <EducationSection />
              </div>
            </div>
          )}
        </div>

        {/* Shoutouts */}
        <div style={{ width: "100%", maxWidth: 1280, margin: "-80px auto 0", padding: `0 ${cvSidePad}` }}>
          <div style={{ textAlign: "center" }}><SectionHeader>Shoutouts</SectionHeader></div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={STAGGER_VIEWPORT}
            style={{ display: "flex", flexDirection: !cvIsStack && !cvIsCompact ? "row" : "column", gap: 24, alignItems: "stretch", marginTop: 36 }}
          >
            <StickyNote t={TESTIMONIALS[0]} />
            <StickyNote t={TESTIMONIALS[1]} />
            <StickyNote t={TESTIMONIALS[2]} />
          </motion.div>
        </div>

        {/* Up arrow — desktop */}
        {!isNarrow && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton onClick={scrollToTop} icon={(c, h) => <ArrowUp color={c} hovered={h} />} />
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
              <ElevatorPad activeFloor="about" bg={HERO_BG} onContact={() => setContactOpen(true)} />
            </div>
          </div>
        ) : (
          <FloorBreadcrumb activeFloor="about" />
        )}

        {/* Up arrow — narrow only */}
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
