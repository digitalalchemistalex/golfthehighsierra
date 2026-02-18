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
}

interface RelatedCourse {
  slug: string; name: string; regionLabel: string;
  heroImage?: string; priceRange?: string; rating?: CourseRating;
}

/* ─── Helpers ─── */
function isScorecard(url: string) { return url.toLowerCase().includes("scorecard"); }
function isLogo(url: string) { const l = url.toLowerCase(); return (l.includes("logo") || l.includes("golfball")) && (l.endsWith(".png") || l.endsWith(".webp") || l.endsWith(".svg")); }
function parseDistances(bodyText: string[]): string[] {
  const d: string[] = [];
  for (const b of bodyText) for (const l of b.split("\n")) { const t = l.trim(); if (/^\d+\s*(minutes?|mins?)\s/i.test(t)) d.push(t); }
  return d;
}

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
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(false); }, [idx]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") setIdx(i => (i + 1) % images.length); if (e.key === "ArrowLeft") setIdx(i => (i - 1 + images.length) % images.length); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [images.length, onClose]);
  const absSrc = images[idx]?.startsWith("/") ? `https://golfthehighsierra.vercel.app${images[idx]}` : images[idx];
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <button onClick={onClose} style={{ position: "fixed", top: 16, right: 16, color: "rgba(255,255,255,0.6)", zIndex: 10000, padding: 8, background: "none", border: "none", cursor: "pointer" }}><X className="w-8 h-8" /></button>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }} style={{ position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.6)", zIndex: 10000, padding: 8, background: "none", border: "none", cursor: "pointer" }}><ChevronLeft className="w-10 h-10" /></button>
      <div onClick={e => e.stopPropagation()} style={{ width: "85vw", height: "75vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {!loaded && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, position: "absolute" }}>Loading...</div>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={idx}
          src={absSrc}
          alt={`${name} ${idx + 1}`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: loaded ? "block" : "none" }}
        />
      </div>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} style={{ position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.6)", zIndex: 10000, padding: 8, background: "none", border: "none", cursor: "pointer" }}><ChevronRight className="w-10 h-10" /></button>
      <div style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 4 }}>{idx + 1} / {images.length}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function CoursePageContent({ course, relatedCourses = [], blurs = {} }: { course: CourseProps; relatedCourses?: RelatedCourse[]; blurs?: Record<string, string> }) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const bp = (src: string) => blurs[src] ? { placeholder: "blur" as const, blurDataURL: blurs[src] } : {};

  const gallery = course.images.filter(u => !isScorecard(u) && !isLogo(u));
  // Ensure at least 3 gallery images by falling back to heroImage
  const displayGallery = gallery.length >= 3 ? gallery : [
    ...(course.heroImage ? [course.heroImage] : []),
    ...gallery,
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
  const distances = course.distances?.length ? course.distances : parseDistances(course.bodyText || []);
  const addr = course.address;
  const nameParts = course.name.split(" ");
  const firstName = nameParts[0];
  const para1 = course.contentParagraphs?.[0] || course.description.substring(0, 350);
  const quoteText = course.pointOfView || course.featuredHole?.description || course.description.substring(0, 200);

  const cssVars = {
    "--white": "#fff", "--cream": "#faf8f5", "--bone": "#eee9e2", "--sand": "#d4cfc6",
    "--stone": "#8a857c", "--charcoal": "#3a3832", "--ink": "#111111",
    "--gold": "#C9A24D", "--gold-glow": "#D4B76A",
    "--serif": "var(--font-jakarta), system-ui, sans-serif",
    "--sans": "var(--font-jakarta), system-ui, sans-serif",
  } as React.CSSProperties;

  return (
    <div style={{ ...cssVars, fontFamily: "var(--sans)", background: "var(--white)", color: "var(--ink)", overflowX: "hidden" }}>

      {/* ═══ 1. HERO — Split: Image Left + Caddie Slider Right ═══ */}
      <section style={{ position: "relative", minHeight: 650, overflow: "hidden", background: "#0a0a08" }} className="flex flex-col lg:h-screen">

        {/* ── FULL-WIDTH: Course Image ── */}
        <div className="relative w-full h-[70vh] lg:h-full">
          <div style={{ position: "absolute", inset: 0 }}>
            {course.heroImage && <Image src={course.heroImage} alt={`${course.name} golf course in ${course.regionLabel} — aerial view`} fill priority {...bp(course.heroImage)} className="object-cover" sizes="100vw" style={{ opacity: .55, transform: "scale(1.08)", animation: "heroZoom 20s ease forwards" }} />}
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.25) 0%,transparent 35%,transparent 55%,rgba(0,0,0,.65) 100%)" }} />

          {/* Hero content — course name + stats */}
          <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 clamp(32px,5vw,80px) clamp(48px,8vh,80px)" }}>
            <R>
              <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(42px,7vw,90px)", lineHeight: .92, color: "#fff", letterSpacing: "-.03em" }}>
                {nameParts.slice(0, -2).join(" ") || firstName}<br />
                <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.75)" }}>{nameParts.slice(-2).join(" ")}</em>
              </h1>
            </R>
            <R delay={0.12}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, fontSize: 12, color: "rgba(255,255,255,.6)", fontWeight: 300 }}>
                {course.designer && <><span>{course.designer}</span><span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.75)" }} /></>}
                {course.yearBuilt && <><span>Est. {course.yearBuilt}</span><span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,.75)" }} /></>}
                <span>{course.regionLabel}</span>
              </div>
            </R>
            <R delay={0.24}>
              <div style={{ display: "flex", gap: "clamp(16px,2.5vw,36px)", marginTop: "clamp(16px,3vh,32px)", paddingTop: "clamp(12px,2vh,20px)", borderTop: "1px solid rgba(255,255,255,.07)", flexWrap: "wrap" }}>
                {[
                  course.holes && { v: course.holes, l: "Holes" },
                  course.par && { v: course.par, l: "Par" },
                  course.yardage && { v: course.yardage.toLocaleString(), l: "Yards" },
                  course.slope && { v: course.slope, l: "Slope" },
                  course.rating && { v: course.rating.value, l: "Rating" },
                ].filter(Boolean).map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,2.5vw,34px)", fontWeight: 300, color: "#fff", lineHeight: 1 }}>{(s as {v:string|number}).v}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.75)", letterSpacing: 2.5, textTransform: "uppercase", marginTop: 5 }}>{(s as {l:string}).l}</div>
                  </div>
                ))}
              </div>
            </R>
          </div>

          {/* ── Trips Caddie Slider — overlays right half when trips exist ── */}
          <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full z-[3]">
            <HeroTripSlider slug={course.slug} type="course" />
          </div>
        </div>

      </section>

      {/* ═══ 2. CONTENT — text + gallery ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 600 }} className="max-md:!grid-cols-1">
        <div style={{ padding: "clamp(48px,8vh,100px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>The Course</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, letterSpacing: "-.02em" }}>
            {course.featuredHole?.title ? <>The <em style={{ fontStyle: "italic" }}>{course.featuredHole.title.replace(/^The\s*/i, "")}</em></> : <>Where Mountains Meet <em style={{ fontStyle: "italic" }}>Mastery</em></>}
          </h2></R>
          <R delay={0.16}><p className="course-intro" style={{ fontSize: 13, lineHeight: 1.9, color: "var(--stone)", fontWeight: 300, maxWidth: 440, marginTop: 16 }}>{para1}</p></R>
          <R delay={0.2}><div style={{ width: 40, height: 1, background: "var(--bone)", margin: "20px 0" }} /></R>
          <R delay={0.22}><h3 style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.3, color: "var(--charcoal)", marginBottom: 8 }}>Group Golf Packages &amp; Tee Times</h3></R>
          <R delay={0.24}><p style={{ fontSize: 13, lineHeight: 1.9, color: "var(--stone)", fontWeight: 300, maxWidth: 440 }}>From 8 to 100 players — consecutive tee times, rooming lists, comps for organizers. Buddy trip, corporate outing, or charity tournament. 20+ years of expert group planning.</p></R>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 4 }} className="max-md:!min-h-[400px]">
          {displayGallery.slice(0, 3).map((img, i) => {
            const altDescs = [`${course.name} fairway and green view`, `${course.name} signature hole scenery`, `${course.name} course panoramic landscape`];
            return (
            <div key={i} style={{ overflow: "hidden", position: "relative", cursor: "pointer", ...(i === 2 ? { gridColumn: "span 2" } : {}) }} onClick={() => setLbIndex(i)}>
              <Image src={img} alt={altDescs[i] || `${course.name} golf course photo`} fill {...bp(img)} className="object-cover brightness-[.88] hover:brightness-100 hover:scale-[1.06] transition-all duration-700" sizes="(max-width:900px) 100vw, 50vw" />
            </div>
            );
          })}
        </div>
      </section>

      {/* ═══ 3. DARK FEATURE ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--ink)" }} className="max-md:!grid-cols-1">
        <div style={{ position: "relative", overflow: "hidden", minHeight: 400 }} className="max-md:!min-h-[300px]">
          {displayGallery[1] && <Image src={displayGallery[1]} alt={`${course.name} ${course.featuredHole ? `hole ${course.featuredHole.number} par ${course.featuredHole.par}` : "championship layout"}`} fill {...bp(displayGallery[1])} className="object-cover opacity-60 hover:opacity-75 hover:scale-[1.04] transition-all duration-[8s]" sizes="(max-width:900px) 100vw, 50vw" />}
        </div>
        <div style={{ padding: "clamp(48px,8vh,100px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14 }}>
            {course.featuredHole ? "Signature Hole" : "The Experience"}
          </div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, letterSpacing: "-.02em", color: "#fff" }}>
            {course.featuredHole?.title ? <>{course.featuredHole.title.split(" ").slice(0, -1).join(" ")} <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.7)" }}>{course.featuredHole.title.split(" ").slice(-1)}</em></> : <>Championship <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.7)" }}>Golf</em></>}
          </h2></R>
          {course.featuredHole && <R delay={0.12}><h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,.45)", letterSpacing: 1, marginTop: 8 }}>Hole {course.featuredHole.number} · Par {course.featuredHole.par} · {course.featuredHole.yardage} Yards</h3></R>}
          <R delay={0.16}>
            <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.5, color: "rgba(255,255,255,.6)", marginTop: 16, maxWidth: 440, position: "relative", paddingTop: 28 }}>
              <span style={{ fontFamily: "var(--serif)", fontSize: 60, color: "rgba(201,162,77,.2)", lineHeight: ".5", position: "absolute", top: 0, left: 0 }}>&ldquo;</span>
              {quoteText}
            </div>
          </R>
          <R delay={0.24}><div style={{ fontSize: 10, color: "rgba(255,255,255,.75)", letterSpacing: 2, textTransform: "uppercase", marginTop: 16 }}>— Golf the High Sierra</div></R>
        </div>
      </section>

      {/* ═══ 4. INFO STRIP ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }} className="max-md:!grid-cols-1">
        {/* Left: stats + distances */}
        <div style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--cream)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>At a Glance</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}><em style={{ fontStyle: "italic" }}>{firstName}</em> Details</h2></R>
          {(course.slope || course.courseRating) && <R delay={0.12}><h3 style={{ fontFamily: "var(--sans)", fontWeight: 400, fontSize: 13, color: "var(--stone)", marginTop: 8 }}>
            {[course.slope && `Slope ${course.slope}`, course.courseRating && `Course Rating ${course.courseRating}`].filter(Boolean).join(" · ")}
          </h3></R>}

          {/* Mini stats */}
          <R delay={0.16}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, margin: "24px 0" }}>
              {[
                course.holes && { v: course.holes, l: "Holes" },
                course.par && { v: course.par, l: "Par" },
                course.yardage && { v: course.yardage.toLocaleString(), l: "Yards" },
              ].filter(Boolean).map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "16px 8px", border: "1px solid var(--bone)", borderRadius: 8, background: "var(--white)" }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 300 }}>{(s as {v:string|number}).v}</div>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--stone)", marginTop: 3 }}>{(s as {l:string}).l}</div>
                </div>
              ))}
            </div>
          </R>

          {/* Distances */}
          {distances.length > 0 && (
            <R delay={0.24}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginTop: 24, marginBottom: 8 }}>Distances</div>
              {distances.slice(0, 4).map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--bone)", fontSize: 12, fontWeight: 300 }}>
                  <span style={{ color: "var(--charcoal)" }}>{d.replace(/^\d+\s*(minutes?|mins?)\s*(from\s*)?/i, "")}</span>
                  <span style={{ color: "var(--gold)", fontWeight: 500 }}>{d.match(/^\d+/)?.[0]} min</span>
                </div>
              ))}
            </R>
          )}

          {/* Address */}
          {addr?.streetAddress && (
            <R delay={0.28}>
              <p style={{ fontSize: 11, color: "var(--stone)", marginTop: 20, fontWeight: 300 }}>
                {addr.streetAddress}, {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}
                {course.phone && <><br /><a href={`tel:${course.phone}`} style={{ color: "var(--gold)" }}>{course.phone}</a></>}
              </p>
            </R>
          )}
        </div>

        {/* Right: FAQ */}
        <div className="course-faq" style={{ padding: "clamp(48px,8vh,80px) clamp(32px,5vw,80px)", background: "var(--white)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>FAQ</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 20 }}>Common <em style={{ fontStyle: "italic" }}>Questions</em></h2></R>
          {course.faqs.slice(0, 5).map((f, i) => (
            <R key={i} delay={0.12 + i * 0.04}><FAQ q={f.question} a={f.answer} /></R>
          ))}
        </div>
      </section>

      {/* ═══ RELATED ═══ */}
      {relatedCourses.length > 0 && (
        <section style={{ padding: "clamp(48px,7vh,80px) clamp(32px,7vw,120px)", background: "var(--cream)" }}>
          <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Nearby</div></R>
          <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1 }}>More in <em style={{ fontStyle: "italic" }}>{course.regionLabel}</em></h2></R>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 24 }} className="max-md:!grid-cols-1">
            {relatedCourses.map((rc, i) => (
              <R key={rc.slug} delay={0.12 + i * 0.06}>
                <Link href={`/portfolio/${rc.slug}/`}>
                  <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--white)", transition: "all .5s" }} className="hover:!border-transparent hover:!shadow-[0_16px_48px_rgba(0,0,0,.06)] hover:-translate-y-1">
                    <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                      {rc.heroImage ? <Image src={rc.heroImage} alt={rc.name} fill {...bp(rc.heroImage)} className="object-cover brightness-[.9] hover:brightness-100 hover:scale-[1.05] transition-all duration-600" sizes="(max-width:768px) 100vw, 33vw" /> : <div style={{ width: "100%", height: "100%", background: "var(--bone)" }} />}
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
              </R>
            ))}
          </div>
        </section>
      )}

      {/* ═══ TESTIMONIALS ═══ */}
      {course.testimonials && course.testimonials.length > 0 && (
        <section style={{ background: "#f9f7f2", padding: "clamp(56px,8vh,96px) clamp(24px,5vw,80px)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14, textAlign: "center" }}>Golfer Reviews</div></R>
            <R delay={0.06}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(24px,3vw,36px)", lineHeight: 1.15, color: "var(--ink)", textAlign: "center", marginBottom: 40 }}>What Golfers Say About {firstName}</h2></R>
            <div style={{ display: "grid", gap: 20 }}>
              {course.testimonials.map((t, i) => (
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
        <R><div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14, position: "relative", zIndex: 1 }}>Book {firstName}</div></R>
        <R delay={0.08}><h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, color: "#fff", marginBottom: 12, position: "relative", zIndex: 1 }}>Play {firstName} <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.65)" }}>With Your Group</em></h2></R>
        <R delay={0.16}><p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 300, maxWidth: 380, margin: "0 auto 28px", lineHeight: 1.8, position: "relative", zIndex: 1 }}>
          {course.priceRange ? `Stay-and-play from ${course.priceRange.split("–")[0]}/golfer. ` : ""}Tee times, lodging, dining — one call.
        </p></R>
        <R delay={0.2}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(201,162,77,.12)", fontSize: 10, color: "var(--gold)", fontWeight: 500, marginBottom: 24, letterSpacing: ".5px" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", animation: "euroP 2s infinite" }} />
              Peak season tee times limited
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
      {lbIndex !== null && <Lightbox images={displayGallery.length > 0 ? displayGallery : gallery} startIndex={lbIndex} onClose={() => setLbIndex(null)} name={course.name} />}

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes heroZoom{to{transform:scale(1)}}
        @keyframes sdrop{0%{opacity:0;transform:translateY(-8px)}50%{opacity:1}100%{opacity:0;transform:translateY(8px)}}
        @keyframes euroP{0%,100%{opacity:1}50%{opacity:.2}}
      `}</style>
    </div>
  );
}

