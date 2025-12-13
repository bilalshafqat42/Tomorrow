"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Foot from "@/components/layout/Foot";
import Video from "@/components/ui/Video";

import { project166NavLinks } from "@/data/166/project166NavLinks";

const Intro = () => {
  const homePageContent = {
    modalVideo: "/assets/videos/own-intro-video.mp4",
    overlayImage: "assets/videos/own-intro-pic.jpg",
    mainTitle: "Tomorrow World: Building the Future of Dubai's Luxury Skyline",
    p1: "Discover the vision behind Tomorrow World Real Estate Development LLC. Our company owner shares the commitment to architectural innovation, precision engineering, and creating landmark properties—like Tomorrow 166—that contribute to Dubai’s status as a global hub for luxury and visionary design. We are dedicated to delivering not just homes, but enduring assets and exceptional lifestyles.",
  };
  const sidebarLinks = project166NavLinks.left;

  return (
    <div className="min-h-screen  flex flex-col">
      <TopBar title={"Tomorrow's INTRODUCTION"} />
      <main className="flex-grow flex items-center justify-center">
        <Video
          modalVideoUrl={homePageContent.modalVideo}
          overlayImageUrl={homePageContent.overlayImage}
          title={homePageContent.mainTitle}
          paragraph1={homePageContent.p1}
          paragraph2={homePageContent.p2}
        />
      </main>
      <Foot />
    </div>
  );
};

export default Intro;
