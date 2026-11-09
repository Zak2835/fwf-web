import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import {
  ClockIcon,
  GoogleIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { getDb } from "@/lib/db";
import { getDictionary, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type ContactPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isArabic = lang === "ar";
  return {
    title: isArabic ? "اتصل بنا" : "Contact",
    description: isArabic
      ? "تواصل مع نادي FWF بالكويت — واتساب، الهاتف، الموقع وساعات العمل."
      : "Get in touch with FWF Club Kuwait — WhatsApp, phone, location and opening hours.",
    alternates: { canonical: `/${lang}/contact` },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const db = await getDb();
  const { settings } = db;
  const address = locale === "ar" ? settings.address_ar : settings.address_en;
  const hours = locale === "ar" ? settings.hours_ar : settings.hours_en;

  return (
    <>
      <section className="relative overflow-hidden pt-36">
        <Image
          src="/images/u-boxing2.jpg"
          alt="FWF training"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-black/55" />
        <div className="container-x relative z-10 pb-14 pt-10 md:pb-20">
          <p className="eyebrow">{locale === "ar" ? "تواصل معنا" : "Get in touch"}</p>
          <h1 className="display mt-4 text-6xl text-bone md:text-8xl">{dict.contact.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">{dict.contact.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal>
              <p className="eyebrow">{dict.contact.formTitle}</p>
              <h2 className="display mt-3 text-4xl text-bone md:text-6xl">{dict.contact.formSubtitle}</h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="card mt-7 p-5 md:p-7">
                <ContactForm lang={locale} dict={dict} whatsapp={settings.whatsapp} />
              </div>
            </Reveal>
          </div>

          <div className="space-y-4">
            <Reveal delay={80}>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="card flex items-start gap-4 p-5 transition-colors hover:border-[#25d366]/50"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-[#25d366]/10 text-[#25d366]">
                  <WhatsAppIcon className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/55">
                    {dict.common.whatsapp}
                  </span>
                  <span className="mt-1 block text-lg font-extrabold text-bone" dir="ltr">
                    {settings.phone}
                  </span>
                  <span className="mt-1 block text-xs text-white/60">
                    {locale === "ar" ? "أسرع طريقة للحجز والاستفسار" : "Fastest way to book or ask"}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={120}>
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="card flex items-start gap-4 p-5 transition-colors hover:border-blood/50"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-blood/10 text-ember">
                  <MapPinIcon className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/55">
                    {dict.contact.visit}
                  </span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-bone">
                    {address}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={160}>
              <div className="card flex items-start gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-white/5 text-white/70">
                  <ClockIcon className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/55">
                    {dict.common.hours}
                  </span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-bone">{hours}</span>
                </span>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <a
                href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                className="card flex items-start gap-4 p-5 transition-colors hover:border-white/30"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-white/5 text-white/70">
                  <PhoneIcon className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/55">
                    {dict.common.callUs}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-bone" dir="ltr">
                    {settings.phone}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={240}>
              <div className="card p-5">
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/55">
                  {dict.contact.follow}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline !min-h-10 !px-4 !py-2 !text-[0.6rem]"
                  >
                    <InstagramIcon className="size-4" />
                    @fwf_club
                  </a>
                  <a
                    href={settings.reviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline !min-h-10 !px-4 !py-2 !text-[0.6rem]"
                  >
                    <GoogleIcon className="size-4" />
                    {dict.common.googleReview}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#090909] py-16">
        <div className="container-x">
          <Reveal>
            <div className="grid overflow-hidden rounded-sm border border-white/10 lg:grid-cols-[1fr_1.4fr]">
              <div className="flex flex-col justify-center p-7 md:p-10">
                <p className="eyebrow">{dict.contact.reviewTitle}</p>
                <h2 className="display mt-4 text-4xl text-bone md:text-5xl">{dict.contact.reviewBody}</h2>
                <div className="mt-5 flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="size-5" />
                  ))}
                </div>
                <a
                  href={settings.reviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary mt-6 self-start"
                >
                  <GoogleIcon className="size-4" />
                  {dict.common.googleReview}
                </a>
              </div>
              <div className="min-h-[20rem]">
                <iframe
                  title="FWF Club location"
                  src="https://maps.google.com/maps?q=Fighters%20Without%20Fear%20Kuwait&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="h-full min-h-[20rem] w-full grayscale-[.35] contrast-[1.1]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
