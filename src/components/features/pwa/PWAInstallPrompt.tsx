// src/components/features/pwa/PWAInstallPrompt.tsx
import { Button } from "@/components/ui/button";
import {
  triggerPWAInstall,
  getInstallInstructions,
  getBrowserInfo,
  checkPWAInstallability,
  isPWAInstallAvailable,
} from "./install";
import { useState, useEffect } from "react";

type Props = { open: boolean; onClose: () => void };

export function PWAInstallPrompt({ open, onClose }: Props) {
  const [installInstructions, setInstallInstructions] = useState(getInstallInstructions());
  const [browserInfo, setBrowserInfo] = useState(getBrowserInfo());
  const [installability, setInstallability] = useState(checkPWAInstallability());
  const [isInstalling, setIsInstalling] = useState(false);
  const [canUseNativeInstall, setCanUseNativeInstall] = useState(isPWAInstallAvailable());

  useEffect(() => {
    if (open) {
      setInstallInstructions(getInstallInstructions());
      setBrowserInfo(getBrowserInfo());
      setInstallability(checkPWAInstallability());
      setCanUseNativeInstall(isPWAInstallAvailable());
    }
  }, [open]);

  if (!open) return null;

  const onInstallNow = async () => {
    setIsInstalling(true);
    try {
      const result = await triggerPWAInstall();
      // If the browser showed the prompt, it will be accepted/dismissed; close in both cases
      if (result === "accepted" || result === "dismissed" || result === "unavailable") {
        onClose();
      }
      // If result === "manual", we keep the sheet open to show instructions
    } catch (error) {
      console.error("Installation failed:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  const isManualOnly = !canUseNativeInstall;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg border border-border bg-card p-4 shadow-lg">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-card-foreground">نصب اپلیکیشن آریانا مهاجر</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            برای دسترسی سریع‌تر و استفاده بهتر، اپلیکیشن را روی دستگاه خود نصب کنید
          </p>
        </div>

        {!installability.isInstallable && (
          <div className="rounded-lg bg-destructive/10 p-3">
            <p className="text-sm text-destructive font-medium mb-2">⚠️ مشکلات نصب:</p>
            <ul className="text-xs text-destructive space-y-1">
              {installability.issues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-lg bg-accent/50 p-3 text-center">
          <p className="text-sm text-accent-foreground">
            💡 پس از نصب می‌توانید بدون اتصال به اینترنت از اپلیکیشن استفاده کنید
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 p-3">
          <h4 className="text-sm font-medium text-foreground mb-2">{installInstructions.title}</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {installInstructions.steps.map((step, index) => (
              <li key={index}>
                <span className="inline-block w-4 text-center font-medium">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-border text-muted-foreground hover:bg-accent"
            disabled={isInstalling}
          >
            بعداً
          </Button>

          {!isManualOnly ? (
            <Button
              onClick={onInstallNow}
              disabled={isInstalling || !installability.isInstallable}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isInstalling ? "در حال نصب..." : "نصب اکنون"}
            </Button>
          ) : (
            <Button onClick={onClose} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              متوجه شدم
            </Button>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>
            مرورگر شما: {browserInfo.isChrome && "Chrome"}
            {browserInfo.isFirefox && "Firefox"}
            {browserInfo.isSafari && "Safari"}
            {browserInfo.isEdge && "Edge"}
            {browserInfo.isAndroid && " (Android)"}
            {browserInfo.isIOS && " (iOS)"}
          </p>
          {!canUseNativeInstall && (
            <p className="mt-1 text-orange-600">
              این مرورگر/شرایط از نصب خودکار پشتیبانی نمی‌کند — لطفاً دستورالعمل بالا را دنبال کنید
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
