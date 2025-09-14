import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  commentsService,
  type UpdateCommentRequest,
} from "@/services/comments/comments";

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCommentRequest) =>
      commentsService.updateComment(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "نظر شما با موفقیت ویرایش شد");
        // Invalidate and refetch the product data to get updated comments
        queryClient.invalidateQueries({
          queryKey: ["product"],
        });
      } else {
        toast.error(response.message || "خطا در ویرایش نظر");
      }
    },
    onError: (error: Error) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError?.response?.data?.message ||
        error.message ||
        "خطا در ویرایش نظر";
      toast.error(message);
    },
  });
};
