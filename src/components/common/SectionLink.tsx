// src/navigation/SectionLink.tsx
// src/navigation/SectionLink.tsx
import type { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  sectionId: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void; // optional (e.g., close mobile sheet)
};

/**
 * SectionLink:
 * - If on "/", smoothly scrolls to #sectionId.
 * - If NOT on "/", navigates to "/" with state, then Home page scrolls on mount.
 */
export function SectionLink({
  sectionId,
  className,
  children,
  onNavigate,
}: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const doScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update hash without jump
        history.replaceState(null, "", `/#${sectionId}`);
      }
      onNavigate?.();
    };

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
      // Actual scroll happens in Home via useLandingScroll()
      onNavigate?.();
    } else {
      doScroll();
    }
  };

  return (
    <a href={`/#${sectionId}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
