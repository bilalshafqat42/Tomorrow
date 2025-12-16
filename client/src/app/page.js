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

  useEffect(() => {
    async function checkAuth() {
      try {
        await api("/api/auth/me"); // if cookie valid => OK
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
      <div className="absolute top-0 left-0 right-0 z-50">
        <TopBar title={"Tomorrow World Group"} />
      </div>

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
}
