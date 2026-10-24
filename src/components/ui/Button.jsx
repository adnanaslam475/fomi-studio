import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "text-white shadow-coral bg-[linear-gradient(180deg,var(--color-coral),var(--color-coral-600))] hover:brightness-[1.04] active:brightness-95",
  secondary:
    "bg-surface text-ink border border-line hover:bg-surface-2 hover:border-line-2 shadow-xs",
  soft: "bg-surface-2 text-ink-2 hover:bg-surface-3 hover:text-ink border border-transparent",
  ghost: "bg-transparent text-ink-2 hover:bg-surface-2 hover:text-ink",
  outline:
    "bg-transparent text-ink border border-line hover:bg-surface-2",
  danger:
    "bg-[color:var(--color-danger)] text-white hover:brightness-105 active:brightness-95",
};

const SIZES = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-xl",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-2xl",
  pill: "h-11 px-5 text-sm gap-2 rounded-full",
};

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  children,
  type = "button",
  ...rest
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex select-none items-center justify-center font-semibold",
        "transition-[transform,filter,background-color,box-shadow,color,border-color] duration-150",
        "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="size-[1.1em] animate-spin-slow" aria-hidden="true" />
      ) : (
        LeftIcon && <LeftIcon className="size-[1.1em]" aria-hidden="true" />
      )}
      {children}
      {!loading && RightIcon && (
        <RightIcon className="size-[1.1em]" aria-hidden="true" />
      )}
    </button>
  );
}
