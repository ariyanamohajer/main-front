// src/hooks/games/useAddGameAccount.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AddGameAccountRequest,
  AddGameAccountResponse,
} from "@/types/game";
import { toast } from "sonner";
import { addGameAccount } from "@/services/game/game";

export const useAddGameAccount = () => {
  const qc = useQueryClient();

  return useMutation<AddGameAccountResponse, Error, AddGameAccountRequest>({
    mutationFn: addGameAccount,
    onSuccess: (res, vars) => {
      if (res.success) {
        toast.success(res.message || "اکانت با موفقیت افزوده شد");
        qc.invalidateQueries({ queryKey: ["game-accounts", vars.game] });
      } else {
        toast.error(res.message || "خطا در افزودن اکانت");
      }
    },
    onError: () => toast.error("خطا در ارتباط با سرور"),
  });
};
