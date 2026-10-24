"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { truncate } from "@/lib/utils";

export function EmptyState() {
  const { catalog, updateComposer, runGenerate } = useWorkspace();
  const prompts = (catalog?.samplePrompts ?? []).slice(0, 4);

  const tryPrompt = (prompt) => {
    updateComposer({ prompt });
    runGenerate({ prompt });
  };

  return (
    <div className="flex min-h-[58vh] flex-col items-center justify-center px-4 py-14 text-center">
      <div className="relative mb-7 grid size-24 place-items-center">
        <span
          className="animate-breathe absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--color-coral),transparent_70%)] blur-xl"
          aria-hidden="true"
        />
        <span className="animate-float-soft relative grid size-16 place-items-center rounded-2xl bg-surface shadow-md">
          <Sparkles className="size-7 text-coral-700" aria-hidden="true" />
        </span>
      </div>

      <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        Let&apos;s make something{" "}
        <span className="text-gradient italic">beautiful</span>
      </h2>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2">
        Describe your idea in the composer, choose a look, and generate up to eight
        options at once. Everything you create lands in your history.
      </p>

      <div className="mt-7 w-full max-w-2xl">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-ink-3">
          Try one of these
        </p>
        <div className="flex flex-col gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => tryPrompt(prompt)}
              className="group flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md"
            >
              <Sparkles className="size-4 shrink-0 text-coral-700/70" aria-hidden="true" />
              <span className="flex-1 text-sm text-ink-2">{truncate(prompt, 96)}</span>
              <ArrowRight
                className="size-4 shrink-0 text-ink-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-coral-700"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
