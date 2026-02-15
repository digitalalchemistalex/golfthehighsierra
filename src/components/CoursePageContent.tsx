"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Types ─── */
interface CourseAddress { streetAddress?: string; addressLocality?: string; addressRegion?: string; postalCode?: string; }
interface CourseGeo { latitude?: number; longitude?: number; }
interface CourseRating { value: number; count: number; }
interface CourseFAQ { question: string; answer: string; }
interface FeaturedHole { title?: string; description?: string; }
interface CourseTip { title?: string; content?: string; }

export interface CourseProps {
  slug: string; name: string; region: string; regionLabel: string;
  address?: CourseAddress; geo?: CourseGeo; phone?: string; website?: string;
  priceRange?: string; rating?: CourseRating; description: string;
  holes?: number; par?: number | null; designer?: string;
  yardage?: number; slope?: number; courseRating?: number; yearBuilt?: number;
  heroImage?: string; images: string[]; videoUrl?: string;
  faqs: CourseFAQ[]; meta: { title: string; description: string };
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
function cleanFacilities(f: string[]) {
  const junk = ["trips caddie", "all lake tahoe", "all hotels", "all golf", "all food", "all experiences", "all carson", "all cedar", "all eldorado", "old greenwood", "all atlantis"];
  return f.filter(x => !junk.some(j => x.toLowerCase().includes(j)) && x.trim().length > 3);
}

/* ─── Scroll Reveal ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.1, rootMargin: "-20px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── Animated Counter ─── */
function Counter({ target, comma = false }: { target: number; comma?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1600, start = performance.now();
        const tick = (now: number) => { const p = Math.min((now - start) / dur, 1); setVal(Math.round((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{comma ? val.toLocaleString() : val}</span>;
}

/* ─── FAQ ─── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8e4de" }}>
      <button onClick={() => setOpen(!open)} className="euro-faq-q" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "22px 0", background: "none", border: "none", fontFamily: "var(--euro-sans)", fontSize: "15px", color: "#2c2c2c", cursor: "pointer", textAlign: "left" as const, gap: "16px", fontWeight: 400, transition: "color .3s" }}>
        {q}
        <span style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #e8e4de", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#b0b0b0", transition: "all .4s", flexShrink: 0, ...(open ? { background: "#8b7355", color: "#fff", borderColor: "#8b7355", transform: "rotate(45deg)" } : {}) }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height .5s ease" }}>
        <p style={{ paddingBottom: 22, fontSize: 14, color: "#8c8c8c", lineHeight: 1.8, fontWeight: 300 }}>{a}</p>
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
        <Image src={images[idx]} alt={`${name} ${idx + 1}`} fill className={`object-contain ${isLogo(images[idx]) ? "p-12" : ""}`} sizes="90vw" />
      </div>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} className="absolute right-4 text-white/60 hover:text-white z-10 p-2"><ChevronRight className="w-10 h-10" /></button>
      <div className="absolute bottom-4 text-white/40 text-xs tracking-widest">{idx + 1} / {images.length}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN — EUROPEAN WHITE LUXURY
   ═══════════════════════════════════════════════════════ */
export default function CoursePageContent({ course, relatedCourses = [] }: { course: CourseProps; relatedCourses?: RelatedCourse[] }) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const galleryImages = course.images.filter(u => !isScorecard(u) && !isLogo(u));
  const distances = course.distances?.length ? course.distances : parseDistances(course.bodyText || []);
  const facilities = cleanFacilities(course.facilities || []);
  const addr = course.address;
  const nameParts = course.name.split(" ");
  const firstName = nameParts[0];
  const para1 = course.contentParagraphs?.[0] || course.description.substring(0, 300);
  const para2 = course.contentParagraphs?.[1] || (course.bodyText?.[2] || course.description);

  const stats = [
    course.holes ? { val: course.holes, label: "Holes" } : null,
    course.par ? { val: course.par, label: "Par" } : null,
    course.yardage ? { val: course.yardage, label: "Yards", comma: true } : null,
    course.slope ? { val: course.slope, label: "Slope" } : null,
    course.yearBuilt ? { val: course.yearBuilt, label: "Established" } : null,
  ].filter(Boolean) as { val: number; label: string; comma?: boolean }[];

  const bigNums = [
    course.holes ? { val: course.holes, label: "Holes" } : null,
    course.yardage ? { val: course.yardage, label: "Yards", comma: true } : null,
    course.yearBuilt ? { val: course.yearBuilt, label: "Established" } : null,
    course.rating ? { val: course.rating.count, label: "Reviews", comma: true } : null,
  ].filter(Boolean) as { val: number; label: string; comma?: boolean }[];

  /* ─── CSS Variables ─── */
  const cssVars = {
    "--euro-white": "#ffffff",
    "--euro-ivory": "#faf9f7",
    "--euro-stone": "#f2f0ec",
    "--euro-sand": "#e8e4de",
    "--euro-text": "#2c2c2c",
    "--euro-muted": "#8c8c8c",
    "--euro-light": "#b0b0b0",
    "--euro-accent": "#8b7355",
    "--euro-accent-light": "#a89070",
    "--euro-serif": "'EB Garamond', Georgia, serif",
    "--euro-sans": "'Inter', system-ui, sans-serif",
  } as React.CSSProperties;

  const sectionPad = "clamp(64px,10vh,120px) clamp(32px,6vw,100px)";
  const sectionSmPad = "clamp(48px,7vh,80px) clamp(32px,6vw,100px)";
  const labelStyle: React.CSSProperties = { fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--euro-muted)", fontWeight: 500, marginBottom: 12 };
  const titleStyle: React.CSSProperties = { fontFamily: "var(--euro-serif)", fontWeight: 400, fontSize: "clamp(30px,4vw,52px)", lineHeight: 1.15, letterSpacing: "-.01em", color: "var(--euro-text)" };
  const textStyle: React.CSSProperties = { fontSize: 15, lineHeight: 1.85, color: "var(--euro-muted)", fontWeight: 300, maxWidth: 600, marginTop: 16 };
  const divider = <div style={{ height: 1, background: "var(--euro-sand)" }} />;

  return (
    <div style={{ ...cssVars, fontFamily: "var(--euro-sans)", background: "var(--euro-white)", color: "var(--euro-text)", overflowX: "hidden" }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", height: "85vh", minHeight: 600, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {course.heroImage ? (
            <Image src={course.heroImage} alt={course.name} fill priority className="object-cover" sizes="100vw" />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#2c2c2c" }} />
          )}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.08) 0%,rgba(0,0,0,.02) 40%,rgba(0,0,0,.45) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: `0 clamp(32px,6vw,100px) clamp(48px,8vh,80px)` }}>
          <Reveal>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", letterSpacing: ".5px", marginBottom: 16 }}>
              <Link href="/" style={{ transition: "color .3s" }} className="hover:!text-white/80">Home</Link>
              {" / "}
              <Link href="/best-golf-courses-reno/" className="hover:!text-white/80">Golf Courses</Link>
              {" / "}
              <span>{course.regionLabel}</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 style={{ fontFamily: "var(--euro-serif)", fontWeight: 400, fontSize: "clamp(42px,7vw,80px)", lineHeight: 1.05, color: "#fff", letterSpacing: "-.02em" }}>
              {nameParts.slice(0, -2).join(" ") || firstName}<br />
              <em style={{ fontStyle: "italic" }}>{nameParts.slice(-2).join(" ")}</em>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", letterSpacing: ".3px", marginTop: 12, fontWeight: 300 }}>
              {course.regionLabel}{course.yearBuilt ? ` · Est. ${course.yearBuilt}` : ""}{course.designer ? ` · ${course.designer}` : ""}
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
              {course.holes && <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", border: "1px solid rgba(255,255,255,.12)", padding: "7px 16px", borderRadius: 100, fontWeight: 400, letterSpacing: ".3px" }}>{course.holes} Holes</span>}
              {course.par && <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", border: "1px solid rgba(255,255,255,.12)", padding: "7px 16px", borderRadius: 100, fontWeight: 400, letterSpacing: ".3px" }}>Par {course.par}</span>}
              {course.yardage && <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", border: "1px solid rgba(255,255,255,.12)", padding: "7px 16px", borderRadius: 100, fontWeight: 400, letterSpacing: ".3px" }}>{course.yardage.toLocaleString()} Yards</span>}
              {course.slope && <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", border: "1px solid rgba(255,255,255,.12)", padding: "7px 16px", borderRadius: 100, fontWeight: 400, letterSpacing: ".3px" }}>Slope {course.slope}</span>}
              {course.rating && <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", border: "1px solid rgba(255,255,255,.12)", padding: "7px 16px", borderRadius: 100, fontWeight: 400, letterSpacing: ".3px" }}>★ {course.rating.value}</span>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ STAT BAR ═══ */}
      {stats.length > 0 && (
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length},1fr)`, borderTop: "1px solid var(--euro-sand)", borderBottom: "1px solid var(--euro-sand)" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: "clamp(24px,3vh,40px) 16px", textAlign: "center", borderRight: i < stats.length - 1 ? "1px solid var(--euro-sand)" : "none" }}>
                <div style={{ fontFamily: "var(--euro-serif)", fontSize: "clamp(28px,3vw,42px)", fontWeight: 400, color: "var(--euro-text)" }}>
                  <Counter target={s.val} comma={!!s.comma} />
                </div>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--euro-light)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* ═══ QUOTE ═══ */}
      {course.pointOfView && (
        <section style={{ background: "var(--euro-ivory)", textAlign: "center", padding: "clamp(80px,12vh,140px) clamp(32px,6vw,100px)" }}>
          <Reveal><div style={{ fontFamily: "var(--euro-serif)", fontSize: 80, color: "var(--euro-sand)", lineHeight: 1, marginBottom: -20 }}>&ldquo;</div></Reveal>
          <Reveal delay={0.08}>
            <p style={{ fontFamily: "var(--euro-serif)", fontSize: "clamp(22px,3vw,34px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.55, color: "var(--euro-text)", maxWidth: 750, margin: "0 auto" }}>
              {course.pointOfView}
            </p>
          </Reveal>
          <Reveal delay={0.16}><div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "var(--euro-muted)", marginTop: 24, fontWeight: 500 }}>— Golf the High Sierra</div></Reveal>
        </section>
      )}

      {/* ═══ TWO-COL: Signature / Featured Hole ═══ */}
      {galleryImages[0] && (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="max-md:!grid-cols-1">
          <div style={{ position: "relative", overflow: "hidden", minHeight: 500 }} className="max-md:!min-h-[350px]">
            <Image src={galleryImages[0]} alt={course.featuredHole?.title || "Course feature"} fill className="object-cover hover:scale-[1.03] transition-transform duration-[6s]" sizes="(max-width:900px) 100vw, 50vw" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(40px,6vw,100px)" }}>
            <Reveal><div style={labelStyle}>{course.featuredHole ? "Signature Hole" : "The Course"}</div></Reveal>
            <Reveal delay={0.08}>
              <h2 style={titleStyle}>
                {course.featuredHole?.title ? (
                  <>The <em style={{ fontStyle: "italic" }}>{course.featuredHole.title.replace(/^The\s*/i, "")}</em></>
                ) : (
                  <>An Exceptional <em style={{ fontStyle: "italic" }}>Experience</em></>
                )}
              </h2>
            </Reveal>
            <Reveal delay={0.16}><p style={textStyle}>{course.featuredHole?.description || para1}</p></Reveal>
            {course.yardage && (
              <Reveal delay={0.24}>
                <div style={{ display: "inline-block", marginTop: 24, padding: "16px 24px", border: "1px solid var(--euro-sand)", borderRadius: 12 }}>
                  <div style={{ fontFamily: "var(--euro-serif)", fontSize: 26, color: "var(--euro-accent)" }}>{course.yardage.toLocaleString()} yards</div>
                  <div style={{ fontSize: 11, color: "var(--euro-light)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>From championship tees</div>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ═══ TWO-COL: Experience (reversed) ═══ */}
      {galleryImages[1] && (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", direction: "rtl" }} className="max-md:!grid-cols-1">
          <div style={{ position: "relative", overflow: "hidden", minHeight: 500, direction: "ltr" }} className="max-md:!min-h-[350px]">
            <Image src={galleryImages[1]} alt="Course view" fill className="object-cover hover:scale-[1.03] transition-transform duration-[6s]" sizes="(max-width:900px) 100vw, 50vw" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(40px,6vw,100px)", direction: "ltr" }}>
            <Reveal><div style={labelStyle}>The Experience</div></Reveal>
            <Reveal delay={0.08}>
              <h2 style={titleStyle}>Championship Golf<br /><em style={{ fontStyle: "italic" }}>&amp; Natural Beauty</em></h2>
            </Reveal>
            <Reveal delay={0.16}><p style={textStyle}>{para2}</p></Reveal>
            <Reveal delay={0.24}>
              <div style={{ display: "inline-block", marginTop: 24, padding: "16px 24px", border: "1px solid var(--euro-sand)", borderRadius: 12 }}>
                <div style={{ fontFamily: "var(--euro-serif)", fontSize: 26, color: "var(--euro-accent)" }}>20+ years</div>
                <div style={{ fontSize: 11, color: "var(--euro-light)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Golf the High Sierra · Expert Group Planning</div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {divider}

      {/* ═══ GALLERY GRID ═══ */}
      {galleryImages.length > 0 && (
        <section style={{ padding: sectionSmPad }}>
          <Reveal><div style={labelStyle}>Gallery</div></Reveal>
          <Reveal delay={0.08}><h2 style={{ ...titleStyle, marginBottom: 32 }}>See <em style={{ fontStyle: "italic" }}>{firstName}</em></h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(galleryImages.length, 3)},1fr)`, gap: 4 }} className="max-md:!grid-cols-2">
            {galleryImages.slice(0, 6).map((img, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div
                  style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", cursor: "pointer" }}
                  onClick={() => setLbIndex(i)}
                >
                  <Image src={img} alt={`${course.name} ${i + 1}`} fill className="object-cover brightness-[.92] hover:brightness-100 hover:scale-[1.04] transition-all duration-700" sizes="(max-width:768px) 50vw, 33vw" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {divider}

      {/* ═══ BIG NUMBERS ═══ */}
      {bigNums.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${bigNums.length},1fr)`, gap: 0, borderTop: "1px solid var(--euro-sand)", borderBottom: "1px solid var(--euro-sand)" }} className="max-md:!grid-cols-2">
          {bigNums.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ padding: "clamp(40px,6vh,80px) 24px", textAlign: "center", borderRight: i < bigNums.length - 1 ? "1px solid var(--euro-sand)" : "none" }}>
                <div style={{ fontFamily: "var(--euro-serif)", fontSize: "clamp(44px,6vw,72px)", fontWeight: 400, color: "var(--euro-text)" }}>
                  <Counter target={s.val} comma={!!s.comma} />
                </div>
                <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--euro-light)", marginTop: 8 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* ═══ FULLBLEED: Group Golf ═══ */}
      {course.heroImage && (
        <section style={{ position: "relative", height: "70vh", minHeight: 450, overflow: "hidden", display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src={course.heroImage} alt={course.name} fill className="object-cover brightness-[.4]" sizes="100vw" />
          </div>
          <div style={{ position: "relative", zIndex: 2, padding: "0 clamp(32px,6vw,100px)", maxWidth: 620 }}>
            <Reveal><div style={{ ...labelStyle, color: "rgba(255,255,255,.45)" }}>Group Golf</div></Reveal>
            <Reveal delay={0.08}><h2 style={{ ...titleStyle, color: "#fff" }}>Built for <em style={{ fontStyle: "italic", color: "rgba(255,255,255,.7)" }}>Groups</em></h2></Reveal>
            <Reveal delay={0.16}><p style={{ ...textStyle, color: "rgba(255,255,255,.5)" }}>From 8 to 100 players. Consecutive tee times, rooming lists, comps for organizers. Whether it&apos;s a buddy trip, corporate outing, or charity tournament — our team handles every detail so you can focus on the game.</p></Reveal>
          </div>
        </section>
      )}

      {divider}

      {/* ═══ FACILITIES ═══ */}
      {facilities.length > 0 && (
        <section style={{ padding: sectionPad }}>
          <Reveal><div style={labelStyle}>Amenities</div></Reveal>
          <Reveal delay={0.08}><h2 style={{ ...titleStyle, marginBottom: 28 }}>On <em style={{ fontStyle: "italic" }}>Course</em></h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, maxWidth: 720 }} className="max-md:!grid-cols-2 max-sm:!grid-cols-1">
            {facilities.map((f, i) => (
              <Reveal key={i} delay={0.04 * i}>
                <div style={{ padding: "14px 18px", border: "1px solid var(--euro-sand)", borderRadius: 10, fontSize: 14, fontWeight: 300, color: "var(--euro-text)", transition: "border-color .3s" }} className="hover:!border-[#a89070]">{f}</div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {divider}

      {/* ═══ LOCATION ═══ */}
      {addr?.streetAddress && (
        <section style={{ padding: sectionPad }}>
          <Reveal><div style={labelStyle}>Location</div></Reveal>
          <Reveal delay={0.08}><h2 style={titleStyle}>Getting to <em style={{ fontStyle: "italic" }}>{firstName}</em></h2></Reveal>
          <Reveal delay={0.16}>
            <p style={{ fontSize: 14, color: "var(--euro-muted)", marginTop: 8, fontWeight: 300 }}>
              {addr.streetAddress}, {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}
              {course.phone && <> · <a href={`tel:${course.phone}`} style={{ color: "var(--euro-accent)" }}>{course.phone}</a></>}
            </p>
          </Reveal>

          {distances.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 clamp(32px,5vw,80px)", maxWidth: 720, marginTop: 32 }} className="max-sm:!grid-cols-1">
              {distances.map((d, i) => (
                <Reveal key={i} delay={0.04 * i}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--euro-sand)", fontSize: 14, transition: "padding-left .3s" }} className="hover:!pl-2">
                    <span style={{ color: "var(--euro-text)", fontWeight: 400 }}>{d.replace(/^\d+\s*(minutes?|mins?)\s*(from\s*)?/i, "")}</span>
                    <span style={{ color: "var(--euro-accent)", fontWeight: 500 }}>{d.match(/^\d+/)?.[0]} min</span>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {course.geo && (course.geo as CourseGeo).latitude && (
            <Reveal delay={0.2}>
              <div style={{ marginTop: 40, borderRadius: 12, overflow: "hidden", aspectRatio: "2/1", maxWidth: 720 }}>
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12000!2d${(course.geo as CourseGeo).longitude}!3d${(course.geo as CourseGeo).latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s!5e0!3m2!1sen!2sus`}
                  className="w-full h-full border-0" style={{ filter: "saturate(.5) contrast(1.1)" }} loading="lazy"
                />
              </div>
            </Reveal>
          )}
        </section>
      )}

      {divider}

      {/* ═══ FAQ ═══ */}
      {course.faqs.length > 0 && (
        <section style={{ padding: sectionPad }}>
          <Reveal><div style={labelStyle}>FAQ</div></Reveal>
          <Reveal delay={0.08}><h2 style={{ ...titleStyle, marginBottom: 32 }}>Common <em style={{ fontStyle: "italic" }}>Questions</em></h2></Reveal>
          <div style={{ maxWidth: 680 }}>
            {course.faqs.map((f, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <FAQ q={f.question} a={f.answer} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {divider}

      {/* ═══ RELATED COURSES ═══ */}
      {relatedCourses.length > 0 && (
        <section style={{ padding: sectionPad, background: "var(--euro-ivory)" }}>
          <Reveal><div style={labelStyle}>Nearby Courses</div></Reveal>
          <Reveal delay={0.08}><h2 style={{ ...titleStyle, marginBottom: 32 }}>More in <em style={{ fontStyle: "italic" }}>{course.regionLabel}</em></h2></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="max-md:!grid-cols-1">
            {relatedCourses.map((rc, i) => (
              <Reveal key={rc.slug} delay={0.08 + i * 0.06}>
                <Link href={`/portfolio/${rc.slug}/`}>
                  <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--euro-sand)", transition: "all .5s", background: "var(--euro-white)" }} className="hover:!border-transparent hover:!shadow-[0_12px_40px_rgba(0,0,0,.06)] hover:-translate-y-1">
                    <div style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative" }}>
                      {rc.heroImage ? (
                        <Image src={rc.heroImage} alt={rc.name} fill className="object-cover group-hover:scale-[1.04] transition-transform duration-700" sizes="(max-width:768px) 100vw, 33vw" />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "var(--euro-stone)" }} />
                      )}
                      {rc.priceRange && <span style={{ position: "absolute", top: 12, right: 12, background: "#2c2c2c", color: "#fff", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{rc.priceRange}</span>}
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ fontFamily: "var(--euro-serif)", fontSize: 18, color: "var(--euro-text)", marginBottom: 4 }}>{rc.name}</div>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--euro-light)", marginBottom: 12 }}>{rc.regionLabel}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--euro-sand)" }}>
                        {rc.rating && <span style={{ fontSize: 12, color: "var(--euro-muted)" }}>★ {rc.rating.value}</span>}
                        <span style={{ fontSize: 11, color: "var(--euro-accent)", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>View Course <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {divider}

      {/* ═══ CTA ═══ */}
      <section style={{ textAlign: "center", background: "var(--euro-ivory)", padding: "clamp(80px,14vh,160px) clamp(32px,6vw,100px)" }}>
        <Reveal><div style={labelStyle}>Book {firstName}</div></Reveal>
        <Reveal delay={0.08}><h2 style={{ ...titleStyle, margin: "0 auto 16px" }}>Play <em style={{ fontStyle: "italic" }}>{firstName}</em><br />With Your Group</h2></Reveal>
        <Reveal delay={0.16}>
          <p style={{ ...textStyle, textAlign: "center", margin: "0 auto 0", maxWidth: 500 }}>
            {course.priceRange ? `Stay-and-play packages from ${course.priceRange.split("–")[0]}/golfer. ` : ""}Tee times, lodging, dining — one call does it all.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div style={{ marginTop: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 100, background: "rgba(139,115,85,.06)", border: "1px solid rgba(139,115,85,.1)", fontSize: 11, color: "var(--euro-accent)", fontWeight: 500, marginBottom: 28 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--euro-accent)", animation: "euroFade 2s infinite" }} />
              Weekend tee times limited in peak season
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.32}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-block", padding: "16px 40px", background: "var(--euro-accent)", color: "#fff", borderRadius: 100, fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", transition: "all .4s" }} className="hover:!bg-[#a89070] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(139,115,85,.15)]">
              Plan My {firstName} Trip
            </Link>
            <a href="tel:+18885848232" style={{ display: "inline-block", padding: "16px 40px", border: "1px solid var(--euro-sand)", color: "var(--euro-muted)", borderRadius: 100, fontSize: 12, fontWeight: 400, letterSpacing: 1.5, textTransform: "uppercase", transition: "all .4s" }} className="hover:!border-[#2c2c2c] hover:!text-[#2c2c2c]">
              Call 888-584-8232
            </a>
          </div>
        </Reveal>
      </section>

      {/* ═══ Lightbox ═══ */}
      {lbIndex !== null && <Lightbox images={galleryImages} startIndex={lbIndex} onClose={() => setLbIndex(null)} name={course.name} />}

      {/* ═══ Keyframe for badge pulse ═══ */}
      <style jsx global>{`@keyframes euroFade{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}
