import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Resonate Local by Resonate Solutions",
  description: "Customer-ready pages for local service businesses, with MenuPilot, LawnPilot, CleanPilot, DetailPilot, BeautyPilot, and WellnessPilot tracks.",
  metadataBase: new URL("https://resonate.solutions"),
  icons: {
    icon: "/assets/resonate-icon-primary.png",
    apple: "/assets/resonate-icon-primary.png"
  },
  openGraph: {
    title: "Resonate Local by Resonate Solutions",
    description: "Customer-ready pages for local businesses, with trade-specific Pilot pages for food, lawn care, cleaning, detailing, beauty, and wellness.",
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
