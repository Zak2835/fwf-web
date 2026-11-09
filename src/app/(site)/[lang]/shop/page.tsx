import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShopClient } from "@/components/shop-client";
import { getDb } from "@/lib/db";
import { getDictionary, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type ShopPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: ShopPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isArabic = lang === "ar";
  return {
    title: isArabic ? "المتجر" : "Shop",
    description: isArabic
      ? "معدات FWF الرسمية — قفازات، لفافات، واقيات وملابس تدريب. توصيل داخل الكويت."
      : "Official FWF gear — gloves, wraps, guards and training apparel. Delivery inside Kuwait.",
    alternates: { canonical: `/${lang}/shop` },
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
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
          src="/images/u-gloves.jpg"
          alt="FWF training gear"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-black/55" />
        <div className="container-x relative z-10 pb-14 pt-10 md:pb-20">
          <p className="eyebrow">{locale === "ar" ? "معدات النادي" : "Club gear"}</p>
          <h1 className="display mt-4 text-6xl text-bone md:text-8xl">{dict.shop.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">{dict.shop.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <ShopClient
            lang={locale}
            dict={dict}
            products={db.products}
            whatsapp={db.settings.whatsapp}
          />
          <div className="mt-12 border border-white/10 bg-[#0b0b0b] p-6 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="eyebrow">{content.shopTitle}</p>
              <h2 className="display mt-3 text-3xl text-bone md:text-4xl">{content.shopSubtitle}</h2>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/60 md:mt-0">
              {locale === "ar"
                ? "الدفع عند الاستلام أو عبر واتساب. التوصيل متاح داخل الكويت."
                : "Cash on pickup or payment arranged on WhatsApp. Delivery available inside Kuwait."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
