"use client";

import { useState, useEffect, useRef } from "react";
import Elevator from "@/components/Elevator";
import ElevatorButton from "@/components/ElevatorButton";
import IDCard from "@/components/IDCard";
import ElevatorPad from "@/components/ElevatorPad";

// 340 cabinet + 60 button − 36 right-pilaster overlap cap = 364px natural group width
const NATURAL_GROUP_WIDTH = 364;

export default function CoverPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [vw, setVw] = useState(1200);
  const dingRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    dingRef.current = new Audio("/elevator-ding.mp3");
  }, []);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Margin: 12px at ≥460px, slides linearly to −38px at ~377px, stays at −38 below
  // −38 = PILASTER (36) + right cabinet border (2) — aligns button left edge with right pilaster inner line
  const marginLeft = Math.max(-38, Math.min(12, 60 * vw / 100 - 264));

  // Scale: 1.0 at ≥380px, shrinks to 320/364≈0.879 at 320px, side-scroll below
  const scale = vw >= 380 ? 1 : Math.max(320 / NATURAL_GROUP_WIDTH, vw / NATURAL_GROUP_WIDTH);

  // Pull in horizontal layout space to match the scaled visual width so flex centering is correct
  const shrink = (NATURAL_GROUP_WIDTH * (1 - scale)) / 2;

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          marginLeft: -shrink,
          marginRight: -shrink,
        }}
      >
        <div className="flex items-center gap-16">
          <IDCard />
          <Elevator isOpen={isOpen} />
          <ElevatorPad />
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
