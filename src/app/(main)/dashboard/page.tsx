import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;
  const role = session.user.role;

  const [ownedListings, orgEvents, pendingClaims] = await Promise.all([
    role === "COACH" || role === "ADMIN"
      ? db.listing.count({ where: { ownerId: userId } })
      : Promise.resolve(0),
    role === "ORGANIZER" || role === "ADMIN" || role === "COACH"
      ? db.event.count({ where: { organizerId: userId, dateStart: { gte: new Date() } } })
      : Promise.resolve(0),
    role === "ADMIN" ? db.claimRequest.count({ where: { status: "PENDING" } }) : Promise.resolve(0),
  ]);

  const recentReviews = role === "COACH" || role === "ADMIN"
    ? await db.review.findMany({
        where: { listing: { ownerId: userId } },
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
          listing: { select: { name: true, slug: true } },
          author: { select: { name: true } },
        },
      })
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Welcome back, {session.user.name}</p>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {(role === "COACH" || role === "ADMIN") && (
          <Link href="/dashboard/listings" className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow text-center">
            <p className="text-3xl font-bold text-green-700">{ownedListings}</p>
            <p className="mt-1 text-sm text-gray-500">My Listings</p>
          </Link>
        )}
        {(role === "ORGANIZER" || role === "COACH" || role === "ADMIN") && (
          <Link href="/dashboard/events" className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow text-center">
            <p className="text-3xl font-bold text-blue-600">{orgEvents}</p>
            <p className="mt-1 text-sm text-gray-500">Upcoming Events</p>
          </Link>
        )}
        {role === "ADMIN" && (
          <Link href="/dashboard/admin/claims" className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow text-center">
            <p className="text-3xl font-bold text-orange-500">{pendingClaims}</p>
            <p className="mt-1 text-sm text-gray-500">Pending Claims</p>
          </Link>
        )}
      </div>

      {/* Quick links */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-md transition-shadow">
          <span className="text-2xl">👤</span>
          <div>
            <p className="font-medium text-gray-900">Edit Profile</p>
            <p className="text-xs text-gray-400">Update your name, location, and bio</p>
          </div>
        </Link>
        {(role === "COACH" || role === "ADMIN") && (
          <Link href="/claim" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-md transition-shadow">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-medium text-gray-900">Claim a Listing</p>
              <p className="text-xs text-gray-400">Own and manage your facility or coach profile</p>
            </div>
          </Link>
        )}
        {(role === "ORGANIZER" || role === "COACH" || role === "ADMIN") && (
          <Link href="/dashboard/events/new" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-md transition-shadow">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-medium text-gray-900">Post an Event</p>
              <p className="text-xs text-gray-400">Create a tournament, clinic, or camp</p>
            </div>
          </Link>
        )}
        <Link href="/forum" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-md transition-shadow">
          <span className="text-2xl">💬</span>
          <div>
            <p className="font-medium text-gray-900">Forum</p>
            <p className="text-xs text-gray-400">Join the junior golf community</p>
          </div>
        </Link>
      </div>

      {/* Recent reviews */}
      {recentReviews.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-gray-900">Recent Reviews</h2>
          <div className="space-y-3">
            {recentReviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-1">
                  <Link href={`/listings/${r.listing.slug}`} className="font-medium text-gray-900 hover:text-green-700 text-sm">{r.listing.name}</Link>
                  <span className="flex">{"★".repeat(r.rating)}<span className="text-gray-300">{"★".repeat(5 - r.rating)}</span></span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{r.body}</p>
                <p className="mt-1 text-xs text-gray-400">by {r.author.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
