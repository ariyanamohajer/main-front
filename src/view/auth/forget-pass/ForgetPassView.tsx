import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { toast } from "sonner";

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
import { loginSchema, type LoginFormData } from "@/validation";
import type { ForgetPasswordResponse, ForgetResult } from "@/types";
import type { AxiosError } from "axios";
import { useVerifyForgetPass } from "@/hooks/auth/useVerifyForgetPass";
import { useForgetPass } from "@/hooks/auth/useForgetPass";

interface ForgetPassState {
  step: "phone" | "verify";
  formData: LoginFormData;
  ForgetResult: ForgetResult | null;
}

const STORAGE_KEY = "telecom_login_state";

function ForgetPassView() {
  const navigate = useNavigate();

  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [forgetState, setForgetState] = useState<ForgetPassState>(() => {
    // Try to restore state from localStorage on refresh
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure we have all required properties
        return {
          step: parsed.step || "phone",
          formData: {
            phone: parsed.formData?.phone || "",
          },
          ForgetResult: parsed.ForgetResult || null,
        };
      }
    } catch (error) {
      console.warn("Failed to restore login state", error);
      localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
    }

    return {
      step: "phone",
      formData: { phone: "" },
      ForgetResult: null,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forgetState));
  }, [forgetState]);

  // Phone form
  const phoneForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: forgetState.formData,
  });

  // Login mutation (phone step)
  const loginMutation = useForgetPass({
    onSuccess: (data: ForgetPasswordResponse) => {
      toast.success("کد تایید با موفقیت ارسال شد", {
        description: `کد تایید به شماره ${data.result.phone} ارسال شد`,
      });

      setForgetState((prev) => ({
        ...prev,
        step: "verify",
        ForgetState: data.result,
      }));
    },
    onError: (error: AxiosError) => {
      toast.error("خطا در فراموشی رمز عبور", {
        description: error?.message || "لطفاً دوباره تلاش کنید",
      });
    },
  });

  // Verify code mutation (OTP step)
  const verifyCodeMutation = useVerifyForgetPass({
    onSuccess: () => {
      toast.success("فراموشی رمز عبور با موفقیت انجام شد", {
        description: "به صفحه ورود منتقل می‌شوید",
      });

      // Create user object for AuthContext
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      // Login user through AuthContext

      // Clear login state
      localStorage.removeItem(STORAGE_KEY);

      // Get the original destination from state, or default to home
      // const from =
      //   (location.state as { from?: { pathname: string } })?.from?.pathname ||
      //   "/products";
      // navigate(from, { replace: true });
      navigate("/auth/login", { replace: true });
    },
    onError: (error: Error) => {
      toast.error("کد تایید نادرست است", {
        description: error?.message || "لطفاً کد صحیح را وارد کنید",
      });
      setOtpCode("");
    },
  });

  // Handle phone form submission
  const onPhoneSubmit = (data: LoginFormData) => {
    setForgetState((prev) => ({ ...prev, formData: data }));
    loginMutation.mutate(data);
  };

  // Handle OTP completion
  const onOTPComplete = (code: string, passwordValue?: string) => {
    if (code.length === 5 && passwordValue && passwordValue.trim()) {
      verifyCodeMutation.mutate({
        phone: forgetState.formData.phone,
        code,
        newPassword: passwordValue, // Use password from OTP input
      });
    }
  };

  // Handle back to phone step
  const handleBackToPhone = () => {
    setForgetState((prev) => ({ ...prev, step: "phone" }));
    setOtpCode("");
    setPassword("");
  };

  // Handle resend OTP
  const handleResendOTP = () => {
    loginMutation.mutate(forgetState.formData);
  };

  // Clear login state on unmount only if on phone step
  useEffect(() => {
    return () => {
      // Only clear if user is still on phone step (not in OTP step)
      try {
        const currentState = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || '{"step":"phone"}'
        );
        if (currentState.step === "phone") {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        // If there's an error parsing, don't clear
        console.warn("Error parsing login state on unmount:", error);
      }
    };
  }, []);

  // Render OTP verification step
  if (forgetState.step === "verify") {
    return (
      <div className="space-y-6">
        <OTPInput
          value={otpCode}
          onChange={setOtpCode}
          onComplete={onOTPComplete}
          onBack={handleBackToPhone}
          onResend={handleResendOTP}
          phone={forgetState.formData.phone}
          expirationTime={forgetState.ForgetResult?.codeExpiration}
          isLoading={verifyCodeMutation.isPending || loginMutation.isPending}
          error={
            verifyCodeMutation.isError
              ? verifyCodeMutation.error?.message || "کد تایید نادرست است"
              : undefined
          }
          showPasswordField={true}
          passwordValue={password}
          onPasswordChange={setPassword}
          passwordPlaceholder="رمز عبور جدید خود را وارد کنید"
          passwordLabel="رمز عبور جدید"
        />
      </div>
    );
  }

  // Render phone input step
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          فراموشی رمز عبور
        </h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          برای تغییر رمز عبور شماره تلفن همراه خود را وارد کنید
        </p>
      </div>

      {/* Form */}
      <Form {...phoneForm}>
        <form
          onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
          className="space-y-6"
        >
          {/* Phone Field */}
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

          {/* Submit Button */}
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
          <div className="text-center pt-4 border-t border-border">
            <p className="text-muted-foreground text-sm">
              <Link
                to="/auth/login"
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
              >
                ورود
              </Link>
            </p>
            <p className="text-muted-foreground text-sm">
              <Link
                to="/auth/register"
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
              >
                ثبت نام
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ForgetPassView;
