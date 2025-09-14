import type { ForgetPasswordRequest, ForgetPasswordResponse, VerifyForgetPassRequest, VerifyForgetPassResponse } from "@/types";
import { axiosInstance, endpoints } from "../config/config";

export const forgetPassUser = async (
  forgetPassData: ForgetPasswordRequest
): Promise<ForgetPasswordResponse> => {
  const response = await axiosInstance.post<ForgetPasswordResponse>(
    endpoints.auth.forgetPass,
    forgetPassData,
    {
      headers: {
        keyResponse: "22",
      },
    }
  );

  return response.data;
};




export const verifyForgetPass = async (
  data: VerifyForgetPassRequest,
  keyResponse?: string
): Promise<VerifyForgetPassResponse> => {
  const headers: Record<string, string> = {};

  // Add KeyResponse header for future Google Captcha support
  if (keyResponse) {
    headers.KeyResponse = keyResponse;
  }

  const response = await axiosInstance.post<VerifyForgetPassResponse>(
    endpoints.auth.verifyForgetPass,
    data,
    { headers }
  );

  return response.data;
};



