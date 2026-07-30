/**
 * "User research" section: a wide research screenshot above two supporting
 * screenshots that sit side-by-side and stack on narrow screens.
 */
import { scaleRadius } from "@/lib/radius";
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function UserResearch() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
      {/* Primary screenshot */}
      <div style={{ width: 790, maxWidth: "100%" }}>
        { }
        <OptimizedImage src="/beem beeps/research-1.webp" alt="User research findings" sizes="(max-width: 800px) 100vw, 790px" style={{ display: "block", width: "100%", borderRadius: scaleRadius(20) }} />
      </div>
      {/* Supporting screenshots */}
      <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 32 }}>
        {["/beem beeps/research-2.webp", "/beem beeps/research-3.webp"].map((src, i) => (
           
          <OptimizedImage key={src} src={src} alt={`User research ${i + 2}`} sizes="(max-width: 700px) 100vw, 400px" style={{ display: "block", flex: "1 1 300px", minWidth: 0, width: "100%", borderRadius: scaleRadius(20) }} />
        ))}
      </div>
    </div>
  );
}
