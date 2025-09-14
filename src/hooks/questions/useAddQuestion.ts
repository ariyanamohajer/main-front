import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsService } from "@/services/questions";
import { toast } from "sonner";
import type { AddQuestionRequest } from "@/types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useAddQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddQuestionRequest) =>
      questionsService.addNewProductQuestion(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "پرسش با موفقیت اضافه شد");
        // Invalidate and refetch questions for this product
        queryClient.invalidateQueries({
          queryKey: ["userQuestions"],
        });
        // Also invalidate the product data to refresh the questions count
        queryClient.invalidateQueries({
          queryKey: ["product"],
        });
      } else {
        toast.error(response.message || "خطا در افزودن پرسش");
      }
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "خطا در افزودن پرسش";
      toast.error(errorMessage);
    },
  });
};
