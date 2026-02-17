# Golf The High Sierra

> Full website rebuild — WordPress → Next.js on Vercel  
> **Live:** https://golfthehighsierra.vercel.app/

## Overview

Golf tourism platform serving Reno, Tahoe, South Lake, Carson, and Graeagle regions. 147 total pages including golf courses, hotels, experiences, dining, and more.

**Currently Live:** 22 golf courses, 23 hotels, 17+ static pages, region pages, taxonomy pages.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Hosting:** Vercel (auto-deploy from `main`)
- **Font:** Plus Jakarta Sans
- **Content:** JSON data files (no CMS)
- **API:** TripsCaddie real trip data integration

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npx next build     # Production build test
```

## Project Structure

```
src/data/courses/   → 22 golf course JSON files
src/data/hotels/    → 23 hotel JSON files
src/components/     → Page templates + shared components
src/app/(marketing)/ → All routes
```

## Key Files

| File | Purpose |
|------|---------|
| `MASTER_SPEC.md` | Complete project specification |
| `src/components/CoursePageContent.tsx` | Golf course page template (Euro V3) |
| `src/components/HotelPageContent.tsx` | Hotel page template (White Luxury) |
| `src/components/HomepageContent.tsx` | Homepage (Pine/Gold editorial) |
| `src/components/HeroTripSlider.tsx` | TripsCaddie slider with touch swipe |
| `src/components/QuoteModal.tsx` | Quote request → dual email |

## Deployment

```bash
git add -A && git commit -m "description" && git push origin main
```

Vercel auto-deploys on push to `main`. Build must pass first.

## Contact

- **Phone:** 1-888-584-8232
- **Email:** info@golfthehighsierra.com
- **Owner:** Sean
