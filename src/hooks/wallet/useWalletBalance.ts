import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getWalletBalance } from "@/services/wallet";
import type { GetWalletBalanceResponse } from "@/types";

export const WALLET_BALANCE_QUERY_KEY = ["wallet", "balance"] as const;

export const useWalletBalance = (options?: { enabled?: boolean }) => {
  return useQuery<GetWalletBalanceResponse, AxiosError>({
    queryKey: WALLET_BALANCE_QUERY_KEY,
    queryFn: getWalletBalance,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
