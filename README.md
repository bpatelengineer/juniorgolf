# JuniorLinks

The youth golf discovery & community platform — find junior golf lessons,
courses, camps, and tournaments near you. See [PRD.md](./PRD.md) for the full
product spec.

This is the **Phase 1 MVP** (PRD §7 "Must Have"): the discovery wedge.

## What's built

- **Explore** (`/`) — map + list discovery of junior golf resources with
  filters for resource type, child's age, skill level, price tier, distance
  radius, and text search. Results ranked by a relevance blend of rating,
  proximity, and verification status (PRD story P1).
- **Listing detail** (`/listings/[id]`) — photos-ready profile with age range,
  skill levels, programs, hours, contact actions, verification/claim status,
  and reviews with "verified visit" badges (stories P2, P3).
- **Events** (`/events`) — upcoming tournaments, clinics, camps, leagues with
  type/skill/free filters, deadline-countdown and low-spots badges (story J1).
- **Event detail** (`/events/[id]`) — divisions, format, fee, field size, and
  external registration links (in-platform registration is Phase 2).
- **Seed data** — 12 listings, 23 reviews, 10 future-dated events for the
  Dallas–Fort Worth launch metro (PRD §12.2). Facility names are fictional.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) + Tailwind CSS | Per PRD §11.1 |
| Database | SQLite via Prisma | Dev convenience; schema is portable — swap the datasource provider to `postgresql` for production |
| Maps | Leaflet + OpenStreetMap | No API key required; swap to Mapbox GL (PRD choice) when keys are provisioned |

## Getting started

```bash
npm install
cp .env.example .env
npm run db:setup   # migrate + seed
npm run dev        # http://localhost:3000
```

Other scripts: `npm run db:seed` (reseed), `npm run build`, `npm run lint`.

## Not yet built (next phases)

- User accounts incl. COPPA parent/child flow (PRD story P4) — planned on
  Clerk/Auth0, needs keys
- Coach/facility claim + verification flow (story C1)
- Review submission (read-only today; needs accounts first)
- In-platform event registration/payments, personalized feeds, community
  forum, social feed, recruiting hub — Phases 2–3 per PRD §7
