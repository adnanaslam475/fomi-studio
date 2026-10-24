"use client";

import { useWorkspace } from "@/context/WorkspaceContext";

/** The coral progress line pinned to the top of the workspace during a run. */
export function TopProgress() {
  const { progress, generation } = useWorkspace();
  const active = progress > 0 || generation.status === "loading";

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-50 h-[3px] overflow-hidden"
      role="progressbar"
      aria-label="Generation progress"
      aria-valuenow={Math.round(progress)}
      aria-hidden={!active}
    >
      <div
        className="h-full rounded-r-full bg-[linear-gradient(90deg,var(--color-coral),var(--color-amber))] transition-[width,opacity] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: active ? 1 : 0,
          boxShadow: "0 0 12px rgba(231,138,102,0.7)",
        }}
      />
    </div>
  );
}
