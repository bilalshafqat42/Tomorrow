"use client";
import React, { useState, useRef } from "react";
import { Play, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
// import TopBar from "../topBar/TopBar"; // adjust path if needed

/**
 * Reusable Video Section Component for Next.js
 *
 * Props:
 * @param {string} backgroundVideoUrl - Background looping video URL.
 * @param {string} modalVideoUrl - Video URL played inside modal.
 * @param {string} overlayImageUrl - Overlay image shown before video plays.
 * @param {string} title - Heading text.
 * @param {string} paragraph1 - First paragraph.
 * @param {string} paragraph2 - Second paragraph.
 * @param {string} backLink - Link for back button.
 * @param {string} footerText - Footer copyright text.
 * @param {boolean} showTopBar - Toggle to show or hide TopBar.
 * @param {boolean} showFooter - Toggle to show or hide footer.
 */
const Video = ({
  backgroundVideoUrl = "/videos/bg-video.mp4",
  modalVideoUrl = "/videos/intro-video.mp4",
  overlayImageUrl = "/images/intro-overlay.jpg",
  title = "Welcome to Tomorrow World!",
  paragraph1 = "Explore the future of residential living with cutting-edge design and unparalleled amenities.",
  // paragraph2 = "We combine innovation, sustainability, and luxury to redefine modern living.",
  backLink = "/",
  footerText = "© 2025 - TOMORROW WORLD",
  showTopBar = true,
  showFooter = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const bgVideoRef = useRef(null);
  const modalVideoRef = useRef(null);

  const openModal = () => {
    if (bgVideoRef.current) bgVideoRef.current.pause();
    setIsClosing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    if (modalVideoRef.current) modalVideoRef.current.pause();

    setTimeout(() => {
      setIsModalOpen(false);
      if (bgVideoRef.current) bgVideoRef.current.play().catch(() => {});
    }, 500);
  };

  return (
    <section className="relative flex flex-col min-h-screen w-full">
      {/* Overlay Blur */}
      <div className="absolute inset-0 z-10"></div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-1 flex-col md:flex-row p-6 md:p-10">
        {/* Left Column - Text */}
        <div className="w-full md:w-2/5 flex items-center justify-center md:pr-10 pb-8 md:pb-0">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl text-[#191919] font-bold mb-4">
              {title}
            </h2>
            <p className="text-[#191919] leading-relaxed mb-4">{paragraph1}</p>
            {/* <p className="text-[#191919] leading-relaxed">{paragraph2}</p> */}
          </div>
        </div>

        {/* Right Column - Video Overlay */}
        <div className="w-full md:w-3/5 flex items-center justify-center">
          <div className="w-full aspect-video relative rounded-lg shadow-lg overflow-hidden group">
            <img
              src={overlayImageUrl}
              alt="Video Overlay"
              className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
              onClick={openModal}
            />
            <div
              className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 group-hover:bg-black/40 transition-colors cursor-pointer"
              onClick={openModal}
            >
              <Play
                className="w-20 h-20 text-white opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300"
                aria-label="Play Video"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Optional Footer */}
      {/* {showFooter && (
        <div className="flex justify-between items-center py-4 px-6 bg-white/50 backdrop-blur-md shadow-md fixed bottom-0 left-0 right-0 z-30">
          <Link
            href={backLink}
            className="text-[#004068] hover:text-[#EAC4A1] transition-colors duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="text-lg" /> Back
          </Link>
          <div className="text-sm md:text-base text-[#004068]">
            {footerText}
          </div>
        </div>
      )} */}

      {/* Modal Video */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closeModal}
          />

          {/* Video Container */}
          <div
            className={`relative w-[90vw] md:w-[70%] aspect-video bg-black rounded-xl shadow-2xl z-[70]
                        transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                        ${
                          isClosing
                            ? "opacity-0 translate-y-32 scale-75"
                            : "opacity-100 translate-y-0 scale-100"
                        }`}
          >
            <video
              ref={modalVideoRef}
              src={modalVideoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-white p-3 hover:bg-black/40 rounded-full transition"
              aria-label="Close Video"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Video;
