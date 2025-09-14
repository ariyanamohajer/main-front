// src/components/features/orders/OrdersView.tsx
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  Smartphone,
  Gamepad2,
  Globe2,
  Building2,
} from "lucide-react";
import {
  faOperator,
  formatDateTime,
  formatMoney,
  OPERATOR_FA_LABEL,
  OrderStatus,
  ProductType,
  STATUS_FA_LABEL,
} from "@/types/order";
import { useLocalSIMOrders, useOrders } from "@/hooks/order/useOrders";

type TopTab = "sim-intl" | "sim-local" | "game";

const pageSizes = [10, 16, 24, 32];

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: OrderStatus.WaitingPayment, label: STATUS_FA_LABEL[1] },
  { value: OrderStatus.Processing, label: STATUS_FA_LABEL[2] },
  { value: OrderStatus.Completed, label: STATUS_FA_LABEL[3] },
  { value: OrderStatus.CanceledByUser, label: STATUS_FA_LABEL[4] },
  { value: OrderStatus.CanceledByAdmin, label: STATUS_FA_LABEL[5] },
  { value: OrderStatus.Failed, label: STATUS_FA_LABEL[6] },
];

export default function OrderView() {
  const [tab, setTab] = useState<TopTab>("sim-intl");

  // shared filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(16);

  // specific filters
  const [phone, setPhone] = useState("");
  const [operator, setOperator] = useState<string>("");
  const [gameAccountId, setGameAccountId] = useState("");

  // queries
  const simIntl = useOrders({
    "Paging.PageIndex": pageIndex,
    "Paging.PageSize": pageSize,
    "Paging.Filter": search || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OrderStatus: status as any,
    ProductType: ProductType.SIMCard,
    Phone: phone || undefined,
  });

  const game = useOrders({
    "Paging.PageIndex": pageIndex,
    "Paging.PageSize": pageSize,
    "Paging.Filter": search || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OrderStatus: status as any,
    ProductType: ProductType.Game,
    Phone: phone || undefined,
    GameAccountId: gameAccountId || undefined,
  });

  const localSim = useLocalSIMOrders({
    "Paging.PageIndex": pageIndex,
    "Paging.PageSize": pageSize,
    "Paging.Filter": search || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OrderStatus: status as any,
    Phone: phone || undefined,
    Operator: operator || undefined,
  });

  // pick active dataset
  const { data, isLoading, isError, refetch } = (() => {
    if (tab === "sim-local") return localSim;
    if (tab === "game") return game;
    return simIntl;
  })();

  const orders = useMemo(() => {
    if (!data) return [];
    if (tab === "sim-local") return data.orders;
    return data.orders;
  }, [data, tab]);

  const paging = data?.paging;
  const pageCount = paging ? Math.ceil(paging.totalRow / paging.pagesize) : 0;

  const onChangeTab = (t: TopTab) => {
    setTab(t);
    setPageIndex(0);
    // clear tab-specific filters
    if (t !== "game") setGameAccountId("");
    if (t !== "sim-local") setOperator("");
  };

  const statusValue = status === undefined ? "all" : String(status);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Smartphone className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold">سفارش‌ها</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          نمایش و پیگیری وضعیت سفارش‌های سیم‌کارت و بازی
        </p>
      </div>

      {/* Toolbar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Tabs */}
            <Tabs
              value={tab}
              onValueChange={(v) => onChangeTab(v as TopTab)}
              dir="rtl"
              className="w-full"
            >
              {/* Scrollable tab strip */}
              <div className="w-full overflow-x-auto">
                <TabsList className="min-w-max gap-2">
                  <TabsTrigger value="sim-intl" className="gap-2 shrink-0">
                    <Globe2 className="w-4 h-4" />
                    سیم‌کارت (بین‌المللی/بسته‌ها)
                  </TabsTrigger>
                  <TabsTrigger value="sim-local" className="gap-2 shrink-0">
                    <Building2 className="w-4 h-4" />
                    شارژ داخلی
                  </TabsTrigger>
                  <TabsTrigger value="game" className="gap-2 shrink-0">
                    <Gamepad2 className="w-4 h-4" />
                    بازی‌ها
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full">
              <Input
                placeholder="جستجو (نام/شماره/...)"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPageIndex(0);
                }}
                className="sm:col-span-2"
              />

              <Select
                value={statusValue}
                onValueChange={(v) => {
                  setStatus(v === "all" ? undefined : Number(v));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>{" "}
                  {/* ✅ use a sentinel */}
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={String(s.value)}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="شماره تلفن"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPageIndex(0);
                }}
              />

              {tab === "sim-local" && (
                <Select
                  value={operator || "all"}
                  onValueChange={(v) => {
                    setOperator(v === "all" ? "" : v);
                    setPageIndex(0);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اپراتور (اختیاری)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه اپراتورها</SelectItem>{" "}
                    {/* ✅ sentinel */}
                    {Object.entries(OPERATOR_FA_LABEL).map(([code, label]) => (
                      <SelectItem key={code} value={code}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {tab === "game" && (
                <Input
                  placeholder="GameAccountId"
                  value={gameAccountId}
                  onChange={(e) => {
                    setGameAccountId(e.target.value);
                    setPageIndex(0);
                  }}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="تعداد در صفحه" />
                </SelectTrigger>
                <SelectContent>
                  {pageSizes.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s} / صفحه
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                بروزرسانی
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-6 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <Card className="text-center">
          <CardContent className="py-12">
            <p className="text-muted-foreground mb-4">خطا در دریافت اطلاعات</p>
            <Button onClick={() => refetch()}>تلاش مجدد</Button>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <>
          {/* No result */}
          {!orders || orders.length === 0 ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <p className="text-muted-foreground">سفارشی یافت نشد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tab === "sim-local"
                ? // ----- Local SIM orders -----
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (orders as any[]).map((o) => (
                    <Card
                      key={o.orderId}
                      className="hover:bg-accent/40 transition-colors"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Building2 className="w-4 h-4 text-primary" />
                          شارژ داخلی
                          <Badge variant="secondary" className="ml-auto">
                            {faOperator(o.operator)}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">شماره</span>
                          <span className="font-medium ltr">{o.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">مبلغ</span>
                          <span className="font-semibold">
                            {formatMoney(o.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">وضعیت</span>
                          <Badge
                            variant={
                              o.status === OrderStatus.Completed
                                ? "secondary"
                                : o.status === OrderStatus.Failed ||
                                  o.status === OrderStatus.CanceledByAdmin ||
                                  o.status === OrderStatus.CanceledByUser
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {STATUS_FA_LABEL[o.status] || "—"}
                          </Badge>
                        </div>
                        {o.rejectDescription && (
                          <>
                            <Separator />
                            <div className="text-xs text-destructive">
                              {o.rejectDescription}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))
                : // ----- SIM Intl + Game orders -----
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (orders as any[]).map((it, idx) => {
                    const sim = it.simProduct;
                    const gameP = it.gameProduct;
                    const key = sim?.orderId || gameP?.orderId || idx;

                    if (sim) {
                      const title = sim.name || "محصول سیم‌کارت";
                      const status = sim.status;
                      return (
                        <Card
                          key={key}
                          className="hover:bg-accent/40 transition-colors"
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Globe2 className="w-4 h-4 text-primary" />
                              {title}
                              <Badge variant="outline" className="ml-auto">
                                {sim.country || "—"}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 text-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                اپراتور
                              </span>
                              <span className="font-medium">
                                {faOperator(sim.operator)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                شماره
                              </span>
                              <span className="font-medium ltr">
                                {sim.phone}
                              </span>
                            </div>

                            {sim.internet && (
                              <div className="rounded-md bg-muted p-2 text-xs space-y-1">
                                <div>
                                  حجم:{" "}
                                  <b>
                                    {sim.internet.volume} {sim.internet.unit}
                                  </b>
                                </div>
                                {!!sim.internet.days && (
                                  <div>
                                    مدت: <b>{sim.internet.days} روزه</b>
                                  </div>
                                )}
                                {!!sim.internet.type && (
                                  <div>
                                    نوع: <b>{sim.internet.type}</b>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                مبلغ
                              </span>
                              <span className="font-semibold">
                                {formatMoney(sim.price)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                ایجاد
                              </span>
                              <span className="font-medium">
                                {formatDateTime(sim.insertTime)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                وضعیت
                              </span>
                              <Badge
                                variant={
                                  status === OrderStatus.Completed
                                    ? "secondary"
                                    : status === OrderStatus.Failed ||
                                      status === OrderStatus.CanceledByAdmin ||
                                      status === OrderStatus.CanceledByUser
                                    ? "destructive"
                                    : "outline"
                                }
                              >
                                {status ? STATUS_FA_LABEL[status] : "—"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }

                    // Game order
                    const g = gameP!;
                    return (
                      <Card
                        key={key}
                        className="hover:bg-accent/40 transition-colors"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Gamepad2 className="w-4 h-4 text-primary" />
                            {g.name || "سفارش بازی"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 text-sm space-y-2">
                          {g.gameAccountId && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                اکانت
                              </span>
                              <span className="font-medium ltr">
                                {g.gameAccountId}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">مبلغ</span>
                            <span className="font-semibold">
                              {formatMoney(g.price)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">ایجاد</span>
                            <span className="font-medium">
                              {formatDateTime(g.insertTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">وضعیت</span>
                            <Badge
                              variant={
                                g.status === OrderStatus.Completed
                                  ? "secondary"
                                  : g.status === OrderStatus.Failed ||
                                    g.status === OrderStatus.CanceledByAdmin ||
                                    g.status === OrderStatus.CanceledByUser
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {g.status ? STATUS_FA_LABEL[g.status] : "—"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
            </div>
          )}

          {/* Pagination */}
          {!!pageCount && pageCount > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageIndex === 0}
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                >
                  قبلی
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={i === pageIndex ? "default" : "ghost"}
                      onClick={() => setPageIndex(i)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageIndex >= pageCount - 1}
                  onClick={() =>
                    setPageIndex((p) => Math.min(pageCount - 1, p + 1))
                  }
                >
                  بعدی
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
