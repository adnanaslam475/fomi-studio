"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Layers } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { IconButton } from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn, ratioToCss, truncate } from "@/lib/utils";

export function HistoryStrip() {
  const { history, historyStatus, loadFromHistory, generation } = useWorkspace();
  const scrollerRef = useRef(null);

  const scrollBy = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section aria-label="Recent generations" className="mx-auto w-full min-w-0 max-w-[1700px] px-4 pt-5 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-sm font-bold tracking-tight text-ink">History</h2>
          <span className="nums text-xs font-medium text-ink-3">
            {historyStatus === "ready" ? `${history.length} sessions` : " "}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="hidden rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink md:block"
            aria-label="Scroll history left"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="hidden rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink md:block"
            aria-label="Scroll history right"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="ml-1 rounded-full px-2.5 py-1 text-xs font-semibold text-coral-700 transition-colors hover:bg-coral-soft"
          >
            View all
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar -mx-1 flex snap-x gap-2.5 overflow-x-auto px-1 pb-1"
      >
        {historyStatus === "loading" &&
          Array.from({ length: 10 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-16 w-14 shrink-0 sm:h-[72px] sm:w-16"
              rounded="rounded-xl"
            />
          ))}

        {historyStatus === "error" && (
          <p className="py-4 text-sm text-ink-3">Couldn&apos;t load your history.</p>
        )}

        {historyStatus === "ready" &&
          history.map((gen) => {
            const asset = gen.assets[0];
            const isActive = generation.current?.id === gen.id;
            return (
              <button
                key={gen.id}
                type="button"
                onClick={() => loadFromHistory(gen)}
                title={truncate(gen.prompt, 90)}
                aria-label={`Load generation: ${truncate(gen.prompt, 60)}`}
                className={cn(
                  "group relative h-16 shrink-0 snap-start overflow-hidden rounded-xl border bg-surface-3 transition-all duration-200 sm:h-[72px]",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  isActive
                    ? "border-coral ring-2 ring-[color:var(--color-coral-soft)]"
                    : "border-line hover:border-line-2",
                )}
                style={{ aspectRatio: ratioToCss(gen.ratio) }}
              >
                <Image
                  src={asset.url}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(42,36,32,0.5))] opacity-0 transition-opacity group-hover:opacity-100" />
                {gen.mode === "video" ? (
                  <span className="absolute bottom-1 left-1 grid size-5 place-items-center rounded-md bg-black/55 text-white backdrop-blur-sm">
                    <Play className="size-3 fill-current" aria-hidden="true" />
                  </span>
                ) : gen.assets.length > 1 ? (
                  <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-md bg-black/50 px-1 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    <Layers className="size-2.5" aria-hidden="true" />
                    {gen.assets.length}
                  </span>
                ) : null}
              </button>
            );
          })}
      </div>
    </section>
  );
}
