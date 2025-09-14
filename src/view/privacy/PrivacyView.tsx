import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Database,
  Eye,
  Share2,
  Wallet,
  Lock,
  FileText,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
} from "lucide-react";

function PrivacyView() {
  const sections = [
    {
      id: "intro",
      icon: FileText,
      title: "۱. مقدمه",
      content: [
        "سلام به شما کاربر عزیز! در آریانا مهاجر، ما به حریم خصوصی و امنیت اطلاعات شما اهمیت زیادی می‌دهیم. این سند (سیاست حفظ حریم خصوصی) توضیح می‌دهد که چه اطلاعاتی را جمع‌آوری می‌کنیم، چگونه از آن‌ها استفاده می‌کنیم و چه اقداماتی برای محافظت از داده‌های شما انجام می‌دهیم.",
      ],
    },
    {
      id: "data-collection",
      icon: Database,
      title: "۲. اطلاعاتی که جمع‌آوری می‌کنیم",
      content: [
        "ما داده‌های حساس مانند اطلاعات بانکی یا هویتی کامل شما را ذخیره نمی‌کنیم. با این حال، برای ارائه خدمات بهتر، ممکن است اطلاعات زیر را نگهداری کنیم:",
      ],
      items: [
        "اطلاعات حساب کاربری (نام کاربری، ایمیل، شماره تماس)",
        "سوابق سفارشات و تراکنش‌ها (محصولات خریداری‌شده، مبلغ پرداختی، تاریخ خرید)",
        "لاگ‌های امنیتی (تاریخ و ساعت ورود و خروج، IP دستگاه)",
        "اطلاعات کیف پول کاربران (موجودی، تراکنش‌های داخلی)",
      ],
    },
    {
      id: "data-usage",
      icon: Eye,
      title: "۳. نحوه استفاده از اطلاعات",
      content: ["داده‌های شما فقط برای اهداف زیر استفاده می‌شوند:"],
      items: [
        "پردازش سفارشات و تراکنش‌ها",
        "ارائه پشتیبانی بهتر به کاربران",
        "بهبود امنیت حساب‌ها و جلوگیری از کلاهبرداری",
        "ارسال نوتیفیکیشن‌های ضروری (مانند وضعیت سفارش)",
      ],
    },
    {
      id: "data-security",
      icon: Lock,
      title: "۴. ذخیره‌سازی و امنیت داده‌ها",
      content: [],
      items: [
        "اطلاعات شما در سرورهای امن با رمزنگاری پیشرفته نگهداری می‌شود.",
        "از پروتکل‌های امنیتی (مانند HTTPS) برای انتقال داده استفاده می‌کنیم.",
        "دسترسی به اطلاعات فقط برای تیم فنی و پشتیبانی محدود شده است.",
      ],
    },
    {
      id: "data-sharing",
      icon: Share2,
      title: "۵. اشتراک‌گذاری اطلاعات؟",
      content: [
        "ما اطلاعات شما را به هیچ شرکت یا سازمان دیگری نمی‌فروشیم یا منتقل نمی‌کنیم، مگر در موارد:",
      ],
      items: [
        "درخواست قانونی از مراجع قضایی",
        "همکاری با پرداخت‌یاب‌های معتبر (برای تراکنش‌های مالی)",
      ],
    },
    {
      id: "wallet-security",
      icon: Wallet,
      title: "۶. کیف پول امن آریانا مهاجر",
      content: ["کیف پول داخلی ما یک بستر امن برای خریدهای شما فراهم می‌کند:"],
      items: [
        "موجودی تومانی شما با امنیت کامل مدیریت می‌شود.",
        "تراکنش‌ها به صورت شفاف ثبت و قابل پیگیری هستند.",
        "امکان واریز و برداشت با روش‌های مطمئن فراهم است.",
      ],
    },
    {
      id: "policy-changes",
      icon: Calendar,
      title: "۷. تغییرات در سیاست حریم خصوصی",
      content: [
        "در صورت بروزرسانی این سیاست، تغییرات را در همین صفحه اطلاع‌رسانی خواهیم کرد.",
      ],
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      label: "ایمیل",
      value: "support@arianamohajer.ir",
      link: "mailto:support@arianamohajer.ir",
    },
    {
      icon: Phone,
      label: "پشتیبانی",
      value: "09910395938",
      link: "tel:09910395938",
    },
    {
      icon: MessageCircle,
      label: "تلگرام",
      value: "@cr7saeedm",
      link: "https://t.me/cr7saeedm",
    },
  ];

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      {/* Hero Section */}
      <motion.section
        className="relative py-16 md:py-24 bg-gradient-to-br from-[color:var(--primary)]/10 to-[color:var(--secondary)]/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Badge className="mb-4 text-sm bg-[color:var(--secondary)]/20 text-[color:var(--secondary)] hover:bg-[color:var(--secondary)]/30">
              <Shield className="h-4 w-4 mr-2" />
              حفظ حریم خصوصی
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[color:var(--foreground)] mb-6">
              سیاست حفظ{" "}
              <span className="text-[color:var(--primary)]">حریم خصوصی</span>
            </h1>
            <p className="text-lg md:text-xl text-[color:var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
              در آریانا مهاجر، حفظ حریم خصوصی و امنیت اطلاعات شما اولویت اصلی
              ماست. این سند به طور کامل توضیح می‌دهد که چگونه از اطلاعات شما
              محافظت می‌کنیم.
            </p>
            <motion.div
              className="mt-6 flex items-center justify-center gap-4 text-sm text-[color:var(--muted-foreground)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Calendar className="h-4 w-4" />
              <span>
                آخرین به‌روزرسانی: {new Date().toLocaleDateString("fa-IR")}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Privacy Sections */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                // initial={{ y: 30, opacity: 0 }}
                // whileInView={{ y: 0, opacity: 1 }}
                // transition={{ delay: 0.1, duration: 0.1 }}
                // viewport={{ once: true }}
              >
                <Card className="border-[color:var(--border)] bg-[color:var(--card)] shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl md:text-2xl text-[color:var(--foreground)]">
                      <div className="p-2 rounded-lg bg-[color:var(--primary)]/10">
                        <section.icon className="h-6 w-6 text-[color:var(--primary)]" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-[color:var(--muted-foreground)] leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.items && (
                      <ul className="space-y-3 mt-4">
                        {section.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="w-2 h-2 rounded-full bg-[color:var(--primary)] mt-2 flex-shrink-0" />
                            <span className="text-[color:var(--foreground)] leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-[color:var(--accent)]/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--foreground)] mb-4">
              ۸. تماس با ما
            </h2>
            <p className="text-lg text-[color:var(--muted-foreground)] mb-6">
              اگر سوالی درباره حریم خصوصی دارید، از طریق راه‌های زیر با ما در
              ارتباط باشید:
            </p>
            <Separator className="w-20 mx-auto bg-[color:var(--primary)]" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border-[color:var(--border)] bg-[color:var(--card)] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-full bg-[color:var(--secondary)]/10 w-fit mx-auto mb-4">
                      <method.icon className="h-6 w-6 text-[color:var(--secondary)]" />
                    </div>
                    <h3 className="font-semibold text-[color:var(--foreground)] mb-2">
                      {method.label}
                    </h3>
                    <p className="text-[color:var(--muted-foreground)] mb-4">
                      {method.value}
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-[color:var(--secondary)] text-[color:var(--secondary)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--secondary-foreground)]"
                    >
                      <a
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ارتباط
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <motion.section
        className="py-12 bg-[color:var(--muted)]/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-[color:var(--primary)]">
              <Shield className="h-5 w-5" />
              <span>با تشکر از اعتماد شما!</span>
            </div>
            <p className="text-[color:var(--muted-foreground)]">
              تیم آریانا مهاجر
            </p>
            <Button
              asChild
              className="bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-[color:var(--primary-foreground)]"
            >
              <a href="/">بازگشت به خانه</a>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default PrivacyView;
