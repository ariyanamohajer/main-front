import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Upload,
  AlertCircle,
  CheckCircle2,
  Banknote,
  Building,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useIncreaseCredit, useBankAccounts } from "@/hooks/wallet";
import { PaymentMethod, type BankAccount } from "@/types";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { formatPrice } from "@/lib/utils";

/** Zod helper for File validation in the browser. */
const zFile = z.custom<File>(
  (v) => typeof File !== "undefined" && v instanceof File,
  { message: "لطفاً یک تصویر معتبر انتخاب کنید" }
);

/** Validation schema based on API requirements:
 * - File is required only when PaymentMethod is Manual.
 * - Query params remain numeric/string as usual.
 */
const increaseCreditSchema = z
  .object({
    Amount: z
      .number({ message: "مبلغ الزامی است" })
      .min(10000, "مبلغ باید حداقل ۱۰,۰۰۰ تومان باشد")
      .max(50_000_000, "مبلغ نمی‌تواند بیش از ۵۰,۰۰۰,۰۰۰ تومان باشد"),
    Description: z
      .string()
      .min(1, "توضیحات الزامی است")
      .max(200, "توضیحات نمی‌تواند بیش از ۲۰۰ کاراکتر باشد"),
    PaymentMethod: z.nativeEnum(PaymentMethod),
    DepositSlipImage: zFile.optional(),
  })
  .superRefine((val, ctx) => {
    // Require image only for manual payments.
    if (val.PaymentMethod === PaymentMethod.Manual && !val.DepositSlipImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DepositSlipImage"],
        message: "در روش دستی، آپلود فیش واریزی الزامی است",
      });
    }
  });

type IncreaseCreditForm = z.infer<typeof increaseCreditSchema>;

function IncreaseCreditView() {
  const navigate = useNavigate();
  const { data: bankAccountsData } = useBankAccounts();

  // Mutation to call the API (service sends FormData with DepositSlipImage + query params)
  const { mutate: increaseCredit, isPending } = useIncreaseCredit({
    onSuccess: (data) => {
      toast.success("درخواست شما با موفقیت ثبت شد", {
        description: data.message,
      });
      navigate("/wallet");
    },
    onError: (error: AxiosError) => {
      toast.error("خطا در ثبت درخواست", {
        description: error?.message || "لطفاً دوباره تلاش کنید",
      });
    },
  });

  // Local preview URL for the uploaded image
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<IncreaseCreditForm>({
    resolver: zodResolver(increaseCreditSchema),
    defaultValues: {
      PaymentMethod: PaymentMethod.Manual,
    },
  });

  const paymentMethod = watch("PaymentMethod");
  const amount = watch("Amount");

  /** Format IRR currency for helper text. */
  // const formatCurrency = (value: number) =>
  //   new Intl.NumberFormat("fa-IR", {
  //     style: "currency",
  //     currency: "IRR",
  //     minimumFractionDigits: 0,
  //   }).format(value || 0);

  /** Handle file input: keep File object in RHF, and create a preview URL. */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setValue("DepositSlipImage", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setUploadedPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } else {
      // Clear if no file selected
      resetField("DepositSlipImage");
      setUploadedPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  };

  /** If user switches to portal, clear any selected deposit slip. */
  useEffect(() => {
    if (paymentMethod === PaymentMethod.BankingPortal) {
      resetField("DepositSlipImage");
      setUploadedPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  }, [paymentMethod, resetField]);

  /** Cleanup preview URL on unmount. */
  useEffect(() => {
    return () => {
      if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl);
    };
  }, [uploadedPreviewUrl]);

  /** Submit handler: pass values directly to mutation; the service builds FormData. */
  const onSubmit = (data: IncreaseCreditForm) => {
    increaseCredit(data);
  };

  const suggestedAmounts = useMemo(
    () => [50_000, 100_000, 200_000, 500_000, 1_000_000],
    []
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 w-full justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-md font-bold md:text-lg">
              افزایش اعتبار کیف پول
            </h1>
            <p className="text-xs text-muted-foreground md:text-sm">
              شارژ کیف پول خود را انجام دهید
            </p>
          </div>
        </div>

        <Button asChild variant="ghost" size="sm">
          <Link to="/wallet">
            <ArrowLeft className="w-4 h-4 mr-2" />
            بازگشت
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="w-5 h-5" />
                  انتخاب مبلغ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">مبلغ (تومان)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="مبلغ مورد نظر را وارد کنید"
                    // Use valueAsNumber to keep it numeric for zod.number()
                    {...register("Amount", { valueAsNumber: true })}
                    dir="rtl"
                  />
                  {errors.Amount && (
                    <p className="text-sm text-destructive">
                      {errors.Amount.message}
                    </p>
                  )}
                  {!!amount && (
                    <p className="text-sm text-muted-foreground">
                      معادل: {formatPrice(amount)} تومان
                    </p>
                  )}
                </div>

                {/* Suggested Amounts */}
                <div className="space-y-2">
                  <Label>مبالغ پیشنهادی</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {suggestedAmounts.map((suggestedAmount) => (
                      <Button
                        key={suggestedAmount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setValue("Amount", suggestedAmount, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className="justify-start"
                      >
                        {formatPrice(suggestedAmount)} تومان
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  روش پرداخت
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={watch("PaymentMethod")?.toString()}
                  onValueChange={(value) =>
                    setValue(
                      "PaymentMethod",
                      parseInt(value) as PaymentMethod,
                      {
                        shouldValidate: true,
                      }
                    )
                  }
                  className="space-y-4"
                  dir="rtl"
                >
                  <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem
                      value={PaymentMethod.Manual.toString()}
                      id="manual"
                    />
                    <Label htmlFor="manual" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="font-medium">واریز دستی</p>
                          <p className="text-sm text-muted-foreground">
                            آپلود فیش واریزی
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem
                      value={PaymentMethod.BankingPortal.toString()}
                      id="portal"
                    />
                    <Label htmlFor="portal" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">درگاه بانکی</p>
                          <p className="text-sm text-muted-foreground">
                            پرداخت آنلاین
                          </p>
                        </div>
                      </div>
                    </Label>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    >
                      توصیه شده
                    </Badge>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Manual Payment Details */}
            {paymentMethod === PaymentMethod.Manual && (
              <Card>
                <CardHeader>
                  <CardTitle>جزئیات واریز دستی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">توضیحات</Label>
                    <Textarea
                      id="description"
                      placeholder="توضیحات مربوط به واریز را وارد کنید"
                      {...register("Description")}
                    />
                    {errors.Description && (
                      <p className="text-sm text-destructive">
                        {errors.Description.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="depositSlip">فیش واریزی</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="depositSlip"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="flex-1"
                      />
                    </div>
                    {errors.DepositSlipImage && (
                      <p className="text-sm text-destructive">
                        {errors.DepositSlipImage.message as string}
                      </p>
                    )}
                    {uploadedPreviewUrl && (
                      <div className="mt-2">
                        <img
                          src={uploadedPreviewUrl}
                          alt="فیش واریزی"
                          className="max-w-xs max-h-48 object-contain border rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description for Banking Portal */}
            {paymentMethod === PaymentMethod.BankingPortal && (
              <Card>
                <CardHeader>
                  <CardTitle>توضیحات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="description">توضیحات (اختیاری)</Label>
                    <Textarea
                      id="description"
                      placeholder="توضیحات مربوط به تراکنش را وارد کنید"
                      {...register("Description")}
                    />
                    {errors.Description && (
                      <p className="text-sm text-destructive">
                        {errors.Description.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending ? "در حال ثبت..." : "ثبت درخواست"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Sidebar - Info and Bank Accounts */}
        <div className="space-y-6">
          {/* Bank Accounts */}
          {bankAccountsData?.result && bankAccountsData.result.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">حساب‌های بانکی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bankAccountsData.result.map((account: BankAccount) => (
                  <div
                    key={account.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{account.bankName}</Badge>
                    </div>
                    <p className="font-mono text-sm">{account.cardNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.ownerName}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                نکات مهم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  حداقل مبلغ شارژ ۱۰,۰۰۰ تومان می‌باشد
                </AlertDescription>
              </Alert>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  پس از تایید، موجودی به کیف پول شما اضافه می‌شود
                </AlertDescription>
              </Alert>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  در روش دستی، حتماً فیش واریزی را آپلود کنید
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  زمان تایید درخواست‌های دستی تا ۲۴ ساعت می‌باشد
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default IncreaseCreditView;
