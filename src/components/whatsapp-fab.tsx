import type { Dictionary } from "@/lib/i18n";
import type { Locale, SiteSettings } from "@/lib/types";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFab({
  settings,
  lang,
  dict,
}: {
  settings: SiteSettings;
  lang: Locale;
  dict: Dictionary;
}) {
  const message =
    lang === "ar"
      ? "مرحباً FWF! أرغب في حجز حصة أو الاستفسار عن التدريب."
      : "Hello FWF! I would like to book a class or ask about training.";

  return (
    <a
      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      className="wa-pulse fixed bottom-5 z-40 flex items-center gap-3 rounded-full bg-[#25d366] py-3 pe-5 ps-3 text-sm font-extrabold text-black shadow-[0_12px_40px_rgba(37,211,102,.35)] transition-transform hover:scale-105 end-5"
      aria-label={dict.common.whatsapp}
    >
      <span className="grid size-9 place-items-center rounded-full bg-black/10">
        <WhatsAppIcon className="size-5" />
      </span>
      <span className="hidden sm:block">{dict.common.whatsapp}</span>
    </a>
  );
}
