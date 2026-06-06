"use client";

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AudioContextValue {
  muted: boolean;
  setMuted: (v: boolean) => void;
}

const AudioCtx = createContext<AudioContextValue>({ muted: false, setMuted: () => {} });

const MUSIC_ROUTES = new Set(["/", "/home"]);
const TRACKS = ["/jazz-1.mp3", "/jazz-2.mp3", "/jazz-3.mp3"];

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const bgRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);
  const mutedRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    const audio = new Audio(TRACKS[0]);
    bgRef.current = audio;

    const advanceTrack = () => {
      trackIndexRef.current = (trackIndexRef.current + 1) % TRACKS.length;
      audio.src = TRACKS[trackIndexRef.current];
      if (MUSIC_ROUTES.has(window.location.pathname) && !mutedRef.current) {
        audio.play().catch(() => {});
      }
    };
    audio.addEventListener("ended", advanceTrack);

    const onFirstGesture = () => {
      if (MUSIC_ROUTES.has(window.location.pathname) && bgRef.current) {
        bgRef.current.play().catch(() => {});
      }
      window.removeEventListener("pointerdown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);

    return () => {
      audio.removeEventListener("ended", advanceTrack);
      audio.pause();
      audio.src = "";
      window.removeEventListener("pointerdown", onFirstGesture);
    };
  }, []);

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
    mutedRef.current = v;
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
