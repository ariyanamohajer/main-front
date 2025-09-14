import { axiosInstance } from "@/services/config/config";
import type {
  SIMProductsResponse,
  OperatorsResponse,
  SingleOperatorResponse,
  CountriesResponse,
  SIMProductsQueryParams,
  OperatorsQueryParams,
  Operator,
  SingleSIMProductResponse,
  CreateSIMOrderRequest, // <- NEW
  CreateSIMOrderResponse,
  CreateDirectRechargeRequest,
  CreateDirectRechargeResponse, // <- NEW
} from "@/types";

// Base endpoints for SIM APIs
const SIM_ENDPOINTS = {
  getProducts: "/ProductSIM/GetProducts",
  getOperators: "/ProductSIM/GetOperators",
  getOperator: "/ProductSIM/GetOperator",
  getCountries: "/ProductSIM/GetCountries",
  getProduct: "/ProductSIM/GetProduct",
  createOrder: "/Order/AddNewSIMOrder",
} as const;

/**
 * Get SIM card products with pagination and optional filtering
 */
export const getSIMProducts = async (
  params: SIMProductsQueryParams = {}
): Promise<SIMProductsResponse> => {
  const queryParams = new URLSearchParams();

  // Paging.PageIndex is required
  if (params.pageIndex !== undefined) {
    queryParams.append("Paging.PageIndex", params.pageIndex.toString());
  } else {
    queryParams.append("Paging.PageIndex", "0");
  }

  if (params.pageSize !== undefined) {
    queryParams.append("Paging.PageSize", params.pageSize.toString());
  }

  if (params.filter) {
    queryParams.append("Paging.Filter", params.filter);
  }

  if (params.operatorId !== undefined) {
    queryParams.append("OperatorId", params.operatorId.toString());
  }

  if (params.countryId !== undefined) {
    queryParams.append("CountryId", params.countryId.toString());
  }

  const url = `${SIM_ENDPOINTS.getProducts}?${queryParams.toString()}`;

  const response = await axiosInstance.get<SIMProductsResponse>(url);
  return response.data;
};

/**
 * Get operators for a specific country with pagination
 */
export const getOperators = async (
  params: OperatorsQueryParams = {}
): Promise<OperatorsResponse> => {
  const queryParams = new URLSearchParams();

  if (params.pageIndex !== undefined) {
    queryParams.append("Paging.PageIndex", params.pageIndex.toString());
  } else {
    queryParams.append("Paging.PageIndex", "0");
  }

  if (params.pageSize !== undefined) {
    queryParams.append("Paging.PageSize", params.pageSize.toString());
  }

  if (params.filter) {
    queryParams.append("Paging.Filter", params.filter);
  }

  // CountryId is required for operators API
  if (params.countryId !== undefined) {
    queryParams.append("CountryId", params.countryId.toString());
  }

  const url = `${SIM_ENDPOINTS.getOperators}?${queryParams.toString()}`;

  const response = await axiosInstance.get<OperatorsResponse>(url);
  return response.data;
};

/**
 * Get a specific operator by ID
 */
export const getOperator = async (
  operatorId: number
): Promise<SingleOperatorResponse> => {
  const response = await axiosInstance.get<SingleOperatorResponse>(
    `${SIM_ENDPOINTS.getOperator}?OperatorId=${operatorId}`
  );
  return response.data;
};

/**
 * Get all available countries
 */
export const getCountries = async (): Promise<CountriesResponse> => {
  const response = await axiosInstance.get<CountriesResponse>(
    SIM_ENDPOINTS.getCountries
  );
  return response.data;
};

/**
 * Get operators for multiple countries (utility function)
 */
export const getOperatorsForCountries = async (
  countryIds: number[]
): Promise<OperatorsResponse[]> => {
  const promises = countryIds.map((countryId) =>
    getOperators({ countryId, pageIndex: 0 })
  );
  return Promise.all(promises);
};

/**
 * Get all operators by fetching for all countries
 */
export const getAllOperators = async (
  countries: { id: number }[]
): Promise<Operator[]> => {
  try {
    const responses = await getOperatorsForCountries(
      countries.map((c) => c.id)
    );
    const allOperators: Operator[] = [];

    responses.forEach((response) => {
      if (response.success && response.result?.operators) {
        allOperators.push(...response.result.operators);
      }
    });

    return allOperators;
  } catch (error) {
    console.error("Error fetching all operators:", error);
    return [];
  }
};

/**
 * Search SIM products by name or description
 */
export const searchSIMProducts = async (
  searchTerm: string,
  pageIndex: number = 0
): Promise<SIMProductsResponse> => {
  return getSIMProducts({
    filter: searchTerm,
    pageIndex,
  });
};

export const getSIMProduct = async (
  productId: string
): Promise<SingleSIMProductResponse> => {
  if (!productId) throw new Error("ProductId is required");
  const url = `${SIM_ENDPOINTS.getProduct}?ProductId=${encodeURIComponent(
    productId
  )}`;
  const response = await axiosInstance.get<SingleSIMProductResponse>(url);
  return response.data;
};


export const createSIMOrder = async (
  payload: CreateSIMOrderRequest
): Promise<CreateSIMOrderResponse> => {
  const { data } = await axiosInstance.post<CreateSIMOrderResponse>(
    SIM_ENDPOINTS.createOrder,
    payload
  );
  return data;
};


const ORDER_ENDPOINTS = {
  directRecharge: "/Order/DirectRecharge",
} as const;

export const createDirectRecharge = async (
  payload: CreateDirectRechargeRequest
): Promise<CreateDirectRechargeResponse> => {
  const { data } = await axiosInstance.post<CreateDirectRechargeResponse>(
    ORDER_ENDPOINTS.directRecharge,
    payload
  );
  return data;
};