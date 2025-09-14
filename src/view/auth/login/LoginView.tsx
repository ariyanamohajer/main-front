import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context";
import { useLogin, useVerifyCode } from "@/hooks/auth";
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
import type { LoginResult, LoginResponse, User } from "@/types";
import type { AxiosError } from "axios";

interface LoginState {
  step: "phone" | "verify";
  formData: LoginFormData;
  loginResult: LoginResult | null;
}

const STORAGE_KEY = "telecom_login_state";

function LoginView() {
  const navigate = useNavigate();
  // const location = useLocation();
  const { login } = useAuth();

  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [loginState, setLoginState] = useState<LoginState>(() => {
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
          loginResult: parsed.loginResult || null,
        };
      }
    } catch (error) {
      console.warn("Failed to restore login state", error);
      localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
    }

    return {
      step: "phone",
      formData: { phone: "" },
      loginResult: null,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loginState));
  }, [loginState]);

  // Phone form
  const phoneForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginState.formData,
  });

  // Login mutation (phone step)
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

  // Verify code mutation (OTP step)
  const verifyCodeMutation = useVerifyCode({
    onSuccess: (data) => {
      toast.success("ورود با موفقیت انجام شد", {
        description: "به صفحه اصلی منتقل می‌شوید",
      });

      // Create user object for AuthContext
      const userData: User = {
        phone: loginState.formData.phone,
        fName: undefined, // Login doesn't provide name info
        lName: undefined,
        token: data.result.token,
        refreshToken: data.result.refreshToken,
        expiration: data.result.expiration,
        refreshTokenExpiration: data.result.refreshTokenExpiration,
      };

      // Login user through AuthContext
      login(userData);

      // Clear login state
      localStorage.removeItem(STORAGE_KEY);

      // Get the original destination from state, or default to home
      // const from =
      //   (location.state as { from?: { pathname: string } })?.from?.pathname ||
      //   "/products";
      // navigate(from, { replace: true });
      navigate("/products", { replace: true });
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
    setLoginState((prev) => ({ ...prev, formData: data }));
    loginMutation.mutate(data);
  };

  // Handle OTP completion
  const onOTPComplete = (code: string, passwordValue?: string) => {
    if (code.length === 5 && passwordValue && passwordValue.trim()) {
      verifyCodeMutation.mutate({
        phone: loginState.formData.phone,
        code,
        password: passwordValue, // Use password from OTP input
      });
    }
  };

  // Handle back to phone step
  const handleBackToPhone = () => {
    setLoginState((prev) => ({ ...prev, step: "phone" }));
    setOtpCode("");
    setPassword("");
  };

  // Handle resend OTP
  const handleResendOTP = () => {
    loginMutation.mutate(loginState.formData);
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

  // Render phone input step
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">ورود</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          برای ورود به حساب کاربری، شماره تلفن همراه خود را وارد کنید
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

          {/* Register Link */}
          <div className="flex flex-col gap-2 items-center pt-4 border-t border-border">
            <p className="text-muted-foreground text-sm">
              حساب کاربری ندارید؟{" "}
              <Link
                to="/auth/register"
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
              >
                ثبت نام
              </Link>
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
    </div>
  );
}

export default LoginView;
