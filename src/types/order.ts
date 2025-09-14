// 

// src/types/orders.ts

// ---------- Enum-like constants (erase-only safe) ----------
export const OrderStatus = {
  WaitingPayment: 1,
  Processing: 2,
  Completed: 3,
  CanceledByUser: 4,
  CanceledByAdmin: 5,
  Failed: 6,
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const ProductType = {
  SIMCard: 1,
  Game: 2,
} as const;
export type ProductType = (typeof ProductType)[keyof typeof ProductType];

// If you want a narrowed known set but still accept any string:
export type OperatorCode = "MCI" | "MTN" | "RTL" | "SHT" | string;

export const OPERATOR_FA_LABEL: Record<string, string> = {
  MCI: "همراه اول",
  MTN: "ایرانسل",
  RTL: "رایتل",
  SHT: "شاتل",
};

// Map by the numeric status codes
export const STATUS_FA_LABEL: Record<number, string> = {
  [OrderStatus.WaitingPayment]: "در انتظار پرداخت",
  [OrderStatus.Processing]: "در حال پردازش",
  [OrderStatus.Completed]: "تکمیل شده",
  [OrderStatus.CanceledByUser]: "لغو توسط کاربر",
  [OrderStatus.CanceledByAdmin]: "لغو توسط مدیر",
  [OrderStatus.Failed]: "ناموفق",
};
// ---------- Common ----------
export type PagingInfo = {
  totalRow: number;
  pageIndex: number;
  pagesize: number;
  filter: string | null;
};

// ---------- GetOrders (SIM international + Game) ----------
export type SIMInternetInfo = {
  periodicity?: string | null;
  days?: string | null;
  volume?: string | null;
  unit?: "MB" | "GB" | string | null;
  simType?: string | null;
  course?: string | null;
  type?: string | null;
  internetType?: string | null;
  regionType?: number | null;
};

export type SIMOrderProduct = {
  orderId: string;
  orderNumber?: number;
  price: number;
  name: string;
  phone: string;
  operator: OperatorCode;
  country: string;
  productType: typeof ProductType.SIMCard; // exact literal (1)
  internet?: SIMInternetInfo | null;
  insertTime?: string;
  lastUpdate?: string | null;
  transId?: string | null;
  status?: OrderStatus;
};

export type GameOrderProduct = {
  orderId: string;
  orderNumber?: number;
  price: number;
  name: string;
  game?: 1 | 2 | 3; // 1 Pubg | 2 CallOfDuty | 3 ClashOfClans
  gameAccountId?: string;
  insertTime?: string;
  lastUpdate?: string | null;
  status?: OrderStatus;
  productType: typeof ProductType.Game; // exact literal (2)
};

export type GetOrdersItem = {
  simProduct: SIMOrderProduct | null;
  gameProduct: GameOrderProduct | null;
};

export type GetOrdersResponse = {
  paging: PagingInfo;
  orders: GetOrdersItem[];
};

export type GetOrdersParams = {
  "Paging.Filter"?: string;
  "Paging.PageIndex": number; // required
  "Paging.PageSize"?: number;
  OrderStatus?: OrderStatus;
  ProductType: ProductType; // required (1=SIM, 2=Game)
  Phone?: string;
  GameAccountId?: string;
};

// ---------- GetLocalSIMOrders (شارژ داخلی) ----------
export type LocalSIMOrder = {
  orderId: number;
  phone: string;
  amount: number;
  chargeType: number; // refine if you add a ChargeType union
  operator: OperatorCode;
  rejectDescription?: string | null;
  status: OrderStatus;
};

export type GetLocalSIMOrdersResponse = {
  paging: PagingInfo;
  orders: LocalSIMOrder[];
};

export type GetLocalSIMOrdersParams = {
  "Paging.Filter"?: string;
  "Paging.PageIndex": number; // required
  "Paging.PageSize"?: number;
  Operator?: OperatorCode;
  OrderStatus?: OrderStatus;
  Phone?: string;
};

// ---------- helpers ----------
export const formatMoney = (v: number) =>
  (v ?? 0).toLocaleString("fa-IR") + " تومان";

export const formatDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fa-IR");
  } catch {
    return "—";
  }
};

export const faOperator = (code?: string) =>
  (code && OPERATOR_FA_LABEL[code]) || code || "—";
