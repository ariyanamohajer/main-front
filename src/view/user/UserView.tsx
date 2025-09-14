import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Save,
  User as UserIcon,
  Phone,
} from "lucide-react";



import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateUserInfo } from "@/hooks/auth/useUpdateUserInfo";
import { useChangePass } from "@/hooks/auth/useChangePassUser";
import { changePasswordSchema, updatePersonalInfoSchema, type ChangePasswordFormData, type UpdatePersonalInfoFormData } from "@/validation";
import { useGetUser } from "@/hooks";

function initials(fName?: string | null, lName?: string | null) {
  const f = (fName ?? "").trim();
  const l = (lName ?? "").trim();
  return (f[0] ?? "") + (l[0] ?? "");
}

function PhoneRow({ phone }: { phone?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Phone className="size-4" />
      <span dir="ltr">{phone || "—"}</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-10 w-full rounded-md bg-muted" />
      <div className="h-10 w-full rounded-md bg-muted" />
      <div className="h-10 w-40 rounded-md bg-muted" />
    </div>
  );
}

export default function UserView() {
  const { data, isLoading, isError } = useGetUser();
  const user = data?.result.user;

  const updateMutation = useUpdateUserInfo({
    onSuccess: (res) => {
      toast.success(res.message || "اطلاعات با موفقیت بروزرسانی شد");
    },
    onError: (err) => {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err.response?.data as any)?.message ||
        err.message ||
        "خطا در بروزرسانی اطلاعات";
      toast.error(message);
    },
  });

  const changePassMutation = useChangePass({
    onSuccess: (res) => {
      toast.success(res.message || "رمز عبور با موفقیت تغییر کرد");
      changePassForm.reset({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    },
    onError: (err) => {
      const message =
      
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err.response?.data as any)?.message ||
        err.message ||
        "خطا در تغییر رمز عبور";
      toast.error(message);
    },
  });

  // --- Personal Info Form ---
  const personalForm = useForm<UpdatePersonalInfoFormData>({
    resolver: zodResolver(updatePersonalInfoSchema),
    defaultValues: {
      fName: "",
      lName: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      personalForm.reset({
        fName: user.fName ?? "",
        lName: user.lName ?? "",
      });
    }
  }, [user, personalForm]);

  const onSubmitPersonal = (values: UpdatePersonalInfoFormData) => {
    updateMutation.mutate({ fName: values.fName, lName: values.lName });
  };

  // --- Change Password Form ---
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const changePassForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange",
  });

  const onSubmitChangePass = (values: ChangePasswordFormData) => {
    changePassMutation.mutate({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6" lang="fa" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">پروفایل کاربری</h1>
          <p className="text-muted-foreground">
            اطلاعات شخصی خود را ویرایش کنید و رمز عبور را به‌روزرسانی نمایید.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="size-14">
            <AvatarImage src={user?.avatar ?? undefined} alt="avatar" />
            <AvatarFallback className="font-semibold">
              {initials(user?.fName, user?.lName) || (
                <UserIcon className="size-5" />
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">
              {(user?.fName || "") + " " + (user?.lName || "") || "کاربر"}
            </span>
            <PhoneRow phone={user?.phone} />
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Personal Info Card */}
        <Card className="border">
          <CardHeader>
            <CardTitle>اطلاعات شخصی</CardTitle>
            <CardDescription>
              نام و نام خانوادگی خود را ویرایش کنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <SkeletonRow />
            ) : isError ? (
              <p className="text-sm text-destructive">
                خطا در دریافت اطلاعات کاربر. لطفاً دوباره تلاش کنید.
              </p>
            ) : (
              <Form {...personalForm}>
                <form
                  onSubmit={personalForm.handleSubmit(onSubmitPersonal)}
                  className="space-y-4"
                >
                  <FormField
                    control={personalForm.control}
                    name="fName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نام</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: علی" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="lName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نام خانوادگی</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: محمدی" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="px-0">
                    <Button
                      type="submit"
                      className="ms-auto"
                      disabled={
                        updateMutation.isPending ||
                        !personalForm.formState.isDirty
                      }
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          در حال ذخیره…
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 size-4" />
                          ذخیره تغییرات
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="border">
          <CardHeader>
            <CardTitle>تغییر رمز عبور</CardTitle>
            <CardDescription>
              رمز عبور خود را با امنیت بیشتر به‌روزرسانی کنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...changePassForm}>
              <form
                onSubmit={changePassForm.handleSubmit(onSubmitChangePass)}
                className="space-y-4"
              >
                <FormField
                  control={changePassForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز عبور فعلی</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showOld ? "text" : "password"}
                            autoComplete="current-password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 left-3 my-auto"
                            onClick={() => setShowOld((s) => !s)}
                            aria-label={showOld ? "مخفی کردن" : "نمایش"}
                          >
                            {showOld ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={changePassForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز عبور جدید</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNew ? "text" : "password"}
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 left-3 my-auto"
                            onClick={() => setShowNew((s) => !s)}
                            aria-label={showNew ? "مخفی کردن" : "نمایش"}
                          >
                            {showNew ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={changePassForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تکرار رمز عبور جدید</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirm ? "text" : "password"}
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 left-3 my-auto"
                            onClick={() => setShowConfirm((s) => !s)}
                            aria-label={showConfirm ? "مخفی کردن" : "نمایش"}
                          >
                            {showConfirm ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="px-0">
                  <Button
                    type="submit"
                    className="ms-auto"
                    disabled={changePassMutation.isPending}
                  >
                    {changePassMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        در حال تغییر…
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 size-4" />
                        تغییر رمز عبور
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
