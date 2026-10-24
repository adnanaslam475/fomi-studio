/**
 * Seed history for the mock backend. Timestamps are built at request time from
 * minute-offsets so the feed always looks "recent" without hydration drift
 * (history is fetched on the client, never inlined into server HTML).
 */

import { imageUrl, blurUrl } from "./seed-media";

function asset(seed, ratio, type = "image") {
  return {
    id: `a-${seed}`,
    seed,
    type,
    url: imageUrl(seed, ratio),
    blurDataURL: blurUrl(seed, ratio),
    ratio,
  };
}

const SEED_GENERATIONS = [
  {
    id: "g-0001",
    prompt:
      "A professional portrait of a smiling 31-year-old redheaded woman with warm brown eyes and softly tousled auburn hair, cream cashmere sweater, delicate gold earrings, blurred modern gallery background, subtle directional lighting.",
    modelId: "aurora",
    mode: "image",
    ratio: "4:5",
    minutesAgo: 6,
    seeds: [
      "fomi-portrait-1",
      "fomi-portrait-2",
      "fomi-portrait-3",
      "fomi-portrait-4",
      "fomi-portrait-5",
      "fomi-portrait-6",
      "fomi-portrait-7",
      "fomi-portrait-8",
    ],
    favorites: ["fomi-portrait-2", "fomi-portrait-6"],
  },
  {
    id: "g-0002",
    prompt: "Golden-hour street in Lisbon, pastel facades, long soft shadows, 35mm film look.",
    modelId: "lumen-2",
    mode: "image",
    ratio: "3:2",
    minutesAgo: 44,
    seeds: ["fomi-lisbon-1", "fomi-lisbon-2", "fomi-lisbon-3", "fomi-lisbon-4"],
    favorites: [],
  },
  {
    id: "g-0003",
    prompt: "Macro shot of dew on a spiderweb at dawn, bokeh meadow behind, iridescent droplets.",
    modelId: "lumen-max",
    mode: "image",
    ratio: "1:1",
    minutesAgo: 95,
    seeds: ["fomi-dew-1", "fomi-dew-2", "fomi-dew-3", "fomi-dew-4"],
    favorites: ["fomi-dew-3"],
  },
  {
    id: "g-0004",
    prompt: "Snow leopard resting on a cliff at blue hour, cinematic, volumetric mist.",
    modelId: "lumen-2",
    mode: "image",
    ratio: "3:4",
    minutesAgo: 160,
    seeds: ["fomi-leopard-1", "fomi-leopard-2", "fomi-leopard-3", "fomi-leopard-4"],
    favorites: [],
  },
  {
    id: "g-0005",
    prompt: "Matte ceramic cup on a warm sand backdrop, soft studio light, product shot.",
    modelId: "aurora",
    mode: "image",
    ratio: "4:5",
    minutesAgo: 240,
    seeds: ["fomi-cup-1", "fomi-cup-2", "fomi-cup-3", "fomi-cup-4"],
    favorites: ["fomi-cup-1"],
  },
  {
    id: "g-0006",
    prompt: "Editorial flat-lay of autumn spices on linen, overhead, muted earthy palette.",
    modelId: "ink",
    mode: "image",
    ratio: "1:1",
    minutesAgo: 320,
    seeds: ["fomi-spice-1", "fomi-spice-2", "fomi-spice-3", "fomi-spice-4"],
    favorites: [],
  },
  {
    id: "g-0007",
    prompt: "Drone shot gliding over misty pine valley at sunrise, cinematic clip.",
    modelId: "motion-1",
    mode: "video",
    ratio: "16:9",
    minutesAgo: 400,
    seeds: ["fomi-valley-1", "fomi-valley-2"],
    favorites: [],
  },
  {
    id: "g-0008",
    prompt: "Neon-lit Tokyo alley in the rain, reflections, cyberpunk mood.",
    modelId: "lumen-2",
    mode: "image",
    ratio: "2:3",
    minutesAgo: 540,
    seeds: ["fomi-tokyo-1", "fomi-tokyo-2", "fomi-tokyo-3", "fomi-tokyo-4"],
    favorites: ["fomi-tokyo-4"],
  },
  {
    id: "g-0009",
    prompt: "Watercolor botanical of eucalyptus sprigs, loose washes, paper texture.",
    modelId: "ink",
    mode: "image",
    ratio: "3:4",
    minutesAgo: 720,
    seeds: ["fomi-botanical-1", "fomi-botanical-2", "fomi-botanical-3", "fomi-botanical-4"],
    favorites: [],
  },
  {
    id: "g-0010",
    prompt: "Minimalist architecture, concrete curves, strong noon shadow, clear sky.",
    modelId: "lumen-max",
    mode: "image",
    ratio: "4:5",
    minutesAgo: 900,
    seeds: ["fomi-arch-1", "fomi-arch-2", "fomi-arch-3", "fomi-arch-4"],
    favorites: ["fomi-arch-2"],
  },
  {
    id: "g-0011",
    prompt: "Vintage car on a coastal road, warm analog tones, sunlit haze.",
    modelId: "flash",
    mode: "image",
    ratio: "3:2",
    minutesAgo: 1200,
    seeds: ["fomi-car-1", "fomi-car-2", "fomi-car-3", "fomi-car-4"],
    favorites: [],
  },
  {
    id: "g-0012",
    prompt: "Close-up of a potter's hands shaping clay on a wheel, warm window light.",
    modelId: "aurora",
    mode: "image",
    ratio: "1:1",
    minutesAgo: 1560,
    seeds: ["fomi-potter-1", "fomi-potter-2", "fomi-potter-3", "fomi-potter-4"],
    favorites: ["fomi-potter-1"],
  },
];

export function buildHistory() {
  const now = Date.now();
  return SEED_GENERATIONS.map((g) => ({
    id: g.id,
    prompt: g.prompt,
    modelId: g.modelId,
    mode: g.mode,
    ratio: g.ratio,
    createdAt: new Date(now - g.minutesAgo * 60_000).toISOString(),
    assets: g.seeds.map((seed) => ({
      ...asset(seed, g.ratio, g.mode),
      favorite: g.favorites.includes(seed),
    })),
  }));
}
