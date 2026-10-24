import { cn } from "@/lib/utils";
import { Tooltip } from "./Tooltip";

const VARIANTS = {
  ghost: "text-ink-2 hover:bg-surface-2 hover:text-ink",
  soft: "bg-surface-2 text-ink-2 hover:bg-surface-3 hover:text-ink",
  surface: "bg-surface border border-line text-ink-2 hover:text-ink hover:border-line-2 shadow-xs",
  dark: "bg-ink text-ink-inv hover:brightness-110",
  glass:
    "bg-white/85 text-ink backdrop-blur-sm hover:bg-white shadow-sm border border-white/60",
};

const ACTIVE = "bg-coral-soft text-coral-700 hover:bg-coral-soft hover:text-coral-700";

const SIZES = {
  sm: "size-8 rounded-lg [&_svg]:size-4",
  md: "size-10 rounded-xl [&_svg]:size-[18px]",
  lg: "size-11 rounded-xl [&_svg]:size-5",
};

export function IconButton({
  icon: Icon,
  label,
  tooltip,
  side = "top",
  size = "md",
  variant = "ghost",
  active = false,
  className,
  ...rest
}) {
  const button = (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active || undefined}
      className={cn(
        "inline-flex items-center justify-center transition-[background-color,color,transform,box-shadow,border-color] duration-150",
        "active:scale-90 disabled:pointer-events-none disabled:opacity-50",
        SIZES[size],
        active ? ACTIVE : VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      <Icon aria-hidden="true" />
    </button>
  );

  const tip = tooltip ?? label;
  return tip ? (
    <Tooltip label={tip} side={side}>
      {button}
    </Tooltip>
  ) : (
    button
  );
}
