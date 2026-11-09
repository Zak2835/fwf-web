import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import {
  ArrowIcon,
  ClockIcon,
  GoogleIcon,
  MapPinIcon,
  ShieldIcon,
  StarIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { getDb } from "@/lib/db";
import { getDictionary, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { formatDate, formatPrice, whatsappLink } from "@/lib/utils";

type HomeProps = {
  params: Promise<{ lang: string }>;
};

const disciplineImages = [
  "/images/class-boxing.jpg",
  "/images/class-muaythai.jpg",
  "/images/class-mma.jpg",
  "/images/class-kickboxing.jpg",
  "/images/class-kajukenbo.jpg",
  "/images/class-fitness.jpg",
];

export default async function HomePage({ params }: HomeProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const db = await getDb();
  const content = db.content[locale];
  const { settings } = db;
  const classes = db.classes.slice(0, 4);
  const events = db.events.filter((event) => event.status === "upcoming").slice(0, 3);
  const products = db.products.slice(0, 4);
  const marquee = [
    "Boxing",
    "MMA",
    "Muay Thai",
    "Kickboxing",
    "Kajukenbo",
    "Fitness",
    "Jiu Jitsu",
    "Shidokan",
  ];

  return (
    <>
      <section className="grain relative flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src={content.heroImage}
          alt="FWF fighter training in the gym"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(225,6,0,.24),transparent_32rem)]" />
        <Image
          src="/images/logo.jpg"
          alt=""
          aria-hidden
          width={320}
          height={320}
          className="pointer-events-none absolute -bottom-10 end-[-2rem] z-0 select-none opacity-[0.07] blur-[1px] md:end-8 md:size-[22rem]"
          priority={false}
        />
        <div className="container-x relative z-10 pb-14 pt-36 md:pb-20">
          <div className="max-w-5xl">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="relative grid size-14 place-items-center overflow-hidden rounded-sm bg-night/80 ring-1 ring-white/15 shadow-[0_0_40px_rgba(225,6,0,.18)]">
                  <Image
                    src="/images/logo.jpg"
                    alt="Fighters Without Fear"
                    width={56}
                    height={56}
                    className="object-contain"
                    priority
                  />
                </span>
                <p className="eyebrow">{content.heroEyebrow}</p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display mt-5 text-[clamp(4rem,13vw,11.5rem)] text-bone drop-shadow-[0_10px_50px_rgba(0,0,0,.55)]">
                {content.heroTitle}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg md:leading-8">
                {content.heroSubtitle}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${locale}/classes`} className="btn btn-primary !min-h-12 !px-6">
                  {content.heroCta}
                  <ArrowIcon className="size-4" />
                </Link>
                <a
                  href={whatsappLink(
                    settings.whatsapp,
                    locale === "ar"
                      ? "مرحباً FWF! أرغب في حجز حصة."
                      : "Hello FWF! I would like to book a class.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp !min-h-12 !px-6"
                >
                  <WhatsAppIcon className="size-4" />
                  {content.heroCtaSecondary}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={320}>
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4">
              {dict.home.stats.map((stat) => (
                <div key={stat.label} className="bg-black/60 px-5 py-5 backdrop-blur-sm">
                  <p className="display text-3xl text-bone md:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="absolute bottom-6 hidden items-center gap-3 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-white/60 end-8 lg:flex">
          <span className="h-10 w-px bg-gradient-to-b from-transparent to-white/40" />
          {dict.home.scroll}
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/10 bg-blood py-3">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[...marquee, ...marquee].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-8 text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-white"
            >
              {item}
              <span className="size-1.5 rotate-45 bg-black/50" />
            </span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10">
              <Image
                src={content.aboutImage}
                alt="FWF training session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-3 border border-white/10 bg-night/95 p-5 shadow-2xl backdrop-blur md:-right-6">
              <p className="display text-4xl text-ember">18.8K</p>
              <p className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/50">
                {locale === "ar" ? "مجتمع إنستغرام" : "Instagram community"}
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow">{locale === "ar" ? "عن النادي" : "About the club"}</p>
              <h2 className="display mt-5 text-5xl leading-[.92] text-bone md:text-7xl">
                {content.aboutTitle}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/60">{content.aboutBody}</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: ShieldIcon,
                    title: locale === "ar" ? "مدربون معتمدون" : "Certified coaches",
                    body:
                      locale === "ar"
                        ? "تدريب آمن ومنظم لكل المستويات"
                        : "Safe, structured training for every level",
                  },
                  {
                    icon: ClockIcon,
                    title: locale === "ar" ? "مرونة في الحضور" : "Flexible timetable",
                    body:
                      locale === "ar"
                        ? "حصص صباحية ومسائية طوال الأسبوع"
                        : "Morning and evening classes all week",
                  },
                ].map((item) => (
                  <div key={item.title} className="card p-5">
                    <item.icon className="size-6 text-ember" />
                    <p className="mt-3 text-sm font-extrabold text-bone">{item.title}</p>
                    <p className="mt-1 text-xs leading-6 text-white/60">{item.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${locale}/classes`} className="btn btn-primary">
                  {dict.common.viewAll} {dict.nav.classes}
                  <ArrowIcon className="size-4" />
                </Link>
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  @fwf_club
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section border-t border-white/10 bg-[#090909]">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <Reveal>
              <p className="eyebrow">{locale === "ar" ? "التخصصات" : "Disciplines"}</p>
              <h2 className="display mt-4 text-5xl text-bone md:text-7xl">
                {content.disciplinesTitle}
              </h2>
              <p className="mt-3 text-sm text-white/50">{content.disciplinesSubtitle}</p>
            </Reveal>
            <Reveal delay={100}>
              <Link href={`/${locale}/classes`} className="btn btn-outline">
                {dict.common.viewAll}
                <ArrowIcon className="size-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dict.home.disciplines.map((discipline, index) => (
              <Reveal key={discipline.name} delay={index * 60}>
                <Link
                  href={`/${locale}/classes`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-sm border border-white/10"
                >
                  <Image
                    src={disciplineImages[index]}
                    alt={discipline.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="display text-4xl text-bone">{discipline.name}</h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                          {discipline.desc}
                        </p>
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center border border-white/25 text-white transition-colors group-hover:border-blood group-hover:bg-blood">
                        <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <Reveal>
              <p className="eyebrow">{locale === "ar" ? "الجدول" : "Schedule"}</p>
              <h2 className="display mt-4 text-5xl text-bone md:text-7xl">{content.scheduleTitle}</h2>
              <p className="mt-3 text-sm text-white/50">{content.scheduleSubtitle}</p>
            </Reveal>
            <Reveal delay={100}>
              <Link href={`/${locale}/classes`} className="btn btn-primary">
                {dict.common.bookClass}
                <ArrowIcon className="size-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {classes.map((item, index) => (
              <Reveal key={item.id} delay={index * 50}>
                <div className="group grid gap-4 py-6 transition-colors hover:bg-white/[0.025] md:grid-cols-[7rem_1fr_auto] md:items-center md:gap-8">
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ember">
                      {locale === "ar" ? item.day_ar : item.day_en}
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-bone">{item.time}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-extrabold text-bone">
                        {locale === "ar" ? item.name_ar : item.name_en}
                      </h3>
                      <span className="border border-white/15 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/60">
                        {item.discipline}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/60">
                      {dict.common.coach}: {item.coach} · {item.duration} ·{" "}
                      {formatPrice(item.price, locale)} {dict.common.perClass}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/classes`}
                    className="btn btn-outline !min-h-9 !px-4 !py-2 text-[0.62rem]"
                  >
                    {dict.common.bookNow}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-y border-white/10 bg-[#090909]">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <Reveal>
              <p className="eyebrow">{locale === "ar" ? "الفعاليات" : "Events"}</p>
              <h2 className="display mt-4 text-5xl text-bone md:text-7xl">{content.eventsTitle}</h2>
              <p className="mt-3 text-sm text-white/50">{content.eventsSubtitle}</p>
            </Reveal>
            <Reveal delay={100}>
              <Link href={`/${locale}/events`} className="btn btn-outline">
                {dict.common.viewAll}
                <ArrowIcon className="size-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {events.map((event, index) => (
              <Reveal key={event.id} delay={index * 70}>
                <Link
                  href={`/${locale}/events`}
                  className="group block overflow-hidden rounded-sm border border-white/10 bg-black/20"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={locale === "ar" ? event.title_ar : event.title_en}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="absolute left-4 top-4 bg-blood px-3 py-2 text-center">
                      <p className="display text-3xl leading-none text-white">
                        {new Date(`${event.date}T12:00:00`).getDate()}
                      </p>
                      <p className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white">
                        {new Intl.DateTimeFormat(locale === "ar" ? "ar-KW" : "en-GB", {
                          month: "short",
                        }).format(new Date(`${event.date}T12:00:00`))}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ember">
                      {formatDate(event.date, locale)} · {event.time}
                    </p>
                    <h3 className="mt-2 text-xl font-extrabold text-bone">
                      {locale === "ar" ? event.title_ar : event.title_en}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
                      {locale === "ar" ? event.desc_ar : event.desc_en}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <Reveal>
              <p className="eyebrow">{locale === "ar" ? "المتجر" : "Shop"}</p>
              <h2 className="display mt-4 text-5xl text-bone md:text-7xl">{content.shopTitle}</h2>
              <p className="mt-3 text-sm text-white/50">{content.shopSubtitle}</p>
            </Reveal>
            <Reveal delay={100}>
              <Link href={`/${locale}/shop`} className="btn btn-outline">
                {dict.common.viewAll}
                <ArrowIcon className="size-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-10">
            {products.length === 0 ? (
              <div className="grid place-items-center border border-white/10 bg-[#0b0b0b] p-12 text-center">
                <p className="eyebrow">{locale === "ar" ? "المتجر" : "Shop"}</p>
                <p className="mt-4 display text-4xl text-bone">
                  {locale === "ar" ? "قريباً" : "Coming soon"}
                </p>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
                  {dict.shop.comingSoon}
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product, index) => (
                  <Reveal key={product.id} delay={index * 60}>
                    <Link href={`/${locale}/shop`} className="group block">
                      <div className="relative aspect-square overflow-hidden rounded-sm border border-white/10 bg-smoke">
                        <Image
                          src={product.image}
                          alt={locale === "ar" ? product.name_ar : product.name_en}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.58rem] font-bold uppercase tracking-[0.15em] text-white/55">
                            {product.category}
                          </p>
                          <h3 className="mt-1 text-sm font-extrabold text-bone">
                            {locale === "ar" ? product.name_ar : product.name_en}
                          </h3>
                        </div>
                        <p className="text-sm font-extrabold text-ember">
                          {formatPrice(product.price, locale)}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section border-t border-white/10 bg-[#090909]">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <p className="eyebrow">{locale === "ar" ? "آراء المقاتلين" : "Fighter reviews"}</p>
              <h2 className="display mt-4 text-5xl text-bone md:text-7xl">{content.reviewsTitle}</h2>
              <p className="mt-3 text-sm text-white/50">{content.reviewsSubtitle}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {db.reviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 70}>
                <figure className="card flex h-full flex-col p-6">
                  <div className="flex gap-1 text-gold">
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <StarIcon key={starIndex} className="size-4" />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 text-sm leading-7 text-white/65">
                    “{locale === "ar" ? review.text_ar : review.text_en}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                    <span className="grid size-9 place-items-center rounded-full bg-blood/15 text-xs font-extrabold text-ember">
                      {review.name.slice(0, 1)}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">
                      {review.name}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-9 flex justify-center">
              <a
                href={settings.reviewUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                <GoogleIcon className="size-4" />
                {dict.home.reviewCta}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <Image
          src={content.ctaImage}
          alt="Train at FWF"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/72" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(225,6,0,.28),transparent_34rem)]" />
        <div className="container-x relative z-10">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow">{locale === "ar" ? "ابدأ اليوم" : "Start today"}</p>
              <h2 className="display mt-5 text-5xl text-bone md:text-8xl">{content.ctaTitle}</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/65">{content.ctaBody}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${locale}/classes`} className="btn btn-primary !min-h-12 !px-6">
                  {dict.common.bookClass}
                  <ArrowIcon className="size-4" />
                </Link>
                <a
                  href={whatsappLink(
                    settings.whatsapp,
                    locale === "ar"
                      ? "مرحباً FWF! أرغب في حجز حصة تجريبية."
                      : "Hello FWF! I would like to book a trial class.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp !min-h-12 !px-6"
                >
                  <WhatsAppIcon className="size-4" />
                  {dict.common.whatsapp}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">{locale === "ar" ? "الموقع" : "Location"}</p>
            <h2 className="display mt-4 text-5xl text-bone md:text-7xl">{dict.home.locationTitle}</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/55">{dict.home.locationBody}</p>
            <div className="mt-7 space-y-4">
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-sm text-white/65 transition-colors hover:text-white"
              >
                <MapPinIcon className="mt-0.5 size-5 shrink-0 text-ember" />
                {locale === "ar" ? settings.address_ar : settings.address_en}
              </a>
              <p className="flex items-start gap-3 text-sm text-white/65">
                <ClockIcon className="mt-0.5 size-5 shrink-0 text-ember" />
                {locale === "ar" ? settings.hours_ar : settings.hours_en}
              </p>
            </div>
            <a
              href={settings.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline mt-7"
            >
              <MapPinIcon className="size-4" />
              {dict.home.openMap}
            </a>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-[22rem] overflow-hidden rounded-sm border border-white/10 lg:h-full">
              <iframe
                title="FWF Club location"
                src="https://maps.google.com/maps?q=Fighters%20Without%20Fear%20Kuwait&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full grayscale-[.35] contrast-[1.1]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
