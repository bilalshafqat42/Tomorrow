"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.replace("/");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={onSubmit} style={styles.card}>
        <div style={styles.logoWrap}>
          <img
            src="/assets/images/tom-logo/horizontal-logo.svg"
            alt="Tomorrow"
            style={styles.logo}
          />
        </div>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.btn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          style={styles.linkBtn}
          onClick={() => router.push("/register")}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#00416b",
    display: "grid",
    placeItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
  },
  logoWrap: { textAlign: "center", marginBottom: 14 },
  logo: { height: 70, width: "auto" },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    marginBottom: 12,
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    border: "none",
    background: "#eac4a1",
    color: "#00416b",
    fontWeight: 700,
    cursor: "pointer",
  },
  linkBtn: {
    marginTop: 12,
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
};
