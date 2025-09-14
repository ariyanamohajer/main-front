import axios from "axios";
import type { RefreshTokenResponse } from "@/types";
import {
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  isRefreshTokenExpired,
  storeTokenData,
  clearTokenData,
} from "@/lib/cookie-utils";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Flag to prevent multiple refresh token calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: Error) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

// Refresh token function
const refreshToken = async (): Promise<string> => {
  const currentRefreshToken = getRefreshToken();

  if (!currentRefreshToken || isRefreshTokenExpired()) {
    throw new Error("No valid refresh token available");
  }

  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${axiosInstance.defaults.baseURL}/Authentication/RefreshToken`,
      { refreshToken: currentRefreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          keyResponse: "22", // For future Google Captcha support
        },
      }
    );

    if (response.data.success) {
      const tokenData = response.data.result;
      storeTokenData(tokenData);
      return tokenData.token;
    } else {
      throw new Error(response.data.message || "Token refresh failed");
    }
  } catch (error) {
    clearTokenData();
    // Redirect to login page
    window.location.href = "/auth/login";
    throw error;
  }
};

// Request interceptor - Add token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    // Skip token for auth endpoints
    if (
      config.url?.includes("/Authentication/") &&
      !config.url?.includes("/RefreshToken")
    ) {
      return config;
    }

    let token = getAccessToken();

    // Check if token needs refresh
    if (token && isTokenExpired()) {
      if (isRefreshing) {
        // If refresh is in progress, queue this request
        token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      } else {
        isRefreshing = true;
        try {
          token = await refreshToken();
          processQueue(null, token);
        } catch (error) {
          const refreshError =
            error instanceof Error ? error : new Error("Token refresh failed");
          processQueue(refreshError, null);
          throw error;
        } finally {
          isRefreshing = false;
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Skip refresh for auth endpoints
      if (
        originalRequest.url?.includes("/Authentication/") &&
        !originalRequest.url?.includes("/RefreshToken")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If refresh is in progress, queue this request
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const error =
          refreshError instanceof Error
            ? refreshError
            : new Error("Token refresh failed");
        processQueue(error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - might indicate invalid/expired refresh token
      clearTokenData();
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };

export const endpoints = {
  auth: {
    register: "/Authentication/Register",
    login: "/Authentication/Login",
    verifyCode: "/Authentication/VerifyCode",
    refreshToken: "/Authentication/RefreshToken",
    forgetPass: "/UserAccount/ForgotPass",
    verifyForgetPass: "/UserAccount/VerifyCode",
  },
  products: {
    getProducts: "/Product/GetProducts",
    getCategories: "/Product/GetCategories",
    getProduct: "/Product/GetProduct",
    getUserQuestions: "/Product/GetUserQuestions",
    addNewProductQuestion: "/Product/AddNewProductQuestion",
    updateProductQuestion: "/Product/UpdateProductQuestion",
    removeProductQuestion: "/Product/RemoveProductQuestion",
  },
  user: {
    getUserInfo: "/UserAccount/GetUserInfo",
    updateUserInfo: "/UserAccount/UpdatePersonalInfo",
    updatePassword: "/UserAccount/ChangePass",
    contactUs: "/Other/AddNewMessage",
  },
  wallet: {
    increaseCredit: "/Wallet/IncreaseWalletCredit",
    getBalance: "/Wallet/GetWalletBalance",
    getTransactions: "/Wallet/GetWalletTransactions",
    getBankAccounts: "/Wallet/GetBankAccounts",
  },
};
