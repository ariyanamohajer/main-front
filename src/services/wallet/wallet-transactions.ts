import type {
  GetWalletTransactionsRequest,
  GetWalletTransactionsResponse,
} from "@/types";
import { axiosInstance, endpoints } from "../config/config";

export const getWalletTransactions = async (
  params: GetWalletTransactionsRequest
): Promise<GetWalletTransactionsResponse> => {
  const queryParams = new URLSearchParams();

  // Required parameters
  queryParams.append(
    "Pagination.PageIndex",
    params.pagination.pageIndex.toString()
  );

  // Optional parameters
  if (params.pagination.filter) {
    queryParams.append("Pagination.Filter", params.pagination.filter);
  }
  if (params.pagination.pageSize) {
    queryParams.append(
      "Pagination.PageSize",
      params.pagination.pageSize.toString()
    );
  }
  if (params.type) {
    queryParams.append("Type", params.type.toString());
  }

  const response = await axiosInstance.get<GetWalletTransactionsResponse>(
    `${endpoints.wallet.getTransactions}?${queryParams.toString()}`
  );

  return response.data;
};
