import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import IntroPhone from "@/assets/images/intro.webp";
import { triggerPWAInstall } from "@/components/features/pwa/install";
import { PWAInstallPrompt } from "@/components/features/pwa/PWAInstallPrompt";

/** Phone mock (tilted, no ropes) */
function PhoneHero() {
  return (
    <motion.div
      // Mobile: wide, Desktop: much larger
      className="relative mx-auto w-[92vw] max-w-[520px] md:max-w-[600px] lg:max-w-[680px]"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={IntroPhone}
        alt="پیشنهاد ویژه خدمات بازی و سیم‌کارت"
        className="h-auto w-full select-none rounded-[2rem] shadow-2xl ring-1 ring-black/10"
        initial={{ rotate: -12 }}
        whileHover={{ rotate: -8, y: -4 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
        draggable={false}
      />
    </motion.div>
  );
}

export default function Introduction() {
  const [fallbackOpen, setFallbackOpen] = React.useState(false);
  const APK_DOWNLOAD_URL =
    "https://api.panel.arianamohajer.ir/api/Download/DownloadApk";
  const cafeBazaarLink = "https://cafebazaar.ir/app/com.yourapp";
  const myketLink = "https://myket.ir/app/com.yourapp";

  // Optional: hide the button entirely if app is already installed.
  // const alreadyInstalled = isRunningInPWA() || isPWAAlreadyInstalledFlag();

  const onDownloadClick = async () => {
    const outcome = await triggerPWAInstall();
    // ✅ show our own sheet for browsers that require manual install
    if (outcome === "manual" || outcome === "unavailable") {
      setFallbackOpen(true);
    }
    // "accepted" or "dismissed" can be tracked if needed.
  };

  return (
    <section
      id="intro"
      // Softer hero background using your tokens (looks good in light/dark)
      className="relative overflow-hidden bg-accent py-10 sm:py-14 md:py-20"
    >
      {/* Token spotlights for depth */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-destructive/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Phone first on mobile, second on desktop */}
          <div className="order-1 md:order-2">
            <PhoneHero />
          </div>

          {/* Text block */}
          <motion.div
            className="order-2 ml-auto max-w-2xl text-center md:order-1 md:text-right"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <h1 className="text-[22px] font-extrabold leading-snug sm:text-3xl lg:text-4xl">
              خرید خدمات بازی های آنلاین و سیم کارت های بین المللی فقط با یک
              کلیک{" "}
            </h1>

            <p className="mt-3 text-[14px] leading-7 text-foreground/80 text-justify sm:text-[15px] sm:leading-8">
              خرید سریع و آسان یوسی پابجی موبایل و سی‌پی کالاف دیوتی موبایل با
              قیمت فوق‌العاده مناسب و تحویل فوری، بدون نیاز به رمز اکانت. ارائه
              انواع خدمات ویژه و آیتم‌های اختصاصی برای گیمرها، شامل اسکین‌ها،
              باندل‌ها و آپدیت‌های ویژه هر بازی. همچنین فروش سیم‌کارت‌های
              بین‌المللی معتبر برای اتصال پایدار و بدون محدودیت به سرورها، مناسب
              برای کاهش پینگ و جلوگیری از مشکلات اتصال. پشتیبانی آنلاین ۲۴ ساعته
              و پرداخت امن، برای تجربه‌ای راحت و بی‌دغدغه.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Button
                size="lg"
                onClick={onDownloadClick}
                className="flex-row-reverse gap-2 cursor-pointer bg-destructive text-white hover:bg-destructive/90"
              >
                نصب اپلیکیشن (نسخه PWA)
                <Download className="h-5 w-5" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="flex-row-reverse gap-2 border-destructive text-destructive hover:bg-destructive/10"
              >
                <a
                  href={APK_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  دانلود مستقیم
                  <Download className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <a
                href={cafeBazaarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
              >
                <img
                  src="/bazar.png"
                  alt="دانلود از کافه بازار"
                  className="h-12 w-auto"
                />
              </a>
              <a
                href={myketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
              >
                <img
                  src="/myket.png"
                  alt="دانلود از مایکت"
                  className="h-12 w-auto"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fallback manual-install sheet for non-Chromium browsers */}
      <PWAInstallPrompt
        open={fallbackOpen}
        onClose={() => setFallbackOpen(false)}
      />
    </section>
  );
}
