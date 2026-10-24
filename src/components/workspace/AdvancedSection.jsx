"use client";

import { SlidersHorizontal, Dices, X } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Collapsible } from "@/components/ui/Collapsible";
import { Slider } from "@/components/ui/Slider";
import { cn } from "@/lib/utils";

export function AdvancedSection() {
  const { composer, updateAdvanced } = useWorkspace();
  const { guidance, steps, seed, negativePrompt } = composer.advanced;

  const randomizeSeed = () =>
    updateAdvanced({ seed: Math.floor(Math.random() * 1_000_000) });

  return (
    <Collapsible title="Advanced" icon={SlidersHorizontal}>
      <div className="space-y-5">
        <Slider
          label="Prompt guidance"
          value={guidance}
          min={1}
          max={20}
          step={0.5}
          onChange={(v) => updateAdvanced({ guidance: v })}
          hint="How strictly the model follows your prompt."
        />
        <Slider
          label="Detail steps"
          value={steps}
          min={10}
          max={50}
          step={1}
          onChange={(v) => updateAdvanced({ steps: v })}
          hint="More steps add detail but take longer."
        />

        <div>
          <span className="mb-2 block text-[13px] font-semibold text-ink-2">Seed</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={seed ?? ""}
              placeholder="Random"
              onChange={(e) =>
                updateAdvanced({
                  seed: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              aria-label="Seed"
              className={cn(
                "nums h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink",
                "placeholder:font-normal placeholder:text-ink-3",
                "focus:border-coral/60 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-coral-soft)]",
              )}
            />
            {seed !== null && (
              <button
                type="button"
                onClick={() => updateAdvanced({ seed: null })}
                aria-label="Use a random seed"
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink-3 transition-colors hover:text-ink"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={randomizeSeed}
              aria-label="Randomize seed"
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink-2 transition-colors hover:border-line-2 hover:text-coral-700"
            >
              <Dices className="size-[18px]" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="negative-prompt"
            className="mb-2 block text-[13px] font-semibold text-ink-2"
          >
            Negative prompt
          </label>
          <textarea
            id="negative-prompt"
            value={negativePrompt}
            onChange={(e) => updateAdvanced({ negativePrompt: e.target.value })}
            placeholder="Things to avoid, e.g. blur, extra fingers, text…"
            rows={2}
            className={cn(
              "w-full resize-none rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink",
              "placeholder:text-ink-3",
              "focus:border-coral/60 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-coral-soft)]",
            )}
          />
        </div>
      </div>
    </Collapsible>
  );
}
