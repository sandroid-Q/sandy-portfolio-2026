import ProjectPageTemplate from "@/components/ProjectPageTemplate";

export default function Level1Page() {
  return (
    <ProjectPageTemplate
      floor="1"
      year="2021"
      name="Moomoo: Power Launch"
      blurb="Launching moomoo's investment platform into the Australian market"
      tags={["Mobile", "Web", "Product design"]}
      coverBg="#2A1200"
      darkPad
      role="Product Designer"
      yearRange="2020–2021"
      platform="iOS · Android · Web"
      overview="Moomoo is a feature-rich investment platform by Futu Holdings. This project covers the end-to-end design work for moomoo's Australian market launch — including localisation of core trading flows, onboarding for Australian regulatory requirements, and adaptation of the design system for a new market audience."
      sections={[
        { title: "Onboarding & KYC" },
        { title: "Trading experience" },
        { title: "Market localisation" },
      ]}
    />
  );
}
