import type { GetBankAccountsResponse } from "@/types";
import { axiosInstance, endpoints } from "../config/config";

export const getBankAccounts = async (): Promise<GetBankAccountsResponse> => {
  const response = await axiosInstance.get<GetBankAccountsResponse>(
    endpoints.wallet.getBankAccounts
  );

  return response.data;
};
