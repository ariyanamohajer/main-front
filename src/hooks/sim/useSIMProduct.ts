// src/hooks/sim/useGetProductSim.ts
import { useQuery } from "@tanstack/react-query";
import { getSIMProduct } from "@/services/sim";
import type { SingleSIMProductResponse } from "@/types";

export const useSIMProduct = (productId?: string) => {
  return useQuery<SingleSIMProductResponse>({
    queryKey: ["sim-product", productId],
    queryFn: () => getSIMProduct(productId as string),
    enabled: !!productId && productId.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
