import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "TransitIntel AI — Intelligent Transport Operating System",
  description:
    "AI-powered operating system for public transport. Fleet tracking, passenger counting, revenue intelligence, route optimization, and fraud detection.",
  keywords: [
    "transit",
    "fleet management",
    "passenger counting",
    "GPS tracking",
    "revenue intelligence",
    "AI",
    "public transport",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
