"use client";

import { useState } from "react";
import { Loader2, Wand2, Download, RefreshCw, TriangleAlert } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { EmptyState } from "./EmptyState";
import { ResultsGrid, ResultsSkeletonGrid } from "./ResultsGrid";
import { Lightbox } from "./Lightbox";
import { Button } from "@/components/ui/Button";

function LoadingBanner() {
  const { generation, composer, catalog, cancelGenerate } = useWorkspace();
  const modelName =
    catalog?.models.find((m) => m.id === composer.modelId)?.name ?? "Fomi";
  const noun = composer.mode === "video" ? "clips" : "images";
  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-xs">
      <Loader2 className="size-5 shrink-0 animate-spin-slow text-coral-700" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">
          Creating {generation.pendingCount} {noun}…
        </p>
        <p className="truncate text-xs text-ink-3">with {modelName}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={cancelGenerate}>
        Cancel
      </Button>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-[46vh] flex-col items-center justify-center px-4 py-12 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-coral-soft text-coral-700">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-bold text-ink">That generation didn&apos;t finish</h2>
      <p className="mt-1.5 max-w-sm text-sm text-ink-2">{message}</p>
      <Button variant="primary" size="md" leftIcon={RefreshCw} className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function ResultsToolbar({ gen, onVariations }) {
  const { pushToast } = useWorkspace();
  const noun = gen.mode === "video" ? "clips" : "images";
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold text-ink">
        {gen.assets.length} {noun}
        <span className="ml-2 font-medium text-ink-3">· this run</span>
      </h2>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" leftIcon={Download} onClick={() => pushToast("Saved all to your library", "success")}>
          <span className="hidden sm:inline">Download all</span>
          <span className="sm:hidden">All</span>
        </Button>
        <Button variant="primary" size="sm" leftIcon={Wand2} onClick={onVariations}>
          Variations
        </Button>
      </div>
    </div>
  );
}

export function ResultsArea() {
  const { generation, retryGenerate, runGenerate } = useWorkspace();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const gen = generation.current;

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const makeVariations = () => {
    if (gen?.prompt) runGenerate({ prompt: gen.prompt });
  };

  if (generation.status === "loading") {
    return (
      <div className="animate-fade-up">
        <LoadingBanner />
        <ResultsSkeletonGrid count={generation.pendingCount} ratio={generation.pendingRatio} />
      </div>
    );
  }

  if (generation.status === "error") {
    return <ErrorState message={generation.error} onRetry={retryGenerate} />;
  }

  if (gen) {
    return (
      <div className="animate-fade-up">
        <ResultsToolbar gen={gen} onVariations={makeVariations} />
        <ResultsGrid
          assets={gen.assets}
          prompt={gen.prompt}
          onExpand={openLightbox}
          onVariations={makeVariations}
        />
        <Lightbox
          open={lightboxOpen}
          assets={gen.assets}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxOpen(false)}
          prompt={gen.prompt}
        />
      </div>
    );
  }

  return <EmptyState />;
}
