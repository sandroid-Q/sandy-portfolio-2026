"use client";

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AudioContextValue {
  muted: boolean;
  setMuted: (v: boolean) => void;
  playButton: () => void;
  playNav: () => void;
  playHover: () => void;
}

const AudioCtx = createContext<AudioContextValue>({
  muted: false,
  setMuted: () => {},
  playButton: () => {},
  playNav: () => {},
  playHover: () => {},
});

// One-shot UI sound effects, preloaded once and replayed on demand.
const SFX_SRCS = ["/button.mp3", "/wooou.mp3"];
// Breadcrumb hover sound is routed through the Web Audio API so its gain can be
// boosted above the 1.0 ceiling of an <audio> element.
const HOVER_GAIN = 4;

const MUSIC_ROUTES = new Set(["/", "/home", "/about"]);
const TRACKS = ["/jazz-1.mp3", "/jazz-2.mp3", "/jazz-3.mp3"];

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const bgRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const hoverCtxRef = useRef<AudioContext | null>(null);
  const hoverBufferRef = useRef<AudioBuffer | null>(null);
  const trackIndexRef = useRef(0);
  const mutedRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    SFX_SRCS.forEach((src) => sfxRef.current.set(src, new Audio(src)));
  }, []);

  useEffect(() => {
    const ctx = new AudioContext();
    hoverCtxRef.current = ctx;
    fetch("/hover.mp3")
      .then((r) => r.arrayBuffer())
      .then((ab) => ctx.decodeAudioData(ab))
      .then((buf) => { hoverBufferRef.current = buf; })
      .catch(() => {});
    return () => { ctx.close().catch(() => {}); };
  }, []);

  const playSfx = (src: string) => {
    if (mutedRef.current) return;
    let sfx = sfxRef.current.get(src);
    if (!sfx) {
      sfx = new Audio(src);
      sfxRef.current.set(src, sfx);
    }
    sfx.currentTime = 0;
    sfx.play().catch(() => {});
  };

  const playButton = () => playSfx("/button.mp3");
  const playNav = () => playSfx("/wooou.mp3");

  const playHover = () => {
    if (mutedRef.current) return;
    const ctx = hoverCtxRef.current;
    const buffer = hoverBufferRef.current;
    if (!ctx || !buffer) return;
    ctx.resume().then(() => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = HOVER_GAIN;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    }).catch(() => {});
  };

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

  useEffect(() => {
    const onVisibility = () => {
      const audio = bgRef.current;
      if (!audio) return;
      if (document.hidden) {
        audio.pause();
      } else if (MUSIC_ROUTES.has(window.location.pathname) && !mutedRef.current) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

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

  return <AudioCtx.Provider value={{ muted, setMuted, playButton, playNav, playHover }}>{children}</AudioCtx.Provider>;
}

export const useAudio = () => useContext(AudioCtx);
