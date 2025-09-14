// src/hooks/orders/useOrders.ts
import { getLocalSIMOrdersService, getOrdersService } from "@/services/order/order";
import type { GetLocalSIMOrdersParams, GetLocalSIMOrdersResponse, GetOrdersParams, GetOrdersResponse } from "@/types/order";
import { useQuery } from "@tanstack/react-query";


export function useOrders(params: GetOrdersParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const res = await getOrdersService(params);
      if (!res.success) {
        throw new Error(res?.message || "خطا در دریافت سفارش‌ها");
      }
      return res.result as GetOrdersResponse;
    },
    // keepPreviousData: true,
  });
}

export function useLocalSIMOrders(params: GetLocalSIMOrdersParams) {
  return useQuery({
    queryKey: ["local-sim-orders", params],
    queryFn: async () => {
      const res = await getLocalSIMOrdersService(params);
      if (!res.success) {
        throw new Error(res?.message || "خطا در دریافت سفارش‌های شارژ داخلی");
      }
      return res.result as GetLocalSIMOrdersResponse;
    },
    // keepPreviousData: true,
  });
}
