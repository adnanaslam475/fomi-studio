"use client";

import { useEffect } from "react";

/** Run `handler` on the Escape key while `enabled`. */
export function useOnEscape(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") handler(event);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handler, enabled]);
}
