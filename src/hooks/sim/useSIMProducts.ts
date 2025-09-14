import { useQuery } from "@tanstack/react-query";
import { getSIMProducts, searchSIMProducts } from "@/services/sim";
import type { SIMProductsQueryParams } from "@/types";

export const useSIMProducts = (params: SIMProductsQueryParams = {}) => {
  return useQuery({
    queryKey: ["sim-products", params],
    queryFn: () => getSIMProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchSIMProducts = (
  searchTerm: string,
  pageIndex: number = 0
) => {
  return useQuery({
    queryKey: ["sim-products-search", searchTerm, pageIndex],
    queryFn: () => searchSIMProducts(searchTerm, pageIndex),
    enabled: !!searchTerm.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};
