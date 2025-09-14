import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Wallet,
  Plus,
  History,
  CreditCard,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletBalance, useWalletTransactions } from "@/hooks/wallet";
import { TransactionType, PaymentMethod } from "@/types";
import type { WalletTransaction } from "@/types";
import { formatPrice } from "@/lib/utils";

function WalletView() {
  const [showBalance, setShowBalance] = useState(true);
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
  } = useWalletBalance();
  const { data: transactionsData, isLoading: transactionsLoading } =
    useWalletTransactions({
      pageIndex: 1,
      pageSize: 5, // Show only recent 5 transactions
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

  if (balanceError) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">خطا در بارگذاری اطلاعات کیف پول</p>
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
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">کیف پول من</h1>
            <p className="text-muted-foreground">
              مدیریت موجودی و تراکنش‌های شما
            </p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium opacity-90">
              موجودی کیف پول
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-primary-foreground hover:bg-white/10"
            >
              {showBalance ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              {balanceLoading ? (
                <Skeleton className="h-8 w-32 bg-white/20" />
              ) : (
                <div className="text-3xl font-bold">
                  {showBalance
                    ? `${
                        formatPrice(balanceData?.result?.totalAmount || 0) 
                      } تومان`
                    : "••••••••"}
                </div>
              )}
              {!balanceLoading && (
                <p className="text-sm opacity-80 mt-1">
                  {formatPrice(balanceData?.result?.transactionsCount || 0)} تراکنش
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link to="/wallet/increase-credit">
                  <Plus className="w-4 h-4 mr-2" />
                  افزایش اعتبار
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-white/10"
              >
                <Link to="/wallet/transactions">
                  <History className="w-4 h-4 mr-2" />
                  تاریخچه
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
        {/* Background decoration */}
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">افزایش اعتبار</h3>
                <p className="text-sm text-muted-foreground">شارژ کیف پول</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/wallet/increase-credit">
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">تاریخچه تراکنش‌ها</h3>
                <p className="text-sm text-muted-foreground">
                  مشاهده همه تراکنش‌ها
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/wallet/transactions">
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">حساب‌های بانکی</h3>
                <p className="text-sm text-muted-foreground">مدیریت حساب‌ها</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/wallet/bank-accounts">
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            آخرین تراکنش‌ها
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/wallet/transactions">
              مشاهده همه
              <ArrowUpRight className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : transactionsData?.result?.transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>هنوز تراکنشی انجام نشده است</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactionsData?.result?.transactions
                .slice(0, 5)
                .map((transaction: WalletTransaction, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === TransactionType.Credit
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {transaction.type === TransactionType.Credit ? (
                        <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400 rotate-180" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {getTransactionTypeLabel(transaction.type)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.insertTime)}
                      </p>
                    </div>
                    <div
                      className={`text-right font-semibold ${
                        transaction.type === TransactionType.Credit
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatPrice(transaction.amount)} تومان
                      {/* {transaction.type === TransactionType.Credit ? "+" : "-"} */}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default WalletView;
