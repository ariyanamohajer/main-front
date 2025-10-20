import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    "https://api.panel.arianamohajer.ir/api",
  withCredentials: true,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
  comment: {
    getLastComment: "/Product/GetLastComments",
  },
};
