// src/hooks/sim/useCreateSIMOrder.ts
import { useMutation } from "@tanstack/react-query";
import { createSIMOrder } from "@/services/sim";
import type { CreateSIMOrderRequest, CreateSIMOrderResponse } from "@/types";
import { toast } from "sonner";

export const useCreateSIMOrder = () =>
  useMutation<CreateSIMOrderResponse, Error, CreateSIMOrderRequest>({
    mutationFn: createSIMOrder,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "سفارش با موفقیت ایجاد شد");
      } else {
        toast.error(response.message || "خطا در ایجاد سفارش");
      }
    },
  });
