"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";

export default function TopBar({ user, onLogout }) {
  const logoUrl = "/assets/images/tom-logo/horizontal-logo.svg";
  const [open, setOpen] = useState(false);

  const initials = useMemo(() => {
    const name = user?.name || "User";
    const parts = name.trim().split(" ").filter(Boolean);
    const first = parts[0]?.[0] || "U";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [user]);

  return (
    <header
      className="
        fixed top-0 left-1/2 -translate-x-1/2
        w-[90%] max-w-7xl h-[90px]
        bg-white/60 backdrop-blur-xl shadow-lg
        rounded-b-2xl flex items-center justify-between
        px-6 md:px-12 z-50
        transition-all duration-700 ease-out
      "
    >
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-3">
        <img
          src={logoUrl}
          className="w-[180px] md:w-[220px] h-[40px] transition-transform duration-300 hover:scale-105"
          alt="Tomorrow World Group Logo"
        />
      </Link>

      {/* Right: Profile */}
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="
            w-11 h-11 rounded-full
            bg-[#004068] text-white font-bold
            flex items-center justify-center
            shadow-md hover:scale-105 transition
          "
          aria-label="Profile menu"
        >
          {initials}
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white shadow-xl border border-black/5 overflow-hidden">
            <div className="px-4 py-3 text-sm text-slate-700">
              <div className="font-semibold">{user?.name || "Guest"}</div>
              <div className="text-xs text-slate-500 truncate">
                {user?.email || "Not logged in"}
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-sm hover:bg-slate-50"
                >
                  Profile
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-sm hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 text-sm hover:bg-slate-50"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
