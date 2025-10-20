import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products/products";

type UseGetLastCommentOptions = {
  enabled?: boolean;
};

export const useGetLastComment = (
  options: UseGetLastCommentOptions = {}
) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["lastProductComments"],
    queryFn: () => productsService.getLastComments(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
};
