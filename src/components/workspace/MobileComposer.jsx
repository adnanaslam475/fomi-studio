"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ModeToggle } from "./ModeToggle";
import { PromptField } from "./PromptField";
import { GenerateButton } from "./GenerateButton";
import { ControlsRow } from "./ControlsRow";
import { AdvancedSection } from "./AdvancedSection";
import { StylesSection } from "./StylesSection";
import { truncate } from "@/lib/utils";

/** The docked composer for phones/tablets: a quick bar that opens a full sheet. */
export function MobileComposer() {
  const { composer } = useWorkspace();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[color:var(--color-canvas)]/92 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-[1700px] items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open composer options"
            className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-ink-2 shadow-xs transition-colors hover:text-coral-700 active:scale-95"
          >
            <SlidersHorizontal className="size-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-12 flex-1 items-center overflow-hidden rounded-2xl border border-line bg-surface px-4 text-left text-sm shadow-xs"
          >
            {composer.prompt ? (
              <span className="truncate text-ink-2">{truncate(composer.prompt, 60)}</span>
            ) : (
              <span className="text-ink-3">Describe your imagination…</span>
            )}
          </button>

          <GenerateButton size="pill" />
        </div>
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Create">
        <div className="space-y-3">
          <ModeToggle />
          <div className="card p-3">
            <PromptField autoFocus minHeight={96} />
          </div>
          <ControlsRow />
          <AdvancedSection />
          <StylesSection />
          <div className="pt-1">
            <GenerateButton size="lg" block afterClick={() => setOpen(false)} />
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
