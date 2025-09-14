import { z } from "zod";

// Register validation schema
export const registerSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره تلفن الزامی است")
    .regex(/^09\d{9}$/, "شماره تلفن معتبر وارد کنید (مثال: ۰۹۱۲۱۲۳۴۵۶۷)"),
  fName: z
    .string()
    .min(1, "نام الزامی است")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد"),
  lName: z
    .string()
    .min(1, "نام خانوادگی الزامی است")
    .min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام خانوادگی نباید بیشتر از ۵۰ کاراکتر باشد"),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است")
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  //   "رمز عبور باید شامل حروف کوچک، بزرگ، عدد و علامت باشد"
  // ),
});

// Login validation schema (phone-only)
export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره تلفن الزامی است")
    .regex(/^09\d{9}$/, "شماره تلفن معتبر وارد کنید (مثال: ۰۹۱۲۱۲۳۴۵۶۷)"),
});

// OTP verification validation schema (5 digits)
export const otpSchema = z.object({
  code: z
    .string()
    .min(1, "کد تایید الزامی است")
    .length(5, "کد تایید باید ۵ رقم باشد")
    .regex(/^\d{5}$/, "کد تایید فقط باید شامل عدد باشد"),
});

// Verify code validation schema (for API) - password optional for login flow
export const verifyCodeSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره تلفن الزامی است")
    .regex(/^09\d{9}$/, "شماره تلفن معتبر نیست"),
  code: z
    .string()
    .min(1, "کد تایید الزامی است")
    .length(5, "کد تایید باید ۵ رقم باشد")
    .regex(/^\d{5}$/, "کد تایید فقط باید شامل عدد باشد"),
  password: z.string().optional(), // Optional for login flow
});




export const updatePersonalInfoSchema = z.object({
  fName: z
    .string()
    .min(1, "نام الزامی است")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد"),
  lName: z
    .string()
    .min(1, "نام خانوادگی الزامی است")
    .min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام خانوادگی نباید بیشتر از ۵۰ کاراکتر باشد"),
});

export type UpdatePersonalInfoFormData = z.infer<
  typeof updatePersonalInfoSchema
>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
    newPassword: z
      .string()
      .min(1, "رمز عبور جدید الزامی است")
      .min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد"),
    confirmNewPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "تکرار رمز عبور با رمز عبور جدید یکسان نیست",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Infer types from schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
