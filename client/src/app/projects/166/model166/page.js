"use client";
import React from "react";
import TopBar from "@/components/layout/TopBar";
import Model from "@/components/three/Model";
import { project166NavLinks } from "@/data/166/project166NavLinks";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";

const Model166 = () => {
  const sidebarLinks = project166NavLinks.left;
  const bottomLinks = project166NavLinks.bottom;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title="Tomorrow 166 Model" />
      <LeftNavigation links={sidebarLinks} />
      <main className="flex-grow flex items-center justify-center">
        <Model
          modelPath="/166-v6.glb" // ✅ Correct direct path
          backgroundColor={0xffffff}
          cameraFov={75}
        />
      </main>
      <ProjectNavigation links={bottomLinks} />
    </div>
  );
};

export default Model166;
