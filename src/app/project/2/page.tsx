import ProjectPageTemplate from "@/components/ProjectPageTemplate";
import BeemStickers from "@/components/BeemStickers";
import ReskinGallery from "@/components/ReskinGallery";
import GalleryMedia from "@/components/gallery/GalleryMedia";
import { scaleRadius } from "@/lib/radius";

export default function Level2Page() {
  return (
    <ProjectPageTemplate
      floor="2"
      year="2023"
      name="Beem App"
      blurb="Animated stickers, brand alignment & more"
      tags={["Mobile", "Animation"]}
      focus={["Mobile", "Animation", "Brand"]}
      coverImage="/new covers/cover_L2.png"
      coverPosition="20% bottom"
      coverBg="#1A1040"
      darkPad
      role="Senior Product & Visual Designer"
      yearRange="2023"
      platform="iOS · Android"
      overview="As a social, instant payment app, Beem stickers were designed to increase community engagement and improve user satisfaction. A re-skin and re-configuration of major screens was completed post a brand uplift. Respectively, a new colour, an accessible orange named ‘Bloody Oath’ was also selected after analysing the brand as a whole."
      sections={[
        { title: "Beem Stickers", content: <BeemStickers /> },
        { title: "Re-skin", content: <ReskinGallery /> },
        {
          title: "Design System Uplift",
          content: (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 72, width: "100%" }}>
              <GalleryMedia src="/beem-DS/beem-DS-1.png" alt="Design system uplift 1" style={{ width: 300, maxWidth: "100%", borderRadius: scaleRadius(20) }} />
              <GalleryMedia src="/beem-DS/beem-DS-2.png" alt="Design system uplift 2" style={{ borderRadius: scaleRadius(20) }} />
            </div>
          ),
        },
      ]}
    />
  );
}
