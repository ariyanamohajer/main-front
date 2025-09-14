import { axiosInstance, endpoints } from "@/services/config/config";
import type { CategoriesResponse } from "@/types";

export const categoryService = {
  /**
   * Get all product categories
   */
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await axiosInstance.get<CategoriesResponse>(
      endpoints.products.getCategories
    );

    return response.data;
  },
};
