import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "MenuPilot | Resonate Solutions",
  description: "MenuPilot by Resonate Solutions gives small businesses one clear customer-ready page for menus, services, links, hours, photos, and updates.",
  metadataBase: new URL("https://resonate.solutions"),
  icons: {
    icon: "/assets/resonate-icon-primary.png",
    apple: "/assets/resonate-icon-primary.png"
  },
  openGraph: {
    title: "MenuPilot | Resonate Solutions",
    description: "Customer-ready pages, food menus, and service listings built around what customers need before they call, order, book, or visit.",
    images: ["/assets/resonate-logo-flat.png"]
  }
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
