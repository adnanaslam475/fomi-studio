"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Lightweight tooltip shown on hover and keyboard focus. */
export function Tooltip({ label, side = "top", children, className }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  if (!label) return children;

  const show = () => {
    timer.current = setTimeout(() => setOpen(true), 240);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap",
          "rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-ink-inv shadow-md",
          "transition duration-150",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          open
            ? "translate-y-0 opacity-100"
            : cn("opacity-0", side === "top" ? "translate-y-1" : "-translate-y-1"),
        )}
      >
        {label}
      </span>
    </span>
  );
}
