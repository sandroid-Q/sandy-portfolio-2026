"use client";

import { useState } from "react";
import ProjectPageTemplate from "@/components/ProjectPageTemplate";
import MediaGallery from "@/components/MediaGallery";
import VideoSoundToggle from "@/components/VideoSoundToggle";

const BEEMLANTIS = [
  "/BL-vids/BL-1-audio.mp4",
  "/BL-vids/BL-2.mp4",
  "/BL-vids/BL-3.mp4",
  "/BL-vids/BL-4.mp4",
  "/BL-vids/BL-5.mp4",
  "/BL-vids/BL-6.mp4",
  "/BL-vids/BL-7.mp4",
];

const STILLS = [
  "/BL-stills/BL-still-1.png",
  "/BL-stills/BL-still-2.png",
  "/BL-stills/BL-still-3.png",
  "/BL-stills/BL-still-4.png",
  "/BL-stills/BL-still-5.png",
  "/BL-stills/BL-still-6.png",
  "/BL-stills/BL-still-7.png",
];

const SPLASH_BANNERS = [
  "/BL-app-1.png",
  "/BL-app-2.png",
  "/BL-app-3.png",
];

export default function Level3Page() {
  const [videoMuted, setVideoMuted] = useState(false);
  return (
    <ProjectPageTemplate
      floor="3"
      year="2023"
      name="Beemlantis"
      blurb="Beem’s 2023 gamified Year in Review experience with an underwater theme"
      tags={["Mobile", "Web", "Project Management", "Animation"]}
      coverImage="/level-3-smaller.jpg"
      coverPosition="right center"
      coverBg="#0A1F2E"
      lightCover
      darkPad
      role="Lead Designer, Project Lead"
      yearRange="2023"
      platform="Web · iOS · Android"
      designTeam="Corbin Nash, Ariana Boydell"
      overview="Beemlantis is Beem’s interactive, gamified Year in Review experience, created to increase community engagement and brand awareness & sentiment. The mobile and desktop experience enable users to choose a ship and dive underwater, visiting personalised data points (in relation to their Beem usage). Large consideration is always placed on data privacy and sentiments surrounding financial data."
      sections={[
        {
          title: "Beemlantis",
          titleAccessory: <VideoSoundToggle muted={videoMuted} onToggle={() => setVideoMuted((m) => !m)} />,
          content: <MediaGallery items={BEEMLANTIS} label="Beemlantis video" clip="inset(0.99% 1.4% round 16.5px)" aspectRatio="540 / 960" soundIndex={0} soundMuted={videoMuted} />,
        },
        {
          title: "Stills",
          content: <MediaGallery items={STILLS} label="Still" aspectRatio="750 / 1337" columns={4} rows={[5, 2]} />,
        },
        {
          title: "Splash & Banners",
          content: <MediaGallery items={SPLASH_BANNERS} label="Splash & banner" columns={3} mobileLayout="stack" />,
        },
        { title: "Project Plan", images: ["/BL-projectplan.png"] },
        { title: "Team Brainstorm", images: ["/BL-teambrainstorm.png"] },
        { title: "Storyboard & Wireframes", images: ["/BL-storyboard.png"] },
        { title: "Bugbash", images: [{ src: "/BL-bugbash.png", width: 700 }] },
        { title: "Retro", images: ["/BL-retro.png"] },
      ]}
    />
  );
}
