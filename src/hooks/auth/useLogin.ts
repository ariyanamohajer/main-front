import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "@/types";
import { loginUser } from "@/services/auth/login";
import { AxiosError } from "axios";

interface UseLoginOptions {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: AxiosError) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  return useMutation<LoginResponse, AxiosError, LoginRequest>({
    mutationFn: loginUser,
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
