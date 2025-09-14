// src/components/features/pwa/install.ts
// Enhanced PWA install handling with cross-browser support

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
  interface Navigator {
    standalone?: boolean; // iOS Safari
  }
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const PWA_INSTALLED_KEY = "pwa-installed";

/** Call once as early as possible (e.g., app bootstrap) */
export function initPWAInstallListeners() {
  window.addEventListener(
    "beforeinstallprompt",
    (e: BeforeInstallPromptEvent) => {
      // prevent mini-infobar and cache event for manual trigger
      e.preventDefault();
      deferredPrompt = e;
    }
  );

  window.addEventListener("appinstalled", () => {
    try {
      localStorage.setItem(PWA_INSTALLED_KEY, "1");
    } catch { /* empty */ }
    // Event is single-use; clear it so we don't try prompting again
    deferredPrompt = null;
  });
}

/** Browser detection for PWA installation support */
export function getBrowserInfo() {
  const ua = navigator.userAgent.toLowerCase();
  const isEdge = /\bedg(e|a|ios)?\b/.test(ua);
  const isChrome = /(chrome|crios|chromium)/.test(ua) && !isEdge;
  const isFirefox = /(firefox|fxios)/.test(ua);
  const isSafari = /safari/.test(ua) && !isChrome && !isEdge;
  const isIOS = /(iphone|ipad|ipod)/.test(ua);
  const isAndroid = /android/.test(ua);

  return {
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    isIOS,
    isAndroid,
    // Chromium-based browsers expose beforeinstallprompt when criteria are met
    supportsBeforeInstallPrompt: isChrome || isEdge,
    canInstallPWA: true,
  };
}

/** Is the app currently running as an installed PWA window? */
export function isRunningInPWA(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    (navigator as Navigator).standalone === true || // iOS Safari
    document.referrer.startsWith("android-app://")
  );
}

/** Was the app installed on this device previously? (best-effort) */
export function isPWAAlreadyInstalledFlag(): boolean {
  try {
    return localStorage.getItem(PWA_INSTALLED_KEY) === "1";
  } catch {
    return false;
  }
}

/** Is the native install prompt available right now? */
export function isPWAInstallAvailable(): boolean {
  if (isRunningInPWA()) return false;
  if (isPWAAlreadyInstalledFlag()) return false;
  return !!deferredPrompt;
}

/**
 * Try to trigger the native PWA install prompt.
 * Returns: "accepted" | "dismissed" | "unavailable" | "manual"
 */
export async function triggerPWAInstall(): Promise<
  "accepted" | "dismissed" | "unavailable" | "manual"
> {
  if (isRunningInPWA() || isPWAAlreadyInstalledFlag()) return "unavailable";

  if (deferredPrompt) {
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null; // single-use by spec
      return outcome;
    } catch (error) {
      console.warn("Native install prompt error:", error);
      return "manual";
    }
  }

  // No cached event → show manual instructions
  return "manual";
}

/** Quick installability checks (surface common misconfigurations) */
export function checkPWAInstallability() {
  const issues: string[] = [];

  // HTTPS required
  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    issues.push("اپلیکیشن باید روی HTTPS سرو شود");
  }

  // Manifest presence
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (!manifestLink) {
    issues.push("فایل manifest یافت نشد");
  }

  // Service worker support
  if (!("serviceWorker" in navigator)) {
    issues.push("مرورگر از Service Worker پشتیبانی نمی‌کند");
  }

  return {
    isInstallable: issues.length === 0,
    issues,
  };
}

/** Browser-specific manual instructions */
export function getInstallInstructions() {
  const browser = getBrowserInfo();

  if (browser.isIOS && browser.isSafari) {
    return {
      type: "manual",
      title: "نصب در Safari (iOS)",
      steps: [
        "دکمه اشتراک‌گذاری (↗) را در پایین صفحه بزنید",
        "گزینه «Add to Home Screen» را انتخاب کنید",
        "نام را تأیید کرده و «Add» را بزنید",
      ],
    };
  }

  if (browser.isAndroid && browser.isChrome) {
    return {
      type: "auto-or-manual",
      title: "نصب در Chrome (Android)",
      steps: [
        "در صورت نمایش، دکمه «Install» را بزنید",
        "یا از منوی سه‌نقطه (...) «Add to Home screen» را انتخاب کنید",
      ],
    };
  }

  if (browser.isFirefox) {
    return {
      type: "manual",
      title: "نصب در Firefox",
      steps: [
        "منوی سه‌خط (☰) را باز کنید",
        "«Install» یا «نصب وب‌اپ» را انتخاب کنید",
        "یا آیکون نصب (+) کنار آدرس‌بار را کلیک کنید",
      ],
    };
  }

  if (browser.isChrome || browser.isEdge) {
    return {
      type: "auto-or-manual",
      title: `نصب در ${browser.isChrome ? "Chrome" : "Edge"}`,
      steps: [
        "در صورت نمایش، دکمه «Install» را بزنید",
        "یا آیکون نصب (+) کنار آدرس‌بار را کلیک کنید",
        "یا از منوی سه‌نقطه (...) «Install app» را انتخاب کنید",
      ],
    };
  }

  return {
    type: "manual",
    title: "نصب اپلیکیشن",
    steps: [
      "از منوی مرورگر گزینه نصب اپلیکیشن را انتخاب کنید",
      "اگر گزینه نصب را نمی‌بینید، مرورگر شما از نصب PWA پشتیبانی نمی‌کند",
    ],
  };
}
