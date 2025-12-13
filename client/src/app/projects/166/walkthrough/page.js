"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Slider from "@/components/ui/Slider";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";

import { project166NavLinks } from "@/data/166/project166NavLinks";

import Video from "@/components/ui/Video";

const Walkthrough166 = () => {
  const homePageContent = {
    modalVideo: "/assets/videos/walk.mp4",
    overlayImage: "/assets/images/166/interiors/int2.jpg",
    mainTitle: "Discover Our Vision",
    p1: "Our core mission is to innovate and deliver sustainable solutions globally.",
    p2: "Join us on a journey to build a brighter future for everyone.",
  };
  const sidebarLinks = project166NavLinks.left;
  const bottomLinks = project166NavLinks.bottom;
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={"Tomorrow 166 Walkthrough"} />
      <LeftNavigation links={sidebarLinks} />
      <main className="flex-grow flex items-center justify-center">
        <Video
          modalVideoUrl={homePageContent.modalVideo}
          overlayImageUrl={homePageContent.overlayImage}
          title={homePageContent.mainTitle}
          paragraph1={homePageContent.p1}
          paragraph2={homePageContent.p2}
        />
      </main>
      <ProjectNavigation links={bottomLinks} />
    </div>
  );
};

export default Walkthrough166;
