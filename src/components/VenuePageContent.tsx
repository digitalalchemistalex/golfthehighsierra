"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Types ─── */
interface VenueAddress { streetAddress?: string; addressLocality?: string; addressRegion?: string; postalCode?: string; }
interface VenueGeo { latitude?: number; longitude?: number; }
interface VenueHighlight { icon: string; label: string; value: string; }
interface VenueDistance { location: string; minutes: number; }
interface VenueParking { summary: string; details: string[]; }
interface VenueGroupEvents { description: string; idealFor: string; reservationUrl?: string; }
interface VenueFAQ { question: string; answer: string; }

export interface VenueProps {
  slug: string;
  name: string;
  type: string;
  region: string;
  regionLabel: string;
  parentVenue?: string | null;
  tagline?: string;
  bestFor?: string;
  address?: VenueAddress;
  geo?: VenueGeo;
  phone?: string | null;
  website?: string;
  hours?: string;
  priceRange?: string;
  ambiance?: string;
  dogFriendly?: boolean;
  description: string;
  pointOfView?: string;
  highlights?: VenueHighlight[];
  insiderTips?: string[];
  parking?: VenueParking;
  groupEvents?: VenueGroupEvents;
  distances?: VenueDistance[];
  directionsUrl?: string;
  heroImage?: string;
  images: string[];
  faqs: VenueFAQ[];
  meta: { title: string; description: string };
}

interface RelatedVenue {
  slug: string;
  name: string;
  type: string;
  regionLabel: string;
  heroImage?: string;
  tagline?: string;
}

/* ─── Reveal on scroll ─── */
function R({ children, className = "", delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: 0.08, rootMargin: "-20px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ ...style, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(24px)", transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── FAQ ─── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--v-pearl)" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "20px 0", background: "none", border: "none", fontFamily: "var(--v-body)", fontSize: 14, color: "var(--v-charcoal)", cursor: "pointer", textAlign: "left" as const, gap: 12, fontWeight: 400, transition: "color .3s", letterSpacing: ".01em" }}>
        {q}
        <span style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--v-pearl)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--v-stone)", transition: "all .4s", flexShrink: 0, fontWeight: 300, ...(open ? { background: "var(--v-bronze)", color: "#fff", borderColor: "var(--v-bronze)", transform: "rotate(45deg)" } : {}) }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height .5s ease" }}>
        <p style={{ paddingBottom: 20, fontSize: 13, color: "var(--v-stone)", lineHeight: 1.9, fontWeight: 300 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─── Lightbox ─── */
function Lightbox({ images, startIndex, onClose, name }: { images: string[]; startIndex: number; onClose: () => void; name: string }) {
  const [idx, setIdx] = useState(startIndex);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") setIdx(i => (i + 1) % images.length); if (e.key === "ArrowLeft") setIdx(i => (i - 1 + images.length) % images.length); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [images.length, onClose]);
  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white z-10 p-2"><X className="w-8 h-8" /></button>
      {images.length > 1 && <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }} className="absolute left-4 text-white/60 hover:text-white z-10 p-2"><ChevronLeft className="w-10 h-10" /></button>}
      <div className="relative w-[90vw] h-[80vh]" onClick={e => e.stopPropagation()}>
        <Image src={images[idx]} alt={`${name} ${idx + 1}`} fill className="object-contain" sizes="90vw" />
      </div>
      {images.length > 1 && <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} className="absolute right-4 text-white/60 hover:text-white z-10 p-2"><ChevronRight className="w-10 h-10" /></button>}
      <div className="absolute bottom-4 text-white/40 text-xs tracking-widest">{idx + 1} / {images.length}</div>
    </div>
  );
}

/* ─── Type label helper ─── */
function typeLabel(type: string): string {
  const map: Record<string, string> = {
    bar: "Bar & Nightlife", lounge: "Lounge", spa: "Spa & Wellness",
    museum: "Museum & Culture", shopping: "Shopping", pool: "Pool & Aquatics",
    fitness: "Fitness", amenity: "Amenity", restaurant: "Dining",
  };
  return map[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

/* ═══════════════════════════════════════
   MAIN COMPONENT — White Luxury Style
   Cormorant Garamond + Outfit
   ═══════════════════════════════════════ */
export default function VenuePageContent({ venue, relatedVenues = [] }: { venue: VenueProps; relatedVenues?: RelatedVenue[] }) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const gallery = venue.images || [];
  const addr = venue.address;
  const nameParts = venue.name.split(" ");
  const firstName = nameParts[0];

  const cssVars = {
    "--v-white": "#ffffff",
    "--v-snow": "#fdfcfb",
    "--v-bone": "#f5f2ee",
    "--v-pearl": "#e8e4de",
    "--v-sand": "#d4cfc6",
    "--v-stone": "#8a857c",
    "--v-charcoal": "#3a3832",
    "--v-ink": "#1a1917",
    "--v-bronze": "#a0845c",
    "--v-bronze-glow": "#b89b6e",
    "--v-serif": "'Cormorant Garamond', 'Cormorant', Georgia, serif",
    "--v-body": "'Outfit', 'Manrope', system-ui, sans-serif",
  } as React.CSSProperties;

  return (
    <div style={{ ...cssVars, fontFamily: "var(--v-body)", background: "var(--v-white)", color: "var(--v-ink)", overflowX: "hidden" }}>

      {/* ═══ 1. HERO ═══ */}
      <section style={{ position: "relative", height: "70vh", minHeight: 500, overflow: "hidden", background: "#0c0b09" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {venue.heroImage && (
            <Image
              src={venue.heroImage} alt={venue.name} fill priority
              className="object-cover"
              sizes="100vw"
              style={{ opacity: .45, transform: "scale(1.06)", animation: "venueHeroZoom 18s ease forwards" }}
            />
          )}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.3) 0%,transparent 40%,transparent 50%,rgba(0,0,0,.7) 100%)" }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: "clamp(24px,4vh,48px)", left: "clamp(32px,7vw,120px)", right: "clamp(32px,7vw,120px)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 3 }}>
          <div style={{ fontFamily: "var(--v-serif)", fontSize: 13, color: "rgba(255,255,255,.3)", letterSpacing: 3, textTransform: "uppercase" }}>Golf the High Sierra</div>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href="/experiences-things-to-do-in-reno-nv/" style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "var(--v-body)" }}>Experiences</Link>
            <Link href="/contact-custom-golf-package/" style={{ fontSize: 10, color: "rgba(255,255,255,.3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "var(--v-body)" }}>Book</Link>
          </div>
        </div>

        {/* Hero content */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(32px,7vw,120px) clamp(48px,8vh,90px)" }}>
          <R>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(160,132,92,.35)", fontSize: 9, color: "var(--v-bronze-glow)", fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20, backdropFilter: "blur(8px)", background: "rgba(0,0,0,.2)" }}>
              {typeLabel(venue.type)}
            </div>
          </R>
          <R delay={0.06}>
            <h1 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(44px,8vw,100px)", lineHeight: .92, color: "#fff", letterSpacing: "-.02em" }}>
              {nameParts.length > 1
                ? <>{nameParts.slice(0, -1).join(" ")}<br /><em style={{ fontStyle: "italic", color: "rgba(255,255,255,.5)" }}>{nameParts.slice(-1)}</em></>
                : venue.name}
            </h1>
          </R>
          <R delay={0.14}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, fontSize: 12, color: "rgba(255,255,255,.3)", fontWeight: 300, fontFamily: "var(--v-body)" }}>
              <span>{venue.regionLabel}</span>
              {venue.bestFor && (
                <>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.2)" }} />
                  <span>{venue.bestFor}</span>
                </>
              )}
            </div>
          </R>

          {/* Quick stats bar */}
          <R delay={0.22}>
            <div style={{ display: "flex", gap: "clamp(24px,4vw,56px)", marginTop: "clamp(20px,3vh,36px)", paddingTop: "clamp(14px,2vh,20px)", borderTop: "1px solid rgba(255,255,255,.07)" }}>
              {[
                venue.hours && { v: venue.hours.split("|")[0].trim(), l: "Hours" },
                venue.priceRange && { v: venue.priceRange, l: "Price Range" },
                venue.ambiance && { v: venue.ambiance, l: "Ambiance" },
              ].filter(Boolean).map((s, i) => (
                <div key={i} style={{ maxWidth: 200 }}>
                  <div style={{ fontSize: 12, fontWeight: 300, color: "rgba(255,255,255,.6)", lineHeight: 1.4, fontFamily: "var(--v-body)" }}>{(s as { v: string }).v}</div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,.2)", letterSpacing: 2.5, textTransform: "uppercase", marginTop: 4, fontFamily: "var(--v-body)" }}>{(s as { l: string }).l}</div>
                </div>
              ))}
            </div>
          </R>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 7, color: "rgba(255,255,255,.15)", letterSpacing: 3, textTransform: "uppercase", fontFamily: "var(--v-body)" }}>Scroll</span>
          <div style={{ width: 1, height: 28, background: "linear-gradient(rgba(255,255,255,.2),transparent)", animation: "venueDrop 2s ease infinite" }} />
        </div>
      </section>

      {/* ═══ 2. CONTENT — POV + Highlights ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="max-md:!grid-cols-1">
        {/* Left: Point of View + description */}
        <div style={{ padding: "clamp(48px,8vh,96px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--v-white)" }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 14, fontFamily: "var(--v-body)" }}>Our Point of View</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, letterSpacing: "-.02em" }}>
            {firstName} <em style={{ fontStyle: "italic" }}>Experience</em>
          </h2></R>

          {/* Blockquote */}
          {venue.pointOfView && (
            <R delay={0.14}>
              <div style={{ position: "relative", marginTop: 24, paddingLeft: 24, borderLeft: "2px solid var(--v-pearl)" }}>
                <span style={{ fontFamily: "var(--v-serif)", fontSize: 48, color: "var(--v-pearl)", lineHeight: ".5", position: "absolute", top: -4, left: -4 }}>&ldquo;</span>
                <p style={{ fontFamily: "var(--v-serif)", fontSize: "clamp(18px,2vw,22px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.6, color: "var(--v-charcoal)" }}>
                  {venue.pointOfView}
                </p>
              </div>
            </R>
          )}

          <R delay={0.18}><div style={{ width: 40, height: 1, background: "var(--v-pearl)", margin: "28px 0" }} /></R>

          <R delay={0.22}><p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--v-stone)", fontWeight: 300, maxWidth: 460 }}>
            From 8 to 100 guests — include {venue.name} in your group golf package. After a round on the links, unwind with {venue.type === "bar" || venue.type === "lounge" ? "craft cocktails and nightlife" : venue.type === "spa" ? "spa treatments and relaxation" : "unforgettable experiences"} just minutes from the best courses in the High Sierra.
          </p></R>
        </div>

        {/* Right: Highlights grid */}
        <div style={{ padding: "clamp(48px,8vh,96px) clamp(32px,5vw,80px)", background: "var(--v-bone)" }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 14 }}>Key Highlights</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 28 }}>What to <em style={{ fontStyle: "italic" }}>Know</em></h2></R>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="max-sm:!grid-cols-1">
            {(venue.highlights || []).map((h, i) => (
              <R key={i} delay={0.12 + i * 0.04}>
                <div style={{
                  padding: "20px 18px",
                  background: "var(--v-white)",
                  borderRadius: 16,
                  border: "1px solid var(--v-pearl)",
                  transition: "all .4s",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{h.icon}</div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--v-bronze)", fontWeight: 600, marginBottom: 6 }}>{h.label}</div>
                  <div style={{ fontSize: 13, color: "var(--v-charcoal)", fontWeight: 300, lineHeight: 1.6 }}>{h.value}</div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. DARK FEATURE — Insider Tips ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--v-ink)" }} className="max-md:!grid-cols-1">
        {/* Left: Image */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: 400 }} className="max-md:!min-h-[280px]">
          {gallery[0] && (
            <Image src={gallery[0]} alt={venue.name} fill className="object-cover opacity-50 hover:opacity-65 hover:scale-[1.04] transition-all duration-[8s]" sizes="(max-width:900px) 100vw, 50vw" />
          )}
          {/* Decorative bronze line */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, var(--v-bronze), transparent)" }} />
        </div>

        {/* Right: Insider Tips */}
        <div style={{ padding: "clamp(48px,8vh,96px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "var(--v-bronze)", fontWeight: 500, marginBottom: 14 }}>The Hack</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, color: "#fff" }}>
            Insider <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.4)" }}>Tips</em>
          </h2></R>
          <div style={{ marginTop: 24 }}>
            {(venue.insiderTips || []).map((tip, i) => {
              const parts = tip.split(" — ");
              return (
                <R key={i} delay={0.14 + i * 0.05}>
                  <div style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < (venue.insiderTips?.length || 0) - 1 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(160,132,92,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--v-bronze)", flexShrink: 0, fontWeight: 500, fontFamily: "var(--v-body)" }}>
                      {i + 1}
                    </div>
                    <div>
                      {parts.length > 1 ? (
                        <>
                          <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", fontWeight: 500, marginBottom: 3 }}>{parts[0]}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,.3)", fontWeight: 300, lineHeight: 1.6 }}>{parts.slice(1).join(" — ")}</div>
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", fontWeight: 300, lineHeight: 1.6 }}>{tip}</div>
                      )}
                    </div>
                  </div>
                </R>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 4. INFO STRIP — Location + FAQ ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="max-md:!grid-cols-1">
        {/* Left: Location + Distances */}
        <div style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--v-bone)" }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 14 }}>Location</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}>Getting <em style={{ fontStyle: "italic" }}>There</em></h2></R>

          {/* Distances */}
          {(venue.distances || []).length > 0 && (
            <R delay={0.14}>
              <div style={{ marginTop: 24 }}>
                {(venue.distances || []).slice(0, 6).map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--v-pearl)", fontSize: 13, fontWeight: 300 }}>
                    <span style={{ color: "var(--v-charcoal)" }}>{d.location}</span>
                    <span style={{ color: "var(--v-bronze)", fontWeight: 500, whiteSpace: "nowrap" }}>{d.minutes} min</span>
                  </div>
                ))}
              </div>
            </R>
          )}

          {/* Address + parking */}
          {addr?.streetAddress && (
            <R delay={0.2}>
              <div style={{ marginTop: 24, padding: 20, background: "var(--v-white)", borderRadius: 16, border: "1px solid var(--v-pearl)" }}>
                <p style={{ fontSize: 13, color: "var(--v-charcoal)", fontWeight: 400, lineHeight: 1.6 }}>
                  {addr.streetAddress}, {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}
                </p>
                {venue.hours && <p style={{ fontSize: 12, color: "var(--v-stone)", fontWeight: 300, marginTop: 6 }}>{venue.hours}</p>}
                {venue.parking && <p style={{ fontSize: 12, color: "var(--v-stone)", fontWeight: 300, marginTop: 6 }}>{venue.parking.summary}</p>}
                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  {venue.directionsUrl && (
                    <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 100, background: "var(--v-bronze)", color: "#fff", fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none", transition: "all .3s" }}>
                      Directions
                    </a>
                  )}
                  {venue.website && (
                    <a href={venue.website} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 100, border: "1px solid var(--v-pearl)", color: "var(--v-charcoal)", fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none", transition: "all .3s" }}>
                      Website
                    </a>
                  )}
                </div>
              </div>
            </R>
          )}
        </div>

        {/* Right: FAQ */}
        <div style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--v-white)" }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 14 }}>FAQ</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 20 }}>Common <em style={{ fontStyle: "italic" }}>Questions</em></h2></R>
          {venue.faqs.slice(0, 5).map((f, i) => (
            <R key={i} delay={0.12 + i * 0.04}><FAQ q={f.question} a={f.answer} /></R>
          ))}

          {/* Group Events card */}
          {venue.groupEvents && (
            <R delay={0.32}>
              <div style={{ marginTop: 28, padding: 24, background: "var(--v-bone)", borderRadius: 20, border: "1px solid var(--v-pearl)" }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--v-bronze)", fontWeight: 600, marginBottom: 10 }}>Private Events</div>
                <p style={{ fontSize: 13, color: "var(--v-charcoal)", fontWeight: 300, lineHeight: 1.7 }}>{venue.groupEvents.description}</p>
                {venue.groupEvents.idealFor && (
                  <p style={{ fontSize: 11, color: "var(--v-stone)", fontWeight: 300, marginTop: 8 }}>Ideal for: {venue.groupEvents.idealFor}</p>
                )}
                {venue.groupEvents.reservationUrl && (
                  <a href={venue.groupEvents.reservationUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", marginTop: 14, padding: "8px 20px", borderRadius: 100, border: "1px solid var(--v-bronze)", color: "var(--v-bronze)", fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none", transition: "all .3s" }}>
                    Reserve
                  </a>
                )}
              </div>
            </R>
          )}
        </div>
      </section>

      {/* ═══ RELATED ═══ */}
      {relatedVenues.length > 0 && (
        <section style={{ padding: "clamp(48px,7vh,80px) clamp(32px,7vw,120px)", background: "var(--v-bone)" }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 14 }}>More to Explore</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}>Nearby <em style={{ fontStyle: "italic" }}>Experiences</em></h2></R>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 24 }} className="max-md:!grid-cols-1">
            {relatedVenues.map((rv, i) => (
              <R key={rv.slug} delay={0.12 + i * 0.06}>
                <Link href={`/portfolio/${rv.slug}/`}>
                  <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid var(--v-pearl)", background: "var(--v-white)", transition: "all .5s" }} className="hover:!border-transparent hover:!shadow-[0_16px_48px_rgba(0,0,0,.06)] hover:-translate-y-1">
                    <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                      {rv.heroImage ? <Image src={rv.heroImage} alt={rv.name} fill className="object-cover brightness-[.88] hover:brightness-100 hover:scale-[1.05] transition-all duration-600" sizes="(max-width:768px) 100vw, 33vw" /> : <div style={{ width: "100%", height: "100%", background: "var(--v-pearl)" }} />}
                      <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,.6)", backdropFilter: "blur(8px)", color: "#fff", padding: "4px 12px", borderRadius: 100, fontSize: 9, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>{typeLabel(rv.type)}</span>
                    </div>
                    <div style={{ padding: 18 }}>
                      <div style={{ fontFamily: "var(--v-serif)", fontSize: 20, fontWeight: 400, color: "var(--v-ink)" }}>{rv.name}</div>
                      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: "var(--v-stone)", margin: "4px 0 14px" }}>{rv.regionLabel}</div>
                      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "1px solid var(--v-pearl)" }}>
                        <span style={{ fontSize: 9, color: "var(--v-bronze)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </R>
            ))}
          </div>
        </section>
      )}

      {/* ═══ 5. CTA ═══ */}
      <section style={{ background: "var(--v-ink)", textAlign: "center", padding: "clamp(64px,10vh,120px) clamp(32px,7vw,120px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%,rgba(160,132,92,.04),transparent 70%)" }} />
        <R><div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "var(--v-bronze)", fontWeight: 500, marginBottom: 14, position: "relative", zIndex: 1 }}>Experience {firstName}</div></R>
        <R delay={0.08}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, color: "#fff", marginBottom: 12, position: "relative", zIndex: 1 }}>
          Add {firstName} to <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.35)" }}>Your Golf Trip</em>
        </h2></R>
        <R delay={0.16}><p style={{ fontSize: 14, color: "rgba(255,255,255,.25)", fontWeight: 300, maxWidth: 420, margin: "0 auto 28px", lineHeight: 1.8, position: "relative", zIndex: 1 }}>
          Golf, lodging, {venue.type === "bar" || venue.type === "lounge" ? "nightlife" : venue.type === "spa" ? "spa treatments" : "entertainment"} — all in one custom package. One call plans everything.
        </p></R>
        <R delay={0.2}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(160,132,92,.12)", fontSize: 9, color: "var(--v-bronze)", fontWeight: 500, marginBottom: 24, letterSpacing: ".5px" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--v-bronze)", animation: "venuePulse 2s infinite" }} />
              Groups of 8+ save 20%
            </div>
          </div>
        </R>
        <R delay={0.28}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-block", padding: "15px 36px", background: "var(--v-bronze)", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", transition: "all .4s" }} className="hover:!bg-[#b89b6e] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(160,132,92,.2)]">
              Plan My Trip
            </Link>
            <a href="tel:+18885848232" style={{ display: "inline-block", padding: "15px 36px", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.35)", borderRadius: 100, fontSize: 10, fontWeight: 400, letterSpacing: 2, textTransform: "uppercase", transition: "all .4s" }} className="hover:!border-white/35 hover:!text-white">
              Call 888-584-8232
            </a>
          </div>
        </R>
      </section>

      {/* Lightbox */}
      {lbIndex !== null && gallery.length > 0 && <Lightbox images={gallery} startIndex={lbIndex} onClose={() => setLbIndex(null)} name={venue.name} />}

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes venueHeroZoom{to{transform:scale(1)}}
        @keyframes venueDrop{0%{opacity:0;transform:translateY(-8px)}50%{opacity:1}100%{opacity:0;transform:translateY(8px)}}
        @keyframes venuePulse{0%,100%{opacity:1}50%{opacity:.2}}
      `}</style>
    </div>
  );
}
