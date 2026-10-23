import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NestGH — Find your next room",
    template: "%s | NestGH",
  },
  description: "Browse rooms and student hostels across Ghana. Check current availability and contact owners directly.",
  referrer: "no-referrer",
  icons: { icon: "/logo-192.png", apple: "/logo-192.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f4ee",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
