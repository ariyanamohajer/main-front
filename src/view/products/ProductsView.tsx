import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/products";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Filter, Grid3X3, AlertCircle } from "lucide-react";
import type { Product } from "@/types";
import { LazyImage } from "@/components/common/LazyLoading";
import { formatPrice } from "@/lib/utils";

function ProductsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageSize] = useState(16);

  // Get category ID from URL or default to undefined (all products)
  const selectedCategoryId = searchParams.get("categoryId")
    ? parseInt(searchParams.get("categoryId")!, 10)
    : undefined;

  // Fetch data using React Query hooks
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts({
    pageIndex: 0,
    pageSize,
    categoryId: selectedCategoryId,
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Extract data from responses
  const products = productsData?.result?.products || [];
  // Handle potential API inconsistency - categories might be returned as "products"
  const allCategories =
    categoriesData?.result || categoriesData?.result?.products || [];

  // Limit to exactly 4 categories (plus "All" = 5 total options)
  const categories = Array.isArray(allCategories)
    ? allCategories.slice(0, 4)
    : [];
  // const currency = productsData?.result?.currency || "IRT";
  const pagination = productsData?.result?.pagination;

  // Format price with currency
  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat("fa-IR", {
  //     style: "decimal",
  //     minimumFractionDigits: 0,
  //   }).format(price);
  // };

  // Create tab options - "All" + 4 categories
  const tabOptions = [
    { id: undefined, name: "همه محصولات", value: "all" },
    ...categories.map((category) => ({
      id: category.id,
      name: category.name,
      value: category.id.toString(),
    })),
  ];

  // Get current tab value for tabs/select components
  const currentTabValue = selectedCategoryId
    ? selectedCategoryId.toString()
    : "all";

  // Handle category selection - update URL parameters
  const handleCategorySelect = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (value === "all") {
      // Remove category ID from URL for "all products"
      newSearchParams.delete("categoryId");
    } else {
      // Set category ID in URL for specific category
      newSearchParams.set("categoryId", value);
    }

    setSearchParams(newSearchParams);
  };

  const navigate = useNavigate();

  // Lazy loading image component

  // Loading skeleton for products
  const ProductSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-t-lg" />
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  );

  // Loading skeleton for categories
  const CategorySkeleton = () => (
    <>
      {/* Desktop Tabs Skeleton */}
      <div className="hidden md:block">
        <div className="grid w-full grid-cols-5 gap-1 p-1 bg-muted rounded-lg">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Mobile Select Skeleton */}
      <div className="md:hidden">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </>
  );

  // Error component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );

  // Product card component
  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 pt-0">
      <LazyImage
        src={product.images?.[0]?.name ?? "/images/product-placeholder.png"}
        alt={product?.name ?? "بدون نام"}
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">
            {product.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge variant="destructive" className="text-xs">
          {product.categoryName}
        </Badge>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {formatPrice(product.price)} تومان
            </p>
            {/* <p className="text-xs text-muted-foreground">{currency}</p> */}
          </div>
          <Badge variant={product.status === 1 ? "secondary" : "default"}>
            {product.status === 1 ? "موجود" : "ناموجود"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full cursor-pointer"
          disabled={product.status !== 1}
          onClick={() => navigate(`/products/${product.name}`)}
        >
          <Package className="mr-2 h-4 w-4" />
          مشاهده جزئیات
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">محصولات</h1>
          <p className="text-muted-foreground mt-1">
            {pagination && (
              <>
                نمایش {pagination.totalRow} محصول
                {selectedCategoryId && " در دسته‌بندی انتخاب شده"}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          <span className="text-sm font-medium">نمای شبکه‌ای</span>
        </div>
      </div>

      <Separator />

      {/* Categories Tabs - Desktop and Mobile */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">دسته‌بندی‌ها</h2>
          <span className="text-xs text-muted-foreground">
            ({tabOptions.length} گزینه)
          </span>
        </div>

        {categoriesLoading ? (
          <CategorySkeleton />
        ) : categoriesError ? (
          <ErrorMessage message="خطا در بارگذاری دسته‌بندی‌ها" />
        ) : (
          <>
            {/* Desktop Tabs - Hidden on mobile */}
            <div className="hidden md:block">
              <Tabs
                value={currentTabValue}
                onValueChange={handleCategorySelect}
                dir="rtl"
              >
                <TabsList className="grid w-full grid-cols-5">
                  {tabOptions.map((option) => (
                    <TabsTrigger
                      key={option.value}
                      value={option.value}
                      className="text-sm"
                    >
                      {option.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Mobile Select - Hidden on desktop */}
            <div className="md:hidden">
              <Select
                value={currentTabValue}
                onValueChange={handleCategorySelect}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {tabOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <Separator />

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {selectedCategoryId
              ? categories.find((c) => c.id === selectedCategoryId)?.name ||
                "محصولات"
              : "تمام محصولات"}
          </h2>
          {pagination && (
            <p className="text-sm text-muted-foreground">
              {pagination.totalRow} محصول
            </p>
          )}
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: pageSize }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : productsError ? (
          <ErrorMessage message="خطا در بارگذاری محصولات" />
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Package className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">محصولی یافت نشد</h3>
                <p className="text-muted-foreground mt-1">
                  {selectedCategoryId
                    ? "در این دسته‌بندی محصولی موجود نیست"
                    : "هیچ محصولی موجود نیست"}
                </p>
              </div>
              {selectedCategoryId && (
                <Button
                  variant="outline"
                  onClick={() => handleCategorySelect("all")}
                >
                  مشاهده همه محصولات
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsView;
