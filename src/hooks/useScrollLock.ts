"use client";

import { useEffect } from "react";

// Ref-count so overlapping locks (e.g. a route change while the menu is open)
// can't have the first unlock release the page for everyone.
let lockCount = 0;
let savedScrollY = 0;

function lock() {
  if (lockCount++ > 0) return;
  savedScrollY = window.scrollY;
  const { style } = document.body;
  // `overflow: hidden` alone doesn't hold on iOS Safari — the page still
  // rubber-bands/scrolls under a fixed overlay. Pinning the body and offsetting
  // it by the current scroll position is the only reliable lock there.
  style.position = "fixed";
  style.top = `-${savedScrollY}px`;
  style.left = "0";
  style.right = "0";
  style.width = "100%";
  style.overflow = "hidden";
  document.documentElement.style.overscrollBehavior = "none";
}

function unlock() {
  if (lockCount === 0) return;
  if (--lockCount > 0) return;
  const { style } = document.body;
  style.position = "";
  style.top = "";
  style.left = "";
  style.right = "";
  style.width = "";
  style.overflow = "";
  document.documentElement.style.overscrollBehavior = "";
  window.scrollTo(0, savedScrollY);
}

/** Freeze page scrolling while `locked` is true, restoring scroll position after. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lock();
    return unlock;
  }, [locked]);
}

export default useScrollLock;
