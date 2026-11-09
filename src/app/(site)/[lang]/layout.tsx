import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { getDb } from "@/lib/db";
import { fontClassNames } from "@/lib/fonts";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import "../../globals.css";

export const dynamic = "force-dynamic";

type LangLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isArabic = lang === "ar";
  const db = await getDb();

  return {
    metadataBase: new URL("https://fwfclub.com"),
    title: isArabic
      ? "مقاتلون بلا خوف | ملاكمة وإم إم إيه ومواي تاي في الكويت"
      : "Fighters Without Fear | Boxing, MMA & Muay Thai in Kuwait",
    description: isArabic
      ? "نادي FWF في الكويت — ملاكمة، إم إم إيه، مواي تاي، كيك بوكسينغ، كاجوكنبو ولياقة. احجز حصة وتدرّب بلا خوف."
      : "FWF Club Kuwait — boxing, MMA, Muay Thai, kickboxing, Kajukenbo and fitness. Book a class and train without fear.",
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", ar: "/ar" },
    },
    openGraph: {
      title: isArabic ? "مقاتلون بلا خوف | FWF الكويت" : "Fighters Without Fear | FWF Kuwait",
      description: isArabic
        ? "ملاكمة، إم إم إيه، مواي تاي ولياقة في الكويت."
        : "Boxing, MMA, Muay Thai and fitness in Kuwait.",
      locale: isArabic ? "ar_KW" : "en_KW",
      images: [db.content[isArabic ? "ar" : "en"].heroImage || "/images/unsplash-boxing.jpg"],
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const db = await getDb();
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} className={fontClassNames}>
      <body>
        <div dir={dir} className="flex min-h-screen flex-col">
          <SiteHeader lang={lang} dict={dict} settings={db.settings} />
          <main className="flex-1">{children}</main>
          <SiteFooter lang={lang} dict={dict} settings={db.settings} />
          <WhatsAppFab settings={db.settings} lang={lang} dict={dict} />
        </div>
      </body>
    </html>
  );
}
