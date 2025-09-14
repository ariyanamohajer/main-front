import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  commentsService,
  type RemoveCommentRequest,
} from "@/services/comments/comments";

export const useRemoveComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveCommentRequest) =>
      commentsService.removeComment(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "نظر شما با موفقیت حذف شد", {
          style: {
            background: "var(--destructive)",
            color: "white",
          },
        });
        // Invalidate and refetch the product data to get updated comments
        queryClient.invalidateQueries({
          queryKey: ["product"],
        });
      } else {
        toast.error(response.message || "خطا در حذف نظر");
      }
    },
    onError: (error: Error) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError?.response?.data?.message ||
        error.message ||
        "خطا در حذف نظر";
      toast.error(message);
    },
  });
};
