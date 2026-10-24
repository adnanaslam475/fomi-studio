"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Heart, Download, Maximize2, Copy as CopyIcon, Wand2, Play } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { downloadUrl } from "@/lib/download";
import { cn, ratioToCss } from "@/lib/utils";

function ActionButton({ icon: Icon, label, onClick, active }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active || undefined}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "grid size-8 place-items-center rounded-lg border border-white/60 bg-white/85 text-ink shadow-sm backdrop-blur-sm",
        "transition-[transform,background-color,color] duration-150 hover:bg-white active:scale-90",
        active && "text-coral-700",
      )}
    >
      <Icon className={cn("size-4", active && "fill-current")} aria-hidden="true" />
    </button>
  );
}

export function ResultCard({ asset, index, alt, onExpand, onVariations }) {
  const { toggleFavorite, pushToast } = useWorkspace();
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);
  const isVideo = asset.type === "video";

  const onEnter = () => {
    if (isVideo) videoRef.current?.play().catch(() => {});
  };
  const onLeave = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleDownload = async () => {
    pushToast("Preparing download…");
    const ok = await downloadUrl(
      isVideo ? asset.videoUrl : asset.url,
      `fomi-${asset.seed}.${isVideo ? "mp4" : "jpg"}`,
    );
    if (ok) pushToast("Download started", "success");
  };

  return (
    <figure
      className="group animate-pop-in stagger relative overflow-hidden rounded-2xl border border-line bg-surface-3"
      style={{ aspectRatio: ratioToCss(asset.ratio), "--i": index }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {!loaded && <div className="skeleton absolute inset-0" />}

      {isVideo ? (
        <>
          <Image
            src={asset.posterUrl}
            alt={alt}
            fill
            sizes="(min-width:1280px) 22vw, (min-width:768px) 33vw, 50vw"
            onLoad={() => setLoaded(true)}
            className={cn(
              "object-cover transition-opacity duration-500 group-hover:opacity-0",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
          <video
            ref={videoRef}
            src={asset.videoUrl}
            poster={asset.posterUrl}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="pointer-events-none absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm group-hover:opacity-0">
            <Play className="size-3 fill-current" aria-hidden="true" />
            {asset.duration}
          </span>
        </>
      ) : (
        <Image
          src={asset.url}
          alt={alt}
          fill
          sizes="(min-width:1280px) 22vw, (min-width:768px) 33vw, 50vw"
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-[transform,opacity] duration-500 group-hover:scale-[1.04]",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* click target for expanding */}
      <button
        type="button"
        aria-label={`View result ${index + 1} larger`}
        onClick={() => onExpand(index)}
        className="absolute inset-0 z-0 cursor-zoom-in"
      />

      {/* hover gradient */}
      <span
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(42,36,32,0.18)_0%,transparent_28%,transparent_62%,rgba(42,36,32,0.42)_100%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* favorite */}
      <div
        className={cn(
          "absolute right-2 top-2 z-10 transition-opacity duration-200",
          asset.favorite
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
        )}
      >
        <ActionButton
          icon={Heart}
          label={asset.favorite ? "Remove from favorites" : "Add to favorites"}
          active={asset.favorite}
          onClick={() => toggleFavorite(asset.id)}
        />
      </div>

      {/* action bar */}
      <div className="absolute inset-x-2 bottom-2 z-10 flex items-center justify-end gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <ActionButton icon={Wand2} label="Make variations" onClick={() => onVariations(asset)} />
        <ActionButton
          icon={CopyIcon}
          label="Upscale"
          onClick={() => pushToast("Upscaling to 4K…")}
        />
        <ActionButton icon={Download} label="Download" onClick={handleDownload} />
        <ActionButton icon={Maximize2} label="Expand" onClick={() => onExpand(index)} />
      </div>
    </figure>
  );
}
