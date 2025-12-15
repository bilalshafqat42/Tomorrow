const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://tomorrow-main.onrender.com";

export async function api(path, options = {}) {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE is missing. Set it on Render for the frontend service."
    );
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // If backend returns HTML (like 404 page), show clean error
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    // not JSON
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}
