import { Link, NavLink } from "react-router-dom";
import ArianaLogo from "../../assets/images/ariyana-logo.svg";
import MobileNav from "./components/MobileNav"; // bottom bar
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context";
import { useGetUser } from "@/hooks/auth";
import { LogIn, LogOut, UserPlus, Wallet, ListOrdered, UserPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/constant/nav.config";
import { SectionLink } from "@/components/common/SectionLink";
import type { UserInfo } from "@/types";
import { useWalletBalance } from "@/hooks";
import { formatPrice } from "@/lib/utils";

function UserDropdown({
  profile,
  onLogout,
  showWallet = true, // desktop: true, mobile: false
}: {
  profile?: UserInfo;
  onLogout: () => void;
  showWallet?: boolean;
}) {
  const {data, isPending, isError}  = useWalletBalance();
  return (
    <DropdownMenu modal={false} dir="rtl">
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={profile?.avatar || ""} />
          <AvatarFallback>
            {profile?.fName?.[0] || profile?.phone?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="z-[10000] min-w-[200px] bg-[color:var(--popover)] border-[color:var(--border)] shadow-lg"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-[color:var(--primary)] font-semibold px-3 py-2">
          {(profile?.fName || "").toString()}{" "}
          {(profile?.lName || "").toString()}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[color:var(--border)]" />

        {profile?.phone && (
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-[color:var(--muted-foreground)] hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)] cursor-default">
            <span>تلفن:</span>
            <span className="font-medium text-[color:var(--foreground)]">
              {profile.phone}
            </span>
          </DropdownMenuItem>
        )}

        {profile?.role && (
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-[color:var(--muted-foreground)] hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)] cursor-default">
            <span>نقش:</span>
            <span className="font-medium text-[color:var(--foreground)]">
              {profile.role === "UnionUser" ? "کاربر عادی" : "کاربر ادمین"}
            </span>
          </DropdownMenuItem>
        )}

        {/* Wallet: desktop only (hidden on mobile) */}
        {showWallet && (
          <>
            <DropdownMenuSeparator className="hidden md:block bg-[color:var(--border)]" />
            <Link to="/wallet" className="hidden md:block">
              <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-[color:var(--primary)]/10 hover:text-[color:var(--primary)] transition-colors">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 mr-2" />
                    <span className="text-muted-foreground">کیف پول</span>
                  </div>

                  {/* Right side (amount or loading/error) */}
                  <div className="font-medium">
                    {isPending ? (
                      // Skeleton loader
                      <div className="w-16 h-4 bg-muted-foreground/20 rounded animate-pulse" />
                    ) : isError ? (
                      <span className="text-destructive">خطا</span>
                    ) : (
                      <span>
                        {formatPrice(data?.result?.totalAmount)} تومان
                      </span>
                    )}
                </div>
              </DropdownMenuItem>
            </Link>
            <Link to="/order" className="hidden md:block">
              <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-[color:var(--primary)]/10 hover:text-[color:var(--primary)] transition-colors">
                <ListOrdered className="h-4 w-4 mr-2" />
                سفارش ها
              </DropdownMenuItem>
            </Link>
            <Link to="/user" className="hidden md:block">
              <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-[color:var(--primary)]/10 hover:text-[color:var(--primary)] transition-colors">
                <UserPen className="h-4 w-4 mr-2" />
                ویرایش پروفایل
              </DropdownMenuItem>
            </Link>
          </>
        )}

        <DropdownMenuSeparator className="bg-[color:var(--border)]" />

        <DropdownMenuItem
          className="cursor-pointer px-3 py-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          خروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { data } = useGetUser({ enabled: isAuthenticated });
  const profile = data?.result?.user;

  const navClasses = (active: boolean) =>
    [
      "px-3 py-2 rounded-lg transition-colors",
      "text-sm md:text-[15px]",
      active
        ? "text-primary bg-primary/10"
        : "text-foreground/90 hover:text-primary hover:bg-primary/10",
    ].join(" ");

  return (
    <>
      {/* Sticky desktop header (and a minimal mobile top bar just for logo + auth / user menu) */}
      <header
        className={[
          "sticky top-0 left-0 right-0 z-50",
          "bg-[color:var(--header-bg)] supports-[backdrop-filter]:backdrop-blur-md",
          "border-b border-[color:var(--header-divider)]",
          "shadow-[0_1px_0_0_var(--header-divider)]",
        ].join(" ")}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Mobile top bar */}
          <div className="flex md:hidden items-center justify-between py-3">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src={ArianaLogo}
                  alt="ariana-logo"
                  className="h-7 sm:h-8"
                />
              </Link>
            </div>

            {/* Right side: auth buttons OR user menu */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <UserDropdown
                  profile={profile}
                  onLogout={logout}
                  showWallet={false}
                />
              ) : (
                <>
                  <Link to="/auth/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      ورود
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button
                      variant="default"
                      size="sm"
                      className="text-white hover:text-primary hover:bg-primary/20"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      ثبت‌نام
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between py-3">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={ArianaLogo} alt="ariana-logo" className="h-12" />
              </Link>
            </div>

            {/* Center nav */}
            <nav className="flex items-center gap-4 lg:gap-6">
              {NAV_ITEMS.map((item) => {
                if (item.type === "route") {
                  return (
                    <NavLink
                      key={item.key}
                      to={item.to}
                      className={({ isActive }) => navClasses(isActive)}
                    >
                      {item.label}
                    </NavLink>
                  );
                }
                return (
                  <SectionLink key={item.key} sectionId={item.sectionId}>
                    {item.label}
                  </SectionLink>
                );
              })}
            </nav>

            {/* Right actions */}
            {isAuthenticated ? (
              <UserDropdown
                profile={profile}
                onLogout={logout}
                showWallet={true}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    ورود
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button
                    variant="default"
                    size="sm"
                    className="text-white hover:text-primary hover:bg-primary/20"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    ثبت‌نام
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom navbar (fixed) */}
      <MobileNav />
    </>
  );
}

export default Header;
