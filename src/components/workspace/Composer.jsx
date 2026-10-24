"use client";

import { ModeToggle } from "./ModeToggle";
import { PromptField } from "./PromptField";
import { GenerateButton } from "./GenerateButton";
import { ControlsRow } from "./ControlsRow";
import { AdvancedSection } from "./AdvancedSection";
import { StylesSection } from "./StylesSection";
import { cn } from "@/lib/utils";

/** The left control panel used on tablet/desktop. */
export function Composer({ className }) {
  return (
    <aside className={cn("flex flex-col gap-3", className)} aria-label="Image composer">
      <ModeToggle />

      <div className="card p-3 transition-shadow focus-within:shadow-md">
        <PromptField rightSlot={<GenerateButton size="pill" />} />
      </div>

      <ControlsRow />
      <AdvancedSection />
      <StylesSection />

      <p className="px-1 pt-1 text-center text-xs text-ink-3">
        Press{" "}
        <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-sans text-[11px] font-semibold text-ink-2">
          ⌘
        </kbd>{" "}
        <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-sans text-[11px] font-semibold text-ink-2">
          Enter
        </kbd>{" "}
        to generate
      </p>
    </aside>
  );
}
