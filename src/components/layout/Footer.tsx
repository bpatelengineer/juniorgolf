import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="font-bold text-green-700 text-lg">JuniorLinks</span>
            <p className="mt-2 text-sm text-gray-500">The youth golf discovery & community platform.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Discover</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><Link href="/discover" className="hover:text-green-700">Find Courses</Link></li>
              <li><Link href="/discover?types=COACH" className="hover:text-green-700">Find Coaches</Link></li>
              <li><Link href="/discover?types=ACADEMY" className="hover:text-green-700">Academies & Camps</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Community</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><Link href="/events" className="hover:text-green-700">Events & Tournaments</Link></li>
              <li><Link href="/forum" className="hover:text-green-700">Forum</Link></li>
              <li><Link href="/claim" className="hover:text-green-700">Claim Your Listing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li><Link href="/register" className="hover:text-green-700">Sign Up Free</Link></li>
              <li><Link href="/login" className="hover:text-green-700">Log In</Link></li>
              <li><Link href="/dashboard" className="hover:text-green-700">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} JuniorLinks. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
