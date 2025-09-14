// Wallet Types

// Payment Methods
export const PaymentMethod = {
  Manual: 1,
  BankingPortal: 2,
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// Transaction Types
export const TransactionType = {
  Credit: 1,
  Debit: 2,
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

// Increase Wallet Credit
export interface IncreaseWalletCreditRequest {
  Amount: number;
  Description: string;
  PaymentMethod: PaymentMethod;
  DepositSlipImage?: File | Blob | string;
}

export interface IncreaseWalletCreditResponse {
  success: boolean;
  message: string;
  code: number;
}

// Get Wallet Balance
export interface WalletBalanceResult {
  totalAmount: number;
  transactionsCount: number;
}

export interface GetWalletBalanceResponse {
  result: WalletBalanceResult;
  success: boolean;
  message: string;
  code: number;
}

// Get Wallet Transactions
export interface GetWalletTransactionsRequest {
  pagination: {
    filter?: string;
    pageIndex: number;
    pageSize?: number;
  };
  type?: TransactionType;
}

export interface WalletTransaction {
  amount: number;
  description: string;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  insertTime: string;
}

export interface WalletTransactionsPagination {
  totalRow: number;
  pageIndex: number;
  pagesize: number;
  filter: string | null;
}

export interface WalletTransactionsResult {
  pagination: WalletTransactionsPagination;
  transactions: WalletTransaction[];
  totalAmount: number;
}

export interface GetWalletTransactionsResponse {
  result: WalletTransactionsResult;
  success: boolean;
  message: string;
  code: number;
}

// Bank Accounts
export interface BankAccount {
  id: number;
  cardNumber: string;
  ownerName: string;
  bankName: string;
}

export interface GetBankAccountsResponse {
  result: BankAccount[];
  success: boolean;
  message: string;
  code: number;
}

// Generic API response wrapper is defined centrally in src/types/auth.ts
