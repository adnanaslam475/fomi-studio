"use client";

import { useId, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useMountTransition } from "@/hooks/useMountTransition";

/**
 * Accessible single-select built on the listbox pattern. Focus stays on the
 * trigger and the active option is tracked with aria-activedescendant, so
 * keyboard support stays simple and correct.
 */
export function Select({
  value,
  onChange,
  options,
  label,
  placeholder = "Select",
  align = "start",
  size = "md",
  className,
  triggerClassName,
  menuClassName,
  renderValue,
  renderOption,
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const baseId = useId();
  const { rendered, visible } = useMountTransition(open, 160);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  useClickOutside(wrapRef, () => setOpen(false), open);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const commit = (index) => {
    const opt = options[index];
    if (opt) onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) {
          openMenu();
          return;
        }
        const dir = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((i) => (i + dir + options.length) % options.length);
        break;
      }
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActiveIndex(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) commit(activeIndex);
        else openMenu();
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const sizeCls =
    size === "sm"
      ? "h-9 px-3 text-[13px] rounded-xl"
      : "h-11 px-3.5 text-sm rounded-xl";

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        aria-controls={open ? `${baseId}-list` : undefined}
        aria-activedescendant={open ? `${baseId}-opt-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 font-semibold text-ink",
          "border border-line bg-surface shadow-xs transition-colors duration-150",
          "hover:border-line-2 hover:bg-surface-2",
          open && "border-coral/60 ring-2 ring-[color:var(--color-coral-soft)]",
          sizeCls,
          triggerClassName,
        )}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {renderValue
            ? renderValue(selected)
            : selected
              ? selected.label
              : <span className="text-ink-3">{placeholder}</span>}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-3 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {rendered && (
        <ul
          ref={listRef}
          id={`${baseId}-list`}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          className={cn(
            "scroll-thin absolute z-40 mt-2 max-h-[min(22rem,60vh)] min-w-full overflow-auto",
            "rounded-2xl border border-line bg-surface p-1.5 shadow-lg",
            "origin-top transition duration-150",
            visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
            align === "end" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${baseId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm",
                  "transition-colors duration-100",
                  isActive ? "bg-surface-2" : "bg-transparent",
                )}
              >
                {renderOption ? (
                  renderOption(option, { isSelected, isActive })
                ) : (
                  <span
                    className={cn(
                      "flex-1 truncate font-medium",
                      isSelected ? "text-ink" : "text-ink-2",
                    )}
                  >
                    {option.label}
                  </span>
                )}
                {isSelected && (
                  <Check className="size-4 shrink-0 text-coral-700" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
