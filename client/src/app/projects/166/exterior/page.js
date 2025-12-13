"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Slider from "@/components/ui/Slider";
import LeftNavigation from "@/components/navigation/LeftNavigation";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";

import { slides166 } from "@/data/166/slides166";
import { project166NavLinks } from "@/data/166/project166NavLinks";

const Exterior166 = () => {
  const exteriorSlides = slides166.exterior;
  const currentLang = "en"; // Defaulting to English

  const sidebarLinks = project166NavLinks.left;
  const bottomLinks = project166NavLinks.bottom;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={"Tomorrow 166 Exteriors"} />
      <LeftNavigation links={sidebarLinks} />
      <main className="flex-grow flex items-center justify-center">
        <Slider
          slidesData={exteriorSlides}
          lang={currentLang}
          autoPlayDuration={8000} // Custom duration of 8 seconds
        />
      </main>
      <ProjectNavigation links={bottomLinks} />
    </div>
  );
};

export default Exterior166;
