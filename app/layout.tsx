import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Resonate Solutions | Practical Digital Systems for Small Businesses",
  description: "Resonate Solutions builds customer-ready webpages, guided intake experiences, business information tools, managed updates, and practical workflows for small businesses.",
  metadataBase: new URL("https://resonate.solutions"),
  icons: {
    icon: "/assets/resonate-icon-primary.png",
    apple: "/assets/resonate-icon-primary.png"
  },
  openGraph: {
    title: "Resonate Solutions | Practical Digital Systems for Small Businesses",
    description: "Customer-ready webpages, guided intake, business information tools, managed updates, and practical workflows built for small businesses.",
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
