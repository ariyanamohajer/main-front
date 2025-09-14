// src/sections/TestimonialsSection.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserRound, Star } from "lucide-react";

/* ----------------------------- Demo data ----------------------------- */
// Replace with your real reviews or fetch from API.
type Testimonial = {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  bullets: string[];
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "حسام NG.",
    rating: 5,
    bullets: [
      "کیفیت خدمات عالی بود.",
      "پاسخ‌گویی دقیق و محترمانه.",
      "حتماً دوباره استفاده می‌کنم.",
    ],
  },
  {
    id: "t2",
    name: "NG.حسام",
    rating: 4,
    bullets: [
      "فرآیند ساده و شفاف بود.",
      "قیمت‌گذاری منصفانه.",
      "ارسال سریع و به‌موقع.",
    ],
  },
  {
    id: "t3",
    name: "حسام NG.",
    rating: 5,
    bullets: [
      "تجربه خرید آسان و مطمئن.",
      "پشتیبانی سریع و حرفه‌ای.",
      "بسته‌بندی مرتب و تمیز.",
    ],
  },
];

/* --------------------------- Small UI helpers ------------------------ */
function RatingStars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="inline-flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4"
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex-1 h-px bg-border relative">
        <span className="absolute -right-2 -top-1.5 h-3 w-3 rotate-45 rounded-[2px] bg-destructive" />
      </div>
      <h2 className="text-destructive text-xl md:text-2xl font-semibold">
        {children}
      </h2>
      <div className="flex-1 h-px bg-border relative">
        <span className="absolute -left-2 -top-1.5 h-3 w-3 rotate-45 rounded-[2px] bg-destructive" />
      </div>
    </div>
  );
}

/* ------------------------ Speech-bubble card ------------------------- */
function TestimonialBubbleCard({
  name,
  rating,
  bullets,
  index,
}: {
  name: string;
  rating: number;
  bullets: string[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      
      className="relative bg-white dark:bg-background shadow-lg rounded-lg"
      dir="rtl"
    >
      {/* SVG bubble background with bottom notch */}
      <svg
        viewBox="0 0 560 320"
        className="absolute inset-0 h-full w-full -z-10 drop-shadow-[0_12px_36px_rgb(0_0_0/0.08)]"
        aria-hidden
        preserveAspectRatio="none"
      >
        <path
          d="
            M 28 78
            Q 28 28 108 24
            L 452 24
            Q 532 28 532 96
            L 532 188
            Q 532 256 456 266
            C 398 274 330 276 292 274
            C 276 273 268 266 258 258
            C 248 250 238 246 224 246
            C 210 246 200 252 188 261
            C 171 274 152 276 120 272
            Q 28 260 28 190
            Z
          "
          fill="var(--card)"
          stroke="var(--border)"
          strokeWidth="1"
        />
      </svg>

      {/* Header */}
      <div className="px-7 pt-5">
        <div className="flex items-center justify-between gap-3">
          {/* Gradient-ring avatar on the visual left */}
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-fuchsia-500 to-sky-400">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-primary ring-1 ring-border">
              <UserRound className="h-5 w-5" />
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm md:text-[15px]">
            <strong className="font-semibold">{name}</strong>
            <RatingStars rating={rating} />
          </div>
        </div>

        <Separator className="my-3 bg-border/80" />
      </div>

      {/* Content */}
      <div className="px-9 pb-6">
        <ul className="list-disc pr-4 md:pr-5 space-y-1.5 text-sm leading-7 text-foreground/90">
          {bullets.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
          <li>…</li>
        </ul>
      </div>
    </motion.div>
  );
}

/* ----------------------------- The section --------------------------- */
export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-background" id="testimonials" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        <Title>دوستانی که به ما اعتماد کردند</Title>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialBubbleCard
              key={t.id}
              name={t.name}
              rating={t.rating}
              bullets={t.bullets}
              index={i}
            />
          ))}
        </div>

        <div className="mt-8">
          <Button
            variant="outline"
            className="border-border text-foreground hover:text-primary hover:border-primary"
            asChild
          >
            <a href="/reviews">دیدن همه نظرات</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
