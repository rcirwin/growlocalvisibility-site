import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Grow Local Visibility | Get Found By More Local Customers",
  description:
    "We help local service businesses build their online presence and get more customers through Google. Professional website, Google optimization, SEO reports, and more.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
