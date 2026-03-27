import type { Role, ListingType, SkillLevel, PriceTier, EventType, PostFlair, ClaimStatus } from "@prisma/client";

export type { Role, ListingType, SkillLevel, PriceTier, EventType, PostFlair, ClaimStatus };

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  COURSE: "Golf Course",
  RANGE: "Driving Range",
  COACH: "Coach / Instructor",
  ACADEMY: "Academy / Camp",
  TEAM: "High School Team",
};

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  COMPETITIVE: "Competitive",
};

export const PRICE_TIER_LABELS: Record<PriceTier, string> = {
  FREE: "Free",
  LOW: "$",
  MEDIUM: "$$",
  HIGH: "$$$",
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  TOURNAMENT: "Tournament",
  CLINIC: "Clinic",
  CAMP: "Camp",
  LEAGUE: "League",
  SHOWCASE: "Showcase",
  SCRAMBLE: "Scramble",
  QUALIFIER: "Qualifier",
  OTHER: "Other",
};

export const POST_FLAIR_LABELS: Record<PostFlair, string> = {
  QUESTION: "Question",
  REVIEW: "Review",
  TOURNAMENT_REPORT: "Tournament Report",
  TIPS: "Tips",
  RECRUITING: "Recruiting",
  NEWS: "News",
  GENERAL: "General",
};

// DFW bounding box used as default viewport
export const DEFAULT_BBOX = {
  minLat: 32.5,
  maxLat: 33.2,
  minLng: -97.5,
  maxLng: -96.5,
};

export const DEFAULT_CENTER = { lat: 32.8, lng: -97.0 };
