"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

/**
 * Enhanced Slider Component
 * Features:
 *  - Smooth autoplay with pause/play toggle
 *  - Touch + mouse drag navigation
 *  - Z-index layering (works above background video)
 *  - Mobile responsive layout
 */
const Slider = ({ slidesData = [], lang = "en", autoPlayDuration = 8000 }) => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  const progressRef = useRef(null);
  const intervalRef = useRef(null);
  const timerStartRef = useRef(Date.now());
  const startX = useRef(null);
  const endX = useRef(null);
  const isDragging = useRef(false);

  // Load slides data
  useEffect(() => {
    if (slidesData.length > 0) {
      setSlides(slidesData);
    }
  }, [slidesData]);

  // Retrieve content safely
  const getSlideContent = (slide, key, defaultLang = "en") => {
    const content = slide[key];
    if (typeof content === "object" && content && content[defaultLang]) {
      return content[defaultLang];
    }
    return String(content || "");
  };

  // Next / Previous slides
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    if (progressRef.current) progressRef.current.style.width = "0%";
    timerStartRef.current = Date.now();
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    if (progressRef.current) progressRef.current.style.width = "0%";
    timerStartRef.current = Date.now();
  }, [slides.length]);

  // Touch Events
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };
  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    endX.current = e.touches[0].clientX;
    setDragOffset(endX.current - startX.current);
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
    if (!startX.current || !endX.current) return setDragOffset(0);
    const distance = startX.current - endX.current;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    startX.current = endX.current = null;
    setDragOffset(0);
  };

  // Mouse Drag Events
  const handleMouseDown = (e) => {
    isDragging.current = true;
    setIsMouseDragging(true);
    startX.current = e.clientX;
    e.preventDefault();
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    endX.current = e.clientX;
    setDragOffset(endX.current - startX.current);
  };
  const handleMouseUp = () => {
    if (!isDragging.current || !startX.current || !endX.current) {
      isDragging.current = false;
      setIsMouseDragging(false);
      setDragOffset(0);
      return;
    }
    const distance = startX.current - endX.current;
    if (distance > 50) nextSlide();
    else if (distance < -50) prevSlide();
    isDragging.current = false;
    setIsMouseDragging(false);
    startX.current = endX.current = null;
    setDragOffset(0);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  // Autoplay animation
  useEffect(() => {
    if (!isPlaying || slides.length === 0 || autoPlayDuration <= 0) return;

    timerStartRef.current = Date.now();

    const animateProgress = () => {
      if (!progressRef.current) return;
      const elapsed = Date.now() - timerStartRef.current;
      const percent = Math.min((elapsed / autoPlayDuration) * 100, 100);
      progressRef.current.style.width = `${percent}%`;

      if (percent >= 100) nextSlide();
      intervalRef.current = requestAnimationFrame(animateProgress);
    };

    intervalRef.current = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(intervalRef.current);
  }, [autoPlayDuration, slides.length, current, nextSlide, isPlaying]);

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading slides...</p>
      </div>
    );
  }

  const totalTranslateX = `calc(-${current * 100}% + ${dragOffset}px)`;

  return (
    <div className="w-full h-screen flex items-center justify-end">
      <div
        className={`relative w-[80%] aspect-[20/9] overflow-hidden rounded-xl shadow-2xl mr-10 select-none transition-all ${
          isMouseDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        {/* Slide Track */}
        <div
          className="flex w-full h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(${totalTranslateX})` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="flex-shrink-0 w-full h-full relative">
              <img
                src={slide.image}
                alt={getSlideContent(slide, "title", lang)}
                draggable={false}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6 text-[#004068] max-w-lg bg-white/50 backdrop-blur-sm p-4 rounded-lg">
                <h2 className="text-[#004068] text-2xl md:text-3xl font-bold">
                  {getSlideContent(slide, "title", lang)}
                </h2>
                <p className="mt-1 md:mt-2 text-sm md:text-base">
                  {getSlideContent(slide, "description", lang)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3 z-30">
          {/* Prev */}
          <button
            onClick={prevSlide}
            className="p-3 rounded-md bg-white/60 text-[#00426B] shadow-md hover:bg-[#00426B] hover:text-white hover:scale-105 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className={`p-3 rounded-md shadow-md transition-all hover:scale-105 ${
              isPlaying
                ? "bg-[#00426B] text-white hover:bg-[#002b4f]"
                : "bg-white/60 text-[#00426B] hover:bg-[#00426B] hover:text-white"
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Next */}
          <button
            onClick={nextSlide}
            className="p-3 rounded-md bg-white/60 text-[#00426B] shadow-md hover:bg-[#00426B] hover:text-white hover:scale-105 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-900/30 z-20">
          <div
            ref={progressRef}
            className="h-full bg-[#004068] transition-none w-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
