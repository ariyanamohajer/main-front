// src/hooks/orders/useDirectRecharge.ts
import { createDirectRecharge } from "@/services/sim";
import type { CreateDirectRechargeRequest, CreateDirectRechargeResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

export const useDirectRecharge = () =>
  useMutation<CreateDirectRechargeResponse, Error, CreateDirectRechargeRequest>(
    {
      mutationFn: async (payload) => {
        const res = await createDirectRecharge(payload);
        if (!res.success) {
          throw new Error(res.message || "خطا در ثبت شارژ مستقیم");
        }
        return res;
      },
      onSuccess: (res) => {
        toast.success(res.message || "ثبت سفارش شما با موفقیت انجام شد");
      },
      onError: (err) => {
        toast.error(err.message || "خطایی رخ داد");
      },
    }
  );
