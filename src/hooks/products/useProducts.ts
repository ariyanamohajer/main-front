import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products/products";
import type { ProductsQueryParams } from "@/types";

export const useProducts = (params: ProductsQueryParams = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
