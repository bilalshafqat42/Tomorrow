"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import { slides166 } from "@/data/166/slides166";
import Model from "@/components/three/Model";
import { project166NavLinks } from "@/data/166/project166NavLinks";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";

const Galaxy = () => {
  const sidebarLinks = project166NavLinks.left;
  const bottomLinks = project166NavLinks.bottom;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title={"Tomorrow 166 Galaxy"} />
      <LeftNavigation links={sidebarLinks} />
      <main className="flex-grow flex items-center justify-center">
        <Model
          modelPath="/galaxy.glb"
                    // modelPath="/166-v6.glb" // ✅ Correct direct path

          backgroundColor={0xffffff}
          cameraFov={75}
        />
      </main>
      <ProjectNavigation links={bottomLinks} />
    </div>
  );
};

export default Galaxy;
