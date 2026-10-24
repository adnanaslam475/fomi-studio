"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Heart, Download } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useMountTransition } from "@/hooks/useMountTransition";
import { useOnEscape } from "@/hooks/useOnEscape";
import { downloadUrl } from "@/lib/download";
import { cn, ratioToCss } from "@/lib/utils";

export function Lightbox({ open, assets, index, onIndexChange, onClose, prompt }) {
  const { toggleFavorite, pushToast } = useWorkspace();
  const { rendered, visible } = useMountTransition(open, 220);
  const closeRef = useRef(null);

  const total = assets?.length ?? 0;
  const asset = assets?.[index];

  const go = (dir) => onIndexChange((index + dir + total) % total);

  useOnEscape(onClose, open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, total]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!rendered || !asset || typeof document === "undefined") return null;

  const handleDownload = async () => {
    const isVideo = asset.type === "video";
    const ok = await downloadUrl(
      isVideo ? asset.videoUrl : asset.url,
      `fomi-${asset.seed}.${isVideo ? "mp4" : "jpg"}`,
    );
    if (ok) pushToast("Download started", "success");
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className={cn(
        "fixed inset-0 z-[80] flex flex-col bg-ink/80 backdrop-blur-md transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
      onClick={onClose}
    >
      {/* top bar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 text-ink-inv"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="nums text-sm font-semibold text-white/80">
          {index + 1} / {total}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => toggleFavorite(asset.id)}
            aria-label={asset.favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={asset.favorite}
            className="grid size-10 place-items-center rounded-xl text-white/90 transition-colors hover:bg-white/10"
          >
            <Heart className={cn("size-5", asset.favorite && "fill-current text-coral")} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download"
            className="grid size-10 place-items-center rounded-xl text-white/90 transition-colors hover:bg-white/10"
          >
            <Download className="size-5" aria-hidden="true" />
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="grid size-10 place-items-center rounded-xl text-white/90 transition-colors hover:bg-white/10"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* stage */}
      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-2 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-5"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
        )}

        <div
          className={cn(
            "relative max-h-full w-auto max-w-full overflow-hidden rounded-2xl shadow-lg transition-transform duration-300",
            visible ? "scale-100" : "scale-95",
          )}
          style={{ aspectRatio: ratioToCss(asset.ratio), maxHeight: "72vh", width: "min(92vw, 1100px)" }}
        >
          {asset.type === "video" ? (
            <video
              src={asset.videoUrl}
              poster={asset.posterUrl}
              controls
              autoPlay
              loop
              playsInline
              className="size-full object-contain"
            />
          ) : (
            <Image
              src={asset.url}
              alt={prompt || "Generated image"}
              fill
              sizes="92vw"
              className="object-contain"
              priority
            />
          )}
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-2 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-5"
          >
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* caption */}
      {prompt && (
        <div className="px-4 pb-5" onClick={(e) => e.stopPropagation()}>
          <p className="mx-auto max-w-3xl text-center text-[13px] leading-relaxed text-white/70">
            {prompt}
          </p>
        </div>
      )}
    </div>,
    document.body,
  );
}
