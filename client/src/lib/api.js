const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://tomorrow-main.onrender.com";

export async function api(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(
        "Request timeout (backend sleeping or blocked). Try again."
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
