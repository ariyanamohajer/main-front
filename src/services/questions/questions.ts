import { axiosInstance, endpoints } from "@/services/config/config";
import type {
  ProductQuestionsResponse,
  ProductQuestionsQueryParams,
  AddQuestionRequest,
  UpdateQuestionRequest,
  RemoveQuestionRequest,
  QuestionOperationResponse,
} from "@/types";

export const questionsService = {
  /**
   * Get product questions with optional pagination and filters
   */
  getUserQuestions: async (
    params: ProductQuestionsQueryParams
  ): Promise<ProductQuestionsResponse> => {
    const queryParams = new URLSearchParams();

    // Required parameter
    queryParams.append(
      "Pagination.PageIndex",
      params["Pagination.PageIndex"].toString()
    );

    // Optional parameters
    if (params.ProductId) {
      queryParams.append("ProductId", params.ProductId);
    }

    if (params.MinInsertTime) {
      queryParams.append("MinInsertTime", params.MinInsertTime);
    }

    if (params.MaxInsertTime) {
      queryParams.append("MaxInsertTime", params.MaxInsertTime);
    }

    if (params["Pagination.Filter"]) {
      queryParams.append("Pagination.Filter", params["Pagination.Filter"]);
    }

    if (params["Pagination.PageSize"]) {
      queryParams.append(
        "Pagination.PageSize",
        params["Pagination.PageSize"].toString()
      );
    }

    const response = await axiosInstance.get<ProductQuestionsResponse>(
      `${endpoints.products.getUserQuestions}?${queryParams.toString()}`
    );

    return response.data;
  },

  /**
   * Add a new product question
   */
  addNewProductQuestion: async (
    data: AddQuestionRequest
  ): Promise<QuestionOperationResponse> => {
    const response = await axiosInstance.post<QuestionOperationResponse>(
      endpoints.products.addNewProductQuestion,
      null,
      {
        headers: {
          "Content-Type": "application/json",
          KeyResponse: "22",
        },
        params: {
          ProductId: data.ProductId,
          Text: data.Text,
        },
      }
    );

    return response.data;
  },

  /**
   * Update an existing product question
   */
  updateProductQuestion: async (
    data: UpdateQuestionRequest
  ): Promise<QuestionOperationResponse> => {
    const response = await axiosInstance.post<QuestionOperationResponse>(
      endpoints.products.updateProductQuestion,
      null,
      {
        headers: {
          "Content-Type": "application/json",
          KeyResponse: "22",
        },
        params: {
          QuestionId: data.QuestionId,
          Text: data.Text,
        },
      }
    );

    return response.data;
  },

  /**
   * Remove a product question
   */
  removeProductQuestion: async (
    data: RemoveQuestionRequest
  ): Promise<QuestionOperationResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append("QuestionId", data.QuestionId);

    const response = await axiosInstance.delete<QuestionOperationResponse>(
      `${endpoints.products.removeProductQuestion}?${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          KeyResponse: "22",
        },
      }
    );

    return response.data;
  },
};
