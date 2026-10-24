"use client";

import { useEffect, useState } from "react";

/** SSR-safe media query. Returns false on the server and the first client
 *  paint, then updates once mounted (avoids hydration mismatches). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
