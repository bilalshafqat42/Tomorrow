"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Foot from "@/components/layout/Foot";
import Video from "@/components/ui/Video";
import { project166NavLinks } from "@/data/166/project166NavLinks";

const ExperienceCenter = () => {
  const homePageContent = {
    modalVideo: "/assets/videos/experience.mp4",
    overlayImage: "/assets/videos/experince-overlay.jpg",
    mainTitle: "The Tomorrow World Experience Center: Visualize Your Future",
    p1: "Step inside our Experience Center—the ultimate gateway to Tomorrow 166 and our visionary developments. Engage your senses as you explore detailed architectural models, consult with our specialists, and enjoy personalized hospitality, including bespoke barista coffee and a selection of premium refreshments. This is more than a sales visit; it’s your exclusive first look at the future of luxury living on Dubai Islands.",
  };
  const sidebarLinks = project166NavLinks.left;

  return (
    <div className="min-h-screen  flex flex-col">
      <TopBar title={"Tomorrow Experience Center"} />
      <main className="flex-grow flex items-center justify-center">
        <Video
          modalVideoUrl={homePageContent.modalVideo}
          overlayImageUrl={homePageContent.overlayImage}
          title={homePageContent.mainTitle}
          paragraph1={homePageContent.p1}
        />
      </main>
      <Foot />
    </div>
  );
};

export default ExperienceCenter;
