import { useState, useEffect } from "react";
import { ArrowRight, RefreshCw, Eye, EyeOff, Lock } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string, password?: string) => void;
  onResend?: () => void;
  onBack?: () => void;
  phone: string;
  expirationTime?: string;
  isLoading?: boolean;
  error?: string;
  className?: string;
  // Password field props
  showPasswordField?: boolean;
  passwordValue?: string;
  onPasswordChange?: (password: string) => void;
  passwordPlaceholder?: string;
  passwordLabel?: string;
}

export function OTPInput({
  value,
  onChange,
  onComplete,
  onResend,
  onBack,
  phone,
  expirationTime,
  isLoading = false,
  error,
  className,
  showPasswordField = false,
  passwordValue = "",
  onPasswordChange,
  passwordPlaceholder = "رمز عبور خود را وارد کنید",
  passwordLabel = "رمز عبور",
}: OTPInputProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Calculate initial time left from expiration time
  useEffect(() => {
    if (expirationTime) {
      const expTime = new Date(expirationTime).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = Math.max(0, Math.floor((expTime - currentTime) / 1000));
      setTimeLeft(timeDiff);
      setCanResend(timeDiff === 0);
    }
  }, [expirationTime]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle OTP completion
  const handleComplete = (otpValue: string) => {
    if (otpValue.length === 5) {
      onComplete?.(otpValue, showPasswordField ? passwordValue : undefined);
    }
  };

  // Handle manual verification (when user fills both OTP and password if required)
  const handleVerify = () => {
    if (value.length === 5 && (!showPasswordField || passwordValue.trim())) {
      onComplete?.(value, showPasswordField ? passwordValue : undefined);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">تایید شماره تلفن</h2>
        <p className="text-muted-foreground text-sm">
          کد تایید ۵ رقمی به شماره{" "}
          <span className="font-medium text-foreground">{phone}</span> ارسال شد
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex flex-col items-center space-y-4">
        {/* Force LTR direction for OTP input */}
        <div dir="ltr" className="flex justify-center">
          <InputOTP
            maxLength={5}
            value={value}
            onChange={(value) => {
              onChange(value);
              handleComplete(value);
            }}
            disabled={isLoading}
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot
                index={0}
                className="w-12 h-12 text-lg font-semibold border-2 border-input focus:border-primary transition-colors rounded-lg"
              />
              <InputOTPSlot
                index={1}
                className="w-12 h-12 text-lg font-semibold border-2 border-input focus:border-primary transition-colors rounded-lg"
              />
              <InputOTPSlot
                index={2}
                className="w-12 h-12 text-lg font-semibold border-2 border-input focus:border-primary transition-colors rounded-lg"
              />
              <InputOTPSlot
                index={3}
                className="w-12 h-12 text-lg font-semibold border-2 border-input focus:border-primary transition-colors rounded-lg"
              />
              <InputOTPSlot
                index={4}
                className="w-12 h-12 text-lg font-semibold border-2 border-input focus:border-primary transition-colors rounded-lg"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Password Field */}
        {showPasswordField && (
          <div className="w-full max-w-xs space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Lock className="w-4 h-4" />
              {passwordLabel}
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={passwordPlaceholder}
                value={passwordValue}
                onChange={(e) => onPasswordChange?.(e.target.value)}
                className="text-right pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Manual Verify Button (when password field is shown) */}
        {showPasswordField && (
          <Button
            onClick={handleVerify}
            disabled={isLoading || value.length !== 5 || !passwordValue.trim()}
            className="w-full max-w-xs h-11 text-base font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                در حال تایید...
              </div>
            ) : (
              "تایید"
            )}
          </Button>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Timer and Resend */}
      <div className="text-center space-y-4">
        {timeLeft > 0 ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">
              ارسال مجدد کد تا {formatTime(timeLeft)} دیگر
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              کد را دریافت نکردید؟
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onResend}
              disabled={isLoading || !canResend}
              className="h-9 px-4 font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
                  در حال ارسال...
                </div>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 ml-2" />
                  ارسال مجدد کد
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full h-11 text-base font-medium hover:bg-muted/50 transition-colors"
          disabled={isLoading}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          بازگشت به مرحله قبل
        </Button>
      </div>
    </div>
  );
}
