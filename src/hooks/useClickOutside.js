"use client";

import { useEffect } from "react";

/** Call `handler` when a pointer/touch lands outside `ref`. */
export function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    const listener = (event) => {
      const el = ref.current;
      if (!el || el.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener, { passive: true });
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
