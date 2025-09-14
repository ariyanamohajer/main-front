import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest, RegisterResponse } from "@/types";
import { registerUser } from "@/services/auth/register";
import { AxiosError } from "axios";

interface UseRegisterOptions {
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (error: AxiosError) => void;
}

export const useRegister = (options?: UseRegisterOptions) => {
  return useMutation<RegisterResponse, AxiosError, RegisterRequest>({
    mutationFn: registerUser,
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
