"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale, Product } from "@/lib/types";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";
import { CartIcon, CheckIcon, CloseIcon, WhatsAppIcon } from "./icons";

type ShopClientProps = {
  lang: Locale;
  dict: Dictionary;
  products: Product[];
  whatsapp: string;
};

type Cart = Record<string, number>;
type OrderForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
};

const CART_KEY = "fwf_cart_v1";

export function ShopClient({ lang, dict, products, whatsapp }: ShopClientProps) {
  const [cart, setCart] = useState<Cart>({});
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [added, setAdded] = useState<string | null>(null);
  const [form, setForm] = useState<OrderForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setCart(JSON.parse(raw) as Cart);
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    const lock = cartOpen || checkoutOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, checkoutOpen]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const visible = useMemo(
    () =>
      category === "All"
        ? products
        : products.filter((product) => product.category === category),
    [category, products],
  );

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = products.find((item) => item.id === id);
          return product ? { product, qty } : null;
        })
        .filter((item): item is { product: Product; qty: number } => Boolean(item)),
    [cart, products],
  );

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const add = (product: Product) => {
    setCart((value) => ({ ...value, [product.id]: (value[product.id] ?? 0) + 1 }));
    setAdded(product.id);
    window.setTimeout(() => setAdded(null), 1200);
  };

  const changeQty = (id: string, delta: number) => {
    setCart((value) => {
      const nextQty = Math.max(0, (value[id] ?? 0) + delta);
      const next = { ...value };
      if (nextQty === 0) delete next[id];
      else next[id] = nextQty;
      return next;
    });
  };

  const remove = (id: string) => {
    setCart((value) => {
      const next = { ...value };
      delete next[id];
      return next;
    });
  };

  const orderMessage = `${dict.booking.orderPreface}\n\n${items
    .map(
      ({ product, qty }) =>
        `• ${lang === "ar" ? product.name_ar : product.name_en} × ${qty} — ${formatPrice(product.price * qty, lang)}`,
    )
    .join("\n")}\n\n${dict.shop.subtotal}: ${formatPrice(total, lang)}\n${dict.shop.form.name}: ${form.name}\n${dict.shop.form.phone}: ${form.phone}\n${form.address ? `${dict.shop.form.address}: ${form.address}\n` : ""}${form.notes ? `${dict.shop.form.notes}: ${form.notes}` : ""}`;

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("saving");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map(({ product, qty }) => ({
            productId: product.id,
            name: lang === "ar" ? product.name_ar : product.name_en,
            price: product.price,
            qty,
          })),
          total,
        }),
      });
      if (!response.ok) throw new Error("Order failed");
      const data = (await response.json()) as { order?: { id: string } };
      setOrderId(data.order?.id ?? "");
      setStatus("success");
      setCart({});
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {products.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="me-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/55">
              {dict.shop.title}
            </span>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "border px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.13em] transition-colors",
                  category === item
                    ? "border-blood bg-blood text-white"
                    : "border-white/15 text-white/55 hover:border-white/40 hover:text-white",
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 border border-white/15 px-4 py-2.5 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            <CartIcon className="size-4" />
            {dict.shop.cart}
            {count > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-blood text-[0.6rem] text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      )}

      {products.length === 0 ? (
        <div className="mt-8 grid place-items-center border border-white/10 bg-[#0b0b0b] p-12 text-center">
          <p className="eyebrow">{lang === "ar" ? "المتجر" : "Shop"}</p>
          <p className="mt-4 display text-4xl text-bone">
            {lang === "ar" ? "قريباً" : "Coming soon"}
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
            {dict.shop.comingSoon}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => {
          const name = lang === "ar" ? product.name_ar : product.name_en;
          const desc = lang === "ar" ? product.desc_ar : product.desc_en;
          return (
            <article
              key={product.id}
              className="group overflow-hidden rounded-sm border border-white/10 bg-[#0b0b0b]"
            >
              <div className="relative aspect-square overflow-hidden bg-smoke">
                <Image
                  src={product.image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.stock === 0 && (
                  <span className="absolute inset-0 grid place-items-center bg-black/65 text-xs font-bold uppercase tracking-[0.16em] text-white">
                    {dict.shop.outOfStock}
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-[0.58rem] font-bold uppercase tracking-[0.15em] text-white/55">
                  {product.category}
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-bone">{name}</h2>
                <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-white/60">{desc}</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <p className="text-lg font-extrabold text-ember">{formatPrice(product.price, lang)}</p>
                  <button
                    type="button"
                    disabled={product.stock === 0}
                    onClick={() => add(product)}
                    className={cn(
                      "btn !min-h-9 !px-4 !py-2 !text-[0.6rem]",
                      added === product.id ? "btn-whatsapp" : "btn-outline",
                      product.stock === 0 && "cursor-not-allowed opacity-40",
                    )}
                  >
                    {added === product.id ? (
                      <>
                        <CheckIcon className="size-3.5" /> {dict.shop.added}
                      </>
                    ) : (
                      <>
                        <CartIcon className="size-3.5" /> {dict.shop.addToCart}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      )}

      {/* Cart drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm transition-opacity",
          cartOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        onClick={(event) => {
          if (event.target === event.currentTarget) setCartOpen(false);
        }}
        aria-hidden={!cartOpen}
      >
        <aside
          className={cn(
            "absolute bottom-0 top-0 flex w-full max-w-md flex-col border-white/15 bg-[#0b0b0b] shadow-2xl transition-transform duration-300 end-0",
            cartOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full",
          )}
          aria-label={dict.shop.cart}
        >
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <p className="eyebrow">{dict.shop.cart}</p>
              <p className="mt-1 text-sm text-white/60">
                {count} {lang === "ar" ? "منتجات" : "items"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="grid size-9 place-items-center border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
              aria-label={dict.common.close}
            >
              <CloseIcon className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <p className="mt-10 text-center text-sm text-white/60">{dict.shop.emptyCart}</p>
            ) : (
              <ul className="space-y-4">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="flex gap-3 border border-white/10 p-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-smoke">
                      <Image
                        src={product.image}
                        alt={lang === "ar" ? product.name_ar : product.name_en}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-extrabold text-bone">
                            {lang === "ar" ? product.name_ar : product.name_en}
                          </p>
                          <p className="mt-0.5 text-xs text-white/60">
                            {formatPrice(product.price, lang)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(product.id)}
                          className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/55 hover:text-ember"
                        >
                          {dict.shop.remove}
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-white/15">
                          <button
                            type="button"
                            onClick={() => changeQty(product.id, -1)}
                            className="grid size-7 place-items-center text-white/60 hover:text-white"
                            aria-label="-"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-white">{qty}</span>
                          <button
                            type="button"
                            onClick={() => changeQty(product.id, 1)}
                            className="grid size-7 place-items-center text-white/60 hover:text-white"
                            aria-label="+"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-extrabold text-ember">
                          {formatPrice(product.price * qty, lang)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-white/10 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">{dict.shop.subtotal}</span>
              <span className="text-xl font-extrabold text-bone">{formatPrice(total, lang)}</span>
            </div>
            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
                setStatus("idle");
              }}
              className="btn btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              {dict.shop.checkout}
            </button>
          </div>
        </aside>
      </div>

      {/* Checkout modal */}
      {checkoutOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) setCheckoutOpen(false);
          }}
        >
          <div className="max-h-[94svh] w-full max-w-lg overflow-y-auto border border-white/15 bg-[#0c0c0c] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/10 p-5">
              <div>
                <p className="eyebrow">{dict.shop.checkout}</p>
                <h2 className="mt-1 text-2xl font-extrabold text-bone">
                  {status === "success" ? dict.shop.orderSuccess : dict.shop.checkoutTitle}
                </h2>
                <p className="mt-1 text-sm text-white/60">{dict.shop.checkoutSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="grid size-9 shrink-0 place-items-center border border-white/15 text-white/60 hover:border-white/40 hover:text-white"
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
                <p className="mt-4 text-sm leading-6 text-white/60">{dict.shop.orderSuccessBody}</p>
                {orderId && (
                  <p className="mt-2 text-[0.6rem] uppercase tracking-[0.15em] text-white/55">
                    Ref: {orderId}
                  </p>
                )}
                <div className="mt-5 grid gap-2">
                  <a
                    href={whatsappLink(whatsapp, orderMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp w-full"
                  >
                    <WhatsAppIcon className="size-4" />
                    {dict.shop.sendOrder}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutOpen(false);
                      setStatus("idle");
                    }}
                    className="btn btn-outline w-full"
                  >
                    {dict.shop.continueShopping}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitOrder} className="space-y-4 p-5">
                <div className="border border-white/10 bg-black/30 p-3">
                  <ul className="space-y-1.5 text-xs">
                    {items.map(({ product, qty }) => (
                      <li key={product.id} className="flex justify-between gap-3 text-white/55">
                        <span>
                          {lang === "ar" ? product.name_ar : product.name_en} × {qty}
                        </span>
                        <span>{formatPrice(product.price * qty, lang)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-sm font-extrabold">
                    <span>{dict.shop.subtotal}</span>
                    <span className="text-ember">{formatPrice(total, lang)}</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="label">{dict.shop.form.name}</span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      className="field"
                      autoComplete="name"
                    />
                  </label>
                  <label className="block">
                    <span className="label">{dict.shop.form.phone}</span>
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
                  <span className="label">{dict.shop.form.address}</span>
                  <input
                    required
                    value={form.address}
                    onChange={(event) => setForm({ ...form, address: event.target.value })}
                    className="field"
                    autoComplete="street-address"
                  />
                </label>
                <label className="block">
                  <span className="label">
                    {dict.shop.form.notes}{" "}
                    <span className="normal-case tracking-normal text-white/50">
                      ({dict.common.optional})
                    </span>
                  </span>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(event) => setForm({ ...form, notes: event.target.value })}
                    className="field resize-none"
                  />
                </label>
                {status === "error" && (
                  <p className="border border-blood/40 bg-blood/10 p-3 text-xs text-red-300">
                    {dict.contact.error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "saving" || items.length === 0}
                  className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60"
                >
                  {status === "saving" ? dict.common.sending : dict.shop.form.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
