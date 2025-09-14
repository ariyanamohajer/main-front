import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";
import {
  getTokenData,
  getUserData,
  storeTokenData,
  storeUserData,
  clearTokenData,
  clearUserData,
  isRefreshTokenExpired,
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

  // Check for existing token on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const tokenData = getTokenData();
        const userData = getUserData();

        if (tokenData && userData) {
          // Check if tokens are still valid
          if (!isRefreshTokenExpired()) {
            const fullUser: User = {
              ...userData,
              token: tokenData.token,
              refreshToken: tokenData.refreshToken,
              expiration: tokenData.expiration,
              refreshTokenExpiration: tokenData.refreshTokenExpiration,
            };
            setUser(fullUser);
          } else {
            // Tokens are expired, clear all data
            clearTokenData();
            clearUserData();
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // Clear invalid data
        clearTokenData();
        clearUserData();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = (userData: User) => {
    try {
      // Store token data in cookies
      storeTokenData({
        token: userData.token,
        refreshToken: userData.refreshToken,
        expiration: userData.expiration,
        refreshTokenExpiration: userData.refreshTokenExpiration,
      });

      // Store user data in cookies (non-sensitive data)
      storeUserData({
        phone: userData.phone,
        fName: userData.fName,
        lName: userData.lName,
      });

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
      location.reload()
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !isRefreshTokenExpired(),
    isLoading,
    login,
    logout,
    setLoading: setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export context for use in hook
export { AuthContext };
