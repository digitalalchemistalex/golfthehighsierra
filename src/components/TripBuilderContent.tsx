"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  ArrowRight,
  Filter,
  X,
  Star,
} from "lucide-react";
import tripsData from "@/data/trips.json";

/* ─── Types ─── */
interface DayItinerary {
  day: number | string;
  activity: string;
  location: string;
  time: string;
  notes: string;
}

interface Trip {
  id: string;
  name: string;
  region: string;
  vibe: string;
  pricePerPerson: number | string;
  nights: number | string;
  rounds: number | string;
  groupSize: number | string;
  courses: string[];
  lodging: string;
  synopsis: string;
  highlights: string[];
  logistics: string | Record<string, unknown>;
  whyItWorked: string;
  dailyItinerary: DayItinerary[];
  year: number | string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const trips: Trip[] = tripsData as any as Trip[];

/* ─── Derived filter options from real data ─── */
const CORE_REGIONS = ["Reno", "Truckee", "Graeagle", "Lake Tahoe", "Carson Valley", "Mesquite", "Monterey"];
const allRegions = Array.from(new Set(trips.map((t) => t.region))).sort((a, b) => {
  const ai = CORE_REGIONS.indexOf(a);
  const bi = CORE_REGIONS.indexOf(b);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.localeCompare(b);
});

const allVibes = Array.from(new Set(trips.map((t) => t.vibe))).filter(Boolean).sort();

/* ─── Helpers ─── */
function formatPrice(p: number | string): string {
  const n = typeof p === "string" ? parseFloat(p) : p;
  if (!n || isNaN(n)) return "—";
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function getVibeColor(vibe: string): string {
  switch (vibe) {
    case "Premium": return "bg-gold-400/15 text-gold-600 border-gold-400/30";
    case "Value": return "bg-pine-400/15 text-pine-600 border-pine-400/30";
    case "Budget": return "bg-teal/15 text-teal border-teal/30";
    case "Bachelor Party": return "bg-red-100 text-red-700 border-red-200";
    case "Bucket List": return "bg-purple-100 text-purple-700 border-purple-200";
    default: return "bg-cream-300/50 text-ink-3 border-cream-400";
  }
}

/* ─── Trip Card ─── */
function TripCard({ trip }: { trip: Trip }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-cream-400/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-xl font-bold text-pine-800 leading-tight mb-1 truncate">
              {trip.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-ink-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{trip.region}</span>
              {trip.year && (
                <>
                  <span className="text-cream-500">·</span>
                  <span>{trip.year}</span>
                </>
              )}
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${getVibeColor(trip.vibe)}`}>
            {trip.vibe}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-4 py-3 px-4 bg-cream-100 rounded-xl text-sm">
          <div className="flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-pine-400" />
            <span className="font-semibold text-pine-800">{trip.nights}</span>
            <span className="text-ink-3">nights</span>
          </div>
          <div className="w-px h-4 bg-cream-400" />
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-gold-400" />
            <span className="font-semibold text-pine-800">{trip.rounds}</span>
            <span className="text-ink-3">rounds</span>
          </div>
          <div className="w-px h-4 bg-cream-400" />
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-pine-400" />
            <span className="font-semibold text-pine-800">{trip.groupSize || "—"}</span>
            <span className="text-ink-3">golfers</span>
          </div>
        </div>

        {/* Courses */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-4 mb-2">Courses</p>
          <div className="flex flex-wrap gap-1.5">
            {trip.courses.slice(0, expanded ? undefined : 4).map((c, i) => (
              <span key={i} className="text-xs bg-pine-50 text-pine-700 px-2.5 py-1 rounded-lg border border-pine-100">
                {c}
              </span>
            ))}
            {!expanded && trip.courses.length > 4 && (
              <span className="text-xs bg-cream-200 text-ink-3 px-2.5 py-1 rounded-lg">
                +{trip.courses.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Lodging */}
        {trip.lodging && (
          <div className="mt-3 flex items-center gap-2 text-sm text-ink-3">
            <Star className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-medium text-ink-2">{trip.lodging}</span>
          </div>
        )}
      </div>

      {/* Price bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pine-800 to-pine-700">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-cream-300/60">Per Person</p>
          <p className="text-2xl font-bold text-white font-heading">
            {formatPrice(trip.pricePerPerson)}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors"
        >
          {expanded ? "Less" : "Details"}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-cream-300">
          {/* Synopsis */}
          {trip.synopsis && (
            <div className="px-6 py-4 border-b border-cream-200">
              <p className="text-sm text-ink-3 leading-relaxed">{trip.synopsis}</p>
            </div>
          )}

          {/* Daily Itinerary */}
          {trip.dailyItinerary.length > 0 && (
            <div className="px-6 py-4 border-b border-cream-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-4 mb-3">Daily Itinerary</p>
              <div className="space-y-2">
                {trip.dailyItinerary.map((day, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="w-14 flex-shrink-0 font-semibold text-pine-600">
                      Day {day.day}
                    </span>
                    <div className="flex-1">
                      <p className="text-ink-2 font-medium">{day.activity}</p>
                      {day.time && <p className="text-xs text-ink-4 mt-0.5">{day.time}</p>}
                      {day.notes && <p className="text-xs text-ink-4 mt-0.5 italic">{day.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {trip.highlights.length > 0 && (
            <div className="px-6 py-4 border-b border-cream-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-4 mb-3">Highlights</p>
              <ul className="space-y-1.5">
                {trip.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-3">
                    <span className="text-gold-400 mt-0.5">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Why it worked */}
          {trip.whyItWorked && (
            <div className="px-6 py-4 border-b border-cream-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-4 mb-2">Why It Worked</p>
              <p className="text-sm text-ink-3 leading-relaxed">{trip.whyItWorked}</p>
            </div>
          )}

          {/* CTA */}
          <div className="px-6 py-4 bg-cream-100">
            <Link
              href={`/contact-custom-golf-package/?trip=${encodeURIComponent(trip.name)}&region=${encodeURIComponent(trip.region)}`}
              className="w-full flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-pine-900 font-bold py-3 px-6 rounded-xl transition-colors text-sm"
            >
              Request This Trip <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function TripBuilderContent() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [nightsRange, setNightsRange] = useState<[number, number]>([0, 99]);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "nights" | "rounds">("price-asc");
  const [showFilters, setShowFilters] = useState(true);

  const toggleRegion = (r: string) =>
    setSelectedRegions((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  const toggleVibe = (v: string) =>
    setSelectedVibes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  const clearAll = () => {
    setSelectedRegions([]);
    setSelectedVibes([]);
    setNightsRange([0, 99]);
  };

  const filtered = useMemo(() => {
    let result = [...trips];

    if (selectedRegions.length > 0)
      result = result.filter((t) => selectedRegions.includes(t.region));
    if (selectedVibes.length > 0)
      result = result.filter((t) => selectedVibes.includes(t.vibe));
    if (nightsRange[0] > 0 || nightsRange[1] < 99)
      result = result.filter((t) => {
        const n = typeof t.nights === "string" ? parseInt(t.nights) : t.nights;
        return n >= nightsRange[0] && n <= nightsRange[1];
      });

    result.sort((a, b) => {
      const pa = typeof a.pricePerPerson === "string" ? parseFloat(a.pricePerPerson) : a.pricePerPerson;
      const pb = typeof b.pricePerPerson === "string" ? parseFloat(b.pricePerPerson) : b.pricePerPerson;
      switch (sortBy) {
        case "price-asc": return pa - pb;
        case "price-desc": return pb - pa;
        case "nights":
          return (typeof a.nights === "string" ? parseInt(a.nights) : a.nights) -
                 (typeof b.nights === "string" ? parseInt(b.nights) : b.nights);
        case "rounds":
          return (typeof b.rounds === "string" ? parseInt(b.rounds) : b.rounds) -
                 (typeof a.rounds === "string" ? parseInt(a.rounds) : a.rounds);
        default: return 0;
      }
    });

    return result;
  }, [selectedRegions, selectedVibes, nightsRange, sortBy]);

  const hasFilters = selectedRegions.length > 0 || selectedVibes.length > 0;

  // Stats
  const avgPrice = filtered.length > 0
    ? filtered.reduce((s, t) => s + (typeof t.pricePerPerson === "string" ? parseFloat(t.pricePerPerson) : t.pricePerPerson), 0) / filtered.length
    : 0;

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <section className="relative bg-pine-800 pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pine-900/95 via-pine-800 to-pine-700/90" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="inline-block bg-gold-400/15 text-gold-400 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-5 border border-gold-400/20">
            Powered by Real Trip Data
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight">
            Trip Builder
          </h1>
          <p className="text-lg text-cream-300/80 max-w-2xl mx-auto leading-relaxed">
            Browse {trips.length} real trips we&apos;ve organized for groups just like yours.
            Filter by destination, vibe, and budget — then request your own.
          </p>
          <p className="mt-4 text-xs text-cream-300/40 max-w-lg mx-auto">
            Prices shown are from actual past trips. Your quote may vary based on season, group size, availability, and current rates.
          </p>
        </div>
      </section>

      {/* Filters + Results */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Filter toggle mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 mb-4 text-sm font-semibold text-pine-700 bg-white px-4 py-2.5 rounded-xl border border-cream-400 shadow-sm"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
          {hasFilters && (
            <span className="bg-gold-400 text-pine-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {selectedRegions.length + selectedVibes.length}
            </span>
          )}
        </button>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-cream-400/60 p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-lg font-bold text-pine-800">Filter Trips</h2>
              {hasFilters && (
                <button onClick={clearAll} className="flex items-center gap-1 text-xs text-ink-4 hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              )}
            </div>

            {/* Region */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-4 mb-2.5">Destination</p>
              <div className="flex flex-wrap gap-2">
                {allRegions.map((r) => {
                  const count = trips.filter((t) => t.region === r).length;
                  const active = selectedRegions.includes(r);
                  return (
                    <button
                      key={r}
                      onClick={() => toggleRegion(r)}
                      className={`text-sm px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                        active
                          ? "bg-pine-700 text-white border-pine-700 shadow-sm"
                          : "bg-cream-100 text-ink-3 border-cream-400 hover:border-pine-300 hover:text-pine-700"
                      }`}
                    >
                      {r} <span className="opacity-50 ml-0.5">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vibe */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-4 mb-2.5">Vibe</p>
              <div className="flex flex-wrap gap-2">
                {allVibes.map((v) => {
                  const count = trips.filter((t) => t.vibe === v).length;
                  const active = selectedVibes.includes(v);
                  return (
                    <button
                      key={v}
                      onClick={() => toggleVibe(v)}
                      className={`text-sm px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                        active
                          ? "bg-gold-400 text-pine-900 border-gold-400 shadow-sm font-semibold"
                          : "bg-cream-100 text-ink-3 border-cream-400 hover:border-gold-300 hover:text-gold-600"
                      }`}
                    >
                      {v} <span className="opacity-50 ml-0.5">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 pt-3 border-t border-cream-300">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-4">Sort</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm bg-cream-100 border border-cream-400 rounded-lg px-3 py-1.5 text-ink-2 focus:outline-none focus:border-pine-400"
              >
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="nights">Nights: Short → Long</option>
                <option value="rounds">Most Rounds</option>
              </select>
            </div>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-ink-3">
              <span className="font-bold text-pine-800 text-lg">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "trip" : "trips"} found
              {hasFilters && " matching your filters"}
            </p>
            {filtered.length > 0 && (
              <p className="text-xs text-ink-4 mt-0.5">
                Avg. {formatPrice(avgPrice)}/person
              </p>
            )}
          </div>
        </div>

        {/* Trip cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-7 h-7 text-ink-4" />
            </div>
            <p className="text-lg font-heading font-bold text-pine-800 mb-2">No trips match those filters</p>
            <p className="text-sm text-ink-3 mb-4">Try adjusting your destination or vibe selection.</p>
            <button onClick={clearAll} className="text-sm text-gold-600 hover:text-gold-500 font-semibold">
              Clear all filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-pine-800 to-pine-700 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
            Don&apos;t see exactly what you want?
          </h2>
          <p className="text-cream-300/80 max-w-lg mx-auto mb-6">
            Every trip is customizable. Tell us your dates, group size, and preferences — we&apos;ll build something perfect.
          </p>
          <Link
            href="/contact-custom-golf-package/"
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-pine-900 font-bold py-3.5 px-8 rounded-xl transition-colors"
          >
            Request a Custom Quote <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-[11px] text-cream-300/40">
            Prices shown are from actual past trips and serve as reference points.
            Your final quote may vary based on season, group size, availability, and current rates.
          </p>
        </div>
      </section>
    </div>
  );
}
