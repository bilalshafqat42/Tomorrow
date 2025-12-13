"use client";
import React, { useRef, useState } from "react";

/**
 * A highly reusable, horizontal scrolling carousel component.
 *
 * @param {object} props
 * @param {Array<{id: number, title: string, pageURL: string, imageURL: string}>} props.slides - The array of data objects to display in the carousel.
 */
export default function Carousel({ slides }) {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Use a ref to track if a substantial drag action was performed
  const draggedRef = useRef(false);

  // Check if slides data is provided and not empty
  if (!slides || slides.length === 0) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-white/60 backdrop-blur-xl shadow-lg py-5 px-6 text-center text-gray-600">
        No carousel items available.
      </div>
    );
  }

  const startDrag = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    // Reset drag flag at the start of every click/touch
    draggedRef.current = false;

    // Use touch pageX if available, otherwise use mouse pageX
    setStartX(e.pageX || e.touches[0].pageX);
    setScrollLeft(carouselRef.current.scrollLeft);

    // Prevent default to disable image dragging in some browsers
    if (e.type === "mousedown") {
      e.preventDefault();
    }
  };

  const onDrag = (e) => {
    if (!isDragging) return;

    // Use touch pageX if available, otherwise use mouse pageX
    const x = e.pageX || e.touches[0].pageX;

    // Removed the 1.5 multiplier for a smoother, 1:1 feel
    const walk = x - startX;

    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }

    // If movement is detected, set the dragged flag
    if (Math.abs(walk) > 5) {
      draggedRef.current = true;
    }

    // Prevent default touch behavior (e.g., scrolling the whole page vertically)
    if (e.type !== "mousemove") {
      e.preventDefault();
    }
  };

  const stopDrag = () => setIsDragging(false);

  // New function to prevent link navigation after a drag action
  const handleLinkClick = (e) => {
    // If a drag was performed, prevent the link's default navigation
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false; // Reset flag
      return false;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/60 backdrop-blur-xl shadow-lg py-5 pl-3 animate-rise-up rounded-t-3xl">
      <div
        ref={carouselRef}
        className="flex gap-8 overflow-x-scroll no-scrollbar cursor-grab active:cursor-grabbing select-none p-4"
        onMouseDown={startDrag}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onMouseMove={onDrag}
        onTouchStart={startDrag}
        onTouchEnd={stopDrag}
        onTouchMove={onDrag}
      >
        {slides.map((item) => (
          <a
            key={item.id}
            href={item.pageURL}
            // Added onClick handler to prevent navigation if a drag occurred
            onClick={handleLinkClick}
            className="flex-shrink-0 rounded-2xl overflow-hidden relative group transition-all duration-300 transform hover:shadow-xl hover:ring-4 ring-[#004068]/90"
            style={{
              width: "calc((100% / 3.5) - 1rem)", // Base width (Desktop: 3.5 items)
            }}
          >
            {/* Aspect Ratio Wrapper (16:9 = 9/16 = 56.25% padding-bottom) */}
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }} // Enforce 16:9 ratio
            >
              <img
                src={item.imageURL}
                alt={item.title}
                // Image fills the 16:9 aspect ratio container
                className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Dimming/Hover Overlay (Covers the 16:9 area) */}
            <div className="absolute inset-0 bg-[#000]/40 group-hover:bg-black/10 transition-colors z-10"></div>

            {/* Text and Gradient Overlay (On top of dimming layer, aligns text to bottom) */}
            <div className="absolute inset-0 flex items-end w-full bg-gradient-to-t from-[#004068]/10 to-transparent p-6 text-white text-xl font-semibold uppercase tracking-wider z-20 text-shadow-md">
              {item.title}
            </div>
          </a>
        ))}
      </div>

      <style jsx>{`
        /* Responsive item widths */
        /* Targets up to 1024px (iPad portrait/landscape) for 2.5 items */
        @media (max-width: 1024px) {
          a[style*="width: calc((100% / 3.5)"] {
            /* Ensures 2.5 items are visible */
            width: calc((100% / 2.5) - 1rem) !important;
          }
        }

        /* Targets smaller screens (e.g., mobile landscape) for 1.5 items */
        @media (max-width: 768px) {
          a[style*="width: calc((100% / 3.5)"] {
            width: calc((100% / 1.5) - 1rem) !important;
          }
        }

        /* Hide scrollbar */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Custom animation for initial appearance */
        @keyframes rise-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-rise-up {
          animation: rise-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}
