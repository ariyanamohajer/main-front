// src/hooks/games/useAddNewGameOrder.ts
import { useMutation } from "@tanstack/react-query";
import type {
  AddNewGameOrderRequest,
  AddNewGameOrderResponse,
} from "@/types/game";
import { toast } from "sonner";
import { addNewGameOrder } from "@/services/game/game";

export const useAddNewGameOrder = () =>
  useMutation<AddNewGameOrderResponse, Error, AddNewGameOrderRequest>({
    mutationFn: addNewGameOrder,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "سفارش با موفقیت ثبت شد");
      } else {
        toast.error(res.message || "ثبت سفارش ناموفق بود");
      }
    },
    onError: () => toast.error("خطا در ثبت سفارش"),
  });
