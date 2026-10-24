/**
 * Thin client for the mock backend. Every network call in the app goes through
 * here so error handling, cancellation and shapes stay in one place.
 */

async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON (e.g. a crash) — fall through to the status-based message
  }

  if (!res.ok) {
    const message =
      (data && data.error) || `Request failed (${res.status}). Please try again.`;
    throw new ApiError(message, res.status);
  }
  return data;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function fetchCatalog(signal) {
  return request("/api/catalog", { signal });
}

export async function fetchHistory(signal) {
  const data = await request("/api/history", { signal });
  return data.items ?? [];
}

export async function generate(payload, signal) {
  const data = await request("/api/generate", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  });
  return data.generation;
}
