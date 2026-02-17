# GOLF THE HIGH SIERRA — MASTER SPEC

> **Live Site:** https://golfthehighsierra.vercel.app/  
> **Repo:** digitalalchemistalex/golfthehighsierra  
> **Owner:** Sean | **Developer:** Alex  
> **Last Updated:** February 16, 2026

---

## Project Overview

Full website rebuild for Golf The High Sierra (GTHS), transitioning from WordPress to a modern Next.js application on Vercel. GTHS is a golf tourism platform serving four regions: Reno, Tahoe, South Lake, and Carson/Graeagle. The site helps groups plan golf trips with stay-and-play packages.

**Total Inventory:** 147 pages  
**Currently Live:** ~66 pages (22 courses, 23 hotels, 17+ static, 4 taxonomy/regions)  
**Remaining:** ~81 pages (29 experiences, 29 sub-pages, blog, taxonomy)

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Hosting | Vercel (auto-deploy from GitHub `main`) |
| Font | Plus Jakarta Sans (single family, weight contrast) |
| Content | JSON data files (no CMS) |
| API | TripsCaddie API for real trip data |
| Styling | Inline styles + Tailwind utilities |

---

## Design System

### Homepage
- **Style:** Pine/Gold editorial (preserved from original)
- **Source:** GTHS-Full-Preview.html converted to HomepageContent.tsx
- **Fonts:** Plus Jakarta Sans

### Golf Course Pages (Euro V3)
- **Layout:** 5-section condensed
  1. Immersive hero with zoom animation + trip slider (desktop)
  2. Split content with gallery grid
  3. Dark signature hole feature
  4. Compact info strip
  5. Dark CTA section
- **Fonts:** Plus Jakarta Sans (Cormorant serif for headings via CSS var)
- **Data:** Par, designer, yardage, slope, rating, signature holes

### Hotel Pages (White Luxury)
- **Palette:** White/bone/pearl with burnished bronze accents
- **Features:** Split hero with trip slider, enriched content
- **Data:** Room types, dining, spa/bars, amenities, FAQs

---

## Directory Structure

```
src/
├── app/(marketing)/
│   ├── page.tsx                          # Homepage
│   ├── portfolio/[slug]/page.tsx         # Dynamic course/hotel pages
│   ├── [regionSlug]/page.tsx             # Region landing pages
│   ├── accommodations-in-reno-tahoe/     # Hotels listing
│   ├── best-restaurants-reno-nv/         # Restaurants
│   ├── contact-custom-golf-package/      # Quote form
│   └── ...                               # Other static pages
├── components/
│   ├── HomepageContent.tsx               # Homepage component
│   ├── CoursePageContent.tsx             # Golf course template
│   ├── HotelPageContent.tsx             # Hotel template
│   ├── Header.tsx                        # Shared mega menu
│   ├── Footer.tsx                        # Shared footer
│   ├── HeroTripSlider.tsx               # Trip cards slider (desktop)
│   ├── RelatedTrips.tsx                 # Trip cards section
│   └── QuoteModal.tsx                   # Quote request modal
├── data/
│   ├── courses/                         # 22 course JSON files
│   │   ├── index.ts                     # Course exports
│   │   └── *.json                       # Individual course data
│   ├── hotels/                          # 23 hotel JSON files
│   │   ├── index.ts                     # Hotel exports
│   │   └── *.json                       # Individual hotel data
│   └── regions.ts                       # Region definitions
└── styles/
    ├── globals.css                       # CSS vars, font imports
    └── homepage.css                      # Homepage-specific styles
```

---

## Data Schema

### Course JSON
```json
{
  "slug": "edgewood-tahoe-golf-course",
  "name": "Edgewood Tahoe Golf Course",
  "region": "Tahoe",
  "heroImage": "url",
  "images": ["url1", "url2"],
  "logo": "url",
  "overview": "description text",
  "par": 72,
  "yardage": "7529",
  "slope": "139",
  "rating": { "value": 4.8, "count": 672 },
  "designer": "George Fazio / Tom Fazio",
  "featuredHole": { "title": "Hole Name", "description": "..." },
  "relatedCourses": [{ "name": "...", "slug": "...", "image": "..." }],
  "relatedHotels": [{ "name": "...", "slug": "...", "image": "..." }],
  "faqs": [{ "q": "...", "a": "..." }],
  "meta": { "title": "...", "description": "..." }
}
```

### Hotel JSON
```json
{
  "slug": "hyatt-lake-tahoe",
  "name": "Hyatt Regency Lake Tahoe",
  "region": "Tahoe",
  "heroImage": "url",
  "images": ["url1", "url2"],
  "overview": "description text",
  "totalRooms": 422,
  "stars": 4,
  "phone": "(775) 832-1234",
  "roomTypes": [{ "name": "...", "description": "..." }],
  "dining": [{ "name": "...", "description": "..." }],
  "spaBars": [{ "name": "...", "description": "..." }],
  "amenities": ["Pool", "Spa", "..."],
  "relatedCourses": [...],
  "relatedHotels": [...],
  "faqs": [...],
  "meta": { "title": "...", "description": "..." }
}
```

---

## TripsCaddie Integration

Real past trip data is fetched from the TripsCaddie API and displayed on matching course/hotel pages.

- **API:** `https://golfthehighsierra.com/trips-caddie/api/api-recaps.php`
- **Matching:** Course names → `COURSE_NAMES` map, Hotel names → `LODGING_NAMES` map
- **Display:**
  - Desktop: Split hero (left = page info, right = trip slider)
  - Mobile: Full-width hero (slider hidden for LCP)
  - Below-fold: RelatedTrips section with full cards
- **Quote Flow:** "Get This Trip" → QuoteModal → dual email (admin + customer)

---

## Build Phases

### ✅ Phase 1 — Foundation (COMPLETE)
- Next.js setup, Vercel deploy, shared Header/Footer
- Homepage conversion from static HTML

### ✅ Phase 2a — Golf Courses (COMPLETE)
- 22 course pages with Euro V3 design
- Enriched data (par, slope, rating, designer, signature holes)
- TripsCaddie integration, gallery lightbox
- Logo cleanup (logos moved to `logo` field, not in gallery)

### ✅ Phase 2b — Hotels (COMPLETE)
- 23 hotel pages with White Luxury design  
- 4 Graeagle properties enriched with Sean's copy + internet data
- TripsCaddie integration, split hero layout
- No pricing displayed

### ⚠️ Phase 2c — Venues (IN PROGRESS)
- VenuePageContent V2 prototype complete (Chapel Tavern)
- 28 more venues to scrape and build

### ❌ Phase 3 — Experiences (NOT STARTED)
- 29 experience pages (spas, bars, museums, shopping)

### ❌ Phase 4 — Sub-Pages (NOT STARTED)
- 10 Atlantis sub-pages (rooms, restaurants)
- 19 Eldorado sub-pages (rooms, restaurants)

### ❌ Phase 5 — Blog & SEO (NOT STARTED)
- Blog post template
- Comprehensive SEO audit (schema, OG images, sitemap)

---

## Recent Changes (Feb 2026)

- **Touch swipe** added to hero trip slider
- **Logo cleanup** — branded golf ball images removed from all galleries
- **heroImage fallback** for courses with thin photo galleries  
- **Text readability** — all low-opacity text boosted to 50-75% opacity, 10px min
- **CTA copy** — "Custom Quote" → "Get This Trip" across all trip components
- **Header overlap** fixed — duplicate nav removed, padding added
- **Scroll indicator** removed from hero sections
- **Plus Jakarta Sans** — single font family across entire site
- **4 Graeagle lodging** enriched with Sean's copy + real data
- **All pricing removed** from hotel pages

---

## Deployment

Push to `main` branch → Vercel auto-deploys.

```bash
git add -A
git commit -m "description"
git push origin main
```

Build must pass `npx next build` before pushing.

---

## Key Contacts

- **GTHS Phone:** 1-888-584-8232
- **Email:** info@golfthehighsierra.com
- **Address:** 2700 Mill St Suite 800, Reno, NV 89502
