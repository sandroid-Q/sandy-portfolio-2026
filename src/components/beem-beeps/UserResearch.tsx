/**
 * "User research" section: a wide research screenshot (with a soft highlight
 * ring over the focal area, as in the Figma source) above two supporting
 * screenshots that sit side-by-side and stack on narrow screens.
 */
export default function UserResearch() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
      {/* Primary screenshot with focal highlight ring */}
      <div style={{ position: "relative", width: 790, maxWidth: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/beem beeps/research-1.png" alt="User research findings" loading="lazy" style={{ display: "block", width: "100%", borderRadius: 20 }} />
        <span
          aria-hidden
          style={{
            position: "absolute", left: "32.5%", top: "48%", width: "15%", aspectRatio: "1",
            transform: "translate(-50%, -50%)", borderRadius: "50%",
            backgroundColor: "rgba(217, 217, 217, 0.2)",
          }}
        />
      </div>
      {/* Supporting screenshots */}
      <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 32 }}>
        {["/beem beeps/research-2.png", "/beem beeps/research-3.png"].map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt={`User research ${i + 2}`} loading="lazy" style={{ display: "block", flex: "1 1 300px", minWidth: 0, width: "100%", borderRadius: 20 }} />
        ))}
      </div>
    </div>
  );
}
