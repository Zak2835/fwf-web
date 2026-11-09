import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { ArrowIcon, MapPinIcon, WhatsAppIcon } from "@/components/icons";
import { getDb } from "@/lib/db";
import { getDictionary, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { formatDate, whatsappLink } from "@/lib/utils";

type EventsPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: EventsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isArabic = lang === "ar";
  return {
    title: isArabic ? "الفعاليات" : "Events",
    description: isArabic
      ? "ليالي قتال، أيام مفتوحة ومعسكرات في نادي FWF بالكويت. سجّل عبر واتساب."
      : "Fight nights, open days and camps at FWF Club Kuwait. Register on WhatsApp.",
    alternates: { canonical: `/${lang}/events` },
  };
}

export default async function EventsPage({ params }: EventsPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const db = await getDb();
  const content = db.content[locale];
  const upcoming = db.events.filter((event) => event.status === "upcoming");
  const past = db.events.filter((event) => event.status === "past");

  return (
    <>
      <section className="relative overflow-hidden pt-36">
        <Image
          src="/images/post1.jpg"
          alt="FWF event"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-black/55" />
        <div className="container-x relative z-10 pb-14 pt-10 md:pb-20">
          <p className="eyebrow">{locale === "ar" ? "ليالي لا تُنسى" : "Nights to remember"}</p>
          <h1 className="display mt-4 text-6xl text-bone md:text-8xl">{dict.events.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">{dict.events.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">{dict.events.upcoming}</p>
                <h2 className="display mt-3 text-4xl text-bone md:text-6xl">{content.eventsTitle}</h2>
              </div>
              <span className="hidden border border-white/10 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/60 sm:block">
                {upcoming.length} {locale === "ar" ? "فعاليات" : "events"}
              </span>
            </div>
          </Reveal>

          {upcoming.length === 0 ? (
            <p className="mt-10 text-sm text-white/60">{dict.events.noEvents}</p>
          ) : (
            <div className="mt-9 grid gap-6 lg:grid-cols-2">
              {upcoming.map((event, index) => {
                const title = locale === "ar" ? event.title_ar : event.title_en;
                const desc = locale === "ar" ? event.desc_ar : event.desc_en;
                const location = locale === "ar" ? event.location_ar : event.location_en;
                return (
                  <Reveal key={event.id} delay={index * 80}>
                    <article className="group grid h-full overflow-hidden rounded-sm border border-white/10 bg-[#0b0b0b] sm:grid-cols-[15rem_1fr]">
                      <div className="relative min-h-56 overflow-hidden">
                        <Image
                          src={event.image}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 100vw, 240px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent sm:bg-gradient-to-r" />
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
                      <div className="flex flex-col p-5">
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ember">
                          {formatDate(event.date, locale)} · {event.time}
                        </p>
                        <h3 className="mt-2 text-2xl font-extrabold text-bone">{title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-white/60">{desc}</p>
                        <p className="mt-4 flex items-center gap-2 text-xs text-white/50">
                          <MapPinIcon className="size-4 text-ember" />
                          {location}
                        </p>
                        <div className="mt-5 flex gap-2">
                          <a
                            href={whatsappLink(
                              db.settings.whatsapp,
                              `${dict.booking.eventPreface} ${title}.`,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-whatsapp flex-1 !min-h-10 !py-2"
                          >
                            <WhatsAppIcon className="size-4" />
                            {dict.events.register}
                          </a>
                          <a
                            href={db.settings.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="grid size-10 place-items-center border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
                            aria-label="Instagram"
                          >
                            <ArrowIcon className="size-4" />
                          </a>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="section border-t border-white/10 bg-[#090909]">
          <div className="container-x">
            <Reveal>
              <p className="eyebrow">{dict.events.past}</p>
              <h2 className="display mt-3 text-4xl text-bone md:text-6xl">
                {locale === "ar" ? "من أرشيف النادي" : "From the club archive"}
              </h2>
            </Reveal>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event, index) => (
                <Reveal key={event.id} delay={index * 60}>
                  <article className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10">
                    <Image
                      src={event.image}
                      alt={locale === "ar" ? event.title_ar : event.title_en}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-ember">
                        {formatDate(event.date, locale)}
                      </p>
                      <h3 className="mt-1.5 text-xl font-extrabold text-bone">
                        {locale === "ar" ? event.title_ar : event.title_en}
                      </h3>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
