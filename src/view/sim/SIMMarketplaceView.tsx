import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Search,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Smartphone,
  Globe,
  RefreshCw,
} from "lucide-react";
import {
  SIMCard,
  SIMFilters,
  CountrySelector,
} from "@/components/features/sim";
import { useSIMProducts, useCountries, useOperators } from "@/hooks/sim";
import type {
  SIMProduct,
  SIMFilters as SIMFiltersType,
  Operator,
} from "@/types";
import SIMOrderDialog from "@/components/features/sim/SIMOrderDialog";
import ChargeTopUpDialog from "@/components/features/sim/ChargeTopUpDialog";
import { toast } from "sonner";

import mciPng from "@/assets/images/mci.png"; // همراه اول
import mtnPng from "@/assets/images/mtn.png"; // ایرانسل
import rtlPng from "@/assets/images/rtl.png"; // رایتل
import shtPng from "@/assets/images/sht.png"; // شاتل

type ViewMode = "grid" | "list";
type SortBy = "name" | "price" | "country" | "operator" | "newest";
type SortOrder = "asc" | "desc";
type MarketTab =
  | "charge-intl" // شارژ بین المللی
  | "charge-domestic" // شارژ داخلی
  | "internet-domestic" // بسته اینترنتی داخلی
  | "internet-intl"; // بسته اینترنت بین المللی

// ---------- NEW: Persian names for domestic operators ----------
const OP_FA_NAME: Record<string, string> = {
  MCI: "همراه اول",
  SHT: "شاتل",
  MTN: "ایرانسل",
  RTL: "رایتل",
};
const OP_LOGO_SRC: Record<string, string> = {
  "همراه اول": mciPng,
  ایرانسل: mtnPng,
  رایتل: rtlPng,
  شاتل: shtPng,
};
const getFaOperatorName = (code?: string) =>
  OP_FA_NAME[(code || "").toUpperCase()] || code || "";

const getOperatorLogo = (codeOrName?: string) => {
  const fa = getFaOperatorName(codeOrName);
  return OP_LOGO_SRC[fa];
};

export const SIMMarketplaceView: React.FC = () => {
  const navigate = useNavigate();

  // ---------- State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<SIMFiltersType>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [tab, setTab] = useState<MarketTab>("charge-intl");

  // Dialog states
  const [openSIMOrder, setOpenSIMOrder] = useState(false);
  const [openChargeDialog, setOpenChargeDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SIMProduct | null>(
    null
  );
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(
    null
  );

  // ---------- Queries
  const { data: countriesData, isLoading: countriesLoading } = useCountries();
  const countries = countriesData?.result?.countries || [];

  // Iran lookup
  const iran = useMemo(() => {
    const byName = countries.find(
      (c) => c.name === "Iran" || c.name === "ایران"
    );
    if (byName) return byName;
    const byCode = countries.find(
      (c) => String(c.callingCode).replace(/^\+/, "") === "98"
    );
    return byCode || null;
  }, [countries]);

  // Operators for شارژ داخلی: only when we are on that tab
  const {
    data: domesticOpsData,
    isLoading: domesticOpsLoading,
    error: domesticOpsError,
  } = useOperators(
    tab === "charge-domestic" && iran
      ? { countryId: iran.id, pageIndex: 0, pageSize: 1000 }
      : undefined
  );
  const domesticOperators: Operator[] =
    domesticOpsData?.result?.operators ?? [];

  // Products (across tabs)
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useSIMProducts({
    pageIndex: currentPage,
    pageSize: 12,
    filter: filters.searchTerm,
    countryId: filters.countryId,
    operatorId: filters.operatorId,
  });

  const products = productsData?.result?.products || [];
  const pagination = productsData?.result?.paging;

  // ---------- Helpers
  const isIranCountry = (p: SIMProduct) =>
    p.country?.name === "Iran" ||
    p.country?.name === "ایران" ||
    String(p.country?.callingCode ?? "").replace(/^\+/, "") === "98";

  const looksLikeInternetPackage = (p: SIMProduct) => {
    const s = (p.name || "").toLowerCase();
    return /(\bgb\b|\bmb\b|اینترنت|گیگ|مگ|ساعته|روزه|هفته|ماهه)/i.test(s);
  };

  // Filter & sort products (global)
  const filteredAndSortedProducts = products
    .filter((p) => {
      if (filters.countryId && p.country.id !== filters.countryId) return false;
      if (filters.operatorId && p.operator.id !== filters.operatorId)
        return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      let compareValue = 0;
      switch (sortBy) {
        case "name":
          compareValue = a.name.localeCompare(b.name, "fa");
          break;
        case "price":
          compareValue = a.price - b.price;
          break;
        case "country":
          compareValue = a.country.name.localeCompare(b.country.name);
          break;
        case "operator":
          compareValue = a.operator.name.localeCompare(b.operator.name);
          break;
        case "newest":
          compareValue =
            new Date(b.insertTime).getTime() - new Date(a.insertTime).getTime();
          break;
      }
      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  // Split into 3 product tabs (شارژ داخلی uses operators)
  const { chargeIntl, internetDomestic, internetIntl } = useMemo(() => {
    const res = {
      chargeIntl: [] as SIMProduct[],
      internetDomestic: [] as SIMProduct[],
      internetIntl: [] as SIMProduct[],
    };
    for (const p of filteredAndSortedProducts) {
      const domestic = isIranCountry(p);
      const isInternet = !!p.internetPackage || looksLikeInternetPackage(p);
      if (isInternet) {
        (domestic ? res.internetDomestic : res.internetIntl).push(p);
      } else if (!domestic) {
        res.chargeIntl.push(p);
      }
    }
    return res;
  }, [filteredAndSortedProducts]);

  const isProductTab = tab !== "charge-domestic";
  const displayedProducts =
    tab === "charge-intl"
      ? chargeIntl
      : tab === "internet-domestic"
      ? internetDomestic
      : tab === "internet-intl"
      ? internetIntl
      : [];

  const pageCount = pagination
    ? Math.ceil(pagination.totalRow / pagination.pagesize)
    : 0;

  const showPagination =
    isProductTab && displayedProducts.length > 0 && pageCount > 1;

  // ---------- Handlers
  const handleProductDetails = (product: SIMProduct) =>
    navigate(`/sim/${product.id}`);
  const handleProductBuy = (product: SIMProduct) => {
    setSelectedProduct(product);
    setOpenSIMOrder(true);
  };
  const handleOperatorClick = (op: Operator) => {
    setSelectedOperator(op);
    setOpenChargeDialog(true);
  };

  const handleFiltersChange = (newFilters: SIMFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };
  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(0);
  };
  const toggleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy)
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const onChangeTab = (v: MarketTab) => {
    setTab(v);
    setCurrentPage(0);
    setFilters((f) => {
      if (v === "charge-intl" || v === "internet-intl") {
        return { ...f, countryId: undefined, operatorId: undefined };
      }
      return f;
    });
  };

  // ---------- UI
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sim-header border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  خدمات سیم کارت
                </h1>
                <p className="text-muted-foreground">
                  سیم کارت های بین المللی و داخلی
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchProducts()}
                disabled={productsLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${productsLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Quick Search + Country */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="جستجو سیم کارت، کشور، اپراتور..."
                value={filters.searchTerm || ""}
                onChange={(e) =>
                  handleFiltersChange({
                    ...filters,
                    searchTerm: e.target.value,
                  })
                }
                className="pl-10"
              />
            </div>
            <div className="lg:w-64">
              <CountrySelector
                countries={countries}
                selectedCountry={
                  filters.countryId
                    ? countries.find((c) => c.id === filters.countryId)
                    : null
                }
                onCountrySelect={(country) =>
                  handleFiltersChange({
                    ...filters,
                    countryId: country?.id,
                    operatorId: undefined,
                  })
                }
                loading={countriesLoading}
                variant="compact"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                فیلترها
              </Button>
            </div>
            <div
              className={`sim-filter-sidebar ${
                showMobileFilters ? "block" : "hidden"
              } lg:block`}
            >
              <SIMFilters
                countries={countries}
                operators={[]}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
                loading={countriesLoading}
              />
            </div>
          </div>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="sim-toolbar flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 p-4 bg-card border border-border rounded-lg">
              {/* Tabs (desktop) */}
              <div className="hidden md:block">
                <Tabs
                  value={tab}
                  onValueChange={(v) => onChangeTab(v as MarketTab)}
                  dir="rtl"
                >
                  <TabsList className="grid grid-cols-4 gap-2">
                    <TabsTrigger value="charge-intl">
                      شارژ بین المللی
                    </TabsTrigger>
                    <TabsTrigger value="charge-domestic">
                      شارژ داخلی
                    </TabsTrigger>
                    <TabsTrigger value="internet-domestic">
                      بسته اینترنتی داخلی
                    </TabsTrigger>
                    <TabsTrigger value="internet-intl">
                      بسته اینترنت بین المللی
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Select (mobile) */}
              <div className="md:hidden">
                <Select
                  value={tab}
                  onValueChange={(v) => onChangeTab(v as MarketTab)}
                  dir="rtl"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="charge-intl">شارژ بین المللی</SelectItem>
                    <SelectItem value="charge-domestic">شارژ داخلی</SelectItem>
                    <SelectItem value="internet-domestic">
                      بسته اینترنتی داخلی
                    </SelectItem>
                    <SelectItem value="internet-intl">
                      بسته اینترنت بین المللی
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Counters + sort/view */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                <div className="text-sm text-muted-foreground">
                  {tab === "charge-domestic" ? (
                    <>تعداد اپراتورها: {domesticOperators.length}</>
                  ) : (
                    <>نمایش {displayedProducts.length} مورد</>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  {/* Sort */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant={sortBy === "price" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => toggleSort("price")}
                      disabled={!isProductTab}
                    >
                      قیمت
                      {sortBy === "price" &&
                        (sortOrder === "asc" ? (
                          <SortAsc className="w-3 h-3 ml-1" />
                        ) : (
                          <SortDesc className="w-3 h-3 ml-1" />
                        ))}
                    </Button>
                    <Button
                      variant={sortBy === "name" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => toggleSort("name")}
                      disabled={!isProductTab}
                    >
                      نام
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <SortAsc className="w-3 h-3 ml-1" />
                        ) : (
                          <SortDesc className="w-3 h-3 ml-1" />
                        ))}
                    </Button>
                    <Button
                      variant={sortBy === "newest" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => toggleSort("newest")}
                      disabled={!isProductTab}
                    >
                      جدیدترین
                    </Button>
                  </div>

                  <Separator
                    orientation="vertical"
                    className="hidden md:block h-6"
                  />

                  {/* View mode */}
                  <div className="flex items-center">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading */}
            {(productsLoading && isProductTab) ||
            (domesticOpsLoading && !isProductTab) ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-4" />
                      <Skeleton className="h-20 w-full mb-4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 flex-1" />
                        <Skeleton className="h-8 flex-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}

            {/* Errors */}
            {(productsError && isProductTab) ||
            (domesticOpsError && !isProductTab) ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    خطا در دریافت اطلاعات
                  </p>
                  {isProductTab ? (
                    <Button onClick={() => refetchProducts()}>تلاش مجدد</Button>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {/* Content: product tabs */}
            {!productsLoading && !productsError && isProductTab && (
              <>
                {displayedProducts.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {displayedProducts.map((product) => (
                      <SIMCard
                        key={product.id}
                        product={product}
                        onViewDetails={() => handleProductDetails(product)}
                        onSelect={() => handleProductBuy(product)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium mb-2">
                        موردی یافت نشد
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        نتیجه‌ای مطابق فیلترها در این بخش پیدا نشد.
                      </p>
                      <Button variant="outline" onClick={handleResetFilters}>
                        پاک کردن فیلترها
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Pagination (only when this tab has items) */}
                {showPagination && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 0}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(0, p - 1))
                        }
                      >
                        قبلی
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: pageCount }).map((_, index) => (
                          <Button
                            key={index}
                            variant={
                              currentPage === index ? "default" : "ghost"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(index)}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= pageCount - 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(pageCount - 1, p + 1))
                        }
                      >
                        بعدی
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Content: شارژ داخلی → operator grid */}
            {!domesticOpsLoading && !domesticOpsError && !isProductTab && (
              <>
                {domesticOperators.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                    }`}
                  >
                    {domesticOperators.map((op) => {
                      const faName = getFaOperatorName(op.name);
                      return (
                        <Card
                          key={op.id}
                          className="hover:bg-accent/30 transition-colors"
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                              {(() => {
                                const src = getOperatorLogo(op.name);
                                return src ? (
                                  <img
                                    src={src}
                                    alt={faName}
                                    className="w-5 h-5 object-contain"
                                    loading="lazy"
                                  />
                                ) : (
                                  // فallback در صورت نبودن لوگو
                                  <Smartphone className="w-4 h-4 text-primary" />
                                );
                              })()}
                              {/* ▼ show Persian display name */}
                              {faName}
                              <Badge variant="outline" className="mr-auto">
                                ایران
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="text-xs text-muted-foreground mb-4">
                              کد کشور: {op.country?.callingCode ?? "98"}+
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1"
                                onClick={() => handleOperatorClick(op)}
                              >
                                خرید شارژ
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <h3 className="text-lg font-medium mb-2">
                        اپراتوری یافت نشد
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        لیست اپراتورهای داخلی در دسترس نیست.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => toast.info("لطفاً بعداً تلاش کنید.")}
                      >
                        تازه‌سازی
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <SIMOrderDialog
          open={openSIMOrder}
          onOpenChange={setOpenSIMOrder}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          operatorName={selectedProduct.operator?.name}
          countryName={selectedProduct.country?.name}
          callingCode={selectedProduct.country?.callingCode}
        />
      )}

      {selectedOperator && (
        <ChargeTopUpDialog
          open={openChargeDialog}
          onOpenChange={setOpenChargeDialog}
          operatorId={selectedOperator.id}
          // ▼ pass Persian display name into the modal
          operatorName={getFaOperatorName(selectedOperator.name)}
          callingCode={selectedOperator.country?.callingCode ?? "98"}
          countryName={selectedOperator.country?.name ?? "Iran"}
          productName={`شارژ ${getFaOperatorName(selectedOperator.name)}`}
        />
      )}
    </div>
  );
};
