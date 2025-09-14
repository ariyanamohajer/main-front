import { useState, useEffect, useCallback } from "react";
import {
  isRunningInPWA,
  isPWAInstallAvailable,
  getBrowserInfo,
  getInstallInstructions,
  checkPWAInstallability,
  triggerPWAInstall,
} from "@/components/features/pwa/install";

export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  canShowPrompt: boolean;
  browserInfo: ReturnType<typeof getBrowserInfo>;
  installInstructions: ReturnType<typeof getInstallInstructions>;
  installability: ReturnType<typeof checkPWAInstallability>;
}

export interface PWAInstallActions {
  showInstallPrompt: () => void;
  hideInstallPrompt: () => void;
  attemptInstall: () => Promise<
    "accepted" | "dismissed" | "unavailable" | "manual"
  >;
  checkForUpdates: () => void;
}

export function usePWAInstall() {
  const [promptVisible, setPromptVisible] = useState(false);
  const [installState, setInstallState] = useState<PWAInstallState>(() => ({
    isInstallable: false,
    isInstalled: false,
    canShowPrompt: false,
    browserInfo: getBrowserInfo(),
    installInstructions: getInstallInstructions(),
    installability: checkPWAInstallability(),
  }));

  const updateInstallState = useCallback(() => {
    const isInstalled = isRunningInPWA();
    const isInstallable = isPWAInstallAvailable();
    const browserInfo = getBrowserInfo();
    const installInstructions = getInstallInstructions();
    const installability = checkPWAInstallability();

    // Can show prompt if not installed and installable
    const canShowPrompt = !isInstalled && installability.isInstallable;

    setInstallState({
      isInstallable,
      isInstalled,
      canShowPrompt,
      browserInfo,
      installInstructions,
      installability,
    });
  }, []);

  useEffect(() => {
    updateInstallState();

    // Listen for app install events
    const handleAppInstalled = () => {
      updateInstallState();
      setPromptVisible(false);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Check for beforeinstallprompt events
    const handleBeforeInstallPrompt = () => {
      updateInstallState();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [updateInstallState]);

  const showInstallPrompt = useCallback(() => {
    if (installState.canShowPrompt) {
      setPromptVisible(true);
    }
  }, [installState.canShowPrompt]);

  const hideInstallPrompt = useCallback(() => {
    setPromptVisible(false);
  }, []);

  const attemptInstall = useCallback(async () => {
    const result = await triggerPWAInstall();

    if (result === "accepted" || result === "dismissed") {
      setPromptVisible(false);
    }

    // Update state after installation attempt
    updateInstallState();

    return result;
  }, [updateInstallState]);

  const checkForUpdates = useCallback(() => {
    updateInstallState();
  }, [updateInstallState]);

  const actions: PWAInstallActions = {
    showInstallPrompt,
    hideInstallPrompt,
    attemptInstall,
    checkForUpdates,
  };

  return {
    ...installState,
    promptVisible,
    actions,
  };
}

// Auto-prompt hook for showing install prompt automatically
export function useAutoPromptPWAInstall(
  options: {
    delay?: number;
    maxPrompts?: number;
    daysBetweenPrompts?: number;
    enabled?: boolean;
  } = {}
) {
  const {
    delay = 30000, // 30 seconds default
    maxPrompts = 3,
    daysBetweenPrompts = 7,
    enabled = true,
  } = options;

  const pwa = usePWAInstall();

  useEffect(() => {
    if (
      !enabled ||
      !pwa.canShowPrompt ||
      pwa.isInstalled ||
      pwa.promptVisible
    ) {
      return;
    }

    // Check localStorage for prompt history
    const promptHistory = JSON.parse(
      localStorage.getItem("pwa-prompt-history") || "[]"
    );
    const lastPrompt = promptHistory[promptHistory.length - 1];

    // Check if we've exceeded max prompts
    if (promptHistory.length >= maxPrompts) {
      return;
    }

    // Check if enough time has passed since last prompt
    if (lastPrompt) {
      const daysSinceLastPrompt =
        (Date.now() - lastPrompt) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPrompt < daysBetweenPrompts) {
        return;
      }
    }

    const timer = setTimeout(() => {
      pwa.actions.showInstallPrompt();

      // Record this prompt
      const newHistory = [...promptHistory, Date.now()];
      localStorage.setItem("pwa-prompt-history", JSON.stringify(newHistory));
    }, delay);

    return () => clearTimeout(timer);
  }, [
    enabled,
    pwa.canShowPrompt,
    pwa.isInstalled,
    pwa.promptVisible,
    pwa.actions,
    delay,
    maxPrompts,
    daysBetweenPrompts,
  ]);

  return pwa;
}
