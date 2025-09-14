import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price with proper thousand separators
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatPrice(price: any): string {
  return new Intl.NumberFormat("fa-IR").format(price);
}
