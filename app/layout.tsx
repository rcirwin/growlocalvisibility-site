import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grow Local Visibility | Get Found By More Local Customers",
  description:
    "We build local service businesses a professional website for free, and it's yours to keep. Add it to your Google Maps listing, then upgrade to Google optimization, review automation, and SEO when you're ready.",
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
    title: "Grow Local Visibility | Get Found By More Local Customers",
    description:
      "We help local service businesses build their online presence and get more customers through Google.",
    url: "https://growlocalvisibility.com",
    siteName: "Grow Local Visibility",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grow Local Visibility | Get Found By More Local Customers",
    description:
      "We help local service businesses build their online presence and get more customers through Google.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
