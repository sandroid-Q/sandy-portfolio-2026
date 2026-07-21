import ProjectPageTemplate from "@/components/ProjectPageTemplate";
import MediaGallery from "@/components/MediaGallery";
import WatchButton from "@/components/WatchButton";

// Plain img (server component, no interactivity); lazy so below-the-fold
// section images aren't eagerly preloaded.
function Img({ src, radius = 26 }: { src: string; radius?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="lazy" style={{ width: "100%", height: "auto", display: "block", borderRadius: radius }} />;
}

// Two side-by-side that collapse to one column on narrow screens.
const pairRow = { width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 } as const;

export default function Level1Page() {
  return (
    <ProjectPageTemplate
      floor="1"
      year="2022"
      name="Moomoo: Power Launch"
      blurb="Landing pages, marketing assets & brand strategy for the trading platforms’ power launch in Sydney"
      tags={["Web", "Digital Design", "OOH Design", "Brand Direction"]}
      coverImage="/new covers/cover_L1.jpg"
      coverBg="#2A1200"
      darkPad
      role="Senior Visual & Product Designer"
      yearRange="2022"
      platform="iOS · Android · Web"
      collaborators="Cocogun, REBORN Media Agency"
      overviewBlocks={[
        {
          heading: "Power Launch",
          body: "Moomoo, an all-in-one trading platform and app launched in 2022 in Australia through an extensive ATL and BTL campaign. With the competitive advantage being professional analytical tools aimed at helping traders - beginner to intermediate, the campaign focuses on a saavy, ahead-of-the-curve and personable trading experience to appeal to switchers and new traders.",
        },
        {
          heading: "Soft Launch",
          body: "BTL marketing was executed for a soft launch prior to Moomoo’s power launch which included paid media, landing pages, organic socials and radio ads.",
        },
      ]}
      sections={[
        {
          title: "Landing pages",
          content: (
            <MediaGallery
              items={["/l1-lp-1.png", "/l1-lp-2.png", "/l1-lp-3.png", "/l1-lp-4.png", "/l1-lp-5.png"]}
              rows={[5]}
              columns={3}
              clip="inset(0 round 12px)"
              // Carousel: images 1 & 5 set the baseline height; crop 2 & 3 from the
              // bottom to match; leave 4 (the short one) at its natural size.
              carouselCrops={[
                null,
                { aspectRatio: "1080 / 2640", objectPosition: "top" },
                { aspectRatio: "1080 / 2640", objectPosition: "top" },
                null,
                null,
              ]}
              label="Landing page"
            />
          ),
          images: ["/l1-lp-big.png"],
        },
        {
          title: "ATL Designs",
          content: (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={pairRow}>
                <Img src="/l1-atl-1.png" />
                <Img src="/l1-atl-2.png" />
              </div>
              <Img src="/l1-atl-full-1.png" />
              <Img src="/l1-atl-full-2.png" />
              <div style={pairRow}>
                <Img src="/l1-atl-3.png" />
                <Img src="/l1-atl-4.png" />
              </div>
            </div>
          ),
        },
        {
          title: "TVC",
          content: <WatchButton href="https://www.youtube.com/watch?v=NywqSJLDPBY" label="Watch TVC" />,
        },
        {
          title: "Digital Designs",
          images: ["/l1-dd-1.png", "/l1-dd-2.png"],
        },
      ]}
    />
  );
}
