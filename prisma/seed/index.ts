import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedUsers } from "./users";
import { seedListings } from "./listings";
import { seedEvents } from "./events";
import { seedForum } from "./forum";
import { seedReviews } from "./reviews";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding JuniorLinks database…\n");

  await seedUsers(prisma);
  await seedListings(prisma);
  await seedEvents(prisma, "seed-org-1");
  await seedForum(prisma, "seed-parent-1");
  await seedReviews(prisma, ["seed-parent-1", "seed-parent-2", "seed-coach-1", "seed-coach-2"]);

  console.log("\n✅ All seed data written successfully.");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
