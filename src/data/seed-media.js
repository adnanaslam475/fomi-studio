/**
 * Deterministic media helpers for the mock backend. Images come from Lorem
 * Picsum (seeded, so the same seed always returns the same photo) and video
 * posters reuse the same scheme. These stand in for "generated" assets.
 */

import { ASPECT_RATIOS } from "./catalog";

const PICSUM = "https://picsum.photos/seed";

/** Pixel dimensions for an aspect-ratio id, scaled to a target long edge. */
export function dimensionsFor(ratioId, longEdge = 768) {
  const ratio = ASPECT_RATIOS.find((r) => r.id === ratioId) ?? ASPECT_RATIOS[0];
  const { w, h } = ratio;
  if (w >= h) {
    return { width: longEdge, height: Math.round((longEdge * h) / w) };
  }
  return { width: Math.round((longEdge * w) / h), height: longEdge };
}

/** A seeded photo URL at the requested aspect ratio. */
export function imageUrl(seed, ratioId = "4:5", longEdge = 768) {
  const { width, height } = dimensionsFor(ratioId, longEdge);
  return `${PICSUM}/${encodeURIComponent(seed)}/${width}/${height}`;
}

/** A tiny blurred placeholder of the same photo (used as a blur-up poster). */
export function blurUrl(seed, ratioId = "4:5") {
  const { width, height } = dimensionsFor(ratioId, 32);
  return `${PICSUM}/${encodeURIComponent(seed)}/${width}/${height}?blur=3`;
}

const VIDEO_BASE =
  "https://storage.googleapis.com/gtv-videos-bucket/sample";

const VIDEO_CLIPS = [
  "ForBiggerBlazes.mp4",
  "ForBiggerEscapes.mp4",
  "ForBiggerFun.mp4",
  "ForBiggerJoyrides.mp4",
  "ForBiggerMeltdowns.mp4",
];

export function videoClip(index = 0) {
  return `${VIDEO_BASE}/${VIDEO_CLIPS[index % VIDEO_CLIPS.length]}`;
}

export const VIDEO_DURATIONS = ["0:04", "0:06", "0:05", "0:08", "0:05"];
