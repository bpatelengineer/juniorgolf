export const LISTING_TYPES: Record<string, string> = {
  course: "Golf Course",
  range: "Driving Range",
  instructor: "Instructor",
  academy: "Academy",
  camp: "Camp",
};

export const EVENT_TYPES: Record<string, string> = {
  tournament: "Tournament",
  clinic: "Clinic",
  league: "League",
  camp: "Camp",
  showcase: "Showcase",
  scramble: "Scramble",
  qualifier: "Qualifier",
};

export const SKILL_LEVELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  competitive: "Competitive",
};

export function priceTierLabel(tier: number): string {
  return "$".repeat(Math.min(Math.max(tier, 1), 3));
}

export function formatFee(cents: number): string {
  if (cents === 0) return "Free";
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateRange(start: Date, end: Date | null): string {
  if (!end || start.toDateString() === end.toDateString()) {
    return formatDate(start);
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function averageRating(reviews: { rating: number }[]): number | null {
  if (reviews.length === 0) return null;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

// Haversine distance in miles between two coordinates.
export function distanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Default map center for the launch metro (Dallas–Fort Worth) until
// user geolocation is wired up.
export const METRO_CENTER = { lat: 32.85, lng: -97.0 };
