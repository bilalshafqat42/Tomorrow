"use client";

import React from "react";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

const Foot = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex justify-between items-center py-4 px-6 bg-[rgba(255,255,255,0.3)] backdrop-blur-[10px] shadow-md fixed bottom-0 left-0 right-0 z-30 ">
      <div className="back-to-projects">
        <Link
          href="/"
          className="text-[#004068] hover:text-[#EAC4A1] transition-colors duration-200 ml-10"
        >
          <MoveLeft className="text-lg" />
        </Link>
      </div>
      <div className="copyright-section text-lg md:text-base text-[#004068] mr-10">
        &copy; {currentYear} - TOMORROW WORLD GROUP
      </div>
    </div>
  );
};

export default Foot;
