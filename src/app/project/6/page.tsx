import ProjectPageTemplate from "@/components/ProjectPageTemplate";

export default function Level6Page() {
  return (
    <ProjectPageTemplate
      floor="6"
      year="2025"
      name="AP+ Portals"
      blurb="Harmonising AP+'s developer, testing automation and role management experiences"
      tags={["Web", "Design system"]}
      coverBg="#0D033C"
      role="Lead Designer"
      yearRange="2024–2025"
      platform="Web"
      overview="As part of the harmonisation of AP+'s schemes (BPAY, eftpos, NPP and more), a consolidated Developer's portal, Testing Automation Portal and Account Centre (for role management) were built as critical deliverables for the merge. As lead designer, a portals-specific design kit was also created in efforts to achieve design consistency and make the build process more efficient."
      sections={[
        { title: "Testing Portal" },
        { title: "Account Centre" },
        { title: "Developer's Portal" },
        { title: "Design Kit" },
      ]}
    />
  );
}
