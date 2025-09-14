import type { RegisterRequest, RegisterResponse } from "@/types";
import { axiosInstance, endpoints } from "../config/config";

export const registerUser = async (
  registerData: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>(
    endpoints.auth.register,
    registerData,
    {
      headers: {
        keyResponse: "22", // Empty for now, will be used for Google Captcha later
      },
    }
  );

  return response.data;
};
