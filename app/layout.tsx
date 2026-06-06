import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Pages, Menus, and Service Lists | Resonate Solutions",
  description: "Customer-ready pages, food menus, and service listings for small businesses that need one clear link customers can use.",
  metadataBase: new URL("https://resonate.solutions"),
  icons: {
    icon: "/assets/resonate-icon-primary.png",
    apple: "/assets/resonate-icon-primary.png"
  },
  openGraph: {
    title: "Pages, Menus, and Service Lists | Resonate Solutions",
    description: "Customer-ready business pages, food menus, and service listings built around what customers need before they call, order, book, or visit.",
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
