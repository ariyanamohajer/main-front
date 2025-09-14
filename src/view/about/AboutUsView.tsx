import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Gamepad2,
  Smartphone,
  Globe,
  CreditCard,
  Shield,
  Clock,
  Star,
  HeadphonesIcon,
  Phone,
  MessageCircle,
} from "lucide-react";

function AboutUsView() {
  const services = [
    {
      icon: Gamepad2,
      title: "خرید آیتم‌های داخل بازی‌ها",
      items: [
        "پابجی (PUBG): خرید UC (Unknown Cash) با بهترین قیمت",
        "کالاف دیوتی (Call of Duty): فروش CP (COD Points) و سایر آیتم‌های داخل بازی",
        "و سایر بازی‌های محبوب: امکان خرید ارز و آیتم‌های اختصاصی",
      ],
    },
    {
      icon: Smartphone,
      title: "شارژ سیم‌کارت‌های داخلی و بین‌المللی",
      items: [
        "سیم‌کارت‌های ایرانی: شارژ مستقیم همراه‌اول، ایرانسل و رایتل",
        "سیم‌کارت‌های خارجی: شارژ شماره‌های بین‌المللی برای مسافران و کاربران خارج از ایران",
      ],
    },
    {
      icon: Globe,
      title: "بسته‌های اینترنتی سیم‌کارت‌ها",
      items: [
        "اینترنت همراه: بسته‌های پرسرعت برای سیم‌کارت‌های داخلی",
        "اینترنت بین‌المللی: بسته‌های داده برای سیم‌کارت‌های خارجی",
      ],
    },
    {
      icon: CreditCard,
      title: "خرید از اپلیکیشن‌های خارجی با تومان",
      items: [
        "بسیاری از برنامه‌های خارجی (مانند Netflix, Spotify, VPN ها و...) به‌دلیل تحریم‌ها، پرداخت تومانی ندارند.",
        "ما این امکان را فراهم کرده‌ایم تا بدون نیاز به کارت بانکی بین‌المللی یا صرافی ارز، خریدهای خود را با تومان ایران انجام دهید!",
      ],
    },
  ];

  const features = [
    { icon: CreditCard, text: "پرداخت سریع و آسان (با تومان ایران)" },
    { icon: HeadphonesIcon, text: "پشتیبانی 24 ساعته برای حل مشکلات شما" },
    { icon: Clock, text: "تحویل آنی پس از پرداخت" },
    { icon: Star, text: "قیمت‌های رقابتی و منصفانه" },
    { icon: Shield, text: "امنیت و تضمین کیفیت در تمام تراکنش‌ها" },
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "واتساپ",
      value: "09910395938",
      link: "https://wa.me/09910395938",
    },
    {
      icon: MessageCircle,
      label: "تلگرام",
      value: "@cr7saeedm",
      link: "https://t.me/cr7saeedm",
    },
    {
      icon: Phone,
      label: "تماس تلفنی",
      value: "09910395938",
      link: "tel:09910395938",
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
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge className="mb-4 text-sm bg-[color:var(--primary)]/20 text-[color:var(--primary)] hover:bg-[color:var(--primary)]/30">
              فروشگاه آنلاین معتبر
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[color:var(--foreground)] mb-6">
              به{" "}
              <span className="text-[color:var(--primary)]">آریانا مهاجر</span>{" "}
              خوش آمدید!
            </h1>
            <p className="text-lg md:text-xl text-[color:var(--muted-foreground)] max-w-4xl mx-auto leading-relaxed">
              ما یک فروشگاه آنلاین معتبر هستیم که با هدف تسهیل خریدهای
              درون‌برنامه‌ای و بین‌المللی برای کاربران ایرانی فعالیت می‌کنیم. در
              دنیای دیجیتال امروز، بسیاری از خدمات و خریدهای آنلاین به دلیل
              مشکلات پرداخت بین‌المللی و تحریم‌ها برای هموطنان عزیز
              غیرقابل‌دسترس هستند؛ اما آریانا مهاجر اینجا است تا راه‌حلی سریع،
              مطمئن و مقرون‌به‌صرفه ارائه دهد!
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--foreground)] mb-4">
              🛍 خدمات ما
            </h2>
            <Separator className="w-20 mx-auto bg-[color:var(--primary)]" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-[color:var(--border)] bg-[color:var(--card)] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-[color:var(--primary)]/10">
                        <service.icon className="h-6 w-6 text-[color:var(--primary)]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                        {service.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-[color:var(--primary)] mt-2 flex-shrink-0" />
                          <span className="text-[color:var(--muted-foreground)] leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              ✅ چرا آریانا مهاجر را انتخاب کنیم؟
            </h2>
            <Separator className="w-20 mx-auto bg-[color:var(--primary)]" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-6 rounded-lg bg-[color:var(--card)] border border-[color:var(--border)] shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-[color:var(--primary)]/10 flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-[color:var(--primary)]" />
                </div>
                <span className="text-[color:var(--foreground)] font-medium">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--foreground)] mb-4">
              📞 ارتباط با ما
            </h2>
            <p className="text-lg text-[color:var(--muted-foreground)] mb-6">
              برای هرگونه سوال یا راهنمایی، از طریق راه‌های زیر با تیم پشتیبانی
              ما در تماس باشید:
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
                    <div className="p-3 rounded-full bg-[color:var(--primary)]/10 w-fit mx-auto mb-4">
                      <method.icon className="h-6 w-6 text-[color:var(--primary)]" />
                    </div>
                    <h3 className="font-semibold text-[color:var(--foreground)] mb-2">
                      {method.label}
                    </h3>
                    <p className="text-[color:var(--muted-foreground)] mb-4">
                      {method.value}
                    </p>
                    <Button
                      asChild
                      className="w-full bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-[color:var(--primary-foreground)]"
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

      {/* CTA Section */}
      <motion.section
        className="py-16 md:py-20 bg-gradient-to-r from-[color:var(--primary)]/10 to-[color:var(--secondary)]/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--foreground)] mb-4">
              💡 آریانا مهاجر، همراه مطمئن شما در دنیای دیجیتال!
            </h2>
            <p className="text-lg text-[color:var(--muted-foreground)] mb-8 max-w-2xl mx-auto">
              با ما، خریدهای بین‌المللی را راحت، سریع و بدون دردسر تجربه کنید
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-[color:var(--primary-foreground)] px-8 py-3 text-lg"
            >
              <a href="/">شروع خرید</a>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default AboutUsView;
