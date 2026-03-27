import { z } from "zod";
import { ListingType, SkillLevel, PriceTier } from "@prisma/client";

export const listingSearchSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  radiusMiles: z.number().min(1).max(100).default(25),
  // Explicit bbox fallback (used by map viewport queries)
  minLat: z.number().optional(),
  maxLat: z.number().optional(),
  minLng: z.number().optional(),
  maxLng: z.number().optional(),
  types: z.array(z.nativeEnum(ListingType)).optional(),
  ageMin: z.number().min(0).max(18).optional(),
  ageMax: z.number().min(0).max(18).optional(),
  skillLevels: z.array(z.nativeEnum(SkillLevel)).optional(),
  priceTiers: z.array(z.nativeEnum(PriceTier)).optional(),
  query: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

export const listingCreateSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.nativeEnum(ListingType),
  description: z.string().max(2000).optional(),
  address: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zipCode: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  hours: z.record(z.string()).optional(),
  ageMin: z.number().min(0).max(18).optional(),
  ageMax: z.number().min(0).max(18).optional(),
  skillLevels: z.array(z.nativeEnum(SkillLevel)).default([]),
  priceTier: z.nativeEnum(PriceTier).optional(),
  programTypes: z.array(z.string()).default([]),
});

export const listingUpdateSchema = listingCreateSchema.partial().extend({
  id: z.string(),
});

export type ListingSearchInput = z.infer<typeof listingSearchSchema>;
export type ListingCreateInput = z.infer<typeof listingCreateSchema>;
