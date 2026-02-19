"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Types ─── */
interface VenueAddress { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; }
interface VenueGeo { latitude: number; longitude: number; }
interface VenueFAQ { question: string; answer: string; }
interface VenueTestimonial { stars: number; quote: string; author: string; source: string; meta: string; }

export interface VenueProps {
  slug: string; name: string; type: string; region?: string; regionLabel: string;
  parentHotel: string | null; address?: VenueAddress; geo?: VenueGeo;
  phone?: string; website?: string; priceRange?: string;
  description: string; shortDescription: string;
  highlights: string[]; hours: string;
  heroImage: string; images: string[];
  faqs: VenueFAQ[]; testimonials?: VenueTestimonial[];
  meta?: { title: string; description: string };
}

interface RelatedVenue {
  slug: string; name: string; regionLabel: string;
  heroImage?: string; priceRange?: string; type: string;
}

interface NearbyGolfCourse {
  slug: string; name: string; regionLabel: string;
  heroImage?: string; priceRange?: string; rating?: { value: number; count: number };
}

interface VenuePageContentProps { venue: VenueProps; relatedVenues: RelatedVenue[]; nearbyGolfCourses?: NearbyGolfCourse[]; parentHotelName?: string; blurs?: Record<string, string>; }

/* ─── Reveal ─── */
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
    <div ref={ref} className={className} style={{ ...style, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(30px)", transition: `opacity .9s ease ${delay}s, transform .9s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── FAQ ─── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--bone)" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "18px 0", background: "none", border: "none", fontFamily: "var(--sans)", fontSize: 13, color: "var(--charcoal)", cursor: "pointer", textAlign: "left" as const, gap: 12, fontWeight: 400, transition: "color .3s" }}>
        {q}
        <span style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid var(--bone)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--stone)", transition: "all .4s", flexShrink: 0, fontWeight: 300, ...(open ? { background: "var(--gold)", color: "#fff", borderColor: "var(--gold)", transform: "rotate(45deg)" } : {}) }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 250 : 0, overflow: "hidden", transition: "max-height .5s ease" }}>
        <p style={{ paddingBottom: 18, fontSize: 12, color: "var(--stone)", lineHeight: 1.8, fontWeight: 300 }}>{a}</p>
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
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }} className="absolute left-4 text-white/60 hover:text-white z-10 p-2"><ChevronLeft className="w-10 h-10" /></button>
      <div className="relative w-[90vw] h-[80vh]" onClick={e => e.stopPropagation()}>
        <Image src={images[idx]} alt={`${name} ${idx + 1}`} fill className="object-contain" sizes="90vw" />
      </div>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} className="absolute right-4 text-white/60 hover:text-white z-10 p-2"><ChevronRight className="w-10 h-10" /></button>
      <div className="absolute bottom-4 text-white/40 text-xs tracking-widest">{idx + 1} / {images.length}</div>
    </div>
  );
}

/* ─── Type Icon ─── */
function typeIcon(type: string) {
  const icons: Record<string, string> = { bar: "🍸", spa: "✨", museum: "🏛️", lounge: "🥂", shopping: "🛍️", pool: "🏊", fitness: "💪", amenity: "⭐" };
  return icons[type] || "📍";
}

function typeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function VenuePageContent({ venue, relatedVenues = [], nearbyGolfCourses = [], parentHotelName, blurs = {} }: VenuePageContentProps) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const bp = (src: string) => blurs[src] ? { placeholder: "blur" as const, blurDataURL: blurs[src] } : {};

  const gallery = venue.images?.length ? venue.images : [];
  const addr = venue.address;
  const nameParts = venue.name.split(" ");
  const firstName = nameParts[0];

  const cssVars = {
    "--white": "#fff", "--cream": "#faf8f5", "--bone": "#eee9e2", "--sand": "#d4cfc6",
    "--stone": "#8a857c", "--charcoal": "#3a3832", "--ink": "#111111",
    "--gold": "#C9A24D", "--gold-glow": "#D4B76A",
    "--serif": "var(--font-jakarta), system-ui, sans-serif",
    "--sans": "var(--font-jakarta), system-ui, sans-serif",
  } as React.CSSProperties;

  /* Hero fallback: gradient pattern if no heroImage */
  const hasHero = venue.heroImage && venue.heroImage.length > 0;
  const heroGradient = `linear-gradient(135deg, #1E3A2F 0%, #111 50%, #1E3A2F 100%)`;

  return (
    <div style={{ ...cssVars, fontFamily: "var(--sans)", background: "var(--white)", color: "var(--ink)", overflowX: "hidden" }}>

      {/* ═══ 1. HERO ═══ */}
      <section style={{ position: "relative", height: "70vh", minHeight: 500, maxHeight: 700, overflow: "hidden", background: "#0a0a08" }}>
        {hasHero ? (
          <Image src={venue.heroImage} alt={venue.name} fill priority {...bp(venue.heroImage)} className="object-cover" sizes="100vw" style={{ opacity: .45, transform: "scale(1.08)", animation: "heroZoom 20s ease forwards" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: heroGradient }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.3) 0%,transparent 40%,transparent 50%,rgba(0,0,0,.7) 100%)" }} />

        {/* Content */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(32px,7vw,120px) clamp(48px,8vh,100px)" }}>
          <R>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.05)", fontSize: 11, color: "rgba(255,255,255,.7)", marginBottom: 16, backdropFilter: "blur(10px)" }}>
              <span>{typeIcon(venue.type)}</span>
              <span style={{ textTransform: "uppercase", letterSpacing: 2, fontWeight: 500 }}>{typeLabel(venue.type)}</span>
            </div>
          </R>
          <R delay={0.06}>
            <h1 style={{ fontFamily: "var(--serif)", fontWeight: 300, fontSize: "clamp(40px,6vw,90px)", lineHeight: .92, color: "#fff", letterSpacing: "-.03em" }}>
              {nameParts.length > 2 ? <>{nameParts.slice(0, -1).join(" ")}<br /><em style={{ fontStyle: "italic", color: "rgba(255,255,255,.75)" }}>{nameParts.slice(-1).join(" ")}</em></> : <>{firstName}<br /><em style={{ fontStyle: "italic", color: "rgba(255,255,255,.75)" }}>{nameParts.slice(1).join(" ")}</em></>}
            </h1>
          </R>
          <R delay={0.14}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, fontSize: 12, color: "rgba(255,255,255,.6)", fontWeight: 300, flexWrap: "wrap" }}>
              <span>{venue.regionLabel}</span>
              {venue.priceRange && <><span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.75)" }} /><span>{venue.priceRange}</span></>}
              {venue.hours && <><span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.75)" }} /><span>{venue.hours}</span></>}
            </div>
          </R>
          <R delay={0.22}>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.55)", fontWeight: 300, maxWidth: 520, marginTop: 14, lineHeight: 1.7 }}>
              {venue.shortDescription}
            </p>
          </R>
        </div>
      </section>

      {/* ═══ 2. CONTENT — description + gallery ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: gallery.length > 0 ? "1fr 1fr" : "1fr", minHeight: 500 }} className="max-md:!grid-cols-1">
        <div style={{ padding: "clamp(48px,8vh,100px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>The Experience</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, letterSpacing: "-.02em" }}>
            <em style={{ fontStyle: "italic" }}>{venue.highlights?.[0] || `Discover ${firstName}`}</em>
          </h2></R>
          <R delay={0.16}><p style={{ fontSize: 13, lineHeight: 1.9, color: "var(--stone)", fontWeight: 300, maxWidth: 500, marginTop: 16 }}>{venue.description}</p></R>
          <R delay={0.2}><div style={{ width: 40, height: 1, background: "var(--bone)", margin: "24px 0" }} /></R>

          {/* Highlights as pills */}
          {venue.highlights?.length > 1 && (
            <R delay={0.24}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {venue.highlights.slice(1).map((h, i) => (
                  <span key={i} style={{ fontSize: 10, padding: "6px 14px", borderRadius: 100, border: "1px solid var(--bone)", color: "var(--stone)", fontWeight: 400 }}>{h}</span>
                ))}
              </div>
            </R>
          )}
        </div>

        {/* Gallery */}
        {gallery.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 4 }} className="max-md:!min-h-[400px]">
            {gallery.slice(0, 3).map((img, i) => (
              <div key={i} style={{ overflow: "hidden", position: "relative", cursor: "pointer", ...(i === 2 ? { gridColumn: "span 2" } : {}) }} onClick={() => setLbIndex(i)}>
                <Image src={img} alt={`${venue.name} ${i + 1}`} fill {...bp(img)} className="object-cover brightness-[.88] hover:brightness-100 hover:scale-[1.06] transition-all duration-700" sizes="(max-width:900px) 100vw, 50vw" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══ 3. DARK FEATURE — quote + info ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--ink)" }} className="max-md:!grid-cols-1">
        <div style={{ position: "relative", overflow: "hidden", minHeight: 400 }} className="max-md:!min-h-[300px]">
          {(gallery[0] || hasHero) ? (
            <Image src={gallery[0] || venue.heroImage} alt="Feature" fill {...bp(gallery[0] || venue.heroImage)} className="object-cover opacity-60 hover:opacity-75 hover:scale-[1.04] transition-all duration-[8s]" sizes="(max-width:900px) 100vw, 50vw" />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: heroGradient, opacity: .4 }} />
          )}
        </div>
        <div style={{ padding: "clamp(48px,8vh,100px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14 }}>Why Visit</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, letterSpacing: "-.02em", color: "#fff" }}>
            The Perfect <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.7)" }}>Après-Golf</em>
          </h2></R>
          <R delay={0.16}>
            <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(18px,2vw,26px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.6, color: "rgba(255,255,255,.55)", marginTop: 20, maxWidth: 440, position: "relative", paddingTop: 28 }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 60, color: "rgba(201,162,77,.2)", lineHeight: ".5", position: "absolute", top: 0, left: 0 }}>&ldquo;</span>
              {venue.shortDescription}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.75)", letterSpacing: 2, textTransform: "uppercase", marginTop: 16 }}>— Golf the High Sierra</div>
          </R>

          {/* Quick info */}
          <R delay={0.24}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px,3vw,32px)", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.07)" }}>
              {venue.hours && <div><div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 4 }}>Hours</div><div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", fontWeight: 300 }}>{venue.hours}</div></div>}
              {venue.priceRange && <div><div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 4 }}>Price</div><div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", fontWeight: 300 }}>{venue.priceRange}</div></div>}
              {venue.phone && <div><div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 4 }}>Phone</div><div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", fontWeight: 300 }}><a href={`tel:${venue.phone}`} style={{ color: "var(--gold)" }}>{venue.phone}</a></div></div>}
            </div>
          </R>
        </div>
      </section>

      {/* ═══ 4. INFO + FAQ ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="max-md:!grid-cols-1">
        {/* Left: Details */}
        <div style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--cream)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Details</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}>Plan Your <em style={{ fontStyle: "italic" }}>Visit</em></h2></R>

          {/* Address */}
          {addr?.streetAddress && (
            <R delay={0.16}>
              <div style={{ marginTop: 24, padding: "20px", borderRadius: 12, border: "1px solid var(--bone)", background: "var(--white)" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--stone)", marginBottom: 10, fontWeight: 500 }}>Location</div>
                <p style={{ fontSize: 14, color: "var(--charcoal)", fontWeight: 400, lineHeight: 1.6 }}>
                  {addr.streetAddress}<br />
                  {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}
                </p>
                {venue.phone && <p style={{ fontSize: 13, marginTop: 8 }}><a href={`tel:${venue.phone}`} style={{ color: "var(--gold)", fontWeight: 500 }}>{venue.phone}</a></p>}
                {venue.website && <p style={{ fontSize: 11, marginTop: 6 }}><a href={venue.website} target="_blank" rel="noopener" style={{ color: "var(--stone)", textDecoration: "underline" }}>Visit Website →</a></p>}
              </div>
            </R>
          )}

          {/* Hours */}
          {venue.hours && (
            <R delay={0.2}>
              <div style={{ marginTop: 16, padding: "20px", borderRadius: 12, border: "1px solid var(--bone)", background: "var(--white)" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--stone)", marginBottom: 10, fontWeight: 500 }}>Hours</div>
                <p style={{ fontSize: 14, color: "var(--charcoal)", fontWeight: 400, lineHeight: 1.6 }}>{venue.hours}</p>
              </div>
            </R>
          )}

          {/* Parent hotel link */}
          {venue.parentHotel && (
            <R delay={0.24}>
              <div style={{ marginTop: 16, padding: "20px", borderRadius: 12, border: "1px solid var(--bone)", background: "var(--white)" }}>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--stone)", marginBottom: 10, fontWeight: 500 }}>Located At</div>
                <Link href={`/portfolio/${venue.parentHotel}/`} style={{ fontSize: 14, color: "var(--gold)", fontWeight: 500 }}>
                  View Hotel Details →
                </Link>
              </div>
            </R>
          )}
        </div>

        {/* Right: FAQ */}
        <div style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--white)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>FAQ</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 20 }}>Common <em style={{ fontStyle: "italic" }}>Questions</em></h2></R>
          {venue.faqs?.slice(0, 5).map((f, i) => (
            <R key={i} delay={0.12 + i * 0.04}><FAQ q={f.question} a={f.answer} /></R>
          ))}
        </div>
      </section>

      {/* ═══ GOLF NEAR THIS RESORT ═══ */}
      {nearbyGolfCourses.length > 0 && (
        <section style={{ padding: "clamp(48px,7vh,80px) clamp(32px,7vw,120px)", background: "var(--forest)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14 }}>Stay &amp; Play</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(26px,3vw,42px)", lineHeight: 1.1, color: "#fff", marginBottom: 8 }}>Golf Near {parentHotelName || "This Resort"}</h2></R>
          <R delay={0.1}><p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginBottom: 28, maxWidth: 520 }}>Most groups staying here add a round or two. Golf the High Sierra books tee times, group rates, and hotel together — one call.</p></R>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="max-md:!grid-cols-1">
            {nearbyGolfCourses.slice(0, 3).map((gc, i) => (
              <R key={gc.slug} delay={0.12 + i * 0.06}>
                <Link href={`/portfolio/${gc.slug}/`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", transition: "all .5s" }} className="hover:!bg-white/10 hover:-translate-y-1">
                    <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                      {gc.heroImage ? <Image src={gc.heroImage} alt={gc.name} fill className="object-cover brightness-75 hover:brightness-90 transition-all duration-600" sizes="(max-width:768px) 100vw, 33vw" /> : <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.05)" }} />}
                      {gc.priceRange && <span style={{ position: "absolute", top: 10, right: 10, background: "var(--gold)", color: "#fff", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{gc.priceRange}</span>}
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, color: "#fff" }}>{gc.name}</div>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "rgba(255,255,255,0.5)", margin: "4px 0 12px" }}>{gc.regionLabel}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        {gc.rating && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>★ {gc.rating.value}</span>}
                        <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View Course →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </R>
            ))}
          </div>
          <R delay={0.3}>
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gold)", color: "#fff", padding: "14px 28px", borderRadius: 100, fontSize: 13, fontWeight: 600, letterSpacing: 1, textDecoration: "none", textTransform: "uppercase" }}>
                📞 Book Golf + Stay — 1-888-584-8232
              </a>
            </div>
          </R>
        </section>
      )}

      {/* ═══ RELATED VENUES ═══ */}
      {relatedVenues.length > 0 && (
        <section style={{ padding: "clamp(48px,7vh,80px) clamp(32px,7vw,120px)", background: "var(--cream)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>More to Explore</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}>Nearby <em style={{ fontStyle: "italic" }}>Experiences</em></h2></R>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 24 }} className="max-md:!grid-cols-1">
            {relatedVenues.map((rv, i) => (
              <R key={rv.slug} delay={0.12 + i * 0.06}>
                <Link href={`/portfolio/${rv.slug}/`}>
                  <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--white)", transition: "all .5s" }} className="hover:!border-transparent hover:!shadow-[0_16px_48px_rgba(0,0,0,.06)] hover:-translate-y-1">
                    <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative", background: "linear-gradient(135deg, #1E3A2F 0%, #111 50%, #1E3A2F 100%)" }}>
                      {rv.heroImage ? <Image src={rv.heroImage} alt={rv.name} fill {...bp(rv.heroImage)} className="object-cover brightness-[.9] hover:brightness-100 hover:scale-[1.05] transition-all duration-600" sizes="(max-width:768px) 100vw, 33vw" /> : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{typeIcon(rv.type)}</div>
                      )}
                      <span style={{ position: "absolute", top: 10, right: 10, background: "var(--ink)", color: "#fff", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{typeLabel(rv.type)}</span>
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, color: "var(--ink)" }}>{rv.name}</div>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--stone)", margin: "4px 0 12px" }}>{rv.regionLabel}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--bone)" }}>
                        {rv.priceRange && <span style={{ fontSize: 10, color: "var(--stone)" }}>{rv.priceRange}</span>}
                        <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </R>
            ))}
          </div>
        </section>
      )}

      {/* ═══ TESTIMONIALS ═══ */}
      {venue.testimonials && venue.testimonials.length > 0 && (
        <section style={{ background: "#f9f7f2", padding: "clamp(56px,8vh,96px) clamp(24px,5vw,80px)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14, textAlign: "center" }}>Visitor Reviews</div></R>
            <R delay={0.06}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(24px,3vw,36px)", lineHeight: 1.15, color: "var(--ink)", textAlign: "center", marginBottom: 40 }}>What Visitors Say About {firstName}</h2></R>
            <div style={{ display: "grid", gap: 20 }}>
              {venue.testimonials.map((t, i) => (
                <R key={i} delay={0.08 + i * 0.06}>
                  <div style={{ background: "#fff", borderRadius: 12, padding: "28px 28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.04)", border: "1px solid rgba(0,0,0,.04)" }}>
                    <div style={{ color: "#C9A24D", fontSize: 16, marginBottom: 8, letterSpacing: 2 }}>{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#444", margin: "0 0 14px", fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--ink)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>{t.author[0]}</div>
                      <div><div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{t.author}</div><div style={{ fontSize: 11, color: "#999" }}>{t.meta}</div></div>
                    </div>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 5. CTA ═══ */}
      <section style={{ background: "var(--ink)", textAlign: "center", padding: "clamp(64px,10vh,120px) clamp(32px,7vw,120px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%,rgba(201,162,77,.05),transparent 70%)" }} />
        <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14, position: "relative", zIndex: 1 }}>Golf the High Sierra</div></R>
        <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, color: "#fff", marginBottom: 12, position: "relative", zIndex: 1 }}>Add This to Your <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.65)" }}>Golf Trip</em></h2></R>
        <R delay={0.16}><p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 300, maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.8, position: "relative", zIndex: 1 }}>
          Golf, lodging, dining, experiences — we handle everything. One call builds your perfect trip.
        </p></R>
        <R delay={0.2}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(201,162,77,.12)", fontSize: 10, color: "var(--gold)", fontWeight: 500, marginBottom: 24, letterSpacing: ".5px" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", animation: "euroP 2s infinite" }} />
              Custom packages available year-round
            </div>
          </div>
        </R>
        <R delay={0.28}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-block", padding: "15px 36px", background: "var(--gold)", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", transition: "all .4s" }} className="hover:!bg-[#D4B76A] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,77,.2)]">
              Plan My Trip
            </Link>
            <a href="tel:+18885848232" style={{ display: "inline-block", padding: "15px 36px", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.65)", borderRadius: 100, fontSize: 10, fontWeight: 400, letterSpacing: 2, textTransform: "uppercase", transition: "all .4s" }} className="hover:!border-white/35 hover:!text-white">
              Call 888-584-8232
            </a>
          </div>
        </R>
      </section>

      {/* Lightbox */}
      {lbIndex !== null && gallery.length > 0 && <Lightbox images={gallery} startIndex={lbIndex} onClose={() => setLbIndex(null)} name={venue.name} />}

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes heroZoom{to{transform:scale(1)}}
        @keyframes euroP{0%,100%{opacity:1}50%{opacity:.2}}
      `}</style>
    </div>
  );
}

