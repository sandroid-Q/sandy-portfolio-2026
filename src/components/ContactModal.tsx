"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/contexts/AudioContext";

const BROWN = "#4E3A34";
const BG = "#F3F2F0";
const RED = "#DE211D";

function ClipboardIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="17" viewBox="0 0 46 44" fill="none" style={{ flexShrink: 0 }}>
      <rect x="14.5" y="12.5" width="30" height="30" rx="8.5" stroke={color} strokeWidth="3" />
      <path d="M7.32129 29.4697C8.14248 29.8103 9.04533 30 10 30V33C8.64374 33 7.35119 32.7284 6.17188 32.2393L7.32129 29.4697ZM13.25 30V33H10V30H13.25ZM0 23V19.75H3V23C3 23.9547 3.18974 24.8575 3.53027 25.6787L0.759766 26.8271C0.333131 25.7982 0.0719299 24.6831 0.0126953 23.5146L0 23ZM0 10C0 8.64387 0.270678 7.3511 0.759766 6.17188L3.53027 7.32129C3.18974 8.14248 3 9.04533 3 10V13.25H0V10ZM33 13.25H30V10C30 9.04533 29.8103 8.14248 29.4697 7.32129L32.2393 6.17188C32.7284 7.35119 33 8.64374 33 10V13.25ZM13.25 0V3H10C9.04533 3 8.14248 3.18974 7.32129 3.53027L6.17188 0.759766C7.3511 0.270678 8.64387 0 10 0H13.25ZM23.5146 0.0126953C24.6831 0.0719299 25.7982 0.333131 26.8271 0.759766L25.6787 3.53027C24.8575 3.18974 23.9547 3 23 3H19.75V0H23L23.5146 0.0126953Z" fill={color} />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2.5 7L5.5 10L11.5 4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmailButton({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  const [hovered, setHovered] = useState(false);
  const iconColor = copied || hovered ? BG : BROWN;
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        backgroundColor: copied || hovered ? BROWN : BG,
        color: copied || hovered ? BG : BROWN,
        borderColor: BROWN,
      }}
      transition={{ duration: 0.12 }}
      style={{
        border: `2px solid ${BROWN}`,
        fontFamily: "var(--font-space-mono), monospace",
        fontWeight: 400,
        fontSize: 13,
        letterSpacing: "0.04em",
        padding: "12px 28px",
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {copied ? "copied" : "sandra.jxq@gmail.com"}
      {copied ? <CheckIcon color={iconColor} /> : <ClipboardIcon color={iconColor} />}
    </motion.button>
  );
}

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const { muted } = useAudio();
  const bellRef = useRef<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    bellRef.current = new Audio("/bell.mp3");
  }, []);

  useEffect(() => {
    if (open && bellRef.current && !muted) {
      bellRef.current.currentTime = 0;
      bellRef.current.play().catch(() => {});
    }
  }, [open, muted]);

  const copyEmail = async () => {
    const email = "sandra.jxq@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(78, 58, 52, 0.55)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              zIndex: 200,
            }}
          />

          {/* Centering shell — keeps Framer Motion's y/scale clean */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 201,
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                pointerEvents: "auto",
                position: "relative",
                backgroundColor: BG,
                border: `2px solid ${BROWN}`,
                padding: "48px 60px 52px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                width: "min(440px, calc(100vw - 48px))",
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: BROWN,
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: 15,
                  lineHeight: 1,
                  transition: "background-color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D3BA9F")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                ✕
              </button>

              {/* Headline */}
              <span
                style={{
                  fontFamily: "var(--font-silkscreen)",
                  fontSize: 48,
                  color: BROWN,
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                Coffee?
              </span>

              {/* Subheading */}
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontWeight: 300,
                  fontSize: 14,
                  color: BROWN,
                  textAlign: "center",
                  lineHeight: 1.6,
                  marginBottom: 36,
                }}
              >
                or whatever floats your goat 🐐
              </span>

              {/* Email copy button */}
              <EmailButton onClick={copyEmail} copied={copied} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
