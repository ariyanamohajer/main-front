import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsService } from "@/services/questions";
import { toast } from "sonner";
import type { RemoveQuestionRequest } from "@/types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useRemoveQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveQuestionRequest) =>
      questionsService.removeProductQuestion(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "پرسش با موفقیت حذف شد");
        // Invalidate and refetch questions
        queryClient.invalidateQueries({
          queryKey: ["userQuestions"],
        });
        // Also invalidate the product data
        queryClient.invalidateQueries({
          queryKey: ["product"],
        });
      } else {
        toast.error(response.message || "خطا در حذف پرسش");
      }
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || "خطا در حذف پرسش";
      toast.error(errorMessage);
    },
  });
};
