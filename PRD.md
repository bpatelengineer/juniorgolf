# Product Requirements Document
## JuniorLinks — The Youth Golf Discovery & Community Platform

**Version:** 1.0
**Date:** March 27, 2026
**Status:** Draft

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

## 4. Target Audience

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

---

## 5. Core Features

### 5.1 Discovery Map (Yelp Layer)

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

### 5.2 Events & Tournaments (Eventbrite Layer)

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

### 5.3 Community Forum (Reddit Layer)

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

### 5.4 Social Feed (Instagram Layer)

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

### 5.5 Recruiting Hub

- Junior golfer creates a recruiting profile (public, opt-in)
- College coaches (verified) can search by grad year, handicap, region, GPA range
- Juniors can express interest in programs
- Tournament results auto-populate from connected tour results feeds
- Highlight video upload
- SAT/ACT / GPA fields (optional)

### 5.6 Results & Rankings Feed

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

## 6. User Flows

### 6.1 Parent Discovery Flow

```
Open App → Location Permission →
Home Feed: "Junior Golf Near [City]" →
Browse Map / Filter by Age + Resource Type →
Select Facility Card →
View Profile: Photos, Reviews, Programs, Pricing →
Tap "Contact" or "Book a Lesson" →
Leave Review after visit
```

### 6.2 Junior Tournament Flow

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

### 6.3 Coach Listing Flow

```
Coach claims/creates listing →
Verifies PGA credentials (PGA of America API or manual upload) →
Sets up profile: bio, specialties, age groups, pricing, photos →
Publishes upcoming clinics →
Receives inquiries via in-platform messaging →
Responds and converts to bookings
```

---

## 7. Platform Architecture

### 7.1 Technology Stack (Recommended)

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

### 7.2 Data Model (Key Entities)

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

## 8. Trust & Safety

### 8.1 Child Safety (COPPA / KOSA Compliance)

- Users under 13 require verified parental consent before account creation
- Junior profiles (under 18) are private by default; parents approve public visibility
- No direct messaging between adults and minors without parental opt-in
- No location data stored for users under 13
- Content moderation queue for all minor-posted content before public display

### 8.2 Coach / Facility Verification

- PGA credentials verified via PGA of America member lookup
- Background check badge (partnered with Sterling Volunteers or similar)
- Facility listings require business verification (Google Business or utility bill)
- Unverified listings are clearly labeled

### 8.3 Reviews & Anti-Spam

- Reviews require a verified account with a completed profile
- "Verified visit" badge for reviews geolocated to the facility
- Flagging system with human review within 24 hours
- No incentivized reviews policy

---

## 9. Monetization

### 9.1 Revenue Streams

| Stream | Model | Target Launch |
|---|---|---|
| **Premium Listings** (coaches, facilities) | $29–$99/month for featured placement, analytics, booking button | Month 6 |
| **Event Registration Fees** | 3% + $0.50 per ticket for in-platform registration | Month 6 |
| **Sponsored Content / Display Ads** | Golf equipment brands, junior tour sponsors (CPM) | Month 9 |
| **Recruiting Hub (college coaches)** | $199/month per coaching staff access | Month 12 |
| **Data & Insights** | Anonymized regional data reports for state associations, equipment brands | Month 18 |
| **JuniorLinks Pro (families)** | $9.99/month: recruiting profile, advanced analytics, priority notifications | Month 12 |

### 9.2 Freemium Principles

- All discovery features are free and ungated
- Basic listing for coaches and facilities is always free
- Monetization happens at the margins: priority, analytics, tools
- No paywalling community or event discovery

---

## 10. Launch Strategy

### Phase 1 — Regional MVP (Months 1–3)

**Scope:** Single metro area (e.g., Dallas-Fort Worth, Phoenix, or Tampa Bay — high junior golf density)

**Deliverables:**
- Web app (mobile-responsive) only
- Manual data seeding: 50–100 listings, 20–30 upcoming events
- Basic map + filter
- User accounts and reviews
- Coach/facility claiming flow

**Success metrics:**
- 500 registered users
- 50+ facility/coach listings verified
- 4.0+ app store equivalent rating

### Phase 2 — Statewide Expansion (Months 4–9)

**Deliverables:**
- React Native mobile apps (iOS + Android)
- Events module with in-platform registration
- Community forum (soft launch)
- Automated data ingestion for state tournament calendar
- Premium listing tier

**Success metrics:**
- 5,000 registered users
- 200+ listings
- 10+ events hosted in-platform
- First $5K MRR

### Phase 3 — Multi-State & Community (Months 10–18)

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

### Phase 4 — Nationwide & Data Platform (Months 19–36)

**Deliverables:**
- Nationwide coverage
- Full results aggregation (AJGA, US Kids, etc.)
- College coach portal
- API for state associations
- iOS/Android feature parity

---

## 11. Key Performance Indicators

### Acquisition
- Monthly new registrations
- Organic search traffic (SEO: "junior golf lessons near me")
- Referral rate (% users who referred another)

### Engagement
- Monthly active users (MAU)
- Sessions per user per month
- Time on platform per session
- % users who return within 7 days

### Supply-Side Health
- # of verified listings
- % listings with photos + reviews
- # of events published per month
- Coach/facility claiming rate

### Revenue
- MRR (monthly recurring revenue)
- Conversion rate (free listing → premium)
- Event registration volume
- LTV by user segment

### Trust & Safety
- Reports per 1,000 posts
- Median time to review resolution
- COPPA incident rate (target: zero)

---

## 12. Competitive Landscape

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

## 13. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cold start problem (empty listings) | High | High | Manual data seeding + direct outreach to facilities pre-launch |
| COPPA/child safety incident | Low | Critical | Legal review, strict age-gating, no minor DMs, parental controls |
| Tour data licensing restrictions | Medium | Medium | Start with scraped public data; build relationships for official feeds |
| Coach/facility adoption resistance | Medium | High | Freemium; reduce friction to claim listing; show clear ROI |
| Competitor acqui-hire of concept | Low | Medium | Build community moat fast; network effects are hard to replicate |
| Seasonal demand (golf is seasonal) | High | Medium | Lean into off-season: camp planning, recruiting, swing videos |

---

## 14. Open Questions

1. **Launch market:** Which metro area maximizes density of junior golfers + coaching supply? (Data: PGA section size, AJGA event frequency, youth participation rates)
2. **USGA handicap integration:** Will USGA provide API access for handicap sync, or must we use GHIN scraping?
3. **Tour data partnerships:** Which junior tours are open to data-sharing partnerships vs. protective of their data?
4. **Revenue sequencing:** Should we prioritize coach subscriptions or event fees first to reach initial MRR?
5. **Moderation at scale:** At what MAU threshold do we need a full-time trust & safety hire?
6. **Brand name:** "JuniorLinks" is placeholder — validate with target audience.

---

## 15. Appendix

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
