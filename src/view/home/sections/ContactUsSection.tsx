import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Replace with your image path
import ContactIllustration from "@/assets/images/contact-us.svg";
import { useContactUs } from "@/hooks/contact-us/useContactUs";
import { toast } from "sonner";

/** Validation schema for the contact form */
const schema = z.object({
  fullName: z.string().min(3, "نام را کامل وارد کنید"),
  phone: z
    .string()
    .min(8, "شماره تماس معتبر نیست")
    .regex(/^[0-9+\-\s()]+$/, "فقط اعداد و + - ( ) مجاز است"),
  message: z.string().min(10, "متن پیام حداقل ۱۰ کاراکتر باشد"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactUsSection() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "",  phone: "", message: "" },
    mode: "onChange",
  });

  const [submitted, setSubmitted] = React.useState(false);

  const contactUsMutation = useContactUs({
    onSuccess: () => {
      toast.success("پیام شما با موفقیت ارسال شد");
    },
    onError: (error) => {
      toast.error("خطا در ارسال پیام", {
        description: error?.message || "لطفاً دوباره تلاش کنید",
      });
    },
  });

  /** Simulated submit handler. Replace with your API call. */
  const onSubmit = async (values: FormValues) => {
    // setSubmitted(false);
    // TODO: call your API here
    contactUsMutation.mutate(values);

    setSubmitted(true);
    form.reset();
  };

  return (
    <section id="contact" className="relative py-16 md:py-24 bg-background">
      {/* Decorative ribbon (like your screenshot) */}
      <div className="pointer-events-none absolute -top-3 left-6 w-70 h-6 bg-primary">
        <div className="absolute -bottom-[14px] left-[70%] w-0 h-0 border-t-[14px] border-t-primary border-r-[28px] border-r-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Illustration (left on desktop, top on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="order-2 md:order-2 flex justify-center"
          >
            <img
              src={ContactIllustration}
              alt="ارتباط با ما"
              className="max-w-[520px] w-full h-auto select-none"
            />
          </motion.div>

          {/* Form (right on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="order-1 md:order-1"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-center md:text-right mb-6">
              ارتباط با ما
            </h2>

            <Card className="p-4 md:p-6 bg-card border-border">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Full name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نام و نام خانوادگی</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="نام و نام خانوادگی"
                            className="text-right"
                            autoComplete="name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  {/* <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>آدرس ایمیل</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="example@email.com"
                            className="text-right"
                            autoComplete="email"
                            inputMode="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>شماره تلفن</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="09xxxxxxxxx"
                            className="text-right"
                            inputMode="tel"
                            autoComplete="tel"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>متن پیام</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="متن پیام..."
                            className="min-h-[120px] text-right resize-y"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-40 mx-auto md:mx-0 bg-destructive text-white hover:bg-destructive/90"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting
                        ? "در حال ارسال..."
                        : "ارسال"}
                    </Button>
                  </div>

                  {/* Success message */}
                  {submitted && (
                    <p
                      className="text-sm text-green-600 dark:text-green-400 mt-2"
                      role="status"
                      aria-live="polite"
                    >
                      پیام شما با موفقیت ارسال شد.
                    </p>
                  )}
                </form>
              </Form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
