import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/products/category";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
