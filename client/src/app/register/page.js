"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, phone, email, password }),
      });

      // after register -> go to dashboard
      router.replace("/");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Register failed");
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
          <h2 style={{ margin: "12px 0 6px", color: "#0b4a66" }}>
            Create Account
          </h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Register to access the dashboard
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
          <label style={{ fontSize: 13, color: "#0f172a" }}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
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

          <label style={{ fontSize: 13, color: "#0f172a" }}>Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              marginTop: 6,
              marginBottom: 12,
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}
          />

          <label style={{ fontSize: 13, color: "#0f172a" }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Creating..." : "Register"}
          </button>

          <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#0b4a66", fontWeight: 700 }}>
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
