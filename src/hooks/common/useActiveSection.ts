// src/navigation/useActiveSection.ts
import { useEffect, useState } from "react";

/**
 * useActiveSection:
 * - Uses IntersectionObserver to track which section is currently in view.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids.join(",")]);

  return active;
}
