"use client";

import Image from "next/image";
import { Shapes, Check, Ban } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Collapsible } from "@/components/ui/Collapsible";
import { imageUrl } from "@/data/seed-media";
import { cn } from "@/lib/utils";

export function StylesSection() {
  const { catalog, composer, toggleStyle } = useWorkspace();
  const styles = catalog?.styles ?? [];
  const selectedCount = composer.styleIds.length;

  const trailing =
    selectedCount > 0 ? (
      <span className="mr-1 rounded-full bg-coral-soft px-2 py-0.5 text-[11px] font-bold text-coral-700">
        {selectedCount}
      </span>
    ) : null;

  return (
    <Collapsible title="Styles" icon={Shapes} trailing={trailing}>
      <div className="grid grid-cols-3 gap-2">
        {styles.map((style) => {
          const isNone = style.id === "none";
          const selected = isNone
            ? selectedCount === 0
            : composer.styleIds.includes(style.id);
          return (
            <button
              key={style.id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleStyle(style.id)}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-xl border text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-md",
                selected
                  ? "border-coral ring-2 ring-[color:var(--color-coral-soft)]"
                  : "border-line hover:border-line-2",
              )}
            >
              {isNone ? (
                <span className="grid size-full place-items-center bg-surface-2 text-ink-3">
                  <Ban className="size-5" aria-hidden="true" />
                </span>
              ) : (
                <Image
                  src={imageUrl(style.seed, "1:1", 200)}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(42,36,32,0.72))] px-1.5 pb-1 pt-4">
                <span className="block truncate text-[11px] font-semibold text-white">
                  {style.name}
                </span>
              </span>
              {selected && !isNone && (
                <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-coral text-white shadow-sm">
                  <Check className="size-3" aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Collapsible>
  );
}
