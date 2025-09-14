import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  History,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletTransactions } from "@/hooks/wallet";
import { TransactionType, PaymentMethod } from "@/types";
import type { WalletTransaction } from "@/types";
import { formatPrice } from "@/lib/utils";

function WalletTransactionsView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [transactionType, setTransactionType] = useState<
    TransactionType | undefined
  >();
  const pageSize = 10;

  const { data, isLoading, error } = useWalletTransactions({
    pageIndex: currentPage,
    pageSize,
    filter: filter || undefined,
    type: transactionType,
  });

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat("fa-IR", {
  //     style: "currency",
  //     currency: "IRR",
  //     minimumFractionDigits: 0,
  //   }).format(amount);
  // };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    return type === TransactionType.Credit ? "واریز" : "برداشت";
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    return method === PaymentMethod.Manual ? "دستی" : "درگاه بانکی";
  };

  const totalPages = data
    ? Math.ceil(data.result?.pagination.totalRow / pageSize)
    : 0;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">خطا در بارگذاری تراکنش‌ها</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/wallet">
              <ArrowLeft className="w-4 h-4 mr-2" />
              بازگشت
            </Link>
          </Button>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">تاریخچه تراکنش‌ها</h1>
            <p className="text-muted-foreground">
              مشاهده و فیلتر کردن تراکنش‌های شما
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          خروجی اکسل
        </Button>
      </div>

      {/* Summary Card */}
      {data && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">کل تراکنش‌ها</p>
                <p className="text-2xl font-bold">
                  {formatPrice(data.result?.pagination.totalRow)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">مجموع مبلغ</p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(data.result?.totalAmount)} تومان
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">صفحه فعلی</p>
                <p className="text-2xl font-bold">
                  {currentPage} از {totalPages}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            فیلترها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">جستجو در توضیحات</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="جستجو..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">نوع تراکنش</label>
              <Select
                value={transactionType?.toString() || "all"}
                onValueChange={(value) =>
                  setTransactionType(
                    value === "all"
                      ? undefined
                      : (parseInt(value) as TransactionType)
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه تراکنش‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه تراکنش‌ها</SelectItem>
                  <SelectItem value={TransactionType.Credit.toString()}>
                    واریز
                  </SelectItem>
                  <SelectItem value={TransactionType.Debit.toString()}>
                    برداشت
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setFilter("");
                  setTransactionType(undefined);
                  setCurrentPage(1);
                }}
                variant="outline"
                className="w-full"
              >
                پاک کردن فیلترها
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>لیست تراکنش‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.result?.transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">تراکنشی یافت نشد</p>
              <p>با فیلترهای انتخابی شما هیچ تراکنشی وجود ندارد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.result?.transactions.map(
                (transaction: WalletTransaction, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === TransactionType.Credit
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {transaction.type === TransactionType.Credit ? (
                        <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400 rotate-180" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {getTransactionTypeLabel(transaction.type)}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-1">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.insertTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          transaction.type === TransactionType.Credit
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === TransactionType.Credit
                          ? "+"
                          : "-"}
                        {transaction.amount} تومان
                      </div>
                      <Badge
                        variant={
                          transaction.type === TransactionType.Credit
                            ? "default"
                            : "secondary"
                        }
                        className="mt-1"
                      >
                        {transaction.type === TransactionType.Credit
                          ? "واریز"
                          : "برداشت"}
                      </Badge>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            قبلی
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}

export default WalletTransactionsView;
