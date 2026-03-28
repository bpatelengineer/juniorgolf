import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white pt-12 pb-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-10">
          <div className="col-span-2 md:col-span-1">
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              Junior<span className="text-green-700">Links</span>
            </span>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs">The youth golf discovery & community platform for DFW families.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link href="/discover" className="hover:text-green-700 transition-colors">Find Courses</Link></li>
              <li><Link href="/discover?types=COACH" className="hover:text-green-700 transition-colors">Find Coaches</Link></li>
              <li><Link href="/discover?types=ACADEMY" className="hover:text-green-700 transition-colors">Academies & Camps</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Community</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link href="/events" className="hover:text-green-700 transition-colors">Events & Tournaments</Link></li>
              <li><Link href="/forum" className="hover:text-green-700 transition-colors">Forum</Link></li>
              <li><Link href="/claim" className="hover:text-green-700 transition-colors">Claim Your Listing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Account</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link href="/register" className="hover:text-green-700 transition-colors">Sign Up Free</Link></li>
              <li><Link href="/login" className="hover:text-green-700 transition-colors">Log In</Link></li>
              <li><Link href="/dashboard" className="hover:text-green-700 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} JuniorLinks. All rights reserved.</p>
          <p className="text-xs text-gray-400">Made for junior golfers & their families.</p>
        </div>
      </div>
    </footer>
  );
}
