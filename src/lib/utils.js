/** Join truthy class names. Keep call sites free of conflicting utilities. */
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

/** Compact relative time, e.g. "just now", "6m ago", "2h ago", "3d ago". */
export function timeAgo(input) {
  const then = new Date(input).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  return `${wk}w ago`;
}

/** Milliseconds → "1.8s". */
export function formatDuration(ms) {
  if (!ms && ms !== 0) return "";
  return `${(ms / 1000).toFixed(1)}s`;
}

/** "4:5" → "4 / 5" for the CSS aspect-ratio property. */
export function ratioToCss(ratioId) {
  if (typeof ratioId !== "string" || !ratioId.includes(":")) return "1 / 1";
  return ratioId.replace(":", " / ");
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** Collapse long text to a single line preview. */
export function truncate(text, max = 120) {
  const t = String(text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}
