import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ClassesClient } from "@/components/classes-client";
import { getDb } from "@/lib/db";
import { getDictionary, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type ClassesPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: ClassesPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isArabic = lang === "ar";
  return {
    title: isArabic ? "الحصص والحجز" : "Classes & Booking",
    description: isArabic
      ? "جدول الحصص الأسبوعي في نادي FWF بالكويت — ملاكمة، إم إم إيه، مواي تاي، كيك بوكسينغ ولياقة. احجز حصتك أونلاين."
      : "Weekly class schedule at FWF Club Kuwait — boxing, MMA, Muay Thai, kickboxing and fitness. Reserve your spot online.",
    alternates: { canonical: `/${lang}/classes` },
  };
}

export default async function ClassesPage({ params }: ClassesPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const db = await getDb();
  const content = db.content[locale];

  return (
    <>
      <section className="relative overflow-hidden pt-36">
        <Image
          src="/images/u-muaythai.jpg"
          alt="Muay Thai class at FWF"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/75 to-black/55" />
        <div className="container-x relative z-10 pb-14 pt-10 md:pb-20">
          <p className="eyebrow">{locale === "ar" ? "احجز حصتك" : "Book your session"}</p>
          <h1 className="display mt-4 text-6xl text-bone md:text-8xl">{dict.classes.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">{dict.classes.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Boxing", "MMA", "Muay Thai", "Kickboxing", "Kajukenbo", "Fitness", "Jiu Jitsu"].map(
              (item) => (
                <span
                  key={item}
                  className="border border-white/15 bg-black/30 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white/55 backdrop-blur"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <ClassesClient
            lang={locale}
            dict={dict}
            classes={db.classes}
            content={content}
            whatsapp={db.settings.whatsapp}
          />
        </div>
      </section>
    </>
  );
}
