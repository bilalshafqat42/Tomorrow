"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Slider from "@/components/ui/Slider";
import { slidesCommercial } from "@/data/commercial/slidesCommercial";
import { commercialNavLinks } from "@/data/commercial/commercialNavLinks";

import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";

const Interior = () => {
  // CORRECTED: Define variables needed for the Slider component, named logically
  const interiorSlides = slidesCommercial.interiors;
  const currentLang = "en"; // Defaulting to English
  console.log(slidesCommercial.interiors);

  const sidebarLinks = commercialNavLinks.left;
  const bottomLinks = commercialNavLinks.bottom;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={"Interiors"} />
      <LeftNavigation links={sidebarLinks} />
      <main className="flex-grow flex items-center justify-center">
        {/* Pass the extracted data to the Slider component */}
        <Slider
          slidesData={interiorSlides} // <-- Now using the correct variable name
          lang={currentLang}
          autoPlayDuration={8000} // Custom duration of 8 seconds
        />
      </main>
      <ProjectNavigation links={bottomLinks} />
    </div>
  );
};

export default Interior;
