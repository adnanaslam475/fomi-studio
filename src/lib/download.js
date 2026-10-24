/** Best-effort client download: fetch to a blob when CORS allows, else open. */
export async function downloadUrl(url, filename = "fomi-image.jpg") {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
    return true;
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
    return false;
  }
}
