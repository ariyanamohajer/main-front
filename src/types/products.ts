// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: number;
  categoryId: number;
  categoryName: string;
  images: ProductImage[];
}

export interface ProductsPagination {
  totalRow: number;
  pageIndex: number;
  pagesize: number;
  filter: string | null;
}

export interface ProductsResponse {
  result: {
    pagination: ProductsPagination;
    products: Product[];
    currency: string;
  };
  success: boolean;
  message: string;
  code: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Categories response (handling potential API inconsistency)
export interface CategoriesResponse {
  result: {
    pagination: ProductsPagination;
    result: Category[];
    products?: Category[]; // API might incorrectly return "products" for categories
  };
  success: boolean;
  message: string;
  code: number;
}

// Query Parameters
export interface ProductsQueryParams {
  pageIndex?: number;
  pageSize?: number;
  filter?: string;
  categoryId?: number;
}

// Product Status Constants
export const ProductStatus = {
  Inactive: 0,
  Active: 1,
} as const;

export type ProductStatusType =
  (typeof ProductStatus)[keyof typeof ProductStatus];

// Single Product Types
export interface ProductImage {
  id: number;
  title: string;
  alt: string;
  name: string;
  isTitle: boolean;
}

export interface ProductComment {
  commentId: string;
  text: string;
  star: number;
  userId: string;
  user: null;
  productId: string;
  product: null;
  status: boolean;
  insertTime: string;
  lastUpdate: string | null;
  parentId: string | null;
  userPhone: string;
  userName: string;
  userAvatar: string;
  answers: ProductComment[];
}

export interface ProductQuestion {
  questionId: string;
  text: string;
  userId: string;
  user: null;
  productId: string;
  product: null;
  status: boolean;
  insertTime: string;
  lastUpdate: string | null;
  userPhone: string;
  userName: string;
  userAvatar: string;
  answers: ProductQuestion[];
}

export interface SingleProduct {
  inserTime: string;
  lastUpdate: string | null;
  removeTime: string | null;
  comments: ProductComment[];
  questions: ProductQuestion[];
  id: string;
  name: string;
  description: string;
  price: number;
  status: number;
  categoryId: number;
  categoryName: string | null;
  images: ProductImage[];
}

export interface SingleProductResponse {
  result: SingleProduct;
  success: boolean;
  message: string;
  code: number;
}

// Product Questions API Types
export interface ProductQuestionsPagination {
  totalRow: number;
  pageIndex: number;
  pagesize: number;
  filter: string | null;
}

export interface UserProductQuestion {
  questionId: string;
  text: string;
  userId: string;
  user: null;
  productId: string;
  product: {
    name: string;
    price: number;
    discountPercent: number;
    count: number;
    minPreparationTime: string | null;
    maxreparationTime: string | null;
    basicDescription: string | null;
    description: string | null;
    guid: string | null;
    specialOffer: boolean;
    specialOfferStartTime: string | null;
    specialOfferEndTime: string | null;
    specialPrice: number | null;
    status: number;
    categoryId: number;
    category: null;
    comments: null;
    images: null;
  };
  status: boolean;
  insertTime: string;
  lastUpdate: string | null;
  userPhone: string;
  userName: string;
  userAvatar: string;
  answers: UserProductQuestion[];
}

export interface ProductQuestionsResponse {
  result: {
    productQuestions: UserProductQuestion[];
    pagination: ProductQuestionsPagination;
  };
  success: boolean;
  message: string;
  code: number;
}

export interface ProductQuestionsQueryParams {
  ProductId?: string;
  MinInsertTime?: string;
  MaxInsertTime?: string;
  "Pagination.Filter"?: string;
  "Pagination.PageIndex": number;
  "Pagination.PageSize"?: number;
}

export interface AddQuestionRequest {
  ProductId: string;
  Text: string;
  KeyResponse?: string;
}

export interface UpdateQuestionRequest {
  QuestionId: string;
  Text: string;
  KeyResponse: string;
}

export interface RemoveQuestionRequest {
  QuestionId: string;
}

export interface QuestionOperationResponse {
  result: null;
  success: boolean;
  message: string;
  code: number;
}
