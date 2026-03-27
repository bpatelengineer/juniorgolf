import { PrismaClient, ListingType, SkillLevel, PriceTier } from "@prisma/client";

function slug(name: string, city: string) {
  const base = `${name}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base}-seed`;
}

function photo(name: string) {
  const label = encodeURIComponent(name.slice(0, 30));
  return `https://placehold.co/800x600/166534/ffffff?text=${label}`;
}

const DFW_LISTINGS: Array<{
  name: string; type: ListingType; city: string; lat: number; lng: number;
  address: string; ageMin?: number; ageMax?: number; skillLevels: SkillLevel[];
  priceTier: PriceTier; programTypes: string[]; description: string;
  phone?: string; website?: string;
}> = [
  // COURSES
  { name: "Sherrill Park Golf Course", type: "COURSE", city: "Richardson", lat: 32.9483, lng: -96.7131, address: "2001 N Coit Rd", ageMin: 5, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "LOW", programTypes: ["lessons", "leagues", "clinics"], description: "Family-friendly municipal course with a dedicated junior rate and youth leagues every summer.", phone: "972-234-1416", website: "https://example.com/sherrillpark" },
  { name: "Cowboys Golf Club", type: "COURSE", city: "Grapevine", lat: 32.9342, lng: -97.0787, address: "1600 Fairway Dr", ageMin: 8, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "HIGH", programTypes: ["lessons", "tournaments"], description: "Premier private-style course with junior membership program and competitive play opportunities.", phone: "817-481-7277" },
  { name: "Tenison Park Golf Course", type: "COURSE", city: "Dallas", lat: 32.8215, lng: -96.7284, address: "3501 Samuell Blvd", ageMin: 6, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "LOW", programTypes: ["lessons", "camps", "leagues"], description: "Historic Dallas municipal course with strong junior development programming year-round.", phone: "214-670-1401" },
  { name: "Pecan Valley Golf Club", type: "COURSE", city: "Fort Worth", lat: 32.7041, lng: -97.2861, address: "6400 Pecan Valley Dr", ageMin: 7, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "MEDIUM", programTypes: ["lessons", "clinics"], description: "Welcoming junior golf environment with affordable rates and knowledgeable staff.", phone: "817-249-1845" },
  { name: "Frisco Lakes Golf Course", type: "COURSE", city: "Frisco", lat: 33.1668, lng: -96.9108, address: "5290 W Stonebrook Pkwy", ageMin: 5, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE", "COMPETITIVE"], priceTier: "MEDIUM", programTypes: ["lessons", "leagues", "camps", "tournaments"], description: "Frisco's go-to junior golf destination with year-round programming and experienced instructors.", phone: "214-618-5555" },
  { name: "Twin Wells Golf Course", type: "COURSE", city: "Irving", lat: 32.8341, lng: -97.0211, address: "2000 E Shady Grove Rd", ageMin: 5, ageMax: 18, skillLevels: ["BEGINNER"], priceTier: "FREE", programTypes: ["lessons", "clinics", "leagues"], description: "City of Irving's junior golf headquarters. Free junior clinics every Saturday morning.", phone: "972-721-2501" },
  { name: "Bear Creek Golf Club", type: "COURSE", city: "Dallas", lat: 32.7895, lng: -97.0345, address: "3500 Bear Creek Ct", ageMin: 8, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "MEDIUM", programTypes: ["lessons", "tournaments", "leagues"], description: "36-hole facility with a thriving junior program and regular competitive events.", phone: "972-247-3667" },
  { name: "Firewheel Golf Park", type: "COURSE", city: "Garland", lat: 32.9260, lng: -96.6015, address: "600 W Campbell Rd", ageMin: 7, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE", "COMPETITIVE"], priceTier: "LOW", programTypes: ["lessons", "camps", "leagues", "tournaments"], description: "Four 18-hole courses and an active junior golf academy with weekly instruction.", phone: "972-205-2795" },
  { name: "Plantation Resort Golf Club", type: "COURSE", city: "Frisco", lat: 33.1502, lng: -96.8245, address: "3601 Plantation Dr", ageMin: 10, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "HIGH", programTypes: ["lessons", "clinics", "tournaments"], description: "Championship-caliber course hosting regional junior tournaments throughout the year.", phone: "972-335-4653" },
  { name: "TPC Craig Ranch", type: "COURSE", city: "McKinney", lat: 33.1968, lng: -96.7241, address: "8000 Alma Rd", ageMin: 10, ageMax: 18, skillLevels: ["COMPETITIVE"], priceTier: "HIGH", programTypes: ["lessons", "clinics", "tournaments"], description: "PGA Tour caliber course offering junior pathway programs for elite young golfers.", phone: "972-860-4902" },

  // RANGES
  { name: "Top Golf Dallas", type: "RANGE", city: "Dallas", lat: 32.9512, lng: -96.8234, address: "8787 Park Ln", ageMin: 5, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "MEDIUM", programTypes: ["clinics", "lessons"], description: "Gamified driving range with junior-specific bays and group lesson packages.", phone: "214-351-1460" },
  { name: "Drive Shack Roanoke", type: "RANGE", city: "Roanoke", lat: 32.9929, lng: -97.2301, address: "1400 Texas 114 Frontage Rd", ageMin: 5, ageMax: 18, skillLevels: ["BEGINNER"], priceTier: "MEDIUM", programTypes: ["clinics", "lessons"], description: "Outdoor tech-enabled range. Kids ages 5–12 play free with a paying adult on weekdays.", phone: "817-722-6600" },
  { name: "Arcis Golf Academy at Hackberry Creek", type: "RANGE", city: "Irving", lat: 32.8785, lng: -96.9834, address: "1901 W Royal Ln", ageMin: 6, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "MEDIUM", programTypes: ["lessons", "clinics", "camps"], description: "Full-service practice facility with launch monitors, short game area, and dedicated junior bays.", phone: "972-869-2631" },
  { name: "Stonebriar Driving Range", type: "RANGE", city: "Frisco", lat: 33.1205, lng: -96.8912, address: "6001 Lebanon Rd", ageMin: 5, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "LOW", programTypes: ["lessons", "clinics"], description: "Affordable, no-frills range used by dozens of local junior coaches for weekly instruction.", phone: "972-668-3700" },
  { name: "Plano Municipal Range", type: "RANGE", city: "Plano", lat: 33.0198, lng: -96.6989, address: "4501 E 14th St", ageMin: 5, ageMax: 18, skillLevels: ["BEGINNER"], priceTier: "FREE", programTypes: ["clinics", "lessons"], description: "City-operated range with free junior nights every Tuesday. Clubs available to borrow.", phone: "972-941-7160" },

  // COACHES
  { name: "Mike Torres Golf Instruction", type: "COACH", city: "Richardson", lat: 32.9622, lng: -96.7315, address: "Sherrill Park Golf Course", ageMin: 5, ageMax: 14, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "MEDIUM", programTypes: ["lessons", "clinics"], description: "PGA Class A professional specializing in beginner and youth golfers. Patient, fun, and results-driven.", phone: "214-555-0101" },
  { name: "Sarah Kim Golf Academy", type: "COACH", city: "Frisco", lat: 33.1502, lng: -96.8245, address: "Plantation Resort Golf Club", ageMin: 13, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "HIGH", programTypes: ["lessons", "clinics", "recruiting"], description: "Former LPGA Teaching Pro. Focuses on competitive junior development and college recruiting preparation.", phone: "214-555-0202" },
  { name: "PGA Jr. League at Firewheel", type: "COACH", city: "Garland", lat: 32.9260, lng: -96.6015, address: "600 W Campbell Rd", ageMin: 7, ageMax: 13, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "MEDIUM", programTypes: ["leagues", "clinics"], description: "Official PGA Jr. League team-format play. Spring and fall seasons available. Fun, inclusive, team-based golf for ages 7–13.", phone: "972-205-2795" },
  { name: "Josh Harper Golf — Private Lessons", type: "COACH", city: "Southlake", lat: 32.9412, lng: -97.1340, address: "Timarron Country Club", ageMin: 8, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE", "COMPETITIVE"], priceTier: "HIGH", programTypes: ["lessons"], description: "TPI-certified coach with 15 years of junior teaching experience. Available for semi-private and group instruction.", phone: "817-555-0303" },
  { name: "Angela Price Golf Coaching", type: "COACH", city: "McKinney", lat: 33.2110, lng: -96.6498, address: "Westridge Golf Course", ageMin: 5, ageMax: 12, skillLevels: ["BEGINNER"], priceTier: "LOW", programTypes: ["lessons", "clinics"], description: "Specializes in introducing kids ages 5–12 to golf. Focus on fun, fundamentals, and love of the game.", phone: "972-555-0404" },
  { name: "Elite Junior Golf Training", type: "COACH", city: "Plano", lat: 33.0365, lng: -96.7498, address: "Gleneagles Country Club", ageMin: 12, ageMax: 18, skillLevels: ["COMPETITIVE"], priceTier: "HIGH", programTypes: ["lessons", "clinics", "tournaments", "recruiting"], description: "Elite performance coaching for competitive juniors pursuing AJGA and college golf. Customized training plans.", phone: "972-555-0505" },
  { name: "Kids First Golf Academy", type: "COACH", city: "Arlington", lat: 32.7357, lng: -97.1081, address: "Top Golf Arlington", ageMin: 5, ageMax: 10, skillLevels: ["BEGINNER"], priceTier: "LOW", programTypes: ["lessons", "camps", "clinics"], description: "Every child's first golf experience should be magical. We specialize in 5–10 year olds. No experience needed.", phone: "817-555-0606" },

  // ACADEMIES
  { name: "IMG Academy Junior Golf — DFW Affiliate", type: "ACADEMY", city: "Frisco", lat: 33.1550, lng: -96.7890, address: "5780 Legacy Dr", ageMin: 10, ageMax: 18, skillLevels: ["COMPETITIVE"], priceTier: "HIGH", programTypes: ["camps", "clinics", "tournaments", "recruiting"], description: "Elite summer and winter intensive camps affiliated with IMG. Video analysis, fitness, mental performance, and college prep.", phone: "972-555-0707" },
  { name: "DFW Junior Golf Academy", type: "ACADEMY", city: "Irving", lat: 32.8560, lng: -96.9945, address: "2001 Conflans Rd", ageMin: 6, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE", "COMPETITIVE"], priceTier: "MEDIUM", programTypes: ["camps", "lessons", "clinics", "leagues", "tournaments"], description: "The largest junior golf academy in North Texas. Year-round programming, 12 certified instructors, and 400+ junior members.", phone: "972-555-0808" },
  { name: "Littles Links Golf Camp", type: "ACADEMY", city: "Grapevine", lat: 32.9135, lng: -97.0812, address: "1900 Fairway Ct", ageMin: 5, ageMax: 9, skillLevels: ["BEGINNER"], priceTier: "LOW", programTypes: ["camps", "clinics"], description: "Week-long summer day camps for ages 5–9. Morning and afternoon sessions. Fun-first approach with games, prizes, and short-hole play.", phone: "817-555-0909" },
  { name: "US Kids Golf Learning Center — Plano", type: "ACADEMY", city: "Plano", lat: 33.0475, lng: -96.8034, address: "3401 E Parker Rd", ageMin: 5, ageMax: 12, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "MEDIUM", programTypes: ["lessons", "clinics", "camps", "leagues"], description: "Official US Kids Golf Learning Center. Age-appropriate equipment, tee boxes, and world-class curriculum for golfers under 12.", phone: "972-555-1010" },
  { name: "College Bound Golf Academy", type: "ACADEMY", city: "Southlake", lat: 32.9298, lng: -97.1405, address: "2200 E Dove Rd", ageMin: 14, ageMax: 18, skillLevels: ["COMPETITIVE"], priceTier: "HIGH", programTypes: ["lessons", "clinics", "recruiting", "tournaments"], description: "Exclusively focused on helping high school golfers earn college scholarships. Tournament strategy, recruiting profiles, and coach connections.", phone: "817-555-1111" },
  { name: "Swing Smart Junior Academy", type: "ACADEMY", city: "Dallas", lat: 32.9134, lng: -96.7523, address: "10001 Royal Ln", ageMin: 7, ageMax: 17, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "MEDIUM", programTypes: ["camps", "clinics", "lessons"], description: "Technology-driven junior instruction using TrackMan and video analysis. Small group settings (max 4 per instructor).", phone: "214-555-1212" },

  // TEAMS
  { name: "Highland Park HS Golf Team", type: "TEAM", city: "Dallas", lat: 32.8340, lng: -96.7943, address: "4220 Emerson Ave", ageMin: 14, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "FREE", programTypes: ["leagues", "tournaments"], description: "UIL 5A boys and girls golf teams. Open tryouts in August. Competing in the DISD Athletic District.", phone: "214-780-4900" },
  { name: "Plano Senior HS Golf Team", type: "TEAM", city: "Plano", lat: 33.0370, lng: -96.6987, address: "2200 Independence Pkwy", ageMin: 14, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "FREE", programTypes: ["leagues", "tournaments"], description: "Perennial UIL 6A state contenders. Boys and girls programs. Tryouts in late August.", phone: "469-752-9000" },
  { name: "Southlake Carroll HS Golf Team", type: "TEAM", city: "Southlake", lat: 32.9411, lng: -97.1422, address: "1501 W Southlake Blvd", ageMin: 14, ageMax: 18, skillLevels: ["COMPETITIVE"], priceTier: "FREE", programTypes: ["leagues", "tournaments"], description: "State-ranked UIL 6A program. Dragons golf alumni play at D1 programs across the country.", phone: "817-949-5400" },
  { name: "Frisco Centennial HS Golf", type: "TEAM", city: "Frisco", lat: 33.1685, lng: -96.8218, address: "350 W Stonebrook Pkwy", ageMin: 14, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "FREE", programTypes: ["leagues", "tournaments"], description: "Growing UIL 6A program in one of Texas's fastest-growing school districts.", phone: "469-633-5900" },
  { name: "Fort Worth Paschal HS Golf", type: "TEAM", city: "Fort Worth", lat: 32.7152, lng: -97.3679, address: "3001 Forest Park Blvd", ageMin: 14, ageMax: 18, skillLevels: ["INTERMEDIATE"], priceTier: "FREE", programTypes: ["leagues", "tournaments"], description: "Proud UIL 5A program in Fort Worth. Both boys and girls teams compete in district play.", phone: "817-814-1600" },

  // Additional COURSES
  { name: "Waterchase Golf Club", type: "COURSE", city: "Fort Worth", lat: 32.6845, lng: -97.3201, address: "8951 Creek Run Rd", ageMin: 6, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "MEDIUM", programTypes: ["lessons", "leagues", "clinics"], description: "Welcoming family club with weekend junior clinics and summer day camps.", phone: "817-346-1700" },
  { name: "Iron Horse Golf Course", type: "COURSE", city: "North Richland Hills", lat: 32.8601, lng: -97.2187, address: "6200 Skylark Circle", ageMin: 7, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "LOW", programTypes: ["lessons", "camps", "leagues"], description: "Affordable North Richland Hills municipal course with active junior golf league.", phone: "817-485-6666" },
  { name: "Tangle Ridge Golf Club", type: "COURSE", city: "Grand Prairie", lat: 32.6856, lng: -97.0123, address: "818 Tangle Ridge Dr", ageMin: 8, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "MEDIUM", programTypes: ["lessons", "tournaments"], description: "Semi-private course with challenging layout and junior tournament series in the summer.", phone: "972-299-6837" },
  { name: "Mansfield National Golf Club", type: "COURSE", city: "Mansfield", lat: 32.5634, lng: -97.1012, address: "3750 National Pkwy", ageMin: 9, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "MEDIUM", programTypes: ["lessons", "clinics", "tournaments"], description: "Scenic course with dedicated junior golf program run by PGA professionals.", phone: "817-477-3566" },
  { name: "Samuell Farm Golf Course", type: "COURSE", city: "Mesquite", lat: 32.7801, lng: -96.5743, address: "6800 Samuell Blvd", ageMin: 5, ageMax: 18, skillLevels: ["BEGINNER"], priceTier: "FREE", programTypes: ["clinics", "lessons"], description: "City of Mesquite junior golf hub. Free beginner clinics for ages 5–12 every weekday morning in summer.", phone: "972-270-5833" },

  // More coaches
  { name: "Derek Okafor Golf Lessons", type: "COACH", city: "Garland", lat: 32.9040, lng: -96.6523, address: "Firewheel Golf Park", ageMin: 6, ageMax: 16, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "MEDIUM", programTypes: ["lessons", "clinics"], description: "Energetic coach with a talent for teaching kids who are new to the game. Patience and humor his specialties.", phone: "972-555-2020" },
  { name: "Rachel Nguyen Junior Golf", type: "COACH", city: "Allen", lat: 33.1018, lng: -96.6711, address: "Courses at Watters Creek", ageMin: 8, ageMax: 18, skillLevels: ["BEGINNER", "INTERMEDIATE", "COMPETITIVE"], priceTier: "MEDIUM", programTypes: ["lessons", "clinics", "camps"], description: "LPGA Teaching Professional offering individual and small-group lessons. Specializes in girls golf development.", phone: "214-555-2121" },
  { name: "Carlos Mendez Golf Coaching", type: "COACH", city: "Grand Prairie", lat: 32.7456, lng: -97.0201, address: "Lynn Creek Park Golf Center", ageMin: 5, ageMax: 18, skillLevels: ["BEGINNER"], priceTier: "LOW", programTypes: ["lessons", "clinics"], description: "Bilingual (English/Spanish) PGA pro making golf accessible to all families. Sliding scale pricing available.", phone: "817-555-2222" },
  { name: "The Golf Lab DFW", type: "ACADEMY", city: "Dallas", lat: 32.8512, lng: -96.8234, address: "5001 Spring Valley Rd", ageMin: 10, ageMax: 18, skillLevels: ["INTERMEDIATE", "COMPETITIVE"], priceTier: "HIGH", programTypes: ["lessons", "clinics", "camps"], description: "Indoor training studio with Trackman, SAM PuttLab, and K-VEST. Year-round instruction regardless of weather.", phone: "214-555-2323" },
  { name: "Drive Chip & Putt Skills Center", type: "ACADEMY", city: "McKinney", lat: 33.1823, lng: -96.7345, address: "TPC Craig Ranch", ageMin: 7, ageMax: 15, skillLevels: ["BEGINNER", "INTERMEDIATE"], priceTier: "LOW", programTypes: ["clinics", "tournaments"], description: "Official Drive, Chip & Putt qualifier site. Prepares juniors for USGA/Augusta National competition.", phone: "972-555-2424" },
];

export async function seedListings(prisma: PrismaClient) {
  for (const l of DFW_LISTINGS) {
    const s = slug(l.name, l.city);
    const listing = await prisma.listing.upsert({
      where: { slug: s },
      create: {
        slug: s,
        name: l.name,
        type: l.type,
        city: l.city,
        state: "TX",
        address: l.address,
        lat: l.lat,
        lng: l.lng,
        phone: l.phone,
        website: l.website,
        description: l.description,
        ageMin: l.ageMin,
        ageMax: l.ageMax,
        skillLevels: l.skillLevels,
        priceTier: l.priceTier,
        programTypes: l.programTypes,
        isJuniorFriendly: true,
        isActive: true,
      },
      update: {},
    });

    // Add primary photo
    const existingPhoto = await prisma.listingPhoto.findFirst({ where: { listingId: listing.id } });
    if (!existingPhoto) {
      await prisma.listingPhoto.create({
        data: {
          listingId: listing.id,
          s3Key: `seed/${s}.jpg`,
          url: photo(l.name),
          isPrimary: true,
          caption: l.name,
        },
      });
    }
  }

  console.log(`✓ ${DFW_LISTINGS.length} listings seeded`);
  return DFW_LISTINGS;
}
