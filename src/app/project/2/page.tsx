import ProjectPageTemplate from "@/components/ProjectPageTemplate";

export default function Level2Page() {
  return (
    <ProjectPageTemplate
      floor="2"
      year="2022"
      name="Beem App"
      blurb="Animated stickers, brand alignment & more"
      tags={["Mobile", "Animation"]}
      coverImage="/level-2.png"
      coverBg="#1A1040"
      darkPad
      role="Senior Product Designer"
      yearRange="2021–2022"
      platform="iOS · Android"
      overview="Beem is Australia's peer-to-peer payments app, enabling users to split bills, send money, and request payments. This project covers core product design work across the payment flow, contacts experience, and onboarding — focused on reducing friction and building trust throughout the key user journeys."
      sections={[
        { title: "Payments flow" },
        { title: "Onboarding" },
        { title: "Contacts & requests" },
      ]}
    />
  );
}
