"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/auth/me")
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.replace("/login"); // 🔐 redirect if not logged in
      });
  }, [router]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!user) return null;

  return (
    <div style={{ padding: 24 }}>
      <h2>Profile</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
}
