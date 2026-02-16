"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback, useRef } from "react";

/* ─── Slug → name maps ─── */
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

interface Trip {
  id?: string; groupName?: string; groupSize?: number; nights?: number; rounds?: number;
  courses?: string[]; lodging?: string; pricePerPerson?: number; pricePerPersonEstimate?: number;
  vibe?: string; synopsis?: string; month?: string; year?: number;
  dailyItinerary?: { day?: number; activity?: string; time?: string }[];
}

const VIBE_COLORS: Record<string, string> = {
  budget: "bg-blue-100/80 text-blue-800 border-blue-200",
  value: "bg-teal-100/80 text-teal-800 border-teal-200",
  premium: "bg-amber-100/80 text-amber-800 border-amber-200",
  "bucket list": "bg-purple-100/80 text-purple-800 border-purple-200",
  "bachelor party": "bg-rose-100/80 text-rose-800 border-rose-200",
  corporate: "bg-slate-200/80 text-slate-800 border-slate-300",
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

/* ══════════════════════════════════════
   WHITE CARD — exact TripsCaddie style
   ══════════════════════════════════════ */
function SliderCard({ trip }: { trip: Trip }) {
  const price = trip.pricePerPerson || trip.pricePerPersonEstimate;
  const nights = trip.nights && trip.nights > 0 ? trip.nights : ((trip.dailyItinerary?.length || 1) - 1);
  const vibeClass = VIBE_COLORS[(trip.vibe || "").toLowerCase()] || "bg-white/90 text-slate-800 border-slate-200";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">{trip.groupName || "Golf Group"}</h3>
            {(trip.month || trip.year) && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-1">
                📅 {trip.month} {trip.year}
              </div>
            )}
          </div>
          {trip.vibe && (
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 ${vibeClass}`}>
              {trip.vibe}
            </span>
          )}
        </div>

        {/* Stats Grid — exact TripsCaddie layout */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2.5 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-help" title="Number of Travelers">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Pax</span>
            <span className="block text-lg font-bold text-slate-800 leading-none">{trip.groupSize || "TBD"}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-emerald-50/50 border border-emerald-100/50 rounded-xl py-2.5 hover:bg-emerald-50 hover:shadow-sm hover:border-emerald-200 transition-all cursor-help" title="Price per person">
            <span className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider leading-none mb-0.5">From</span>
            <span className="block text-lg font-bold text-emerald-800 leading-none">${price ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price) : "TBD"}</span>
            <span className="text-[9px] uppercase font-bold text-emerald-600/60 tracking-wide mt-0.5">/Person</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2.5 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-help" title="Nights">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Nights</span>
            <span className="block text-lg font-bold text-slate-800 leading-none">{nights}</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2.5 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-help" title="Rounds">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Rounds</span>
            <span className="block text-lg font-bold text-slate-800 leading-none">{trip.rounds || trip.courses?.length || 0}</span>
          </div>
        </div>

        {/* Synopsis */}
        {trip.synopsis && (
          <p className="text-sm text-slate-600 italic leading-relaxed border-l-[3px] border-emerald-500 pl-4 py-1 mb-4 line-clamp-2">&ldquo;{trip.synopsis}&rdquo;</p>
        )}

        {/* Courses */}
        {trip.courses && trip.courses.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">⛳ Activities</div>
            <div className="flex flex-wrap gap-1.5">
              {trip.courses.slice(0, 4).map((c, i) => (
                <span key={i} className="bg-white text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 shadow-sm">{c}</span>
              ))}
              {trip.courses.length > 4 && <span className="text-xs text-slate-400 px-1 py-1.5">+{trip.courses.length - 4}</span>}
            </div>
          </div>
        )}

        {/* Lodging */}
        {trip.lodging && (
          <div>
            <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">🏨 Stayed</div>
            <span className="inline-flex items-center bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100">{trip.lodging}</span>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="border-t border-slate-100 p-4 mt-auto">
        <a
          href="/contact-custom-golf-package/"
          className="block w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wide text-center transition-all shadow-md shadow-emerald-200 hover:shadow-lg active:scale-[0.98]"
        >
          📋 Book This Trip
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HERO TRIP SLIDER
   ═══════════════════════════════════════ */
export default function HeroTripSlider({ slug, type }: { slug: string; type: "course" | "hotel" }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  /* Auto-rotate — STOPS on hover */
  const next = useCallback(() => setActive(a => (a + 1) % Math.max(trips.length, 1)), [trips.length]);
  useEffect(() => {
    if (trips.length < 2 || hovered) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [trips.length, next, hovered]);

  if (!loaded || trips.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full justify-center p-6 lg:p-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Label */}
      <div className="mb-4">
        <div className="text-[9px] uppercase tracking-[4px] text-emerald-400/70 font-bold mb-1">Trips Caddie</div>
        <div className="text-sm text-white/50 font-light">
          <span className="text-white font-bold">{trips.length}</span> group{trips.length !== 1 ? "s" : ""} played here
        </div>
      </div>

      {/* Card area */}
      <div className="relative flex-1 min-h-[420px]">
        {trips.map((trip, i) => (
          <div
            key={trip.id || i}
            className={`transition-all duration-500 ease-in-out ${i === active ? "opacity-100 translate-x-0 relative" : "opacity-0 translate-x-8 absolute inset-0 pointer-events-none"}`}
          >
            <SliderCard trip={trip} />
          </div>
        ))}
      </div>

      {/* Nav */}
      {trips.length > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setActive(a => (a - 1 + trips.length) % trips.length)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex gap-2">
            {trips.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-emerald-400" : "w-1.5 bg-white/20 hover:bg-white/40"}`} />
            ))}
          </div>
          <button onClick={next} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
