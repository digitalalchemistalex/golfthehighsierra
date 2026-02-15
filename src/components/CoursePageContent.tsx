"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, ChevronRight, X, ChevronLeft, Camera } from "lucide-react";

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
  const junk = ["trips caddie","all lake tahoe","all hotels","all golf","all food","all experiences","all carson","all cedar","all eldorado","old greenwood","all atlantis"];
  return f.filter(x => !junk.some(j => x.toLowerCase().includes(j)) && x.trim().length > 3);
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "", comma = false }: { target: number; suffix?: string; comma?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1400;
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target]);
  return <span ref={ref}>{comma ? val.toLocaleString() : val}{suffix}</span>;
}

/* ─── Section Reveal Wrapper ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white z-10 p-2"><X className="w-8 h-8" /></button>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }} className="absolute left-4 text-white/60 hover:text-white z-10 p-2"><ChevronLeft className="w-10 h-10" /></button>
      <div className="relative w-[90vw] h-[80vh]" onClick={e => e.stopPropagation()}>
        <Image src={images[idx]} alt={`${name} ${idx + 1}`} fill className={`object-contain ${isLogo(images[idx]) ? "p-12" : ""}`} sizes="90vw" />
      </div>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} className="absolute right-4 text-white/60 hover:text-white z-10 p-2"><ChevronRight className="w-10 h-10" /></button>
      <div className="absolute bottom-4 text-white/40 text-xs tracking-widest">{idx + 1} / {images.length}</div>
    </motion.div>
  );
}

/* ─── FAQ Item ─── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-bone">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-5 text-left font-sans text-[15px] font-medium text-ink hover:text-accent transition-colors gap-4">
        {q}
        <span className={`w-7 h-7 rounded-full border border-linen flex items-center justify-center text-sm text-ink-4 transition-all duration-400 flex-shrink-0 ${open ? "bg-ink text-white border-ink rotate-45" : ""}`}>+</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <p className="pb-5 text-sm text-ink-3 leading-relaxed font-light">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COURSE PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function CoursePageContent({ course, relatedCourses = [] }: { course: CourseProps; relatedCourses?: RelatedCourse[] }) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Parse data
  const galleryImages = course.images.filter(u => !isScorecard(u));
  const distances = course.distances?.length ? course.distances : parseDistances(course.bodyText || []);
  const facilities = cleanFacilities(course.facilities || []);
  const addr = course.address;

  return (
    <div className="font-sans bg-silk text-ink overflow-x-hidden">
      {/* ── Scroll Progress ── */}
      <motion.div className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-warm to-accent z-[10001]" style={{ width: progressWidth }} />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[520px] overflow-hidden">
        <motion.div className="absolute inset-0 -inset-y-10" style={{ y: heroY }}>
          {course.heroImage ? (
            <Image src={course.heroImage} alt={course.name} fill priority className="object-cover brightness-[0.38] contrast-[1.08] saturate-110 animate-hero-kb" sizes="100vw" />
          ) : (
            <div className="w-full h-full bg-ink" />
          )}
        </motion.div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/70" />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 md:px-[clamp(20px,5vw,72px)] pb-[clamp(40px,7vh,88px)]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-[10px] text-white/25 tracking-wide mb-3">
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            {" / "}
            <Link href="/best-golf-courses-reno/" className="hover:text-white/60 transition-colors">Golf Courses</Link>
            {" / "}
            <span>{course.regionLabel}</span>
            {" / "}
            <span className="text-white/40">{course.name}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light text-white leading-none tracking-tight text-[clamp(40px,7vw,82px)]">
            {course.name.split(" ").slice(0, -2).join(" ")}{" "}
            <em className="italic font-normal bg-gradient-to-r from-white to-warm bg-clip-text text-transparent">
              {course.name.split(" ").slice(-2).join(" ")}
            </em>
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-xs text-white/25 tracking-[4px] uppercase font-light mt-2 mb-5">
            {course.regionLabel}{course.yearBuilt ? ` · Est. ${course.yearBuilt}` : ""}{course.designer ? ` · ${course.designer}` : ""}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex gap-2 flex-wrap">
            {course.holes && <span className="bg-white/5 backdrop-blur-xl border border-white/[0.07] px-4 py-1.5 rounded-pill text-[10px] text-white/45 font-medium tracking-wider uppercase hover:bg-white/10 hover:text-white/70 transition-all cursor-default">{course.holes} Holes</span>}
            {course.par && <span className="bg-white/5 backdrop-blur-xl border border-white/[0.07] px-4 py-1.5 rounded-pill text-[10px] text-white/45 font-medium tracking-wider uppercase hover:bg-white/10 hover:text-white/70 transition-all cursor-default">Par {course.par}</span>}
            {course.yardage && <span className="bg-white/5 backdrop-blur-xl border border-white/[0.07] px-4 py-1.5 rounded-pill text-[10px] text-white/45 font-medium tracking-wider uppercase hover:bg-white/10 hover:text-white/70 transition-all cursor-default">{course.yardage.toLocaleString()} Yards</span>}
            {course.slope && <span className="bg-white/5 backdrop-blur-xl border border-white/[0.07] px-4 py-1.5 rounded-pill text-[10px] text-white/45 font-medium tracking-wider uppercase hover:bg-white/10 hover:text-white/70 transition-all cursor-default">Slope {course.slope}</span>}
            {course.rating && <span className="bg-white/5 backdrop-blur-xl border border-white/[0.07] px-4 py-1.5 rounded-pill text-[10px] text-white/45 font-medium tracking-wider uppercase hover:bg-white/10 hover:text-white/70 transition-all cursor-default">★ {course.rating.value}</span>}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-30">
          <span className="text-[8px] tracking-[3px] uppercase text-white font-medium">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent animate-scroll-line" />
        </div>
      </section>

      {/* ── STAT BAR ── */}
      <Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-b border-linen">
          {[
            { val: course.holes || 18, label: "Championship Holes" },
            { val: course.par || 72, label: "Par" },
            { val: course.yardage || 0, label: "Yards from Tips", comma: true },
            { val: course.slope || 0, label: "Slope Rating" },
            { val: course.yearBuilt || 0, label: "Established" },
          ].filter(s => s.val > 0).map((s, i) => (
            <div key={i} className="py-8 px-4 text-center border-r border-linen last:border-r-0 hover:bg-pearl transition-colors">
              <div className="font-serif text-[clamp(28px,3.5vw,48px)] font-light text-ink leading-none">
                <Counter target={s.val} comma={s.comma} />
              </div>
              <div className="text-[9px] tracking-[2px] uppercase text-ink-4 font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── QUOTE ── */}
      {course.pointOfView && (
        <section className="relative py-20 md:py-28 px-5 md:px-[clamp(20px,5vw,72px)] bg-pearl overflow-hidden">
          <div className="absolute top-[-60px] left-5 md:left-[clamp(20px,5vw,72px)] font-serif text-[clamp(200px,25vw,400px)] font-light text-black/[0.02] leading-none pointer-events-none select-none">&ldquo;</div>
          <Reveal>
            <p className="font-serif text-[clamp(20px,2.8vw,34px)] font-light italic text-ink-2 leading-[1.5] max-w-[740px] relative">
              &ldquo;{course.pointOfView}&rdquo;
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="font-sans text-[11px] tracking-[2.5px] uppercase text-accent font-semibold mt-5 relative">— Golf the High Sierra</div>
          </Reveal>
        </section>
      )}

      {/* ── THE COURSE ── */}
      <section className="py-20 md:py-28 px-5 md:px-[clamp(20px,5vw,72px)] bg-silk">
        <Reveal><div className="text-[10px] tracking-[4.5px] uppercase text-accent font-semibold mb-3">The Course</div></Reveal>
        <Reveal delay={0.05}><h2 className="font-serif font-light text-[clamp(30px,4.5vw,58px)] text-ink leading-[1.06] tracking-tight mb-3">
          Championship Layout{course.featuredHole ? <> & the <em className="italic font-normal">Signature Hole</em></> : ""}
        </h2></Reveal>
        <Reveal delay={0.1}><p className="text-sm text-ink-3 leading-relaxed max-w-xl font-light mb-10">
          {course.contentParagraphs?.[0] || course.description.substring(0, 200)}
        </p></Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Featured hole card */}
          {course.featuredHole?.title && (
            <Reveal delay={0.08}>
              <div className="bg-silk border border-linen rounded-4xl p-8 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,.06)] hover:border-warm/20 transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-warm to-accent-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="text-3xl mb-4 block group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-400">🏝️</span>
                <h5 className="font-sans text-[15px] font-semibold text-ink mb-2">{course.featuredHole.title}</h5>
                <p className="text-sm text-ink-3 leading-relaxed font-light">{course.featuredHole.description}</p>
              </div>
            </Reveal>
          )}
          {/* Course description cards */}
          {(course.contentParagraphs || []).slice(1, 3).map((p, i) => (
            <Reveal key={i} delay={0.12 + i * 0.08}>
              <div className="bg-silk border border-linen rounded-4xl p-8 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,.06)] hover:border-warm/20 transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-warm to-accent-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="text-3xl mb-4 block group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-400">{i === 0 ? "🌲" : "🍽️"}</span>
                <h5 className="font-sans text-[15px] font-semibold text-ink mb-2">{i === 0 ? "Championship Layout" : "Facilities & Dining"}</h5>
                <p className="text-sm text-ink-3 leading-relaxed font-light">{p.substring(0, 200)}</p>
              </div>
            </Reveal>
          ))}
          {/* Facilities card if not enough content paragraphs */}
          {(course.contentParagraphs || []).length < 3 && facilities.length > 0 && (
            <Reveal delay={0.2}>
              <div className="bg-silk border border-linen rounded-4xl p-8 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,.06)] hover:border-warm/20 transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-warm to-accent-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="text-3xl mb-4 block group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-400">⛳</span>
                <h5 className="font-sans text-[15px] font-semibold text-ink mb-2">Facilities</h5>
                <p className="text-sm text-ink-3 leading-relaxed font-light">{facilities.join(" · ")}</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── INSIDER'S TAKE — Two Column ── */}
      {(course.tips?.length || 0) > 0 && (
        <section className="py-20 md:py-28 px-5 md:px-[clamp(20px,5vw,72px)] bg-pearl">
          <div className="grid md:grid-cols-2 gap-10 md:gap-[clamp(40px,6vw,100px)] items-center">
            {/* Image */}
            <Reveal className="relative">
              {galleryImages[1] ? (
                <div className="rounded-4xl overflow-hidden aspect-[4/3] relative">
                  <Image src={galleryImages[1]} alt={course.name} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width:768px) 100vw, 50vw" />
                  <div className="absolute bottom-3.5 left-3.5 bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-pill text-[9px] font-semibold tracking-[1.2px] text-ink-2 uppercase">
                    {course.name}
                  </div>
                </div>
              ) : null}
            </Reveal>
            {/* Tips */}
            <div>
              <Reveal><div className="text-[10px] tracking-[4.5px] uppercase text-accent font-semibold mb-3">The Insider&apos;s Take</div></Reveal>
              <Reveal delay={0.05}><h3 className="font-serif font-light text-[clamp(24px,3vw,40px)] text-ink leading-[1.06] tracking-tight mb-6">
                Why Groups <em className="italic font-normal">Keep Coming Back</em>
              </h3></Reveal>
              <div className="flex flex-col mt-2">
                {course.tips?.filter(t => t.title && !t.content?.includes("jtg-")).slice(0, 4).map((tip, i) => (
                  <Reveal key={i} delay={0.08 + i * 0.06}>
                    <div className="flex items-start gap-5 py-5 border-b border-bone first:border-t first:border-bone hover:pl-2 transition-all group">
                      <div className="font-serif text-3xl font-light text-mist leading-none min-w-[30px] group-hover:text-warm transition-colors">{String(i + 1).padStart(2, "0")}</div>
                      <div>
                        <strong className="font-sans text-sm font-semibold text-ink block mb-1">{tip.title?.replace(/[""]/g, "")}</strong>
                        <span className="text-sm text-ink-3 leading-relaxed font-light">{tip.content?.split("\n")[0].substring(0, 180)}</span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {galleryImages.length > 0 && (
        <section className="py-20 md:py-28 px-5 md:px-[clamp(20px,5vw,72px)] bg-silk">
          <Reveal><div className="text-[10px] tracking-[4.5px] uppercase text-accent font-semibold mb-3">Gallery</div></Reveal>
          <Reveal delay={0.05}><h2 className="font-serif font-light text-[clamp(30px,4.5vw,58px)] text-ink leading-[1.06] tracking-tight mb-10">
            See <em className="italic font-normal">{course.name.split(" ")[0]}</em>
          </h2></Reveal>
          <Reveal delay={0.1}>
            <div className={`grid gap-2 h-[360px] md:h-[480px] ${galleryImages.length >= 4 ? "grid-cols-[2fr_1fr_1fr] grid-rows-2" : galleryImages.length >= 2 ? "grid-cols-2 grid-rows-1" : "grid-cols-1"}`}>
              {galleryImages.slice(0, 4).map((img, i) => (
                <div key={i} onClick={() => setLbIndex(i)}
                  className={`rounded-4xl overflow-hidden relative cursor-pointer group ${i === 0 && galleryImages.length >= 4 ? "row-span-2" : ""}`}>
                  <Image src={img} alt={`${course.name} ${i + 1}`} fill
                    className={`transition-transform duration-700 group-hover:scale-105 ${isLogo(img) ? "object-contain p-8 bg-pearl" : "object-cover"}`} sizes="(max-width:768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-white text-[11px] font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <Camera className="w-3.5 h-3.5" /> View
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── LOCATION ── */}
      {addr?.streetAddress && (
        <section className="py-20 md:py-28 px-5 md:px-[clamp(20px,5vw,72px)] bg-pearl">
          <Reveal><div className="text-[10px] tracking-[4.5px] uppercase text-accent font-semibold mb-3">Location</div></Reveal>
          <Reveal delay={0.05}><h2 className="font-serif font-light text-[clamp(30px,4.5vw,58px)] text-ink leading-[1.06] tracking-tight mb-10">
            Getting to <em className="italic font-normal">{course.name.split(" ")[0]}</em>
          </h2></Reveal>
          <div className="grid md:grid-cols-2 gap-10 md:gap-[clamp(40px,5vw,72px)] items-start">
            <Reveal>
              <div className="text-sm text-ink-3 leading-relaxed font-light mb-6">
                <strong className="text-ink font-semibold text-[15px] block">{addr.streetAddress}</strong>
                {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}
                {course.phone && <><br /><a href={`tel:${course.phone}`} className="text-accent hover:text-accent-light transition-colors">{course.phone}</a></>}
              </div>
              {distances.length > 0 && (
                <div className="flex flex-col">
                  {distances.map((d, i) => (
                    <Reveal key={i} delay={0.04 * i}>
                      <div className="flex justify-between py-3.5 border-b border-bone text-sm hover:pl-1.5 transition-all">
                        <span className="text-ink-2 font-normal">{d.replace(/^\d+\s*(minutes?|mins?)\s*(from\s*)?/i, "")}</span>
                        <span className="text-ink-4 font-light">{d.match(/^\d+/)?.[0]} min</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </Reveal>
            <Reveal delay={0.1}>
              {course.geo && (course.geo as CourseGeo).latitude ? (
                <div className="rounded-4xl overflow-hidden aspect-[4/3]">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12000!2d${(course.geo as CourseGeo).longitude}!3d${(course.geo as CourseGeo).latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s!5e0!3m2!1sen!2sus`}
                    className="w-full h-full border-0 saturate-50 contrast-110" loading="lazy"
                  />
                </div>
              ) : galleryImages[galleryImages.length - 1] ? (
                <div className="rounded-4xl overflow-hidden aspect-[4/3] relative">
                  <Image src={galleryImages[galleryImages.length - 1]} alt="Location" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                </div>
              ) : null}
            </Reveal>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {course.faqs.length > 0 && (
        <section className="py-20 md:py-28 px-5 md:px-[clamp(20px,5vw,72px)] bg-silk">
          <Reveal><div className="text-[10px] tracking-[4.5px] uppercase text-accent font-semibold mb-3">FAQ</div></Reveal>
          <Reveal delay={0.05}><h2 className="font-serif font-light text-[clamp(30px,4.5vw,58px)] text-ink leading-[1.06] tracking-tight mb-10">
            Common <em className="italic font-normal">Questions</em>
          </h2></Reveal>
          <Reveal delay={0.1}>
            <div className="max-w-[700px]">
              {course.faqs.map((f, i) => <FAQ key={i} q={f.question} a={f.answer} />)}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── RELATED COURSES ── */}
      {relatedCourses.length > 0 && (
        <section className="py-20 md:py-28 px-5 md:px-[clamp(20px,5vw,72px)] bg-bone">
          <Reveal><div className="text-[10px] tracking-[4.5px] uppercase text-accent font-semibold mb-3">Nearby Courses</div></Reveal>
          <Reveal delay={0.05}><h2 className="font-serif font-light text-[clamp(28px,3.5vw,44px)] text-ink leading-[1.06] tracking-tight mb-10">
            More in <em className="italic font-normal">{course.regionLabel}</em>
          </h2></Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedCourses.map((rc, i) => (
              <Reveal key={rc.slug} delay={0.08 + i * 0.06}>
                <Link href={`/portfolio/${rc.slug}/`}>
                  <div className="bg-silk border border-linen rounded-4xl overflow-hidden group hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,.07)] hover:border-transparent transition-all duration-500">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      {rc.heroImage ? (
                        <Image src={rc.heroImage} alt={rc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width:768px) 100vw, 33vw" />
                      ) : (
                        <div className="w-full h-full bg-bone" />
                      )}
                      {rc.priceRange && <span className="absolute top-3 right-3 bg-ink text-white px-3 py-1 rounded-pill text-[10px] font-semibold">{rc.priceRange}</span>}
                    </div>
                    <div className="p-5">
                      <h4 className="font-serif text-lg font-normal text-ink mb-1">{rc.name}</h4>
                      <div className="text-[10px] text-ink-4 uppercase tracking-wider mb-3">{rc.regionLabel}</div>
                      <div className="flex items-center justify-between pt-3 border-t border-bone">
                        {rc.rating && <div className="flex items-center gap-1 text-xs text-ink-3"><Star className="w-3 h-3 text-warm fill-warm" /> {rc.rating.value}</div>}
                        <span className="text-[11px] text-accent font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">View Course <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 px-5 md:px-[clamp(20px,5vw,72px)] text-center bg-pearl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,white,transparent_55%)]" />
        <div className="relative">
          <Reveal><div className="text-[10px] tracking-[4.5px] uppercase text-accent font-semibold mb-3">Book {course.name.split(" ")[0]}</div></Reveal>
          <Reveal delay={0.05}><h2 className="font-serif font-light text-[clamp(30px,4.5vw,58px)] text-ink leading-[1.06] tracking-tight mb-3">
            Play <em className="italic font-normal">{course.name.split(" ")[0]}</em> With Your Group
          </h2></Reveal>
          <Reveal delay={0.1}><p className="text-sm text-ink-3 font-light max-w-lg mx-auto mb-4">
            {course.priceRange ? `Stay-and-play packages from ${course.priceRange.split("–")[0]}/golfer. ` : ""}Tee times, lodging, dining — one call does it all.
          </p></Reveal>
          <Reveal delay={0.15}>
            <div className="inline-flex items-center gap-2 bg-accent-soft border border-accent/10 px-5 py-2 rounded-pill text-[11px] text-accent font-semibold mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              Weekend tee times limited in peak season
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contact-custom-golf-package/" className="bg-ink text-white px-10 py-4 rounded-pill text-xs font-semibold tracking-wider uppercase hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(0,0,0,.08)] hover:bg-ink-2 transition-all duration-400">
                Plan My {course.name.split(" ")[0]} Trip
              </Link>
              <a href="tel:+18885848232" className="border border-linen text-ink-3 px-10 py-4 rounded-pill text-xs font-medium tracking-wider uppercase hover:border-ink hover:text-ink transition-all duration-400">
                Call 888-584-8232
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lbIndex !== null && <Lightbox images={galleryImages} startIndex={lbIndex} onClose={() => setLbIndex(null)} name={course.name} />}
      </AnimatePresence>
    </div>
  );
}
