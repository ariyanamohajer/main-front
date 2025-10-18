// 


// src/context/auth.tsx
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";
import {
  getTokenData,
  getUserData,
  storeTokenData,
  storeUserData,
  clearTokenData,
  clearUserData,
  getAccessToken, // ← presence of access token = logged-in (session-only)
} from "@/lib/cookie-utils";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from cookies on mount (no client-side expiry checks)
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const tokenData = getTokenData();
        const userData = getUserData();

        if (tokenData && userData) {
          const fullUser: User = {
            phone: userData.phone,
            fName: userData.fName,
            lName: userData.lName,
            token: tokenData.token,
            refreshToken: tokenData.refreshToken,
            // These may be undefined for session-only cookies — that's fine:
            expiration: tokenData.expiration,
            refreshTokenExpiration: tokenData.refreshTokenExpiration,
          };
          setUser(fullUser);
        } else {
          // Missing pieces → clear any leftovers
          clearTokenData();
          clearUserData();
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        clearTokenData();
        clearUserData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function (persists tokens with provided expiration)
  const login = (userData: User) => {
    try {
      // Persist auth cookies across sessions using backend expiry values
      storeTokenData(
        {
          token: userData.token,
          refreshToken: userData.refreshToken,
          expiration: userData.expiration, // optional (ignored if sessionOnly)
          refreshTokenExpiration: userData.refreshTokenExpiration, // optional
        },
        { sessionOnly: false }
      );

      // Non-sensitive profile bits for quick hydration
      storeUserData(
        {
          phone: userData.phone,
          fName: userData.fName,
          lName: userData.lName,
        },
        userData.refreshTokenExpiration || userData.expiration
      );

      setUser(userData);
    } catch (error) {
      console.error("Error storing auth data:", error);
      throw new Error("Failed to store authentication data");
    }
  };

  // Logout function
  const logout = () => {
    try {
      clearTokenData();
      clearUserData();
      setUser(null);
      location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value: AuthContextType = {
    user,
    // Auth state is true only if we have a hydrated user AND a token present
    isAuthenticated: !!user && !!getAccessToken(),
    isLoading,
    login,
    logout,
    setLoading: setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export context for use in hook
export { AuthContext };
