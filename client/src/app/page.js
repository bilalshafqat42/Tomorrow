"use client";

import React from "react";
import TopBar from "@/components/layout/TopBar";
import Carousel from "@/components/ui/Carousel";
import { HOME_LINKS } from "@/data/home_links";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const HomePage = () => {
  const mainLogo = "/assets/images/tom-logo/blue-color-logo.svg";

  const router = useRouter();

  async function logout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch (err) {
      alert(err.message || "Logout failed");
    }
  }

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
      <button onClick={logout} style={{ padding: 12, marginTop: 12 }}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
