import { z } from "zod";
import { EventType, SkillLevel } from "@prisma/client";

export const eventCreateSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(3000).optional(),
  eventType: z.nativeEnum(EventType),
  format: z.string().max(100).optional(),
  tourAffiliation: z.string().max(100).optional(),
  venueName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  lat: z.number().optional(),
  lng: z.number().optional(),
  venueId: z.string().optional(),
  dateStart: z.string().datetime(),
  dateEnd: z.string().datetime().optional(),
  registrationDeadline: z.string().datetime().optional(),
  ageDivisions: z.array(z.string()).default([]),
  skillLevels: z.array(z.nativeEnum(SkillLevel)).default([]),
  entryFee: z.number().int().min(0).optional(), // cents
  maxParticipants: z.number().int().min(1).optional(),
  registrationUrl: z.string().url().optional().or(z.literal("")),
});

export const eventUpdateSchema = eventCreateSchema.partial().extend({
  id: z.string(),
});

export const eventSearchSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  radiusMiles: z.number().default(50),
  eventType: z.nativeEnum(EventType).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
});

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
