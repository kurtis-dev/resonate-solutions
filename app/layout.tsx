import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { ReplyPilotNav } from "@/components/ReplyPilotNav";

export const metadata: Metadata = {
  title: "Resonate Solutions - AI Tools for Local Business Communication",
  description: "AI-assisted customer communication tools for local businesses, starting with ReplyPilot review reply workflows.",
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
        <ReplyPilotNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
