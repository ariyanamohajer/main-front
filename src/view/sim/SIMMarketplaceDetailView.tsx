import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe,
  Smartphone,
  Building2,
  CalendarDays,
  Share2,
  Copy,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useSIMProduct } from "@/hooks/sim/useSIMProduct";
import SIMOrderDialog from "@/components/features/sim/SIMOrderDialog";
import ChargeTopUpDialog from "@/components/features/sim/ChargeTopUpDialog";

const toFaNum = (n: number) => n.toLocaleString("fa-IR");
const formatDateFa = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("fa-IR") : "";

const clean = (s?: string | null) => (s ?? "").trim();

export default function SIMMarketPlaceDetailView() {
  const [openInternetOrder, setOpenInternetOrder] = useState(false);
  const [openChargeTopUp, setOpenChargeTopUp] = useState(false);
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useSIMProduct(productId);
  const product = data?.result?.product ?? null;

  const [copied, setCopied] = useState(false);

  const operatorName = useMemo(() => clean(product?.operator?.name), [product]);
  const countryName = useMemo(() => clean(product?.country?.name), [product]);

  const isInternetPackage = !!product?.internetPackage; // true => internet package, false => charge
  const isIran = (() => {
    const name = (product?.country?.name ?? "").trim();
    const code = String(product?.country?.callingCode ?? "").replace(/^\+/, "");
    return name === "Iran" || name === "ایران" || code === "98";
  })();
  const primaryCtaLabel =
    !isInternetPackage && isIran ? "خرید شارژ مستقیم" : "خرید بسته";
  const onPrimaryClick = () => {
    if (!isInternetPackage && isIran) {
      // Iran + no internetPackage → Charge modal
      setOpenChargeTopUp(true);
    } else {
      // internetPackage exists (any country) OR non-Iran + no internetPackage → SIM order
      setOpenInternetOrder(true);
    }
  };
  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name ?? "SIM",
          text: operatorName,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // ignore
    }
  };

  const onCopyId = async () => {
    if (!product?.id) return;
    await navigator.clipboard.writeText(product.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // ---------- Loading ----------
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5">
            <CardContent className="p-4">
              <Skeleton className="w-full aspect-[4/3] rounded-lg" />
            </CardContent>
          </Card>
          <Card className="lg:col-span-7">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
              <Separator />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ---------- Error / Not found ----------
  if (error || !data?.success || !product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">محصول یافت نشد</h2>
            <p className="text-muted-foreground mb-6">
              در دریافت اطلاعات این سیم کارت مشکلی رخ داد.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => refetch()}>
                تلاش مجدد
              </Button>
              <Button onClick={() => navigate("/sim")}>
                بازگشت به بازار سیم کارت
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- Success ----------
  return (
    <>
      <div className="min-h-screen bg-[color:var(--background)]">
        {/* Header / Breadcrumb */}
        <div className="border-b border-[color:var(--border)] bg-[color:var(--card)]/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between gap-3">
              <nav
                className="text-sm text-muted-foreground"
                dir="rtl"
                aria-label="breadcrumb"
              >
                <ol className="flex items-center gap-1">
                  <li>
                    <Link to="/sim" className="hover:text-foreground">
                      بازار سیم کارت
                    </Link>
                  </li>
                  <li className="mx-1">/</li>
                  <li className="text-foreground truncate max-w-[50vw]">
                    {product.name}
                  </li>
                </ol>
              </nav>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/sim")}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                بازگشت
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Image / Visual */}
            <Card className="lg:col-span-5 bg-[color:var(--card)] border-[color:var(--border)]">
              <CardContent className="p-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-[4/3] object-cover rounded-lg border border-[color:var(--border)]"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] grid place-items-center rounded-lg bg-[color:var(--accent)]/50 border border-[color:var(--border)]">
                    <Smartphone className="w-14 h-14 text-[color:var(--muted-foreground)]" />
                  </div>
                )}
                <div
                  className="mt-3 flex flex-wrap items-center gap-2"
                  dir="rtl"
                >
                  <Badge variant="secondary" className="px-2 py-1">
                    <Building2 className="w-3.5 h-3.5 ml-1" />
                    {operatorName || "اپراتور نامشخص"}
                  </Badge>
                  <Badge variant="outline" className="px-2 py-1">
                    <Globe className="w-3.5 h-3.5 ml-1" />
                    {countryName}
                    {product.country?.callingCode
                      ? ` (+${product.country.callingCode})`
                      : ""}
                  </Badge>
                  <Badge variant="outline" className="px-2 py-1">
                    <CalendarDays className="w-3.5 h-3.5 ml-1" />
                    ثبت: {formatDateFa(product.insertTime)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Right: Details */}
            <Card className="lg:col-span-7 bg-[color:var(--card)] border-[color:var(--border)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold" dir="rtl">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5" dir="rtl">
                {/* Price */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      قیمت
                    </div>
                    <div className="text-3xl font-extrabold tracking-tight text-[color:var(--foreground)]">
                      {toFaNum(product.price)}{" "}
                      <span className="text-base font-normal text-muted-foreground align-baseline">
                        تومان
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onShare}
                      aria-label="اشتراک‌گذاری"
                    >
                      {copied ? (
                        <Copy className="w-4 h-4" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onCopyId}
                      aria-label="کپی شناسه"
                    >
                      <CodeMono>{shortId(product.id)}</CodeMono>
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">توضیحات</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {clean(product.description) ||
                      "برای این محصول توضیحاتی ثبت نشده است."}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button className="flex-1 h-11" onClick={onPrimaryClick}>
                    {primaryCtaLabel}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky bottom purchase bar (mobile only) */}
        <div className="md:hidden fixed bottom-[calc(56px+env(safe-area-inset-bottom))] left-0 right-0 px-4">
          <div className="mx-auto max-w-screen-sm rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-lg">
            <div
              className="flex items-center justify-between px-4 py-3"
              dir="rtl"
            >
              <div className="text-sm">
                <div className="text-muted-foreground">قیمت</div>
                <div className="text-lg font-bold">
                  {toFaNum(product.price)}{" "}
                  <span className="text-xs text-muted-foreground">تومان</span>
                </div>
              </div>
              <Button className="h-10" onClick={onPrimaryClick}>
                {primaryCtaLabel}
              </Button>
            </div>
          </div>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </div>
      {!isInternetPackage && isIran && (
        <ChargeTopUpDialog
          open={openChargeTopUp}
          onOpenChange={setOpenChargeTopUp}
          // productId={product.id}
          operatorId={product.operator.id} // recommended to get range
          operatorName={product.operator.name}
          countryName={product.country.name}
          callingCode={product.country.callingCode}
          productName={product.name}
        />
      )}

      {/* Otherwise → SIM order (covers: has internetPackage OR non-Iran without internetPackage) */}
      {(isInternetPackage || !isIran) && (
        <SIMOrderDialog
          open={openInternetOrder}
          onOpenChange={setOpenInternetOrder}
          productId={product.id}
          productName={product.name}
          operatorName={operatorName}
          countryName={countryName}
          callingCode={product.country?.callingCode}
        />
      )}
    </>
  );
}

function shortId(id: string, keep = 4) {
  if (!id) return "";
  if (id.length <= keep * 2 + 1) return id;
  return `${id.slice(0, keep)}…${id.slice(-keep)}`;
}

// Minimal inline code-styled component (keeps dependencies small)
function CodeMono({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs px-2 py-1 rounded bg-[color:var(--accent)] text-[color:var(--accent-foreground)] border border-[color:var(--border)]">
      {children}
    </span>
  );
}
