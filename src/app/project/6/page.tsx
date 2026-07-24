import ProjectPageTemplate from "@/components/ProjectPageTemplate";
import GalleryMedia from "@/components/gallery/GalleryMedia";
import Caption from "@/components/beem-beeps/Caption";
import ReminderFlowchart from "@/components/beem-beeps/ReminderFlowchart";
import PayeePayerCarousels from "@/components/beem-beeps/PayeePayerCarousels";
import PendingBanner from "@/components/beem-beeps/PendingBanner";
import ActivityFilters from "@/components/beem-beeps/ActivityFilters";
import UserResearch from "@/components/beem-beeps/UserResearch";
import { scaleRadius } from "@/lib/radius";

export default function Level6Page() {
  return (
    <ProjectPageTemplate
      floor="6"
      year="2026"
      name="Beem Beeps: Reminders"
      blurb="Highly requested new app feature development"
      tags={["Mobile", "User Research", "Product Strategy"]}
      coverImage="/new covers/cover_L6.jpg"
      coverPinRightFreezeW={675}
      coverBg="#1A0A2E"
      darkPad
      role="Lead Designer"
      yearRange="2026"
      platform="iOS · Android"
      overview="As a new feature drop, we addressed a highly requested user feature for manual reminders on the app. Through customer service feedback, team workshops and user research, I iterated designs to uplift pending transactions on the app, as well as integrate a reminder system that would be able to improve transaction completion yet remain non-intrusive with a positive sentiment."
      sections={[
        {
          title: "Beem Beeps",
          content: (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
              <Caption>Full Flow</Caption>
              <GalleryMedia
                src="/beem-beeps.mp4"
                alt="Beem Beeps full flow"
                style={{ maxWidth: 300, borderRadius: 44, margin: "0 auto", border: "1px solid var(--color-surface-secondary)", boxShadow: "var(--phone-shadow)" }}
              />
            </div>
          ),
        },
        {
          title: "How it works",
          content: (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 96, width: "100%" }}>
              <ReminderFlowchart />
              <PayeePayerCarousels />
            </div>
          ),
        },
        { title: "Pending Banner", content: <PendingBanner /> },
        { title: "New Activity Filters", content: <ActivityFilters /> },
        { title: "User Research", content: <UserResearch /> },
        {
          title: "Iterations & Discovery",
          content: (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(32px, 14vw, 144px)", width: "100%" }}>
              {["/beem beeps/iterations-1.png", "/beem beeps/iterations-2.png", "/beem beeps/iterations-3.png"].map((src, i) => (
                <GalleryMedia key={src} src={src} alt={`Iterations & discovery ${i + 1}`} style={{ borderRadius: scaleRadius(28) }} />
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}
