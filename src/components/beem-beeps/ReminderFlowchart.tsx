"use client";

import { useLayoutEffect, useRef, useState, Fragment } from "react";

/**
 * The Beem reminder-system flowchart, rebuilt in code (theme-aware, crisp at any
 * size) from the Figma `reminder-system-flowchart` component. Lays out as a
 * horizontal timeline when it fits, collapsing to a vertical timeline on narrow
 * screens — mirroring the design's responsive states.
 */

type Step = {
  n: string;
  title: string;
  by: string;          // "Beem" or "User"
  emphasis: boolean;   // filled pill (user beeps) vs subtle chip (auto/system)
  wait: string;        // annotation shown before the next event
};

const STEPS: Step[] = [
  { n: "1", title: "Auto-reminder", by: "Beem", emphasis: false, wait: "2 days after request" },
  { n: "2", title: "Beem Beep (#1)", by: "User", emphasis: true, wait: "7 days after auto-reminder" },
  { n: "3", title: "Beem Beep (#2)", by: "User", emphasis: true, wait: "7 days after 1st Beem Beep" },
];

// Below this measured container width the timeline stacks vertically.
const STACK_W = 720;

const LINE = "color-mix(in srgb, var(--color-on-surface-primary) 28%, transparent)";
const CHIP_BG = "color-mix(in srgb, var(--color-on-surface-primary) 8%, transparent)";
const CHIP_BORDER = "color-mix(in srgb, var(--color-on-surface-primary) 22%, transparent)";

function SentBy({ by, emphasis }: { by: string; emphasis: boolean }) {
  return (
    <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 10, color: emphasis ? "var(--color-project-surface)" : "var(--color-on-surface-primary)" }}>
      Sent by <span style={{ fontWeight: 500 }}>{by}</span>
    </span>
  );
}

function Pill({ step }: { step: Step }) {
  const ink = step.emphasis ? "var(--color-project-surface)" : "var(--color-on-surface-primary)";
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "4px 16px 4px 4px",
        borderRadius: 99,
        minHeight: 46,
        boxSizing: "border-box",
        ...(step.emphasis
          ? { backgroundColor: "var(--color-on-surface-primary)" }
          : { backgroundColor: CHIP_BG, border: `0.5px solid ${CHIP_BORDER}` }),
      }}
    >
      {/* Number circle */}
      <div
        style={{
          flexShrink: 0, width: 38, height: 38, borderRadius: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: step.emphasis
            ? "color-mix(in srgb, var(--color-project-surface) 22%, transparent)"
            : "var(--color-on-surface-primary)",
          color: step.emphasis ? "var(--color-project-surface)" : "var(--color-project-surface)",
          fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14,
        }}
      >
        {step.n}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: ink, whiteSpace: "nowrap" }}>
          {step.title}
        </span>
        <SentBy by={step.by} emphasis={step.emphasis} />
      </div>
    </div>
  );
}

function EndPill() {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "4px 16px", borderRadius: 99, minHeight: 46, boxSizing: "border-box",
        backgroundColor: CHIP_BG, border: `0.5px solid ${CHIP_BORDER}`,
      }}
    >
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 500, fontSize: 14, color: "var(--color-on-surface-primary)", whiteSpace: "nowrap" }}>
        End of reminders
      </span>
    </div>
  );
}

function WaitLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: 6, backgroundColor: "var(--color-feature-secondary)" }} />
      <span style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300, fontSize: 10, color: "var(--color-on-surface-tertiary)", whiteSpace: "nowrap" }}>
        {text}
      </span>
    </div>
  );
}

export default function ReminderFlowchart() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [stack, setStack] = useState(false);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => { setStack(el.clientWidth < STACK_W); setReady(true); };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      {ready && (stack ? (
        // Vertical timeline: pills stacked, wait labels sit in the connectors.
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {STEPS.map((step) => (
            <Fragment key={step.n}>
              <Pill step={step} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 23, minHeight: 40 }}>
                <span style={{ width: 0, alignSelf: "stretch", borderLeft: `1px dashed ${LINE}` }} />
                <WaitLabel text={step.wait} />
              </div>
            </Fragment>
          ))}
          <EndPill />
        </div>
      ) : (
        // Horizontal timeline: pills in a row joined by connectors, each wait
        // label hanging below its step.
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {STEPS.map((step) => (
            <Fragment key={step.n}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Pill step={step} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 20 }}>
                  <span style={{ height: 20, width: 0, borderLeft: `1px dashed ${LINE}` }} />
                  <WaitLabel text={step.wait} />
                </div>
              </div>
              <span style={{ width: 40, borderTop: `1px solid ${LINE}`, marginTop: 23, flexShrink: 0 }} />
            </Fragment>
          ))}
          <EndPill />
        </div>
      ))}
    </div>
  );
}
