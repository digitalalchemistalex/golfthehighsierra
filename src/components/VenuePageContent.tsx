"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  slug: string; name: string; type: string; region: string; regionLabel: string;
  parentVenue?: string | null; tagline?: string; bestFor?: string;
  address?: VenueAddress; geo?: VenueGeo; phone?: string | null;
  website?: string; hours?: string; priceRange?: string; ambiance?: string;
  dogFriendly?: boolean; description: string; pointOfView?: string;
  highlights?: VenueHighlight[]; insiderTips?: string[];
  parking?: VenueParking; groupEvents?: VenueGroupEvents;
  distances?: VenueDistance[]; directionsUrl?: string;
  heroImage?: string; images: string[];
  faqs: VenueFAQ[]; meta: { title: string; description: string };
}

interface RelatedVenue {
  slug: string; name: string; type: string; regionLabel: string;
  heroImage?: string; tagline?: string;
}

/* ─── Reveal on scroll ─── */
function R({ children, className = "", delay = 0, style, mode = "up" }: {
  children: React.ReactNode; className?: string; delay?: number;
  style?: React.CSSProperties; mode?: "up" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); obs.unobserve(el); }
    }, { threshold: 0.06, rootMargin: "-30px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const base = mode === "scale"
    ? { opacity: v ? 1 : 0, transform: v ? "scale(1)" : "scale(.92)", transition: `opacity 1s cubic-bezier(.23,1,.32,1) ${delay}s, transform 1s cubic-bezier(.23,1,.32,1) ${delay}s` }
    : { opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(32px)", transition: `opacity .9s cubic-bezier(.23,1,.32,1) ${delay}s, transform .9s cubic-bezier(.23,1,.32,1) ${delay}s` };
  return <div ref={ref} className={className} style={{ ...style, ...base }}>{children}</div>;
}

/* ─── FAQ ─── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--v-pearl)" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "22px 0", background: "none", border: "none", fontFamily: "var(--v-body)", fontSize: 14, color: "var(--v-charcoal)", cursor: "pointer", textAlign: "left" as const, gap: 16, fontWeight: 400, letterSpacing: ".01em", transition: "color .3s" }} className="hover:!text-[#a0845c]">
        {q}
        <span style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid var(--v-pearl)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--v-stone)", transition: "all .4s cubic-bezier(.23,1,.32,1)", flexShrink: 0, fontWeight: 300, ...(open ? { background: "var(--v-bronze)", color: "#fff", borderColor: "var(--v-bronze)", transform: "rotate(45deg)" } : {}) }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height .6s cubic-bezier(.23,1,.32,1)" }}>
        <p style={{ paddingBottom: 22, fontSize: 13, color: "var(--v-stone)", lineHeight: 1.9, fontWeight: 300 }}>{a}</p>
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

/* ─── Count-up number ─── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { setStarted(true); obs.unobserve(el); } }, { threshold: 0.5 });
    obs.observe(el); return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return; let c = 0;
    const step = () => { c += Math.ceil(target / 18); if (c >= target) { setVal(target); return; } setVal(c); requestAnimationFrame(step); }; step();
  }, [started, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Cursor glow ─── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current; if (!el) return;
    const m = (e: MouseEvent) => { el.style.left = e.clientX + "px"; el.style.top = e.clientY + "px"; };
    document.addEventListener("mousemove", m); return () => document.removeEventListener("mousemove", m);
  }, []);
  return <div ref={ref} style={{ position: "fixed", top: 0, left: 0, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(160,132,92,.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 9998, transform: "translate(-50%, -50%)" }} />;
}

/* ─── Parallax ─── */
function Parallax({ children, speed = 0.12, className = "", style }: { children: React.ReactNode; speed?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = useCallback(() => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translateY(${(r.top + r.height / 2 - window.innerHeight / 2) * speed}px)`;
  }, [speed]);
  useEffect(() => {
    let t = false;
    const s = () => { if (!t) { requestAnimationFrame(() => { go(); t = false; }); t = true; } };
    window.addEventListener("scroll", s, { passive: true }); go();
    return () => window.removeEventListener("scroll", s);
  }, [go]);
  return <div ref={ref} className={className} style={style}>{children}</div>;
}

/* ─── Type label ─── */
function typeLabel(type: string): string {
  const m: Record<string, string> = { bar: "Bar & Nightlife", lounge: "Lounge", spa: "Spa & Wellness", museum: "Museum & Culture", shopping: "Shopping", pool: "Pool & Aquatics", fitness: "Fitness", amenity: "Amenity", restaurant: "Dining" };
  return m[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

const galleryLabels = ["Craft Cocktails", "The Bar", "The Atmosphere", "The Patio"];

/* ═══════════════════════════════════════
   MAIN — White Luxury V2
   ═══════════════════════════════════════ */
export default function VenuePageContent({ venue, relatedVenues = [] }: { venue: VenueProps; relatedVenues?: RelatedVenue[] }) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const gallery = venue.images || [];
  const addr = venue.address;
  const nameParts = venue.name.split(" ");
  const firstName = nameParts[0];

  const cssVars = {
    "--v-white": "#ffffff", "--v-snow": "#fdfcfb", "--v-bone": "#f5f2ee", "--v-pearl": "#e8e4de", "--v-sand": "#d4cfc6", "--v-stone": "#8a857c", "--v-charcoal": "#3a3832", "--v-ink": "#1a1917", "--v-bronze": "#a0845c", "--v-bronze-glow": "#b89b6e",
    "--v-serif": "'Cormorant Garamond', 'Cormorant', Georgia, serif", "--v-body": "'Outfit', 'Manrope', system-ui, sans-serif",
  } as React.CSSProperties;

  return (
    <div style={{ ...cssVars, fontFamily: "var(--v-body)", background: "var(--v-white)", color: "var(--v-ink)", overflowX: "hidden" }}>
      <CursorGlow />

      {/* ═══ 1. HERO ═══ */}
      <section style={{ position: "relative", height: "100vh", minHeight: 700, overflow: "hidden", background: "#0a0908" }}>
        <Parallax speed={0.15} style={{ position: "absolute", inset: "-10% 0" }}>
          {venue.heroImage && <Image src={venue.heroImage} alt={venue.name} fill priority className="object-cover" sizes="100vw" style={{ opacity: 0, transform: "scale(1.12)", animation: "venueHeroReveal 2.2s cubic-bezier(.23,1,.32,1) .3s forwards", filter: "brightness(.42) saturate(1.1)" }} />}
        </Parallax>
        {/* Grain */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: 128, pointerEvents: "none", zIndex: 1, mixBlendMode: "overlay" as const }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.4) 0%,rgba(0,0,0,.05) 35%,rgba(0,0,0,.05) 50%,rgba(10,9,8,.82) 100%)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%,transparent 50%,rgba(0,0,0,.4) 100%)", zIndex: 1 }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: "clamp(28px,5vh,56px)", left: "clamp(32px,7vw,120px)", right: "clamp(32px,7vw,120px)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 4, opacity: 0, animation: "venueFadeDown .8s ease .8s forwards" }}>
          <div style={{ fontFamily: "var(--v-serif)", fontSize: 13, color: "rgba(255,255,255,.3)", letterSpacing: 4, textTransform: "uppercase" }}>Golf the High Sierra</div>
          <div style={{ display: "flex", gap: 28 }} className="max-md:!hidden">
            <Link href="/experiences-things-to-do-in-reno-nv/" style={{ fontSize: 10, color: "rgba(255,255,255,.25)", letterSpacing: 2, textTransform: "uppercase" }} className="hover:!text-white/60">Experiences</Link>
            <Link href="/contact-custom-golf-package/" style={{ fontSize: 10, color: "rgba(255,255,255,.25)", letterSpacing: 2, textTransform: "uppercase" }} className="hover:!text-white/60">Book</Link>
          </div>
        </div>

        {/* Content */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(32px,7vw,120px) clamp(56px,9vh,110px)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 100, border: "1px solid rgba(160,132,92,.3)", fontSize: 9, color: "var(--v-bronze-glow)", fontWeight: 500, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 24, width: "fit-content", backdropFilter: "blur(12px)", background: "rgba(10,9,8,.35)", opacity: 0, animation: "venueFadeUp .8s ease 1s forwards" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--v-bronze)", animation: "venuePulse 2.5s ease infinite" }} />
            {typeLabel(venue.type)}
          </div>
          <h1 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(52px,9vw,120px)", lineHeight: .9, color: "#fff", letterSpacing: "-.03em", opacity: 0, animation: "venueHeroTextUp 1.2s cubic-bezier(.23,1,.32,1) 1.1s forwards" }}>
            {nameParts.length > 1 ? <>{nameParts.slice(0, -1).join(" ")}<br /><em style={{ fontStyle: "italic", color: "rgba(255,255,255,.45)" }}>{nameParts.slice(-1)}</em></> : venue.name}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, fontSize: 12, color: "rgba(255,255,255,.25)", fontWeight: 300, opacity: 0, animation: "venueFadeUp .8s ease 1.5s forwards", flexWrap: "wrap" }}>
            <span>{venue.regionLabel}</span>
            {venue.bestFor && <><span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.15)" }} /><span>{venue.bestFor}</span></>}
          </div>
          <div style={{ display: "flex", gap: "clamp(28px,4.5vw,64px)", marginTop: "clamp(24px,3.5vh,40px)", paddingTop: "clamp(16px,2.5vh,24px)", borderTop: "1px solid rgba(255,255,255,.06)", opacity: 0, animation: "venueFadeUp .8s ease 1.8s forwards", flexWrap: "wrap" }} className="max-sm:[&>div:nth-child(3)]:!hidden">
            {[venue.hours && { v: venue.hours.split("|")[0].trim(), l: "Hours" }, venue.priceRange && { v: venue.priceRange, l: "Price Range" }, venue.ambiance && { v: venue.ambiance, l: "Ambiance" }].filter(Boolean).map((s, i) => (
              <div key={i} style={{ maxWidth: 220 }}>
                <div style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,.55)", lineHeight: 1.4 }}>{(s as { v: string }).v}</div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,.15)", letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>{(s as { l: string }).l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Scroll mouse */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0, animation: "venueFadeIn 1s ease 2.5s forwards" }}>
          <div style={{ width: 18, height: 28, border: "1px solid rgba(255,255,255,.15)", borderRadius: 10, position: "relative" }}><div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 2, height: 6, borderRadius: 2, background: "rgba(255,255,255,.25)", animation: "venueMouseScroll 1.8s ease infinite" }} /></div>
          <span style={{ fontSize: 7, color: "rgba(255,255,255,.12)", letterSpacing: 4, textTransform: "uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* ═══ 2. POV + GALLERY ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 650 }} className="max-md:!grid-cols-1">
        <div style={{ padding: "clamp(56px,9vh,110px) clamp(36px,6vw,90px)", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--v-white)", position: "relative" }}>
          <div style={{ position: "absolute", top: "15%", right: 0, width: 1, height: "70%", background: "linear-gradient(transparent, var(--v-pearl), transparent)" }} className="max-md:!hidden" />
          <R><div style={{ fontSize: 9, letterSpacing: 4.5, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 16 }}>Our Point of View</div></R>
          <R delay={0.1}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(30px,3.5vw,52px)", lineHeight: 1.08, letterSpacing: "-.02em" }}>{firstName} <em style={{ fontStyle: "italic" }}>Experience</em></h2></R>
          {venue.pointOfView && <R delay={0.25}><div style={{ position: "relative", marginTop: 28, paddingLeft: 28, borderLeft: "2px solid var(--v-bronze)" }}><span style={{ fontFamily: "var(--v-serif)", fontSize: 64, color: "rgba(160,132,92,.15)", lineHeight: ".4", position: "absolute", top: 0, left: 4 }}>&ldquo;</span><p style={{ fontFamily: "var(--v-serif)", fontSize: "clamp(19px,2.2vw,24px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.55, color: "var(--v-charcoal)" }}>{venue.pointOfView}</p></div></R>}
          <R delay={0.35}><div style={{ width: 48, height: 1, background: "var(--v-pearl)", margin: "32px 0" }} /></R>
          <R delay={0.45}><p style={{ fontSize: 14, lineHeight: 1.95, color: "var(--v-stone)", fontWeight: 300, maxWidth: 480 }}>From 8 to 100 guests — include {venue.name} in your group golf package. After a round on the links, unwind with {venue.type === "bar" || venue.type === "lounge" ? "craft cocktails and nightlife" : venue.type === "spa" ? "spa treatments and relaxation" : "unforgettable experiences"} just minutes from the best courses in the High Sierra.</p></R>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 4 }} className="max-md:!min-h-[400px]">
          {gallery.slice(0, 3).map((img, i) => (
            <R key={i} delay={0.1 + i * 0.15} mode="scale"><div style={{ overflow: "hidden", position: "relative", cursor: "pointer", height: "100%", ...(i === 2 ? { gridColumn: "span 2" } : {}) }} onClick={() => setLbIndex(i)} className="group">
              <Image src={img} alt={`${venue.name} ${i + 1}`} fill className="object-cover brightness-[.85] saturate-[1.05] group-hover:brightness-100 group-hover:saturate-110 group-hover:scale-[1.06] transition-all duration-[800ms] ease-[cubic-bezier(.23,1,.32,1)]" sizes="(max-width:900px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-3.5 left-4 text-[9px] tracking-[2px] uppercase text-white/70 font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">{galleryLabels[i] || `View ${i + 1}`}</div>
            </div></R>
          ))}
        </div>
      </section>

      {/* ═══ 3. HIGHLIGHTS ═══ */}
      <section style={{ padding: "clamp(64px,10vh,120px) clamp(36px,7vw,120px)", background: "var(--v-bone)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(160,132,92,.04), transparent 70%)" }} />
        <div style={{ marginBottom: 40 }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4.5, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 16 }}>Key Highlights</div></R>
          <R delay={0.1}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(30px,3.5vw,52px)", lineHeight: 1.08 }}>What to <em style={{ fontStyle: "italic" }}>Know</em></h2></R>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }} className="max-lg:!grid-cols-2 max-sm:!grid-cols-1">
          {(venue.highlights || []).map((h, i) => (
            <R key={i} delay={0.05 + i * 0.07}>
              <div className="group" style={{ padding: "28px 24px", background: "var(--v-white)", borderRadius: 20, border: "1px solid var(--v-pearl)", position: "relative", overflow: "hidden", transition: "all .5s cubic-bezier(.23,1,.32,1)", cursor: "default" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--v-bronze), var(--v-bronze-glow))", transform: "scaleX(0)", transformOrigin: "left", transition: "transform .5s cubic-bezier(.23,1,.32,1)" }} className="group-hover:!scale-x-100" />
                <span style={{ fontSize: 28, display: "block", marginBottom: 12, transition: "transform .4s" }} className="group-hover:!scale-[1.15] group-hover:!-rotate-[5deg]">{h.icon}</span>
                <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--v-bronze)", fontWeight: 600, marginBottom: 8 }}>{h.label}</div>
                <div style={{ fontSize: 13, color: "var(--v-charcoal)", fontWeight: 300, lineHeight: 1.65 }}>{h.value}</div>
              </div>
            </R>
          ))}
        </div>
      </section>

      {/* ═══ 4. DARK — INSIDER TIPS ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--v-ink)", position: "relative" }} className="max-md:!grid-cols-1">
        <Parallax speed={0.08} style={{ position: "relative", overflow: "hidden", minHeight: 500 }} className="max-md:!min-h-[300px]">
          {gallery[0] && <Image src={gallery[0]} alt={venue.name} fill className="object-cover opacity-40 saturate-[.8] hover:opacity-[.55] hover:scale-[1.05] transition-all duration-[12s] ease-[cubic-bezier(.23,1,.32,1)]" sizes="(max-width:900px) 100vw, 50vw" />}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent 10%, var(--v-bronze) 50%, transparent 90%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 70%,rgba(160,132,92,.08),transparent 60%)", pointerEvents: "none" }} />
        </Parallax>
        <div style={{ padding: "clamp(56px,9vh,110px) clamp(36px,6vw,90px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4.5, textTransform: "uppercase", color: "var(--v-bronze)", fontWeight: 500, marginBottom: 16 }}>The Hack</div></R>
          <R delay={0.1}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(30px,3.5vw,52px)", lineHeight: 1.08, color: "#fff" }}>Insider <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.35)" }}>Tips</em></h2></R>
          <div style={{ marginTop: 32 }}>
            {(venue.insiderTips || []).map((tip, i) => {
              const parts = tip.split(" — ");
              return (<R key={i} delay={0.2 + i * 0.08}><div className="group" style={{ display: "flex", gap: 18, padding: "18px 0", borderBottom: i < (venue.insiderTips?.length || 0) - 1 ? "1px solid rgba(255,255,255,.04)" : "none", transition: "all .4s", cursor: "default" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(160,132,92,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--v-bronze)", flexShrink: 0, fontWeight: 500, transition: "all .4s" }} className="group-hover:!bg-[#a0845c] group-hover:!text-white group-hover:!border-[#a0845c]">{i + 1}</div>
                <div>{parts.length > 1 ? <><div style={{ fontSize: 14, color: "rgba(255,255,255,.7)", fontWeight: 500, marginBottom: 4 }}>{parts[0]}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,.28)", fontWeight: 300, lineHeight: 1.65 }}>{parts.slice(1).join(" — ")}</div></> : <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", fontWeight: 300, lineHeight: 1.65 }}>{tip}</div>}</div>
              </div></R>);
            })}
          </div>
        </div>
      </section>

      {/* ═══ 5. LOCATION + FAQ ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="max-md:!grid-cols-1">
        <div style={{ padding: "clamp(56px,9vh,96px) clamp(36px,6vw,90px)", background: "var(--v-bone)" }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4.5, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 16 }}>Location</div></R>
          <R delay={0.1}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(30px,3.5vw,52px)", lineHeight: 1.08 }}>Getting <em style={{ fontStyle: "italic" }}>There</em></h2></R>
          {(venue.distances || []).length > 0 && <div style={{ marginTop: 28 }}>{(venue.distances || []).slice(0, 6).map((d, i) => (<R key={i} delay={0.15 + i * 0.05}><div className="group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--v-pearl)", fontSize: 13, fontWeight: 300, transition: "all .3s" }}><span style={{ color: "var(--v-charcoal)" }}>{d.location}</span><span style={{ color: "var(--v-bronze)", fontWeight: 600, whiteSpace: "nowrap", fontSize: 12, letterSpacing: ".5px" }}><CountUp target={d.minutes} suffix=" min" /></span></div></R>))}</div>}
          {addr?.streetAddress && <R delay={0.45}><div style={{ marginTop: 28, padding: 24, background: "var(--v-white)", borderRadius: 20, border: "1px solid var(--v-pearl)", transition: "all .4s" }} className="hover:!shadow-[0_12px_36px_rgba(0,0,0,.04)]">
            <p style={{ fontSize: 14, color: "var(--v-charcoal)", fontWeight: 400, lineHeight: 1.6 }}>{addr.streetAddress}, {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}</p>
            {venue.hours && <p style={{ fontSize: 12, color: "var(--v-stone)", fontWeight: 300, marginTop: 6 }}>{venue.hours}</p>}
            {venue.parking && <p style={{ fontSize: 12, color: "var(--v-stone)", fontWeight: 300, marginTop: 6 }}>{venue.parking.summary}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              {venue.directionsUrl && <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", padding: "10px 24px", borderRadius: 100, background: "var(--v-bronze)", color: "#fff", fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none", transition: "all .4s cubic-bezier(.23,1,.32,1)" }} className="hover:!bg-[#b89b6e] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(160,132,92,.2)]">Directions</a>}
              {venue.website && <a href={venue.website} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", padding: "10px 24px", borderRadius: 100, border: "1px solid var(--v-pearl)", color: "var(--v-charcoal)", fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none", transition: "all .4s" }} className="hover:!border-[#a0845c] hover:!text-[#a0845c] hover:-translate-y-0.5">Website</a>}
            </div>
          </div></R>}
        </div>
        <div style={{ padding: "clamp(56px,9vh,96px) clamp(36px,6vw,90px)", background: "var(--v-white)" }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4.5, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 16 }}>FAQ</div></R>
          <R delay={0.1}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(30px,3.5vw,52px)", lineHeight: 1.08, marginBottom: 24 }}>Common <em style={{ fontStyle: "italic" }}>Questions</em></h2></R>
          {venue.faqs.slice(0, 5).map((f, i) => <R key={i} delay={0.18 + i * 0.06}><FAQ q={f.question} a={f.answer} /></R>)}
          {venue.groupEvents && <R delay={0.45}><div style={{ marginTop: 32, padding: 28, background: "var(--v-bone)", borderRadius: 24, border: "1px solid var(--v-pearl)", transition: "all .4s" }} className="hover:!shadow-[0_8px_24px_rgba(0,0,0,.03)]">
            <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--v-bronze)", fontWeight: 600, marginBottom: 12 }}>Private Events</div>
            <p style={{ fontSize: 13, color: "var(--v-charcoal)", fontWeight: 300, lineHeight: 1.75 }}>{venue.groupEvents.description}</p>
            {venue.groupEvents.idealFor && <p style={{ fontSize: 11, color: "var(--v-stone)", fontWeight: 300, marginTop: 10 }}>Ideal for: {venue.groupEvents.idealFor}</p>}
            {venue.groupEvents.reservationUrl && <a href={venue.groupEvents.reservationUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", marginTop: 16, padding: "9px 22px", borderRadius: 100, border: "1px solid var(--v-bronze)", color: "var(--v-bronze)", fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none", transition: "all .4s" }} className="hover:!bg-[#a0845c] hover:!text-white hover:-translate-y-0.5">Reserve</a>}
          </div></R>}
        </div>
      </section>

      {/* ═══ RELATED ═══ */}
      {relatedVenues.length > 0 && <section style={{ padding: "clamp(56px,8vh,96px) clamp(36px,7vw,120px)", background: "var(--v-bone)" }}>
        <R><div style={{ fontSize: 9, letterSpacing: 4.5, textTransform: "uppercase", color: "var(--v-stone)", fontWeight: 500, marginBottom: 16 }}>More to Explore</div></R>
        <R delay={0.08}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(30px,3.5vw,52px)", lineHeight: 1.08 }}>Nearby <em style={{ fontStyle: "italic" }}>Experiences</em></h2></R>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 28 }} className="max-md:!grid-cols-1">
          {relatedVenues.map((rv, i) => <R key={rv.slug} delay={0.12 + i * 0.06}><Link href={`/portfolio/${rv.slug}/`}><div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid var(--v-pearl)", background: "var(--v-white)", transition: "all .5s cubic-bezier(.23,1,.32,1)" }} className="hover:!border-transparent hover:!shadow-[0_20px_50px_rgba(0,0,0,.06)] hover:-translate-y-1">
            <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>{rv.heroImage ? <Image src={rv.heroImage} alt={rv.name} fill className="object-cover brightness-[.88] hover:brightness-100 hover:scale-[1.05] transition-all duration-[600ms]" sizes="(max-width:768px) 100vw, 33vw" /> : <div style={{ width: "100%", height: "100%", background: "var(--v-pearl)" }} />}<span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,.6)", backdropFilter: "blur(8px)", color: "#fff", padding: "4px 12px", borderRadius: 100, fontSize: 9, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>{typeLabel(rv.type)}</span></div>
            <div style={{ padding: 18 }}><div style={{ fontFamily: "var(--v-serif)", fontSize: 20, fontWeight: 400, color: "var(--v-ink)" }}>{rv.name}</div><div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: "var(--v-stone)", margin: "4px 0 14px" }}>{rv.regionLabel}</div><div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12, borderTop: "1px solid var(--v-pearl)" }}><span style={{ fontSize: 9, color: "var(--v-bronze)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View →</span></div></div>
          </div></Link></R>)}
        </div>
      </section>}

      {/* ═══ CTA ═══ */}
      <section style={{ background: "var(--v-ink)", textAlign: "center", padding: "clamp(80px,12vh,140px) clamp(36px,7vw,120px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 70%,rgba(160,132,92,.05),transparent 65%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <R><div style={{ fontSize: 9, letterSpacing: 4.5, textTransform: "uppercase", color: "var(--v-bronze)", fontWeight: 500, marginBottom: 16 }}>Experience {firstName}</div></R>
          <R delay={0.1}><h2 style={{ fontFamily: "var(--v-serif)", fontWeight: 300, fontSize: "clamp(30px,3.5vw,52px)", lineHeight: 1.08, color: "#fff", marginBottom: 14 }}>Add {firstName} to <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.3)" }}>Your Golf Trip</em></h2></R>
          <R delay={0.2}><p style={{ fontSize: 14, color: "rgba(255,255,255,.22)", fontWeight: 300, maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.85 }}>Golf, lodging, {venue.type === "bar" || venue.type === "lounge" ? "nightlife" : venue.type === "spa" ? "spa treatments" : "entertainment"} — all in one custom package. One call plans everything.</p></R>
          <R delay={0.3}><div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(160,132,92,.1)", fontSize: 9, color: "var(--v-bronze)", fontWeight: 500, marginBottom: 28, letterSpacing: ".5px" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--v-bronze)", animation: "venuePulse 2s infinite" }} />Groups of 8+ save 20%</div></R>
          <R delay={0.4}><div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-block", padding: "16px 40px", background: "var(--v-bronze)", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", transition: "all .5s cubic-bezier(.23,1,.32,1)" }} className="hover:!bg-[#b89b6e] hover:-translate-y-[3px] hover:shadow-[0_16px_48px_rgba(160,132,92,.25)]">Plan My Trip</Link>
            <a href="tel:+18885848232" style={{ display: "inline-block", padding: "16px 40px", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.3)", borderRadius: 100, fontSize: 10, fontWeight: 400, letterSpacing: 2.5, textTransform: "uppercase", transition: "all .4s" }} className="hover:!border-white/30 hover:!text-white">Call 888-584-8232</a>
          </div></R>
        </div>
      </section>

      {lbIndex !== null && gallery.length > 0 && <Lightbox images={gallery} startIndex={lbIndex} onClose={() => setLbIndex(null)} name={venue.name} />}
      <style jsx global>{`
        @keyframes venueHeroReveal{to{opacity:1;transform:scale(1)}}
        @keyframes venueHeroTextUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
        @keyframes venueFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes venueFadeDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes venueFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes venueMouseScroll{0%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(10px)}}
        @keyframes venuePulse{0%,100%{opacity:1}50%{opacity:.15}}
      `}</style>
    </div>
  );
}
