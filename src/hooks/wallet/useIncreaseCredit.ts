import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { increaseWalletCredit } from "@/services/wallet";
import type {
  IncreaseWalletCreditRequest,
  IncreaseWalletCreditResponse,
} from "@/types";
import { WALLET_BALANCE_QUERY_KEY } from "./useWalletBalance";

interface UseIncreaseCreditOptions {
  onSuccess?: (data: IncreaseWalletCreditResponse) => void;
  onError?: (error: AxiosError) => void;
}

export const useIncreaseCredit = (options?: UseIncreaseCreditOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    IncreaseWalletCreditResponse,
    AxiosError,
    IncreaseWalletCreditRequest
  >({
    mutationFn: increaseWalletCredit,
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate related queries to refetch fresh data
        queryClient.invalidateQueries({ queryKey: WALLET_BALANCE_QUERY_KEY });
        queryClient.invalidateQueries({
          queryKey: ["wallet", "transactions"],
        });
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
