import { PrismaClient } from "@prisma/client";

const REVIEW_TEMPLATES = [
  { rating: 5, title: "Excellent junior program!", body: "Our kids absolutely love coming here. The instructors know how to keep kids engaged and excited about golf. Highly recommend to any family looking to get their child into the sport." },
  { rating: 5, title: "Best junior golf experience in DFW", body: "We've tried several programs across the Metroplex and this is far and away the best. The staff is patient, encouraging, and clearly experienced working with kids." },
  { rating: 4, title: "Great experience overall", body: "Really solid program. The coaches are knowledgeable and the facilities are well-maintained. The only minor complaint is parking can be a challenge on weekends, but that's a small thing." },
  { rating: 4, title: "Would recommend to other families", body: "My son has improved a lot since starting here. The group lessons are a great value and he's made some good friends. The staff is friendly and responds quickly to questions." },
  { rating: 4, title: "Good value and friendly staff", body: "Signed up my daughter for the beginner clinic. She went from not knowing which end of the club to hold to making consistent contact in just a few sessions. Very encouraging environment." },
  { rating: 3, title: "Decent program, some room to grow", body: "The instruction itself is good, but scheduling can be a bit disorganized. We had a session canceled with less than 24 hours notice twice. Worth trying but manage expectations on logistics." },
  { rating: 5, title: "Our daughter loves it here", body: "She started as a complete beginner and now talks about golf constantly. The junior program has been a wonderful experience for our family. Will definitely continue." },
  { rating: 4, title: "Solid junior golf facility", body: "Nice course conditions and the junior rates are very reasonable. The staff is welcoming to young players and they have good beginner-friendly holes. Will be back." },
  { rating: 5, title: "Outstanding instruction", body: "The head instructor here is one of the best youth golf teachers I've ever seen. He has a natural gift for working with kids at all skill levels. My son's game has transformed." },
  { rating: 3, title: "Good but pricey", body: "The quality is there, no doubt. But the price point is high compared to other options in the area. If budget is a concern, look around before committing." },
];

export async function seedReviews(prisma: PrismaClient, authorIds: string[]) {
  const listings = await prisma.listing.findMany({ select: { id: true }, take: 50 });

  let count = 0;
  for (const listing of listings) {
    const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews per listing
    const shuffledAuthors = [...authorIds].sort(() => Math.random() - 0.5);
    const shuffledTemplates = [...REVIEW_TEMPLATES].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(numReviews, shuffledAuthors.length); i++) {
      const template = shuffledTemplates[i % shuffledTemplates.length];
      const authorId = shuffledAuthors[i];

      const existing = await prisma.review.findUnique({
        where: { listingId_authorId: { listingId: listing.id, authorId } },
      });
      if (!existing) {
        await prisma.review.create({
          data: { listingId: listing.id, authorId, ...template, isVerifiedVisit: Math.random() > 0.4 },
        });
        count++;
      }
    }
  }

  console.log(`✓ ${count} reviews seeded`);
}
