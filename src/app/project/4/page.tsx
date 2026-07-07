import ProjectPageTemplate from "@/components/ProjectPageTemplate";
import MeebsonasGallery from "@/components/MeebsonasGallery";
import TotallyBeemGallery from "@/components/TotallyBeemGallery";

const TOTALLY_BEEM = [
  "/TB%20vids/TB-1.mp4",
  "/TB%20vids/TB-2.mp4",
  "/TB%20vids/TB-3.mp4",
  "/TB%20vids/TB-4.mp4",
  "/TB%20vids/TB-5.mp4",
  "/TB%20vids/TB-6.mp4",
];

const MEEBSONAS = [
  "/meebsonas/1-fetch.png",
  "/meebsonas/2-delulu.png",
  "/meebsonas/3-rizzler.png",
  "/meebsonas/4-sus.png",
  "/meebsonas/5-cutesy.png",
  "/meebsonas/6-brat.png",
  "/meebsonas/7-npc.png",
  "/meebsonas/8-yapper.png",
  "/meebsonas/9-clout.png",
];

export default function Level4Page() {
  return (
    <ProjectPageTemplate
      floor="4"
      year="2024"
      name="Totally Beem"
      blurb="Beem’s 2024 Year in Review experience with a nostalgic twist"
      tags={["Mobile", "Web", "Project Management", "Product Strategy", "Animation"]}
      coverImage="/level-4-smaller.jpg"
      coverBg="#1B2E1E"
      lightCover
      darkPad
      role="Lead Designer, Project Lead"
      yearRange="2024"
      platform="Web, mobile"
      overview="A rewind edition to Beem’s Year in Review project, taking on the look and feel of a 2000’s magazine. Rather than the usual collection of financial data points, the team opted for a fun, shareable persona (Meebsona) quiz for this year’s experience after testing from previous Year in Review project metrics."
      sections={[
        {
          title: "Totally Beem",
          content: <TotallyBeemGallery videos={TOTALLY_BEEM} />,
        },
        {
          title: "Meebsonas",
          content: <MeebsonasGallery images={MEEBSONAS} />,
          images: [
            { src: "/meebsona-mapping-sandyqi.png", width: 373, radius: 18 },
          ],
        },
        { title: "Project Timeline", images: ["/l4-timeline.png"] },
        { title: "Bug Bash", images: [{ src: "/l4-bugbash.png", width: 635 }] },
        { title: "Press", images: [{ src: "/l4-press.png", width: 490 }] },
      ]}
    />
  );
}
