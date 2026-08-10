import type { Metadata } from "next";
import { Bricolage_Grotesque, Karla } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { defaultSocialImage, siteName, siteUrl } from "@/lib/seo";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display"
});

const bodyFont = Karla({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Small Business Web Design & Managed Updates | Resonate Solutions",
  description: "Mobile-friendly customer pages, online menus, intake forms, hosting, and managed website updates for small businesses in Northwest Arkansas.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/assets/resonate-icon-primary.png",
    apple: "/assets/resonate-icon-primary.png"
  },
  openGraph: {
    title: "Small Business Web Design & Managed Updates | Resonate Solutions",
    description: "Mobile-friendly customer pages, online menus, intake forms, hosting, and managed website updates for small businesses in Northwest Arkansas.",
    siteName,
    type: "website",
    images: [defaultSocialImage]
  },
  twitter: {
    card: "summary_large_image",
    title: "Small Business Web Design & Managed Updates | Resonate Solutions",
    description: "Mobile-friendly customer pages, online menus, intake forms, hosting, and managed website updates for small businesses in Northwest Arkansas.",
    images: [defaultSocialImage]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <SiteNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
