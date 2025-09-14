import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getBankAccounts } from "@/services/wallet";
import type { GetBankAccountsResponse } from "@/types";

export const BANK_ACCOUNTS_QUERY_KEY = ["wallet", "bankAccounts"] as const;

export const useBankAccounts = (options?: { enabled?: boolean }) => {
  return useQuery<GetBankAccountsResponse, AxiosError>({
    queryKey: BANK_ACCOUNTS_QUERY_KEY,
    queryFn: getBankAccounts,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 10, // 10 minutes - bank accounts don't change often
  });
};
