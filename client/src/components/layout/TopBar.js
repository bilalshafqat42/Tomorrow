"use client";
import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";

export default function TopBar({ user, onLogout }) {
  const logoUrl = "/assets/images/tom-logo/horizontal-logo.svg";
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const initials = useMemo(() => {
    const name = user?.name || "User";
    const parts = name.trim().split(" ").filter(Boolean);
    const first = parts[0]?.[0] || "U";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [user]);

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeMenuDelayed() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 250); // slower close
  }

  function closeNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(false);
  }

  return (
    <header
      className="
        fixed top-0 left-1/2 -translate-x-1/2
        w-[90%] max-w-7xl h-[90px]
        bg-white/60 backdrop-blur-xl shadow-lg
        rounded-b-2xl flex items-center justify-between
        px-6 md:px-12 z-50
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

      {/* Right: Profile dropdown */}
      <div
        className="relative"
        onMouseEnter={openMenu}
        onMouseLeave={closeMenuDelayed}
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
          <div
            className="absolute right-0 mt-3 w-56 rounded-xl bg-white shadow-xl border border-black/5 overflow-hidden"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenuDelayed}
          >
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
                  onClick={closeNow}
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    closeNow();
                    onLogout?.();
                  }}
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
                  onClick={closeNow}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 text-sm hover:bg-slate-50"
                  onClick={closeNow}
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
