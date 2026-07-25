import ProjectPageTemplate from "@/components/ProjectPageTemplate";
import MediaGallery from "@/components/MediaGallery";

const TOTALLY_BEEM = [
  "/TB%20vids/TB-1.mp4",
  "/TB%20vids/TB-2.mp4",
  "/TB%20vids/TB-3.mp4",
  "/TB%20vids/TB-4.mp4",
  "/TB%20vids/TB-5.mp4",
  "/TB%20vids/TB-6.mp4",
];

const MEEBSONAS = [
  "/meebsonas/1-fetch.webp",
  "/meebsonas/2-delulu.webp",
  "/meebsonas/3-rizzler.webp",
  "/meebsonas/4-sus.webp",
  "/meebsonas/5-cutesy.webp",
  "/meebsonas/6-brat.webp",
  "/meebsonas/7-npc.webp",
  "/meebsonas/8-yapper.webp",
  "/meebsonas/9-clout.webp",
];

export default function Level4Page() {
  return (
    <ProjectPageTemplate
      floor="4"
      year="2024"
      name="Totally Beem"
      blurb="Beem’s 2024 Year in Review experience with a nostalgic twist"
      tags={["Mobile", "Web", "Project Management", "Product Strategy", "Animation"]}
      coverImage="/new covers/cover_L4.jpg"
      coverShiftLeft
      coverBg="#1B2E1E"
      lightCover
      darkPad
      role="Lead Designer, Project Lead"
      yearRange="2024"
      platform="Web, mobile"
      designTeam="Corbin Nash, Bridie Allan, Bennett Kowald, Kalyani Jegendran"
      overview="A rewind edition to Beem’s Year in Review project, taking on the look and feel of a 2000’s magazine. Rather than the usual collection of financial data points, the team opted for a fun, shareable persona (Meebsona) quiz for this year’s experience after testing from previous Year in Review project metrics."
      sections={[
        {
          title: "Totally Beem",
          content: <MediaGallery items={TOTALLY_BEEM} label="Totally Beem video" clip="inset(0.99% 1.4% round 16.5px)" aspectRatio="540 / 960" />,
        },
        {
          title: "Beemsona",
          content: <MediaGallery items={MEEBSONAS} label="Beemsona" aspectRatio="750 / 1337" rows={[5, 4]} />,
          images: [
            { src: "/meebsona-mapping-sandyqi.webp", width: 373, radius: 18 },
          ],
        },
        { title: "Project Timeline", images: ["/l4-timeline.webp"] },
        { title: "Bug Bash", images: [{ src: "/l4-bugbash.webp", width: 635 }] },
        { title: "Press", images: [{ src: "/l4-press.webp", width: 490 }] },
      ]}
    />
  );
}
