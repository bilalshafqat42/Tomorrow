// src/components/TopBar.js

"use client";
import React from "react";
import Link from "next/link";

/**
 * Renders a fixed, sticky top bar with project title and optional content.
 * @param {object} props
 * @param {string} props.title - The title text displayed on the left, typically a project name.
 * @param {JSX.Element} [props.rightContent] - Optional content to render on the right (defaults to the logo).
 */
function TopBar({ title, rightContent }) {
  const logoUrl = "/assets/images/tom-logo/horizontal-logo.svg";

  // Note: Removed useState and useEffect for animation.
  // We now rely on simple CSS transitions or tailwind classes.

  return (
    <header
      className={`
        fixed top-0 left-1/2 -translate-x-1/2 
        w-[90%] max-w-7xl h-[90px]
        bg-white/60 backdrop-blur-xl shadow-lg
        rounded-b-2xl flex items-center justify-between 
        px-6 md:px-12 z-50
        
        // Simple slide-down effect (assuming you have a 'duration' in your Tailwind config)
        transition-all duration-700 ease-out
      `}
    >
      {/* Title / Back Link */}
      <h1 className="font-heading text-xl md:text-2xl font-semibold tracking-wide uppercase">
        <Link
          href="/"
          className="text-[#004068] hover:text-[#EAC4A1] transition-colors duration-300"
          aria-label="Go to Home"
        >
          {title}
        </Link>
      </h1>

      {/* Right Content / Logo */}
      {rightContent ? (
        rightContent
      ) : (
        <Link href="/">
          <img
            src={logoUrl}
            className="w-[180px] md:w-[220px] h-[40px] transition-transform duration-300 hover:scale-105"
            alt="Tomorrow World Group Logo"
          />
        </Link>
      )}
    </header>
  );
}

export default TopBar;
