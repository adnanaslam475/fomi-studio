"use client";

import { useEffect, useRef } from "react";
import { Dices, Sparkles, X } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

const ENHANCERS = "cinematic lighting, rich detail, professional color grade";
const MAX_CHARS = 1500;

/** The prompt textarea with inline tools. `rightSlot` holds the Generate CTA. */
export function PromptField({ rightSlot, minHeight = 128, autoFocus = false }) {
  const { composer, updateComposer, surpriseMe, runGenerate, pushToast } =
    useWorkspace();
  const ref = useRef(null);

  // Auto-grow the textarea to fit its content (capped).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [composer.prompt, minHeight]);

  const onKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      runGenerate();
    }
  };

  const enhance = () => {
    const base = composer.prompt.trim();
    if (!base) {
      pushToast("Write a prompt to enhance.", "warn");
      return;
    }
    if (base.toLowerCase().includes("cinematic lighting")) {
      pushToast("Already enhanced.");
      return;
    }
    updateComposer({ prompt: `${base.replace(/[.,\s]+$/, "")}, ${ENHANCERS}` });
    pushToast("Prompt enhanced", "success");
  };

  const hasText = composer.prompt.trim().length > 0;

  return (
    <div className="flex flex-col">
      <textarea
        ref={ref}
        value={composer.prompt}
        onChange={(e) => updateComposer({ prompt: e.target.value.slice(0, MAX_CHARS) })}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        placeholder="Describe your imagination to be turned into a piece of art…"
        aria-label="Prompt"
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink",
          "placeholder:text-ink-3 focus:outline-none",
        )}
        style={{ minHeight }}
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Tooltip label="Surprise me">
            <button
              type="button"
              onClick={surpriseMe}
              aria-label="Surprise me with a prompt"
              className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <Dices className="size-[18px]" aria-hidden="true" />
            </button>
          </Tooltip>
          <Tooltip label="Enhance prompt">
            <button
              type="button"
              onClick={enhance}
              aria-label="Enhance prompt"
              className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-surface-2 hover:text-coral-700"
            >
              <Sparkles className="size-[18px]" aria-hidden="true" />
            </button>
          </Tooltip>
          {hasText && (
            <Tooltip label="Clear">
              <button
                type="button"
                onClick={() => updateComposer({ prompt: "" })}
                aria-label="Clear prompt"
                className="rounded-lg p-2 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X className="size-[18px]" aria-hidden="true" />
              </button>
            </Tooltip>
          )}
          <span className="nums ml-1 hidden text-xs text-ink-3 sm:block">
            {composer.prompt.length}/{MAX_CHARS}
          </span>
        </div>

        {rightSlot}
      </div>
    </div>
  );
}
