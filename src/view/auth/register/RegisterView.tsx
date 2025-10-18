// src/pages/auth/RegisterView.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, User, Phone, Lock } from "lucide-react";
import { toast } from "sonner";

import { useRegister, useVerifyCode } from "@/hooks/auth";
import { useAuth } from "@/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OTPInput } from "@/components/ui/otp-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema, type RegisterFormData } from "@/validation";
import type { RegisterResult, VerifyCodeResponse } from "@/types";

interface RegistrationState {
  step: "register" | "verify";
  formData: RegisterFormData;
  registerResult: RegisterResult | null;
}

const STORAGE_KEY = "telecom_registration_state";
// const PANEL_BASE_URL = (
//   import.meta.env.VITE_PANEL_URL ?? "https://panel.arianamohajer.ir"
// ).replace(/\/+$/, "");

// // Always go to panel root (no query/path)
// const toPanelRoot = () => {
//   window.location.assign(PANEL_BASE_URL);
// };

function RegisterView() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [registrationState, setRegistrationState] = useState<RegistrationState>(
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            step: parsed.step || "register",
            formData: {
              phone: parsed.formData?.phone || "",
              fName: parsed.formData?.fName || "",
              lName: parsed.formData?.lName || "",
              password: parsed.formData?.password || "",
            },
            registerResult: parsed.registerResult || null,
          };
        }
      } catch (error) {
        console.warn("Failed to restore registration state", error);
        localStorage.removeItem(STORAGE_KEY);
      }
      return {
        step: "register",
        formData: { phone: "", fName: "", lName: "", password: "" },
        registerResult: null,
      };
    }
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrationState));
  }, [registrationState]);

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: registrationState.formData,
  });

  const registerMutation = useRegister({
    onSuccess: (data) => {
      toast.success("کد تایید با موفقیت ارسال شد", {
        description: `کد تایید به شماره ${data.result.phone} ارسال شد`,
      });
      setRegistrationState((prev) => ({
        ...prev,
        step: "verify",
        registerResult: data.result,
      }));
    },
    onError: (error) => {
      toast.error("خطا در ثبت نام", {
        description: (error as Error)?.message || "لطفاً دوباره تلاش کنید",
      });
    },
  });

  const verifyCodeMutation = useVerifyCode({
    onSuccess: (data: VerifyCodeResponse) => {
      toast.success("تایید با موفقیت انجام شد", {
        description: "در حال انتقال...",
      });

      // auto-login after register verification
      login({
        phone: registrationState.formData.phone,
        fName: registrationState.formData.fName,
        lName: registrationState.formData.lName,
        token: data.result.token,
        refreshToken: data.result.refreshToken,
        expiration: data.result.expiration,
        refreshTokenExpiration: data.result.refreshTokenExpiration,
      });

      localStorage.removeItem(STORAGE_KEY);

      // ✅ Always go to panel root
      window.location.assign("https://panel.arianamohajer.ir");
    },
    onError: (error: Error) => {
      toast.error("کد تایید نادرست است", {
        description: error?.message || "لطفاً کد صحیح را وارد کنید",
      });
      setOtpCode("");
    },
  });

  const onRegisterSubmit = (data: RegisterFormData) => {
    setRegistrationState((prev) => ({ ...prev, formData: data }));
    registerMutation.mutate(data);
  };

  const onOTPComplete = (code: string) => {
    if (code.length === 5 && registrationState.registerResult) {
      verifyCodeMutation.mutate({
        phone: registrationState.formData.phone,
        code,
        password: registrationState.formData.password,
      });
    }
  };

  const handleBackToRegister = () => {
    setRegistrationState((prev) => ({ ...prev, step: "register" }));
    setOtpCode("");
  };

  const handleResendOTP = () => {
    registerMutation.mutate(registrationState.formData);
  };

  useEffect(() => {
    return () => {
      try {
        const currentState = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || '{"step":"register"}'
        );
        if (currentState.step === "register") {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.warn("Error parsing registration state on unmount:", error);
      }
    };
  }, []);

  if (registrationState.step === "verify") {
    return (
      <div className="space-y-6">
        <OTPInput
          value={otpCode}
          onChange={setOtpCode}
          onComplete={onOTPComplete}
          onBack={handleBackToRegister}
          onResend={handleResendOTP}
          phone={registrationState.formData.phone}
          expirationTime={registrationState.registerResult?.codeExpiration}
          isLoading={verifyCodeMutation.isPending || registerMutation.isPending}
          error={
            verifyCodeMutation.isError
              ? verifyCodeMutation.error?.message || "کد تایید نادرست است"
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">ثبت نام</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          برای ایجاد حساب کاربری جدید، اطلاعات زیر را وارد کنید
        </p>
      </div>

      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={registerForm.control}
              name="fName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    نام
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="نام خود را وارد کنید"
                      {...field}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="lName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    نام خانوادگی
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="نام خانوادگی خود را وارد کنید"
                      {...field}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={registerForm.control}
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

          <FormField
            control={registerForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  رمز عبور
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="رمز عبور قوی انتخاب کنید"
                      {...field}
                      className="text-right pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                در حال ثبت نام...
              </div>
            ) : (
              "ثبت نام"
            )}
          </Button>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-muted-foreground text-sm">
              قبلاً حساب کاربری دارید؟{" "}
              <Link
                to="/auth/login"
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
              >
                ورود
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default RegisterView;
