// src/components/LeftNavigation.js

"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // 💡 Use Next.js hook for path
import Link from "next/link"; // 💡 Use Next.js Link for client-side navigation
import {
  Home,
  MapPin,
  Layers,
  SquareStack,
  Video,
  ArrowLeftCircle,
  Building,
  Sofa,
  Heart,
  PlaySquare,
  Box,
  ToggleLeft,
} from "lucide-react";

// Map of Lucide icons for easy access by name string
const iconMap = {
  Home,
  MapPin,
  Layers,
  SquareStack,
  Video,
  ArrowLeftCircle,
  Building,
  Sofa,
  Heart,
  PlaySquare,
  Box,
  ToggleLeft,
};

/**
 * Reusable Left Sidebar Navigation Component
 * @param {object} props
 * @param {Array<{label: string, path: string, iconName: string}>} props.links - Array of navigation link objects.
 * @param {string} props.className - Optional CSS classes to apply to the outermost container.
 * @returns {JSX.Element | null}
 */
const LeftNavigation = ({ links = [], className = "" }) => {
  const pathname = usePathname() || ""; // 💡 Use the Next.js usePathname hook
  const [collapsed, setCollapsed] = useState(false);

  // --- Constants for Styling ---
  const baseClasses =
    "flex flex-row gap-3 items-center rounded-xl p-3 transition-all duration-300 ease-in-out";
  const textClasses =
    "text-[14px] font-semibold tracking-wide uppercase whitespace-nowrap";

  const wideWidth = "280px";
  const narrowWidth = "100px";
  const itemWideWidth = "w-[220px]";
  const itemNarrowWidth = "w-[60px]";

  const toggleIconRotation = collapsed ? "rotate-180" : "rotate-0";

  // Render nothing if no links are provided
  if (!links || links.length === 0) return null;

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 transition-[left,width] duration-700 ease-out hidden lg:block ${className}`}
      style={{
        width: collapsed ? narrowWidth : wideWidth,
      }}
    >
      <nav
        className="flex flex-col items-start bg-white/70 backdrop-blur-xl 
                   rounded-r-3xl rounded-bl-3xl p-6 shadow-xl w-full"
      >
        {links.map((link) => {
          const IconComponent = iconMap[link.iconName];

          // 💡 Simplified Path Check Logic
          // Use Link's path (link.path) to determine active state.
          // Note: usePathname is preferred over window.location.pathname in Next.js
          // for better handling of client-side navigation updates.
          const finalState =
            link.path === "/"
              ? pathname === "/"
              : pathname.startsWith(link.path);

          const activeClasses = "bg-[#004068] text-white shadow-lg";
          const inactiveClasses =
            "text-[#004068] hover:bg-[#EAC4A1] hover:text-white";

          return (
            <Link // 💡 Changed <a> to Next.js <Link>
              key={link.label}
              href={link.path}
              className={`
                ${baseClasses} mb-4
                ${finalState ? activeClasses : inactiveClasses} 
                ${
                  collapsed
                    ? `${itemNarrowWidth} justify-center`
                    : itemWideWidth
                }
                cursor-pointer
              `}
              aria-current={finalState ? "page" : undefined}
              aria-label={`Maps to ${link.label}`}
            >
              {IconComponent ? (
                <IconComponent className="w-6 h-6 stroke-[1.8]" />
              ) : (
                <span className="w-6 h-6 stroke-[1.8] font-bold text-xs flex items-center justify-center">
                  ?
                </span>
              )}

              {!collapsed && <span className={textClasses}>{link.label}</span>}
            </Link>
          );
        })}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            ${baseClasses} 
            mt-2 
            bg-[#EAC4A1] text-white hover:bg-[#004068]
            ${collapsed ? `${itemNarrowWidth} justify-center` : itemWideWidth}
            cursor-pointer
          `}
          aria-expanded={collapsed}
          aria-controls="left-nav-menu"
          aria-label={collapsed ? "Expand Menu" : "Collapse Menu"}
        >
          <ToggleLeft
            className={`w-6 h-6 stroke-[1.8] transition-transform duration-300 ${toggleIconRotation}`}
          />
          {!collapsed && <span className={textClasses}>Toggle Menu</span>}
        </button>
      </nav>
    </div>
  );
};

export default LeftNavigation;
