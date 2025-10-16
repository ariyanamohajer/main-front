// 

// src/pages/auth/LoginView.tsx
// src/pages/auth/LoginView.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Headset, KeyRound, Phone, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context";
import { useLogin, useVerifyCode } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OTPInput } from "@/components/ui/otp-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginFormData } from "@/validation";
import type { LoginResult, LoginResponse, User } from "@/types";
import type { AxiosError } from "axios";

interface LoginState {
  step: "phone" | "verify";
  formData: LoginFormData;
  loginResult: LoginResult | null;
}

const STORAGE_KEY = "telecom_login_state";
// const PANEL_BASE_URL = (import.meta.env.VITE_PANEL_URL ?? "https://panel.arianamohajer.ir").replace(/\/+$/, "");

// // Always go to panel root (no trailing slash issues)
// const toPanelRoot = () => {
//   window.location.assign(PANEL_BASE_URL);
// };

function LoginView() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          step: parsed.step || "phone",
          formData: { phone: parsed.formData?.phone || "" },
          loginResult: parsed.loginResult || null,
        };
      }
    } catch (error) {
      console.warn("Failed to restore login state", error);
      localStorage.removeItem(STORAGE_KEY);
    }
    return { step: "phone", formData: { phone: "" }, loginResult: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loginState));
  }, [loginState]);

  const phoneForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginState.formData,
  });

  const loginMutation = useLogin({
    onSuccess: (data: LoginResponse) => {
      toast.success("کد تایید با موفقیت ارسال شد", {
        description: `کد تایید به شماره ${data.result.phone} ارسال شد`,
      });
      setLoginState((prev) => ({
        ...prev,
        step: "verify",
        loginResult: data.result,
      }));
    },
    onError: (error: AxiosError) => {
      toast.error("خطا در ورود", {
        description: error?.message || "لطفاً دوباره تلاش کنید",
      });
    },
  });

  const verifyCodeMutation = useVerifyCode({
    onSuccess: (data) => {
      toast.success("ورود با موفقیت انجام شد", {
        description: "به پنل منتقل می‌شوید",
      });

      const userData: User = {
        phone: loginState.formData.phone,
        fName: undefined,
        lName: undefined,
        token: data.result.token,
        refreshToken: data.result.refreshToken,
        expiration: data.result.expiration,
        refreshTokenExpiration: data.result.refreshTokenExpiration,
      };

      login(userData);
      localStorage.removeItem(STORAGE_KEY);

      // ✅ Always go to panel root
      // window.location.assign(
      //   redirect && isSafeSameSite(redirect)
      //     ? redirect
      //     : "https://panel.arianamohajer.ir"
      // );

      window.location.assign("http://localhost:4001")
    },
    onError: (error: Error) => {
      toast.error("کد تایید نادرست است", {
        description: error?.message || "لطفاً کد صحیح را وارد کنید",
      });
      setOtpCode("");
    },
  });

  const onPhoneSubmit = (data: LoginFormData) => {
    setLoginState((prev) => ({ ...prev, formData: data }));
    loginMutation.mutate(data);
  };

  const onOTPComplete = (code: string, passwordValue?: string) => {
    if (code.length === 5 && passwordValue && passwordValue.trim()) {
      verifyCodeMutation.mutate({
        phone: loginState.formData.phone,
        code,
        password: passwordValue,
      });
    }
  };

  const handleBackToPhone = () => {
    setLoginState((prev) => ({ ...prev, step: "phone" }));
    setOtpCode("");
    setPassword("");
  };

  const handleResendOTP = () => {
    loginMutation.mutate(loginState.formData);
  };

  const whatsappNumber = "+989910395938";

  const openWhatsAppInNewTab = () => {
    const url = `https://web.whatsapp.com/send?phone=${whatsappNumber}`;
    window.open(url, "_blank", "noopener,noreferrer");
    // if (!newWindow) {
    //   window.location.href = url;
    // }
    setIsRegisterDialogOpen(false);
  };

  const handleDirectRegister = () => {
    setIsRegisterDialogOpen(false);
    navigate("/auth/register");
  };

  useEffect(() => {
    return () => {
      try {
        const currentState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"step":"phone"}');
        if (currentState.step === "phone") {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.warn("Error parsing login state on unmount:", error);
      }
    };
  }, []);

  if (loginState.step === "verify") {
    return (
      <div className="space-y-6">
        <OTPInput
          value={otpCode}
          onChange={setOtpCode}
          onComplete={onOTPComplete}
          onBack={handleBackToPhone}
          onResend={handleResendOTP}
          phone={loginState.formData.phone}
          expirationTime={loginState.loginResult?.codeExpiration}
          isLoading={verifyCodeMutation.isPending || loginMutation.isPending}
          error={
            verifyCodeMutation.isError
              ? verifyCodeMutation.error?.message || "کد تایید نادرست است"
              : undefined
          }
          showPasswordField={true}
          passwordValue={password}
          onPasswordChange={setPassword}
          passwordPlaceholder="رمز عبور خود را وارد کنید"
          passwordLabel="رمز عبور"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">ورود</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          برای ورود به حساب کاربری، شماره تلفن همراه خود را وارد کنید
        </p>
      </div>

      <Form {...phoneForm}>
        <form
          onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
          className="space-y-6"
        >
          <FormField
            control={phoneForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  شماره تلفن همراه
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                    {...field}
                    className="text-right"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ارسال کد تایید...
              </div>
            ) : (
              "ارسال کد تایید"
            )}
          </Button>

          <div className="flex flex-col gap-2 items-center pt-4 border-t border-border">
            <p className="text-muted-foreground text-sm">
              حساب کاربری ندارید؟{" "}
              <button
                type="button"
                onClick={() => setIsRegisterDialogOpen(true)}
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
              >
                ثبت نام
              </button>
            </p>
            <p className="text-muted-foreground text-sm">
              رمز عبور خود را فراموش کردید؟{" "}
              <Link
                to="/auth/forget-pass"
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
              >
                فراموشی رمز عبور
              </Link>
            </p>
          </div>
        </form>
      </Form>

      <Dialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-right">
              روش ثبت‌نام خود را انتخاب کنید
            </DialogTitle>
            <DialogDescription className="text-md font-semibold text-right">
              برای ایجاد حساب کاربری یکی از گزینه‌های زیر را انتخاب کنید.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 pt-2">
            <Button
              size="lg"
              className="justify-between"
              onClick={handleDirectRegister}
            >
              <span className="flex items-center gap-3">
                <UserPlus className="size-5" />
                ثبت نام آنلاین
              </span>
              <span className="text-xs text-primary-foreground/80">
                تکمیل فرم در کمتر از یک دقیقه
              </span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="justify-between"
              onClick={openWhatsAppInNewTab}
            >
              <span className="flex items-center gap-3">
                <Headset className="size-5" />
                درخواست عضویت از طریق پشتیبانی
              </span>
              <span className="text-xs text-muted-foreground">
                تماس سریع در واتس‌اپ
              </span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="justify-between"
              onClick={openWhatsAppInNewTab}
            >
              <span className="flex items-center gap-3">
                <KeyRound className="size-5" />
                درخواست نام کاربری و رمز عبور
              </span>
              <span className="text-xs text-muted-foreground">
                دریافت اطلاعات ورود از پشتیبانی
              </span>
            </Button>
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              variant="ghost"
              onClick={() => setIsRegisterDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              بازگشت
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LoginView;
