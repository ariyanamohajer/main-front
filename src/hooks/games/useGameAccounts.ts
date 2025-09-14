// src/hooks/games/useGameAccounts.ts
import { useQuery } from "@tanstack/react-query";
import { normalizeGameAccounts } from "@/types/game";
import type { GameType } from "@/types/game";
import { getGameAccounts } from "@/services/game/game";

export const useGameAccounts = (game: GameType | null) => {
  return useQuery({
    queryKey: ["game-accounts", game],
    queryFn: async () => {
      if (!game) return [];
      const res = await getGameAccounts({ game });
      return normalizeGameAccounts(res);
    },
    enabled: !!game,
    staleTime: 5 * 60 * 1000,
  });
};
