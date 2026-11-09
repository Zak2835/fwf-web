"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { whatsappLink } from "@/lib/utils";
import { CheckIcon, WhatsAppIcon } from "./icons";

type ContactFormProps = {
  lang: Locale;
  dict: Dictionary;
  whatsapp: string;
};

export function ContactForm({ lang, dict, whatsapp }: ContactFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Message failed");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="card p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#1faa59]/15 text-[#25d366]">
          <CheckIcon className="size-7" />
        </span>
        <h3 className="mt-4 text-xl font-extrabold text-bone">{dict.contact.success}</h3>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn btn-outline mt-6"
        >
          {dict.contact.submit}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">{dict.contact.name}</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="field"
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="label">{dict.contact.phone}</span>
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
        <span className="label">{dict.contact.email}</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="field"
          autoComplete="email"
          dir="ltr"
        />
      </label>
      <label className="block">
        <span className="label">{dict.contact.message}</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          className="field resize-none"
          placeholder={dict.contact.messagePlaceholder}
        />
      </label>
      {status === "error" && (
        <p className="border border-blood/40 bg-blood/10 p-3 text-xs text-red-300">
          {dict.contact.error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="btn btn-primary disabled:cursor-wait disabled:opacity-60"
        >
          {status === "saving" ? dict.common.sending : dict.contact.submit}
        </button>
        <a
          href={whatsappLink(
            whatsapp,
            `${dict.booking.contactPreface}\n${form.message || (lang === "ar" ? "أحتاج معلومات عن التدريب." : "I need information about training.")}`,
          )}
          target="_blank"
          rel="noreferrer"
          className="btn btn-whatsapp"
        >
          <WhatsAppIcon className="size-4" />
          {dict.common.whatsapp}
        </a>
      </div>
    </form>
  );
}
