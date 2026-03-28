import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CATEGORIES = [
  { label: "Golf Courses", icon: "⛳", href: "/discover?types=COURSE", bg: "bg-green-700", ring: "ring-green-700/20" },
  { label: "Coaches", icon: "🏌️", href: "/discover?types=COACH", bg: "bg-blue-600", ring: "ring-blue-600/20" },
  { label: "Driving Ranges", icon: "🎯", href: "/discover?types=RANGE", bg: "bg-amber-500", ring: "ring-amber-500/20" },
  { label: "Academies & Camps", icon: "🏕️", href: "/discover?types=ACADEMY", bg: "bg-violet-600", ring: "ring-violet-600/20" },
  { label: "Tournaments", icon: "🏆", href: "/events?eventType=TOURNAMENT", bg: "bg-orange-500", ring: "ring-orange-500/20" },
  { label: "Clinics", icon: "📋", href: "/events?eventType=CLINIC", bg: "bg-rose-500", ring: "ring-rose-500/20" },
];

const VALUE_PROPS = [
  { title: "Find Everything", body: "Courses, coaches, ranges, academies, and camps — all in one place with real reviews from families like yours.", icon: "🗺️" },
  { title: "Never Miss a Tournament", body: "Browse upcoming events filtered by age division, entry fee, and location. Save them to your calendar in one tap.", icon: "📅" },
  { title: "Connect with the Community", body: "Ask questions, share scorecards, get advice from coaches and competitive juniors in your area.", icon: "💬" },
];

const STATS = [
  { value: "43+", label: "DFW listings" },
  { value: "134+", label: "family reviews" },
  { value: "25+", label: "upcoming events" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 py-24 px-4 text-center text-white">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Now live in DFW
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              Junior golf,{" "}
              <span className="text-yellow-300">all in one place.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-green-100/90 leading-relaxed">
              Find courses, coaches, camps, and tournaments for young golfers near you. Read reviews, join the community, and never miss an event.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-green-800 shadow-lg shadow-black/10 hover:bg-green-50 transition-all duration-150 hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" /></svg>
                Find Junior Golf Near Me
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-150"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Browse Events
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="mt-0.5 text-sm text-green-200">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category grid */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="mb-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-700">Browse by category</p>
          </div>
          <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900 tracking-tight">What are you looking for?</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg} text-2xl shadow-sm ring-4 ${cat.ring}`}>
                  {cat.icon}
                </div>
                <span className="text-center text-xs font-semibold text-gray-700 group-hover:text-gray-900 leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Value props */}
        <section className="border-t border-gray-100 bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-700">Why JuniorLinks</p>
            </div>
            <h2 className="mb-12 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
              Built for junior golf families
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {VALUE_PROPS.map((vp) => (
                <div key={vp.title} className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center hover:bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl mx-auto ring-1 ring-green-100">{vp.icon}</div>
                  <h3 className="mb-3 text-lg font-bold text-gray-900">{vp.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{vp.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coach / facility CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-800 to-green-700 py-16 text-center text-white">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="relative mx-auto max-w-xl px-4">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">🏌️</div>
            <h2 className="text-3xl font-extrabold tracking-tight">Are you a coach or golf facility?</h2>
            <p className="mt-4 text-green-100/90 leading-relaxed">
              Claim your free listing and reach thousands of junior golf families in your area.
            </p>
            <Link
              href="/claim"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-green-800 shadow-lg shadow-black/10 hover:bg-green-50 transition-all duration-150 hover:-translate-y-0.5"
            >
              Claim Your Free Listing
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
