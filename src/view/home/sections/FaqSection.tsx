// src/sections/FaqSection.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import FaqIllustration from "@/assets/svg/FaqIllustration";

/** Data source for FAQs (edit freely) */
const FAQS: { q: string; a: React.ReactNode }[] = [
  { q: "چقدر طول میکشه تا سیم‌کارت‌ها واگذار بشن؟", a: "معمولاً بین ۲۴ تا ۴۸ ساعت کاری. در ایام شلوغی ممکن است کمی بیشتر شود." },
  { q: "چطور آیدی بازی‌مو پیدا کنم؟", a: "در تنظیمات بازی بخش Profile یا Account را باز کنید؛ آیدی معمولاً کنار نام کاربری نمایش داده می‌شود." },
  { q: "نیاز به رمز دوم دارم؟", a: "خیر، پرداخت‌ها از درگاه امن انجام می‌شود و فقط رمز پویا/یک‌بارمصرف لازم است." },
  { q: "پشتیبانی چگونه پاسخ‌گو است؟", a: "هر روز از ۹ تا ۱۹ از طریق واتس‌اپ، تلگرام و تماس تلفنی پاسخ‌گو هستیم." },
];

/** Small circular badge used on each row (matches screenshot vibe) */
// function QuestionBadge() {
//   return (
//     <span
//       className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full
//                  bg-destructive text-destructive-foreground font-bold ring-1 ring-border"
//       aria-hidden
//     >
//       {"؟"}
//     </span>
//   );
// }

export default function FaqSection() {
  return (
    <section className="relative py-16 md:py-24 bg-background">
      {/* Decorative ribbon */}
      <div className="pointer-events-none absolute -top-3 left-6 w-70 h-6 bg-primary">
        <div className="absolute -bottom-[14px] left-[70%] w-0 h-0 border-t-[14px] border-t-primary border-r-[28px] border-r-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
          {/* Illustration (left on desktop) */}
          <motion.div
            className="order-2 md:order-2 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <FaqIllustration className="w-full max-w-[420px] h-auto" />
          </motion.div>

          {/* FAQs (right on desktop) */}
          <motion.div
            className="order-1 md:order-1"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h2 className="text-xl md:text-2xl font-semibold text-center md:text-right mb-6">
              سوالات متداول
            </h2>

            <Card className="p-3 md:p-4 bg-card border-border">
              <Accordion type="single" collapsible className="w-full space-y-3">
                {FAQS.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`item-${idx}`}
                    className="rounded-lg border border-border px-3 md:px-4"
                  >
                    {/* We hide default chevron and build our own RTL row */}
                    <AccordionTrigger
                      className="flex w-full items-center justify-between py-3 md:py-3.5 text-right"
                    >
                      <span className="text-sm md:text-[15px] text-foreground/90">{item.q}</span>
                      {/* <div className="flex w-full items-center justify-between">
                        <span className="text-sm md:text-[15px] text-foreground/90">{item.q}</span>
                        <QuestionBadge />
                      </div> */}
                    </AccordionTrigger>

                    <AccordionContent className="pb-4 text-sm leading-7 text-foreground/80">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
