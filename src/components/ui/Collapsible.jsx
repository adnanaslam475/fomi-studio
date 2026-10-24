"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** A disclosure with a spring-free, GPU-friendly height animation. */
export function Collapsible({
  title,
  icon: Icon,
  defaultOpen = false,
  trailing,
  children,
  className,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={cn("card overflow-hidden", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2.5 px-4 py-3.5 text-left transition-colors",
          "hover:bg-surface-2",
        )}
      >
        {Icon && <Icon className="size-[18px] text-ink-3" aria-hidden="true" />}
        <span className="flex-1 text-sm font-semibold text-ink">{title}</span>
        {trailing}
        <ChevronDown
          className={cn(
            "size-4 text-ink-3 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={id}
        className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-line px-4 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
