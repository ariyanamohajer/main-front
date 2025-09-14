// src/components/features/sim/SIMOrderDialog.tsx
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Loader2,
  Phone,
  Building2,
  Globe,
} from "lucide-react";
import { useCreateSIMOrder } from "@/hooks/sim/useCreateSIMOrder";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName?: string;
  operatorName?: string;
  countryName?: string;
  callingCode?: string | number; // e.g. "93"
};

// ---------- helpers ----------
const toFaNum = (v: string | number) =>
  `${v}`.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const normalizeDigits = (s: string) =>
  s
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))) // Arabic-Indic → Latin
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))) // Persian → Latin
    .replace(/\D+/g, ""); // keep digits only

const isIranCountry = (name?: string | null, callingCode?: string | number) => {
  const code = (callingCode ?? "").toString().replace(/^\+/, "");
  const nm = (name ?? "").toString().trim();
  return code === "98" || /^(iran|ایران)$/i.test(nm);
};

/**
 * Returns UI preview + the EXACT payload you must POST.
 * - Iran: payload "0" + localDigits (single leading 0)
 * - Other: payload localDigits only (no +, no code)
 */
const buildPhoneValues = (
  local: string, // user-typed local part (no country code)
  callingCode?: string | number,
  countryName?: string | null
) => {
  const localDigits = normalizeDigits(local);

  if (isIranCountry(countryName, callingCode)) {
    const trimmed = localDigits.replace(/^0+/, "");
    const nat = `0${trimmed}`;
    return { preview: nat, payload: nat };
  }

  // Non-Iran → digits only
  return { preview: localDigits, payload: localDigits };
};

export default function SIMOrderDialog({
  open,
  onOpenChange,
  productId,
  productName,
  operatorName,
  countryName,
  callingCode,
}: Props) {
  const code = (callingCode ?? "").toString().replace(/^\+/, ""); // e.g. "93"
  const [local, setLocal] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // Build preview/payload per your rule
  const { preview: phonePreview, payload: phonePayload } = React.useMemo(
    () => buildPhoneValues(local, callingCode, countryName),
    [local, callingCode, countryName]
  );

  const { mutate, isPending, isSuccess, data, error, reset } =
    useCreateSIMOrder();

  // Only show success UI when API success flag is true
  const showSuccess = Boolean(isSuccess && data?.success);

  const isValid = React.useMemo(() => {
    const digits = normalizeDigits(local);
    // basic sanity: at least 5 local digits; adjust if needed
    return digits.length >= 5 && digits.length <= 15;
  }, [local]);

  const onSubmit = () => {
    if (!isValid) return;
    mutate(
      { productId, phone: phonePayload }, // ✅ Iran: 0XXXXXXXXXX, Else: digits only
      {
        onSuccess: () => {
          // keep modal open, render success state below
        },
      }
    );
  };

  const copyOrderId = async () => {
    const id = data?.result?.orderId;
    if (!id) return;
    await navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const closeAll = () => {
    reset();
    setLocal("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : closeAll())}>
      <DialogContent className="sm:max-w-lg w-[95vw] rounded-xl bg-[color:var(--card)] text-[color:var(--foreground)] border-[color:var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-xl">خرید بسته اینترنت</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            ثبت سفارش برای{" "}
            <span className="font-semibold text-foreground">{productName}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Success state */}
        {showSuccess ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div className="text-foreground">سفارش با موفقیت ثبت شد.</div>
            </div>

            <div className="rounded-lg bg-[color:var(--accent)]/50 border border-[color:var(--border)] p-4">
              <div className="text-sm text-muted-foreground mb-1">کد سفارش</div>
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-sm">
                  {data?.result?.orderId ?? "-"}
                </div>
                <Button variant="outline" size="sm" onClick={copyOrderId}>
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">اپراتور:</span>
                <span className="font-medium">{operatorName || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">کشور:</span>
                <span className="font-medium">{countryName || "—"}</span>
              </div>
              <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">شماره ثبت‌شده:</span>
                <span className="font-medium ltr">{phonePreview}</span>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-start">
              <Button onClick={closeAll}>بستن</Button>
            </DialogFooter>
          </div>
        ) : (
          // Form state
          <div className="space-y-5">
            {/* Product summary */}
            <div className="flex flex-wrap items-center gap-2">
              {operatorName && <Badge variant="secondary">{operatorName}</Badge>}
              {countryName && (
                <Badge variant="outline">
                  {countryName}
                  {code ? ` (+${code})` : ""}
                </Badge>
              )}
            </div>

            {/* Phone input with prefix */}
            <div className="space-y-2">
              <Label htmlFor="localNumber">شماره تلفن (بدون کد کشور)</Label>
              <div className="flex items-stretch gap-2" dir="ltr">
                <div className="px-3 min-w-20 grid place-items-center rounded-md border bg-[color:var(--muted)] text-sm">
                  {/* Always show calling code in prefix (per request) */}
                  {code ? `+${toFaNum(code)}` : "بدون کد"}
                </div>
                <Input
                  id="localNumber"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="912345678"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                شماره کامل: <span className="font-mono ltr">{phonePreview}</span>
              </div>
              {!isValid && (
                <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5" />
                  لطفاً حداقل ۵ رقم (بدون کد کشور) وارد کنید.
                </div>
              )}
            </div>

            {/* Error from API */}
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 text-destructive text-sm px-3 py-2">
                مشکلی در ثبت سفارش رخ داد. دوباره تلاش کنید.
              </div>
            )}

            <DialogFooter className="flex gap-2 sm:justify-start">
              <Button
                onClick={onSubmit}
                disabled={!isValid || isPending}
                className="min-w-28"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    در حال ثبت…
                  </>
                ) : (
                  "ثبت سفارش"
                )}
              </Button>
              <Button variant="outline" onClick={closeAll}>
                انصراف
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
