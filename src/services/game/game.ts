// src/services/game.ts
import { axiosInstance } from "@/services/config/config";
import type {
  AddGameAccountRequest,
  AddGameAccountResponse,
  GetGameAccountsParams,
  GetGameAccountsResponse,
  AddNewGameOrderRequest,
  AddNewGameOrderResponse,
} from "@/types/game";

const ENDPOINTS = {
  addAccount: "/UserAccount/AddGameAccount",
  getAccounts: "/UserAccount/GetGameAccounts",
  addOrder: "/Order/AddNewGameOrder",
} as const;

// Add account
export const addGameAccount = async (
  body: AddGameAccountRequest
): Promise<AddGameAccountResponse> => {
  const { data } = await axiosInstance.post<AddGameAccountResponse>(
    ENDPOINTS.addAccount,
    body
  );
  return data;
};

// Get accounts (by game)
export const getGameAccounts = async (
  params: GetGameAccountsParams
): Promise<GetGameAccountsResponse> => {
  const url = `${ENDPOINTS.getAccounts}?game=${params.game}`;
  const { data } = await axiosInstance.get<GetGameAccountsResponse>(url);
  return data;
};

// Add new order (NOTE: key must be 'prodcutId' per backend)
export const addNewGameOrder = async (
  body: AddNewGameOrderRequest
): Promise<AddNewGameOrderResponse> => {
  const { data } = await axiosInstance.post<AddNewGameOrderResponse>(
    ENDPOINTS.addOrder,
    body
  );
  return data;
};
