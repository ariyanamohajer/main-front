// SIM Card Types

export interface Country {
  id: number;
  name: string;
  callingCode: string;
}

export interface Operator {
  id: number;
  name: string;
  currency: string;
  priceRate: number;
  min: number;
  max: number;
  country: Country;
  isActive: boolean;
}

export interface SIMProduct {
  id: string;
  price: number;
  name: string;
  image: string | null;
  description: string;
  insertTime: string;
  operator: Operator;
  country: Country;
  internetPackage: null | unknown
}

// API Response Types
export interface Paging {
  totalRow: number;
  pageIndex: number;
  pagesize: number;
  filter: string | null;
}

export interface SIMProductsResponse {
  result: {
    paging: Paging;
    products: SIMProduct[];
  };
  success: boolean;
  message: string;
  code: number;
}

export interface OperatorsResponse {
  result: {
    operators: Operator[];
  };
  success: boolean;
  message: string;
  code: number;
}

export interface SingleOperatorResponse {
  result: {
    operator: Operator;
  };
  success: boolean;
  message: string;
  code: number;
}

export interface CountriesResponse {
  result: {
    countries: Country[];
  };
  success: boolean;
  message: string;
  code: number;
}

// Query Parameters
export interface SIMProductsQueryParams {
  pageIndex?: number;
  pageSize?: number;
  filter?: string;
  operatorId?: number;
  countryId?: number;
}

export interface OperatorsQueryParams {
  pageIndex?: number;
  pageSize?: number;
  filter?: string;
  countryId?: number;
}

// UI State Types
export interface SIMFilters {
  countryId?: number;
  operatorId?: number;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}

export interface SIMProductCard {
  id: string;
  name: string;
  price: number;
  currency: string;
  operatorName: string;
  countryName: string;
  callingCode: string;
  image?: string;
  description: string;
}



export type SingleSIMProductResponse = {
  result: { product: SIMProduct | null };
  success: boolean;
  message: string;
  code: number;
};



export type CreateSIMOrderRequest = {
  productId: string;
  phone: string; // e.g. +93XXXXXXXXX
};

export type CreateSIMOrderResponse = {
  result: { orderId: string };
  success: boolean;
  message: string;
  code: number;
};




// src/types/order.ts
export const ChargeType = {
  Normal: 1,
  Amazing: 2,
  Permanent: 3,
} as const;

// Union of the numeric values: 1 | 2 | 3
export type ChargeType = (typeof ChargeType)[keyof typeof ChargeType];

export type CreateDirectRechargeRequest = {
  phone: string;       // final full phone with +callingCode
  operatorId: number;
  amount: number;      // in تومان
  chargeType: ChargeType;
};

export type CreateDirectRechargeResponse = {
  result?: { orderId: number | string };
  success: boolean;
  message: string;
  code: number;
};
