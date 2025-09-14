import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type {
  VerifyForgetPassRequest,
  VerifyForgetPassResponse,
} from "@/types";
import { verifyForgetPass } from "@/services/auth/forget-pass";

interface useVerifyForgetPassOptions {
  onSuccess?: (data: VerifyForgetPassResponse) => void;
  onError?: (error: AxiosError) => void;
}

interface VerifyCodeMutationParams extends VerifyForgetPassRequest {
  keyResponse?: string; // For future Google Captcha support
}

export const useVerifyForgetPass = (options?: useVerifyForgetPassOptions) => {
  return useMutation<
    VerifyForgetPassResponse,
    AxiosError,
    VerifyCodeMutationParams
  >({
    mutationFn: ({ ...data }) => verifyForgetPass(data, "22"),
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
