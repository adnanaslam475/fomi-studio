"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Styled slider. The visuals are divs; interaction + accessibility come from a
 * transparent native range on top (keyboard arrows, screen readers all work).
 */
export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  format,
  hint,
  className,
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : value;

  return (
    <div className={cn("", className)}>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13px] font-semibold text-ink-2">
          {label}
        </label>
        <span className="nums text-[13px] font-semibold text-ink">{display}</span>
      </div>
      <div className="group relative flex h-5 items-center">
        <div className="h-1.5 w-full rounded-full bg-surface-3" />
        <div
          className="pointer-events-none absolute left-0 h-1.5 rounded-full bg-[linear-gradient(90deg,var(--color-coral),var(--color-amber))]"
          style={{ width: `${pct}%` }}
        />
        <div
          className={cn(
            "pointer-events-none absolute size-4 -translate-x-1/2 rounded-full border-2 border-white bg-coral shadow-md",
            "transition-transform duration-100 group-active:scale-110",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--color-coral-soft)]",
          )}
          style={{ left: `${pct}%` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={String(display)}
          className="peer absolute inset-0 w-full cursor-pointer opacity-0"
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-ink-3">{hint}</p>}
    </div>
  );
}
