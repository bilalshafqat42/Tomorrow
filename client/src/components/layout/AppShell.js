"use client";
import React from "react";

const AppShell = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-[10] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50 absolute inset-0 z-0"
        >
          <source src="/assets/videos/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#004068]/20 backdrop-blur-md z-10"></div>
      </div>

      {/* Page Content */}
      <div className="flex flex-1 overflow-hidden relative z-20 backdrop-blur-md">
        <main className="flex-1 p-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
