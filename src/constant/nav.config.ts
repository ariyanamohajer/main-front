// src/navigation/nav.config.ts
export type NavRoute = {
  type: "route";
  key: string;
  label: string;
  to: string;
  external?: boolean;
};
export type NavSection = {
  type: "section";
  key: string;
  label: string;
  sectionId: string;
};
export type NavItem = NavRoute | NavSection;

export const NAV_ITEMS: NavItem[] = [
  { type: "route", key: "home", label: "خانه", to: "/" },
  { type: "route", key: "about", label: "درباره ما", to: "/about" },
  { type: "route", key: "privacy", label: "حریم خصوصی", to: "/privacy" },
  {
    type: "route",
    key: "products",
    label: "محصولات",
    to: "https://panel.arianamohajer.ir/products",
    external: true,
  },
  {
    type: "route",
    key: "sim",
    label: "سیم کارت",
    to: "https://panel.arianamohajer.ir/sim",
    external: true,
  },
];
