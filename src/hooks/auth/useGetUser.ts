import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getUserInfo } from "@/services/auth/user";
import type { ApiResponse, GetUserInfoResult } from "@/types";

export const USER_INFO_QUERY_KEY = ["auth", "userInfo"] as const;

export const useGetUser = (options?: { enabled?: boolean }) => {
  return useQuery<ApiResponse<GetUserInfoResult>, AxiosError>({
    queryKey: USER_INFO_QUERY_KEY,
    queryFn: getUserInfo,
    enabled: options?.enabled ?? true,
  });
};
