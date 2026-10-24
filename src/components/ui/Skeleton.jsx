import { cn } from "@/lib/utils";

/** Shimmering placeholder block. Pass an aspect ratio via style when needed. */
export function Skeleton({ className, style, rounded = "rounded-xl" }) {
  return (
    <div
      className={cn("skeleton", rounded, className)}
      style={style}
      aria-hidden="true"
    />
  );
}
