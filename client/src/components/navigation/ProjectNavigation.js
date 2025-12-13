// src/components/ProjectNavigation.js

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // 💡 Import Next.js Link
import { usePathname } from "next/navigation"; // 💡 Import Next.js hook for path
import {
  Home,
  MapPin,
  Layers,
  SquareStack,
  Video,
  ArrowLeftCircle,
} from "lucide-react";

// Map icon names to actual Lucide components for dynamic rendering
const iconMap = {
  Home,
  MapPin,
  Layers,
  SquareStack,
  Video,
  ArrowLeftCircle,
};

/**
 * Renders a fixed, responsive bottom navigation bar for project pages.
 *
 * @param {object} props
 * @param {Array<{label: string, path: string, iconName: string}>} props.links - Array of navigation link objects.
 */
const ProjectNavigation = ({ links = [] }) => {
  const pathname = usePathname() || ""; // 💡 Use the Next.js usePathname hook
  const [isMounted, setIsMounted] = useState(false);
  // Removed currentPath state as usePathname handles it

  // --- Initial Entrance Animation on Mount ---
  useEffect(() => {
    // Set mounted state after component loads to trigger CSS transition
    setIsMounted(true);
  }, []);

  // Calculate initial and final 'bottom' positions for the entrance animation
  const initialBottom = "-90px";
  const finalBottom = "0px";

  // Render nothing if no links are provided
  if (!links || links.length === 0) return null;

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 
                     w-full md:w-[80%] lg:w-[70%] h-[90px] 
                     bg-white/30 backdrop-blur-xl 
                     rounded-t-2xl shadow-2xl border-t border-white/40 
                     flex items-center justify-around px-2 sm:px-6 z-50
                     transition-all duration-700 ease-out`}
      style={{
        bottom: isMounted ? finalBottom : initialBottom,
      }}
    >
      {links.map((link) => {
        const IconComponent = iconMap[link.iconName];

        // 💡 Simplified Active link logic using usePathname
        const finalState =
          link.path === "/" ? pathname === "/" : pathname.startsWith(link.path);

        const activeClasses = "text-[#EAC4A1]";
        const inactiveClasses = "text-[#004068] hover:text-[#EAC4A1]";

        // 💡 Uses Next.js <Link> tag
        return (
          <Link
            key={link.label}
            href={link.path}
            className={`flex flex-col items-center 
                                   transition-all duration-300 transform hover:scale-110 active:scale-105
                                   font-semibold p-2 rounded-lg
                                   ${
                                     finalState
                                       ? activeClasses
                                       : inactiveClasses
                                   }`}
            aria-label={`Maps to ${link.label}`}
          >
            {IconComponent && (
              <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
            <span className="text-[10px] sm:text-[12px] mt-1 tracking-wider font-bold">
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProjectNavigation;
