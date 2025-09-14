import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { VerifyCodeRequest, VerifyCodeResponse } from "@/types";
import { verifyCode } from "@/services/auth/verify-code";

interface UseVerifyCodeOptions {
  onSuccess?: (data: VerifyCodeResponse) => void;
  onError?: (error: AxiosError) => void;
}

interface VerifyCodeMutationParams extends VerifyCodeRequest {
  keyResponse?: string; // For future Google Captcha support
}

export const useVerifyCode = (options?: UseVerifyCodeOptions) => {
  return useMutation<VerifyCodeResponse, AxiosError, VerifyCodeMutationParams>({
    mutationFn: ({ ...data }) => verifyCode(data, "22"),
    onSuccess: (data) => {
      if (data.success) {
        // Don't store token here - let the AuthContext handle it
        options?.onSuccess?.(data);
      } else {
        // Handle API-level errors (success: false)
        const error = new Error(data.message) as AxiosError;
        options?.onError?.(error);
      }
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
