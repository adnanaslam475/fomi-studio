/**
 * Static catalog for the mock backend: the models, styles, aspect ratios and
 * batch sizes the workspace exposes. Served verbatim by /api/catalog.
 */

export const MODELS = [
  {
    id: "lumen-2",
    name: "Lumen 2",
    tagline: "Balanced flagship — great at almost everything",
    badge: "Flagship",
    speed: 2, // 1 fast · 3 slow
    quality: 3,
    kinds: ["image"],
  },
  {
    id: "aurora",
    name: "Aurora",
    tagline: "Photoreal people & portraits",
    badge: "Photoreal",
    speed: 2,
    quality: 3,
    kinds: ["image"],
  },
  {
    id: "flash",
    name: "Flash",
    tagline: "Near-instant drafts while you explore",
    badge: "Realtime",
    speed: 1,
    quality: 2,
    kinds: ["image"],
  },
  {
    id: "ink",
    name: "Ink",
    tagline: "Illustration, concept art & stylised looks",
    badge: "Artistic",
    speed: 2,
    quality: 2,
    kinds: ["image"],
  },
  {
    id: "lumen-max",
    name: "Lumen Max",
    tagline: "Maximum fidelity for final frames",
    badge: "Highest quality",
    speed: 3,
    quality: 3,
    kinds: ["image"],
  },
  {
    id: "motion-1",
    name: "Motion 1",
    tagline: "Short cinematic clips from a prompt",
    badge: "Video",
    speed: 3,
    quality: 3,
    kinds: ["video"],
  },
];

export const STYLES = [
  { id: "none", name: "None", seed: "style-none", fragment: "" },
  { id: "photoreal", name: "Photoreal", seed: "style-photoreal", fragment: "photorealistic, natural light, high detail" },
  { id: "cinematic", name: "Cinematic", seed: "style-cine", fragment: "cinematic lighting, anamorphic, shallow depth of field" },
  { id: "portrait", name: "Studio portrait", seed: "style-portrait", fragment: "studio portrait, soft key light, 85mm" },
  { id: "editorial", name: "Editorial", seed: "style-editorial", fragment: "editorial fashion photography, muted palette" },
  { id: "film35", name: "Film 35mm", seed: "style-film", fragment: "35mm film grain, kodak portra, analog" },
  { id: "noir", name: "Noir", seed: "style-noir", fragment: "high-contrast black and white, dramatic shadow" },
  { id: "watercolor", name: "Watercolor", seed: "style-watercolor", fragment: "loose watercolor, soft washes, paper texture" },
  { id: "render3d", name: "3D render", seed: "style-3d", fragment: "octane render, soft global illumination, clay" },
  { id: "anime", name: "Anime", seed: "style-anime", fragment: "clean anime illustration, cel shading" },
  { id: "product", name: "Product", seed: "style-product", fragment: "product photography, seamless backdrop, crisp" },
  { id: "dreamy", name: "Dreamy", seed: "style-dreamy", fragment: "ethereal, bloom, pastel haze, dreamlike" },
];

export const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1", w: 1, h: 1, note: "Square" },
  { id: "4:5", label: "4:5", w: 4, h: 5, note: "Portrait" },
  { id: "3:4", label: "3:4", w: 3, h: 4, note: "Portrait" },
  { id: "2:3", label: "2:3", w: 2, h: 3, note: "Tall" },
  { id: "3:2", label: "3:2", w: 3, h: 2, note: "Landscape" },
  { id: "16:9", label: "16:9", w: 16, h: 9, note: "Wide" },
  { id: "9:16", label: "9:16", w: 9, h: 16, note: "Story" },
];

export const BATCH_SIZES = [1, 2, 4, 6, 8];

export const ADVANCED_DEFAULTS = {
  guidance: 7, // prompt adherence (CFG) 1–20
  steps: 30, // 10–50
  seed: null, // null = random
  negativePrompt: "",
};

/** A few starter prompts for the empty state & "surprise me". */
export const SAMPLE_PROMPTS = [
  "A professional portrait of a smiling 31-year-old redheaded woman with warm brown eyes and softly tousled auburn hair, cream cashmere sweater, delicate gold earrings, blurred modern gallery background, subtle directional lighting.",
  "Golden-hour street in Lisbon, pastel facades, long soft shadows, a lone cyclist, 35mm film look.",
  "Macro shot of dew on a spiderweb at dawn, bokeh meadow behind, iridescent droplets.",
  "Minimal product shot of a matte ceramic cup on a warm sand backdrop, soft studio light.",
  "A snow leopard resting on a cliff at blue hour, cinematic, volumetric mist.",
  "Editorial flat-lay of autumn spices on linen, overhead, muted earthy palette.",
];

export const CATALOG = {
  models: MODELS,
  styles: STYLES,
  aspectRatios: ASPECT_RATIOS,
  batchSizes: BATCH_SIZES,
  advancedDefaults: ADVANCED_DEFAULTS,
  samplePrompts: SAMPLE_PROMPTS,
};
