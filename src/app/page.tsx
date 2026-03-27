import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CATEGORIES = [
  { label: "Golf Courses", icon: "⛳", href: "/discover?types=COURSE", color: "bg-green-50 border-green-200 hover:bg-green-100" },
  { label: "Coaches", icon: "🏌️", href: "/discover?types=COACH", color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
  { label: "Driving Ranges", icon: "🎯", href: "/discover?types=RANGE", color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100" },
  { label: "Academies & Camps", icon: "🏕️", href: "/discover?types=ACADEMY", color: "bg-purple-50 border-purple-200 hover:bg-purple-100" },
  { label: "Tournaments", icon: "🏆", href: "/events?eventType=TOURNAMENT", color: "bg-orange-50 border-orange-200 hover:bg-orange-100" },
  { label: "Clinics", icon: "📋", href: "/events?eventType=CLINIC", color: "bg-pink-50 border-pink-200 hover:bg-pink-100" },
];

const VALUE_PROPS = [
  { title: "Find Everything", body: "Courses, coaches, ranges, academies, and camps — all in one place with real reviews from families like yours.", icon: "🗺️" },
  { title: "Never Miss a Tournament", body: "Browse upcoming events filtered by age division, entry fee, and location. Save them to your calendar in one tap.", icon: "📅" },
  { title: "Connect with the Community", body: "Ask questions, share scorecards, get advice from coaches and competitive juniors in your area.", icon: "💬" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-700 to-green-900 py-20 px-4 text-center text-white">
          <div className="mb-4">
            <Badge variant="green" className="bg-green-600/80 text-white text-xs">Now live in DFW</Badge>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Junior golf,{" "}
            <span className="text-yellow-300">all in one place.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-green-100">
            Find courses, coaches, camps, and tournaments for young golfers near you. Read reviews, join the community, and never miss an event.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/discover"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-green-800 shadow hover:bg-green-50 transition-colors"
            >
              Find Junior Golf Near Me
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-lg border border-green-400 px-6 py-3 text-base font-semibold text-white hover:bg-green-800 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </section>

        {/* Category grid */}
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">What are you looking for?</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${cat.color}`}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-center text-sm font-medium text-gray-700">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Value props */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
              Built for junior golf families
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {VALUE_PROPS.map((vp) => (
                <div key={vp.title} className="text-center">
                  <div className="mb-4 text-5xl">{vp.icon}</div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{vp.title}</h3>
                  <p className="text-sm text-gray-500">{vp.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coach / facility CTA */}
        <section className="bg-green-700 py-14 text-center text-white">
          <h2 className="text-2xl font-bold">Are you a coach or golf facility?</h2>
          <p className="mt-3 text-green-100">
            Claim your free listing and reach thousands of junior golf families.
          </p>
          <Link
            href="/claim"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-green-800 hover:bg-green-50 transition-colors"
          >
            Claim Your Listing →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
