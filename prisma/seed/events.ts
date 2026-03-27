import { PrismaClient, EventType, SkillLevel } from "@prisma/client";

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(8, 0, 0, 0);
  return d;
}

function endDate(start: Date, hours = 5) {
  const d = new Date(start);
  d.setHours(d.getHours() + hours);
  return d;
}

function slug(title: string, city: string) {
  return `${title}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-seed";
}

const EVENTS: Array<{
  title: string; eventType: EventType; city: string; state: string;
  daysOut: number; ageDivisions: string[]; entryFee: number;
  description: string; skillLevels: SkillLevel[]; format?: string;
  tourAffiliation?: string; maxParticipants?: number;
}> = [
  { title: "DFW Junior Open Spring Classic", eventType: "TOURNAMENT", city: "Richardson", state: "TX", daysOut: 14, ageDivisions: ["10-11", "12-13", "14-15", "16-18"], entryFee: 7500, description: "18-hole stroke play tournament. Divisions for boys and girls. Cart included. Prizes for top finishers.", skillLevels: ["INTERMEDIATE", "COMPETITIVE"], format: "Stroke Play", tourAffiliation: "HJGT", maxParticipants: 120 },
  { title: "Beginner Clinic — Firewheel Golf Park", eventType: "CLINIC", city: "Garland", state: "TX", daysOut: 7, ageDivisions: ["5-9", "10-13"], entryFee: 2500, description: "4-week Saturday morning beginner clinic. All equipment provided. No experience necessary.", skillLevels: ["BEGINNER"], maxParticipants: 20 },
  { title: "Summer Intensive Junior Camp — DFW Academy", eventType: "CAMP", city: "Irving", state: "TX", daysOut: 30, ageDivisions: ["8-12", "13-17"], entryFee: 45000, description: "Full-week day camp with morning and afternoon sessions. Full swing, short game, putting, and on-course play.", skillLevels: ["BEGINNER", "INTERMEDIATE"], format: "Day Camp", maxParticipants: 40 },
  { title: "PGA Jr. League — Spring Season Draft Day", eventType: "LEAGUE", city: "Frisco", state: "TX", daysOut: 10, ageDivisions: ["7-13"], entryFee: 15000, description: "Sign up for team-format junior league. 6-week spring season with matches every Saturday.", skillLevels: ["BEGINNER", "INTERMEDIATE"], tourAffiliation: "PGA Jr. League", maxParticipants: 60 },
  { title: "North Texas Junior Amateur Championship", eventType: "TOURNAMENT", city: "McKinney", state: "TX", daysOut: 45, ageDivisions: ["12-14", "15-18"], entryFee: 10000, description: "36-hole stroke play event over two days at TPC Craig Ranch. One of the most prestigious junior events in North Texas.", skillLevels: ["COMPETITIVE"], format: "Stroke Play (36 holes)", maxParticipants: 80 },
  { title: "Drive Chip & Putt Qualifier — McKinney", eventType: "QUALIFIER", city: "McKinney", state: "TX", daysOut: 21, ageDivisions: ["7-9", "10-11", "12-13", "14-15"], entryFee: 0, description: "Official USGA/Augusta National Drive, Chip & Putt local qualifier. Top finishers advance to the sub-regional.", skillLevels: ["BEGINNER", "INTERMEDIATE", "COMPETITIVE"], tourAffiliation: "Drive Chip & Putt" },
  { title: "Girls Golf Leadership Clinic — Plano", eventType: "CLINIC", city: "Plano", state: "TX", daysOut: 12, ageDivisions: ["10-18"], entryFee: 2000, description: "Half-day clinic designed for girls ages 10–18. Focus on confidence, fundamentals, and networking.", skillLevels: ["BEGINNER", "INTERMEDIATE"] },
  { title: "US Kids Golf Regional — Dallas Metro", eventType: "TOURNAMENT", city: "Dallas", state: "TX", daysOut: 60, ageDivisions: ["5-6", "7-8", "9-10", "11-12", "13-14"], entryFee: 5000, description: "Official US Kids Golf regional event. Age-appropriate distances and categories for all levels.", skillLevels: ["BEGINNER", "INTERMEDIATE", "COMPETITIVE"], tourAffiliation: "US Kids Golf", format: "Stroke Play", maxParticipants: 150 },
  { title: "Back to School Junior Scramble", eventType: "SCRAMBLE", city: "Grapevine", state: "TX", daysOut: 8, ageDivisions: ["10-18"], entryFee: 3500, description: "Fun family scramble format. Team up with a parent or friend. Prizes, food, and good vibes.", skillLevels: ["BEGINNER", "INTERMEDIATE"], format: "4-Person Scramble", maxParticipants: 80 },
  { title: "Competitive Skills Camp — Sarah Kim Golf Academy", eventType: "CAMP", city: "Frisco", state: "TX", daysOut: 25, ageDivisions: ["13-18"], entryFee: 60000, description: "3-day intensive for serious junior competitors. Video analysis, on-course strategy, mental game, and tournament simulation.", skillLevels: ["COMPETITIVE"], format: "3-Day Intensive", maxParticipants: 12 },
  { title: "Fort Worth Junior City Championship", eventType: "TOURNAMENT", city: "Fort Worth", state: "TX", daysOut: 35, ageDivisions: ["10-11", "12-13", "14-15", "16-18"], entryFee: 6000, description: "Annual city championship tournament. Boys and girls divisions. Trophy ceremony post-round.", skillLevels: ["INTERMEDIATE", "COMPETITIVE"], format: "18-Hole Stroke Play", maxParticipants: 96 },
  { title: "Short Game Clinic — Elite Junior Golf Training", eventType: "CLINIC", city: "Plano", state: "TX", daysOut: 5, ageDivisions: ["12-18"], entryFee: 4000, description: "3-hour short game workshop covering chipping, pitching, bunker play, and putting. Max 8 students.", skillLevels: ["INTERMEDIATE", "COMPETITIVE"], maxParticipants: 8 },
  { title: "Parent & Child Golf Day — Tenison Park", eventType: "SCRAMBLE", city: "Dallas", state: "TX", daysOut: 17, ageDivisions: ["5-12"], entryFee: 5000, description: "9-hole scramble for parent/child teams. No experience necessary — comes with a pre-round clinic for beginners.", skillLevels: ["BEGINNER"], format: "9-Hole Scramble", maxParticipants: 40 },
  { title: "AJGA Qualifier — North Texas", eventType: "QUALIFIER", city: "Dallas", state: "TX", daysOut: 70, ageDivisions: ["12-14", "15-18"], entryFee: 0, description: "Official AJGA Performance Based Entry qualifier. 18-hole stroke play. Top 20% advance.", skillLevels: ["COMPETITIVE"], tourAffiliation: "AJGA", format: "Stroke Play" },
  { title: "Holiday Golf Camp — Littles Links", eventType: "CAMP", city: "Grapevine", state: "TX", daysOut: 90, ageDivisions: ["5-9"], entryFee: 25000, description: "3-day holiday camp for ages 5–9. Morning sessions, games, on-course play, and holiday prizes.", skillLevels: ["BEGINNER"], maxParticipants: 24 },
  { title: "Swing Speed Challenge — The Golf Lab DFW", eventType: "CLINIC", city: "Dallas", state: "TX", daysOut: 9, ageDivisions: ["13-18"], entryFee: 5000, description: "Overspeed training clinic using SuperSpeed Golf protocol. 2-hour session, limited to 6 students.", skillLevels: ["COMPETITIVE"], maxParticipants: 6 },
  { title: "Irving Junior Open", eventType: "TOURNAMENT", city: "Irving", state: "TX", daysOut: 28, ageDivisions: ["8-10", "11-13", "14-16", "17-18"], entryFee: 5500, description: "Twin Wells junior tournament series. 9 holes for 8-10, 18 holes for 11+. Breakfast included.", skillLevels: ["BEGINNER", "INTERMEDIATE", "COMPETITIVE"], format: "Stroke Play", maxParticipants: 100 },
  { title: "2v2 Junior Match Play Bracket — Garland", eventType: "TOURNAMENT", city: "Garland", state: "TX", daysOut: 42, ageDivisions: ["12-15", "16-18"], entryFee: 4000, description: "Unique 2v2 match play format. Teams of two compete against each other in Ryder Cup style.", skillLevels: ["INTERMEDIATE", "COMPETITIVE"], format: "2v2 Match Play", maxParticipants: 32 },
  { name: "College Recruiting Showcase — DFW", eventType: "SHOWCASE", city: "Southlake", state: "TX", daysOut: 55, ageDivisions: ["15-18"], entryFee: 15000, description: "18-hole competitive round observed by 10+ college coaches. Resume and highlight video submission included in fee.", skillLevels: ["COMPETITIVE"], maxParticipants: 40 } as never,
  { title: "Intro to Golf Clinic Series — Arlington", eventType: "CLINIC", city: "Arlington", state: "TX", daysOut: 3, ageDivisions: ["5-8", "9-12"], entryFee: 1500, description: "4-week intro series for absolute beginners. First lesson free! Equipment provided.", skillLevels: ["BEGINNER"], maxParticipants: 16 },
  { title: "Girls Only Junior League — Spring", eventType: "LEAGUE", city: "Frisco", state: "TX", daysOut: 20, ageDivisions: ["10-14", "15-18"], entryFee: 20000, description: "Dedicated girls-only junior league. 8-week season, weekly rounds at Frisco-area courses.", skillLevels: ["BEGINNER", "INTERMEDIATE"], format: "Weekly Match Play", maxParticipants: 30 },
  { title: "Mesquite Junior Golf Day", eventType: "TOURNAMENT", city: "Mesquite", state: "TX", daysOut: 15, ageDivisions: ["7-10", "11-13", "14-18"], entryFee: 3000, description: "Fun, low-pressure 9-hole tournament at Samuell Farm. Great for first-time competitors.", skillLevels: ["BEGINNER", "INTERMEDIATE"], format: "9-Hole Stroke Play", maxParticipants: 60 },
  { title: "Mental Game Workshop for Juniors", eventType: "CLINIC", city: "Plano", state: "TX", daysOut: 6, ageDivisions: ["12-18"], entryFee: 5000, description: "2-hour workshop with a certified sport psychologist. Topics: pre-shot routine, focus, managing nerves, post-round reflection.", skillLevels: ["INTERMEDIATE", "COMPETITIVE"], maxParticipants: 20 },
  { title: "Thanksgiving Family Golf Day", eventType: "SCRAMBLE", city: "Richardson", state: "TX", daysOut: 120, ageDivisions: ["5-18"], entryFee: 4500, description: "Annual Thanksgiving weekend family scramble. All ages welcome. Turkey prizes and family photos.", skillLevels: ["BEGINNER", "INTERMEDIATE"], format: "Family Scramble", maxParticipants: 80 },
  { title: "HJGT — Lone Star Junior Open", eventType: "TOURNAMENT", city: "McKinney", state: "TX", daysOut: 80, ageDivisions: ["10-12", "13-15", "16-18"], entryFee: 12500, description: "Hurricane Junior Golf Tour event. 36-hole competition across two courses. National ranking points.", skillLevels: ["COMPETITIVE"], format: "36-Hole Stroke Play", tourAffiliation: "HJGT", maxParticipants: 100 },
];

export async function seedEvents(prisma: PrismaClient, organizerId: string) {
  for (const e of EVENTS) {
    const title = (e as { title?: string; name?: string }).title ?? (e as { name?: string }).name ?? "Event";
    const s = slug(title, e.city);
    const startDate = daysFromNow(e.daysOut);
    await prisma.event.upsert({
      where: { slug: s },
      create: {
        slug: s,
        organizerId,
        title,
        description: e.description,
        eventType: e.eventType,
        city: e.city,
        state: e.state,
        dateStart: startDate,
        dateEnd: endDate(startDate, e.eventType === "CAMP" ? 8 : 5),
        ageDivisions: e.ageDivisions,
        skillLevels: e.skillLevels,
        entryFee: e.entryFee,
        maxParticipants: e.maxParticipants,
        spotsRemaining: e.maxParticipants,
        format: e.format,
        tourAffiliation: e.tourAffiliation,
        isPublished: true,
      },
      update: {},
    });
  }

  console.log(`✓ ${EVENTS.length} events seeded`);
}
