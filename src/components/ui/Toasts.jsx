"use client";

import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

const TONES = {
  default: { icon: Info, cls: "text-ink-2" },
  success: { icon: CheckCircle2, cls: "text-[color:var(--color-good)]" },
  warn: { icon: TriangleAlert, cls: "text-coral-700" },
};

export function Toasts() {
  const { toasts, dismissToast } = useWorkspace();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const tone = TONES[toast.tone] ?? TONES.default;
        const Icon = tone.icon;
        return (
          <div
            key={toast.id}
            className={cn(
              "animate-fade-up pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-line",
              "bg-surface px-4 py-3 shadow-lg",
            )}
          >
            <Icon className={cn("size-[18px] shrink-0", tone.cls)} aria-hidden="true" />
            <span className="text-sm font-medium text-ink">{toast.message}</span>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismissToast(toast.id)}
              className="-mr-1 ml-1 rounded-lg p-1 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
