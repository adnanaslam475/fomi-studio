"use client";

import { Copy, CornerUpLeft, Sparkles } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn, timeAgo } from "@/lib/utils";

function MetaRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-[13px]">
      <span className="text-ink-3">{label}</span>
      <span className="nums max-w-[60%] truncate font-semibold text-ink">{value}</span>
    </div>
  );
}

/** Details for the active generation. `layout="column"` is the xl side column;
 *  `layout="bar"` is the compact header used on smaller screens. */
export function ResultDetails({ layout = "column", className }) {
  const { generation, catalog, updateComposer, pushToast } = useWorkspace();
  const gen = generation.current;

  const modelName =
    gen?.modelName ||
    catalog?.models.find((m) => m.id === gen?.modelId)?.name ||
    gen?.modelId;

  const copyPrompt = async () => {
    if (!gen?.prompt) return;
    try {
      await navigator.clipboard.writeText(gen.prompt);
      pushToast("Prompt copied", "success");
    } catch {
      pushToast("Couldn't copy prompt", "warn");
    }
  };

  const reusePrompt = () => {
    if (!gen?.prompt) return;
    updateComposer({ prompt: gen.prompt });
    pushToast("Prompt loaded into composer");
  };

  // Empty placeholder
  if (!gen) {
    if (layout === "bar") return null;
    return (
      <div className={cn("card flex flex-col items-center justify-center p-5 text-center", className)}>
        <Sparkles className="mb-2 size-5 text-ink-3" aria-hidden="true" />
        <p className="text-sm font-semibold text-ink">Prompt details</p>
        <p className="mt-1 text-xs text-ink-3">
          Your prompt and model settings appear here after you generate.
        </p>
      </div>
    );
  }

  const styleNames = (gen.styles ?? []).map((s) => s.name).join(", ");

  if (layout === "bar") {
    return (
      <div className={cn("card flex items-center gap-3 p-3", className)}>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[13px] leading-snug text-ink-2">{gen.prompt}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-medium text-ink-3">
            <span className="font-semibold text-coral-700">{modelName}</span>
            <span>{gen.ratio}</span>
            <span>{gen.assets.length} {gen.mode === "video" ? "clips" : "images"}</span>
            {gen.createdAt && <span>{timeAgo(gen.createdAt)}</span>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={copyPrompt}
            aria-label="Copy prompt"
            className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Copy className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={reusePrompt}
            aria-label="Reuse prompt"
            className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <CornerUpLeft className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  // Column layout
  return (
    <div className={cn("card flex min-h-0 flex-col p-4", className)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          Prompt
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={copyPrompt}
            aria-label="Copy prompt"
            className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Copy className="size-[15px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={reusePrompt}
            aria-label="Reuse prompt in composer"
            className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <CornerUpLeft className="size-[15px]" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto pr-1">
        <p className="text-[13px] leading-relaxed text-ink-2">{gen.prompt}</p>
      </div>

      <div className="mt-3 border-t border-line pt-2">
        <MetaRow label="Aspect" value={gen.ratio} />
        <MetaRow
          label={gen.mode === "video" ? "Clips" : "Images"}
          value={gen.assets.length}
        />
        {gen.advanced?.seed != null && <MetaRow label="Seed" value={gen.advanced.seed} />}
        {styleNames && <MetaRow label="Styles" value={styleNames} />}
        {gen.createdAt && <MetaRow label="Created" value={timeAgo(gen.createdAt)} />}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2.5">
        <span className="size-2 shrink-0 rounded-full bg-[linear-gradient(145deg,var(--color-coral),var(--color-amber))]" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-ink-3">Model</p>
          <p className="truncate text-sm font-semibold text-ink">{modelName}</p>
        </div>
      </div>
    </div>
  );
}
