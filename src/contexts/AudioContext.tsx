"use client";

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AudioContextValue {
  muted: boolean;
  setMuted: (v: boolean) => void;
}

const AudioCtx = createContext<AudioContextValue>({ muted: false, setMuted: () => {} });

const MUSIC_ROUTES = new Set(["/", "/home"]);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const bgRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  // Create the audio element once on mount
  useEffect(() => {
    const audio = new Audio("/jazz-1.mp3");
    audio.loop = true;
    bgRef.current = audio;

    // Retry on first user gesture if autoplay was blocked
    const onFirstGesture = () => {
      if (MUSIC_ROUTES.has(window.location.pathname) && bgRef.current) {
        bgRef.current.play().catch(() => {});
      }
      window.removeEventListener("pointerdown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("pointerdown", onFirstGesture);
    };
  }, []);

  // Play or pause whenever the route or muted state changes
  useEffect(() => {
    const audio = bgRef.current;
    if (!audio) return;
    if (MUSIC_ROUTES.has(pathname) && !muted) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [pathname, muted]);

  const setMuted = (v: boolean) => {
    setMutedState(v);
    const audio = bgRef.current;
    if (!audio) return;
    audio.volume = v ? 0 : 1;
    if (v) {
      audio.pause();
    } else if (MUSIC_ROUTES.has(pathname)) {
      audio.play().catch(() => {});
    }
  };

  return <AudioCtx.Provider value={{ muted, setMuted }}>{children}</AudioCtx.Provider>;
}

export const useAudio = () => useContext(AudioCtx);
