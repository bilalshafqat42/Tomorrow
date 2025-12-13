"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Slider from "@/components/ui/Slider";
import { slides166 } from "@/data/166/slides166";
import { project166NavLinks } from "@/data/166/project166NavLinks";
import Video from "@/components/ui/Video";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";

const Walkthrough166 = () => {
  const homePageContent = {
    modalVideo: "/assets/images/166/video/166.mp4",
    overlayImage: "/assets/images/166/video/over.jpg",
    mainTitle: "Tomorrow 166: Where Architectural Precision Meets the Horizon",
    p1: "Welcome to Tomorrow 166, a sanctuary of bespoke living nestled within the stunning expanse of Dubai Islands. This low-density development redefines modern luxury by achieving architectural harmony with nature. The building’s fluid, curvilinear design is inspired by the biomechanical efficiency and gossamer wings of a dragonfly, blending organic fluidity with structural precision.",
    // p2: " Situated on Island A, Tomorrow 166 is a tranquil retreat that prioritizes space and unobstructed park views, offering an exclusive lifestyle that seamlessly connects you to the vibrant energy of Dubai and the serene beauty of the coast.",
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
          // paragraph2={homePageContent.p2}
        />
      </main>
      <ProjectNavigation links={bottomLinks} />
    </div>
  );
};

export default Walkthrough166;
