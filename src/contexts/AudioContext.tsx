"use client";

import { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AudioContextValue {
  muted: boolean;
  setMuted: (v: boolean) => void;
  playButton: () => void;
  playNav: () => void;
  playHover: () => void;
  // Starts the looping keyboard-typing sound and returns a function to stop it.
  playKeeb: () => () => void;
}

const AudioCtx = createContext<AudioContextValue>({
  muted: false,
  setMuted: () => {},
  playButton: () => {},
  playNav: () => {},
  playHover: () => {},
  playKeeb: () => () => {},
});

// One-shot UI sound effects, preloaded once and replayed on demand.
const SFX_SRCS = ["/button.mp3", "/wooou.mp3"];
// Hover and keyboard sounds are routed through the Web Audio API so their gain
// can be boosted above the 1.0 ceiling of an <audio> element.
const HOVER_GAIN = 4;
const KEEB_GAIN = 4;

const MUSIC_ROUTES = new Set(["/", "/home", "/about"]);
const TRACKS = ["/jazz-1.mp3", "/jazz-2.mp3", "/jazz-3.mp3"];

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const bgRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const hoverCtxRef = useRef<AudioContext | null>(null);
  const hoverBufferRef = useRef<AudioBuffer | null>(null);
  const keebBufferRef = useRef<AudioBuffer | null>(null);
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
    fetch("/keeb.mp3")
      .then((r) => r.arrayBuffer())
      .then((ab) => ctx.decodeAudioData(ab))
      .then((buf) => { keebBufferRef.current = buf; })
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

  // Loops the keyboard-typing sound (boosted gain) for as long as the caller
  // wants, e.g. while the about-page intro types itself in. Returns a stopper.
  const playKeeb = useCallback((): (() => void) => {
    if (mutedRef.current) return () => {};
    const ctx = hoverCtxRef.current;
    const buffer = keebBufferRef.current;
    if (!ctx || !buffer) return () => {};
    let source: AudioBufferSourceNode | null = null;
    let stopped = false;
    ctx.resume().then(() => {
      if (stopped) return;
      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = KEEB_GAIN;
      source.connect(gain);
      gain.connect(ctx.destination);
      // Skip the first second of the clip on playback.
      source.start(0, 1);
    }).catch(() => {});
    return () => {
      stopped = true;
      try { source?.stop(); } catch {}
    };
  }, []);

  useEffect(() => {
    const audio = new Audio(TRACKS[0]);
    audio.preload = "auto"; // buffer the first track so it's ready on first tap
    bgRef.current = audio;

    const advanceTrack = () => {
      trackIndexRef.current = (trackIndexRef.current + 1) % TRACKS.length;
      audio.src = TRACKS[trackIndexRef.current];
      if (MUSIC_ROUTES.has(window.location.pathname) && !mutedRef.current) {
        audio.play().catch(() => {});
      }
    };
    audio.addEventListener("ended", advanceTrack);

    // Start the music on the first user gesture. A single early `pointerdown`
    // often fails on mobile (track not buffered yet, or iOS hasn't unlocked
    // audio until the tap completes), so retry across gesture types and taps
    // and only stop once it's actually playing — otherwise the jazz wouldn't
    // start until a later route change (it appeared to "only work on Home").
    const GESTURES = ["pointerdown", "touchend", "click", "keydown"] as const;
    let attempting = false;
    const stopUnlock = () => GESTURES.forEach((e) => window.removeEventListener(e, tryStart));
    const tryStart = () => {
      const a = bgRef.current;
      if (!a || attempting) return;
      if (mutedRef.current || !MUSIC_ROUTES.has(window.location.pathname)) return;
      if (!a.paused) { stopUnlock(); return; }
      attempting = true;
      a.play().then(stopUnlock).catch(() => {}).finally(() => { attempting = false; });
    };
    GESTURES.forEach((e) => window.addEventListener(e, tryStart));

    return () => {
      audio.removeEventListener("ended", advanceTrack);
      audio.pause();
      audio.src = "";
      stopUnlock();
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

  return <AudioCtx.Provider value={{ muted, setMuted, playButton, playNav, playHover, playKeeb }}>{children}</AudioCtx.Provider>;
}

export const useAudio = () => useContext(AudioCtx);
