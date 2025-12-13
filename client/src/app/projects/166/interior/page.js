"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Slider from "@/components/ui/Slider";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";
import { slides166 } from "@/data/166/slides166";
// import { project166NavLinks } from "../data/166/project166NavLinks";
import { project166NavLinks } from "@/data/166/project166NavLinks";

const Interior166 = () => {
  // Define variables needed for the Slider component
  const exteriorSlides = slides166.interior;
  const currentLang = "en"; // Defaulting to English

  const sidebarLinks = project166NavLinks.left;
  const bottomLinks = project166NavLinks.bottom;

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopBar is guaranteed to exist in components/TopBar.jsx */}
      <TopBar title={"Tomorrow 166 Interiors"} />
      <LeftNavigation links={sidebarLinks} />
      <main className="flex-grow flex items-center justify-center">
        {/* Pass the extracted data to the Slider component */}
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

export default Interior166;
