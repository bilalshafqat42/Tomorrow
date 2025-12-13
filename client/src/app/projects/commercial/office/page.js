"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Slider from "@/components/ui/Slider";
import { slidesCommercial } from "@/data/commercial/slidesCommercial";
import { commercialNavLinks } from "@/data/commercial/commercialNavLinks";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";

const Office = () => {
  // Define variables needed for the Slider component
  const exteriorSlides = slidesCommercial.office;
  const currentLang = "en"; // Defaulting to English

  const sidebarLinks = commercialNavLinks.left;
  const bottomLinks = commercialNavLinks.bottom;

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopBar is guaranteed to exist in components/TopBar.jsx */}
      <TopBar title={"Office"} />
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

export default Office;
