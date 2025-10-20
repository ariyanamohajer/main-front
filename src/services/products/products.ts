import { axiosInstance, endpoints } from "@/services/config/config";
import type {
  ProductsResponse,
  ProductsQueryParams,
  SingleProductResponse,
  GetLastCommentsResponse,
} from "@/types";

export const productsService = {
  /**
   * Get all products with optional pagination and filters
   */
  getProducts: async (
    params: ProductsQueryParams = {}
  ): Promise<ProductsResponse> => {
    const { pageIndex = 0, pageSize, filter, categoryId } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("Pagination.PageIndex", pageIndex.toString());

    if (pageSize !== undefined) {
      queryParams.append("Pagination.PageSize", pageSize.toString());
    }

    if (filter) {
      queryParams.append("Pagination.Filter", filter);
    }

    if (categoryId && categoryId > 0) {
      queryParams.append("CategoryId", categoryId.toString());
    }

    const response = await axiosInstance.get<ProductsResponse>(
      `${endpoints.products.getProducts}?${queryParams.toString()}`
    );

    return response.data;
  },

  /**
   * Get a single product by name
   */
  getProduct: async (productName: string): Promise<SingleProductResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("ProductName", productName);

    const response = await axiosInstance.get<SingleProductResponse>(
      `${endpoints.products.getProduct}?${queryParams.toString()}`
    );

    return response.data;
  },

  /**
   * Get the latest product comments
   */
  getLastComments: async (): Promise<GetLastCommentsResponse> => {
    const response = await axiosInstance.get<GetLastCommentsResponse>(
      endpoints.comment.getLastComment
    );

    return response.data;
  },
};
