"use client";

import { Lock } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function Field({ label, htmlId, children, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span
        id={htmlId}
        className="px-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-3"
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function AspectGlyph({ w, h }) {
  const max = 14;
  const rw = w >= h ? max : Math.round((max * w) / h);
  const rh = h >= w ? max : Math.round((max * h) / w);
  return (
    <span className="grid size-4 shrink-0 place-items-center" aria-hidden="true">
      <span
        className="rounded-[3px] border-[1.5px] border-current"
        style={{ width: rw, height: rh }}
      />
    </span>
  );
}

function Badge({ children }) {
  return (
    <span className="shrink-0 rounded-full bg-coral-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-coral-700">
      {children}
    </span>
  );
}

export function ControlsRow() {
  const { catalog, catalogStatus, composer, updateComposer } = useWorkspace();
  const isVideo = composer.mode === "video";

  if (catalogStatus !== "ready" || !catalog) {
    return (
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-11" />
          <Skeleton className="h-11" />
        </div>
        <Skeleton className="h-11" />
      </div>
    );
  }

  const countOptions = catalog.batchSizes
    .filter((n) => (isVideo ? n <= 4 : true))
    .map((n) => ({ value: n, label: `${n} ${n === 1 ? "image" : "images"}` }));

  const ratioOptions = catalog.aspectRatios.map((r) => ({
    value: r.id,
    label: r.label,
    note: r.note,
    w: r.w,
    h: r.h,
  }));

  const models = catalog.models.filter((m) => m.kinds.includes(composer.mode));
  const modelOptions = models.map((m) => ({
    value: m.id,
    label: m.name,
    tagline: m.tagline,
    badge: m.badge,
  }));

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <Field label={isVideo ? "Clips" : "Images"}>
          <Select
            label="Number of images"
            value={composer.count}
            onChange={(v) => updateComposer({ count: v })}
            options={countOptions}
            renderValue={(o) => <span className="truncate">{o?.label}</span>}
          />
        </Field>

        <Field label="Aspect">
          {isVideo ? (
            <div className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-line bg-surface-2 px-3.5 text-sm font-semibold text-ink-2">
              <span className="flex items-center gap-2">
                <AspectGlyph w={16} h={9} />
                16:9
              </span>
              <Lock className="size-3.5 text-ink-3" aria-hidden="true" />
            </div>
          ) : (
            <Select
              label="Aspect ratio"
              value={composer.ratio}
              onChange={(v) => updateComposer({ ratio: v })}
              options={ratioOptions}
              align="end"
              renderValue={(o) => (
                <span className="flex items-center gap-2">
                  <AspectGlyph w={o?.w ?? 1} h={o?.h ?? 1} />
                  {o?.label}
                </span>
              )}
              renderOption={(o) => (
                <span className="flex flex-1 items-center gap-2.5">
                  <AspectGlyph w={o.w} h={o.h} />
                  <span className="flex-1 font-medium text-ink">{o.label}</span>
                  <span className="text-xs text-ink-3">{o.note}</span>
                </span>
              )}
            />
          )}
        </Field>
      </div>

      <Field label="Model">
        <Select
          label="Model"
          value={composer.modelId}
          onChange={(v) => updateComposer({ modelId: v })}
          options={modelOptions}
          renderValue={(o) => (
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-2 shrink-0 rounded-full bg-[linear-gradient(145deg,var(--color-coral),var(--color-amber))]" />
              <span className="truncate">{o?.label}</span>
            </span>
          )}
          renderOption={(o) => (
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-center gap-2">
                <span className="truncate font-semibold text-ink">{o.label}</span>
                {o.badge && <Badge>{o.badge}</Badge>}
              </span>
              <span className="truncate text-xs text-ink-3">{o.tagline}</span>
            </span>
          )}
        />
      </Field>
    </div>
  );
}
