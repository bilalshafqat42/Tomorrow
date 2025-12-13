"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Video from "@/components/ui/Video";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";
import { commercialNavLinks } from "@/data/commercial/commercialNavLinks";

const Walkthrough = () => {
  const homePageContent = {
    modalVideo: "/assets/images/commercial/intro/intro.mp4",
    overlayImage: "/assets/images/commercial/tom166.jpg",
    mainTitle: "Discover Our Vision",
    p1: "Our core mission is to innovate and deliver sustainable solutions globally.",
    p2: "Join us on a journey to build a brighter future for everyone.",
  };
  const sidebarLinks = commercialNavLinks.left;
  const bottomLinks = commercialNavLinks.bottom;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={"Intro Video"} />
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

export default Walkthrough;
