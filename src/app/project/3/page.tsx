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
  "/BL-stills/BL-still-1.webp",
  "/BL-stills/BL-still-2.webp",
  "/BL-stills/BL-still-3.webp",
  "/BL-stills/BL-still-4.webp",
  "/BL-stills/BL-still-5.webp",
  "/BL-stills/BL-still-6.webp",
  "/BL-stills/BL-still-7.webp",
];

const SPLASH_BANNERS = [
  "/BL-app-1.webp",
  "/BL-app-2.webp",
  "/BL-app-3.webp",
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
      coverImage="/new covers/cover_L3.jpg"
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
        { title: "Project Plan", images: ["/BL-projectplan.webp"] },
        { title: "Team Brainstorm", images: ["/BL-teambrainstorm.webp"] },
        { title: "Storyboard & Wireframes", images: ["/BL-storyboard.webp"] },
        { title: "Bugbash", images: [{ src: "/BL-bugbash.webp", width: 700 }] },
        { title: "Retro", images: ["/BL-retro.webp"] },
      ]}
    />
  );
}
