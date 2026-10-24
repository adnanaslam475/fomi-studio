"use client";

import { useEffect, useState } from "react";

/**
 * Keep a component mounted through its exit animation.
 * `rendered` controls mounting; `visible` drives the open/closed CSS state.
 *
 * Mount/exit state is adjusted during render (React's recommended alternative
 * to setState-in-effect); only the async frame/timeout callbacks touch state
 * from the effect.
 */
export function useMountTransition(isOpen, duration = 220) {
  const [rendered, setRendered] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);

  // Mount immediately when opening; begin the exit when closing.
  if (isOpen && !rendered) setRendered(true);
  if (!isOpen && visible) setVisible(false);

  useEffect(() => {
    if (isOpen) {
      if (visible) return undefined;
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    const timer = setTimeout(() => setRendered(false), duration);
    return () => clearTimeout(timer);
  }, [isOpen, visible, duration]);

  return { rendered, visible };
}
