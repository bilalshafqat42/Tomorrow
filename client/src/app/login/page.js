"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("bilal@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      // 1) login (sets cookie on backend)
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // 2) test cookie is stored + sent back
      const me = await api("/api/auth/me", { method: "GET" });
      console.log("ME:", me);

      router.replace("/");
      router.refresh();
    } catch (e) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b4a66",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 18,
          padding: 22,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <img
            src="/assets/images/tom-logo/horizontal-logo.svg"
            alt="Tomorrow"
            style={{ height: 42, objectFit: "contain" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <h2 style={{ margin: "12px 0 6px", color: "#0b4a66" }}>
            Welcome Back
          </h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Login to continue
          </p>
        </div>

        {err ? (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            {err}
          </div>
        ) : null}

        <form onSubmit={onSubmit}>
          <label style={{ fontSize: 13, color: "#0f172a" }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="bilal@test.com"
            type="email"
            required
            style={{
              width: "100%",
              marginTop: 6,
              marginBottom: 12,
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}
          />

          <label style={{ fontSize: 13, color: "#0f172a" }}>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            required
            style={{
              width: "100%",
              marginTop: 6,
              marginBottom: 14,
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: "#eac4a1",
              color: "#0b4a66",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
            Don&apos;t have an account?{" "}
            <a href="/register" style={{ color: "#0b4a66", fontWeight: 700 }}>
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
