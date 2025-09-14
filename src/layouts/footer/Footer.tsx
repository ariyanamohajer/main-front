import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, PhoneCall, Send } from "lucide-react";
import ArianaLogo from "@/assets/images/ariyana-logo.svg";

export default function Footer() {
  return (
    <footer className="relative bg-[color:var(--footer-bg)] text-foreground border-t border-[color:var(--footer-divider)] mt-16 overflow-hidden">
      {/* soft token glows for depth */}
      <span
        className="pointer-events-none absolute -top-20 -right-24 h-48 w-48 rounded-full blur-2xl"
        style={{ background: "var(--footer-spot-1)" }}
      />
      <span
        className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "var(--footer-spot-2)" }}
      />

      {/* Decorative ribbon */}
      <div className="pointer-events-none absolute -top-3 left-1/3 w-2/5 h-6 bg-primary">
        <div className="absolute -bottom-[14px] left-0 w-0 h-0 border-t-[14px] border-t-primary border-r-[28px] border-r-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, staggerChildren: 0.06 },
            },
          }}
        >
          {/* Brand + Social */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={ArianaLogo} alt="Ariana Mohajer" className="h-9" />
              <span className="sr-only">Ariana Mohajer</span>
            </Link>

            <div className="mt-6 flex items-center gap-4">
              {/* Telegram */}
              <SocialIcon href="https://t.me//cr7saeedm" label="تلگرام">
                <Send className="h-4 w-4" />
              </SocialIcon>
              {/* WhatsApp */}
              <SocialIcon href="https://wa.me/09910395938" label="واتس‌اپ">
                <MessageCircle className="h-4 w-4" />
              </SocialIcon>
              {/* Phone */}
              <SocialIcon href="tel:+989910395938" label="تماس">
                <PhoneCall className="h-4 w-4" />
              </SocialIcon>
              {/* Email */}
              <SocialIcon href="mailto:support@arianamohajer.ir" label="ایمیل">
                <MessageCircle className="h-4 w-4" />
              </SocialIcon>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            className="max-w-prose mx-auto text-center md:text-right"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <h3 className="text-lg font-semibold mb-3">آریانا مهاجر</h3>
            <p className="text-sm leading-7 text-foreground/80 text-justify">
              آریانا مهاجر جایی برای عاشقان دنیای دیجیتال و امنیت ما در آریانا
              مهاجر با هدف ساده سازی خدمات حرفه ای دیجیتال شروع به فعالیت کردیم
              و تمام تلاش ما بر این است که درخواست و خدمات شما با اطمینان و
              شفافیت پیش برود.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.nav
            className="md:mr-auto"
            aria-label="دسترسی سریع"
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <h4 className="text-lg font-semibold mb-4">دسترسی سریع</h4>
            <ul className="space-y-3">
              <li>
                <FooterLink to="/">خانه</FooterLink>
              </li>
              <li>
                <FooterLink to="/services">خدمات</FooterLink>
              </li>
              <li>
                <FooterLink to="/about">درباره ما</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">ارتباط با ما</FooterLink>
              </li>
            </ul>
          </motion.nav>
        </motion.div>

        <Separator className="my-8 bg-[color:var(--footer-divider)]" />

        {/* Bottom bar */}
        <div
          className="flex  md:flex-row items-center justify-center gap-0.5  text-xs text-foreground/70"
          dir="rtl"
        >
          <span>©طراحی شده توسط</span>
          <div className="flex items-center gap-4">
            <Link
              to="https://codetime-team.info"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              ❤️CodeTime-Team
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "inline-flex items-center rounded-md px-2 py-1.5 transition-colors",
          "text-foreground/80 hover:text-primary hover:bg-primary/10",
          isActive ? "text-primary bg-primary/10" : "",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.98 }}
      className="p-[2px] rounded-full bg-gradient-to-tr from-fuchsia-500 to-sky-400"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-primary ring-1 ring-[color:var(--footer-divider)]">
        {children}
      </span>
    </motion.a>
  );
}
