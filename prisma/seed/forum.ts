import { PrismaClient } from "@prisma/client";

const COMMUNITIES = [
  { slug: "beginner-parents", name: "Beginner Parents", description: "New to junior golf? Ask questions, share tips, and get advice from experienced golf families.", iconUrl: "👨‍👧", isDefault: true },
  { slug: "competitive-juniors", name: "Competitive Juniors", description: "For junior golfers playing tournaments, chasing rankings, and aiming for college golf.", iconUrl: "🏆", isDefault: false },
  { slug: "coaches-corner", name: "Coaches Corner", description: "Discussion for coaches, instructors, and anyone teaching junior golfers.", iconUrl: "🏌️", isDefault: false },
  { slug: "equipment-gear", name: "Equipment & Gear", description: "Club recommendations, fitting questions, bags, shoes, and everything equipment.", iconUrl: "🛠️", isDefault: true },
  { slug: "tournament-results", name: "Tournament Results", description: "Share your scores, post results, and celebrate achievements.", iconUrl: "📊", isDefault: false },
  { slug: "college-recruiting", name: "College Recruiting", description: "NCSA, recruiting profiles, college coach outreach, NCAA eligibility questions.", iconUrl: "🎓", isDefault: false },
  { slug: "dfw-region", name: "DFW Region", description: "Local talk for Dallas-Fort Worth junior golfers, families, and coaches.", iconUrl: "🌵", isDefault: true },
];

const POSTS = [
  { communitySlug: "beginner-parents", flair: "QUESTION" as const, title: "What age is good to start golf?", body: "My daughter just turned 6. Is that too young to start lessons? We want to make it fun, not a chore. Any advice from parents who've been there?" },
  { communitySlug: "beginner-parents", flair: "TIPS" as const, title: "Tips for keeping a 7-year-old engaged on the course", body: "Our son loves practicing at the range but loses interest after 3 holes on a real course. We've tried games, but looking for more ideas. What works for your family?" },
  { communitySlug: "beginner-parents", flair: "REVIEW" as const, title: "Great experience at DFW Junior Golf Academy", body: "We enrolled our 9-year-old for the summer camp last month and couldn't be happier. The instructors are patient, the curriculum is fun, and he's made friends who love golf too. 5 stars!" },
  { communitySlug: "competitive-juniors", flair: "TOURNAMENT_REPORT" as const, title: "Shot 74 at the DFW Junior Open — tips to break 70?", body: "Just got back from my first 18-hole tournament. Hit some greens but 3-putted 6 times. Anyone have drills specifically for lag putting under pressure? My handicap is 4.2." },
  { communitySlug: "competitive-juniors", flair: "RECRUITING" as const, title: "D3 vs NAIA — where do most AJGA players end up?", body: "I'm a 16yo shooting mid-70s consistently. I've visited a few D3 programs and one NAIA school. Curious what people know about the realistic landing spots for someone at my level." },
  { communitySlug: "competitive-juniors", flair: "QUESTION" as const, title: "How do you manage school during tournament season?", body: "Spring semester is brutal — AJGA events, AP exams, and college visits all at once. How do other competitive juniors balance academics and golf?" },
  { communitySlug: "coaches-corner", flair: "TIPS" as const, title: "Best drills for teaching a 8-year-old to chip", body: "I have a student who is improving fast with the full swing but struggles with any kind of chipping. He tends to scoop. Looking for fun, game-like drills to fix the scoop without making it feel like work." },
  { communitySlug: "coaches-corner", flair: "QUESTION" as const, title: "Resources for teaching mental game to 10-12 year olds?", body: "Starting to incorporate pre-shot routines and breathing techniques with my intermediate groups. Looking for book or video recommendations specifically aimed at the 10–12 age range." },
  { communitySlug: "equipment-gear", flair: "QUESTION" as const, title: "Best fitted junior clubs for a 12-year-old, 5'2\"?", body: "Our son outgrew his starter set. He's 5'2\" and has been playing for 2 years with a 12 handicap. Should we get another full junior set or start mixing in adult clubs? Budget around $500." },
  { communitySlug: "equipment-gear", flair: "REVIEW" as const, title: "U.S. Kids Tour Series review — great for ages 10-12", body: "Picked up the U.S. Kids Tour Series irons for my 11-year-old daughter after getting fitted at the US Kids Golf Learning Center in Plano. The fitting was free and the clubs are noticeably more forgiving than her old set." },
  { communitySlug: "tournament-results", flair: "TOURNAMENT_REPORT" as const, title: "Results — Irving Junior Open, this weekend", body: "Flight A (14-18): 1st place Tyler M. (-2), 2nd place Sofia R. (+1), 3rd Jason T. (+3). Flight B (11-13): 1st Maya K. (+5). Great conditions, fast greens. Full results on the Firewheel website." },
  { communitySlug: "college-recruiting", flair: "QUESTION" as const, title: "When should I start emailing college coaches?", body: "My son is a sophomore shooting in the low 80s. Someone told us the recruiting process for golf starts in freshman year. Is that true? When is too early or too late?" },
  { communitySlug: "college-recruiting", flair: "TIPS" as const, title: "What college coaches actually look for — from a coach's perspective", body: "I've had 3 former students sign NLI this year. Here's what the coaches told us they prioritize: 1) Attitude and coachability 2) Academic eligibility 3) Consistent scoring over flashy rounds. Happy to answer questions." },
  { communitySlug: "dfw-region", flair: "QUESTION" as const, title: "Best junior-friendly courses in DFW for a 10-year-old?", body: "Moving to Frisco in August. Looking for courses with good junior rates, forgiving layouts, and a welcoming atmosphere. Son has been playing for 2 years, shoots around 55–60 for 9 holes." },
  { communitySlug: "dfw-region", flair: "NEWS" as const, title: "Firewheel Golf Park adding junior academy expansion", body: "Heard from one of the coaches that Firewheel is adding a dedicated junior practice area with a short course, putting green, and covered range bays specifically for kids. Opening expected this fall." },
];

export async function seedForum(prisma: PrismaClient, authorId: string) {
  const communityMap = new Map<string, string>();

  for (const c of COMMUNITIES) {
    const comm = await prisma.forumCommunity.upsert({
      where: { slug: c.slug },
      create: c,
      update: {},
    });
    communityMap.set(c.slug, comm.id);
  }

  for (const p of POSTS) {
    const communityId = communityMap.get(p.communitySlug);
    if (!communityId) continue;
    const existing = await prisma.post.findFirst({ where: { communityId, title: p.title } });
    if (!existing) {
      await prisma.post.create({
        data: { communityId, authorId, flair: p.flair, title: p.title, body: p.body },
      });
    }
  }

  console.log(`✓ ${COMMUNITIES.length} communities + ${POSTS.length} posts seeded`);
}
