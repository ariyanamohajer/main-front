import { useQuery } from "@tanstack/react-query";
import { questionsService } from "@/services/questions";
import type { ProductQuestionsQueryParams } from "@/types";

export const useGetUserQuestions = (params: ProductQuestionsQueryParams) => {
  return useQuery({
    queryKey: ["userQuestions", params],
    queryFn: () => questionsService.getUserQuestions(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled:
      !!params["Pagination.PageIndex"] || params["Pagination.PageIndex"] === 0,
  });
};
