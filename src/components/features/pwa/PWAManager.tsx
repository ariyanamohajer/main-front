import { useAutoPromptPWAInstall } from "@/hooks/common";
import { PWAInstallPrompt } from "./PWAInstallPrompt";

interface PWAManagerProps {
  /** Enable automatic install prompts */
  autoPrompt?: boolean;
  /** Delay before showing auto prompt (in milliseconds) */
  autoPromptDelay?: number;
  /** Maximum number of auto prompts to show */
  maxAutoPrompts?: number;
  /** Days between auto prompts */
  daysBetweenPrompts?: number;
}

/**
 * PWA Manager component that handles automatic install prompts
 * Add this component to your main layout to enable PWA installation features
 */
export function PWAManager({
  autoPrompt = true,
  autoPromptDelay = 30000, // 30 seconds
  maxAutoPrompts = 3,
  daysBetweenPrompts = 7,
}: PWAManagerProps) {
  const pwa = useAutoPromptPWAInstall({
    enabled: autoPrompt,
    delay: autoPromptDelay,
    maxPrompts: maxAutoPrompts,
    daysBetweenPrompts,
  });

  return (
    <PWAInstallPrompt
      open={pwa.promptVisible}
      onClose={pwa.actions.hideInstallPrompt}
    />
  );
}

/**
 * Simple install button component
 * Use this to add a manual install trigger anywhere in your app
 */
export function PWAInstallButton({
  children = "نصب اپلیکیشن",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
}) {
  const pwa = useAutoPromptPWAInstall({ enabled: false });

  if (pwa.isInstalled || !pwa.canShowPrompt) {
    return null;
  }

  return (
    <>
      <button
        onClick={pwa.actions.showInstallPrompt}
        className={`px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors ${className}`}
        {...props}
      >
        {children}
      </button>

      <PWAInstallPrompt
        open={pwa.promptVisible}
        onClose={pwa.actions.hideInstallPrompt}
      />
    </>
  );
}

/**
 * PWA Status indicator - shows installation status
 * Useful for debugging or showing users the current state
 */
export function PWAStatusIndicator() {
  const pwa = useAutoPromptPWAInstall({ enabled: false });

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-3 text-xs shadow-lg z-50">
      <h4 className="font-semibold mb-2">PWA Status (Dev Only)</h4>
      <div className="space-y-1">
        <div>
          Status: {pwa.isInstalled ? "✅ Installed" : "❌ Not Installed"}
        </div>
        <div>Installable: {pwa.isInstallable ? "✅ Yes" : "❌ No"}</div>
        <div>Can Show Prompt: {pwa.canShowPrompt ? "✅ Yes" : "❌ No"}</div>
        <div>
          Browser:{" "}
          {(pwa.browserInfo.isChrome && "Chrome") ||
            (pwa.browserInfo.isFirefox && "Firefox") ||
            (pwa.browserInfo.isSafari && "Safari") ||
            (pwa.browserInfo.isEdge && "Edge") ||
            "Unknown"}
        </div>
        <div>
          Native Support:{" "}
          {pwa.browserInfo.supportsBeforeInstallPrompt ? "✅ Yes" : "❌ No"}
        </div>
        {!pwa.installability.isInstallable && (
          <div className="text-destructive mt-2">
            Issues: {pwa.installability.issues.join(", ")}
          </div>
        )}
      </div>

      {pwa.canShowPrompt && (
        <button
          onClick={pwa.actions.showInstallPrompt}
          className="mt-2 w-full px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
        >
          Test Install Prompt
        </button>
      )}
    </div>
  );
}
