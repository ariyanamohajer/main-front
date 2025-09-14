import { changePassword } from "@/services/auth/user";
import type { ChangePasswordRequest, ChangePasswordResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";

import { AxiosError } from "axios";

interface UseChangePassOptions {
  onSuccess?: (data: ChangePasswordResponse) => void;
  onError?: (error: AxiosError) => void;
}

export const useChangePass = (options?: UseChangePassOptions) => {
  return useMutation<ChangePasswordResponse, AxiosError, ChangePasswordRequest>(
    {
      mutationFn: changePassword,
      onSuccess: (data) => {
        if (data.success) {
          options?.onSuccess?.(data);
        } else {
          const error = new Error(data.message) as AxiosError;
          options?.onError?.(error);
        }
      },
      onError: (error) => {
        options?.onError?.(error);
      },
    }
  );
};
