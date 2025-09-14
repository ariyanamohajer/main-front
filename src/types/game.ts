// src/types/game.ts

// Use literal values instead of TypeScript 'enum' (avoids erasableSyntaxOnly issues)
export const GameTypeValues = {
  Pubg: 1,
  CallOfDuty: 2,
  ClashOfClans: 3,
} as const;

export type GameType = (typeof GameTypeValues)[keyof typeof GameTypeValues];
export type GameKey = keyof typeof GameTypeValues;

export const GAME_LABELS: Record<GameType, string> = {
  [GameTypeValues.Pubg]: "PUBG",
  [GameTypeValues.CallOfDuty]: "Call of Duty",
  [GameTypeValues.ClashOfClans]: "Clash of Clans",
};

export type GameAccount = {
  id: string; // gameAccountId (GUID)
  accountId: number; // user-entered numeric id
  accountName: string;
  game: GameType;
};

// --- Add Account ---
export type AddGameAccountRequest = {
  accountId: number;
  accountName?: string;
  game: GameType;
};

export type AddGameAccountResponse = {
  result?: { gameAccountId: string };
  success: boolean;
  message?: string;
  code: number;
};

// --- Get Accounts ---
export type GetGameAccountsParams = { game: GameType };

export type GetGameAccountsResponse = {
  // Some backends return a single object; some return an array or { accounts: [] }.
  result?: GameAccount | GameAccount[] | { accounts?: GameAccount[] } | null;
  success: boolean;
  message?: string;
  code: number;
};

// --- Add New Game Order ---
export type AddNewGameOrderRequest = {
  // NOTE: backend expects 'prodcutId' (typo) – use this exact key:
  prodcutId: string;
  gameAccountId: string;
};

export type AddNewGameOrderResponse = {
  result?: { orderId: string };
  success: boolean;
  message?: string;
  code: number;
};

// Helpers
export const normalizeGameAccounts = (
  payload: GetGameAccountsResponse
): GameAccount[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = payload?.result as any;
  if (!r) return [];
  if (Array.isArray(r)) return r as GameAccount[];
  if (Array.isArray(r?.accounts)) return r.accounts as GameAccount[];
  if (typeof r === "object" && r.id) {
    // Single object
    return [r as GameAccount];
  }
  return [];
};

export const guessGameFromText = (text?: string | null): GameType | null => {
  const t = (text ?? "").toLowerCase();
  if (/\bpubg\b/.test(t)) return GameTypeValues.Pubg;
  if (/\b(call of duty|cod)\b/.test(t)) return GameTypeValues.CallOfDuty;
  if (/clash.*clans|clans|clash/.test(t)) return GameTypeValues.ClashOfClans;
  return null;
};
