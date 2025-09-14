// src/navigation/useLandingScroll.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * useLandingScroll:
 * - On mount or hash/state changes, scrolls to an element id.
 */
export function useLandingScroll() {
  const location = useLocation();

  useEffect(() => {
    const fromState = (location.state as unknown as { scrollTo: string })
      ?.scrollTo as string | undefined;
    const fromHash = location.hash?.replace("#", "") || undefined;
    const targetId = fromState || fromHash;

    if (!targetId) return;

    // Wait a tick to ensure sections are mounted
    requestAnimationFrame(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    // If we came via state, update URL hash and drop the state
    if (fromState) {
      history.replaceState(null, "", `/#${targetId}`);
    }
  }, [location]);
}
