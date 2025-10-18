//

// src/utils/cookie-utils.ts
import type { TokenData } from "@/types";

// Cookie names
const COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_EXPIRATION: "token_expiration", // legacy/optional
  REFRESH_TOKEN_EXPIRATION: "refresh_token_expiration", // legacy/optional
} as const;

// Cookie configuration
const COOKIE_CONFIG = {
  secure: window.location.protocol === "https:",
  sameSite: (import.meta.env.VITE_COOKIE_SAMESITE || "Lax") as
    | "Lax"
    | "Strict"
    | "None",
  path: "/",
  domain:
    window.location.hostname === "localhost"
      ? "localhost"
      : ".arianamohajer.ir",
};

/** Set a cookie (session cookie if no expirationDate) */
const setCookie = (name: string, value: string, expirationDate?: string) => {
  let cookie = `${name}=${encodeURIComponent(value)}; Path=${
    COOKIE_CONFIG.path
  }; SameSite=${COOKIE_CONFIG.sameSite}`;
  if (COOKIE_CONFIG.secure) cookie += "; Secure";
  if (COOKIE_CONFIG.domain) cookie += `; Domain=${COOKIE_CONFIG.domain}`;
  if (expirationDate)
    cookie += `; Expires=${new Date(expirationDate).toUTCString()}`;
  document.cookie = cookie;
};

/** Get a cookie by name */
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
};

/** Delete a cookie by name */
const deleteCookie = (name: string) => {
  let cookie = `${name}=; Path=${COOKIE_CONFIG.path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=${COOKIE_CONFIG.sameSite}`;
  if (COOKIE_CONFIG.domain) cookie += `; Domain=${COOKIE_CONFIG.domain}`;
  document.cookie = cookie;
};

/** Store token data (session-only by default) */
export const storeTokenData = (
  tokenData: TokenData,
  opts?: { sessionOnly?: boolean }
) => {
  const sessionOnly = opts?.sessionOnly ?? true;

  setCookie(
    COOKIE_NAMES.ACCESS_TOKEN,
    tokenData.token,
    sessionOnly ? undefined : tokenData.expiration
  );
  setCookie(
    COOKIE_NAMES.REFRESH_TOKEN,
    tokenData.refreshToken,
    sessionOnly ? undefined : tokenData.refreshTokenExpiration
  );

  if (sessionOnly) {
    // clean up old expiration cookies if they existed
    deleteCookie(COOKIE_NAMES.TOKEN_EXPIRATION);
    deleteCookie(COOKIE_NAMES.REFRESH_TOKEN_EXPIRATION);
  } else {
    if (tokenData.expiration) {
      setCookie(
        COOKIE_NAMES.TOKEN_EXPIRATION,
        tokenData.expiration,
        tokenData.expiration
      );
    }
    if (tokenData.refreshTokenExpiration) {
      setCookie(
        COOKIE_NAMES.REFRESH_TOKEN_EXPIRATION,
        tokenData.refreshTokenExpiration,
        tokenData.refreshTokenExpiration
      );
    }
  }
};

/** Read tokens back (works for session-only) */
export const getTokenData = (): TokenData | null => {
  const token = getCookie(COOKIE_NAMES.ACCESS_TOKEN);
  const refreshToken = getCookie(COOKIE_NAMES.REFRESH_TOKEN);
  if (!token || !refreshToken) return null;

  return {
    token,
    refreshToken,
    // Default to empty strings to satisfy `TokenData`'s required fields
    expiration: getCookie(COOKIE_NAMES.TOKEN_EXPIRATION) ?? "",
    refreshTokenExpiration:
      getCookie(COOKIE_NAMES.REFRESH_TOKEN_EXPIRATION) ?? "",
  };
};

export const getAccessToken = (): string | null =>
  getCookie(COOKIE_NAMES.ACCESS_TOKEN);
export const getRefreshToken = (): string | null =>
  getCookie(COOKIE_NAMES.REFRESH_TOKEN);

/** With session-only we don't auto-expire client-side */
export const isTokenExpired = (): boolean => false;

/** Clear everything */
export const clearTokenData = (): void => {
  Object.values(COOKIE_NAMES).forEach(deleteCookie);
};

/** Store non-sensitive user data */
export const storeUserData = (
  userData: {
    phone: string;
    fName?: string;
    lName?: string;
  },
  expirationDate?: string
) => {
  setCookie("user_data", JSON.stringify(userData), expirationDate);
};

export const getUserData = (): {
  phone: string;
  fName?: string;
  lName?: string;
} | null => {
  const raw = getCookie("user_data");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearUserData = (): void => deleteCookie("user_data");
