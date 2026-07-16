/**
 * Small uppercase caption used above the Beem Beeps content screens
 * (e.g. "PENDING REQUESTS", "RECIPIENT (PAYEE)"). Mirrors the 10px, tracked,
 * light label style from the Figma source.
 */
export default function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-space-grotesk)",
        fontWeight: 300,
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        textAlign: "center",
        color: "var(--color-on-surface-tertiary)",
      }}
    >
      {children}
    </span>
  );
}
