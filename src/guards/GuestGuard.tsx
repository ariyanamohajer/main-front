import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

interface GuestGuardProps {
  children: React.ReactNode;
  fallback?: string;
}

export const GuestGuard = ({ children, fallback = "/products" }: GuestGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to home page
  if (isAuthenticated) {
    // Get the original destination from state, or default to fallback
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      fallback;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
