import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

interface GuestGuardProps {
  children: React.ReactNode;
  fallback?: string;
}

export const GuestGuard = ({ children, fallback = "/products" }: GuestGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return /* your spinner */ null;

  if (isAuthenticated) {
    const search = new URLSearchParams(location.search);
    const redirect = search.get("redirect");
    const fromState = (location.state as { from?: { pathname: string } })?.from
      ?.pathname;

    const safe = (url?: string | null) => {
      if (!url) return null;
      try {
        const u = new URL(url);
        return u.hostname.endsWith("arianamohajer.ir") ? url : null;
      } catch {
        return null;
      }
    };

    const to = safe(redirect) || fromState || fallback;
    return <Navigate to={to} replace />;
  }

  return <>{children}</>;
};
