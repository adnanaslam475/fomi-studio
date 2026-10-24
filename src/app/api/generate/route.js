import { MODELS, STYLES } from "@/data/catalog";
import { imageUrl, blurUrl, videoClip, VIDEO_DURATIONS } from "@/data/seed-media";

const MAX_COUNT = 8;

function clampCount(n) {
  const v = Number.parseInt(n, 10);
  if (Number.isNaN(v)) return 4;
  return Math.min(Math.max(v, 1), MAX_COUNT);
}

function token() {
  return Math.random().toString(36).slice(2, 8);
}

/** Rough, believable latency: slower models and bigger batches take longer. */
function estimateDelay(model, count, mode) {
  const base = mode === "video" ? 2200 : 900;
  const perImage = mode === "video" ? 450 : 170;
  const speedFactor = { 1: 0.6, 2: 1, 3: 1.45 }[model?.speed ?? 2] ?? 1;
  const jitter = 250 + Math.random() * 350;
  return Math.round((base + count * perImage) * speedFactor + jitter);
}

// POST /api/generate — simulate a generation and return the produced assets.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    prompt = "",
    mode = "image",
    count = 4,
    ratio = "4:5",
    modelId = "lumen-2",
    styleIds = [],
    advanced = {},
    _forceError = false,
  } = body ?? {};

  if (_forceError) {
    return Response.json(
      { error: "The model is warming up. Please try again in a moment." },
      { status: 503 },
    );
  }

  const cleanPrompt = String(prompt).trim();
  if (!cleanPrompt) {
    return Response.json({ error: "A prompt is required." }, { status: 400 });
  }

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const isVideo = mode === "video";
  const n = clampCount(count);
  const batch = isVideo ? Math.min(n, 4) : n;

  const delay = estimateDelay(model, batch, mode);
  await new Promise((resolve) => setTimeout(resolve, delay));

  const genId = `g-${Date.now().toString(36)}-${token()}`;
  const run = token();

  const assets = Array.from({ length: batch }).map((_, i) => {
    const seed = `${run}-${i}`;
    const assetRatio = isVideo ? "16:9" : ratio;
    const base = {
      id: `${genId}-${i}`,
      seed,
      ratio: assetRatio,
      url: imageUrl(seed, assetRatio),
      blurDataURL: blurUrl(seed, assetRatio),
      favorite: false,
    };
    if (isVideo) {
      return {
        ...base,
        type: "video",
        posterUrl: imageUrl(seed, "16:9"),
        videoUrl: videoClip(i),
        duration: VIDEO_DURATIONS[i % VIDEO_DURATIONS.length],
      };
    }
    return { ...base, type: "image" };
  });

  const resolvedStyles = styleIds
    .map((id) => STYLES.find((s) => s.id === id))
    .filter(Boolean)
    .map((s) => ({ id: s.id, name: s.name }));

  return Response.json({
    generation: {
      id: genId,
      prompt: cleanPrompt,
      mode,
      modelId: model.id,
      modelName: model.name,
      ratio,
      styles: resolvedStyles,
      advanced: {
        guidance: advanced.guidance ?? 7,
        steps: advanced.steps ?? 30,
        seed: advanced.seed ?? run,
        negativePrompt: advanced.negativePrompt ?? "",
      },
      createdAt: new Date().toISOString(),
      assets,
      meta: { durationMs: delay, count: batch },
    },
  });
}
