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
      role="Lead Designer, Project Lead"
      yearRange="2023"
      platform="Web · iOS · Android"
      overview="Beemlantis is Beem’s interactive, gamified Year in Review experience, created to increase community engagement and brand awareness & sentiment. The mobile and desktop experience enable users to choose a ship and dive underwater, visiting personalised data points (in relation to their Beem usage). Large consideration is always placed on data privacy and sentiments surrounding financial data."
      sections={[
        { title: "Foundations" },
        { title: "Components" },
        { title: "Documentation" },
      ]}
    />
  );
}
