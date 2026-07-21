import ProjectPageTemplate from "@/components/ProjectPageTemplate";

export default function Level5Page() {
  return (
    <ProjectPageTemplate
      floor="5"
      year="2025"
      name="AP+ Portals"
      blurb="Harmonising AP+'s developer, testing automation and role management experiences"
      tags={["Web", "Design system"]}
      focus={["Information Architecture", "Solution design", "Design System"]}
      coverImage="/new covers/cover_L5.png"
      coverPosition="left center"
      coverBg="#0D033C"
      darkPad
      role="Lead Designer"
      yearRange="2024–2025"
      platform="Web"
      overview="As part of the harmonisation of AP+'s schemes (BPAY, eftpos, NPP and more), a consolidated Developer's portal, Testing Automation Portal and Account Centre (for role management) were built as critical deliverables for the merge. As lead designer, a portals-specific design kit was also created in efforts to achieve design consistency and make the build process more efficient."
      sections={[
        { title: "Testing Portal", images: ["/TST-1.mp4", "/TST-2.mp4"] },
        { title: "User Centre", images: ["/UC-1.mp4"] },
        { title: "Developer's Portal", images: ["/DEVX-1.mp4"] },
        { title: "Design System", images: ["/design%20kit.png"] },
      ]}
    />
  );
}
