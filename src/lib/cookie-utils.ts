import type { TokenData } from "@/types";

// Cookie names for different token data
const COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_EXPIRATION: "token_expiration",
  REFRESH_TOKEN_EXPIRATION: "refresh_token_expiration",
} as const;

// Cookie configuration
const COOKIE_CONFIG = {
  secure: window.location.protocol === "https:",
  sameSite: "strict" as const,
  path: "/",
};

/**
 * Set a cookie with specified value and expiration
 */
const setCookie = (name: string, value: string, expirationDate?: string) => {
  let cookieString = `${name}=${encodeURIComponent(value)}; path=${
    COOKIE_CONFIG.path
  }; samesite=${COOKIE_CONFIG.sameSite}`;

  if (COOKIE_CONFIG.secure) {
    cookieString += "; secure";
  }

  if (expirationDate) {
    cookieString += `; expires=${new Date(expirationDate).toUTCString()}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }

  return null;
};

/**
 * Delete a cookie by name
 */
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=${COOKIE_CONFIG.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=${COOKIE_CONFIG.sameSite}`;
};

/**
 * Store token data in cookies
 */
export const storeTokenData = (tokenData: TokenData): void => {
  try {
    setCookie(COOKIE_NAMES.ACCESS_TOKEN, tokenData.token, tokenData.expiration);
    setCookie(
      COOKIE_NAMES.REFRESH_TOKEN,
      tokenData.refreshToken,
      tokenData.refreshTokenExpiration
    );
    setCookie(
      COOKIE_NAMES.TOKEN_EXPIRATION,
      tokenData.expiration,
      tokenData.expiration
    );
    setCookie(
      COOKIE_NAMES.REFRESH_TOKEN_EXPIRATION,
      tokenData.refreshTokenExpiration,
      tokenData.refreshTokenExpiration
    );
  } catch (error) {
    console.error("Error storing token data in cookies:", error);
    throw new Error("Failed to store authentication data");
  }
};

/**
 * Get token data from cookies
 */
export const getTokenData = (): TokenData | null => {
  try {
    const token = getCookie(COOKIE_NAMES.ACCESS_TOKEN);
    const refreshToken = getCookie(COOKIE_NAMES.REFRESH_TOKEN);
    const expiration = getCookie(COOKIE_NAMES.TOKEN_EXPIRATION);
    const refreshTokenExpiration = getCookie(
      COOKIE_NAMES.REFRESH_TOKEN_EXPIRATION
    );

    if (token && refreshToken && expiration && refreshTokenExpiration) {
      return {
        token,
        refreshToken,
        expiration,
        refreshTokenExpiration,
      };
    }

    return null;
  } catch (error) {
    console.error("Error retrieving token data from cookies:", error);
    return null;
  }
};

/**
 * Get only the access token from cookies
 */
export const getAccessToken = (): string | null => {
  return getCookie(COOKIE_NAMES.ACCESS_TOKEN);
};

/**
 * Get only the refresh token from cookies
 */
export const getRefreshToken = (): string | null => {
  return getCookie(COOKIE_NAMES.REFRESH_TOKEN);
};

/**
 * Check if access token is expired
 */
export const isTokenExpired = (): boolean => {
  try {
    const expiration = getCookie(COOKIE_NAMES.TOKEN_EXPIRATION);
    if (!expiration) return true;

    const expirationDate = new Date(expiration);
    const now = new Date();

    // Add a 5-minute buffer to refresh token before it expires
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return expirationDate.getTime() - bufferTime <= now.getTime();
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Check if refresh token is expired
 */
export const isRefreshTokenExpired = (): boolean => {
  try {
    const refreshTokenExpiration = getCookie(
      COOKIE_NAMES.REFRESH_TOKEN_EXPIRATION
    );
    if (!refreshTokenExpiration) return true;

    const expirationDate = new Date(refreshTokenExpiration);
    const now = new Date();

    return expirationDate.getTime() <= now.getTime();
  } catch (error) {
    console.error("Error checking refresh token expiration:", error);
    return true;
  }
};

/**
 * Clear all authentication cookies
 */
export const clearTokenData = (): void => {
  try {
    Object.values(COOKIE_NAMES).forEach((cookieName) => {
      deleteCookie(cookieName);
    });
  } catch (error) {
    console.error("Error clearing token data from cookies:", error);
  }
};

/**
 * Store user data in cookies (non-sensitive data)
 */
export const storeUserData = (userData: {
  phone: string;
  fName?: string;
  lName?: string;
}): void => {
  try {
    const userDataString = JSON.stringify(userData);
    setCookie("user_data", userDataString);
  } catch (error) {
    console.error("Error storing user data in cookies:", error);
  }
};

/**
 * Get user data from cookies
 */
export const getUserData = (): {
  phone: string;
  fName?: string;
  lName?: string;
} | null => {
  try {
    const userDataString = getCookie("user_data");
    if (userDataString) {
      return JSON.parse(userDataString);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving user data from cookies:", error);
    return null;
  }
};

/**
 * Clear user data from cookies
 */
export const clearUserData = (): void => {
  try {
    deleteCookie("user_data");
  } catch (error) {
    console.error("Error clearing user data from cookies:", error);
  }
};
