import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Resonate Solutions - Local Business Presence Kits",
  description: "Mobile menu pages, QR codes, food photos, Google profile tune-ups, and public link cleanup for local businesses.",
  metadataBase: new URL("https://resonate.solutions")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
