import { updatePersonalInfo } from "@/services/auth/user";
import type {
  UpdatePersonalInfoRequest,
  UpdatePersonalInfoResponse,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AxiosError } from "axios";

interface UseUpdateUserInfoOptions {
  onSuccess?: (data: UpdatePersonalInfoResponse) => void;
  onError?: (error: AxiosError) => void;
}

export const useUpdateUserInfo = (options?: UseUpdateUserInfoOptions) => {
  const qc = useQueryClient();

  return useMutation<
    UpdatePersonalInfoResponse,
    AxiosError,
    UpdatePersonalInfoRequest
  >({
    mutationFn: updatePersonalInfo,
    onSuccess: (data) => {
      if (data.success) {
        // Refresh cached user info
        qc.invalidateQueries({ queryKey: ["auth", "userInfo"] });
        options?.onSuccess?.(data);
      } else {
        const error = new Error(data.message) as AxiosError;
        options?.onError?.(error);
      }
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
