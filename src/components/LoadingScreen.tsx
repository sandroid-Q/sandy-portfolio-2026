"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Colours (identical in light + dark mode) ─── */
const BG = "#0034FF"; // loading background
const PINK = "#FFB3D8"; // sparkles, arrow + circle
const WHITE = "#FFFFFF"; // "Hello"
const DOT = "#F8F8F8"; // flanking dots

/* ─── Timeline (seconds) ─── */
const HELLO = "Hello".split("");
const HELLO_START = 0.2;
const HELLO_STAGGER = 0.1;

const SPARK_START = 0.9;
const SPARK_STAGGER = 0.12;
const SPARK_IN_DUR = 0.4; // fade + slide into place
const BOB_DUR = 1.1; // one slow up-and-down, loops until exit
const SPARK_LEFTS = [10.89, 25.95, 41.01]; // x offsets within the cluster

// Arrow + circle animate alongside the sparkles, not after them.
const ARROW_START = SPARK_START;
const TRI_DELAY = ARROW_START;
const CIRCLE_DELAY = ARROW_START + 0.2;
const CIRCLE_DUR = 0.75;
const HOVER_START = CIRCLE_DELAY + CIRCLE_DUR; // ~1.85s
const EXIT_AT = 3.9; // let the sparkles finish + hover settle, then leave
const FADE_DUR = 0.5;

/* Circle geometry: 32px button, 1.5px stroke → r = 15.25 */
const R = 15.25;
const CIRCUMFERENCE = 2 * Math.PI * R;

/* iconoir "Spark" — 4-point sparkle, 15×15 */
const SPARK_PATH =
  "M1.875 7.5C5.7922 7.5 7.5 5.85191 7.5 1.875C7.5 5.85191 9.19588 7.5 13.125 7.5C9.19588 7.5 7.5 9.19588 7.5 13.125C7.5 9.19588 5.7922 7.5 1.875 7.5Z";

/* Up arrow triangle, 17×15 */
const TRIANGLE_PATH =
  "M7.61495 0.501408C8.01584 -0.166734 8.98416 -0.166735 9.38505 0.501407L16.8513 12.9452C17.2641 13.6331 16.7685 14.5084 15.9663 14.5084H1.03373C0.231453 14.5084 -0.264088 13.6331 0.148678 12.9452L7.61495 0.501408Z";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Play once per browser session — don't replay on hard refresh / deep links.
    // Hide on the next frame (not synchronously) to avoid a cascading render.
    if (sessionStorage.getItem("loadingShown")) {
      const raf = requestAnimationFrame(() => setShow(false));
      return () => cancelAnimationFrame(raf);
    }
    sessionStorage.setItem("loadingShown", "1");

    const exitTimer = setTimeout(() => setExiting(true), EXIT_AT * 1000);
    const doneTimer = setTimeout(
      () => setShow(false),
      (EXIT_AT + FADE_DUR) * 1000
    );
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: FADE_DUR, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: exiting ? "none" : "auto",
          }}
        >
          {/* Cluster sized + positioned to match the Figma loading frame,
              nudged up and scaled up a touch */}
          <div
            style={{
              position: "relative",
              width: 66,
              height: 90,
              transform: "translateY(-52px) scale(1.3)",
            }}
          >
            {/* ── Up button: triangle fades in, circle draws from the left, then hovers ── */}
            <motion.div
              style={{ position: "absolute", left: 18, top: 0, width: 32, height: 32 }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                delay: HOVER_START,
                duration: 1.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <motion.circle
                  cx="16"
                  cy="16"
                  r={R}
                  fill="none"
                  stroke={PINK}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  /* rotate so the stroke begins at the left (9 o'clock) */
                  transform="rotate(180 16 16)"
                  initial={{ strokeDashoffset: CIRCUMFERENCE }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{
                    delay: CIRCLE_DELAY,
                    duration: CIRCLE_DUR,
                    ease: "easeInOut",
                  }}
                />
                <motion.path
                  d={TRIANGLE_PATH}
                  fill={PINK}
                  transform="translate(7.5 6.5)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: TRI_DELAY, duration: 0.4 }}
                />
              </svg>
            </motion.div>

            {/* ── "Hello" — typewriter, letter by letter ── */}
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 51,
                width: 34,
                textAlign: "center",
                fontFamily: "var(--font-silkscreen)",
                fontSize: 10,
                lineHeight: "13px",
                letterSpacing: "0.5px",
                color: WHITE,
              }}
            >
              {HELLO.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: HELLO_START + i * HELLO_STAGGER, duration: 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* ── Sparkles — fade + slide in left→right, then bob continuously ── */}
            {SPARK_LEFTS.map((left, i) => (
              <motion.div
                key={i}
                style={{ position: "absolute", left, top: 75, width: 15, height: 15 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: SPARK_START + i * SPARK_STAGGER,
                  duration: SPARK_IN_DUR,
                  ease: "easeOut",
                }}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    delay: SPARK_START + i * SPARK_STAGGER + SPARK_IN_DUR,
                    duration: BOB_DUR,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                      d={SPARK_PATH}
                      fill={PINK}
                      stroke={PINK}
                      strokeWidth="0.9375"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </motion.div>
            ))}

            {/* ── Flanking dots ── */}
            {[0, 64].map((left, i) => (
              <motion.div
                key={i}
                style={{
                  position: "absolute",
                  left,
                  top: 81,
                  width: 2,
                  height: 2,
                  borderRadius: "50%",
                  backgroundColor: DOT,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: SPARK_START, duration: 0.4 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
