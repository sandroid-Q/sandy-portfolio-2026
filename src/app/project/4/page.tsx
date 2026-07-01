import ProjectPageTemplate from "@/components/ProjectPageTemplate";

export default function Level4Page() {
  return (
    <ProjectPageTemplate
      floor="4"
      year="2024"
      name="Totally Beem"
      blurb="Beem’s 2024 Year in Review experience with a nostalgic twist"
      tags={["Mobile", "Web", "Project Management", "Product Strategy", "Animation"]}
      coverImage="/level-4-smaller.jpg"
      coverBg="#1B2E1E"
      lightCover
      darkPad
      role="Lead Designer"
      yearRange="2023–2024"
      platform="iOS · Android"
      overview="Totally Beem was a comprehensive rebrand and product overhaul of the Beem payments app. The project encompassed a new visual identity, updated design system, and end-to-end redesign of core user flows — bringing a refreshed, cohesive experience to millions of Australians splitting and sending money."
      sections={[
        { title: "Brand identity" },
        { title: "Design system" },
        { title: "Core flows" },
      ]}
    />
  );
}
