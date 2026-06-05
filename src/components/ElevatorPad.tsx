"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAudio } from "@/contexts/AudioContext";

const BROWN = "#4E3A34";
const RED = "#DE211D";
const BG = "#F3F2F0";

type ButtonVariant = "floor" | "about" | "contact";

interface PadButtonDef {
  variant: ButtonVariant;
  label?: string;
  href: string;
  isActive?: boolean;
}

const FLOOR_ROWS: PadButtonDef[][] = [
  [
    { variant: "floor", label: "5", href: "/project/5" },
    { variant: "floor", label: "6", href: "/project/6" },
  ],
  [
    { variant: "floor", label: "3", href: "/project/3" },
    { variant: "floor", label: "4", href: "/project/4" },
  ],
  [
    { variant: "floor", label: "1", href: "/project/1" },
    { variant: "floor", label: "2", href: "/project/2" },
  ],
  [
    { variant: "floor", label: "G", href: "/home" },
    { variant: "about", href: "/about" },
  ],
  [{ variant: "contact", href: "/contact" }],
];

function BellIcon({ color }: { color: string }) {
  return (
    <svg width={42} height={42} viewBox="0 0 42 42" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.0005 0.4375C13.3954 0.4375 7.06199 6.27168 6.43901 13.8513L5.96761 19.5867C5.80371 21.5808 5.1705 23.5079 4.11968 25.2107L2.47731 27.8719C1.78623 28.9916 1.52418 30.3079 1.95911 31.4946C2.41286 32.7326 3.51552 33.531 4.91985 33.7446C7.69898 34.1675 12.5467 34.5625 21.0005 34.5625C29.4544 34.5625 34.3022 34.1675 37.0813 33.7446C38.4857 33.531 39.5882 32.7326 40.042 31.4946C40.477 30.3079 40.2149 28.9916 39.5238 27.8719L37.8815 25.2106C36.8307 23.5079 36.1974 21.5808 36.0335 19.5867L35.5621 13.8513C34.9391 6.27168 28.6058 0.4375 21.0005 0.4375ZM13.5591 37.0661C15.6805 37.1426 18.1423 37.1873 21.0009 37.1873C23.8591 37.1873 26.3206 37.1426 28.4418 37.0662C27.0789 39.7955 24.2586 41.67 21.0004 41.67C17.7423 41.67 14.922 39.7955 13.5591 37.0661ZM21.8756 4.59375C21.0299 4.59375 20.3444 5.27931 20.3444 6.125C20.3444 6.97069 21.0299 7.65625 21.8756 7.65625C25.0733 7.65625 27.9276 10.3517 28.2241 14.1201C28.2904 14.9632 29.0277 15.5929 29.8708 15.5265C30.7138 15.4602 31.3436 14.723 31.2771 13.8799C30.8728 8.74037 26.8851 4.59375 21.8756 4.59375Z"
        fill={color}
      />
    </svg>
  );
}

function PadButton({ btn, onDing }: { btn: PadButtonDef; onDing: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isActive = btn.isActive ?? false;
  const isActivated = pressed || isActive;

  // outer ring: transparent(BG) → red on hover → brown on pressed/active
  const outerBg = isActivated ? BROWN : hovered ? RED : BG;
  // inner circle: BG so it masks the outer fill; on active match outer (brown) to show just the ring stroke
  const innerBg = isActivated ? BROWN : BG;
  const innerBorderColor = isActivated ? BG : BROWN;
  const contentColor = isActivated ? BG : BROWN;

  return (
    <Link
      href={btn.href}
      style={{ display: "block", outline: "none", WebkitTapHighlightColor: "transparent" }}
    >
      <motion.div
        initial={false}
        animate={{ backgroundColor: outerBg }}
        transition={{ duration: 0.12 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => { setPressed(true); onDing(); }}
        onMouseUp={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        style={{
          borderRadius: "50%",
          border: `2px solid ${BROWN}`,
          padding: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <motion.div
          initial={false}
          animate={{ backgroundColor: innerBg, borderColor: innerBorderColor }}
          transition={{ duration: 0.12 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            borderWidth: 2,
            borderStyle: "solid",
            display: "flex",
            flexDirection: "column",
            ...(btn.variant === "floor"
              ? { justifyContent: "center", alignItems: "center", paddingBottom: 8 }
              : btn.variant === "about"
              ? { justifyContent: "flex-end", alignItems: "center", paddingBottom: 2 }
              : { justifyContent: "center", alignItems: "center" }),
          }}
        >
          {btn.variant === "floor" && (
            <motion.span
              initial={false}
              animate={{ color: contentColor }}
              transition={{ duration: 0.12 }}
              style={{
                fontFamily: "var(--font-silkscreen)",
                fontSize: 60,
                lineHeight: 1,
              }}
            >
              {btn.label}
            </motion.span>
          )}
          {btn.variant === "about" && (
            <Image
              src="/sandy-avatar.png"
              alt="About Sandy"
              width={66}
              height={66}
              style={{ borderRadius: 40 }}
            />
          )}
          {btn.variant === "contact" && <BellIcon color={contentColor} />}
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default function ElevatorPad({ activeFloor = "G", onHeaderClick }: { activeFloor?: string; onHeaderClick?: () => void }) {
  const { muted } = useAudio();
  const dingRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    dingRef.current = new Audio("/elevator-ding.mp3");
  }, []);

  const playDing = () => {
    const ding = dingRef.current;
    if (!ding || muted) return;
    ding.currentTime = 0;
    ding.play().catch(() => {});
  };

  const headerContainerVariants = {
    rest: {},
    hover: { transition: { staggerChildren: 0.04 } },
  };
  const headerLetterVariants = {
    rest: { y: 0 },
    hover: { y: -2, transition: { duration: 0.12, ease: "easeOut" } },
  };

  const rows = FLOOR_ROWS.map((row) =>
    row.map((btn) => ({
      ...btn,
      isActive: btn.variant === "floor" && btn.label === activeFloor,
    }))
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36,
      }}
    >
      <motion.button
        onClick={onHeaderClick}
        initial="rest"
        whileHover="hover"
        variants={headerContainerVariants}
        style={{
          background: "none",
          border: "none",
          padding: "6px 12px",
          cursor: onHeaderClick ? "pointer" : "default",
          fontFamily: "var(--font-space-mono), monospace",
          fontWeight: 400,
          fontSize: 14,
          color: BROWN,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          display: "flex",
        }}
      >
        {"Which floor?".split("").map((char, i) => (
          <motion.span key={i} variants={headerLetterVariants} style={{ display: "inline-block" }}>
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </motion.button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "48px 60px",
          border: `2px solid ${BROWN}`,
        }}
      >
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: row.length === 1 ? "center" : "space-between",
              gap: 60,
            }}
          >
            {row.map((btn) => (
              <PadButton key={btn.href} btn={btn} onDing={playDing} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
