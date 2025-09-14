import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products/products";

export const useProduct = (productName: string) => {
  return useQuery({
    queryKey: ["product", productName],
    queryFn: () => productsService.getProduct(productName),
    enabled: !!productName, // Only run query if productName is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
