"use client";

import { ResultCard } from "./ResultCard";
import { ratioToCss, truncate } from "@/lib/utils";

const GRID = "grid grid-cols-2 gap-3 md:grid-cols-3 sm:gap-4 xl:grid-cols-4";

export function ResultsGrid({ assets, prompt, onExpand, onVariations }) {
  const alt = truncate(prompt || "Generated image", 120);
  return (
    <div className={GRID}>
      {assets.map((asset, index) => (
        <ResultCard
          key={asset.id}
          asset={asset}
          index={index}
          alt={alt}
          onExpand={onExpand}
          onVariations={onVariations}
        />
      ))}
    </div>
  );
}

export function ResultsSkeletonGrid({ count = 4, ratio = "4:5" }) {
  return (
    <div className={GRID} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton stagger rounded-2xl"
          style={{ aspectRatio: ratioToCss(ratio), "--i": i }}
        />
      ))}
    </div>
  );
}
