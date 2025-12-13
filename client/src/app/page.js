"use client";

import React from "react";
import TopBar from "@/components/layout/TopBar";
import Carousel from "@/components/ui/Carousel";
import { HOME_LINKS } from "@/data/home_links";

const HomePage = () => {
  const mainLogo = "/assets/images/tom-logo/blue-color-logo.svg";

  return (
    <div className="min-h-screen w-screen overflow-hidden relative flex flex-col">
      {/* TopBar */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <TopBar title={"Tomorrow World Group"} />
      </div>

      {/* Centered Logo */}
      <div className="flex-grow flex items-center justify-center relative z-30 pt-20 pb-40 mt-[-200px]">
        <img
          src={mainLogo}
          className="w-[300px] md:w-[580px] h-auto transition-transform duration-500 hover:scale-105 rounded-3xl"
          alt="Tomorrow World Group"
        />
      </div>
      <div className="z-40">
        <Carousel slides={HOME_LINKS} />
      </div>
    </div>
  );
};

export default HomePage;
