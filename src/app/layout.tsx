import type { Metadata } from "next";
import "./globals.css";
import { TRPCReactProvider } from "@/lib/trpc/Provider";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: { default: "JuniorLinks — Youth Golf Discovery", template: "%s | JuniorLinks" },
  description: "Find junior golf courses, coaches, camps, clinics, and tournaments near you.",
  keywords: ["junior golf", "youth golf", "golf lessons kids", "junior golf tournaments", "kids golf"],
  openGraph: {
    type: "website",
    siteName: "JuniorLinks",
    title: "JuniorLinks — Youth Golf Discovery",
    description: "Find junior golf courses, coaches, camps, clinics, and tournaments near you.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-gray-900">
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
