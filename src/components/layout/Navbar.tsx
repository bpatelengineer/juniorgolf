"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/events", label: "Events" },
  { href: "/forum", label: "Forum" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-green-700 text-xl">
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" opacity="0.2" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
          </svg>
          JuniorLinks
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <Avatar src={session.user.image} name={session.user.name} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-gray-700">{session.user.name?.split(" ")[0]}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg py-1 z-50">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Dashboard</Link>
                  <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign up free</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden border-t border-gray-100 bg-white", !mobileOpen && "hidden")}>
        <nav className="px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          {!session && (
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-gray-100">
              <Link href="/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link href="/register" className="block rounded-lg bg-green-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-green-800" onClick={() => setMobileOpen(false)}>Sign up free</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
