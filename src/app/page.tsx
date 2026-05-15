"use client";

import { useState } from "react";
import ElevatorClosed from "@/components/ElevatorClosed";
import ElevatorButton from "@/components/ElevatorButton";

export default function CoverPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main
      className="min-h-screen flex items-center justify-center gap-8 p-6"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      <ElevatorClosed />
      <ElevatorButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
    </main>
  );
}
