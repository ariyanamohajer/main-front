import { Fragment, useState } from "react";
import { NavLink, Link as RouterLink } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Wallet,
  CardSim,
  MoreHorizontal,
  Info,
  Shield,
  ListOrdered,
  UserPen,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Bottom tabs (RTL). Order is right ➜ left visually.
 * Center (emphasized) tab = Wallet.
 *
 * Adjust the routes if yours differ:
 *   /            خانه
 *   /products    محصولات
 *   /wallet      کیف پول
 *   /sim-services  خدمات سیم‌کارت
 */
const TABS = [
  { key: "more", label: "بیشتر", icon: MoreHorizontal, more: true },
  { key: "sim", to: "/sim", label: "سیم‌کارت", icon: CardSim },
  {
    key: "wallet",
    to: "/wallet",
    label: "کیف پول",
    icon: Wallet,
    emphasized: true,
  },
  { key: "products", to: "/products", label: "محصولات", icon: ShoppingBag },
  { key: "home", to: "/", label: "خانه", icon: Home },
];

function MobileNav() {
  const [openMore, setOpenMore] = useState(false);

  return (
    <Fragment>
      {/* ↓ z-index lowered so Sheet overlay can cover it */}
      <nav
        className={[
          "fixed bottom-0 left-0 right-0 z-40 md:hidden",
          "bg-[color:var(--popover)]/90 supports-[backdrop-filter]:backdrop-blur-xl",
          "border-t border-[color:var(--border)]",
          "shadow-[0_-1px_0_0_var(--border)]",
        ].join(" ")}
        role="navigation"
        aria-label="Mobile bottom navigation"
        dir="rtl"
      >
        <ul className="flex flex-row-reverse items-end px-2 py-2">
          {TABS.map(({ key, to, label, icon: Icon, emphasized, more }) => (
            <li key={key} className="flex-1 flex justify-center">
              {more ? (
                <Sheet open={openMore} onOpenChange={setOpenMore}>
                  <SheetTrigger asChild>
                    <button
                      className="flex flex-col items-center justify-center w-full text-xs px-2 py-1 rounded-md transition-colors text-foreground/70 hover:text-foreground"
                      aria-label="بیشتر"
                    >
                      <div
                        className="h-6 w-6 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="mt-1 leading-none">{label}</span>
                    </button>
                  </SheetTrigger>
                  {/* ↑ Sheet content raised above the nav; add bottom padding for safe area */}
                  <SheetContent
                    side="bottom"
                    className="z-[80] bg-[color:var(--popover)] border-t border-[color:var(--border)] pb-4 pb-[env(safe-area-inset-bottom)]"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-base">
                        پیوندهای بیشتر
                      </SheetTitle>
                    </SheetHeader>

                    <div className="py-3 space-y-2">
                      <RouterLink
                        to="/about"
                        onClick={() => setOpenMore(false)}
                        className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-[color:var(--accent)]"
                      >
                        <Info className="h-5 w-5" />
                        <span>درباره ما</span>
                      </RouterLink>

                      <RouterLink
                        to="/privacy"
                        onClick={() => setOpenMore(false)}
                        className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-[color:var(--accent)]"
                      >
                        <Shield className="h-5 w-5" />
                        <span>حریم خصوصی</span>
                      </RouterLink>

                      <RouterLink
                        to="/order"
                        onClick={() => setOpenMore(false)}
                        className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-[color:var(--accent)]"
                      >
                        <ListOrdered className="h-5 w-5" />
                        <span>سفارش ها</span>
                      </RouterLink>
                      <RouterLink
                        to="/order"
                        onClick={() => setOpenMore(false)}
                        className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-[color:var(--accent)]"
                      >
                        <UserPen className="h-5 w-5" />
                        <span>ویرایش پروفایل</span>
                      </RouterLink>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <NavLink
                  to={to!}
                  className={({ isActive }) =>
                    [
                      "flex flex-col items-center justify-center w-full text-xs px-2 py-1 rounded-md transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground",
                    ].join(" ")
                  }
                  aria-label={label}
                >
                  <div
                    className={[
                      "relative flex items-center justify-center",
                      emphasized
                        ? "h-12 w-12 -mt-8 rounded-full bg-primary text-primary-foreground shadow-lg"
                        : "h-6 w-6",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="mt-1 leading-none">{label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </Fragment>
  );
}

export default MobileNav;
