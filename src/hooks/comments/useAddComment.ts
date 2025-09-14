import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  commentsService,
  type AddCommentRequest,
} from "@/services/comments/comments";

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCommentRequest) => commentsService.addComment(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "نظر شما با موفقیت ثبت شد");
        // Invalidate and refetch the product data to get updated comments
        queryClient.invalidateQueries({
          queryKey: ["product"],
        });
      } else {
        toast.error(response.message || "خطا در ثبت نظر");
      }
    },
    onError: (error: Error) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError?.response?.data?.message ||
        error.message ||
        "خطا در ثبت نظر";
      toast.error(message);
    },
  });
};
