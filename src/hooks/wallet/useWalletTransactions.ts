import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getWalletTransactions } from "@/services/wallet";
import type {
  GetWalletTransactionsRequest,
  GetWalletTransactionsResponse,
  TransactionType,
} from "@/types";

export const WALLET_TRANSACTIONS_QUERY_KEY = [
  "wallet",
  "transactions",
] as const;

interface UseWalletTransactionsOptions {
  pageIndex?: number;
  pageSize?: number;
  filter?: string;
  type?: TransactionType;
  enabled?: boolean;
}

export const useWalletTransactions = (
  options?: UseWalletTransactionsOptions
) => {
  const params: GetWalletTransactionsRequest = {
    pagination: {
      pageIndex: options?.pageIndex ?? 1,
      pageSize: options?.pageSize ?? 16,
      filter: options?.filter,
    },
    type: options?.type,
  };

  return useQuery<GetWalletTransactionsResponse, AxiosError>({
    queryKey: [
      ...WALLET_TRANSACTIONS_QUERY_KEY,
      params.pagination.pageIndex,
      params.pagination.pageSize,
      params.pagination.filter,
      params.type,
    ],
    queryFn: () => getWalletTransactions(params),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData, // For pagination
  });
};
