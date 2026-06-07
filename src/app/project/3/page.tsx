import ProjectPageTemplate from "@/components/ProjectPageTemplate";

export default function Level3Page() {
  return (
    <ProjectPageTemplate
      floor="3"
      year="2023"
      name="Beemlantis"
      blurb="Building Beem's internal design system and component library from the ground up"
      tags={["Design system", "Web", "Mobile"]}
      coverBg="#0A1F2E"
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
