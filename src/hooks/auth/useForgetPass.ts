import { useMutation } from "@tanstack/react-query";
import type { ForgetPasswordRequest, ForgetPasswordResponse } from "@/types";
import { AxiosError } from "axios";
import { forgetPassUser } from "@/services/auth/forget-pass";

interface useForgetPassOptions {
  onSuccess?: (data: ForgetPasswordResponse) => void;
  onError?: (error: AxiosError) => void;
}

export const useForgetPass = (options?: useForgetPassOptions) => {
  return useMutation<ForgetPasswordResponse, AxiosError, ForgetPasswordRequest>({
    mutationFn: forgetPassUser,
    onSuccess: (data) => {
      if (data.success) {
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
