"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CloseIcon,
  InstagramIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  StarIcon,
  WhatsAppIcon,
} from "./icons";

type HeaderProps = {
  lang: Locale;
  dict: Dictionary;
  settings: SiteSettings;
};

const navItems = [
  { href: "", key: "home" },
  { href: "/classes", key: "classes" },
  { href: "/events", key: "events" },
  { href: "/shop", key: "shop" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader({ lang, dict, settings }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const otherLang: Locale = lang === "en" ? "ar" : "en";
  const rest = pathname?.replace(/^\/(en|ar)/, "") || "";
  const switchHref = `/${otherLang}${rest}`;

  const isActive = (href: string) => {
    const full = `/${lang}${href}`;
    if (href === "") return pathname === full;
    return pathname?.startsWith(full);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="hidden border-b border-white/10 bg-black/70 backdrop-blur-md lg:block">
        <div className="container-x flex h-9 items-center justify-between text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/55">
          <div className="flex items-center gap-6">
            <a
              href={settings.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <MapPinIcon className="size-3.5 text-ember" />
              {lang === "en" ? settings.address_en : settings.address_ar}
            </a>
            <a
              href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <PhoneIcon className="size-3.5 text-ember" />
              {settings.phone}
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={settings.reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <StarIcon className="size-3.5 text-gold" />
              {dict.common.googleReview}
            </a>
            <a
              href={settings.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <InstagramIcon className="size-3.5" />
              @fwf_club
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-white/10 bg-night/90 shadow-[0_10px_40px_rgba(0,0,0,.45)] backdrop-blur-xl"
            : "border-transparent bg-gradient-to-b from-black/75 to-transparent",
        )}
      >
        <div className="container-x flex h-[4.4rem] items-center justify-between gap-4">
          <Link href={`/${lang}`} className="group flex items-center gap-3">
            <span className="relative grid size-11 place-items-center overflow-hidden rounded-sm bg-night/80 ring-1 ring-white/15 transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.jpg"
                alt="Fighters Without Fear"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="display block text-[1.35rem] tracking-[0.06em] text-bone">
                Fighters Without Fear
              </span>
              <span className="mt-1 block text-[0.55rem] font-bold uppercase tracking-[0.3em] text-white/60">
                Kuwait · Since 2016
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${lang}${item.href}`}
                className={cn(
                  "relative px-3.5 py-2 text-[0.7rem] font-bold uppercase tracking-[0.17em] transition-colors",
                  isActive(item.href) ? "text-white" : "text-white/55 hover:text-white",
                )}
              >
                {dict.nav[item.key]}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-blood" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={switchHref}
              className="hidden items-center gap-1.5 border border-white/15 px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white/75 transition-colors hover:border-white/40 hover:text-white sm:flex"
              lang={otherLang}
            >
              {dict.common.language}
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary hidden !min-h-10 !px-4 !py-2 md:inline-flex"
            >
              <WhatsAppIcon className="size-4" />
              {dict.common.bookNow}
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid size-11 place-items-center border border-white/15 text-white transition-colors hover:border-white/40 lg:hidden"
              aria-label={open ? dict.common.close : dict.common.menu}
              aria-expanded={open}
            >
              {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-[4.4rem] z-40 bg-night/98 backdrop-blur-xl transition-all duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav className="container-x flex h-full flex-col py-8" aria-label="Mobile navigation">
          <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
            {navItems.map((item, index) => (
              <Link
                key={item.key}
                href={`/${lang}${item.href}`}
                className="flex items-center justify-between py-5"
                onClick={() => setOpen(false)}
              >
                <span
                  className={cn(
                    "display text-4xl tracking-wide",
                    isActive(item.href) ? "text-ember" : "text-bone",
                  )}
                >
                  {dict.nav[item.key]}
                </span>
                <span className="text-xs font-bold tracking-[0.2em] text-white/55">
                  0{index + 1}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-3">
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp w-full"
            >
              <WhatsAppIcon className="size-4" />
              {dict.common.whatsapp}
            </a>
            <Link
              href={switchHref}
              className="btn btn-outline w-full"
              lang={otherLang}
              onClick={() => setOpen(false)}
            >
              {dict.common.language}
            </Link>
          </div>

          <div className="mt-auto space-y-3 pt-8 text-sm text-white/55">
            <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3">
              <PhoneIcon className="size-4 text-ember" /> {settings.phone}
            </a>
            <a href={settings.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3">
              <InstagramIcon className="size-4 text-ember" /> @fwf_club
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
