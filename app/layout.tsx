import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Grow Local Visibility | Professional Websites for Local Businesses",
  description:
    "We build professional websites and manage your Google presence so local customers find you first. Free preview — no risk, no commitment.",
  keywords: [
    "local business website",
    "Google Business Profile",
    "local SEO",
    "small business marketing",
    "get more customers",
    "local service business",
  ],
  authors: [{ name: "Ryan Irwin" }],
  openGraph: {
    title: "Grow Local Visibility | Professional Websites for Local Businesses",
    description:
      "We build professional websites and manage your Google presence so local customers find you first.",
    url: "https://growlocalvisibility.com",
    siteName: "Grow Local Visibility",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grow Local Visibility | Professional Websites for Local Businesses",
    description:
      "We build professional websites and manage your Google presence so local customers find you first.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
