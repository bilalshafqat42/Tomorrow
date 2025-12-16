"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Carousel from "@/components/ui/Carousel";
import { HOME_LINKS } from "@/data/home_links";
import { api } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const me = await api("/api/auth/me");
        setUser(me.user || null);
        setChecking(false);
      } catch (e) {
        router.replace("/login");
      }
    }
    checkAuth();
  }, [router]);

  async function logout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } catch (err) {
      alert(err.message || "Logout failed");
    }
  }

  if (checking) return null;

  const mainLogo = "/assets/images/tom-logo/blue-color-logo.svg";

  return (
    <div className="min-h-screen w-screen overflow-hidden relative flex flex-col">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/videos/bg-video.mp4" type="video/mp4" />
      </video>

      {/* BLUR + GLASS OVERLAY (same style as your sample page) */}
      <div className="absolute inset-0 z-10">
        {/* soft dark tint */}
        <div className="absolute inset-0 bg-black/25" />
        {/* glass blur */}
        <div className="absolute inset-0 backdrop-blur-md" />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <TopBar user={user} onLogout={logout} />
      </div>

      {/* Content */}
      <div className="relative z-30 flex-grow flex items-center justify-center pt-20 pb-40 mt-[-200px]">
        <img
          src={mainLogo}
          className="w-[300px] md:w-[580px] h-auto transition-transform duration-500 hover:scale-105 rounded-3xl"
          alt="Tomorrow World Group"
        />
      </div>

      <div className="relative z-40">
        <Carousel slides={HOME_LINKS} />
      </div>
    </div>
  );
}
