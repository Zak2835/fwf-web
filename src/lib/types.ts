export type Locale = "en" | "ar";

export type SiteSettings = {
  name: string;
  shortName: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  mapUrl: string;
  reviewUrl: string;
  email: string;
  address_en: string;
  address_ar: string;
  hours_en: string;
  hours_ar: string;
};

export type SiteContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCta: string;
  heroCtaSecondary: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImage: string;
  disciplinesTitle: string;
  disciplinesSubtitle: string;
  scheduleTitle: string;
  scheduleSubtitle: string;
  eventsTitle: string;
  eventsSubtitle: string;
  shopTitle: string;
  shopSubtitle: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  ctaTitle: string;
  ctaBody: string;
  ctaImage: string;
};

export type GymClass = {
  id: string;
  discipline: string;
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  coach: string;
  day_en: string;
  day_ar: string;
  time: string;
  duration: string;
  price: number;
  capacity: number;
  image: string;
};

export type GymEvent = {
  id: string;
  title_en: string;
  title_ar: string;
  date: string;
  time: string;
  location_en: string;
  location_ar: string;
  desc_en: string;
  desc_ar: string;
  image: string;
  status: "upcoming" | "past";
};

export type Product = {
  id: string;
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  price: number;
  category: string;
  image: string;
  stock: number;
};

export type Review = {
  id: string;
  name: string;
  text_en: string;
  text_ar: string;
  rating: number;
};

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  classId: string;
  className: string;
  date: string;
  time: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "delivered" | "cancelled";
  createdAt: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "read";
  createdAt: string;
};

export type Database = {
  settings: SiteSettings;
  content: Record<Locale, SiteContent>;
  classes: GymClass[];
  events: GymEvent[];
  products: Product[];
  reviews: Review[];
  bookings: Booking[];
  orders: Order[];
  inquiries: Inquiry[];
};
