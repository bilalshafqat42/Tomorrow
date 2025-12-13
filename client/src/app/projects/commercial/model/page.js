"use client";

import React from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import { commercialNavLinks } from "@/data/commercial/commercialNavLinks";
import ProjectNavigation from "@/components/navigation/ProjectNavigation";
import LeftNavigation from "@/components/navigation/LeftNavigation";

// ✅ Lazy load the Model component (disables SSR)
const Model = dynamic(() => import("@/components/three/Model"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[70vh] text-[#004068] text-lg">
      Loading 3D Model...
    </div>
  ),
});

const Model3D = () => {
  const sidebarLinks = commercialNavLinks.left;
  const bottomLinks = commercialNavLinks.bottom;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 🔹 Top Navigation */}
      <TopBar title="3D Model" />

      {/* 🔹 Left Sidebar */}
      <LeftNavigation links={sidebarLinks} />

      {/* 🔹 Main 3D Canvas Area */}
      <main className="flex-grow flex items-center justify-center relative">
        {/* Render 3D Model only on client */}
        <Model
          modelPath="/com-v3.glb"
          backgroundColor={0xffffff}
          cameraFov={75}
        />
      </main>

      {/* 🔹 Bottom Navigation */}
      <ProjectNavigation links={bottomLinks} />
    </div>
  );
};

export default Model3D;
