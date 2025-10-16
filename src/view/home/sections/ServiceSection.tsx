import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

// Images (your provided paths)
import ServicePhone2 from "@/assets/images/image-service.svg";
import CallOfImg from "@/assets/images/call-of.svg";
import PubgImg from "@/assets/images/sim.svg";
import SimImg from "@/assets/images/hey1.png";
import simImg2 from "@/assets/images/hey2.jpg"

/* --------------------------- Service Card --------------------------- */
/** One colorful card with image + 2-line title */
function ServiceCard({
  img,
  line1,
  line2,
  bg,
  shadow,
  delay = 0,
}: {
  img: string;
  line1: string;
  line2: string;
  bg: string; // Tailwind bg class (e.g., 'bg-pink-500')
  shadow: string; // Tailwind shadow-tone (e.g., 'shadow-pink-300/50')
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className={[
        "relative overflow-hidden rounded-2xl p-4  flex items-center justify-between",
        bg,
        "text-white",
        "ring-1 ring-black/5",
        "shadow-lg", // base
      ].join(" ")}
      style={{
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)", // soft global shadow
      }}
    >
      <div className="min-h-[84px] flex flex-col justify-start">
        <h3 className="text-[15px] md:text-base font-semibold drop-shadow-sm">
          {line1}
        </h3>
        <p className="text-xs md:text-sm opacity-95">{line2}</p>
      </div>
      {/* Thumb */}
      <div className="h-24 w-24 rounded-full  overflow-hidden">
        <img src={img} alt="" className="h-full w-full object-cover" />
      </div>

      {/* subtle bottom shadow tint matching bg */}
      <div
        className={[
          "pointer-events-none absolute inset-x-0 -bottom-2 h-6 blur-xl",
          shadow,
        ].join(" ")}
      />
    </motion.div>
  );
}

/* --------------------------- Phone Mockup --------------------------- */
function PhoneMock() {
  const options = [
    "خرید سیم‌کارت خارجی فیزیکی",
    "شارژ سیم‌کارت خارجی یک‌ماهه + برداشت",
    "شارژ سیم‌کارت خارجی سه‌ماهه + برداشت",
    "شارژ سیم‌کارت خارجی موقت",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="mx-auto w-[300px] sm:w-[330px] md:w-[260px]"
    >
      <div className="relative rounded-[2rem] bg-black px-1 py-2 shadow-2xl ring-1 ring-black/10">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-28 rounded-b-2xl bg-black" />
        {/* Screen */}
        <div className="rounded-[1.6rem] bg-card text-foreground p-8 h-full">
          <img
            src={ServicePhone2}
            alt="خدمات آریانا مهاجر"
            className="w-full h-44 object-contain rounded-lg mb-3"
          />

          <p className="text-sm mb-3 text-right">یک گزینه را انتخاب کنید.</p>

          <div className="space-y-2" dir="rtl">
            {options.map((label) => (
              <div
                key={label}
                className="flex flex-row-reverse items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 shadow-sm transition hover:bg-muted/70 min-h-[52px]"
              >
                <span className="flex-1 text-sm font-medium leading-6 text-right text-foreground">
                  {label}
                </span>
                <CheckCircle className="size-6 text-primary shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------- The Section -------------------------- */
export default function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Decorative red waves (top & bottom) */}
      <TopWave />
      <BottomWave />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left column: title + cards */}
          <div className="order-2 md:order-2">
            <h2 className="text-xl md:text-2xl font-semibold mb-6">
              توی آریانا مهاجر چه خدماتی دریافت می‌کنید؟
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
              <ServiceCard
                img={CallOfImg}
                line1="خدمات کالاف"
                line2="موبایل"
                bg="bg-fuchsia-600"
                shadow="bg-fuchsia-500/40"
                delay={0.02}
              />
              <ServiceCard
                img={PubgImg}
                line1="خدمات پابجی"
                line2="موبایل"
                bg="bg-sky-500"
                shadow="bg-sky-400/40"
                delay={0.08}
              />
              <ServiceCard
                img={SimImg}
                line1="سیم کارت‌های"
                line2="خارجی"
                bg="bg-lime-500"
                shadow="bg-lime-400/40"
                delay={0.14}
              />
              <ServiceCard
                img={simImg2}
                line1="سیم کارت‌های"
                line2="داخلی"
                bg="bg-primary"
                shadow="bg-lime-400/40"
                delay={0.14}
              />
            </div>
          </div>

          {/* Right column: phone mock */}
          <div className="order-1 md:order-1">
            <PhoneMock />
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Decorative Waves ----------------------- */
/* --------------------------- Decorative Waves ----------------------- */
/** Top wave: full-width, no clipping */
function TopWave() {
  return (
    <svg
      className="pointer-events-none absolute top-0 left-0 w-full h-16 md:h-24"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,70 L160,70 C300,70 360,50 520,60 C760,78 920,110 1200,95 C1320,88 1380,80 1440,84 L1440,0 L0,0 Z"
        fill="var(--destructive)"
      />
    </svg>
  );
}

/** Bottom wave: full-width, mirrors the top wave */
function BottomWave() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 right-0 w-full h-16 md:h-24"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,60 C300,100 620,20 960,60 C1130,78 1290,82 1440,64 L1440,120 L0,120 Z"
        fill="var(--destructive)"
      />
    </svg>
  );
}
