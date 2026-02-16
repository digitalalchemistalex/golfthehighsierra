"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ─── Slug → TripsCaddie name mapping ─── */
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
  "old-greenwood-lodging-truckee-ca": ["Old Greenwood Lodging", "Old Greenwood"],
  "hampton-inn-truckee-ca": ["Hampton Inn Truckee", "Hampton Inn"],
  "luxury-suite-cedar-house": ["Cedar House Sport Hotel", "Cedar House"],
  "river-pines-resort-graeagle-ca": ["River Pines Resort", "River Pines"],
  "plumas-pines-private-residency-graeagle": ["Plumas Pines Private Residency", "Plumas Pines"],
  "carson-valley-inn-casino": ["Carson Valley Inn"],
  "portola-hotel-spa-monterey": ["Portola Hotel & Spa", "Portola Hotel"],
};

const API_URL = "https://golfthehighsierra.com/trips-caddie/api/api-recaps.php";

interface Trip {
  id?: string;
  groupName?: string;
  groupSize?: number;
  nights?: number;
  rounds?: number;
  courses?: string[];
  lodging?: string;
  pricePerPerson?: number;
  pricePerPersonEstimate?: number;
  vibe?: string;
  synopsis?: string;
  region?: string;
}

function matchesCourse(trip: Trip, names: string[]): boolean {
  if (!trip.courses || !Array.isArray(trip.courses)) return false;
  return trip.courses.some(c =>
    names.some(n => c.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(c.toLowerCase()))
  );
}

function matchesLodging(trip: Trip, names: string[]): boolean {
  if (!trip.lodging) return false;
  const l = trip.lodging.toLowerCase();
  return names.some(n => l.includes(n.toLowerCase()) || n.toLowerCase().includes(l));
}

export default function RelatedTrips({ slug, type }: { slug: string; type: "course" | "hotel" }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const names = type === "course" ? COURSE_NAMES[slug] : LODGING_NAMES[slug];
    if (!names) { setLoading(false); return; }

    fetch(`${API_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then((data: Trip[]) => {
        const matched = data.filter(t =>
          type === "course" ? matchesCourse(t, names) : matchesLodging(t, names)
        );
        setTrips(matched.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, type]);

  if (loading) return null;
  if (trips.length === 0) return null;

  const label = type === "course" ? "This Course" : "This Hotel";

  return (
    <section style={{ padding: "80px 0", background: "#0a0f0a" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
            color: "#b49a6a", marginBottom: 12, fontFamily: "Manrope, sans-serif"
          }}>
            Real Trips Featuring {label}
          </div>
          <h2 style={{
            fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 300, color: "#fff", margin: 0, lineHeight: 1.2
          }}>
            {trips.length} Group{trips.length !== 1 ? "s" : ""} Played Here
          </h2>
          <p style={{
            fontFamily: "Manrope, sans-serif", fontSize: 14, color: "rgba(255,255,255,.5)",
            marginTop: 8, maxWidth: 500, marginLeft: "auto", marginRight: "auto"
          }}>
            Browse real itineraries from past groups — see what they paid, where they stayed, and how they built their trip.
          </p>
        </div>

        {/* Trip Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 20,
        }}>
          {trips.map((trip, i) => {
            const price = trip.pricePerPerson || trip.pricePerPersonEstimate;
            return (
              <div key={trip.id || i} style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 12, padding: 24,
                transition: "border-color .2s, transform .2s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(180,154,106,.3)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,.08)";
                  (e.currentTarget as HTMLDivElement).style.transform = "none";
                }}
              >
                {/* Top row: name + vibe */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 20, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>
                    {trip.groupName || "Golf Group Trip"}
                  </div>
                  {trip.vibe && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
                      color: "#b49a6a", background: "rgba(180,154,106,.12)",
                      padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0
                    }}>
                      {trip.vibe}
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div style={{
                  display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16,
                  fontFamily: "Manrope, sans-serif", fontSize: 13, color: "rgba(255,255,255,.6)"
                }}>
                  {trip.groupSize && <span>👥 {trip.groupSize} golfers</span>}
                  {trip.nights && <span>🌙 {trip.nights} nights</span>}
                  {trip.rounds && <span>⛳ {trip.rounds} rounds</span>}
                  {price && <span style={{ color: "#b49a6a", fontWeight: 600 }}>${Math.round(price)}/person</span>}
                </div>

                {/* Courses */}
                {trip.courses && trip.courses.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, fontFamily: "Manrope, sans-serif" }}>
                      Courses
                    </div>
                    <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "rgba(255,255,255,.7)", lineHeight: 1.6 }}>
                      {trip.courses.join(" → ")}
                    </div>
                  </div>
                )}

                {/* Lodging */}
                {trip.lodging && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, fontFamily: "Manrope, sans-serif" }}>
                      Lodging
                    </div>
                    <div style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "rgba(255,255,255,.7)" }}>
                      🏨 {trip.lodging}
                    </div>
                  </div>
                )}

                {/* Synopsis */}
                {trip.synopsis && (
                  <div style={{
                    fontFamily: "Manrope, sans-serif", fontSize: 12, color: "rgba(255,255,255,.4)",
                    fontStyle: "italic", lineHeight: 1.5, borderTop: "1px solid rgba(255,255,255,.06)",
                    paddingTop: 12
                  }}>
                    {trip.synopsis.length > 150 ? trip.synopsis.slice(0, 150) + "…" : trip.synopsis}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a
            href={`https://tripscaddie.golfthehighsierra.com/`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "Manrope, sans-serif", fontSize: 14, fontWeight: 600,
              color: "#0a0f0a", background: "#b49a6a", padding: "14px 32px",
              borderRadius: 8, textDecoration: "none", transition: "background .2s"
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#c8ae7e")}
            onMouseLeave={e => (e.currentTarget.style.background = "#b49a6a")}
          >
            Browse All Trips in Trips Caddie →
          </a>
          <div style={{ marginTop: 12, fontFamily: "Manrope, sans-serif", fontSize: 12, color: "rgba(255,255,255,.35)" }}>
            Want a similar trip? Request a custom quote and we&apos;ll respond within 24 hours.
          </div>
        </div>
      </div>
    </section>
  );
}
