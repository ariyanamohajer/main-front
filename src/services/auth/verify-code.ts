import { axiosInstance, endpoints } from "../config/config";
import type { VerifyCodeRequest, VerifyCodeResponse } from "@/types";

export const verifyCode = async (
  data: VerifyCodeRequest,
  keyResponse?: string
): Promise<VerifyCodeResponse> => {
  const headers: Record<string, string> = {};

  // Add KeyResponse header for future Google Captcha support
  if (keyResponse) {
    headers.KeyResponse = keyResponse;
  }

  const response = await axiosInstance.post<VerifyCodeResponse>(
    endpoints.auth.verifyCode,
    data,
    { headers }
  );

  return response.data;
};
