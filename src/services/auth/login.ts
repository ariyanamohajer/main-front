import type { LoginRequest, LoginResponse } from "@/types";
import { axiosInstance, endpoints } from "../config/config";

export const loginUser = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    endpoints.auth.login,
    loginData,
    {
      headers: {
        keyResponse: "22", // Empty for now, will be used for Google Captcha later
      },
    }
  );

  return response.data;
};
