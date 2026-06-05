"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Elevator from "@/components/Elevator";
import TransitionOverlay from "@/components/TransitionOverlay";
import ElevatorButton from "@/components/ElevatorButton";
import SoundToggle from "@/components/SoundToggle";
import { useAudio } from "@/contexts/AudioContext";

const SIDE_PADDING = 16;

function CoverPageInner() {
  const router = useRouter();
  const [fromHome, setFromHome] = useState(false);
  const { muted, setMuted } = useAudio();

  useEffect(() => {
    if (sessionStorage.getItem("fromHome") === "1") {
      sessionStorage.removeItem("fromHome");
      setFromHome(true);
    }
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [vw, setVw] = useState(1200);
  const dingRef = useRef<HTMLAudioElement | null>(null);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => router.push("/home"), 430);
  };

  useEffect(() => {
    dingRef.current = new Audio("/elevator-ding.mp3");
  }, []);

  useEffect(() => {
    if (dingRef.current) dingRef.current.volume = muted ? 0 : 1;
  }, [muted]);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const marginLeft = Math.max(-38, Math.min(12, vw - 408));
  const groupWidth = 340 + marginLeft + 60;
  const scale = Math.min(1, (vw - SIDE_PADDING * 2) / groupWidth);
  const shrink = (groupWidth * (1 - scale)) / 2;

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
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
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          marginLeft: -shrink,
          marginRight: -shrink,
        }}
      >
        <div className="flex items-center">
          <Elevator isOpen={isOpen} onEnter={handleEnter} />
          <div style={{ marginLeft, position: "relative", zIndex: 10 }}>
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
      </div>
    </main>
  );
}

export default function CoverPage() {
  return <CoverPageInner />;
}
