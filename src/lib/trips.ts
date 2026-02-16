/* ═══════════════════════════════════════
   Trips API Layer
   
   Fetches trip data from Trips Caddie PHP API.
   Used at build time (ISR) for static generation.
   All functions are server-side only.
   ═══════════════════════════════════════ */

import type { TripRecap, TripStats, TripVibe } from "@/types/trips";

const TRIPS_API = "https://golfthehighsierra.com/trips-caddie/api/api-recaps.php";

/** In-memory cache for build-time deduplication */
let _cache: TripRecap[] | null = null;
let _cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute in-memory during builds

/**
 * Fetch all trips from the Trips Caddie API.
 * Cached in-memory during build to avoid hitting the API per-page.
 */
export async function getAllTrips(): Promise<TripRecap[]> {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) return _cache;

  try {
    const res = await fetch(`${TRIPS_API}?t=${now}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!res.ok) {
      console.warn(`Trips API returned ${res.status}`);
      return _cache || [];
    }

    const data: TripRecap[] = await res.json();

    // Sort by year desc, then month
    const monthOrder = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    data.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
    });

    _cache = data;
    _cacheTime = now;
    return data;
  } catch (err) {
    console.error("Failed to fetch trips:", err);
    return _cache || [];
  }
}

/**
 * Get trips that include a specific course (fuzzy match on name).
 */
export async function getTripsForCourse(courseName: string): Promise<TripRecap[]> {
  const all = await getAllTrips();
  const needle = courseName.toLowerCase();
  return all.filter((t) =>
    t.courses.some((c) => {
      const cn = c.toLowerCase();
      return cn.includes(needle) || needle.includes(cn);
    })
  );
}

/**
 * Get trips that use a specific lodging (fuzzy match on name).
 */
export async function getTripsForLodging(lodgingName: string): Promise<TripRecap[]> {
  const all = await getAllTrips();
  const needle = lodgingName.toLowerCase();
  return all.filter((t) => {
    const ln = t.lodging.toLowerCase();
    return ln.includes(needle) || needle.includes(ln);
  });
}

/**
 * Get trips for a specific region.
 */
export async function getTripsByRegion(region: string): Promise<TripRecap[]> {
  const all = await getAllTrips();
  return all.filter((t) => (t.region || "").toLowerCase() === region.toLowerCase());
}

/**
 * Compute aggregated stats for a set of trips.
 * Used for the social proof section on course/hotel pages.
 */
export function computeTripStats(trips: TripRecap[]): TripStats | null {
  if (trips.length === 0) return null;

  const avgPrice = Math.round(
    trips.reduce((sum, t) => sum + t.pricePerPerson, 0) / trips.length
  );

  const avgGroup = Math.round(
    trips.reduce((sum, t) => sum + t.groupSize, 0) / trips.length
  );

  // Most common vibe
  const vibeCount: Record<string, number> = {};
  for (const t of trips) {
    vibeCount[t.vibe] = (vibeCount[t.vibe] || 0) + 1;
  }
  const sortedVibes = Object.entries(vibeCount)
    .sort(([, a], [, b]) => b - a)
    .map(([v]) => v as TripVibe);

  // Most common nights/rounds combo
  const comboCount: Record<string, number> = {};
  for (const t of trips) {
    const key = `${t.nights}N / ${t.rounds}R`;
    comboCount[key] = (comboCount[key] || 0) + 1;
  }
  const topCombo = Object.entries(comboCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "—";

  // Featured trips: most recent 2-3
  const featured = trips.slice(0, 3);

  return {
    totalTrips: trips.length,
    avgPricePerPerson: avgPrice,
    avgGroupSize: avgGroup,
    commonVibes: sortedVibes.slice(0, 2),
    commonNightsRounds: topCombo,
    featuredTrips: featured,
  };
}

/**
 * Get stats for a specific course.
 * Returns null if no trips found.
 */
export async function getCourseStats(courseName: string): Promise<TripStats | null> {
  const trips = await getTripsForCourse(courseName);
  return computeTripStats(trips);
}

/**
 * Get stats for a specific hotel/lodging.
 * Returns null if no trips found.
 */
export async function getLodgingStats(lodgingName: string): Promise<TripStats | null> {
  const trips = await getTripsForLodging(lodgingName);
  return computeTripStats(trips);
}

/**
 * Get all unique filter options from the trip data.
 * Used to build the filter bar dynamically.
 */
export async function getFilterOptions(): Promise<{
  regions: string[];
  vibes: string[];
  years: number[];
  months: string[];
}> {
  const all = await getAllTrips();

  const regions = Array.from(new Set(all.map((t) => t.region).filter(Boolean) as string[])).sort();
  const vibes = Array.from(new Set(all.map((t) => t.vibe))).sort();
  const years = Array.from(new Set(all.map((t) => t.year))).sort((a, b) => b - a);
  const months = Array.from(new Set(all.map((t) => t.month)));

  return { regions, vibes, years, months };
}
