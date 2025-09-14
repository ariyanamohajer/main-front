// src/sections/AboutUsSection.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRef } from "react";

/** Title row aligned to the right with a red diamond accent */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-start gap-3 mb-6">
      <div className="w-28 h-px bg-border relative hidden md:block">
        <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rotate-45 rounded-[2px] bg-destructive" />
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-right">
        {children}
      </h2>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.li
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35 }}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800">
        <Check className="h-4 w-4" />
      </span>
      <span className="text-foreground/90">{children}</span>
    </motion.li>
  );
}

export default function AboutUsSection() {
  const aboutRef = useRef<HTMLDivElement>(null);
  return (
    <section className="py-16 md:py-24 bg-background" id="about" ref={aboutRef}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Anchor the content block to the right side */}
        <div className="max-w-5xl ml-auto">
          <SectionTitle>ما کی هستیم؟</SectionTitle>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-foreground/90 leading-8 text-right">
              آریانا مهاجر، جایی برای عاشقان بازی و آدمای همیشه آنلاین! ما توی
              آریانا مهاجر از سال ۱۳۹۸ با یه هدف ساده شروع کردیم: اینکه دسترسی
              به خدمات حرفه‌ای بازی‌های محبوب پابجی موبایل و کالاف دیوتی موبایل
              رو آسون و مطمئن کنیم. چه دنبال خرید یوسی، سی پی، اکانت حرفه‌ای یا
              خدمات ویژه باشی، چه بخوای با یه سیم‌کارت خارجی معتبر به اکانت‌هات
              امنیت بدی یا محدودیت‌ها رو دور بزنی، ما اینجاییم که تجربه‌ای امن و
              سریع، بدون دردسر، برات بسازیم.
            </p>
          </motion.div>

          <div className="mt-6">
            <ul className="text-[15px] flex flex-col gap-3 max-w-md">
              <CheckItem>پشتیبانی واقعی</CheckItem>
              <CheckItem>قیمت‌گذاری منصفانه</CheckItem>
              <CheckItem>تحویل سریع و مطمئن</CheckItem>
              <CheckItem>اعتماد گیمرها و کاربران حرفه‌ای</CheckItem>
            </ul>
          </div>

          <motion.p
            className="mt-8 text-right text-foreground/70"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35 }}
          >
            آریانا مهاجر فقط یه سایت نیست؛ یه پشتیبان قابل اعتماد برای دنیای
            دیجیتال توئه.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
