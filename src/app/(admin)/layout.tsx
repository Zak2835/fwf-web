import type { Metadata } from "next";
import { fontClassNames } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admin dashboard | Fighters Without Fear",
    template: "%s | FWF Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontClassNames}>
      <body>{children}</body>
    </html>
  );
}
