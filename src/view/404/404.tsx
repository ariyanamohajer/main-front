import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Home, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

// const floatTransition = {
//   repeat: Infinity,
//   repeatType: "reverse" as const,
//   duration: 3.8,
//   ease: "easeInOut",
// };

function NotFoundView() {
  const navigate = useNavigate();

  const suggestions = useMemo(
    () => [
      "آدرس را بررسی کنید؛ شاید یک حرف یا عدد جا مانده باشد.",
      "اگر از لینک قدیمی استفاده کرده‌اید، صفحه اصلی همیشه در دسترس است.",
      "می‌توانید از منوی بالای سایت برای یافتن مسیر درست کمک بگیرید.",
    ],
    [],
  );

  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Background shapes */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
        <div className="absolute top-1/3 -right-[18%] h-80 w-80 rounded-full bg-secondary/10 blur-3xl dark:bg-secondary/15" />
        <motion.div
          aria-hidden
          className="absolute bottom-8 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl dark:bg-accent/30"
          animate={{ opacity: [0.6, 0.95, 0.6] }}
        //   transition={floatTransition}
        />
      </div>

      <div className="container mx-auto flex min-h-[70vh] flex-col justify-center px-5 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto w-full max-w-4xl rounded-3xl border border-border/60 bg-card/80 p-8 shadow-xl backdrop-blur lg:p-12"
          dir="rtl"
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="relative flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/10 px-8 py-10 text-center shadow-inner ring-1 ring-primary/20 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20"
            >
              <span className="text-sm font-semibold tracking-[0.25rem] text-primary/80">
                ۴۰۴
              </span>
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="bg-gradient-to-br from-primary via-primary/70 to-secondary bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl md:text-8xl"
              >
                صفحه یافت نشد
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                className="mt-5 max-w-xs text-center text-sm text-muted-foreground"
              >
                ظاهراً مسیری که به دنبالش بودید جابجا شده یا دیگر وجود ندارد.
              </motion.span>
            </motion.div>

            <div className="flex-1 space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.25 }}
                className="text-2xl font-semibold leading-relaxed tracking-tight text-foreground md:text-3xl"
              >
                نگران نباشید؛ به شما کمک می‌کنیم خیلی سریع به مسیر اصلی
                برگردید.
              </motion.h2>

              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.35 }}
                className="space-y-3 text-right text-sm text-muted-foreground md:text-base"
              >
                {suggestions.map((tip) => (
                  <li
                    key={tip}
                    className="relative pr-6"
                  >
                    <span className="absolute right-0 top-2 size-2 rounded-full bg-primary/70" />
                    {tip}
                  </li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.45 }}
                className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end"
              >
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  size="lg"
                  className="justify-center sm:w-auto"
                >
                  <RefreshCcw className="size-4" />
                  بازگشت به صفحه قبلی
                </Button>
                <Button size="lg" className="justify-center sm:w-auto" asChild>
                  <Link to="/">
                    <Home className="size-4" />
                    رفتن به صفحه اصلی
                    <ArrowRight className="size-4 shrink-0" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default NotFoundView;
