// // src/components/features/sim/ChargeTopUpDialog.tsx
// import * as React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { AlertCircle, Loader2, Phone, Building2, Globe } from "lucide-react";

// import { useOperator } from "@/hooks/sim";
// import { useDirectRecharge } from "@/hooks/sim/useDirectRecharge";

// // ✅ runtime value + erased type
// import { ChargeType as ChargeTypeValues } from "@/types";
// import type { ChargeType } from "@/types";

// // ---------- helpers ----------
// const normalizeDigits = (s: string) =>
//   s
//     .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))) // Arabic-Indic → Latin
//     .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))) // Persian → Latin
//     .replace(/\D+/g, "");

// const isIranCountry = (name?: string | null, callingCode?: string | number) => {
//   const code = (callingCode ?? "").toString().replace(/^\+/, "");
//   const nm = (name ?? "").toString();
//   return code === "98" || /^(iran|ایران)$/i.test(nm.trim());
// };

// // Build preview/payload according to the Iran rule
// const buildPhoneValues = (
//   local: string, // user-typed local part (no country code)
//   callingCode?: string | number,
//   countryName?: string | null
// ) => {
//   const code = (callingCode ?? "").toString().replace(/^\+/, "");
//   const localDigits = normalizeDigits(local);

//   if (isIranCountry(countryName, code)) {
//     // Iran → send national format with a single leading 0, preview the same
//     const trimmed = localDigits.replace(/^0+/, "");
//     const nat = `0${trimmed}`;
//     return { preview: nat, payload: nat };
//   }

//   // Non-Iran → digits only: {code}{local}; preview with '+'
//   const intl = code ? `${code}${localDigits}` : localDigits;
//   return { preview: code ? `+${intl}` : intl, payload: intl };
// };

// // IRR → toman helper & formatters (kept for API-range operators)
// const toToman = (irr: number) => Math.round(irr / 10);
// const roundTo = (n: number, step = 1000) => Math.round(n / step) * step;
// const formatToman = (n?: number) =>
//   typeof n === "number" ? n.toLocaleString("fa-IR") : "-";

// // ---------- constants for domestic rules ----------
// const DOMESTIC_MIN = 1000;
// const DOMESTIC_MAX = 20000;

// const SHUTTLE_AMOUNTS: number[] = [
//   1000, 2000, 5000, 10000, 20000, 30000, 40000, 50000,
//   60000, 70000, 80000, 90000, 100000, 110000, 120000,
//   140000, 150000, 160000, 170000, 180000, 190000, 200000,
// ];

// // props
// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;

//   // open by operator (used for شارژ داخلی)
//   operatorId?: number;

//   // meta
//   productName?: string;
//   operatorName?: string;
//   countryName?: string | null;
//   callingCode?: string | number; // e.g., "98"
// };

// export default function ChargeTopUpDialog({
//   open,
//   onOpenChange,
//   operatorId,
//   productName,
//   operatorName,
//   countryName,
//   callingCode,
// }: Props) {
//   const operatorIdUsed = operatorId ?? null;

//   // Load operator (min/max/priceRate) – used for non-domestic-special cases
//   const { data: operatorResp } = useOperator(operatorIdUsed);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const op: any = operatorResp?.result?.operator;

//   const priceRate: number | undefined = typeof op?.priceRate === "number" ? op.priceRate : undefined;
//   const minSrc: number | undefined = typeof op?.min === "number" ? op.min : undefined;
//   const maxSrc: number | undefined = typeof op?.max === "number" ? op.max : undefined;

//   // Base range from API (if any)
//   const apiMinToman: number | undefined = React.useMemo(() => {
//     if (minSrc == null) return undefined;
//     return priceRate ? roundTo(toToman(minSrc * priceRate)) : roundTo(minSrc);
//   }, [minSrc, priceRate]);

//   const apiMaxToman: number | undefined = React.useMemo(() => {
//     if (maxSrc == null) return undefined;
//     return priceRate ? roundTo(toToman(maxSrc * priceRate)) : roundTo(maxSrc);
//   }, [maxSrc, priceRate]);

//   // ---------- Domestic special-case detection ----------
//   const upperName = (operatorName ?? op?.name ?? "").toString().toUpperCase();
//   const opNameRaw = (op?.name ?? operatorName ?? "").toString(); // prefer API name
// const opId = Number(op?.id ?? operatorIdUsed ?? 0);
//   const isDomestic = isIranCountry(countryName, callingCode);
//   const isDomesticRTL_MCI_MTN = isDomestic && /(RTL|MCI|MTN)/.test(upperName);
//   const isShuttle = (/(SHT|SHUTTLE|SHATEL|شاتل|شاتل‌موبایل)/i.test(opNameRaw) || opId === 3042);

//   // Effective range/suggestions
//   const effectiveMin = isDomesticRTL_MCI_MTN ? DOMESTIC_MIN : apiMinToman;
//   const effectiveMax = isDomesticRTL_MCI_MTN ? DOMESTIC_MAX : apiMaxToman;

//   const defaultSuggestions = React.useMemo(() => {
//     if (isDomesticRTL_MCI_MTN) {
//       // Clean, evenly distributed domestic suggestions
//       return [1000, 5000, 10000, 15000, 20000];
//     }
//     if (
//       effectiveMin != null &&
//       effectiveMax != null &&
//       effectiveMin > 0 &&
//       effectiveMax > effectiveMin
//     ) {
//       const mk = (t: number) => roundTo(t, 1000);
//       const s = [
//         effectiveMin,
//         mk(effectiveMin + (effectiveMax - effectiveMin) * 0.25),
//         mk((effectiveMin + effectiveMax) / 2),
//         mk(effectiveMin + (effectiveMax - effectiveMin) * 0.75),
//         effectiveMax,
//       ];
//       return Array.from(new Set(s)).sort((a, b) => a - b);
//     }
//     // Fallback when no range is known
//     return [20000, 50000, 100000];
//   }, [effectiveMin, effectiveMax, isDomesticRTL_MCI_MTN]);

//   // ---------- form state ----------
//   const [local, setLocal] = React.useState(""); // local digits only
//   const [amount, setAmount] = React.useState<number | "">("");
//   const [chargeType, setChargeType] = React.useState<ChargeType>(ChargeTypeValues.Normal);

//   // Phone preview & payload
//   const { preview: phonePreview, payload: phonePayload } = React.useMemo(
//     () => buildPhoneValues(local, callingCode, countryName),
//     [local, callingCode, countryName]
//   );

//   // Validation
//   const phoneValid = React.useMemo(() => {
//     const digits = normalizeDigits(local);
//     return digits.length >= 5 && digits.length <= 15;
//   }, [local]);

//   const amountValid = React.useMemo(() => {
//     if (amount === "") return false;
//     const val = Number(amount);

//     if (isShuttle) {
//       // must be from the fixed list
//       return SHUTTLE_AMOUNTS.includes(val);
//     }

//     if (effectiveMin != null && effectiveMax != null) {
//       return val >= effectiveMin && val <= effectiveMax;
//     }
//     return val > 0;
//   }, [amount, isShuttle, effectiveMin, effectiveMax]);

//   const ready = phoneValid && amountValid && !!operatorIdUsed;

//   // Mutation
//   const { mutate, isPending } = useDirectRecharge();

//   const onSubmit = () => {
//     if (!ready) return;
//     mutate(
//       {
//         phone: phonePayload,         // Iran => with a single leading 0; others => digits only (no '+')
//         operatorId: operatorIdUsed!, // asserted; ready already checked
//         amount: Number(amount),
//         chargeType,
//       },
//       {
//         onSuccess: () => {
//           onOpenChange(false);
//           setLocal("");
//           setAmount("");
//           setChargeType(ChargeTypeValues.Normal);
//         },
//       }
//     );
//   };

//   const onPickSuggestion = (v: number) => setAmount(v);

//   // ---------- UI ----------
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent
//         className="sm:max-w-lg w-[95vw] rounded-xl bg-[color:var(--card)] text-[color:var(--foreground)] border-[color:var(--border)]"
//       >
//         <DialogHeader >
//           <DialogTitle>خرید شارژ مستقیم</DialogTitle>
//           <DialogDescription className="text-muted-foreground">
//             {productName ? <span className="text-foreground">{productName}</span> : "ثبت سفارش شارژ"}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-5">
//           {/* Summary badges */}
//           <div className="flex flex-wrap items-center gap-2">
//             {operatorName && <Badge variant="secondary">{operatorName}</Badge>}
//             {countryName && (
//               <Badge variant="outline">
//                 <Globe className="w-3.5 h-3.5 ml-1" />
//                 {countryName}
//                 {callingCode ? ` (+${String(callingCode).replace(/^\+/, "")})` : ""}
//               </Badge>
//             )}
//             {operatorIdUsed && (
//               <Badge variant="outline" className="font-mono">OPID: {operatorIdUsed}</Badge>
//             )}
//           </div>

//           {/* Phone */}
//           <div className="space-y-2">
//             <Label htmlFor="charge-phone">شماره تلفن (بدون کد کشور)</Label>
//             <div className="flex items-stretch gap-2">

//               <Input
//                 id="charge-phone"
//                 dir="ltr"
//                 inputMode="numeric"
//                 placeholder={isIranCountry(countryName, callingCode) ? "9100000000" : "912345678"}
//                 value={local}
//                 onChange={(e) => setLocal(e.target.value)}
//                 className="flex-1"
//               />
//                             <div className="px-3 min-w-20 grid place-items-center rounded-md border bg-[color:var(--muted)] text-sm">
//                 {/* Always show calling code in prefix; payload handles Iran '0' rule */}
//                 {callingCode ? `${String(callingCode).replace(/^\+/, "")}+` : "بدون کد"}
//               </div>
//             </div>
//             <div className="text-xs text-muted-foreground">
//               شماره کامل: <span className="font-mono ltr">{phonePreview}</span>
//             </div>
//             {!phoneValid && (
//               <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
//                 <AlertCircle className="w-3.5 h-3.5" />
//                 لطفاً حداقل ۵ رقم (بدون کد کشور) وارد کنید.
//               </div>
//             )}
//           </div>

//           {/* Amount */}
//           {isShuttle ? (
//             // ---------- SHUTTLE (fixed-only) ----------
//             <div className="space-y-2">
//               <Label>مبلغ شارژ (فقط از لیست)</Label>

//               <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
//                 {SHUTTLE_AMOUNTS.map((v) => {
//                   const active = amount === v;
//                   return (
//                     <Button
//                       key={v}
//                       type="button"
//                       variant={active ? "default" : "secondary"}
//                       size="sm"
//                       className="justify-center"
//                       onClick={() => onPickSuggestion(v)}
//                     >
//                       {v.toLocaleString("fa-IR")} تومان
//                     </Button>
//                   );
//                 })}
//               </div>

//               <Input
//                 dir="ltr"
//                 value={amount === "" ? "" : amount}
//                 disabled
//                 className="opacity-70"
//                 placeholder="یک مبلغ را از لیست انتخاب کنید"
//               />

//               {amount === "" && (
//                 <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
//                   <AlertCircle className="w-3.5 h-3.5" />
//                   لطفاً یکی از مبالغ لیست را انتخاب کنید.
//                 </div>
//               )}
//             </div>
//           ) : (
//             // ---------- DOMESTIC RTL/MCI/MTN (1000..20000) OR OTHERS (API-based) ----------
//             <div className="space-y-2">
//               <Label htmlFor="charge-amount">مبلغ شارژ</Label>
//               <div className="relative">
//                 <Input
//                   id="charge-amount"
//                   dir="ltr"
//                   inputMode="numeric"
//                   placeholder={isDomesticRTL_MCI_MTN ? "بین 1000 تا 20000" : "مثلاً 50000"}
//                   value={amount}
//                   onChange={(e) => {
//                     const digits = normalizeDigits(e.target.value);
//                     setAmount(digits === "" ? "" : Number(digits));
//                   }}
//                   className="pr-4 pl-20"
//                 />
//                 <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md border bg-[color:var(--muted)]">
//                   تومان
//                 </span>
//               </div>

//               {/* Range text */}
//               {isDomesticRTL_MCI_MTN ? (
//                 <div className="text-xs text-muted-foreground">
//                   بازه مجاز: <b>{DOMESTIC_MIN.toLocaleString("fa-IR")} تومان</b> تا{" "}
//                   <b>{DOMESTIC_MAX.toLocaleString("fa-IR")} تومان</b>
//                 </div>
//               ) : effectiveMin != null && effectiveMax != null ? (
//                 <div className="text-xs text-muted-foreground">
//                   بازه مجاز: <b>{formatToman(effectiveMin)} تومان</b> تا{" "}
//                   <b>{formatToman(effectiveMax)} تومان</b>
//                 </div>
//               ) : (
//                 <div className="text-xs text-muted-foreground">
//                   بازه مبلغ برای این اپراتور مشخص نشده است.
//                 </div>
//               )}

//               {/* Suggestions */}
//               <div className="flex flex-wrap gap-2 pt-1">
//                 {(isDomesticRTL_MCI_MTN ? defaultSuggestions : defaultSuggestions).map((s) => (
//                   <Button
//                     key={s}
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => onPickSuggestion(s)}
//                   >
//                     {s.toLocaleString("fa-IR")} تومان
//                   </Button>
//                 ))}
//               </div>

//               {amount !== "" && !amountValid && (
//                 <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
//                   <AlertCircle className="w-3.5 h-3.5" />
//                   {isDomesticRTL_MCI_MTN
//                     ? `مبلغ باید بین ${DOMESTIC_MIN.toLocaleString("fa-IR")} تا ${DOMESTIC_MAX.toLocaleString("fa-IR")} تومان باشد.`
//                     : "مبلغ نامعتبر است."}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Charge Type */}
//           <div className="space-y-2">
//             <Label>نوع شارژ</Label>
//             <RadioGroup
//               dir="rtl"
//               value={String(chargeType)}
//               onValueChange={(v) => setChargeType(Number(v) as ChargeType)}
//               className="grid grid-cols-1 sm:grid-cols-3 gap-2"
//             >
//               <div className="flex items-center space-x-2 space-x-reverse rounded-md border p-3">
//                 <RadioGroupItem id="ch-normal" value={String(ChargeTypeValues.Normal)} />
//                 <Label htmlFor="ch-normal" className="cursor-pointer w-full">معمولی</Label>
//               </div>
//               <div className="flex items-center space-x-2 space-x-reverse rounded-md border p-3">
//                 <RadioGroupItem id="ch-amazing" value={String(ChargeTypeValues.Amazing)} />
//                 <Label htmlFor="ch-amazing" className="cursor-pointer w-full">شگفت‌انگیز</Label>
//               </div>
//               <div className="flex items-center space-x-2 space-x-reverse rounded-md border p-3">
//                 <RadioGroupItem id="ch-permanent" value={String(ChargeTypeValues.Permanent)} />
//                 <Label htmlFor="ch-permanent" className="cursor-pointer w-full">دائمی</Label>
//               </div>
//             </RadioGroup>
//           </div>

//           <Separator />

//           {/* Technicals / read-only */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <Building2 className="w-4 h-4" />
//               <span>شناسه اپراتور:</span>
//               <span className="font-mono text-foreground">{operatorIdUsed ?? "-"}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Phone className="w-4 h-4" />
//               <span>پیش‌شماره:</span>
//               <span className="font-mono text-foreground">
//                 {callingCode ? `${String(callingCode).replace(/^\+/, "")}+` : "-"}
//               </span>
//             </div>
//           </div>
//         </div>

//         <DialogFooter className="sm:justify-start">
//           <Button
//             onClick={onSubmit}
//             disabled={!ready || isPending}
//             className="min-w-32"
//           >
//             {isPending ? (
//               <>
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 در حال ثبت…
//               </>
//             ) : (
//               "ثبت سفارش شارژ"
//             )}
//           </Button>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             انصراف
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


// src/components/features/sim/ChargeTopUpDialog.tsx
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Loader2, Phone, Building2, Globe } from "lucide-react";

import { useOperator } from "@/hooks/sim";
import { useDirectRecharge } from "@/hooks/sim/useDirectRecharge";

// ✅ runtime value + erased type
import { ChargeType as ChargeTypeValues } from "@/types";
import type { ChargeType } from "@/types";

// ---------- helpers ----------
const normalizeDigits = (s: string) =>
  s
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))) // Arabic-Indic → Latin
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))) // Persian → Latin
    .replace(/\D+/g, "");

const isIranCountry = (name?: string | null, callingCode?: string | number) => {
  const code = (callingCode ?? "").toString().replace(/^\+/, "");
  const nm = (name ?? "").toString();
  return code === "98" || /^(iran|ایران)$/i.test(nm.trim());
};

// Build preview/payload according to the Iran rule
const buildPhoneValues = (
  local: string, // user-typed local part (no country code)
  callingCode?: string | number,
  countryName?: string | null
) => {
  const code = (callingCode ?? "").toString().replace(/^\+/, "");
  const localDigits = normalizeDigits(local);

  if (isIranCountry(countryName, code)) {
    // Iran → send national format with a single leading 0, preview the same
    const trimmed = localDigits.replace(/^0+/, "");
    const nat = `0${trimmed}`;
    return { preview: nat, payload: nat };
  }

  // Non-Iran → digits only: {code}{local}; preview with '+'
  const intl = code ? `${code}${localDigits}` : localDigits;
  return { preview: code ? `+${intl}` : intl, payload: intl };
};

// IRR → toman helper & formatters (kept for API-range operators)
const toToman = (irr: number) => Math.round(irr / 10);
const roundTo = (n: number, step = 1000) => Math.round(n / step) * step;
const formatToman = (n?: number) =>
  typeof n === "number" ? n.toLocaleString("fa-IR") : "-";

// ---------- constants for domestic rules ----------
const DOMESTIC_MIN = 1000;
const DOMESTIC_MAX = 20000;

const SHUTTLE_AMOUNTS: number[] = [
  1000, 2000, 5000, 10000, 20000, 30000, 40000, 50000,
  60000, 70000, 80000, 90000, 100000, 110000, 120000,
  140000, 150000, 160000, 170000, 180000, 190000, 200000,
];

// props
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // open by operator (used for شارژ داخلی)
  operatorId?: number;

  // meta
  productName?: string;
  operatorName?: string;
  countryName?: string | null;
  callingCode?: string | number; // e.g., "98"
};

export default function ChargeTopUpDialog({
  open,
  onOpenChange,
  operatorId,
  productName,
  operatorName,
  countryName,
  callingCode,
}: Props) {
  const operatorIdUsed = operatorId ?? null;

  // Load operator (min/max/priceRate) – used for non-domestic-special cases
  const { data: operatorResp } = useOperator(operatorIdUsed);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const op: any = operatorResp?.result?.operator;

  const priceRate: number | undefined = typeof op?.priceRate === "number" ? op.priceRate : undefined;
  const minSrc: number | undefined = typeof op?.min === "number" ? op.min : undefined;
  const maxSrc: number | undefined = typeof op?.max === "number" ? op.max : undefined;

  // Base range from API (if any)
  const apiMinToman: number | undefined = React.useMemo(() => {
    if (minSrc == null) return undefined;
    return priceRate ? roundTo(toToman(minSrc * priceRate)) : roundTo(minSrc);
  }, [minSrc, priceRate]);

  const apiMaxToman: number | undefined = React.useMemo(() => {
    if (maxSrc == null) return undefined;
    return priceRate ? roundTo(toToman(maxSrc * priceRate)) : roundTo(maxSrc);
  }, [maxSrc, priceRate]);

  // ---------- Domestic / special-case detection ----------
  const opNameRaw = (op?.name ?? operatorName ?? "").toString(); // prefer API name
  const opId = Number(op?.id ?? operatorIdUsed ?? 0);
  const isDomestic = isIranCountry(countryName, callingCode);
  const isDomesticRTL_MCI_MTN =
    isDomestic && /(RTL|MCI|MTN|IR-MCI|همراه|ایرانسل)/i.test(opNameRaw);
  const isShuttle =
    isDomestic &&
    (/(SHT|SHUTTLE|SHATEL|شاتل|شاتل‌موبایل)/i.test(opNameRaw) || opId === 3042);

  // Effective range/suggestions
  const effectiveMin = isDomesticRTL_MCI_MTN ? DOMESTIC_MIN : apiMinToman;
  const effectiveMax = isDomesticRTL_MCI_MTN ? DOMESTIC_MAX : apiMaxToman;

  const defaultSuggestions = React.useMemo(() => {
    if (isDomesticRTL_MCI_MTN) {
      return [1000, 5000, 10000, 15000, 20000];
    }
    if (
      effectiveMin != null &&
      effectiveMax != null &&
      effectiveMin > 0 &&
      effectiveMax > effectiveMin
    ) {
      const mk = (t: number) => roundTo(t, 1000);
      const s = [
        effectiveMin,
        mk(effectiveMin + (effectiveMax - effectiveMin) * 0.25),
        mk((effectiveMin + effectiveMax) / 2),
        mk(effectiveMin + (effectiveMax - effectiveMin) * 0.75),
        effectiveMax,
      ];
      return Array.from(new Set(s)).sort((a, b) => a - b);
    }
    return [20000, 50000, 100000];
  }, [effectiveMin, effectiveMax, isDomesticRTL_MCI_MTN]);

  // ---------- form state ----------
  const [local, setLocal] = React.useState(""); // local digits only
  const [amount, setAmount] = React.useState<number | "">("");
  const [chargeType, setChargeType] = React.useState<ChargeType>(ChargeTypeValues.Normal);

  // Phone preview & payload
  const { preview: phonePreview, payload: phonePayload } = React.useMemo(
    () => buildPhoneValues(local, callingCode, countryName),
    [local, callingCode, countryName]
  );

  // Validation
  const phoneValid = React.useMemo(() => {
    const digits = normalizeDigits(local);
    return digits.length >= 5 && digits.length <= 15;
  }, [local]);

  const amountValid = React.useMemo(() => {
    if (amount === "") return false;
    const val = Number(amount);
    if (isShuttle) return SHUTTLE_AMOUNTS.includes(val);
    if (effectiveMin != null && effectiveMax != null) {
      return val >= effectiveMin && val <= effectiveMax;
    }
    return val > 0;
  }, [amount, isShuttle, effectiveMin, effectiveMax]);

  const ready = phoneValid && amountValid && !!operatorIdUsed;

  // Mutation
  const { mutate, isPending } = useDirectRecharge();

  const onSubmit = () => {
    if (!ready) return;
    mutate(
      {
        phone: phonePayload,         // Iran => with a single leading 0; others => digits only (no '+')
        operatorId: operatorIdUsed!, // asserted; ready already checked
        amount: Number(amount),
        chargeType,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setLocal("");
          setAmount("");
          setChargeType(ChargeTypeValues.Normal);
        },
      }
    );
  };

  const onPickSuggestion = (v: number) => setAmount(v);

  // ---------- UI ----------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Make content flex column; clamp height; scroll inside body; sticky header/footer */}
      <DialogContent
        className={[
          "sm:max-w-lg w-[96vw] max-h-[90vh] p-0 overflow-hidden",
          "rounded-xl bg-[color:var(--card)] text-[color:var(--foreground)] border-[color:var(--border)]",
          "flex flex-col",
        ].join(" ")}
      >
        {/* Sticky header */}
        <DialogHeader
          className={[
            "px-4 pt-4 pb-2",
            "sticky top-0 z-10",
            "bg-[color:var(--card)]/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur",
            "border-b border-[color:var(--border)]",
          ].join(" ")}
        >
          <DialogTitle>خرید شارژ مستقیم</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {productName ? <span className="text-foreground">{productName}</span> : "ثبت سفارش شارژ"}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-5">
          {/* Summary badges */}
          <div className="flex flex-wrap items-center gap-2">
            {operatorName && <Badge variant="secondary">{operatorName}</Badge>}
            {countryName && (
              <Badge variant="outline">
                <Globe className="w-3.5 h-3.5 ml-1" />
                {countryName}
                {callingCode ? ` (+${String(callingCode).replace(/^\+/, "")})` : ""}
              </Badge>
            )}
            {operatorIdUsed && (
              <Badge variant="outline" className="font-mono">OPID: {operatorIdUsed}</Badge>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="charge-phone">شماره تلفن (بدون کد کشور)</Label>
            <div className="flex items-stretch gap-2">
              <Input
                id="charge-phone"
                dir="ltr"
                inputMode="numeric"
                placeholder={isIranCountry(countryName, callingCode) ? "9100000000" : "912345678"}
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="flex-1"
              />
              <div className="px-3 min-w-20 grid place-items-center rounded-md border bg-[color:var(--muted)] text-sm">
                {/* Show calling code as +98 */}
                {callingCode ? `+${String(callingCode).replace(/^\+/, "")}` : "بدون کد"}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              شماره کامل: <span className="font-mono ltr">{phonePreview}</span>
            </div>
            {!phoneValid && (
              <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="w-3.5 h-3.5" />
                لطفاً حداقل ۵ رقم (بدون کد کشور) وارد کنید.
              </div>
            )}
          </div>

          {/* Amount */}
          {isShuttle ? (
            // ---------- SHUTTLE (fixed-only) ----------
            <div className="space-y-2">
              <Label>مبلغ شارژ (فقط از لیست)</Label>

              {/* Make the long list scrollable on small screens */}
              <div className="max-h-48 sm:max-h-none overflow-y-auto pr-1 rounded-md border border-[color:var(--border)]/60 p-2 sm:border-none sm:p-0">
                <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {SHUTTLE_AMOUNTS.map((v) => {
                    const active = amount === v;
                    return (
                      <Button
                        key={v}
                        type="button"
                        variant={active ? "default" : "secondary"}
                        size="sm"
                        className="justify-center h-9 px-2"
                        onClick={() => onPickSuggestion(v)}
                      >
                        {v.toLocaleString("fa-IR")} تومان
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Input
                dir="ltr"
                value={amount === "" ? "" : amount}
                disabled
                className="opacity-70"
                placeholder="یک مبلغ را از لیست انتخاب کنید"
              />

              {amount === "" && (
                <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5" />
                  لطفاً یکی از مبالغ لیست را انتخاب کنید.
                </div>
              )}
            </div>
          ) : (
            // ---------- DOMESTIC RTL/MCI/MTN (1000..20000) OR OTHERS (API-based) ----------
            <div className="space-y-2">
              <Label htmlFor="charge-amount">مبلغ شارژ</Label>
              <div className="relative">
                <Input
                  id="charge-amount"
                  dir="ltr"
                  inputMode="numeric"
                  placeholder={isDomesticRTL_MCI_MTN ? "بین 1000 تا 20000" : "مثلاً 50000"}
                  value={amount}
                  onChange={(e) => {
                    const digits = normalizeDigits(e.target.value);
                    setAmount(digits === "" ? "" : Number(digits));
                  }}
                  className="pr-4 pl-20"
                />
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md border bg-[color:var(--muted)]">
                  تومان
                </span>
              </div>

              {/* Range text */}
              {isDomesticRTL_MCI_MTN ? (
                <div className="text-xs text-muted-foreground">
                  بازه مجاز: <b>{DOMESTIC_MIN.toLocaleString("fa-IR")} تومان</b> تا{" "}
                  <b>{DOMESTIC_MAX.toLocaleString("fa-IR")} تومان</b>
                </div>
              ) : effectiveMin != null && effectiveMax != null ? (
                <div className="text-xs text-muted-foreground">
                  بازه مجاز: <b>{formatToman(effectiveMin)} تومان</b> تا{" "}
                  <b>{formatToman(effectiveMax)} تومان</b>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  بازه مبلغ برای این اپراتور مشخص نشده است.
                </div>
              )}

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 pt-1">
                {defaultSuggestions.map((s) => (
                  <Button
                    key={s}
                    variant="secondary"
                    size="sm"
                    className="h-9"
                    onClick={() => onPickSuggestion(s)}
                  >
                    {s.toLocaleString("fa-IR")} تومان
                  </Button>
                ))}
              </div>

              {amount !== "" && !amountValid && (
                <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {isDomesticRTL_MCI_MTN
                    ? `مبلغ باید بین ${DOMESTIC_MIN.toLocaleString("fa-IR")} تا ${DOMESTIC_MAX.toLocaleString("fa-IR")} تومان باشد.`
                    : "مبلغ نامعتبر است."}
                </div>
              )}
            </div>
          )}

          {/* Charge Type */}
          <div className="space-y-2">
            <Label>نوع شارژ</Label>
            <RadioGroup
              dir="rtl"
              value={String(chargeType)}
              onValueChange={(v) => setChargeType(Number(v) as ChargeType)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2 space-x-reverse rounded-md border p-3">
                <RadioGroupItem id="ch-normal" value={String(ChargeTypeValues.Normal)} />
                <Label htmlFor="ch-normal" className="cursor-pointer w-full">معمولی</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse rounded-md border p-3">
                <RadioGroupItem id="ch-amazing" value={String(ChargeTypeValues.Amazing)} />
                <Label htmlFor="ch-amazing" className="cursor-pointer w-full">شگفت‌انگیز</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse rounded-md border p-3">
                <RadioGroupItem id="ch-permanent" value={String(ChargeTypeValues.Permanent)} />
                <Label htmlFor="ch-permanent" className="cursor-pointer w-full">دائمی</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Technicals / read-only */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>شناسه اپراتور:</span>
              <span className="font-mono text-foreground">{operatorIdUsed ?? "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>پیش‌شماره:</span>
              <span className="font-mono text-foreground">
                {callingCode ? `+${String(callingCode).replace(/^\+/, "")}` : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <DialogFooter
          className={[
            "p-4",
            "sticky bottom-0 z-10",
            "bg-[color:var(--card)]/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur",
            "border-t border-[color:var(--border)]",
            "sm:justify-start",
          ].join(" ")}
        >
          <Button
            onClick={onSubmit}
            disabled={!ready || isPending}
            className="min-w-32"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                در حال ثبت…
              </>
            ) : (
              "ثبت سفارش شارژ"
            )}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
