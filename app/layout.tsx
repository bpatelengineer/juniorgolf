import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "JuniorLinks — Youth Golf Near You",
  description:
    "Find junior golf lessons, courses, camps, and tournaments near you. The youth golf discovery platform for parents, juniors, and coaches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <header className="bg-green-900 text-white sticky top-0 z-[1100] shadow-md">
          <div className="mx-auto max-w-6xl px-4 flex items-center gap-6 h-14">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span aria-hidden>⛳</span> JuniorLinks
            </Link>
            <nav className="flex gap-1 text-sm font-medium">
              <Link
                href="/"
                className="px-3 py-2 rounded-md hover:bg-green-800 transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/events"
                className="px-3 py-2 rounded-md hover:bg-green-800 transition-colors"
              >
                Events
              </Link>
            </nav>
            <span className="ml-auto text-xs text-green-200 hidden sm:block">
              Dallas–Fort Worth · launch metro
            </span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-stone-500 flex flex-wrap gap-x-6 gap-y-2">
            <span>© 2026 JuniorLinks (working title)</span>
            <span>Built for parents, juniors, coaches & organizers</span>
            <span>Demo data — facilities are fictional</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
