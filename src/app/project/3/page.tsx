import ProjectPageTemplate from "@/components/ProjectPageTemplate";

export default function Level3Page() {
  return (
    <ProjectPageTemplate
      floor="3"
      year="2023"
      name="Beemlantis"
      blurb="Beem’s 2023 gamified Year in Review experience with an underwater theme"
      tags={["Mobile", "Web", "Project Management", "Animation"]}
      coverImage="/level-3-smaller.jpg"
      coverBg="#0A1F2E"
      lightCover
      darkPad
      role="Lead Designer"
      yearRange="2022–2023"
      platform="Web · iOS · Android"
      overview="Beemlantis is Beem's internal design system — a unified component library and token set spanning web and mobile platforms. Built to accelerate design and development velocity across the org, it established a single source of truth for colour, typography, spacing, and interaction patterns used across all Beem products."
      sections={[
        { title: "Foundations" },
        { title: "Components" },
        { title: "Documentation" },
      ]}
    />
  );
}
