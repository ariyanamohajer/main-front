import type { GetWalletBalanceResponse } from "@/types";
import { axiosInstance, endpoints } from "../config/config";

export const getWalletBalance = async (): Promise<GetWalletBalanceResponse> => {
  const response = await axiosInstance.get<GetWalletBalanceResponse>(
    endpoints.wallet.getBalance
  );

  return response.data;
};
