"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const mainLogo = "/assets/images/tom-logo/blue-color-logo.svg";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      router.replace("/");
      router.refresh();
    } catch (e) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

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

      {/* BLUR + GLASS OVERLAY */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 backdrop-blur-md" />
      </div>

      {/* Content */}
      <div className="relative z-30 flex-grow flex items-center justify-center px-6 pt-28 pb-16">
        <div className="w-full max-w-[440px]">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={mainLogo}
              className="w-[240px] md:w-[320px] h-auto transition-transform duration-500 hover:scale-105 rounded-3xl"
              alt="Tomorrow World Group"
            />
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-6 md:p-7">
            <div className="mb-4 text-center">
              <h1 className="text-white text-2xl font-semibold">
                Welcome Back
              </h1>
              <p className="text-white/70 text-sm mt-1">Login to continue</p>
            </div>

            {err ? (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                {err}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="text-white/80 text-sm">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bilal@test.com"
                  type="email"
                  required
                  className="
                    mt-2 w-full rounded-xl px-4 py-3
                    bg-white/90 text-slate-900
                    border border-white/40
                    outline-none
                    focus:ring-2 focus:ring-[#EAC4A1]/70
                  "
                />
              </div>

              <div>
                <label className="text-white/80 text-sm">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                  className="
                    mt-2 w-full rounded-xl px-4 py-3
                    bg-white/90 text-slate-900
                    border border-white/40
                    outline-none
                    focus:ring-2 focus:ring-[#EAC4A1]/70
                  "
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full mt-2 rounded-xl px-4 py-3
                  bg-[#EAC4A1] text-[#0b4a66] font-bold
                  hover:opacity-95 active:opacity-90
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition
                "
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <div className="flex items-center justify-between pt-2 text-sm">
                <div className="text-white/70">Don&apos;t have an account?</div>
                <Link
                  href="/register"
                  className="text-[#EAC4A1] font-semibold hover:underline"
                >
                  Register
                </Link>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/"
                  className="text-white/60 text-xs hover:underline"
                >
                  Back to Home
                </Link>
              </div>
            </form>
          </div>

          {/* Small footer */}
          <div className="text-center mt-5 text-white/40 text-xs">
            Tomorrow World Group
          </div>
        </div>
      </div>
    </div>
  );
}
