# Product Requirements Document
## JuniorLinks — The Youth Golf Discovery & Community Platform

**Version:** 2.0
**Date:** June 10, 2026
**Status:** Draft

**Changelog**
| Version | Date | Changes |
|---|---|---|
| 1.0 | March 27, 2026 | Initial draft: problem, features, architecture, monetization, launch plan |
| 2.0 | June 10, 2026 | Added user stories & acceptance criteria, MVP prioritization (MoSCoW), non-functional requirements, data acquisition strategy, notifications & personalization, design principles, go-to-market plan, and non-goals |

---

## 1. Executive Summary

JuniorLinks is a centralized web and mobile platform that aggregates, maps, and surfaces every youth golf resource in a region — and ultimately nationwide. It combines the discovery mechanics of Yelp, the event management of Eventbrite, the community-driven discussion of Reddit, and the visual storytelling of Instagram into one purpose-built destination for junior golfers, parents, coaches, and tournament organizers.

The platform solves a fragmented information landscape where a parent searching for junior lessons, a coach looking to list a clinic, or a 14-year-old trying to find a local tournament must piece together results from a dozen disconnected websites, Facebook groups, state golf association PDFs, and word-of-mouth.

---

## 2. Problem Statement

### 2.1 Who Is Affected

| Persona | Pain Point |
|---|---|
| **Parent of junior golfer (age 6–17)** | Cannot find beginner lessons, junior rates, or age-appropriate events in one place |
| **Junior golfer (age 12–18)** | No centralized feed for tournaments, rankings, peer content, or college recruiting resources |
| **Junior golf coach / instructor** | No low-cost channel to market clinics and grow a junior student base |
| **Tournament organizer** | Fragmented registration platforms; hard to reach junior golfers outside own network |
| **Golf facility (course, range, academy)** | No dedicated youth-facing profile page to showcase junior programs |
| **High school golf coach** | Difficult to find scrimmage partners, scheduling tools, or recruiting exposure for players |

### 2.2 The Fragmentation Problem

- State golf associations publish static tournament calendars as PDFs
- Lesson listings are buried in facility websites with no standardized format
- Junior tour results live across AJGA, HJGT, Polo Golf, PGA Jr. League, US Kids Golf, Drive Chip & Putt, and dozens of regional tours — each with its own silo
- Community discussion happens in scattered Facebook groups and Discord servers
- There is no equivalent of "Yelp for junior golf" — no reviews, no photos, no hours, no age/skill metadata

---

## 3. Vision & Goals

**Vision:** Become the definitive platform where every youth golf journey begins — from a child's first lesson to a college scholarship.

### 3.1 Business Goals (Year 1–3)

| Goal | Target |
|---|---|
| Regional launch (1 metro area) | Month 3 |
| Statewide coverage | Month 9 |
| 10-state coverage | Month 18 |
| Nationwide coverage | Month 36 |
| 100,000 registered users | Month 18 |
| 500 verified facility/coach listings | Month 12 |
| Revenue-positive (freemium + ads) | Month 18 |

### 3.2 Product Goals

1. Reduce time-to-discovery for any youth golf resource to under 60 seconds
2. Surface hyper-local, age-appropriate, and skill-level-appropriate results by default
3. Give coaches and facilities a free, high-quality presence without technical overhead
4. Create a moderated community layer that parents trust and kids want to use
5. Become the authoritative data layer for junior golf results and rankings

---

## 4. Target Audience & Personas

### 4.1 Primary Users

**Parents (ages 30–50)**
- Driving the decision for lessons, camps, and equipment
- Value trust signals: reviews, verified credentials, proximity, pricing transparency
- Use mobile on the go; use web for research

**Junior Golfers (ages 10–18)**
- Self-directed discovery of tournaments, peers, content
- Motivated by competition, social recognition, and college recruiting visibility
- High Instagram/TikTok literacy; low tolerance for friction

### 4.2 Secondary Users (Supply Side)

**Coaches & Instructors**
- Want inbound leads and a professional profile page
- Willing to pay for premium placement if ROI is clear

**Tournament Organizers**
- Need free or low-cost event publishing and registration tooling
- Want verified audience (junior golfers + parents, not general golf population)

**Golf Facilities (Courses, Ranges, Academies)**
- Want to showcase junior programs, photos, and pricing
- Will pay for featured placement or verified badge

### 4.3 Reference Personas

| Persona | Snapshot | Primary Job-to-be-Done |
|---|---|---|
| **"Newcomer Nina"** — parent, 38, no golf background | Daughter (8) wants to try golf after a school clinic | "Find a beginner-friendly, affordable first lesson within 20 minutes of home that I can trust" |
| **"Competitive Carlos"** — junior, 15, 4.2 handicap | Plays HJGT and state events; targeting D1 recruiting | "Find every tournament that strengthens my resume and get my results in front of college coaches" |
| **"Coach Dana"** — PGA professional, 44 | Teaches at a public course; wants 10 more junior students | "Fill my weekend junior clinics without spending money on Facebook ads" |
| **"Organizer Omar"** — runs a regional junior tour | 22 events/year, registration via spreadsheets + email | "Publish my season schedule once and reach every junior golfer in the metro" |

---

## 5. User Stories & Acceptance Criteria

Stories are grouped by persona. Priority refers to the MoSCoW scoping in Section 7.

### 5.1 Parent Stories

**P1 (Must) — Discover nearby resources**
> As a parent, I want to see all junior golf lessons, programs, and facilities near me on a map, filtered by my child's age and skill level, so that I can shortlist options in one sitting.

Acceptance criteria:
- Map and list views load within 2 seconds on a median mobile connection
- Filters: resource type, age range, skill level, price tier, distance radius (5/10/25/50 mi)
- Empty-state messaging with a "request coverage in my area" action when fewer than 3 results match
- Results are sorted by a relevance blend of distance, rating, and profile completeness (not pure distance)

**P2 (Must) — Evaluate a listing**
> As a parent, I want each listing to show photos, reviews, pricing, age range, and contact info, so I can decide without calling around.

Acceptance criteria:
- Listing page shows: name, address, hours, age range, skill levels, price tier, programs, photos, star rating, written reviews, verification badges
- "Contact" action (call, email, or in-platform message) is reachable in ≤2 taps from search results
- Unverified or unclaimed listings are visibly labeled as such

**P3 (Should) — Leave a trusted review**
> As a parent, I want to review a facility or coach after a visit, so other parents benefit from my experience.

Acceptance criteria:
- Review requires a registered account with a completed profile
- Optional "verified visit" badge when review is geotagged at the facility
- Reviews are flaggable; flagged reviews enter a moderation queue with 24-hour SLA

**P4 (Must) — Manage my child's account safely**
> As a parent, I want to create and control my child's profile, so their data and visibility stay within limits I set.

Acceptance criteria:
- Under-13 accounts require verified parental consent before activation (COPPA flow)
- Junior profiles default to private; public visibility requires explicit parent approval
- Parent dashboard shows the child's followers, messages (if enabled), and posted content

### 5.2 Junior Golfer Stories

**J1 (Must) — Find tournaments that fit me**
> As a junior golfer, I want a personalized feed of tournaments matching my age division, skill level, and travel radius, so I never miss a registration deadline.

Acceptance criteria:
- Feed respects profile attributes: age, handicap (if set), home location, travel radius
- Each event card shows date, location, age divisions, entry fee, format, and spots remaining
- "Save" adds the event to an in-app list and offers a calendar export (ICS)
- Notification fires at a configurable interval before the registration deadline (default: 7 days)

**J2 (Should) — Build my golf identity**
> As a junior golfer, I want a profile with my handicap, results history, and highlights, so coaches and peers can see my progress.

Acceptance criteria:
- Profile supports: handicap index (verified via GHIN where available, self-reported otherwise — badged differently), home course, tournament results timeline, photo/video highlights
- Visibility controlled by parent for minors (see P4)

**J3 (Could) — Share and engage**
> As a junior golfer, I want to post round highlights and follow friends, coaches, and tours, so the platform is somewhere I want to hang out, not just a directory.

Acceptance criteria:
- Photo and ≤60-second video posts, geotaggable to a course
- Minor-posted content passes a moderation queue before public display
- No direct messages between adults and minors without parental opt-in

### 5.3 Coach Stories

**C1 (Must) — Claim and complete my listing**
> As a coach, I want to claim my listing, verify my credentials, and publish my offerings in under 15 minutes, so I get inbound leads with no technical work.

Acceptance criteria:
- Claim flow: search self → claim → verify (PGA lookup or document upload) → complete profile → publish
- Profile completeness meter with concrete prompts ("add 3 photos", "set age groups")
- Verified credential badge displayed within 48 hours of submission

**C2 (Should) — Publish and fill clinics**
> As a coach, I want to publish clinics with capacity limits and accept registrations, so I can fill sessions without spreadsheets.

Acceptance criteria:
- Event creation with recurring templates; capacity and waitlist support
- Registrant list export (CSV); attendee notifications on changes/cancellations

**C3 (Could) — Understand my ROI**
> As a coach, I want analytics on profile views, contact clicks, and registrations, so I can judge whether premium placement is worth it.

### 5.4 Organizer Stories

**O1 (Must) — Publish events once, reach everyone**
> As an organizer, I want to publish my event schedule to a platform juniors already search, so my fields fill without buying ads.

Acceptance criteria:
- Bulk event creation (CSV import or season template)
- Events appear in search, map, calendar, and matching users' personalized feeds within 5 minutes of publishing
- External registration links supported in MVP; in-platform registration in Phase 2

**O2 (Should) — Post results**
> As an organizer, I want to upload results post-event, so player profiles update and my tour gains visibility.

### 5.5 College Coach Stories (Phase 3+)

**R1 (Could) — Search recruits**
> As a verified college coach, I want to filter junior profiles by grad year, handicap, region, and academics, so I can build a recruiting pipeline efficiently.

Acceptance criteria:
- College coach accounts require institutional verification before any minor profile access
- Only profiles with the parent-approved "recruiting profile" toggle enabled are visible

---

## 6. Core Features

### 6.1 Discovery Map (Yelp Layer)

**Resource types indexed:**
- Golf courses with junior rates / junior programs
- Driving ranges and practice facilities
- PGA/independent instructors with junior specialization
- Junior golf academies and summer camps
- High school golf teams
- Junior golf tours and governing bodies

**Each listing includes:**
- Name, address, phone, website, hours
- Distance from user location
- Age range served (e.g., 5–18, 13+)
- Skill level (beginner, intermediate, competitive)
- Price range tier ($, $$, $$$)
- Program types (lessons, clinics, leagues, camps, tournaments)
- Photos (user-uploaded and facility-uploaded)
- Star rating + written reviews
- "Is this junior-friendly?" verified badge
- Accessibility / accommodations info

**Map UI:**
- Interactive map (Mapbox) with pin clustering
- Filter sidebar: resource type, age, skill level, price, distance radius, availability
- List view / map view toggle
- "Near me" as default; city/zip search fallback

### 6.2 Events & Tournaments (Eventbrite Layer)

**Event types:**
- Local tournaments (9-hole, 18-hole, scrambles)
- Clinics and group lessons
- Junior golf leagues (PGA Jr. League, US Kids, regional)
- Camps (day camps, overnight camps, skill camps)
- College recruiting showcases
- Parent/child scrambles
- Drive Chip & Putt qualifiers

**Event listing fields:**
- Title, description, date/time, location
- Age divisions / skill level
- Registration deadline and link (or in-platform registration)
- Entry fee
- Maximum field size / spots remaining
- Format (stroke play, match play, scramble, etc.)
- Tour / series affiliation
- Photos and recap content post-event

**Discovery features:**
- Calendar view and list view
- "Events near me this weekend" smart feed
- Push/email notifications for upcoming events matching user profile
- RSVP / Save to calendar
- Waitlist for sold-out events

**Organizer tools (free tier):**
- Create and publish events
- Manage registrations and attendance list
- Post-event photo/results upload
- Recurring event templates

### 6.3 Community Forum (Reddit Layer)

**Structure:**
- Top-level communities: Beginner Parents, Competitive Juniors, Coaches Corner, Equipment & Gear, Tournament Results, College Recruiting, Regional Hubs
- Threaded posts with upvoting
- Flair tags: Question, Review, Tournament Report, Tips, Recruiting, News

**Moderation model:**
- Community moderators (volunteer) + platform trust & safety team
- Strict no-spam, no-recruiting-DM, no-adult-solicitation policies
- Age-gated content: adult-only threads require verified adult account
- Junior profiles (under 13) are COPPA-compliant with limited public visibility

**Discovery:**
- Regional subreddit auto-subscribed based on location
- "Rising" feed for trending content in your area
- Weekly digest email

### 6.4 Social Feed (Instagram Layer)

**Content types:**
- Photo and short video posts (max 60 seconds)
- Round scorecards / shot highlights
- Swing breakdowns and tips
- Tournament recap reels
- Course review videos

**Social graph:**
- Follow players, coaches, facilities, and tours
- Public profiles for players (18+) or parent-managed public profiles for juniors
- Hashtags: #juniorgolf #firsthole #ajgatour #puttinglesson etc.
- Geotag to course/facility

**Athlete profile:**
- GHIN handicap index (verified via USGA API)
- Tournament history and results
- Home course
- Coaches and academies attended
- "Recruiting profile" toggle (visible to college coaches)

### 6.5 Recruiting Hub

- Junior golfer creates a recruiting profile (public, opt-in)
- College coaches (verified) can search by grad year, handicap, region, GPA range
- Juniors can express interest in programs
- Tournament results auto-populate from connected tour results feeds
- Highlight video upload
- SAT/ACT / GPA fields (optional)

### 6.6 Results & Rankings Feed

**Aggregated from:**
- AJGA
- US Kids Golf
- HJGT
- PGA Jr. League
- Drive Chip & Putt
- Polo Golf Junior Tour
- State amateur associations (scraped or API, where available)
- User-reported scores (unverified, badged differently)

**Display:**
- National and state leaderboards by age/gender
- Player profile results timeline
- "How did my child's score compare to the field?" contextual scoring

---

## 7. MVP Scope & Feature Prioritization (MoSCoW)

The single biggest product risk is building all four "layers" (Yelp, Eventbrite, Reddit, Instagram) at once and shipping none of them well. The MVP is the **Yelp layer plus a read-only Eventbrite layer** — discovery is the wedge; community and social follow once there is something to talk about.

### Must Have (MVP — Phase 1)

| Feature | Rationale |
|---|---|
| Map + list discovery with age/skill/price/distance filters | Core wedge; directly solves the #1 pain point |
| Listing detail pages (photos, reviews, programs, contact) | Decision-making surface for parents |
| User accounts (parent, junior with COPPA flow, coach, organizer) | Required for reviews, claiming, personalization |
| Coach/facility claim + verification flow | Supply-side activation; unclaimed data goes stale |
| Reviews with moderation queue | Trust signal; differentiator vs. static directories |
| Event listings with external registration links | High value, low build cost (no payments in MVP) |
| Manual + assisted data seeding tooling (admin CMS) | Solves cold start; see Section 12 |

### Should Have (Phase 2)

- In-platform event registration with payments (Stripe)
- Personalized event feed + deadline notifications
- Community forum (soft launch with seeded moderators)
- Organizer bulk-import tools and recurring events
- Premium listing tier (first revenue)
- React Native mobile apps (MVP is responsive web)

### Could Have (Phase 3)

- Social feed (photo/video posts, follows, geotags)
- Player profiles with handicap sync (GHIN)
- Results aggregation from 3+ junior tours
- Recruiting hub (beta) with verified college coach accounts
- Coach analytics dashboard

### Won't Have (this horizon — see also Section 20)

- Tee-time booking (GolfNow's territory; adults-first economics)
- Live tournament scoring (GolfGenius's territory; operationally heavy)
- Equipment marketplace / e-commerce
- Direct messaging between minors and unrelated adults — ever, regardless of horizon
- Swing analysis / AI coaching tools

---

## 8. User Flows

### 8.1 Parent Discovery Flow

```
Open App → Location Permission →
Home Feed: "Junior Golf Near [City]" →
Browse Map / Filter by Age + Resource Type →
Select Facility Card →
View Profile: Photos, Reviews, Programs, Pricing →
Tap "Contact" or "Book a Lesson" →
Leave Review after visit
```

### 8.2 Junior Tournament Flow

```
Profile setup: Age, Handicap, Home Course, Goal →
Events Tab → "Tournaments Near Me" →
Filter: Age Division, Date Range, Entry Fee →
View Event Detail →
Register (external link or in-platform) →
Add to calendar →
Post results / share scorecard →
Results appear on player profile
```

### 8.3 Coach Listing Flow

```
Coach claims/creates listing →
Verifies PGA credentials (PGA of America API or manual upload) →
Sets up profile: bio, specialties, age groups, pricing, photos →
Publishes upcoming clinics →
Receives inquiries via in-platform messaging →
Responds and converts to bookings
```

### 8.4 Under-13 Account Creation Flow (COPPA)

```
Parent creates own account →
"Add a child" → enters child's first name + birth year only →
Parental consent verification (credit-card microcharge or signed consent form) →
Child profile created: private by default, no location storage, no DMs →
Parent dashboard gains child-management tab →
(Optional, later) Parent enables public profile / recruiting visibility
```

---

## 9. Notifications & Personalization

### 9.1 Personalization Inputs

- Profile: child age(s), skill level, home location, travel radius, handicap
- Behavior: saved listings/events, searches, follows, review history
- Explicit preferences: resource types of interest, notification settings

### 9.2 Notification Matrix

| Trigger | Channel | Default | User Control |
|---|---|---|---|
| New event matching profile (age + radius) | Push + email | Weekly digest | Per-category opt-out |
| Registration deadline approaching (saved event) | Push | 7 days before | Configurable: 1/3/7/14 days |
| Reply to my forum post / review | Push | On | Opt-out |
| New review on my claimed listing (supply side) | Email | On | Opt-out |
| Spot opened on a waitlisted event | Push + email | On (immediate) | Opt-out |
| Weekly "what's new near you" digest | Email | On | Opt-out |
| Marketing / sponsor content | Email | **Off** | Opt-in only |

### 9.3 Rules

- No push notifications to under-13 accounts; all child-related notifications route to the parent
- Frequency cap: max 1 non-transactional push per day per user
- All personalization features degrade gracefully when location permission is denied (zip-code fallback)

---

## 10. Design Principles & Information Architecture

### 10.1 Design Principles

1. **Parent-trustworthy, kid-cool.** The same product must read as "safe and legitimate" to a 40-year-old and "not lame" to a 14-year-old. Trust signals (badges, reviews, moderation) are prominent; visual language is energetic, not corporate.
2. **60 seconds to value.** A first-time visitor with no account should reach a useful, filtered map result in under a minute. Account creation is required to act (review, save, register), never to look.
3. **Mobile-first, map-first.** The map is the home screen metaphor; every other surface is reachable within one tap of it.
4. **Supply-side dignity.** Coach and facility pages should look good enough that owners link to them as their primary web presence.
5. **Safety is a feature, not a setting.** Age-appropriate defaults are enforced by the system, not delegated to configuration.

### 10.2 Top-Level Navigation (Mobile)

```
[ Explore (map) ] [ Events ] [ Community ] [ Feed ] [ Profile ]
   MVP               MVP        Phase 2      Phase 3    MVP
```

MVP ships with three tabs (Explore, Events, Profile); Community and Feed slots appear as the phases unlock, avoiding a launch with visibly empty surfaces.

### 10.3 Accessibility

- WCAG 2.2 AA conformance target for web and mobile
- Full keyboard navigability for the map experience (list view as the accessible equivalent surface)
- Listing data on facility accessibility (adaptive golf programs, mobility access) is a first-class field, not an afterthought

---

## 11. Platform Architecture

### 11.1 Technology Stack (Recommended)

| Layer | Technology |
|---|---|
| Web Frontend | Next.js (React) + Tailwind CSS |
| Mobile | React Native (iOS + Android from single codebase) |
| Backend API | Node.js / GraphQL (or REST) |
| Database | PostgreSQL (listings, users, events) + Redis (caching) |
| Search | Elasticsearch or Typesense |
| Maps | Mapbox GL JS |
| Auth | Auth0 or Clerk (supports COPPA junior account flows) |
| File Storage | AWS S3 + CloudFront CDN |
| Email | SendGrid or Postmark |
| Push Notifications | Expo Push (mobile) |
| Payments | Stripe (event registration fees, premium listings) |
| CMS (facility content) | Sanity or Contentful |

### 11.2 Data Model (Key Entities)

```
User
  id, email, role (parent | junior | coach | organizer | admin)
  profile_id → PlayerProfile | CoachProfile | OrganizerProfile
  location, age, consent_type (COPPA if under 13)

Listing (Facility / Course / Range / Academy)
  id, name, type, address, geo_point, hours
  age_range, skill_levels, price_tier
  programs[], photos[], reviews[]
  verified_badge, claimed_by_user_id
  source (manual | imported | claimed), last_verified_at

CoachProfile
  id, user_id, bio, credentials[], specialties[]
  age_groups[], price_range, listings[]

Event
  id, organizer_id, title, description, event_type
  location, date_start, date_end, age_divisions[]
  registration_url, entry_fee, max_participants
  results[], photos[]

Post (Community / Social)
  id, author_id, type (forum | social)
  content, media[], tags[], geo_tag
  parent_id (for replies), upvotes, reports

PlayerProfile
  id, user_id, handicap_index, home_course_id
  tournament_results[], recruiting_profile

Review
  id, author_id, listing_id OR event_id
  rating (1–5), body, photos[], verified_visit
```

---

## 12. Data Acquisition & Seeding Strategy

The platform's value at launch is its data, not its features. Cold start is the top-ranked risk (Section 19); this section is its operational answer.

### 12.1 Data Sources by Resource Type

| Resource | Primary Source | Method | Refresh |
|---|---|---|---|
| Golf courses & ranges | Google Places API + state golf association directories | API import + manual enrichment of junior-specific fields | Quarterly re-verification |
| Junior programs & rates | Facility websites, phone outreach | Manual research (launch team), facility self-service post-claim | On claim; flagged stale after 6 months |
| Coaches/instructors | PGA of America section directories, facility staff pages | Import + outreach for claiming | On claim |
| Tournaments & events | State association calendars, junior tour schedules (HJGT, US Kids, PGA Jr. League), organizer submissions | Scrapers + structured submission form | Daily (scrapers), real-time (submissions) |
| Tournament results | Tour result pages (public) | Scrapers initially; partnerships for official feeds | Within 48h of event |

### 12.2 Seeding Playbook (per new metro)

1. **Import:** Pull all courses/ranges in the metro from Places API (~150–300 records)
2. **Enrich:** Launch team researches junior-specific fields (junior rates, programs, age ranges) for the top 100 by relevance — target 2 weeks per metro
3. **Outreach:** Email + call campaign to coaches and facilities: "Your listing is live — claim it free." Target ≥30% claim rate in 90 days
4. **Events:** Scrape/import the next 90 days of the state association and regional tour calendars before public launch
5. **Quality gate:** Public launch in a metro requires ≥75 enriched listings and ≥15 upcoming events

### 12.3 Data Quality & Licensing

- Every record carries `source` and `last_verified_at`; stale data (>6 months unclaimed, unverified) is visually de-emphasized
- User-suggested edits flow through a lightweight review queue
- Scraping limited to publicly available factual data (schedules, results); seek written partnerships before redistributing tour data at scale or labeling it official
- Duplicate detection on import: name + geo proximity + phone match

---

## 13. Non-Functional Requirements

### 13.1 Performance

- Map/search results: p75 < 2s on 4G mobile; p95 < 4s
- Listing and event detail pages: p75 < 1.5s
- Search index freshness: new/edited listings and events searchable within 5 minutes

### 13.2 Availability & Scale

- 99.9% uptime target for read paths (discovery is the product)
- MVP sized for 10K MAU; architecture must scale to 500K MAU without re-platforming (stateless API, managed Postgres with read replicas, CDN-cached listing pages)
- Tournament-season traffic is spiky (registration deadlines, weekend mornings); autoscaling on API tier

### 13.3 Security & Privacy

- All traffic TLS; PII encrypted at rest
- Role-based access control; minor data accessible only to the linked parent account and authorized T&S staff (audited)
- No location data stored for under-13 users (COPPA); coarse zip-level only for 13–17 by default
- Data retention: deleted accounts purged within 30 days; minors' data deletable on parental request (verifiable parental right under COPPA)
- SOC 2 readiness by Month 18 (required for school/association partnerships)

### 13.4 Compliance

- COPPA (under-13), KOSA, and applicable state minor-privacy laws (e.g., California AADC) reviewed by counsel before launch
- App Store / Play Store kids-adjacent app policies (the app is mixed-audience, not "designed for kids" — positioning matters for store review)
- CAN-SPAM / TCPA for email and SMS

### 13.5 Observability

- Structured logging, error tracking (Sentry), product analytics (PostHog or Amplitude)
- T&S-specific dashboards: report queue depth, moderation SLA, minor-account anomaly alerts

---

## 14. Trust & Safety

### 14.1 Child Safety (COPPA / KOSA Compliance)

- Users under 13 require verified parental consent before account creation
- Junior profiles (under 18) are private by default; parents approve public visibility
- No direct messaging between adults and minors without parental opt-in
- No location data stored for users under 13
- Content moderation queue for all minor-posted content before public display

### 14.2 Coach / Facility Verification

- PGA credentials verified via PGA of America member lookup
- Background check badge (partnered with Sterling Volunteers or similar)
- Facility listings require business verification (Google Business or utility bill)
- Unverified listings are clearly labeled

### 14.3 Reviews & Anti-Spam

- Reviews require a verified account with a completed profile
- "Verified visit" badge for reviews geolocated to the facility
- Flagging system with human review within 24 hours
- No incentivized reviews policy

---

## 15. Monetization

### 15.1 Revenue Streams

| Stream | Model | Target Launch |
|---|---|---|
| **Premium Listings** (coaches, facilities) | $29–$99/month for featured placement, analytics, booking button | Month 6 |
| **Event Registration Fees** | 3% + $0.50 per ticket for in-platform registration | Month 6 |
| **Sponsored Content / Display Ads** | Golf equipment brands, junior tour sponsors (CPM) | Month 9 |
| **Recruiting Hub (college coaches)** | $199/month per coaching staff access | Month 12 |
| **Data & Insights** | Anonymized regional data reports for state associations, equipment brands | Month 18 |
| **JuniorLinks Pro (families)** | $9.99/month: recruiting profile, advanced analytics, priority notifications | Month 12 |

### 15.2 Freemium Principles

- All discovery features are free and ungated
- Basic listing for coaches and facilities is always free
- Monetization happens at the margins: priority, analytics, tools
- No paywalling community or event discovery
- No behavioral ad targeting of minors; sponsor content shown to minors is contextual only

---

## 16. Go-to-Market & Launch Strategy

### 16.1 Launch Market Selection

Criteria for the first metro: year-round golf weather, high junior participation density, active PGA section, fragmented incumbent landscape. Shortlist: **Dallas–Fort Worth, Phoenix, Tampa Bay** (final selection per Open Question #1).

### 16.2 Demand-Side Acquisition

| Channel | Play | Phase |
|---|---|---|
| **Local SEO** | Programmatic landing pages: "junior golf lessons in [city/neighborhood]" — the listings themselves are the content moat | 1 |
| **Facility partnerships** | QR-code table tents and flyers at partner courses/ranges ("Rate your lesson, find your next tournament") | 1 |
| **Parent communities** | Seeding in existing Facebook groups / school newsletters, with moderator partnerships rather than spam | 1 |
| **Organizer virality** | Every event page is shareable; organizers distribute JuniorLinks links to their existing mailing lists (Eventbrite's growth loop) | 2 |
| **Junior creators** | Micro-ambassador program: competitive juniors share results/highlights with platform-branded recap cards | 3 |

### 16.3 Supply-Side Acquisition

- Pre-launch concierge: launch team builds the first 100 listings *for* coaches and facilities, then invites them to claim (claiming a good-looking existing page converts far better than asking for data entry)
- PGA section partnership: co-marketing to section members ("free professional junior-teaching profile")
- State golf association partnership: ingest their calendar, send them registrations — make the association a distribution partner, not a competitor

### 16.4 Phased Rollout

#### Phase 1 — Regional MVP (Months 1–3)

**Scope:** Single metro area; mobile-responsive web app only

**Deliverables:**
- Manual data seeding: 75–100 enriched listings, 20–30 upcoming events (per Section 12.2 quality gate)
- Map + filter discovery; listing pages with reviews
- User accounts (incl. COPPA parent/child flow)
- Coach/facility claiming flow
- Events with external registration links

**Success metrics:**
- 500 registered users
- 50+ facility/coach listings claimed and verified
- ≥30% of imported listings claimed within 90 days
- 4.0+ app store equivalent rating

#### Phase 2 — Statewide Expansion (Months 4–9)

**Deliverables:**
- React Native mobile apps (iOS + Android)
- Events module with in-platform registration (Stripe)
- Personalized event feed + deadline notifications
- Community forum (soft launch)
- Automated ingestion for state tournament calendar
- Premium listing tier

**Success metrics:**
- 5,000 registered users
- 200+ listings
- 10+ events hosted in-platform
- First $5K MRR

#### Phase 3 — Multi-State & Community (Months 10–18)

**Deliverables:**
- Social feed (photo/video posts)
- Player profiles with handicap sync
- Recruiting hub (beta)
- Results aggregation (3+ junior tours)
- 10-state coverage

**Success metrics:**
- 50,000 registered users
- 1,000+ listings
- Revenue-positive

#### Phase 4 — Nationwide & Data Platform (Months 19–36)

**Deliverables:**
- Nationwide coverage
- Full results aggregation (AJGA, US Kids, etc.)
- College coach portal
- API for state associations
- iOS/Android feature parity

---

## 17. KPIs & Analytics

### Acquisition
- Monthly new registrations
- Organic search traffic (SEO: "junior golf lessons near me")
- Referral rate (% users who referred another)

### Engagement
- Monthly active users (MAU)
- Sessions per user per month
- Time on platform per session
- % users who return within 7 days
- **North-star candidate:** weekly "successful discoveries" (search → listing/event detail → contact, save, or register)

### Supply-Side Health
- # of verified listings
- % listings with photos + reviews
- # of events published per month
- Coach/facility claiming rate
- % listings re-verified within the last 6 months (data freshness)

### Revenue
- MRR (monthly recurring revenue)
- Conversion rate (free listing → premium)
- Event registration volume
- LTV by user segment

### Trust & Safety
- Reports per 1,000 posts
- Median time to review resolution
- COPPA incident rate (target: zero)

### Experimentation
- Feature-flag infrastructure from MVP (e.g., LaunchDarkly or homegrown) so ranking, onboarding, and notification experiments don't require releases
- Guardrail metrics on every experiment: T&S report rate, unsubscribe rate, supply-side churn

---

## 18. Competitive Landscape

| Competitor | Strength | Gap We Fill |
|---|---|---|
| **AJGA.org** | Official junior tour authority | No local discovery, no community, no lessons |
| **US Kids Golf** | Strong under-12 segment | Limited to their own events/content |
| **GolfGenius** | Tournament management tools | Not consumer-facing; no discovery or community |
| **Golf Now** | Tee time booking | Adults-first; no junior programs/lessons |
| **Yelp** | Review infrastructure | Zero golf specialization; no age/skill filters |
| **Eventbrite** | Event platform | No junior golf context; no results/rankings |
| **NCSA / ZMG** | Recruiting | Recruiting only; no discovery or community |

**JuniorLinks' defensible moat:** Vertical specificity (youth golf), community network effects, and proprietary results/rankings data aggregated over time.

---

## 19. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cold start problem (empty listings) | High | High | Seeding playbook + quality gate per metro (Section 12); concierge listing creation |
| COPPA/child safety incident | Low | Critical | Legal review, strict age-gating, no minor DMs, parental controls, pre-publication moderation of minor content |
| Tour data licensing restrictions | Medium | Medium | Start with scraped public data; build relationships for official feeds; never label scraped data as official |
| Coach/facility adoption resistance | Medium | High | Freemium; concierge-built listings reduce claiming friction; show clear ROI via analytics |
| Competitor acqui-hire of concept | Low | Medium | Build community moat fast; network effects are hard to replicate |
| Seasonal demand (golf is seasonal) | High | Medium | Lean into off-season: camp planning, recruiting, swing videos; launch in year-round-golf metros first |
| Scope sprawl across four product "layers" | High | High | MoSCoW discipline (Section 7); Community/Feed tabs do not ship until discovery metrics hit Phase 1 targets |
| App store rejection over kids-app policies | Medium | High | Position as mixed-audience app; counsel review of store policies pre-submission |

---

## 20. Out of Scope / Non-Goals

Explicitly not building (this product horizon):

1. **Tee-time booking** — commodity space owned by GolfNow; adults-first economics
2. **Live tournament scoring/management** — GolfGenius's domain; operationally heavy, organizer-facing
3. **Equipment marketplace or e-commerce** — affiliate/sponsor content only
4. **Adult golf discovery** — junior focus is the moat; diluting it is the fastest way to lose it
5. **AI swing analysis / coaching tools** — adjacent product; potential future partnership surface
6. **Open DMs between minors and unrelated adults** — permanent non-goal, not a deferral
7. **International markets** — U.S. only through Month 36

---

## 21. Open Questions

1. **Launch market:** Which metro area maximizes density of junior golfers + coaching supply? (Data: PGA section size, AJGA event frequency, youth participation rates)
2. **USGA handicap integration:** Will USGA provide API access for handicap sync, or must we use GHIN scraping?
3. **Tour data partnerships:** Which junior tours are open to data-sharing partnerships vs. protective of their data?
4. **Revenue sequencing:** Should we prioritize coach subscriptions or event fees first to reach initial MRR?
5. **Moderation at scale:** At what MAU threshold do we need a full-time trust & safety hire?
6. **Brand name:** "JuniorLinks" is placeholder — validate with target audience.
7. **Parental consent mechanism:** Which COPPA-verifiable consent method (microcharge, ID check, signed form) best balances compliance strength against signup drop-off?
8. **Background checks:** Should the coach background-check badge be required for premium tier, or remain fully optional?

---

## 22. Appendix

### A. Glossary

| Term | Definition |
|---|---|
| AJGA | American Junior Golf Association |
| HJGT | Hurricane Junior Golf Tour |
| US Kids Golf | Largest worldwide junior golf organization for under-12 |
| PGA Jr. League | Team-format junior golf league run by PGA of America |
| Drive Chip & Putt | USGA/Augusta National skills competition for ages 7–15 |
| GHIN | Golf Handicap and Information Network (USGA's handicap system) |
| COPPA | Children's Online Privacy Protection Act (U.S., applies to under-13) |
| KOSA | Kids Online Safety Act |
| MoSCoW | Prioritization method: Must / Should / Could / Won't have |

### B. Comparable Platform Benchmarks

| Platform | Time to 100K users | Key growth driver |
|---|---|---|
| Yelp | ~18 months | Local SEO + city-by-city sales team |
| Eventbrite | ~12 months | Organizer virality (invites attendees) |
| Strava | ~24 months | Social + activity feed virality |

### C. Junior Golf Market Size

- ~3.1 million junior golfers in the U.S. (NGF, 2024)
- 30% growth in junior participation since 2019
- Average annual family spend on junior golf: $2,400–$8,000
- 1,200+ AJGA events per year; thousands more regional/local events
- 800+ PGA-affiliated junior programs nationwide
