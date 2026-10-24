import { cn } from "@/lib/utils";

export function BrandLogo({ showWordmark = true, className }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className="grid size-9 place-items-center rounded-xl text-ink-inv shadow-coral bg-[linear-gradient(145deg,var(--color-coral),var(--color-coral-700))]"
        aria-hidden="true"
      >
        <span className="font-display text-xl font-semibold leading-none">F</span>
      </span>
      {showWordmark && (
        <span className="font-display text-[19px] font-semibold tracking-tight text-ink">
          Fomi
        </span>
      )}
    </span>
  );
}
