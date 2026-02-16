"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import HeroTripSlider from "./HeroTripSlider";

/* ─── Types ─── */
interface HotelAddress { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: string; }
interface HotelGeo { latitude: number; longitude: number; }
interface HotelRating { value: number; count: number; sources: string; }
interface HotelRoomType { name: string; description: string; priceFrom?: string; image?: string; }
interface HotelDining { name: string; slug?: string; type: string; description: string; }
interface HotelFAQ { question: string; answer: string; }

export interface HotelProps {
  slug: string; name: string; region: string; regionLabel: string; type: string;
  address: HotelAddress; geo: HotelGeo; phone?: string; website?: string;
  priceRange?: string; priceFrom?: string; starRating?: number; aaaRating?: string;
  rating?: HotelRating; description: string; shortDescription: string;
  highlights: string[]; amenities: string[]; roomTypes: HotelRoomType[];
  dining: HotelDining[]; spaBars: string[]; totalRooms?: number | null;
  parking: string; images: string[]; heroImage: string; faqs: HotelFAQ[];
  relatedCourses: string[]; relatedHotels: string[];
  meta: { title: string; description: string };
}

interface HotelPageContentProps { hotel: HotelProps; relatedHotels: HotelProps[]; }

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

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function HotelPageContent({ hotel, relatedHotels = [] }: HotelPageContentProps) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const gallery = hotel.images?.length ? hotel.images : [];
  const addr = hotel.address;
  const nameParts = hotel.name.split(" ");
  const firstName = nameParts[0];
  const quoteText = hotel.shortDescription || hotel.description.substring(0, 200);

  const cssVars = {
    "--white": "#fff", "--cream": "#faf8f5", "--bone": "#eee9e2", "--sand": "#d4cfc6",
    "--stone": "#8a857c", "--charcoal": "#3a3832", "--ink": "#1a1917",
    "--gold": "#b49a6a", "--gold-glow": "#c8ad7e",
    "--serif": "'Plus Jakarta Sans', system-ui, sans-serif",
    "--sans": "'Plus Jakarta Sans', system-ui, sans-serif",
  } as React.CSSProperties;

  /* Compute type label */
  const typeLabel = hotel.type?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Resort";

  return (
    <div style={{ ...cssVars, fontFamily: "var(--sans)", background: "var(--white)", color: "var(--ink)", overflowX: "hidden" }}>

      {/* ═══ 1. HERO — split layout ═══ */}
      <section style={{ position: "relative", height: "100vh", minHeight: 650, overflow: "hidden", background: "#0a0a08", display: "flex" }} className="max-lg:!flex-col">

        {/* ── LEFT: Hotel Info ── */}
        <div className="w-full lg:w-1/2 relative" style={{ minHeight: 500 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            {hotel.heroImage && <Image src={hotel.heroImage} alt={hotel.name} fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" style={{ opacity: .5, transform: "scale(1.08)", animation: "heroZoom 20s ease forwards" }} />}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.25) 0%,transparent 35%,transparent 55%,rgba(0,0,0,.65) 100%)" }} />

          {/* Top bar */}
          <div style={{ position: "absolute", top: "clamp(24px,4vh,48px)", left: "clamp(32px,7vw,120px)", right: "clamp(32px,7vw,120px)", display: "flex", justifyContent: "space-between", zIndex: 3 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 13, color: "rgba(255,255,255,.65)", letterSpacing: 3, textTransform: "uppercase" }}>Golf the High Sierra</div>
            <div style={{ display: "flex", gap: 24 }}>
              <Link href="/accommodations-in-reno-tahoe/" style={{ fontSize: 10, color: "rgba(255,255,255,.6)", letterSpacing: 2, textTransform: "uppercase" }}>Hotels</Link>
              <Link href="/contact-custom-golf-package/" style={{ fontSize: 10, color: "rgba(255,255,255,.6)", letterSpacing: 2, textTransform: "uppercase" }}>Book</Link>
            </div>
          </div>

          {/* Hero content */}
          <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(32px,7vw,120px) clamp(48px,8vh,100px)" }}>
            <R>
              <h1 style={{ fontFamily: "var(--serif)", fontWeight: 300, fontSize: "clamp(40px,6vw,90px)", lineHeight: .92, color: "#fff", letterSpacing: "-.03em" }}>
                {nameParts.length > 3 ? <>{nameParts.slice(0, -2).join(" ")}<br /><em style={{ fontStyle: "italic", color: "rgba(255,255,255,.75)" }}>{nameParts.slice(-2).join(" ")}</em></> : <>{firstName}<br /><em style={{ fontStyle: "italic", color: "rgba(255,255,255,.75)" }}>{nameParts.slice(1).join(" ")}</em></>}
              </h1>
            </R>
            <R delay={0.12}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, fontSize: 12, color: "rgba(255,255,255,.6)", fontWeight: 300 }}>
                <span>{typeLabel}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.75)" }} />
                <span>{hotel.regionLabel}</span>
                {hotel.starRating && <><span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.75)" }} /><span>{"★".repeat(hotel.starRating)} Star</span></>}
              </div>
            </R>
            <R delay={0.24}>
              <div style={{ display: "flex", gap: "clamp(20px,3.5vw,48px)", marginTop: "clamp(20px,3.5vh,40px)", paddingTop: "clamp(14px,2.5vh,24px)", borderTop: "1px solid rgba(255,255,255,.07)", flexWrap: "wrap" }}>
                {[
                  hotel.priceFrom && { v: hotel.priceFrom, l: "From / Night" },
                  hotel.rating && { v: hotel.rating.value, l: "Rating" },
                  hotel.totalRooms && { v: hotel.totalRooms.toLocaleString(), l: "Rooms" },
                  hotel.roomTypes?.length > 0 && { v: hotel.roomTypes.length, l: "Room Types" },
                ].filter(Boolean).map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px,3vw,40px)", fontWeight: 300, color: "#fff", lineHeight: 1 }}>{(s as {v:string|number}).v}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.75)", letterSpacing: 2.5, textTransform: "uppercase", marginTop: 5 }}>{(s as {l:string}).l}</div>
                  </div>
                ))}
              </div>
            </R>
          </div>
        </div>

        {/* ── RIGHT: Trips Caddie Slider ── */}
        <div className="w-full lg:w-1/2 bg-[#0a0f0a] relative border-l-0 lg:border-l border-white/[0.04] min-h-[600px] lg:min-h-0">
          <HeroTripSlider slug={hotel.slug} type="hotel" />
        </div>

        {/* Scroll indicator */}
        <div className="hidden lg:flex" style={{ position: "absolute", bottom: 20, left: "25%", transform: "translateX(-50%)", zIndex: 3, flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.5)", letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(rgba(255,255,255,.6),transparent)", animation: "sdrop 2s ease infinite" }} />
        </div>
      </section>

      {/* ═══ 2. CONTENT — text + gallery ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 600 }} className="max-md:!grid-cols-1">
        <div style={{ padding: "clamp(48px,8vh,100px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>The Property</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, letterSpacing: "-.02em" }}>
            {hotel.highlights?.[0] ? <em style={{ fontStyle: "italic" }}>{hotel.highlights[0]}</em> : <>Where Comfort Meets <em style={{ fontStyle: "italic" }}>Adventure</em></>}
          </h2></R>
          <R delay={0.16}><p style={{ fontSize: 13, lineHeight: 1.9, color: "var(--stone)", fontWeight: 300, maxWidth: 440, marginTop: 16 }}>{hotel.description.substring(0, 350)}</p></R>
          <R delay={0.2}><div style={{ width: 40, height: 1, background: "var(--bone)", margin: "20px 0" }} /></R>

          {/* Highlights as inline list */}
          {hotel.highlights?.length > 1 && (
            <R delay={0.24}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {hotel.highlights.slice(1, 6).map((h, i) => (
                  <span key={i} style={{ fontSize: 10, padding: "6px 14px", borderRadius: 100, border: "1px solid var(--bone)", color: "var(--stone)", fontWeight: 400 }}>{h}</span>
                ))}
              </div>
            </R>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 4 }} className="max-md:!min-h-[400px]">
          {(gallery.length > 0 ? gallery : [hotel.heroImage]).slice(0, 3).map((img, i) => (
            <div key={i} style={{ overflow: "hidden", position: "relative", cursor: gallery.length > 0 ? "pointer" : "default", ...(i === 2 ? { gridColumn: "span 2" } : {}) }} onClick={() => gallery.length > 0 && setLbIndex(i)}>
              <Image src={img} alt={`${hotel.name} ${i + 1}`} fill className="object-cover brightness-[.88] hover:brightness-100 hover:scale-[1.06] transition-all duration-700" sizes="(max-width:900px) 100vw, 50vw" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. DARK FEATURE — dining + amenities ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--ink)" }} className="max-md:!grid-cols-1">
        <div style={{ position: "relative", overflow: "hidden", minHeight: 400 }} className="max-md:!min-h-[300px]">
          {(gallery[1] || hotel.heroImage) && <Image src={gallery[1] || hotel.heroImage} alt="Feature" fill className="object-cover opacity-60 hover:opacity-75 hover:scale-[1.04] transition-all duration-[8s]" sizes="(max-width:900px) 100vw, 50vw" />}
        </div>
        <div style={{ padding: "clamp(48px,8vh,100px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14 }}>
            {hotel.dining?.length > 0 ? "Dining & Nightlife" : "The Experience"}
          </div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, letterSpacing: "-.02em", color: "#fff" }}>
            {hotel.dining?.length > 0 ? <>World-Class <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.7)" }}>Dining</em></> : <>Unmatched <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.7)" }}>Hospitality</em></>}
          </h2></R>

          {/* Dining list or quote */}
          {hotel.dining?.length > 0 ? (
            <R delay={0.16}>
              <div style={{ marginTop: 20 }}>
                {hotel.dining.slice(0, 4).map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 400, color: "#fff" }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 300, marginTop: 3 }}>{d.description.substring(0, 60)}{d.description.length > 60 ? "…" : ""}</div>
                    </div>
                    <span style={{ fontSize: 10, color: "var(--gold)", letterSpacing: 2, textTransform: "uppercase", flexShrink: 0, marginLeft: 16 }}>{d.type}</span>
                  </div>
                ))}
              </div>
            </R>
          ) : (
            <R delay={0.16}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.5, color: "rgba(255,255,255,.6)", marginTop: 16, maxWidth: 440, position: "relative", paddingTop: 28 }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 60, color: "rgba(180,154,106,.2)", lineHeight: ".5", position: "absolute", top: 0, left: 0 }}>&ldquo;</span>
                {quoteText}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.75)", letterSpacing: 2, textTransform: "uppercase", marginTop: 16 }}>— Golf the High Sierra</div>
            </R>
          )}
        </div>
      </section>

      {/* ═══ 4. INFO STRIP — rooms/amenities + FAQ ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="max-md:!grid-cols-1">
        {/* Left: Room types + amenities */}
        <div style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--cream)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>At a Glance</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}><em style={{ fontStyle: "italic" }}>{firstName}</em> Details</h2></R>

          {/* Mini stats */}
          <R delay={0.16}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, margin: "24px 0" }}>
              {[
                hotel.priceFrom && { v: hotel.priceFrom, l: "From / Night" },
                hotel.rating && { v: hotel.rating.value, l: "Rating" },
                hotel.totalRooms && { v: hotel.totalRooms.toLocaleString(), l: "Rooms" },
              ].filter(Boolean).map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "16px 8px", border: "1px solid var(--bone)", borderRadius: 8, background: "var(--white)" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 300 }}>{(s as {v:string|number}).v}</div>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--stone)", marginTop: 3 }}>{(s as {l:string}).l}</div>
                </div>
              ))}
            </div>
          </R>

          {/* Room types */}
          {hotel.roomTypes?.length > 0 && (
            <R delay={0.2}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginTop: 24, marginBottom: 8 }}>Accommodations</div>
              {hotel.roomTypes.slice(0, 5).map((rm, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--bone)", fontSize: 12, fontWeight: 300 }}>
                  <span style={{ color: "var(--charcoal)" }}>{rm.name}</span>
                  {rm.priceFrom && <span style={{ color: "var(--gold)", fontWeight: 500 }}>{rm.priceFrom}</span>}
                </div>
              ))}
            </R>
          )}

          {/* Amenities compact */}
          {hotel.amenities?.length > 0 && (
            <R delay={0.28}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginTop: 24, marginBottom: 10 }}>Amenities</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {hotel.amenities.slice(0, 8).map((a, i) => (
                  <span key={i} style={{ fontSize: 10, padding: "5px 12px", borderRadius: 100, border: "1px solid var(--bone)", color: "var(--stone)", fontWeight: 300 }}>{a}</span>
                ))}
              </div>
            </R>
          )}

          {/* Address */}
          {addr?.streetAddress && (
            <R delay={0.32}>
              <p style={{ fontSize: 11, color: "var(--stone)", marginTop: 20, fontWeight: 300 }}>
                {addr.streetAddress}, {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}
                {hotel.phone && <><br /><a href={`tel:${hotel.phone}`} style={{ color: "var(--gold)" }}>{hotel.phone}</a></>}
              </p>
            </R>
          )}
        </div>

        {/* Right: FAQ */}
        <div style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--white)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>FAQ</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 20 }}>Common <em style={{ fontStyle: "italic" }}>Questions</em></h2></R>
          {hotel.faqs?.slice(0, 5).map((f, i) => (
            <R key={i} delay={0.12 + i * 0.04}><FAQ q={f.question} a={f.answer} /></R>
          ))}
        </div>
      </section>

      {/* ═══ RELATED ═══ */}
      {relatedHotels.length > 0 && (
        <section style={{ padding: "clamp(48px,7vh,80px) clamp(32px,7vw,120px)", background: "var(--cream)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Nearby</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}>More in <em style={{ fontStyle: "italic" }}>{hotel.regionLabel}</em></h2></R>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 24 }} className="max-md:!grid-cols-1">
            {relatedHotels.map((rh, i) => (
              <R key={rh.slug} delay={0.12 + i * 0.06}>
                <Link href={`/portfolio/${rh.slug}/`}>
                  <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--white)", transition: "all .5s" }} className="hover:!border-transparent hover:!shadow-[0_16px_48px_rgba(0,0,0,.06)] hover:-translate-y-1">
                    <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                      {rh.heroImage ? <Image src={rh.heroImage} alt={rh.name} fill className="object-cover brightness-[.9] hover:brightness-100 hover:scale-[1.05] transition-all duration-600" sizes="(max-width:768px) 100vw, 33vw" /> : <div style={{ width: "100%", height: "100%", background: "var(--bone)" }} />}
                      {rh.priceFrom && <span style={{ position: "absolute", top: 10, right: 10, background: "var(--ink)", color: "#fff", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{rh.priceFrom}</span>}
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, color: "var(--ink)" }}>{rh.name}</div>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--stone)", margin: "4px 0 12px" }}>{rh.regionLabel}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--bone)" }}>
                        {rh.rating && <span style={{ fontSize: 10, color: "var(--stone)" }}>★ {rh.rating.value}</span>}
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

      {/* ═══ 5. CTA ═══ */}
      <section style={{ background: "var(--ink)", textAlign: "center", padding: "clamp(64px,10vh,120px) clamp(32px,7vw,120px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%,rgba(180,154,106,.05),transparent 70%)" }} />
        <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14, position: "relative", zIndex: 1 }}>Stay &amp; Play</div></R>
        <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, color: "#fff", marginBottom: 12, position: "relative", zIndex: 1 }}>Book {firstName} <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.65)" }}>Golf Package</em></h2></R>
        <R delay={0.16}><p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 300, maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.8, position: "relative", zIndex: 1 }}>
          {hotel.priceRange ? `Stay-and-play from ${hotel.priceFrom || hotel.priceRange.split("–")[0]}/golfer. ` : ""}Lodging, tee times, dining — one call.
        </p></R>
        <R delay={0.2}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(180,154,106,.12)", fontSize: 10, color: "var(--gold)", fontWeight: 500, marginBottom: 24, letterSpacing: ".5px" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", animation: "euroP 2s infinite" }} />
              Custom packages available year-round
            </div>
          </div>
        </R>
        <R delay={0.28}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-block", padding: "15px 36px", background: "var(--gold)", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", transition: "all .4s" }} className="hover:!bg-[#c8ad7e] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(180,154,106,.2)]">
              Plan My Trip
            </Link>
            <a href="tel:+18885848232" style={{ display: "inline-block", padding: "15px 36px", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.65)", borderRadius: 100, fontSize: 10, fontWeight: 400, letterSpacing: 2, textTransform: "uppercase", transition: "all .4s" }} className="hover:!border-white/35 hover:!text-white">
              Call 888-584-8232
            </a>
          </div>
        </R>
      </section>

      {/* Lightbox */}
      {lbIndex !== null && gallery.length > 0 && <Lightbox images={gallery} startIndex={lbIndex} onClose={() => setLbIndex(null)} name={hotel.name} />}

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes heroZoom{to{transform:scale(1)}}
        @keyframes sdrop{0%{opacity:0;transform:translateY(-8px)}50%{opacity:1}100%{opacity:0;transform:translateY(8px)}}
        @keyframes euroP{0%,100%{opacity:1}50%{opacity:.2}}
      `}</style>
    </div>
  );
}
