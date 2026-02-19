"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import HeroTripSlider from "./HeroTripSlider";

/* ─── Types ─── */
interface CourseAddress { streetAddress?: string; addressLocality?: string; addressRegion?: string; postalCode?: string; }
interface CourseGeo { latitude?: number; longitude?: number; }
interface CourseRating { value: number; count: number; }
interface CourseFAQ { question: string; answer: string; }
interface CourseTestimonial { stars: number; quote: string; author: string; source: string; meta: string; }
interface FeaturedHole { title?: string; description?: string; number?: number; par?: number; yardage?: number; }
interface CourseTip { title?: string; content?: string; }
interface ScorecardTee { name: string; color: string; rating: number; slope: number; holes: number[]; total: number; }
interface Scorecard { tees: ScorecardTee[]; par: number[]; handicap?: { gentlemens?: number[]; ladies?: number[] }; }
interface TeeData { name: string; yardage: number; par: number; rating: number; slope: number; gender: string; ratingF?: number; slopeF?: number; }

export interface CourseProps {
  slug: string; name: string; region?: string; regionLabel: string;
  address?: CourseAddress; geo?: CourseGeo; phone?: string; website?: string;
  priceRange?: string; rating?: CourseRating; description: string;
  holes?: number; par?: number | null; designer?: string;
  yardage?: number; slope?: number; courseRating?: number; yearBuilt?: number;
  heroImage?: string; images: string[]; videoUrl?: string;
  faqs: CourseFAQ[]; testimonials?: CourseTestimonial[]; meta?: { title: string; description: string };
  bodyText?: string[]; distances?: string[]; facilities?: string[];
  tips?: CourseTip[]; pointOfView?: string; hack?: string;
  contentParagraphs?: string[]; featuredHole?: FeaturedHole;
  teeTimeInfo?: string; teeTips?: string[];
  scorecard?: Scorecard;
  teeData?: TeeData[];
  courseMapImage?: string;
}

interface RelatedCourse { slug: string; name: string; regionLabel: string; heroImage?: string; priceRange?: string; rating?: CourseRating; }
interface RelatedHotel { slug: string; name: string; regionLabel: string; heroImage?: string; priceFrom?: string | number; rating?: CourseRating; driveMinutes?: number; }

/* ─── Helpers ─── */
function isScorecard(url: string) { return url.toLowerCase().includes("scorecard"); }
function isLogo(url: string) { const l = url.toLowerCase(); return (l.includes("logo") || l.includes("golfball")) && (l.endsWith(".png") || l.endsWith(".webp") || l.endsWith(".svg")); }
function parseDistances(bodyText: string[]): string[] {
  const d: string[] = [];
  for (const b of bodyText) for (const l of b.split("\n")) { const t = l.trim(); if (/^\d+\s*(minutes?|mins?)\s/i.test(t)) d.push(t); }
  return d;
}

/* ─── Tee color map ─── */
const TEE_COLORS: Record<string, string> = {
  black: "#1a1a1a", blue: "#1a5fb4", white: "#e8e8e8", gold: "#C9A24D",
  red: "#c0392b", green: "#2d6a4f", silver: "#95a5a6", platinum: "#8e8e9e",
};
function teeColor(name: string): string {
  const n = name.toLowerCase();
  for (const [k, v] of Object.entries(TEE_COLORS)) if (n.includes(k)) return v;
  return "#666";
}

/* ─── Reveal ─── */
function R({ children, className = "", delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: 0.08, rootMargin: "-20px" });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={className} style={{ ...style, opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)", transition: `opacity .85s cubic-bezier(.16,1,.3,1) ${delay}s, transform .85s cubic-bezier(.16,1,.3,1) ${delay}s` }}>{children}</div>;
}

/* ─── Counter ─── */
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60; const inc = to / steps;
        let cur = 0; const t = setInterval(() => { cur = Math.min(cur + inc, to); setVal(Math.floor(cur)); if (cur >= to) clearInterval(t); }, 1400 / steps);
      }
    }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
}

/* ─── FAQ ─── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--bone)" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "18px 0", background: "none", border: "none", fontFamily: "var(--sans)", fontSize: 13, color: "var(--charcoal)", cursor: "pointer", textAlign: "left" as const, gap: 12, fontWeight: 400 }}>
        {q}
        <span style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid var(--bone)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, transition: "all .35s", ...(open ? { background: "var(--gold)", color: "#fff", borderColor: "var(--gold)", transform: "rotate(45deg)" } : { color: "var(--stone)" }) }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height .5s ease" }}>
        <p style={{ paddingBottom: 18, fontSize: 12, color: "var(--stone)", lineHeight: 1.85, fontWeight: 400 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─── Lightbox ─── */
function Lightbox({ images, startIndex, onClose, name }: { images: string[]; startIndex: number; onClose: () => void; name: string }) {
  const [idx, setIdx] = useState(startIndex);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(false); }, [idx]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") setIdx(i => (i + 1) % images.length); if (e.key === "ArrowLeft") setIdx(i => (i - 1 + images.length) % images.length); };
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [images.length, onClose]);
  const absSrc = images[idx]?.startsWith("/") ? `https://golfthehighsierra.vercel.app${images[idx]}` : images[idx];
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999, background: "rgba(0,0,0,.95)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <button onClick={onClose} style={{ position: "fixed", top: 16, right: 16, color: "rgba(255,255,255,.6)", zIndex: 10000, padding: 8, background: "none", border: "none", cursor: "pointer" }}><X className="w-8 h-8" /></button>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }} style={{ position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.6)", zIndex: 10000, padding: 8, background: "none", border: "none", cursor: "pointer" }}><ChevronLeft className="w-10 h-10" /></button>
      <div onClick={e => e.stopPropagation()} style={{ width: "85vw", height: "75vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {!loaded && <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14, position: "absolute" }}>Loading…</div>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={idx} src={absSrc} alt={`${name} ${idx + 1}`} onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: loaded ? "block" : "none" }} />
      </div>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} style={{ position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.6)", zIndex: 10000, padding: 8, background: "none", border: "none", cursor: "pointer" }}><ChevronRight className="w-10 h-10" /></button>
      <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,.75)", fontSize: 12, letterSpacing: 4 }}>{idx + 1} / {images.length}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT — Psychology-first architecture
   Flow: Desire → Authority → Emotion → Anticipation
         → Credibility → Scarcity → Rational → Proof → Action
   ═══════════════════════════════════════════ */
export default function CoursePageContent({ course, relatedCourses = [], relatedHotels = [], blurs = {} }: { course: CourseProps; relatedCourses?: RelatedCourse[]; relatedHotels?: RelatedHotel[]; blurs?: Record<string, string> }) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const [isEmbed, setIsEmbed] = useState(false);
  useEffect(() => { try { setIsEmbed(window.self !== window.top); } catch { setIsEmbed(true); } }, []);
  const bp = (src: string) => blurs[src] ? { placeholder: "blur" as const, blurDataURL: blurs[src] } : {};

  const gallery = course.images.filter(u => !isScorecard(u) && !isLogo(u));
  const displayGallery = gallery.length >= 3 ? gallery : [...(course.heroImage ? [course.heroImage] : []), ...gallery].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
  const distances = course.distances?.length ? course.distances : parseDistances(course.bodyText || []);
  const addr = course.address;
  const nameParts = course.name.split(" ");
  const firstName = nameParts[0];

  // ── TEXT HIERARCHY — strict, no field used more than once ──
  // Slot 1 — Quote section (left col): pointOfView ONLY. Never falls back to anything else.
  const quoteText = course.pointOfView || "";

  // Slot 2 — Story section para1: contentParagraphs[0], else description
  const para1 = course.contentParagraphs?.[0] || course.description || "";

  // Slot 3 — Story section para2: contentParagraphs[1] only (no fallback to description)
  const para2 = course.contentParagraphs?.[1] || "";

  // Slot 4 — Featured hole pull quote: featuredHole.description ONLY.
  // Never pointOfView, never contentParagraphs already used above.
  // Falls back to contentParagraphs[2] which is distinct from para1/para2.
  // If nothing available, render nothing.
  const holeQuote = course.featuredHole?.description || course.contentParagraphs?.[2] || "";
  const teeData = course.teeData || [];
  const maxYardage = teeData.length ? Math.max(...teeData.map(t => t.yardage)) : 0;

  const cssVars = {
    "--white": "#fff", "--cream": "#faf8f5", "--bone": "#eee9e2", "--sand": "#d4cfc6",
    "--stone": "#8a857c", "--charcoal": "#3a3832", "--ink": "#111111",
    "--gold": "#C9A24D", "--gold-glow": "#D4B76A",
    "--serif": "var(--font-jakarta), system-ui, sans-serif",
    "--sans": "var(--font-jakarta), system-ui, sans-serif",
  } as React.CSSProperties;

  return (
    <div style={{ ...cssVars, fontFamily: "var(--sans)", background: "var(--white)", color: "var(--ink)", overflowX: "hidden" }}>

      {/* ═══ 1. HERO — DESIRE ═══
          First image must trigger aspiration: "I want to be on that fairway." */}
      <section style={{ position: "relative", minHeight: 650, overflow: "hidden", background: "#0a0a08" }} className="flex flex-col lg:h-screen">
        <div className="relative w-full h-[70vh] lg:h-full">
          <div style={{ position: "absolute", inset: 0 }}>
            {course.heroImage && <Image src={course.heroImage} alt={`${course.name} golf course — ${course.regionLabel}`} fill priority {...bp(course.heroImage)} className="object-cover" sizes="100vw" style={{ opacity: .55, transform: "scale(1.08)", animation: "heroZoom 20s ease forwards" }} />}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.28) 0%,transparent 38%,transparent 52%,rgba(0,0,0,.72) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(24px,5vw,80px) clamp(28px,6vh,80px)" }}>
            <R>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "rgba(201,162,77,.9)", fontWeight: 600, marginBottom: 12 }}>{course.regionLabel}</div>
              <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(34px,7vw,96px)", lineHeight: .9, color: "#fff", letterSpacing: "-.03em" }}>
                {nameParts.slice(0, -2).join(" ") || firstName}<br />
                <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.7)" }}>{nameParts.slice(-2).join(" ")}</em>
              </h1>
            </R>
            <R delay={0.1}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, fontSize: 12, color: "rgba(255,255,255,.8)", fontWeight: 400 }}>
                {course.designer && <><span>{course.designer}</span><span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.8)" }} /></>}
                {course.yearBuilt && <><span>Est. {course.yearBuilt}</span><span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.8)" }} /></>}
                {course.holes && <span>{course.holes} Holes</span>}
              </div>
            </R>
            <R delay={0.22}>
              <div style={{ display: "flex", gap: "clamp(20px,3vw,44px)", marginTop: "clamp(18px,3vh,32px)", paddingTop: "clamp(14px,2vh,22px)", borderTop: "1px solid rgba(255,255,255,.08)", flexWrap: "wrap" }}>
                {[
                  course.par && { v: course.par, l: "Par" },
                  course.yardage && { v: course.yardage.toLocaleString(), l: "Yards" },
                  course.slope && { v: course.slope, l: "Slope" },
                  course.courseRating && { v: course.courseRating, l: "Rating" },
                  course.rating && { v: `${course.rating.value}★`, l: `${course.rating.count} Reviews` },
                ].filter(Boolean).map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px,2.8vw,40px)", fontWeight: 400, color: "#fff", lineHeight: 1 }}>{(s as { v: string | number }).v}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", letterSpacing: 2.5, textTransform: "uppercase", marginTop: 5 }}>{(s as { l: string }).l}</div>
                  </div>
                ))}
              </div>
            </R>
          </div>
          {/* FOMO pulse — scarcity nudge embedded in desire moment */}
          <R delay={0.35}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 100, border: "1px solid rgba(201,162,77,.18)", background: "rgba(0,0,0,.35)", backdropFilter: "blur(12px)", marginTop: 22, fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 400 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e74c3c", flexShrink: 0, animation: "euroP 1.8s infinite" }} />
              Peak-season tee times book 30+ days out — weekend slots go fast
            </div>
          </R>
          <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full z-[3]">
            <HeroTripSlider slug={course.slug} type="course" />
          </div>
        </div>
      </section>

      {/* ═══ 2. AUTHORITY STRIP — TRUST ═══
          Real credentials create instant authority.
          Psychology: "This course earns its reputation. These are people who know golf." */}
      {(() => {
        const d = course.designer?.toLowerCase() || "";
        const isNicklaus = d.includes("nicklaus");
        const isPalmer = d.includes("palmer");
        const isJones = d.includes("jones");
        const isFazio = d.includes("fazio");
        const isCrenshaw = d.includes("crenshaw");
        const isNelson = d.includes("nelson");
        const isFamous = isNicklaus || isPalmer || isJones || isFazio || isCrenshaw || isNelson;
        const slope = course.slope || (course.teeData?.length ? Math.max(...course.teeData.map(t => t.slope)) : 0);
        const diffTier = slope >= 140 ? { label: "Extremely Difficult", color: "#c0392b" } : slope >= 130 ? { label: "Challenging", color: "#e67e22" } : slope >= 120 ? { label: "Moderate–Difficult", color: "#C9A24D" } : { label: "Moderate", color: "#2d6a4f" };
        const badges = [
          isFamous ? { main: course.designer!, sub: "Signature Design" } : { main: "Championship Layout", sub: `${course.regionLabel} Region` },
          course.yearBuilt ? { main: `Est. ${course.yearBuilt}`, sub: "Years of Excellence" } : null,
          { main: "Group Packages", sub: "8–100+ Golfers" },
          { main: "High Sierra Setting", sub: "Mountain Golf" },
        ].filter(Boolean) as { main: string; sub: string }[];
        return (
          <div style={{ background: "var(--cream)", borderBottom: "1px solid var(--bone)", padding: "0 clamp(24px,5vw,80px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(20px,3.5vw,48px)", overflowX: "auto", padding: "16px 0", flexWrap: "nowrap", msOverflowStyle: "none", scrollbarWidth: "none" }}>
              {badges.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {i > 0 && <div style={{ width: 1, height: 28, background: "var(--bone)", flexShrink: 0 }} />}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--charcoal)", whiteSpace: "nowrap", letterSpacing: "-.01em" }}>{item.main}</div>
                    <div style={{ fontSize: 11, color: i === 1 && slope ? diffTier.color : "var(--stone)", letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap", fontWeight: i === 1 && slope ? 600 : 400 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* hack banner */}
      {course.hack && (
        <div style={{ background: "var(--gold)", padding: "clamp(14px,2vh,20px) clamp(24px,5vw,80px)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(15px,1.8vw,21px)", fontWeight: 600, fontStyle: "italic", color: "#fff", margin: 0 }}>&ldquo;{course.hack}&rdquo;</p>
        </div>
      )}

      {/* ═══ 3. TWO-COLUMN MAGAZINE — QUOTE + FACTS ═══
          Psychology: Quote creates desire. Facts give the brain permission to act.
          Left = emotion. Right = rational confirmation. Both in one glance.
          Only shown when we have a distinct pointOfView or featuredHole description. */}
      {quoteText && (
      <section style={{ background: "var(--white)", display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--bone)", borderBottom: "1px solid var(--bone)" }} className="max-md:!grid-cols-1">
        {/* LEFT — Insider perspective quote */}
        <div style={{ padding: "clamp(44px,7vh,80px) clamp(32px,5vw,72px)", background: "var(--cream)", borderRight: "1px solid var(--bone)", position: "relative", overflow: "hidden" }} className="max-md:!border-r-0 max-md:!border-b max-md:!border-bone">
          <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(80px,10vw,130px)", fontWeight: 400, color: "rgba(201,162,77,.07)", lineHeight: ".5", position: "absolute", top: 28, left: 24, userSelect: "none", pointerEvents: "none" }}>&ldquo;</div>
          <R>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: 18 }}>Course Perspective</div>
            <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(15px,1.4vw,19px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.78, color: "var(--charcoal)", letterSpacing: "-.01em" }}>
              &ldquo;{quoteText}&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
              <div style={{ width: 28, height: 1, background: "var(--gold)" }} />
              <div style={{ fontSize: 10, color: "var(--stone)", letterSpacing: 2, textTransform: "uppercase" }}>Golf the High Sierra &nbsp;·&nbsp; {course.regionLabel}</div>
            </div>
          </R>
        </div>
        {/* RIGHT — Course quick-facts */}
        <div style={{ padding: "clamp(44px,7vh,80px) clamp(32px,5vw,72px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 600, marginBottom: 20 }}>At a Glance</div>
          </R>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              course.designer ? { label: "Designer", val: course.designer } : null,
              course.yearBuilt ? { label: "Established", val: course.yearBuilt.toString() } : null,
              course.priceRange ? { label: "Packages From", val: course.priceRange.split("–")[0] + "/golfer" } : null,
              { label: "Group Size", val: "8–100+ Golfers" },
              course.address?.addressLocality ? { label: "Location", val: `${course.address.addressLocality}, ${course.address.addressRegion}` } : null,
            ].filter(Boolean).map((fact, i) => (
              <R key={i} delay={0.06 + i * 0.05}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "13px 0", borderBottom: "1px solid var(--bone)", ...(i === 0 ? { borderTop: "1px solid var(--bone)" } : {}) }}>
                  <span style={{ fontSize: 11, color: "var(--stone)", fontWeight: 400 }}>{(fact as { label: string }).label}</span>
                  <span style={{ fontSize: 12, color: "var(--charcoal)", fontWeight: 600, textAlign: "right", maxWidth: "58%" }}>{(fact as { val: string }).val}</span>
                </div>
              </R>
            ))}
          </div>
          <R delay={0.4}>
            <div style={{ marginTop: 24 }}>
              {isEmbed ? (
                <a href="https://golfthehighsierra.com/contact-custom-golf-package/" target="_top" style={{ display: "inline-block", padding: "12px 28px", background: "var(--gold)", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>
                  Check Tee Times
                </a>
              ) : (
                <Link href="/contact-custom-golf-package/" style={{ display: "inline-block", padding: "12px 28px", background: "var(--gold)", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }} className="hover:bg-[#D4B76A] transition-colors">
                  Check Tee Times
                </Link>
              )}
            </div>
          </R>
        </div>
      </section>
      )}

      {/* ═══ 4. STORY — EMOTION ═══
          Text + gallery creates the narrative.
          Psychology: "I can picture myself there." */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 580 }} className="max-md:!grid-cols-1">
        <div style={{ padding: "clamp(48px,8vh,96px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>{course.designer || "The Course"}</div></R>
          <R delay={0.08}>
            <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,50px)", lineHeight: 1.08, letterSpacing: "-.02em" }}>
              {nameParts.slice(0, -1).join(" ")} <em style={{ fontStyle: "italic" }}>{nameParts[nameParts.length - 1]}</em>
            </h2>
          </R>
          {para1 && <R delay={0.14}><p style={{ fontSize: 14, lineHeight: 2.0, color: "var(--stone)", fontWeight: 400, maxWidth: 480, marginTop: 18 }}>{para1}</p></R>}
          {para2 && <R delay={0.18}><p style={{ fontSize: 14, lineHeight: 2.0, color: "var(--stone)", fontWeight: 400, maxWidth: 480, marginTop: 12 }}>{para2}</p></R>}
          {!para1 && !para2 && <R delay={0.14}><p style={{ fontSize: 14, lineHeight: 2.0, color: "var(--stone)", fontWeight: 400, maxWidth: 480, marginTop: 18 }}>{course.description.substring(0, 350)}</p></R>}
          <R delay={0.2}><div style={{ width: 40, height: 1, background: "var(--bone)", margin: "22px 0" }} /></R>
          {/* Famous designer authority callout */}
          {(() => {
            const d = course.designer?.toLowerCase() || "";
            const isNicklaus = d.includes("nicklaus");
            const isPalmer = d.includes("palmer");
            const isJones = d.includes("jones");
            const isFazio = d.includes("fazio");
            const isCrenshaw = d.includes("crenshaw");
            if (isNicklaus || isPalmer || isJones || isFazio || isCrenshaw) {
              const designerQuotes: Record<string, string> = {
                nicklaus: "Jack Nicklaus designs reward strategic play — every hole demands thought before power.",
                palmer: "Arnold Palmer's signature style: bold risk-reward holes that feel natural in the Sierra landscape.",
                jones: "A Robert Trent Jones design means dramatic bunkering, elevated greens, and shotmaking challenges at every turn.",
                fazio: "Tom Fazio courses are known for their visual drama and masterful use of natural terrain.",
                crenshaw: "A Ben Crenshaw design celebrates the golden age of golf — classic lines, subtle breaks, and pure challenge.",
              };
              const key = isNicklaus ? "nicklaus" : isPalmer ? "palmer" : isJones ? "jones" : isFazio ? "fazio" : "crenshaw";
              return (
                <R delay={0.22}>
                  <div style={{ padding: "16px 20px", background: "var(--cream)", borderRadius: 10, borderLeft: "3px solid var(--gold)", marginBottom: 20 }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: 6 }}>Signature Design</div>
                    <p style={{ fontSize: 12, lineHeight: 1.8, color: "var(--stone)", fontWeight: 400, margin: 0, fontStyle: "italic" }}>{designerQuotes[key]}</p>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--charcoal)", marginTop: 8 }}>{course.designer}</div>
                  </div>
                </R>
              );
            }
            return null;
          })()}
          {course.facilities && course.facilities.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {course.facilities.slice(0, 3).map((f, i) => (
                <R key={i} delay={0.24 + i * 0.06}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 18, padding: "18px 0", borderBottom: "1px solid var(--bone)", ...(i === 0 ? { borderTop: "1px solid var(--bone)" } : {}) }}>
                    <span style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 400, color: "rgba(201,162,77,.18)", minWidth: 44, lineHeight: .85, marginTop: 3, letterSpacing: "-.03em" }}>0{i + 1}</span>
                    <p style={{ fontSize: 13, color: "var(--charcoal)", lineHeight: 1.75, fontWeight: 400, margin: 0 }}>{f.replace(/^[^–—-]+[–—-]\s*/, "")}</p>
                  </div>
                </R>
              ))}
            </div>
          ) : (
            <R delay={0.24}>
              <div>
                <h3 style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: "clamp(16px,1.8vw,20px)", color: "var(--charcoal)", marginBottom: 8 }}>Group Golf Packages &amp; Tee Times</h3>
                <p style={{ fontSize: 13, lineHeight: 1.9, color: "var(--stone)", fontWeight: 400, maxWidth: 440 }}>From 8 to 100 players — consecutive tee times, rooming lists, comps for organizers. 20+ years of expert group planning.</p>
              </div>
            </R>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, minHeight: 500 }} className="max-md:!min-h-[400px]">
          {displayGallery.slice(0, 3).map((img, i) => {
            const alts = [`${course.name} fairway`, `${course.name} signature hole`, `${course.name} course panoramic`];
            return (
              <div key={i} style={{ overflow: "hidden", position: "relative", minHeight: i === 2 ? 240 : 240, cursor: isEmbed ? "default" : "pointer", ...(i === 2 ? { gridColumn: "span 2" } : {}) }} onClick={() => !isEmbed && setLbIndex(i)}>
                <Image src={img} alt={alts[i] || `${course.name} golf`} fill {...bp(img)} className="object-cover brightness-[.88] hover:brightness-100 hover:scale-[1.07] transition-all duration-[800ms]" sizes="(max-width:900px) 100vw, 50vw" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ 4. FEATURED HOLE — ANTICIPATION ═══
          Specific desire: "I can already see myself on this hole." */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--ink)" }} className="max-md:!grid-cols-1">
        <div style={{ position: "relative", overflow: "hidden", minHeight: 440 }} className="max-md:!min-h-[300px]">
          {displayGallery[1] && <Image src={displayGallery[1]} alt={`${course.name} ${course.featuredHole ? `hole ${course.featuredHole.number}` : "layout"}`} fill {...bp(displayGallery[1])} className="object-cover opacity-55 hover:opacity-70 hover:scale-[1.04] transition-all duration-[10s]" sizes="(max-width:900px) 100vw, 50vw" />}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 55%, rgba(17,17,17,.65) 100%)" }} />
        </div>
        <div style={{ padding: "clamp(48px,8vh,100px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14 }}>{course.featuredHole ? "Signature Hole" : "The Experience"}</div></R>
          <R delay={0.08}>
            <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,50px)", lineHeight: 1.08, letterSpacing: "-.02em", color: "#fff" }}>
              {course.featuredHole
                ? <>Hole {course.featuredHole.number} <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.6)" }}>Par {course.featuredHole.par}</em></>
                : <>{firstName} <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.6)" }}>Experience</em></>}
            </h2>
          </R>
          {course.featuredHole?.yardage && (
            <R delay={0.12}>
              <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
                {[
                  { v: course.featuredHole.yardage, l: "Yards" },
                  { v: `Par ${course.featuredHole.par}`, l: "Difficulty" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center", padding: "10px 18px", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "#fff", fontWeight: 400 }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.75)", letterSpacing: 2, textTransform: "uppercase", marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </R>
          )}
          {holeQuote && (
          <R delay={0.18}>
            <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(17px,2vw,26px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.58, color: "rgba(255,255,255,.55)", marginTop: 22, maxWidth: 440, position: "relative", paddingTop: 28 }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 64, color: "rgba(201,162,77,.16)", lineHeight: ".4", position: "absolute", top: 0, left: 0 }}>&ldquo;</span>
              {holeQuote}
            </div>
          </R>
          )}
          <R delay={0.24}><div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", letterSpacing: 2.5, textTransform: "uppercase", marginTop: 18 }}>— Golf the High Sierra</div></R>
        </div>
      </section>

      {/* ═══ 5. SCORECARD (teeData) — CREDIBILITY ═══
          Real USGA data respects serious golfers.
          Psychology: "They know their stuff. I can trust them." */}
      {teeData.length > 0 && (
        <section style={{ background: "var(--cream)", padding: "clamp(48px,7vh,80px) clamp(24px,5vw,80px)", borderTop: "1px solid var(--bone)", borderBottom: "1px solid var(--bone)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            <div>
              <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 8 }}>USGA Scorecard</div></R>
              <R delay={0.06}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(24px,3vw,42px)", lineHeight: 1.1, color: "var(--ink)" }}>All <em style={{ fontStyle: "italic", color: "var(--stone)" }}>Tee Options</em></h2></R>
            </div>
            <R delay={0.1}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(201,162,77,.3)", background: "rgba(201,162,77,.06)", fontSize: 10, color: "var(--gold)", fontWeight: 600, marginTop: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", animation: "euroP 2s infinite" }} />
                USGA Rated
              </div>
            </R>
          </div>
          <R delay={0.12}>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
                <thead>
                  <tr style={{ background: "var(--ink)" }}>
                    {["Tee Box", "Yards", "Par", "Rating", "Slope", "Difficulty"].map((h, i) => (
                      <th key={i} style={{ textAlign: i === 0 ? "left" : "center", padding: "12px " + (i === 0 ? "20px 12px" : "16px"), fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.8)", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teeData.map((tee, i) => {
                    const isBack = tee.yardage === maxYardage;
                    const color = teeColor(tee.name);
                    const pct = maxYardage ? (tee.yardage / maxYardage) * 100 : 50;
                    const slopeLabel = tee.slope >= 140 ? "Extremely Difficult" : tee.slope >= 130 ? "Challenging" : tee.slope >= 120 ? "Moderate–Difficult" : "Moderate";
                    const slopeColor = tee.slope >= 140 ? "#c0392b" : tee.slope >= 130 ? "#e67e22" : tee.slope >= 120 ? "#C9A24D" : "#2d6a4f";
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid var(--bone)", background: isBack ? "rgba(201,162,77,.04)" : i % 2 === 0 ? "#fff" : "var(--cream)" }}>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <span style={{ width: 14, height: 14, borderRadius: 3, background: color, border: color === "#e8e8e8" ? "1px solid #ccc" : "none", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
                            <span style={{ fontSize: 13, fontWeight: isBack ? 700 : 500, color: "var(--ink)" }}>{tee.name}</span>
                            {isBack && <span style={{ fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", padding: "2px 8px", borderRadius: 100, background: "rgba(201,162,77,.12)", color: "var(--gold)", fontWeight: 700 }}>Championship</span>}
                            {tee.gender === "F" && <span style={{ fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", padding: "2px 8px", borderRadius: 100, background: "rgba(192,57,43,.08)", color: "#c0392b", fontWeight: 600 }}>Ladies</span>}
                          </div>
                        </td>
                        <td style={{ textAlign: "center", fontSize: 14, fontWeight: 700, color: "var(--ink)", padding: "16px" }}>{tee.yardage.toLocaleString()}</td>
                        <td style={{ textAlign: "center", fontSize: 13, fontWeight: 500, color: "var(--charcoal)", padding: "16px" }}>{tee.par}</td>
                        <td style={{ textAlign: "center", padding: "16px" }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--charcoal)" }}>{tee.rating}</div>
                          {tee.ratingF && <div style={{ fontSize: 10, color: "#c0392b", fontWeight: 400, marginTop: 2 }}>L: {tee.ratingF}</div>}
                        </td>
                        <td style={{ textAlign: "center", padding: "16px" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{tee.slope}</div>
                          {tee.slopeF && <div style={{ fontSize: 10, color: "#c0392b", fontWeight: 400, marginTop: 2 }}>L: {tee.slopeF}</div>}
                        </td>
                        <td style={{ padding: "16px 20px 16px 12px", minWidth: 120 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: slopeColor, marginBottom: 5 }}>{slopeLabel}</div>
                          <div style={{ background: "var(--bone)", borderRadius: 100, height: 4 }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${color === "#e8e8e8" ? "#aaa" : color},${color === "#e8e8e8" ? "#ccc" : color}99)`, borderRadius: 100 }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </R>
          <R delay={0.2}>
            <p style={{ fontSize: 11, color: "var(--stone)", marginTop: 14, fontWeight: 400 }}>* All ratings certified by the USGA. Slope 113 = standard difficulty. Higher slope = greater challenge for higher-handicap players.</p>
          </R>
        </section>
      )}

      {/* Legacy hole-by-hole scorecard — only shown if no teeData */}
      {!teeData.length && course.scorecard && (
        <section style={{ background: "var(--cream)", padding: "clamp(48px,7vh,80px) clamp(24px,5vw,80px)", borderTop: "1px solid var(--bone)", borderBottom: "1px solid var(--bone)", overflowX: "auto" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 8 }}>Scorecard</div></R>
          <R delay={0.06}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(24px,3vw,40px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: 24 }}>All <em style={{ fontStyle: "italic", color: "var(--stone)" }}>Tee Options</em></h2></R>
          <R delay={0.1}><div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", fontSize: 11, background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
              <thead>
                <tr style={{ background: "var(--ink)" }}><th style={{ textAlign: "left", padding: "10px 16px", color: "rgba(255,255,255,.8)", fontWeight: 400, letterSpacing: 1, fontSize: 11, textTransform: "uppercase", width: 80 }}>Tee</th>
                {[1,2,3,4,5,6,7,8,9,"OUT",10,11,12,13,14,15,16,17,18,"IN","TOT"].map(h => <th key={h} style={{ textAlign: "center", padding: "10px 4px", color: "rgba(255,255,255,.8)", fontWeight: 400, fontSize: 11, minWidth: h==="OUT"||h==="IN"||h==="TOT"?38:28 }}>{h}</th>)}
                <th style={{ textAlign: "center", padding: "10px 6px", color: "rgba(255,255,255,.8)", fontWeight: 400, fontSize: 9 }}>RTG</th>
                <th style={{ textAlign: "center", padding: "10px 6px", color: "rgba(255,255,255,.8)", fontWeight: 400, fontSize: 9 }}>SLP</th></tr>
                <tr style={{ borderBottom: "1px solid var(--bone)", background: "var(--cream)" }}>
                  <td style={{ padding: "8px 16px", color: "var(--stone)", fontSize: 11, textTransform: "uppercase", fontWeight: 600 }}>Par</td>
                  {course.scorecard.par.slice(0,9).map((p:number,i:number)=><td key={i} style={{ textAlign:"center", padding:"8px 4px", color:"var(--stone)", fontSize:11, fontWeight:500 }}>{p}</td>)}
                  <td style={{ textAlign:"center", padding:"8px 4px", color:"var(--charcoal)", fontSize:11, fontWeight:700 }}>{course.scorecard.par.slice(0,9).reduce((a:number,b:number)=>a+b,0)}</td>
                  {course.scorecard.par.slice(9).map((p:number,i:number)=><td key={i} style={{ textAlign:"center", padding:"8px 4px", color:"var(--stone)", fontSize:11, fontWeight:500 }}>{p}</td>)}
                  <td style={{ textAlign:"center", padding:"8px 4px", color:"var(--charcoal)", fontSize:11, fontWeight:700 }}>{course.scorecard.par.slice(9).reduce((a:number,b:number)=>a+b,0)}</td>
                  <td style={{ textAlign:"center", padding:"8px 4px", color:"var(--charcoal)", fontSize:11, fontWeight:700 }}>{course.scorecard.par.reduce((a:number,b:number)=>a+b,0)}</td>
                  <td/><td/>
                </tr>
              </thead>
              <tbody>
                {course.scorecard.tees.map((tee:{name:string;color:string;rating:number;slope:number;holes:number[];total:number},i:number)=>{
                  const front=tee.holes.slice(0,9).reduce((a,b)=>a+b,0); const back=tee.holes.slice(9).reduce((a,b)=>a+b,0); const isGold=tee.name==="Gold";
                  return(<tr key={i} style={{ borderBottom:"1px solid var(--bone)", background: isGold ? "rgba(201,162,77,.04)" : i % 2 === 0 ? "#fff" : "var(--cream)" }}>
                    <td style={{ padding:"11px 16px" }}><div style={{ display:"flex", alignItems:"center", gap:7 }}><span style={{ width:12,height:12,borderRadius:2,background:tee.color,border:tee.color==="#FFFFFF"?"1px solid #ccc":"none",flexShrink:0,boxShadow:"0 1px 2px rgba(0,0,0,.1)" }}/><span style={{ fontWeight:isGold?700:500, color:isGold?"var(--gold)":"var(--ink)", fontSize:12 }}>{tee.name}</span></div></td>
                    {tee.holes.slice(0,9).map((y,j)=><td key={j} style={{ textAlign:"center",padding:"11px 5px",color:"var(--charcoal)",fontSize:12 }}>{y}</td>)}
                    <td style={{ textAlign:"center",padding:"11px 4px",color:isGold?"var(--gold)":"var(--charcoal)",fontWeight:700,fontSize:11 }}>{front}</td>
                    {tee.holes.slice(9).map((y,j)=><td key={j} style={{ textAlign:"center",padding:"11px 5px",color:"var(--charcoal)",fontSize:12 }}>{y}</td>)}
                    <td style={{ textAlign:"center",padding:"11px 4px",color:isGold?"var(--gold)":"var(--charcoal)",fontWeight:700,fontSize:11 }}>{back}</td>
                    <td style={{ textAlign:"center",padding:"11px 4px",color:isGold?"var(--gold)":"var(--ink)",fontWeight:700,fontSize:12 }}>{tee.total.toLocaleString()}</td>
                    <td style={{ textAlign:"center",padding:"11px 6px",color:"var(--stone)",fontSize:11 }}>{tee.rating}</td>
                    <td style={{ textAlign:"center",padding:"11px 6px",color:"var(--stone)",fontSize:11 }}>{tee.slope}</td>
                  </tr>);
                })}
              </tbody>
            </table>
          </div></R>
        </section>
      )}

      {/* ═══ COURSE MAP ═══ */}
      {course.courseMapImage && (
        <section style={{ background: "var(--white)", padding: "clamp(48px,7vh,80px) clamp(24px,5vw,80px)", borderTop: "1px solid var(--bone)", borderBottom: "1px solid var(--bone)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 8 }}>Course Layout</div></R>
          <R delay={0.06}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(24px,3vw,42px)", lineHeight: 1.1, color: "var(--ink)", marginBottom: 24 }}>The <em style={{ fontStyle: "italic", color: "var(--stone)" }}>Course Map</em></h2></R>
          <R delay={0.1}>
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--bone)", boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.courseMapImage}
                alt={`${course.name} course map layout`}
                style={{ width: "100%", height: "auto", display: "block" }}
                loading="lazy"
              />
            </div>
          </R>
        </section>
      )}

      {/* ═══ 8. FOMO BLOCK — FULL URGENCY MOMENT ═══
          Psychology: A decisive moment, not a thin strip. Gut punch, not a nudge.
          "I have been thinking about this long enough. Act now." */}
      <section style={{ background: "linear-gradient(135deg,#1a1208 0%,#0f0f0e 100%)", padding: "clamp(36px,5vh,64px) clamp(24px,5vw,80px)", borderTop: "1px solid rgba(201,162,77,.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <R>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e74c3c", animation: "euroP 1.8s infinite", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "clamp(14px,1.8vw,20px)", color: "#fff", fontWeight: 600, fontFamily: "var(--serif)", letterSpacing: "-.01em" }}>Peak season tee times fill fast</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", fontWeight: 400, marginTop: 3 }}>Weekend and summer slots book 30+ days in advance — secure your dates now</div>
              </div>
            </div>
          </R>
          <R delay={0.1}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {isEmbed ? (
                <a href="https://golfthehighsierra.com/contact-custom-golf-package/" target="_top" style={{ display: "inline-block", padding: "13px 32px", background: "var(--gold)", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }}>Check Availability</a>
              ) : (
                <Link href="/contact-custom-golf-package/" style={{ display: "inline-block", padding: "13px 32px", background: "var(--gold)", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }} className="hover:bg-[#D4B76A] transition-colors">Check Availability</Link>
              )}
              <a href="tel:+18885848232" style={{ display: "inline-block", padding: "13px 24px", border: "1px solid rgba(255,255,255,.55)", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>888-584-8232</a>
            </div>
          </R>
        </div>
      </section>

      {/* ═══ 7. DETAILS — RATIONAL CONFIRMATION ═══
          Stats + distances + FAQ.
          Psychology: "My brain needs to justify what my gut already decided." */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="max-md:!grid-cols-1">
        <div style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--cream)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>At a Glance</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}><em style={{ fontStyle: "italic" }}>{firstName}</em> Details</h2></R>

          {/* Animated stat counters */}
          <R delay={0.14}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, margin: "24px 0" }}>
              {[
                course.holes && { v: course.holes, l: "Holes" },
                course.par && { v: course.par, l: "Par" },
                course.yardage && { v: course.yardage, l: "Yards" },
              ].filter(Boolean).map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "16px 8px", border: "1px solid var(--bone)", borderRadius: 10, background: "var(--white)" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 400, color: "var(--charcoal)" }}>
                    <Counter to={(s as { v: number }).v} />
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--stone)", marginTop: 4, fontWeight: 500 }}>{(s as { l: string }).l}</div>
                </div>
              ))}
            </div>
          </R>

          {/* Difficulty bars */}
          {(course.slope || course.courseRating) && (
            <R delay={0.2}>
              <div style={{ marginBottom: 20 }}>
                {course.slope && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: "var(--stone)" }}>
                      <span>Slope Rating</span><span style={{ fontWeight: 600, color: "var(--charcoal)" }}>{course.slope}</span>
                    </div>
                    <div style={{ background: "var(--bone)", borderRadius: 100, height: 5 }}>
                      <div style={{ width: `${Math.min(((course.slope - 55) / 100) * 100, 100)}%`, height: "100%", background: "linear-gradient(90deg,#C9A24D,#e8c470)", borderRadius: 100 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 11, color: "var(--stone)", fontWeight: 500 }}><span>55 Easy</span><span>155 Hard</span></div>
                  </div>
                )}
                {course.courseRating && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: "var(--stone)" }}>
                      <span>Course Rating</span><span style={{ fontWeight: 600, color: "var(--charcoal)" }}>{course.courseRating}</span>
                    </div>
                    <div style={{ background: "var(--bone)", borderRadius: 100, height: 5 }}>
                      <div style={{ width: `${Math.min(((course.courseRating - 60) / 22) * 100, 100)}%`, height: "100%", background: "linear-gradient(90deg,#2d6a4f,#40916c)", borderRadius: 100 }} />
                    </div>
                  </div>
                )}
              </div>
            </R>
          )}

          {/* Distances */}
          {distances.length > 0 && (
            <R delay={0.26}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginTop: 24, marginBottom: 10 }}>Distances</div>
              {distances.slice(0, 5).map((d, i) => {
                const mins = d.match(/^(\d+)\s*[Mm]in/)?.[1];
                const place = d.replace(/^\d+\s*(minutes?|mins?)\s*(from\s*)?[-–—]?\s*/i, "").replace(/\s*[-–—]\s*\(.*?\)/, "").trim();
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--bone)", fontSize: 12, fontWeight: 400 }}>
                    <span style={{ color: "var(--charcoal)" }}>{place || d}</span>
                    {mins && <span style={{ color: "var(--gold)", fontWeight: 600, fontSize: 11 }}>{mins} min</span>}
                  </div>
                );
              })}
            </R>
          )}

          {addr?.streetAddress && (
            <R delay={0.32}><p style={{ fontSize: 11, color: "var(--stone)", marginTop: 20, fontWeight: 400, lineHeight: 1.6 }}>
              {addr.streetAddress}, {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}
              {course.phone && <><br /><a href={`tel:${course.phone}`} style={{ color: "var(--gold)" }}>{course.phone}</a></>}
            </p></R>
          )}
        </div>

        <div style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--white)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>FAQ</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 24 }}>Common <em style={{ fontStyle: "italic" }}>Questions</em></h2></R>
          {course.faqs.slice(0, 6).map((f, i) => (
            <R key={i} delay={0.12 + i * 0.04}><FAQ q={f.question} a={f.answer} /></R>
          ))}
          {course.teeTips && course.teeTips.length > 0 && (
            <R delay={0.4}>
              <div style={{ marginTop: 28, padding: "18px 20px", background: "var(--cream)", borderRadius: 10, borderLeft: "3px solid var(--gold)" }}>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: 8 }}>Insider Tip</div>
                <p style={{ fontSize: 12, lineHeight: 1.8, color: "var(--stone)", fontWeight: 400, margin: 0 }}>{course.teeTips[0]}</p>
              </div>
            </R>
          )}
        </div>
      </section>

      {/* ═══ 10. LIFESTYLE MOSAIC — "AFTER YOUR ROUND" ═══
          Psychology: Expands identity from "golf trip" to "full luxury experience."
          Experiences + dining woven in = visitor buys a lifestyle, not just tee times.
          This is what justifies the spend to skeptical spouses and CFOs. */}
      {(() => {
        type RegionExp = { icon: string; label: string; desc: string; img: string };
        const regionExperiences: Record<string, RegionExp[]> = {
          reno: [
            { icon: "🎰", label: "Casino Entertainment", desc: "Atlantis, Peppermill, and Grand Sierra — world-class gaming and live shows", img: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=600&q=80" },
            { icon: "🍽️", label: "Award-Winning Dining", desc: "Atlantis Steakhouse, Beaujolais Bistro, The Kitchen — Reno's finest tables", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
            { icon: "🧖", label: "Spa & Wellness", desc: "Spa Atlantis Forbes Four-Star, Willow Springs Spa — post-round recovery", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80" },
            { icon: "🏔️", label: "Sierra Adventure", desc: "Lake Tahoe 45 min away — beaches, hiking, and mountain scenery", img: "https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?w=600&q=80" },
          ],
          "south-lake-tahoe": [
            { icon: "⛵", label: "Lake Tahoe", desc: "The clearest lake in North America — boating, kayaking, and beaches", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" },
            { icon: "🍽️", label: "South Shore Dining", desc: "Edgewood Restaurant, Nepheles, and lakefront tables with Sierra views", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
            { icon: "🎰", label: "Stateline Casinos", desc: "Harrah's, MontBleu, and Harvey's — entertainment steps from the lake", img: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=600&q=80" },
            { icon: "🧖", label: "Spa & Recovery", desc: "Award-winning resort spas to recharge between rounds", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80" },
          ],
          "north-lake-tahoe": [
            { icon: "⛷️", label: "Year-Round Adventure", desc: "Northstar, Palisades, and Sugar Bowl — skiing, biking, and hiking trails", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80" },
            { icon: "🍽️", label: "Truckee Dining", desc: "Moody's Bistro, Pianeta, and farm-to-table restaurants in historic Truckee", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
            { icon: "⛵", label: "Tahoe Waterfront", desc: "Sand Harbor, Kings Beach, and Crystal Bay — the lake at its most beautiful", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" },
            { icon: "🏔️", label: "Sierra Peaks", desc: "Summit hikes, mountain biking, and panoramic Sierra Nevada views", img: "https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?w=600&q=80" },
          ],
          graeagle: [
            { icon: "🌲", label: "Plumas County Forests", desc: "Gold Lake Basin, Bucks Lake, and miles of untouched Sierra wilderness", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80" },
            { icon: "🎣", label: "Fly Fishing", desc: "The Feather River — world-class trout fishing between rounds", img: "https://images.unsplash.com/photo-1518399681705-1c1a55e5e883?w=600&q=80" },
            { icon: "🍽️", label: "Mountain Dining", desc: "Graeagle Meadows Restaurant and local ranch-style fare", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
            { icon: "🏔️", label: "Feather River Canyon", desc: "Dramatic canyon scenery, historic towns, and pure Sierra air", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80" },
          ],
          "carson-valley": [
            { icon: "🐎", label: "Nevada Ranch Life", desc: "Genoa — Nevada's oldest town, working ranches and western heritage", img: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80" },
            { icon: "🏔️", label: "Sierra Foothills", desc: "Dramatic views of the Carson Range with easy access to Lake Tahoe", img: "https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?w=600&q=80" },
            { icon: "🍽️", label: "Local Dining", desc: "The Overland Restaurant and Carson Valley's farm-to-table scene", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
            { icon: "🎰", label: "Carson City", desc: "Nevada's capital — casinos, the State Museum, and historic district", img: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=600&q=80" },
          ],
        };
        const regionKey = course.region?.toLowerCase().replace(/\s+/g, "-") || "reno";
        const experiences = regionExperiences[regionKey] || regionExperiences.reno;
        return (
          <section style={{ background: "var(--ink)", padding: "clamp(64px,10vh,120px) clamp(24px,5vw,80px)" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 16 }}>Beyond the Fairway</div></R>
              <R delay={0.06}>
                <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(26px,3.5vw,50px)", lineHeight: 1.05, color: "#fff", marginBottom: 12 }}>
                  After Your Round on <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.75)" }}>{firstName}</em>
                </h2>
              </R>
              <R delay={0.1}><p style={{ fontSize: 14, color: "rgba(255,255,255,.7)", maxWidth: 540, lineHeight: 1.85, fontWeight: 400, marginBottom: 36 }}>
                The {course.regionLabel} delivers more than championship golf. World-class dining, adventure, and Sierra Nevada luxury fill every hour between tee times.
              </p></R>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="max-md:!grid-cols-2 max-sm:!grid-cols-1">
                {experiences.map((item, i) => (
                  <R key={i} delay={0.14 + i * 0.07}>
                    <div style={{ borderRadius: 14, overflow: "hidden", position: "relative", height: 360 }} className="group cursor-pointer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.img} alt={item.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.5)", transition: "transform .9s cubic-bezier(.16,1,.3,1)" }} className="group-hover:scale-105 group-hover:!brightness-[.65] transition-all duration-[900ms]" />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 35%,rgba(0,0,0,.9) 100%)" }} />
                      <div style={{ position: "absolute", top: 14, left: 14, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.07)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{item.icon}</div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 16px" }}>
                        <div style={{ fontSize: 14, fontFamily: "var(--serif)", fontWeight: 400, color: "#fff", marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,.65)", lineHeight: 1.5, fontWeight: 400 }}>{item.desc}</div>
                      </div>
                    </div>
                  </R>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* WHERE TO STAY */}
      {relatedHotels.length > 0 && (
        <section style={{ padding: "clamp(48px,7vh,80px) clamp(32px,7vw,120px)", background: "var(--white)", borderTop: "1px solid var(--bone)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Stay &amp; Play</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(26px,3vw,44px)", lineHeight: 1.1, marginBottom: 8 }}>Where to Stay Near <em style={{ fontStyle: "italic" }}>{course.name}</em></h2></R>
          <R delay={0.1}><p style={{ color: "var(--stone)", fontSize: 13, marginBottom: 28, maxWidth: 560, lineHeight: 1.8 }}>Most groups who play {firstName} stay at one of these properties. All include golf package rates when booked through Golf the High Sierra.</p></R>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="max-md:!grid-cols-1">
            {relatedHotels.map((rh, i) => (
              <R key={rh.slug} delay={0.12 + i * 0.06}>
                {isEmbed ? (
                  <a href={`https://golfthehighsierra.com/portfolio/${rh.slug}/`} target="_top" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--cream)", transition: "all .45s" }} className="hover:!border-transparent hover:!shadow-[0_16px_48px_rgba(0,0,0,.07)] hover:-translate-y-1">
                      <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                        {rh.heroImage ? <Image src={rh.heroImage} alt={rh.name} fill className="object-cover brightness-[.9] hover:brightness-100 hover:scale-[1.05] transition-all duration-700" sizes="(max-width:768px) 100vw, 33vw" /> : <div style={{ width: "100%", height: "100%", background: "var(--bone)" }} />}
                        {rh.driveMinutes && <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", color: "#fff", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{rh.driveMinutes} min away</span>}
                      </div>
                      <div style={{ padding: 16 }}>
                        <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, color: "var(--ink)" }}>{rh.name}</div>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--stone)", margin: "4px 0 12px" }}>{rh.regionLabel}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--bone)" }}>
                          {rh.rating && <span style={{ fontSize: 10, color: "var(--stone)" }}>★ {rh.rating.value}</span>}
                          <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View Hotel →</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link href={`/portfolio/${rh.slug}/`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--cream)", transition: "all .45s" }} className="hover:!border-transparent hover:!shadow-[0_16px_48px_rgba(0,0,0,.07)] hover:-translate-y-1">
                      <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                        {rh.heroImage ? <Image src={rh.heroImage} alt={rh.name} fill {...bp(rh.heroImage)} className="object-cover brightness-[.9] hover:brightness-100 hover:scale-[1.05] transition-all duration-700" sizes="(max-width:768px) 100vw, 33vw" /> : <div style={{ width: "100%", height: "100%", background: "var(--bone)" }} />}
                        {rh.driveMinutes && <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", color: "#fff", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{rh.driveMinutes} min away</span>}
                      </div>
                      <div style={{ padding: 16 }}>
                        <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, color: "var(--ink)" }}>{rh.name}</div>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--stone)", margin: "4px 0 12px" }}>{rh.regionLabel}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--bone)" }}>
                          {rh.rating && <span style={{ fontSize: 10, color: "var(--stone)" }}>★ {rh.rating.value}</span>}
                          <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View Hotel →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </R>
            ))}
          </div>
        </section>
      )}

      {/* RELATED COURSES */}
      {relatedCourses.length > 0 && (
        <section style={{ padding: "clamp(48px,7vh,80px) clamp(32px,7vw,120px)", background: "var(--cream)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Nearby</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}>More in <em style={{ fontStyle: "italic" }}>{course.regionLabel}</em></h2></R>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 24 }} className="max-md:!grid-cols-1">
            {relatedCourses.map((rc, i) => (
              <R key={rc.slug} delay={0.12 + i * 0.06}>
                {isEmbed ? (
                  <a href={`https://golfthehighsierra.com/portfolio/${rc.slug}/`} target="_top" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--white)", transition: "all .45s" }} className="hover:!border-transparent hover:!shadow-[0_16px_48px_rgba(0,0,0,.07)] hover:-translate-y-1">
                      <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                        {rc.heroImage ? <Image src={rc.heroImage} alt={rc.name} fill {...bp(rc.heroImage)} className="object-cover brightness-[.9] hover:brightness-100 hover:scale-[1.05] transition-all duration-700" sizes="(max-width:768px) 100vw, 33vw" /> : <div style={{ width: "100%", height: "100%", background: "var(--bone)" }} />}
                        {rc.priceRange && <span style={{ position: "absolute", top: 10, right: 10, background: "var(--ink)", color: "#fff", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{rc.priceRange}</span>}
                      </div>
                      <div style={{ padding: 16 }}>
                        <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, color: "var(--ink)" }}>{rc.name}</div>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--stone)", margin: "4px 0 12px" }}>{rc.regionLabel}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--bone)" }}>
                          {rc.rating && <span style={{ fontSize: 10, color: "var(--stone)" }}>★ {rc.rating.value}</span>}
                          <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View →</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link href={`/portfolio/${rc.slug}/`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--white)", transition: "all .45s" }} className="hover:!border-transparent hover:!shadow-[0_16px_48px_rgba(0,0,0,.07)] hover:-translate-y-1">
                      <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                        {rc.heroImage ? <Image src={rc.heroImage} alt={rc.name} fill {...bp(rc.heroImage)} className="object-cover brightness-[.9] hover:brightness-100 hover:scale-[1.05] transition-all duration-700" sizes="(max-width:768px) 100vw, 33vw" /> : <div style={{ width: "100%", height: "100%", background: "var(--bone)" }} />}
                        {rc.priceRange && <span style={{ position: "absolute", top: 10, right: 10, background: "var(--ink)", color: "#fff", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{rc.priceRange}</span>}
                      </div>
                      <div style={{ padding: 16 }}>
                        <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, color: "var(--ink)" }}>{rc.name}</div>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--stone)", margin: "4px 0 12px" }}>{rc.regionLabel}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--bone)" }}>
                          {rc.rating && <span style={{ fontSize: 10, color: "var(--stone)" }}>★ {rc.rating.value}</span>}
                          <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </R>
            ))}
          </div>
        </section>
      )}

      {/* ═══ 11. CINEMATIC TESTIMONIALS — SOCIAL PROOF ═══
          Dark moody setting creates emotional weight.
          Psychology: "People exactly like me went, loved it, came back. I need to go." */}
      {course.testimonials && course.testimonials.length > 0 && (
        <section style={{ background: "#080808", padding: "clamp(64px,10vh,120px) clamp(24px,5vw,80px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 25% 50%,rgba(201,162,77,.03),transparent 55%)" }} />
          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14 }}>Golfer Reviews</div></R>
            <R delay={0.06}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(24px,3vw,42px)", lineHeight: 1.08, color: "#fff", marginBottom: 36 }}>
              What Golfers Say About <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.75)" }}>{firstName}</em>
            </h2></R>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
              {course.testimonials.map((t, i) => (
                <R key={i} delay={0.1 + i * 0.07}>
                  <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.055)", borderRadius: 16, padding: "26px 24px 20px" }}>
                    <div style={{ color: "#C9A24D", fontSize: 12, marginBottom: 14, letterSpacing: 3 }}>{"★".repeat(t.stars)}{"☆".repeat(Math.max(0, 5 - t.stars))}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.82, color: "rgba(255,255,255,.58)", margin: "0 0 18px", fontStyle: "italic", fontFamily: "var(--serif)", fontWeight: 400 }}>&ldquo;{t.quote}&rdquo;</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.04)" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(201,162,77,.1)", border: "1px solid rgba(201,162,77,.12)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{t.author[0]}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.72)" }}>{t.author}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", marginTop: 2 }}>{t.meta}</div>
                      </div>
                      <span style={{ marginLeft: "auto", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,.6)", fontWeight: 500 }}>{t.source}</span>
                    </div>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ 9. CTA — ACTION ═══
          After all the above, the decision is already made.
          Make the action simple, non-threatening, and desirable. */}
      <section style={{ background: "var(--ink)", textAlign: "center", padding: "clamp(64px,10vh,120px) clamp(32px,7vw,120px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(201,162,77,.06), transparent 70%)" }} />
        <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14, position: "relative", zIndex: 1 }}>Book {firstName}</div></R>
        <R delay={0.08}>
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,52px)", lineHeight: 1.08, color: "#fff", marginBottom: 12, position: "relative", zIndex: 1 }}>
            Play {firstName} <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.8)" }}>With Your Group</em>
          </h2>
        </R>
        <R delay={0.14}>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,.75)", fontWeight: 400, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.85, position: "relative", zIndex: 1 }}>
            {course.priceRange ? `Stay-and-play from ${course.priceRange.split("–")[0]}/golfer. ` : ""}Tee times, lodging, dining — one call does it all.
          </p>
        </R>
        <R delay={0.18}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 100, border: "1px solid rgba(201,162,77,.4)", fontSize: 12, color: "rgba(255,255,255,.75)", marginBottom: 28, position: "relative", zIndex: 1 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#e74c3c", animation: "euroP 1.8s infinite", flexShrink: 0 }} />
            Peak season slots fill 30+ days out
          </div>
        </R>
        <R delay={0.24}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            {isEmbed ? (
              <a href="https://golfthehighsierra.com/contact-custom-golf-package/" target="_top" style={{ display: "inline-block", padding: "16px 40px", background: "var(--gold)", color: "#fff", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none" }} className="hover:!bg-[#D4B76A] hover:-translate-y-0.5 hover:shadow-[0_14px_44px_rgba(201,162,77,.4)]">
                Plan My Trip
              </a>
            ) : (
              <Link href="/contact-custom-golf-package/" style={{ display: "inline-block", padding: "16px 40px", background: "var(--gold)", color: "#fff", borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }} className="hover:!bg-[#D4B76A] hover:-translate-y-0.5 hover:shadow-[0_14px_44px_rgba(201,162,77,.4)]">
                Plan My Trip
              </Link>
            )}
            <a href="tel:+18885848232" style={{ display: "inline-block", padding: "16px 40px", border: "2px solid rgba(255,255,255,.55)", color: "#fff", borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }} className="hover:!border-white hover:!bg-white/10">
              Call 888-584-8232
            </a>
          </div>
        </R>
      </section>

      {lbIndex !== null && !isEmbed && <Lightbox images={displayGallery.length > 0 ? displayGallery : gallery} startIndex={lbIndex} onClose={() => setLbIndex(null)} name={course.name} />}

      <style jsx global>{`
        @keyframes heroZoom { to { transform: scale(1); } }
        @keyframes euroP { 0%,100%{opacity:1} 50%{opacity:.15} }
      `}</style>
    </div>
  );
}
