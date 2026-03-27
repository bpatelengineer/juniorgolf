import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedUsers(prisma: PrismaClient) {
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  const users = [
    { id: "seed-admin-1", email: "admin@juniorgolf.dev", name: "Admin User", role: "ADMIN" as const, password: hash("admin1234") },
    { id: "seed-coach-1", email: "coach1@juniorgolf.dev", name: "Mike Torres", role: "COACH" as const, password: hash("coach1234") },
    { id: "seed-coach-2", email: "coach2@juniorgolf.dev", name: "Sarah Kim", role: "COACH" as const, password: hash("coach1234") },
    { id: "seed-parent-1", email: "parent1@juniorgolf.dev", name: "Jennifer Walsh", role: "PARENT" as const, password: hash("parent1234") },
    { id: "seed-parent-2", email: "parent2@juniorgolf.dev", name: "David Chen", role: "PARENT" as const, password: hash("parent1234") },
    { id: "seed-org-1", email: "organizer@juniorgolf.dev", name: "DFW Golf Events", role: "ORGANIZER" as const, password: hash("org12345") },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      create: { ...u, consentGrantedAt: new Date() },
      update: {},
    });
  }

  // Coach profiles
  await prisma.coachProfile.upsert({
    where: { userId: "seed-coach-1" },
    create: {
      userId: "seed-coach-1",
      bio: "PGA Class A professional with 12 years teaching junior golfers. Specializes in beginners and 10–14 age groups.",
      credentials: ["PGA Class A"],
      specialties: ["Beginner Kids", "Short Game", "Course Management"],
      ageGroupsServed: ["5-10", "11-14"],
      priceRangeMin: 75, priceRangeMax: 125,
      pgaMemberNumber: "PGA001234",
    },
    update: {},
  });

  await prisma.coachProfile.upsert({
    where: { userId: "seed-coach-2" },
    create: {
      userId: "seed-coach-2",
      bio: "Former LPGA Teaching & Club Professional. Works with competitive junior players ages 13–18 focused on college recruiting.",
      credentials: ["PGA Class A", "TPI Certified Level 2"],
      specialties: ["Competitive Juniors", "Mental Game", "College Recruiting Prep"],
      ageGroupsServed: ["13-18"],
      priceRangeMin: 100, priceRangeMax: 175,
    },
    update: {},
  });

  console.log("✓ Users seeded");
}
