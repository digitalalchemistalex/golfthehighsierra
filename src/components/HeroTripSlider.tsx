"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from "react";

/* ─── Slug → name maps (same as RelatedTrips) ─── */
const COURSE_NAMES: Record<string, string[]> = {
  "edgewood-tahoe-golf-course": ["Edgewood Tahoe", "Edgewood"],
  "incline-village-golf-courses-nv": ["Incline Village Championship", "Incline Village Mountain", "Incline Village"],
  "lake-tahoe-golf-course": ["Lake Tahoe Golf Course"],
  "old-greenwood-golf-course": ["Old Greenwood"],
  "grays-crossing-golf-course": ["Gray's Crossing", "Grays Crossing"],
  "coyote-moon-golf-course": ["Coyote Moon"],
  "tahoe-donner-golf-course-truckee-ca": ["Tahoe Donner"],
  "northstar-golf-course": ["Northstar California", "Northstar"],
  "schaffers-mill": ["Schaffer's Mill", "Schaffers Mill"],
  "grizzly-ranch-golf-club": ["Grizzly Ranch"],
  "whitehawk-ranch-golf-course": ["Whitehawk Ranch"],
  "nakoma-dragon-golf-course": ["The Dragon at Nakoma", "Dragon", "Nakoma"],
  "plumas-pines-golf-resort": ["Plumas Pines"],
  "graeagle-meadows-golf-course": ["Graeagle Meadows"],
  "lakeridge-golf-course": ["Lakeridge"],
  "red-hawk-golf-resort": ["Red Hawk", "Red Hawk (Lakes)"],
  "wolf-run-golf-club": ["Wolf Run"],
  "somersett-golf-country-club": ["Somersett"],
  "arrowcreek-golf-club": ["ArrowCreek", "Arrow Creek"],
  "washoe-county-golf-course": ["Washoe County"],
  "toiyabe-golf-club": ["Toiyabe Golf Club", "Toiyabe"],
  "genoa-lakes-golf-club": ["Genoa Lakes"],
  "eagle-valley-golf-course": ["Eagle Valley"],
  "dayton-valley-golf-club": ["Dayton Valley"],
};

const LODGING_NAMES: Record<string, string[]> = {
  "silver-legacy-resort-casino": ["Silver Legacy Resort Casino", "Silver Legacy"],
  "peppermill-resort-spa-casino": ["Peppermill Resort Spa Casino", "Peppermill"],
  "eldorado-resorts-reno-eldorado-at-the-row": ["Eldorado Resort", "Eldorado"],
  "atlantis-casino-resort-spa-reno": ["Atlantis Casino Resort Spa", "Atlantis"],
  "grand-sierra-resort-reno": ["Grand Sierra Resort", "Grand Sierra", "GSR"],
  "circus-circus-reno": ["Circus Circus Reno", "Circus Circus"],
  "j-resort-reno": ["J Resort"],
  "nugget-casino-resort-reno": ["Nugget Casino Resort", "Nugget"],
  "hyatt-lake-tahoe": ["Hyatt Regency Lake Tahoe", "Hyatt Lake Tahoe", "Hyatt"],
  "harveys-lake-tahoe": ["Harveys Lake Tahoe", "Harvey's", "Harveys"],
  "harrahs-lake-tahoe": ["Harrahs Lake Tahoe", "Harrah's", "Harrahs"],
  "golden-nugget-lake-tahoe": ["Golden Nugget Lake Tahoe", "Golden Nugget"],
  "lake-tahoe-resort-hotel": ["Lake Tahoe Resort Hotel"],
  "margaritaville-lake-tahoe": ["Margaritaville Resort", "Margaritaville"],
  "old-greenwood-lodging-truckee-ca": ["Old Greenwood Lodging", "Old Greenwood"],
  "hampton-inn-truckee-ca": ["Hampton Inn Truckee", "Hampton Inn"],
  "river-pines-resort-graeagle-ca": ["River Pines Resort", "River Pines"],
  "plumas-pines-private-residency-graeagle": ["Plumas Pines Private Residency", "Plumas Pines"],
  "carson-valley-inn-casino": ["Carson Valley Inn"],
};

const API_URL = "https://golfthehighsierra.com/trips-caddie/api/api-recaps.php";
const CADDIE_URL = "https://tripscaddie.golfthehighsierra.com";

interface Trip {
  id?: string; groupName?: string; groupSize?: number; nights?: number; rounds?: number;
  courses?: string[]; lodging?: string; pricePerPerson?: number; pricePerPersonEstimate?: number;
  vibe?: string; synopsis?: string; month?: string; year?: number;
  dailyItinerary?: { day?: number; activity?: string; time?: string }[];
}

const VIBE_COLORS: Record<string, string> = {
  budget: "bg-blue-400/20 text-blue-200 border-blue-400/30",
  value: "bg-teal-400/20 text-teal-200 border-teal-400/30",
  premium: "bg-amber-400/20 text-amber-200 border-amber-400/30",
  "bucket list": "bg-purple-400/20 text-purple-200 border-purple-400/30",
  "bachelor party": "bg-rose-400/20 text-rose-200 border-rose-400/30",
  corporate: "bg-slate-400/20 text-slate-200 border-slate-400/30",
};

function matchesCourse(trip: Trip, names: string[]): boolean {
  if (!trip.courses) return false;
  return trip.courses.some(c => names.some(n =>
    c.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(c.toLowerCase())
  ));
}
function matchesLodging(trip: Trip, names: string[]): boolean {
  if (!trip.lodging) return false;
  const l = trip.lodging.toLowerCase();
  return names.some(n => l.includes(n.toLowerCase()) || n.toLowerCase().includes(l));
}

/* ── Mini Trip Card (dark theme, compact for hero slider) ── */
function MiniCard({ trip, active }: { trip: Trip; active: boolean }) {
  const price = trip.pricePerPerson || trip.pricePerPersonEstimate;
  const nights = trip.nights || ((trip.dailyItinerary?.length || 1) - 1);
  const vibeClass = VIBE_COLORS[(trip.vibe || "").toLowerCase()] || "bg-white/10 text-white/70 border-white/20";

  return (
    <div className={`transition-all duration-700 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"}`}>
      <div className="bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Card Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white leading-snug mb-1">{trip.groupName || "Golf Group"}</h3>
              <div className="flex items-center gap-2 text-[11px] text-white/40 font-medium">
                {trip.month && <span>📅 {trip.month} {trip.year}</span>}
              </div>
            </div>
            {trip.vibe && (
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap ${vibeClass}`}>
                {trip.vibe}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl py-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-white/30 tracking-wider mb-0.5">Pax</div>
              <div className="text-lg font-bold text-white leading-none">{trip.groupSize || "—"}</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl py-2.5 text-center">
              <div className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-wider mb-0.5">From</div>
              <div className="text-lg font-bold text-emerald-300 leading-none">${price ? Math.round(price) : "—"}</div>
              <div className="text-[8px] uppercase font-bold text-emerald-400/50 tracking-wide">/person</div>
            </div>
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl py-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-white/30 tracking-wider mb-0.5">Nights</div>
              <div className="text-lg font-bold text-white leading-none">{nights}</div>
            </div>
            <div className="bg-white/[0.05] border border-white/[0.06] rounded-xl py-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-white/30 tracking-wider mb-0.5">Rounds</div>
              <div className="text-lg font-bold text-white leading-none">{trip.rounds || trip.courses?.length || 0}</div>
            </div>
          </div>

          {/* Courses */}
          {trip.courses && trip.courses.length > 0 && (
            <div className="mb-3">
              <div className="text-[9px] uppercase tracking-widest text-white/25 font-bold mb-2">⛳ Courses</div>
              <div className="flex flex-wrap gap-1.5">
                {trip.courses.slice(0, 4).map((c, i) => (
                  <span key={i} className="bg-white/[0.06] text-white/70 px-2 py-1 rounded-lg text-[11px] font-medium border border-white/[0.06]">{c}</span>
                ))}
                {trip.courses.length > 4 && <span className="text-[11px] text-white/30 px-1 py-1">+{trip.courses.length - 4} more</span>}
              </div>
            </div>
          )}

          {/* Lodging */}
          {trip.lodging && (
            <div className="mb-3">
              <div className="text-[9px] uppercase tracking-widest text-white/25 font-bold mb-2">🏨 Stayed</div>
              <span className="bg-indigo-500/15 text-indigo-200/80 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-indigo-400/15">{trip.lodging}</span>
            </div>
          )}

          {/* Synopsis */}
          {trip.synopsis && (
            <p className="text-[12px] text-white/40 italic leading-relaxed border-l-2 border-emerald-500/40 pl-3 mt-3 line-clamp-2">&ldquo;{trip.synopsis}&rdquo;</p>
          )}
        </div>

        {/* CTA */}
        <div className="border-t border-white/[0.06] p-4 flex gap-2">
          <a
            href="/contact-custom-golf-package/"
            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-[11px] font-extrabold uppercase tracking-wide text-center transition-all shadow-lg shadow-emerald-900/30"
          >
            📋 Book This Trip
          </a>
          <a
            href={CADDIE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white rounded-xl text-[11px] font-bold transition-all border border-white/[0.08]"
          >
            Browse All →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HERO TRIP SLIDER — right side of hero
   ═══════════════════════════════════════ */
export default function HeroTripSlider({ slug, type }: { slug: string; type: "course" | "hotel" }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const names = type === "course" ? COURSE_NAMES[slug] : LODGING_NAMES[slug];
    if (!names) { setLoaded(true); return; }
    fetch(`${API_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then((data: Trip[]) => {
        setTrips(data.filter(t => type === "course" ? matchesCourse(t, names) : matchesLodging(t, names)).slice(0, 8));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [slug, type]);

  /* Auto-rotate every 6 seconds */
  const next = useCallback(() => setActive(a => (a + 1) % Math.max(trips.length, 1)), [trips.length]);
  useEffect(() => {
    if (trips.length < 2) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [trips.length, next]);

  if (!loaded || trips.length === 0) return null;

  return (
    <div className="flex flex-col h-full justify-center px-6 py-8 lg:px-10 lg:py-12">
      {/* Section label */}
      <div className="mb-4">
        <div className="text-[9px] uppercase tracking-[4px] text-emerald-400/70 font-bold mb-1">Trips Caddie</div>
        <div className="text-sm text-white/50 font-light">
          <span className="text-white font-bold">{trips.length}</span> group{trips.length !== 1 ? "s" : ""} played here
        </div>
      </div>

      {/* Cards — stacked, only active visible */}
      <div className="relative flex-1 min-h-0">
        {trips.map((trip, i) => (
          <MiniCard key={trip.id || i} trip={trip} active={i === active} />
        ))}
      </div>

      {/* Navigation dots + arrows */}
      {trips.length > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setActive(a => (a - 1 + trips.length) % trips.length)} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/[0.06]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex gap-2">
            {trips.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-emerald-400" : "w-1.5 bg-white/20 hover:bg-white/40"}`} />
            ))}
          </div>
          <button onClick={next} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/[0.06]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
