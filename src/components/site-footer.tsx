import Link from "next/link";
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import type { Locale, SiteSettings } from "@/lib/types";
import { InstagramIcon, MapPinIcon, PhoneIcon, StarIcon, WhatsAppIcon } from "./icons";

type FooterProps = {
  lang: Locale;
  dict: Dictionary;
  settings: SiteSettings;
};

export function SiteFooter({ lang, dict, settings }: FooterProps) {
  const year = new Date().getFullYear();
  const links = [
    { href: "", label: dict.nav.home },
    { href: "/classes", label: dict.nav.classes },
    { href: "/events", label: dict.nav.events },
    { href: "/shop", label: dict.nav.shop },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#080808]">
      <div className="pointer-events-none absolute -right-24 top-0 size-72 rounded-full bg-blood/10 blur-3xl" />
      <div className="container-x relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr_1fr]">
          <div>
            <Link href={`/${lang}`} className="flex items-center gap-3">
              <span className="relative grid size-12 place-items-center overflow-hidden rounded-sm bg-night/80 ring-1 ring-white/15">
                <Image
                  src="/images/logo.jpg"
                  alt="Fighters Without Fear"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </span>
              <span>
                <span className="display block text-2xl text-bone">Fighters Without Fear</span>
                <span className="text-[0.58rem] font-bold uppercase tracking-[0.32em] text-white/60">
                  Kuwait
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">{dict.footer.tagline}</p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-ember">
              {dict.footer.built}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-items-center border border-white/15 text-white/70 transition-colors hover:border-blood hover:text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-items-center border border-white/15 text-white/70 transition-colors hover:border-blood hover:text-white"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="size-4" />
              </a>
              <a
                href={settings.reviewUrl}
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-items-center border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold"
                aria-label="Google reviews"
              >
                <StarIcon className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-white/60">
              {dict.footer.quickLinks}
            </h3>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${lang}${link.href}`}
                    className="text-sm text-white/60 transition-colors hover:text-ember"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-white/60">
              {dict.footer.contact}
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-white/60">
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-white"
                >
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-[#25d366]" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-white"
                >
                  <MapPinIcon className="mt-0.5 size-4 shrink-0 text-ember" />
                  {lang === "en" ? settings.address_en : settings.address_ar}
                </a>
              </li>
              <li>
                <span className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 size-4 shrink-0 text-ember" />
                  {lang === "en" ? settings.hours_en : settings.hours_ar}
                </span>
              </li>
            </ul>
            <a
              href={settings.reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gold transition-colors hover:text-yellow-300"
            >
              <StarIcon className="size-3.5" />
              {dict.common.googleReview}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-[0.66rem] uppercase tracking-[0.16em] text-white/55 sm:flex-row sm:items-center">
          <p>
            © {year} {settings.name}. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/admin" className="transition-colors hover:text-white/70">
              {dict.common.admin}
            </Link>
            <span className="text-white/50">/</span>
            <Link href={`/${lang}/contact`} className="transition-colors hover:text-white/70">
              {dict.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
