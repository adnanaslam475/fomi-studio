"use client";

import { cn } from "@/lib/utils";

/**
 * Animated segmented control (e.g. Image / Video). Rendered as a radiogroup so
 * arrow keys and screen readers work; the pill slides with a spring.
 */
export function Segmented({ options, value, onChange, ariaLabel, className, size = "md" }) {
  const n = options.length;
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  const pad = size === "sm" ? "p-0.5" : "p-1";
  const inset = size === "sm" ? "top-0.5 bottom-0.5 left-0.5" : "top-1 bottom-1 left-1";
  const gutter = size === "sm" ? "0.25rem" : "0.5rem";
  const btn = size === "sm" ? "h-8 text-[13px] gap-1.5" : "h-10 text-sm gap-2";

  const handleKey = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const dir = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + n) % n;
    onChange(options[next].value);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKey}
      className={cn(
        "relative flex rounded-full border border-line bg-surface-2",
        pad,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute rounded-full bg-surface shadow-sm",
          "transition-transform duration-300 ease-[var(--ease-spring)]",
          inset,
        )}
        style={{
          width: `calc((100% - ${gutter}) / ${n})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {options.map((option) => {
        const Icon = option.icon;
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 flex flex-1 items-center justify-center rounded-full px-3 font-semibold",
              "transition-colors duration-200",
              btn,
              selected ? "text-coral-700" : "text-ink-3 hover:text-ink-2",
            )}
          >
            {Icon && <Icon className="size-[1.05em]" aria-hidden="true" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
