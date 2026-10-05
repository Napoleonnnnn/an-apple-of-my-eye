import type { Metadata, Viewport } from "next";
import { Fraunces, Karla } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { content } from "@/lib/content";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: content.hero.title,
};

export const viewport: Viewport = {
  themeColor: "#FFF8F2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${fraunces.variable} ${karla.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
