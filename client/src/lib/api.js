// client/src/lib/api.js

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://tomorrow-main.onrender.com";

/**
 * Usage:
 *   await api("/api/auth/login", { method:"POST", body: JSON.stringify({...}) })
 */
export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // IMPORTANT for cookies
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      "Request failed";
    throw new Error(msg);
  }

  return data;
}
