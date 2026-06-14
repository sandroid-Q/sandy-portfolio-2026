"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Elevator from "@/components/Elevator";
import TransitionOverlay from "@/components/TransitionOverlay";
import ElevatorButton from "@/components/ElevatorButton";
import SoundToggle from "@/components/SoundToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useAudio } from "@/contexts/AudioContext";

const SIDE_PADDING = 16;

function CoverPageInner() {
  const router = useRouter();
  const [fromHome] = useState(() => {
    if (typeof window === "undefined") return false;
    const v = sessionStorage.getItem("fromHome") === "1";
    if (v) sessionStorage.removeItem("fromHome");
    return v;
  });
  const { muted, setMuted } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [vw, setVw] = useState(1200);
  const dingRef = useRef<HTMLAudioElement | null>(null);
  const enterRef = useRef<HTMLAudioElement | null>(null);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    if (enterRef.current) {
      enterRef.current.currentTime = 0;
      enterRef.current.play().catch(() => {});
    }
    setTimeout(() => router.push("/home"), 430);
  };

  useEffect(() => {
    dingRef.current = new Audio("/elevator-ding.mp3");
    enterRef.current = new Audio("/elevator-enter.mp3");
  }, []);

  useEffect(() => {
    if (dingRef.current) dingRef.current.volume = muted ? 0 : 1;
    if (enterRef.current) enterRef.current.volume = muted ? 0 : 1;
  }, [muted]);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const ELEVATOR_WIDTH = 340;
  const buttonMarginLeft = Math.max(-50, Math.min(12, vw - 512));
  const scale = Math.min(1, (vw - SIDE_PADDING * 2) / ELEVATOR_WIDTH);
  const shrink = (ELEVATOR_WIDTH * (1 - scale)) / 2;

  return (
    <main
      className="flex items-center justify-center"
      style={{ backgroundColor: "var(--color-surface-primary)", height: "100dvh", overflow: "hidden" }}
    >
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100, display: "flex", alignItems: "center", gap: 4 }}>
        <ThemeToggle />
        <SoundToggle muted={muted} onClick={() => setMuted(!muted)} />
      </div>

      {/* Fade to brown on exit to home */}
      <TransitionOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        zIndex={50}
      />
      {/* Fade out from brown on arrival from home */}
      {fromHome && (
        <TransitionOverlay
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          stagedExit
          zIndex={50}
        />
      )}

      <div
        style={{
          position: "relative",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          marginLeft: -shrink,
          marginRight: -shrink,
        }}
      >
        <Elevator isOpen={isOpen} onEnter={handleEnter} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: ELEVATOR_WIDTH + buttonMarginLeft,
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        >
          <ElevatorButton
            isOpen={isOpen}
            onClick={() => {
              setIsOpen((v) => {
                const next = !v;
                if (next && dingRef.current) {
                  dingRef.current.currentTime = 0;
                  dingRef.current.play().catch(() => {});
                }
                return next;
              });
            }}
          />
        </div>
      </div>
    </main>
  );
}

export default function CoverPage() {
  return <CoverPageInner />;
}
