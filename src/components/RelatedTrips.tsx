"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import QuoteModal from "./QuoteModal";

/* ─────────────── SLUG → NAME MAPS ─────────────── */
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
  "bayonet-black-horse-group-golf-seaside": ["Bayonet Black Horse", "Bayonet", "Black Horse"],
  "poppy-hills-golf-course-pebble-beach-ca": ["Poppy Hills"],
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
  "plumas-pines-private-residency-graeagle": ["Plumas Pines Private Residency", "Plumas Pines Townhomes", "Plumas Pines"],
  "nakoma-resort-graeagle-ca": ["The Inn at Nakoma", "Inn at Nakoma", "Nakoma Resort", "Nakoma"],
  "chalet-view-lodge-graeagle-ca": ["Chalet View Lodge", "Chalet View"],
  "carson-valley-inn-casino": ["Carson Valley Inn"],
};

const API_URL = "https://golfthehighsierra.com/trips-caddie/api/api-recaps.php";
const CADDIE_URL = "https://tripscaddie.golfthehighsierra.com";

/* ─────────────── COURSE PORTFOLIO URLS ─────────────── */
const COURSE_URLS: Record<string, string> = {};
Object.keys(COURSE_NAMES).forEach(slug => {
  COURSE_NAMES[slug].forEach(name => {
    COURSE_URLS[name.toLowerCase()] = `/portfolio/${slug}/`;
  });
});
const LODGING_URLS: Record<string, string> = {};
Object.keys(LODGING_NAMES).forEach(slug => {
  LODGING_NAMES[slug].forEach(name => {
    LODGING_URLS[name.toLowerCase()] = `/portfolio/${slug}/`;
  });
});

function findUrl(name: string): string | null {
  const n = name.toLowerCase();
  for (const [key, url] of Object.entries({ ...COURSE_URLS, ...LODGING_URLS })) {
    if (n.includes(key) || key.includes(n)) return url;
  }
  return null;
}

/* ─────────────── TYPES ─────────────── */
interface DayItem { day?: number; date?: string; time?: string; activity?: string; location?: string; notes?: string; }
interface Logistics { transportType?: string; passengerCount?: number; specialRequests?: string[]; }
interface Trip {
  id?: string; groupName?: string; groupSize?: number; nights?: number; rounds?: number;
  courses?: string[]; lodging?: string; pricePerPerson?: number; pricePerPersonEstimate?: number;
  vibe?: string; synopsis?: string; whyItWorked?: string; highlights?: string[];
  dailyItinerary?: DayItem[]; logistics?: Logistics; region?: string; imageUrl?: string;
  month?: string; year?: number;
}

/* ─────────────── HELPERS ─────────────── */
function matchesCourse(trip: Trip, names: string[]): boolean {
  if (!trip.courses || !Array.isArray(trip.courses)) return false;
  return trip.courses.some(c => names.some(n =>
    c.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(c.toLowerCase())
  ));
}
function matchesLodging(trip: Trip, names: string[]): boolean {
  if (!trip.lodging) return false;
  const l = trip.lodging.toLowerCase();
  return names.some(n => l.includes(n.toLowerCase()) || n.toLowerCase().includes(l));
}

const VIBE_COLORS: Record<string, string> = {
  budget: "bg-blue-100/80 text-blue-800 border-blue-200",
  value: "bg-teal-100/80 text-teal-800 border-teal-200",
  premium: "bg-amber-100/80 text-amber-800 border-amber-200",
  "bucket list": "bg-purple-100/80 text-purple-800 border-purple-200",
  "bachelor party": "bg-rose-100/80 text-rose-800 border-rose-200",
  corporate: "bg-slate-200/80 text-slate-800 border-slate-300",
};

/* stock images by vibe */
const STOCK: Record<string, string[]> = {
  golf: [
    "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&q=80&w=800",
  ],
};
function pickImage(trip: Trip): string {
  if (trip.imageUrl && trip.imageUrl.trim()) return trip.imageUrl;
  const idx = (trip.id || trip.groupName || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return STOCK.golf[idx % STOCK.golf.length];
}

/* ══════════════════════════════════════════════
   QUOTE MODAL — matches TripsCaddie exactly
   ══════════════════════════════════════════════ */
function TripCard({ trip, onQuote }: { trip: Trip; onQuote: (t: Trip) => void }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const imgSrc = pickImage(trip);
  const price = trip.pricePerPerson || trip.pricePerPersonEstimate;
  const vibeClass = VIBE_COLORS[(trip.vibe || "").toLowerCase()] || "bg-white/90 text-slate-800 border-slate-200";
  const nights = trip.nights && trip.nights > 0 ? trip.nights : ((trip.dailyItinerary?.length || 1) - 1);

  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-200 ${showLogistics ? "" : "h-[640px]"}`}>
      {/* ── Image Header ── */}
      <div className="h-40 bg-slate-900 relative shrink-0 overflow-hidden">
        <div className={`absolute inset-0 bg-slate-800 animate-pulse z-0 ${imgLoaded ? "hidden" : "block"}`} />
        <img src={imgSrc} loading="lazy" onLoad={() => setImgLoaded(true)} onError={e => { (e.target as HTMLImageElement).src = STOCK.golf[0]; }} alt={trip.groupName || "Trip"} className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${imgLoaded ? "opacity-90 scale-100 hover:scale-110" : "opacity-0 scale-105"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
        {trip.vibe && (
          <div className="absolute top-3 right-3 z-10">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm backdrop-blur-sm ${vibeClass}`}>{trip.vibe}</span>
          </div>
        )}
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h3 className="font-extrabold text-xl leading-snug drop-shadow-sm mb-1 line-clamp-2">{trip.groupName || "Golf Group Trip"}</h3>
          <div className="flex items-center text-xs font-bold text-slate-200 uppercase tracking-wide">
            📅 {trip.month} {trip.year}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto flex flex-col bg-white">
        <div className="p-6 pb-2">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <div title="Number of Travelers" className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2.5 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-help">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Pax</span>
              <span className="block text-lg font-bold text-slate-800 leading-none">{trip.groupSize || "TBD"}</span>
            </div>
            <div title="Estimated price per person" className="flex flex-col items-center justify-center bg-emerald-50/50 border border-emerald-100/50 rounded-xl py-2.5 hover:bg-emerald-50 hover:shadow-sm hover:border-emerald-200 transition-all cursor-help">
              <span className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider leading-none mb-0.5">From</span>
              <span className="block text-lg font-bold text-emerald-800 leading-none">${price ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price) : "TBD"}</span>
              <span className="text-[9px] uppercase font-bold text-emerald-600/60 tracking-wide mt-0.5">/Person</span>
            </div>
            <div title="Total nights" className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2.5 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-help">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Nights</span>
              <span className="block text-lg font-bold text-slate-800 leading-none">{nights}</span>
            </div>
            <div title="Number of Golf Rounds" className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2.5 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all cursor-help">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Rounds</span>
              <span className="block text-lg font-bold text-slate-800 leading-none">{trip.rounds || trip.courses?.length || 0}</span>
            </div>
          </div>

          {/* Synopsis */}
          {trip.synopsis && (
            <div className="mb-6">
              <p className="text-sm text-slate-600 italic leading-relaxed border-l-[3px] border-emerald-500 pl-4 py-1">&ldquo;{trip.synopsis}&rdquo;</p>
            </div>
          )}

          {/* Activities/Courses */}
          <div className="space-y-5 mb-6">
            {trip.courses && trip.courses.length > 0 && (
              <div>
                <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2.5">⛳ Activities</div>
                <div className="flex flex-wrap gap-2">
                  {trip.courses.map((c, i) => {
                    const url = findUrl(c);
                    return url ? (
                      <a key={i} href={url} className="bg-white text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 shadow-sm hover:border-emerald-400 hover:text-emerald-700 hover:shadow-md transition-all flex items-center gap-1">
                        {c} <svg className="w-2.5 h-2.5 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    ) : (
                      <span key={i} className="bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200">{c}</span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lodging */}
            {trip.lodging && (
              <div>
                <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2.5">🏨 Stayed</div>
                {(() => {
                  const url = findUrl(trip.lodging);
                  return url ? (
                    <a href={url} className="inline-flex items-center bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all gap-1">
                      {trip.lodging} <svg className="w-2.5 h-2.5 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  ) : (
                    <span className="inline-flex items-center bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100">{trip.lodging}</span>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Highlights */}
          {trip.highlights && trip.highlights.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2.5">⭐ Highlights</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {trip.highlights.map((h, i) => (
                  <span key={i} className="text-xs font-medium text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Why It Worked / Pro Tip */}
          {trip.whyItWorked && (
            <div className={`border rounded-xl p-5 mb-2 relative overflow-hidden ${(trip.rounds || 0) > 0 ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${(trip.rounds || 0) > 0 ? "text-amber-800" : "text-slate-600"}`}>
                  {(trip.rounds || 0) > 0 ? "💡 Pro Tip" : "📋 Package Insight"}
                </span>
              </div>
              <p className={`text-xs leading-relaxed font-medium pl-1 ${(trip.rounds || 0) > 0 ? "text-amber-950/80" : "text-slate-600"}`}>&ldquo;{trip.whyItWorked}&rdquo;</p>
            </div>
          )}
        </div>

        {/* ── Logistics & Itinerary (expandable) ── */}
        {showLogistics && trip.dailyItinerary && trip.dailyItinerary.length > 0 && (
          <div className="px-6 pb-6 pt-0">
            <div className="my-6 border-t border-slate-100 border-dashed" />
            <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4">Logistics & Manifest</h4>

            {trip.logistics?.transportType && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex items-start gap-4 shadow-sm">
                <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-700">🚐</div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Vehicle</span>
                  <span className="text-sm font-bold text-slate-900">{trip.logistics.transportType}</span>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="relative pl-8 space-y-8 py-2 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {trip.dailyItinerary.map((day, i) => (
                <div key={i} className="relative z-0">
                  <div className="absolute -left-[29px] top-1 h-6 w-6 rounded-full bg-white border-2 border-emerald-500 z-10 flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm font-bold text-slate-800 leading-tight">
                        Day {day.day || i + 1} <span className="text-slate-300 mx-1">·</span> {day.activity}
                      </span>
                      {day.time && (
                        <span className="shrink-0 text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{day.time}</span>
                      )}
                    </div>
                    {day.location && <div className="text-xs font-semibold text-slate-500">{day.location}</div>}
                    {day.notes && <div className="text-xs text-slate-500 italic leading-relaxed border-l-2 border-slate-200 pl-3 py-1 mt-1">&ldquo;{day.notes}&rdquo;</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Special Requests */}
            {trip.logistics?.specialRequests && trip.logistics.specialRequests.length > 0 && (
              <div className="mt-8 bg-rose-50 rounded-xl p-5 border border-rose-100">
                <h4 className="text-[10px] font-bold uppercase text-rose-500 tracking-wider mb-3">Special Requests</h4>
                <ul className="space-y-3">
                  {trip.logistics.specialRequests.map((r, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-3">
                      <div className="min-w-[4px] h-[4px] rounded-full bg-rose-400 mt-2" />
                      <span className="opacity-90 font-medium leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Footer Actions ── */}
      <div className="p-4 border-t border-slate-100 bg-white z-10 space-y-3 shrink-0">
        {trip.dailyItinerary && trip.dailyItinerary.length > 0 && (
          <button onClick={() => setShowLogistics(!showLogistics)} className="w-full text-sm font-bold uppercase tracking-wide text-rose-600 hover:text-rose-700 transition-colors flex items-center justify-center gap-1.5 pb-2">
            {showLogistics ? "▲ Close Logistics" : "▼ View Logistics & Itinerary"}
          </button>
        )}
        <div className="grid grid-cols-6 gap-3">
          <button
            onClick={() => onQuote(trip)}
            className="col-span-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all duration-300 shadow-md shadow-emerald-200 hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            📋 Custom Quote
          </button>
          <a
            href={`tel:+18885848232`}
            className="col-span-1 py-3 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm"
            title="Call to Book"
          >
            📞
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN — RelatedTrips Section
   ══════════════════════════════════════════════ */
export default function RelatedTrips({ slug, type }: { slug: string; type: "course" | "hotel" }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteTrip, setQuoteTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const names = type === "course" ? COURSE_NAMES[slug] : LODGING_NAMES[slug];
    if (!names) { setLoading(false); return; }
    fetch(`${API_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then((data: Trip[]) => {
        setTrips(data.filter(t => type === "course" ? matchesCourse(t, names) : matchesLodging(t, names)).slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, type]);

  if (loading || trips.length === 0) return null;

  const label = type === "course" ? "This Course" : "This Hotel";

  return (
    <>
      <section style={{ padding: "64px 0", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Real Trips Featuring {label}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700 }}>
              {trips.length} Group{trips.length !== 1 ? "s" : ""} <em className="italic text-slate-400">Played Here</em>
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">Real itineraries from past groups. See courses, lodging, day-by-day logistics, and pricing — then request an identical or customized quote.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, i) => (
              <TripCard key={trip.id || i} trip={trip} onQuote={setQuoteTrip} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href={CADDIE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all hover:shadow-lg">
              🏌️ Browse All Trips in Trips Caddie
            </a>
            <p className="text-xs text-slate-400 mt-3">Pick any trip → customize it → get a quote in 24 hours</p>
          </div>
        </div>
      </section>
      {quoteTrip && <QuoteModal trip={quoteTrip} onClose={() => setQuoteTrip(null)} />}
    </>
  );
}
