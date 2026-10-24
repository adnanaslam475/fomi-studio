"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useMountTransition } from "@/hooks/useMountTransition";
import { useOnEscape } from "@/hooks/useOnEscape";
import { cn } from "@/lib/utils";

/** A bottom sheet for small screens (used for the mobile composer). */
export function BottomSheet({ open, onClose, title, children }) {
  const { rendered, visible } = useMountTransition(open, 280);
  useOnEscape(onClose, open);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!rendered || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[75] lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-3xl border-t border-line bg-canvas shadow-lg",
          "transition-transform duration-300 ease-[var(--ease-out-soft)]",
          visible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-3">
          <span className="mx-auto h-1.5 w-10 rounded-full bg-line-2" aria-hidden="true" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-2.5 grid size-9 place-items-center rounded-xl text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {title && (
          <h2 className="shrink-0 px-5 pb-1 text-base font-bold text-ink">{title}</h2>
        )}
        <div className="scroll-thin flex-1 overflow-y-auto px-4 pb-6 pt-2">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
