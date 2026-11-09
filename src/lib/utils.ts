import type { Locale } from "./types";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function whatsappLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(price: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-KW", {
    style: "currency",
    currency: "KWD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-KW" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
