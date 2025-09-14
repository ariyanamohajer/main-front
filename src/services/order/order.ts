// src/services/orders.service.ts
import type { GetLocalSIMOrdersParams, GetLocalSIMOrdersResponse, GetOrdersParams, GetOrdersResponse } from "@/types/order";
import { axiosInstance } from "../config/config";



/** /Order/GetOrders */
export async function getOrdersService(params: GetOrdersParams) {
  const { data } = await axiosInstance.get<{
    result: GetOrdersResponse;
    success: boolean;
    message?: string;
  }>("/Order/GetOrders", { params });
  return data;
}

/** /Order/GetLocalSIMOrders */
export async function getLocalSIMOrdersService(
  params: GetLocalSIMOrdersParams
) {
  const { data } = await axiosInstance.get<{
    result: GetLocalSIMOrdersResponse;
    success: boolean;
    message?: string;
  }>("/Order/GetLocalSIMOrders", { params });
  return data;
}
