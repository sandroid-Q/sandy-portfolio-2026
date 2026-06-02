"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Elevator from "@/components/Elevator";
import ElevatorButton from "@/components/ElevatorButton";
import SoundToggle from "@/components/SoundToggle";

const SIDE_PADDING = 16; // minimum px each side at small screens

export default function CoverPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [vw, setVw] = useState(1200);
  const dingRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    dingRef.current = new Audio("/elevator-ding.mp3");
  }, []);

  useEffect(() => {
    const audio = new Audio("/jazz-1.mp3");
    audio.loop = true;
    bgMusicRef.current = audio;

    audio.play().catch(() => {});

    // Retry on first user gesture if autoplay was blocked
    const onFirstGesture = () => {
      audio.play().catch(() => {});
      window.removeEventListener("pointerdown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("pointerdown", onFirstGesture);
    };
  }, []);

  // Sync muted state → both audio elements
  useEffect(() => {
    const vol = muted ? 0 : 1;
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = vol;
      if (muted) bgMusicRef.current.pause();
      else bgMusicRef.current.play().catch(() => {});
    }
    if (dingRef.current) dingRef.current.volume = vol;
  }, [muted]);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 12px gap at ≥420px, slides to −38px at 370px (button overlaps right pilaster)
  // −38 = PILASTER (36) + right cabinet border (2)
  const marginLeft = Math.max(-38, Math.min(12, vw - 408));

  // Dynamic group width based on current marginLeft (340 elevator + gap + 60 button)
  const groupWidth = 340 + marginLeft + 60;

  // Scale down only when group would overflow with padding; never scale above 1
  const scale = Math.min(1, (vw - SIDE_PADDING * 2) / groupWidth);

  // Pull in layout space to compensate for CSS transform scale (doesn't affect flow)
  const shrink = (groupWidth * (1 - scale)) / 2;

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      {/* Sound toggle — fixed top right */}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 100 }}>
        <SoundToggle muted={muted} onClick={() => setMuted((v) => !v)} />
      </div>

      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          marginLeft: -shrink,
          marginRight: -shrink,
        }}
      >
        <div className="flex items-center">
          <Elevator isOpen={isOpen} onEnter={() => router.push("/home")} />
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
