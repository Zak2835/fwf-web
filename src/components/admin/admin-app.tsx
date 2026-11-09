"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type {
  Booking,
  Database,
  GymClass,
  GymEvent,
  Inquiry,
  Order,
  Product,
  Review,
  SiteContent,
  SiteSettings,
} from "@/lib/types";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { CheckIcon, MapPinIcon, StarIcon, WhatsAppIcon } from "@/components/icons";

type Tab =
  | "overview"
  | "content"
  | "settings"
  | "classes"
  | "events"
  | "products"
  | "reviews"
  | "bookings"
  | "orders"
  | "messages";

const STORAGE_KEY = "fwf_admin_key";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "content", label: "Content" },
  { id: "classes", label: "Classes" },
  { id: "events", label: "Events" },
  { id: "products", label: "Products" },
  { id: "reviews", label: "Reviews" },
  { id: "bookings", label: "Bookings" },
  { id: "orders", label: "Orders" },
  { id: "messages", label: "Messages" },
  { id: "settings", label: "Settings" },
];

export function AdminApp() {
  const [ready, setReady] = useState(false);
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [toast, setToast] = useState("");
  const [savingSection, setSavingSection] = useState("");

  const loadData = useCallback(async (adminKey: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/data", {
        headers: { "x-admin-key": adminKey },
        cache: "no-store",
      });
      if (response.status === 401) {
        window.sessionStorage.removeItem(STORAGE_KEY);
        setKey("");
        setDb(null);
        return;
      }
      if (!response.ok) throw new Error("Load failed");
      const data = (await response.json()) as { db: Database };
      setDb(data.db);
    } catch {
      setLoginError("Could not load the dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setKey(stored);
      void loadData(stored);
    }
    setReady(true);
  }, [loadData]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setLoginError("Wrong password. Try again.");
        return;
      }
      window.sessionStorage.setItem(STORAGE_KEY, password);
      setKey(password);
      setPassword("");
      await loadData(password);
    } catch {
      setLoginError("Could not reach the server.");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setKey("");
    setDb(null);
    setPassword("");
  };

  const save = async (section: keyof Database, data: unknown) => {
    if (!key) return;
    setSavingSection(section);
    try {
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({ section, data }),
      });
      if (!response.ok) throw new Error("Save failed");
      const payload = (await response.json()) as { db: Database };
      setDb(payload.db);
      setToast("Saved");
    } catch {
      setToast("Could not save. Check the server.");
    } finally {
      setSavingSection("");
    }
  };

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-night text-sm text-white/60">Loading…</div>;
  }

  if (!key) {
    return (
      <div className="grid min-h-screen place-items-center bg-night p-5">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-sm bg-blood">
              <span className="display text-2xl text-white">FWF</span>
            </span>
            <div>
              <p className="display text-2xl text-bone">Fighters Without Fear</p>
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.25em] text-white/55">
                Admin dashboard
              </p>
            </div>
          </div>
          <form onSubmit={login} className="card p-6">
            <h1 className="text-xl font-extrabold text-bone">Admin access</h1>
            <p className="mt-1 text-xs leading-5 text-white/60">
              Enter the dashboard password to manage the site.
            </p>
            <label className="mt-5 block">
              <span className="label">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field"
                autoFocus
              />
            </label>
            {loginError && (
              <p className="mt-3 border border-blood/40 bg-blood/10 p-2.5 text-xs text-red-300">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="btn btn-primary mt-4 w-full disabled:opacity-60"
            >
              {loggingIn ? "Checking…" : "Enter dashboard"}
            </button>
            <p className="mt-4 text-[0.6rem] leading-5 text-white/50">
              Demo password: <code className="text-white/50">fwf2026</code>. Set{" "}
              <code className="text-white/50">ADMIN_PASSWORD</code> in the environment for production.
            </p>
          </form>
          <Link href="/en" className="mt-5 block text-center text-[0.62rem] uppercase tracking-[0.14em] text-white/55 hover:text-white">
            ← Back to website
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !db) {
    return <div className="grid min-h-screen place-items-center bg-night text-sm text-white/60">Loading dashboard…</div>;
  }

  return (
    <div className="min-h-screen bg-night text-bone">
      <div className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-sm bg-blood">
              <span className="display text-xl text-white">FWF</span>
            </span>
            <div>
              <p className="text-sm font-extrabold">FWF Dashboard</p>
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white/55">
                Content · Bookings · Shop
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadData(key)}
              className="btn btn-outline !min-h-9 !px-3 !py-2 !text-[0.58rem]"
            >
              Refresh
            </button>
            <a href="/en" target="_blank" rel="noreferrer" className="btn btn-outline hidden !min-h-9 !px-3 !py-2 !text-[0.58rem] sm:inline-flex">
              View site
            </a>
            <button
              type="button"
              onClick={logout}
              className="btn btn-outline !min-h-9 !px-3 !py-2 !text-[0.58rem]"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-4 py-6 md:px-6 lg:flex-row">
        <aside className="lg:w-52 lg:shrink-0">
          <nav className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {TABS.map((item) => {
              const count =
                item.id === "bookings"
                  ? db.bookings.filter((booking) => booking.status === "pending").length
                  : item.id === "orders"
                    ? db.orders.filter((order) => order.status === "pending").length
                    : item.id === "messages"
                      ? db.inquiries.filter((message) => message.status === "new").length
                      : 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "flex shrink-0 items-center justify-between gap-2 px-3 py-2.5 text-left text-[0.64rem] font-bold uppercase tracking-[0.13em] transition-colors lg:w-full",
                    tab === item.id
                      ? "bg-blood text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {item.label}
                  {count > 0 && (
                    <span className="grid size-4 place-items-center rounded-full bg-white/15 text-[0.52rem]">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {tab === "overview" && <Overview db={db} />}
          {tab === "content" && (
            <ContentEditor
              db={db}
              setDb={setDb}
              onSave={() => void save("content", db.content)}
              saving={savingSection === "content"}
              adminKey={key}
            />
          )}
          {tab === "settings" && (
            <SettingsEditor
              db={db}
              setDb={setDb}
              onSave={() => void save("settings", db.settings)}
              saving={savingSection === "settings"}
            />
          )}
          {tab === "classes" && (
            <ClassesEditor
              db={db}
              setDb={setDb}
              onSave={() => void save("classes", db.classes)}
              saving={savingSection === "classes"}
              adminKey={key}
            />
          )}
          {tab === "events" && (
            <EventsEditor
              db={db}
              setDb={setDb}
              onSave={() => void save("events", db.events)}
              saving={savingSection === "events"}
              adminKey={key}
            />
          )}
          {tab === "products" && (
            <ProductsEditor
              db={db}
              setDb={setDb}
              onSave={() => void save("products", db.products)}
              saving={savingSection === "products"}
              adminKey={key}
            />
          )}
          {tab === "reviews" && (
            <ReviewsEditor
              db={db}
              setDb={setDb}
              onSave={() => void save("reviews", db.reviews)}
              saving={savingSection === "reviews"}
            />
          )}
          {tab === "bookings" && (
            <BookingsEditor
              db={db}
              setDb={setDb}
              onSave={() => void save("bookings", db.bookings)}
              saving={savingSection === "bookings"}
            />
          )}
          {tab === "orders" && (
            <OrdersEditor
              db={db}
              setDb={setDb}
              onSave={() => void save("orders", db.orders)}
              saving={savingSection === "orders"}
            />
          )}
          {tab === "messages" && (
            <MessagesEditor
              db={db}
              setDb={setDb}
              onSave={() => void save("inquiries", db.inquiries)}
              saving={savingSection === "inquiries"}
            />
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 border border-white/15 bg-[#101010] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  hint,
  onSave,
  saving,
  children,
}: {
  title: string;
  hint: string;
  onSave: () => void;
  saving: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-end">
      <div>
        <h2 className="display text-3xl text-bone md:text-4xl">{title}</h2>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-white/55">{hint}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {children}
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="btn btn-primary !min-h-9 !px-4 !py-2 !text-[0.58rem] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Overview({ db }: { db: Database }) {
  const stats = [
    { label: "Bookings", value: db.bookings.length, sub: `${db.bookings.filter((item) => item.status === "pending").length} pending`, icon: CheckIcon },
    { label: "Orders", value: db.orders.length, sub: `${db.orders.filter((item) => item.status === "pending").length} pending`, icon: StarIcon },
    { label: "Messages", value: db.inquiries.length, sub: `${db.inquiries.filter((item) => item.status === "new").length} new`, icon: WhatsAppIcon },
    { label: "Classes", value: db.classes.length, sub: `${db.events.filter((item) => item.status === "upcoming").length} events`, icon: MapPinIcon },
  ];
  return (
    <div>
      <div className="mb-5 border-b border-white/10 pb-4">
        <h2 className="display text-3xl text-bone md:text-4xl">Overview</h2>
        <p className="mt-1 text-xs text-white/55">A quick look at the club operations.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/55">{stat.label}</p>
              <stat.icon className="size-4 text-ember" />
            </div>
            <p className="display mt-3 text-4xl text-bone">{stat.value}</p>
            <p className="mt-1 text-[0.58rem] uppercase tracking-[0.12em] text-white/55">{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-sm font-extrabold">Recent bookings</h3>
          <div className="mt-4 space-y-3">
            {db.bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0">
                <div>
                  <p className="text-xs font-bold">{booking.name}</p>
                  <p className="mt-0.5 text-[0.62rem] text-white/55">
                    {booking.className} · {booking.date} · {booking.time}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
            {db.bookings.length === 0 && <p className="text-xs text-white/55">No bookings yet.</p>}
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-extrabold">Recent messages</h3>
          <div className="mt-4 space-y-3">
            {db.inquiries.slice(0, 5).map((message) => (
              <div key={message.id} className="border-b border-white/5 pb-3 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold">{message.name}</p>
                  <StatusBadge status={message.status} />
                </div>
                <p className="mt-1 line-clamp-2 text-[0.62rem] leading-5 text-white/55">{message.message}</p>
              </div>
            ))}
            {db.inquiries.length === 0 && <p className="text-xs text-white/55">No messages yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentEditor({
  db,
  setDb,
  onSave,
  saving,
  adminKey,
}: {
  db: Database;
  setDb: (db: Database) => void;
  onSave: () => void;
  saving: boolean;
  adminKey: string;
}) {
  const update = (locale: "en" | "ar", field: keyof SiteContent, value: string) => {
    setDb({ ...db, content: { ...db.content, [locale]: { ...db.content[locale], [field]: value } } });
  };

  const groups: { title: string; fields: { key: keyof SiteContent; label: string; textarea?: boolean; image?: boolean }[] }[] = [
    {
      title: "Hero",
      fields: [
        { key: "heroEyebrow", label: "Eyebrow" },
        { key: "heroTitle", label: "Title" },
        { key: "heroSubtitle", label: "Subtitle", textarea: true },
        { key: "heroImage", label: "Hero image", image: true },
        { key: "heroCta", label: "Primary button" },
        { key: "heroCtaSecondary", label: "Secondary button" },
      ],
    },
    {
      title: "About",
      fields: [
        { key: "aboutTitle", label: "Title" },
        { key: "aboutBody", label: "Body", textarea: true },
        { key: "aboutImage", label: "Image", image: true },
      ],
    },
    {
      title: "Sections",
      fields: [
        { key: "disciplinesTitle", label: "Disciplines title" },
        { key: "disciplinesSubtitle", label: "Disciplines subtitle" },
        { key: "scheduleTitle", label: "Schedule title" },
        { key: "scheduleSubtitle", label: "Schedule subtitle" },
        { key: "eventsTitle", label: "Events title" },
        { key: "eventsSubtitle", label: "Events subtitle" },
        { key: "shopTitle", label: "Shop title" },
        { key: "shopSubtitle", label: "Shop subtitle" },
        { key: "reviewsTitle", label: "Reviews title" },
        { key: "reviewsSubtitle", label: "Reviews subtitle" },
      ],
    },
    {
      title: "Call to action",
      fields: [
        { key: "ctaTitle", label: "Title" },
        { key: "ctaBody", label: "Body", textarea: true },
        { key: "ctaImage", label: "Image", image: true },
      ],
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Content"
        hint="Edit the public site copy for English and Arabic. Hero images and section titles are all controlled here."
        onSave={onSave}
        saving={saving}
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {(["en", "ar"] as const).map((locale) => (
          <div key={locale} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-blood px-2 py-1 text-[0.55rem] font-extrabold uppercase tracking-[0.16em] text-white">
                {locale === "en" ? "English" : "العربية"}
              </span>
              <span className="text-[0.58rem] uppercase tracking-[0.12em] text-white/50">
                {locale === "en" ? "Left to right" : "Right to left"}
              </span>
            </div>
            {groups.map((group) => (
              <div key={group.title} className="card p-4">
                <h3 className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/60">{group.title}</h3>
                <div className="mt-3 space-y-3">
                  {group.fields.map((field) =>
                    field.image ? (
                      <ImageField
                        key={field.key}
                        label={field.label}
                        value={db.content[locale][field.key]}
                        onChange={(value) => update(locale, field.key, value)}
                        adminKey={adminKey}
                      />
                    ) : (
                      <label key={field.key} className="block">
                        <span className="label">{field.label}</span>
                        {field.textarea ? (
                          <textarea
                            rows={3}
                            value={db.content[locale][field.key]}
                            onChange={(event) => update(locale, field.key, event.target.value)}
                            className="field resize-none"
                          />
                        ) : (
                          <input
                            value={db.content[locale][field.key]}
                            onChange={(event) => update(locale, field.key, event.target.value)}
                            className="field"
                          />
                        )}
                      </label>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsEditor({
  db,
  setDb,
  onSave,
  saving,
}: {
  db: Database;
  setDb: (db: Database) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const fields: { key: keyof SiteSettings; label: string }[] = [
    { key: "name", label: "Gym name" },
    { key: "shortName", label: "Short name" },
    { key: "phone", label: "Phone" },
    { key: "whatsapp", label: "WhatsApp number (digits only)" },
    { key: "instagram", label: "Instagram URL" },
    { key: "mapUrl", label: "Google Maps URL" },
    { key: "reviewUrl", label: "Google review URL" },
    { key: "email", label: "Email" },
    { key: "address_en", label: "Address (English)" },
    { key: "address_ar", label: "Address (Arabic)" },
    { key: "hours_en", label: "Hours (English)" },
    { key: "hours_ar", label: "Hours (Arabic)" },
  ];
  return (
    <div>
      <SectionHeader
        title="Settings"
        hint="These details power the WhatsApp buttons, map, Google reviews and footer."
        onSave={onSave}
        saving={saving}
      />
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className={cn("block", field.key.startsWith("address") && "sm:col-span-2")}>
            <span className="label">{field.label}</span>
            <input
              value={db.settings[field.key]}
              onChange={(event) => setDb({ ...db, settings: { ...db.settings, [field.key]: event.target.value } })}
              className="field"
            />
          </label>
        ))}
      </div>
      <p className="mt-4 text-[0.62rem] leading-5 text-white/55">
        The default admin password is <code className="text-white/50">fwf2026</code>. Set{" "}
        <code className="text-white/50">ADMIN_PASSWORD</code> in your environment before launch.
      </p>
    </div>
  );
}

function ClassesEditor({
  db,
  setDb,
  onSave,
  saving,
  adminKey,
}: {
  db: Database;
  setDb: (db: Database) => void;
  onSave: () => void;
  saving: boolean;
  adminKey: string;
}) {
  const update = (id: string, patch: Partial<GymClass>) => {
    setDb({ ...db, classes: db.classes.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };
  const add = () => {
    const item: GymClass = {
      id: `class-${Date.now().toString(36)}`,
      discipline: "Boxing",
      name_en: "New class",
      name_ar: "حصة جديدة",
      desc_en: "Class description",
      desc_ar: "وصف الحصة",
      coach: "Coach",
      day_en: "Sunday",
      day_ar: "الأحد",
      time: "6:00 PM",
      duration: "60 min",
      price: 5,
      capacity: 16,
      image: "/images/u-boxing2.jpg",
    };
    setDb({ ...db, classes: [item, ...db.classes] });
  };
  return (
    <div>
      <SectionHeader title="Classes" hint="Manage the weekly schedule and booking options." onSave={onSave} saving={saving}>
        <button type="button" onClick={add} className="btn btn-outline !min-h-9 !px-4 !py-2 !text-[0.58rem]">
          + Add class
        </button>
      </SectionHeader>
      <div className="space-y-3">
        {db.classes.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold">{item.name_en}</p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this class?")) {
                    setDb({ ...db, classes: db.classes.filter((entry) => entry.id !== item.id) });
                  }
                }}
                className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/55 hover:text-ember"
              >
                Delete
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <TextField label="Name (EN)" value={item.name_en} onChange={(value) => update(item.id, { name_en: value })} />
              <TextField label="Name (AR)" value={item.name_ar} onChange={(value) => update(item.id, { name_ar: value })} />
              <TextField label="Discipline" value={item.discipline} onChange={(value) => update(item.id, { discipline: value })} />
              <TextField label="Coach" value={item.coach} onChange={(value) => update(item.id, { coach: value })} />
              <TextField label="Days (EN)" value={item.day_en} onChange={(value) => update(item.id, { day_en: value })} />
              <TextField label="Days (AR)" value={item.day_ar} onChange={(value) => update(item.id, { day_ar: value })} />
              <TextField label="Time" value={item.time} onChange={(value) => update(item.id, { time: value })} />
              <TextField label="Duration" value={item.duration} onChange={(value) => update(item.id, { duration: value })} />
              <NumberField label="Price (KWD)" value={item.price} onChange={(value) => update(item.id, { price: value })} />
              <NumberField label="Capacity" value={item.capacity} onChange={(value) => update(item.id, { capacity: value })} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <TextArea label="Description (EN)" value={item.desc_en} onChange={(value) => update(item.id, { desc_en: value })} />
              <TextArea label="Description (AR)" value={item.desc_ar} onChange={(value) => update(item.id, { desc_ar: value })} />
            </div>
            <div className="mt-3">
              <ImageField label="Image" value={item.image} onChange={(value) => update(item.id, { image: value })} adminKey={adminKey} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsEditor({
  db,
  setDb,
  onSave,
  saving,
  adminKey,
}: {
  db: Database;
  setDb: (db: Database) => void;
  onSave: () => void;
  saving: boolean;
  adminKey: string;
}) {
  const update = (id: string, patch: Partial<GymEvent>) => {
    setDb({ ...db, events: db.events.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };
  const add = () => {
    const item: GymEvent = {
      id: `event-${Date.now().toString(36)}`,
      title_en: "New event",
      title_ar: "فعالية جديدة",
      date: new Date().toISOString().slice(0, 10),
      time: "7:00 PM",
      location_en: "FWF Club, Kuwait",
      location_ar: "نادي FWF، الكويت",
      desc_en: "Event description",
      desc_ar: "وصف الفعالية",
      image: "/images/post1.jpg",
      status: "upcoming",
    };
    setDb({ ...db, events: [item, ...db.events] });
  };
  return (
    <div>
      <SectionHeader title="Events" hint="Add fight nights, open days and past event highlights." onSave={onSave} saving={saving}>
        <button type="button" onClick={add} className="btn btn-outline !min-h-9 !px-4 !py-2 !text-[0.58rem]">
          + Add event
        </button>
      </SectionHeader>
      <div className="space-y-3">
        {db.events.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold">{item.title_en}</p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this event?")) {
                    setDb({ ...db, events: db.events.filter((entry) => entry.id !== item.id) });
                  }
                }}
                className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/55 hover:text-ember"
              >
                Delete
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <TextField label="Title (EN)" value={item.title_en} onChange={(value) => update(item.id, { title_en: value })} />
              <TextField label="Title (AR)" value={item.title_ar} onChange={(value) => update(item.id, { title_ar: value })} />
              <TextField label="Date (YYYY-MM-DD)" value={item.date} onChange={(value) => update(item.id, { date: value })} />
              <TextField label="Time" value={item.time} onChange={(value) => update(item.id, { time: value })} />
              <TextField label="Location (EN)" value={item.location_en} onChange={(value) => update(item.id, { location_en: value })} />
              <TextField label="Location (AR)" value={item.location_ar} onChange={(value) => update(item.id, { location_ar: value })} />
              <label className="block">
                <span className="label">Status</span>
                <select
                  value={item.status}
                  onChange={(event) => update(item.id, { status: event.target.value as GymEvent["status"] })}
                  className="field"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </label>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <TextArea label="Description (EN)" value={item.desc_en} onChange={(value) => update(item.id, { desc_en: value })} />
              <TextArea label="Description (AR)" value={item.desc_ar} onChange={(value) => update(item.id, { desc_ar: value })} />
            </div>
            <div className="mt-3">
              <ImageField label="Image" value={item.image} onChange={(value) => update(item.id, { image: value })} adminKey={adminKey} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsEditor({
  db,
  setDb,
  onSave,
  saving,
  adminKey,
}: {
  db: Database;
  setDb: (db: Database) => void;
  onSave: () => void;
  saving: boolean;
  adminKey: string;
}) {
  const update = (id: string, patch: Partial<Product>) => {
    setDb({ ...db, products: db.products.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };
  const add = () => {
    const item: Product = {
      id: `product-${Date.now().toString(36)}`,
      name_en: "New product",
      name_ar: "منتج جديد",
      desc_en: "Product description",
      desc_ar: "وصف المنتج",
      price: 10,
      category: "Apparel",
      image: "/images/u-shop.jpg",
      stock: 10,
    };
    setDb({ ...db, products: [item, ...db.products] });
  };
  return (
    <div>
      <SectionHeader title="Products" hint="Manage shop items, prices, stock and images." onSave={onSave} saving={saving}>
        <button type="button" onClick={add} className="btn btn-outline !min-h-9 !px-4 !py-2 !text-[0.58rem]">
          + Add product
        </button>
      </SectionHeader>
      <div className="space-y-3">
        {db.products.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold">{item.name_en}</p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this product?")) {
                    setDb({ ...db, products: db.products.filter((entry) => entry.id !== item.id) });
                  }
                }}
                className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/55 hover:text-ember"
              >
                Delete
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <TextField label="Name (EN)" value={item.name_en} onChange={(value) => update(item.id, { name_en: value })} />
              <TextField label="Name (AR)" value={item.name_ar} onChange={(value) => update(item.id, { name_ar: value })} />
              <TextField label="Category" value={item.category} onChange={(value) => update(item.id, { category: value })} />
              <NumberField label="Price (KWD)" value={item.price} onChange={(value) => update(item.id, { price: value })} />
              <NumberField label="Stock" value={item.stock} onChange={(value) => update(item.id, { stock: value })} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <TextArea label="Description (EN)" value={item.desc_en} onChange={(value) => update(item.id, { desc_en: value })} />
              <TextArea label="Description (AR)" value={item.desc_ar} onChange={(value) => update(item.id, { desc_ar: value })} />
            </div>
            <div className="mt-3">
              <ImageField label="Image" value={item.image} onChange={(value) => update(item.id, { image: value })} adminKey={adminKey} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsEditor({
  db,
  setDb,
  onSave,
  saving,
}: {
  db: Database;
  setDb: (db: Database) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const update = (id: string, patch: Partial<Review>) => {
    setDb({ ...db, reviews: db.reviews.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };
  const add = () => {
    setDb({
      ...db,
      reviews: [
        {
          id: `review-${Date.now().toString(36)}`,
          name: "New fighter",
          text_en: "Review text",
          text_ar: "نص التقييم",
          rating: 5,
        },
        ...db.reviews,
      ],
    });
  };
  return (
    <div>
      <SectionHeader title="Reviews" hint="Curate the testimonials shown on the home page." onSave={onSave} saving={saving}>
        <button type="button" onClick={add} className="btn btn-outline !min-h-9 !px-4 !py-2 !text-[0.58rem]">
          + Add review
        </button>
      </SectionHeader>
      <div className="space-y-3">
        {db.reviews.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold">{item.name}</p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this review?")) {
                    setDb({ ...db, reviews: db.reviews.filter((entry) => entry.id !== item.id) });
                  }
                }}
                className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/55 hover:text-ember"
              >
                Delete
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <TextField label="Name" value={item.name} onChange={(value) => update(item.id, { name: value })} />
              <NumberField label="Rating" value={item.rating} onChange={(value) => update(item.id, { rating: value })} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <TextArea label="Review (EN)" value={item.text_en} onChange={(value) => update(item.id, { text_en: value })} />
              <TextArea label="Review (AR)" value={item.text_ar} onChange={(value) => update(item.id, { text_ar: value })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsEditor({
  db,
  setDb,
  onSave,
  saving,
}: {
  db: Database;
  setDb: (db: Database) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const update = (id: string, patch: Partial<Booking>) => {
    setDb({ ...db, bookings: db.bookings.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };
  return (
    <div>
      <SectionHeader title="Bookings" hint="Confirm or cancel class bookings. New bookings appear here instantly." onSave={onSave} saving={saving} />
      {db.bookings.length === 0 ? (
        <p className="text-sm text-white/55">No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {db.bookings.map((item) => (
            <div key={item.id} className="card grid gap-3 p-4 md:grid-cols-[1fr_1fr_10rem_auto] md:items-center">
              <div>
                <p className="text-sm font-extrabold">{item.name}</p>
                <p className="mt-0.5 text-[0.62rem] text-white/55" dir="ltr">{item.phone} {item.email ? `· ${item.email}` : ""}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-white/70">{item.className}</p>
                <p className="mt-0.5 text-[0.62rem] text-white/55">{item.date} · {item.time}</p>
              </div>
              <select
                value={item.status}
                onChange={(event) => update(item.id, { status: event.target.value as Booking["status"] })}
                className="field !py-2 text-xs"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="button"
                onClick={() => setDb({ ...db, bookings: db.bookings.filter((entry) => entry.id !== item.id) })}
                className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/55 hover:text-ember"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersEditor({
  db,
  setDb,
  onSave,
  saving,
}: {
  db: Database;
  setDb: (db: Database) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const update = (id: string, patch: Partial<Order>) => {
    setDb({ ...db, orders: db.orders.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };
  return (
    <div>
      <SectionHeader title="Orders" hint="Track shop orders and update their status." onSave={onSave} saving={saving} />
      {db.orders.length === 0 ? (
        <p className="text-sm text-white/55">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {db.orders.map((item) => (
            <div key={item.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold">{item.name}</p>
                  <p className="mt-0.5 text-[0.62rem] text-white/55" dir="ltr">{item.phone} · {item.address}</p>
                </div>
                <p className="text-sm font-extrabold text-ember">{formatPrice(item.total, "en")}</p>
              </div>
              <ul className="mt-3 space-y-1 border-y border-white/5 py-2 text-[0.62rem] text-white/60">
                {item.items.map((entry) => (
                  <li key={`${item.id}-${entry.productId}`} className="flex justify-between gap-3">
                    <span>{entry.name} × {entry.qty}</span>
                    <span>{formatPrice(entry.price * entry.qty, "en")}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={item.status}
                  onChange={(event) => update(item.id, { status: event.target.value as Order["status"] })}
                  className="field max-w-40 !py-2 text-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  type="button"
                  onClick={() => setDb({ ...db, orders: db.orders.filter((entry) => entry.id !== item.id) })}
                  className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/55 hover:text-ember"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesEditor({
  db,
  setDb,
  onSave,
  saving,
}: {
  db: Database;
  setDb: (db: Database) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const update = (id: string, patch: Partial<Inquiry>) => {
    setDb({ ...db, inquiries: db.inquiries.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  };
  return (
    <div>
      <SectionHeader title="Messages" hint="Contact form submissions from the website." onSave={onSave} saving={saving} />
      {db.inquiries.length === 0 ? (
        <p className="text-sm text-white/55">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {db.inquiries.map((item) => (
            <div key={item.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold">{item.name}</p>
                  <p className="mt-0.5 text-[0.62rem] text-white/55" dir="ltr">
                    {item.phone} {item.email ? `· ${item.email}` : ""}
                  </p>
                </div>
                <select
                  value={item.status}
                  onChange={(event) => update(item.id, { status: event.target.value as Inquiry["status"] })}
                  className="field max-w-32 !py-2 text-xs"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <p className="mt-3 whitespace-pre-line border-t border-white/5 pt-3 text-sm leading-6 text-white/55">
                {item.message}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[0.58rem] uppercase tracking-[0.1em] text-white/50">
                  {formatDate(item.createdAt.slice(0, 10), "en")}
                </span>
                <button
                  type="button"
                  onClick={() => setDb({ ...db, inquiries: db.inquiries.filter((entry) => entry.id !== item.id) })}
                  className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/55 hover:text-ember"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  adminKey,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  adminKey: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-key": adminKey },
        body: form,
      });
      if (!response.ok) throw new Error("Upload failed");
      const data = (await response.json()) as { url: string };
      onChange(data.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-smoke">
          <Image
            src={value || "/images/post2.jpg"}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <input value={value} onChange={(event) => onChange(event.target.value)} className="field !py-2 text-xs" />
          <div className="mt-1.5 flex items-center gap-2">
            <label className="cursor-pointer text-[0.58rem] font-bold uppercase tracking-[0.1em] text-ember hover:text-red-400">
              {uploading ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={uploading} />
            </label>
            {error && <span className="text-[0.58rem] text-red-400">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="field !py-2 text-xs" />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="field !py-2 text-xs"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field resize-none !py-2 text-xs"
      />
    </label>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    confirmed: "border-[#25d366]/30 bg-[#25d366]/10 text-[#25d366]",
    paid: "border-[#25d366]/30 bg-[#25d366]/10 text-[#25d366]",
    delivered: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    cancelled: "border-blood/30 bg-blood/10 text-red-300",
    new: "border-blood/30 bg-blood/10 text-red-300",
    read: "border-white/15 bg-white/5 text-white/50",
  };
  return (
    <span className={cn("border px-2 py-0.5 text-[0.52rem] font-bold uppercase tracking-[0.1em]", styles[status] ?? styles.read)}>
      {status}
    </span>
  );
}
