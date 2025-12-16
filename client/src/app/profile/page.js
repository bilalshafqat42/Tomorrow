"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  // simple editable fields (frontend-only for now)
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const me = await api("/api/auth/me");
        setUser(me.user || null);
        setPhone(me.user?.phone || "");
        setWebsite(me.user?.website || "");
        setChecking(false);
      } catch {
        router.replace("/login");
      }
    }
    load();
  }, [router]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  if (checking) return null;

  return (
    <div className="min-h-screen w-screen bg-slate-100">
      <div className="pt-[110px]">
        <TopBar user={user} onLogout={logout} />

        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="rounded-2xl bg-white shadow-lg border border-black/5 p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-[#004068]">Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Your account details</p>

            <div className="mt-6 space-y-4">
              <Field label="Name" value={user?.name || ""} readOnly />
              <Field label="Email" value={user?.email || ""} readOnly />

              <Field
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971..."
              />

              <Field
                label="Website Link"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://bilalshafqat.com"
              />

              <div className="pt-2 text-xs text-slate-500">
                Note: Phone/Website are UI fields for now. If you want to save
                them in database, we’ll add a backend endpoint like{" "}
                <b>PUT /api/users/me</b>.
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
              >
                Back
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-[#EAC4A1] text-[#0b4a66] font-bold hover:opacity-95 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, readOnly }) {
  return (
    <div>
      <label className="text-sm text-slate-700">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="
          mt-2 w-full rounded-xl px-4 py-3
          bg-white text-slate-900
          border border-slate-200
          outline-none
          focus:ring-2 focus:ring-[#EAC4A1]/70
          disabled:opacity-70
        "
      />
    </div>
  );
}
