import { z } from "zod";
import { Role } from "@prisma/client";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.nativeEnum(Role),
  dateOfBirth: z.string().datetime().optional(),
  parentEmail: z.string().email().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  image: z.string().url().optional(),
});

export const updateCoachProfileSchema = z.object({
  bio: z.string().max(2000).optional(),
  credentials: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  ageGroupsServed: z.array(z.string()).optional(),
  priceRangeMin: z.number().int().min(0).optional(),
  priceRangeMax: z.number().int().min(0).optional(),
  pgaMemberNumber: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
