"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { GymClass, Locale, SiteContent } from "@/lib/types";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";
import { CheckIcon, CloseIcon, WhatsAppIcon } from "./icons";

type ClassesClientProps = {
  lang: Locale;
  dict: Dictionary;
  classes: GymClass[];
  content: SiteContent;
  whatsapp: string;
};

type BookingForm = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  notes: string;
};

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function ClassesClient({ lang, dict, classes, content, whatsapp }: ClassesClientProps) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<GymClass | null>(null);
  const [form, setForm] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
    date: tomorrow(),
    time: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [bookingId, setBookingId] = useState("");

  const disciplines = useMemo(
    () => ["All", ...Array.from(new Set(classes.map((item) => item.discipline)))],
    [classes],
  );

  const visible = useMemo(
    () => (filter === "All" ? classes : classes.filter((item) => item.discipline === filter)),
    [classes, filter],
  );

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const openBooking = (item: GymClass) => {
    setSelected(item);
    setStatus("idle");
    setBookingId("");
    setForm({
      name: "",
      phone: "",
      email: "",
      date: tomorrow(),
      time: item.time,
      notes: "",
    });
  };

  const selectedName = selected ? (lang === "ar" ? selected.name_ar : selected.name_en) : "";

  const waMessage = selected
    ? `${dict.booking.whatsappPreface}\n\n${selectedName}\n${form.date} · ${form.time}\n${dict.classes.form.name}: ${form.name}\n${dict.classes.form.phone}: ${form.phone}${form.notes ? `\n${dict.classes.form.notes}: ${form.notes}` : ""}`
    : dict.booking.whatsappPreface;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    setStatus("saving");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          classId: selected.id,
          className: selectedName,
        }),
      });
      if (!response.ok) throw new Error("Booking failed");
      const data = (await response.json()) as { booking?: { id: string } };
      setBookingId(data.booking?.id ?? "");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="me-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/55">
          {dict.classes.filter}
        </span>
        {disciplines.map((discipline) => (
          <button
            key={discipline}
            type="button"
            onClick={() => setFilter(discipline)}
            className={cn(
              "border px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.13em] transition-colors",
              filter === discipline
                ? "border-blood bg-blood text-white"
                : "border-white/15 text-white/55 hover:border-white/40 hover:text-white",
            )}
          >
            {discipline}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 text-sm text-white/50">{dict.classes.noResults}</p>
      ) : (
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => {
            const name = lang === "ar" ? item.name_ar : item.name_en;
            const desc = lang === "ar" ? item.desc_ar : item.desc_en;
            const day = lang === "ar" ? item.day_ar : item.day_en;
            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-sm border border-white/10 bg-[#0b0b0b]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 bg-blood px-2.5 py-1 text-[0.56rem] font-extrabold uppercase tracking-[0.15em] text-white">
                    {item.discipline}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-xl font-extrabold text-bone">{name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-white/60">{desc}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-xs">
                    <div>
                      <dt className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/55">
                        {dict.common.coach}
                      </dt>
                      <dd className="mt-0.5 font-semibold text-white/70">{item.coach}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/55">
                        {dict.common.duration}
                      </dt>
                      <dd className="mt-0.5 font-semibold text-white/70">{item.duration}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/55">
                        {lang === "ar" ? "الأيام" : "Days"}
                      </dt>
                      <dd className="mt-0.5 font-semibold text-white/70">{day}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/55">
                        {dict.common.price}
                      </dt>
                      <dd className="mt-0.5 font-semibold text-white/70">
                        {formatPrice(item.price, lang)}{" "}
                        <span className="text-white/55">/ {dict.common.perClass}</span>
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openBooking(item)}
                      className="btn btn-primary flex-1 !min-h-10 !py-2"
                    >
                      {dict.common.bookNow}
                    </button>
                    <a
                      href={whatsappLink(
                        whatsapp,
                        `${dict.booking.whatsappPreface}\n${name} · ${item.time}`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="grid size-10 place-items-center border border-[#25d366]/50 text-[#25d366] transition-colors hover:bg-[#25d366] hover:text-black"
                      aria-label={dict.common.whatsapp}
                    >
                      <WhatsAppIcon className="size-4" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-10 border border-white/10 bg-[#0b0b0b] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">{dict.classes.weekly}</p>
            <h3 className="display mt-3 text-3xl text-bone md:text-4xl">{content.scheduleTitle}</h3>
            <p className="mt-2 text-sm text-white/60">{content.scheduleSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/55 sm:grid-cols-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="border border-white/10 px-3 py-2 text-center">
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="max-h-[94svh] w-full max-w-lg overflow-y-auto border border-white/15 bg-[#0c0c0c] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-ember">
                  {selected.discipline} · {selected.time}
                </p>
                <h3 id="booking-title" className="mt-1 text-2xl font-extrabold text-bone">
                  {status === "success" ? dict.classes.form.successTitle : dict.classes.bookTitle}
                </h3>
                <p className="mt-1 text-sm text-white/60">{selectedName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="grid size-9 shrink-0 place-items-center border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white"
                aria-label={dict.common.close}
              >
                <CloseIcon className="size-4" />
              </button>
            </div>

            {status === "success" ? (
              <div className="p-6 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#1faa59]/15 text-[#25d366]">
                  <CheckIcon className="size-7" />
                </span>
                <p className="mt-4 text-sm leading-6 text-white/60">{dict.classes.form.successBody}</p>
                <div className="mt-5 border border-white/10 bg-black/30 p-4 text-start text-sm">
                  <p className="font-extrabold text-bone">{selectedName}</p>
                  <p className="mt-1 text-white/60">
                    {form.date} · {form.time}
                  </p>
                  {bookingId && (
                    <p className="mt-2 text-[0.6rem] uppercase tracking-[0.15em] text-white/55">
                      Ref: {bookingId}
                    </p>
                  )}
                </div>
                <div className="mt-5 grid gap-2">
                  <a
                    href={whatsappLink(whatsapp, waMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp w-full"
                  >
                    <WhatsAppIcon className="size-4" />
                    {dict.classes.form.sendWhatsApp}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setForm((value) => ({ ...value, name: "", phone: "", email: "", notes: "" }));
                    }}
                    className="btn btn-outline w-full"
                  >
                    {dict.classes.form.another}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4 p-5">
                <p className="text-sm leading-6 text-white/60">{dict.classes.bookSubtitle}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="label">{dict.classes.form.name}</span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      className="field"
                      autoComplete="name"
                    />
                  </label>
                  <label className="block">
                    <span className="label">{dict.classes.form.phone}</span>
                    <input
                      required
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                      className="field"
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="label">
                    {dict.classes.form.email}{" "}
                    <span className="normal-case tracking-normal text-white/50">
                      ({dict.common.optional})
                    </span>
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="field"
                    autoComplete="email"
                    dir="ltr"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="label">{dict.classes.form.date}</span>
                    <input
                      required
                      type="date"
                      value={form.date}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(event) => setForm({ ...form, date: event.target.value })}
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="label">{dict.classes.form.time}</span>
                    <input
                      required
                      value={form.time}
                      onChange={(event) => setForm({ ...form, time: event.target.value })}
                      className="field"
                      placeholder="6:00 PM"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="label">
                    {dict.classes.form.notes}{" "}
                    <span className="normal-case tracking-normal text-white/50">
                      ({dict.common.optional})
                    </span>
                  </span>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(event) => setForm({ ...form, notes: event.target.value })}
                    className="field resize-none"
                    placeholder={dict.classes.form.notesPlaceholder}
                  />
                </label>
                {status === "error" && (
                  <p className="border border-blood/40 bg-blood/10 p-3 text-xs text-red-300">
                    {dict.classes.form.error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60"
                >
                  {status === "saving" ? dict.common.sending : dict.classes.form.submit}
                </button>
                <p className="text-center text-[0.62rem] leading-5 text-white/55">
                  {dict.classes.bookSubtitle}
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
