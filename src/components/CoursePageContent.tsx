"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";

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

/* ─── Custom Cursor ─── */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ cx: 0, cy: 0, dx: 0, dy: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.cx = e.clientX;
      pos.current.cy = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    const loop = () => {
      pos.current.dx += (pos.current.cx - pos.current.dx) * 0.12;
      pos.current.dy += (pos.current.cy - pos.current.dy) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = pos.current.dx + "px";
        cursorRef.current.style.top = pos.current.dy + "px";
      }
      requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMove);
    const raf = requestAnimationFrame(loop);

    // Hover effect
    const hovers = document.querySelectorAll("a,button,[data-hover]");
    const enter = () => cursorRef.current?.classList.add("cursor-hover");
    const leave = () => cursorRef.current?.classList.remove("cursor-hover");
    hovers.forEach(el => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      hovers.forEach(el => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="fixed w-3 h-3 border-[1.5px] border-accent rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background] duration-300 [&.cursor-hover]:w-12 [&.cursor-hover]:h-12 [&.cursor-hover]:bg-accent/10 [&.cursor-hover]:border-accent-light hidden md:block" />
      <div ref={dotRef} className="fixed w-1 h-1 bg-accent rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden md:block" />
      <style jsx global>{`@media(min-width:769px){.cinematic-page,.cinematic-page *{cursor:none !important}}`}</style>
    </>
  );
}

/* ─── Hero Particles (Canvas) ─── */
function HeroParticles({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pts: { x: number; y: number; s: number; vx: number; vy: number; o: number }[] = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      pts.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        s: Math.random() * 1.5 + 0.5, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.35 + 0.1,
      });
    }

    let running = true;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
    return () => { running = false; window.removeEventListener("resize", resize); };
  }, [canvasRef]);

  return null;
}

/* ─── Scroll Reveal ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.1, rootMargin: "-30px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transition: `opacity 1s cubic-bezier(.16,1,.3,1) ${delay}s, transform 1s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Split Image (slow zoom on scroll) ─── */
function SplitImage({ src, alt, num }: { src: string; alt: string; num: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative overflow-hidden min-h-[400px] md:min-h-0">
      <Image
        src={src} alt={alt} fill
        className={`object-cover brightness-[.6] saturate-[1.2] transition-transform duration-[8s] ease-[cubic-bezier(.16,1,.3,1)] ${inView ? "scale-100" : "scale-[1.15]"}`}
        sizes="(max-width:768px) 100vw, 50vw"
      />
      <div className="absolute bottom-8 left-8 font-display text-[clamp(80px,12vw,160px)] font-bold text-white/[.06] leading-none">{num}</div>
    </div>
  );
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "", comma = false }: { target: number; suffix?: string; comma?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{comma ? val.toLocaleString() : val}{suffix}</span>;
}

/* ─── FAQ ─── */
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-6 text-left font-body text-base font-normal text-ink hover:text-accent transition-colors gap-5"
      >
        {q}
        <span className={`w-8 h-8 rounded-full border border-black/[.06] flex items-center justify-center text-lg text-dim transition-all duration-400 flex-shrink-0 ${open ? "bg-accent text-white border-accent rotate-45" : ""}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-[max-height] duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)] ${open ? "max-h-[200px]" : "max-h-0"}`}>
        <p className="pb-6 text-sm text-dim leading-[1.8] font-light">{a}</p>
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
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center animate-[fadeIn_.3s]" onClick={onClose}>
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
   MAIN COURSE PAGE COMPONENT — CINEMATIC V4
   ═══════════════════════════════════════════════════════ */
export default function CoursePageContent({ course, relatedCourses = [] }: { course: CourseProps; relatedCourses?: RelatedCourse[] }) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Parse data
  const galleryImages = course.images.filter(u => !isScorecard(u) && !isLogo(u));
  const distances = course.distances?.length ? course.distances : parseDistances(course.bodyText || []);
  const facilities = cleanFacilities(course.facilities || []);
  const addr = course.address;
  const nameParts = course.name.split(" ");
  const firstName = nameParts[0];

  // Content paragraphs
  const para1 = course.contentParagraphs?.[0] || course.description.substring(0, 300);
  const para2 = course.contentParagraphs?.[1] || (course.bodyText?.[2] || course.description);

  // Scroll effects: parallax hero + progress bar
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      // Progress bar
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${y / h})`;
      // Parallax hero bg
      if (heroBgRef.current && y < window.innerHeight * 1.5) {
        heroBgRef.current.style.transform = `scale(${1.1 + y * 0.00005}) translateY(${y * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stats for hero
  const heroStats = [
    course.holes ? { val: String(course.holes), label: "Holes" } : null,
    course.par ? { val: String(course.par), label: "Par" } : null,
    course.yardage ? { val: course.yardage.toLocaleString(), label: "Yards" } : null,
    course.slope ? { val: String(course.slope), label: "Slope" } : null,
    course.rating ? { val: String(course.rating.value), label: "Rating" } : null,
  ].filter(Boolean) as { val: string; label: string }[];

  // Big counter stats
  const bigNums = [
    course.holes ? { val: course.holes, label: "Holes", comma: false } : null,
    course.yardage ? { val: course.yardage, label: "Yards", comma: true } : null,
    course.yearBuilt ? { val: course.yearBuilt, label: "Established", comma: false } : null,
    course.rating ? { val: course.rating.count, label: "Reviews", comma: true } : null,
  ].filter(Boolean) as { val: number; label: string; comma: boolean }[];

  // Gallery images doubled for marquee
  const marqueeImages = [...galleryImages, ...galleryImages];

  return (
    <div className="cinematic-page font-body bg-[#f7f5f0] text-ink overflow-x-hidden">
      <CustomCursor />
      <HeroParticles canvasRef={canvasRef} />

      {/* ── Progress Bar ── */}
      <div ref={progressRef} className="fixed top-0 left-0 right-0 h-px bg-accent z-[10000] origin-left scale-x-0" />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div ref={heroBgRef} className="absolute -inset-[60px]">
          {course.heroImage ? (
            <Image src={course.heroImage} alt={course.name} fill priority className="object-cover brightness-[.35] saturate-[1.3]" sizes="100vw" />
          ) : (
            <div className="w-full h-full bg-ink" />
          )}
        </div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_30%,rgba(0,0,0,.7))]" />
        {/* Particles canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30" />

        {/* Hero center content */}
        <div className="relative z-[2] text-center max-w-[900px] px-6">
          <div className="text-[11px] tracking-[6px] uppercase text-white/40 mb-6 overflow-hidden">
            <span className="inline-block animate-[slideUp_.8s_cubic-bezier(.16,1,.3,1)_.3s_both]">
              {course.regionLabel}{course.yearBuilt ? ` · Est. ${course.yearBuilt}` : ""}
            </span>
          </div>

          <h1 className="font-display font-normal text-[clamp(48px,10vw,120px)] leading-[.9] tracking-[-.04em] text-white">
            <span className="block overflow-hidden">
              <span className="inline-block animate-[slideUp_1s_cubic-bezier(.16,1,.3,1)_.4s_both]">
                {nameParts.slice(0, -2).join(" ") || firstName}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="inline-block animate-[slideUp_1s_cubic-bezier(.16,1,.3,1)_.55s_both]">
                <em className="italic text-accent">{nameParts.slice(-2).join(" ")}</em>
              </span>
            </span>
          </h1>

          {/* Hero stats */}
          {heroStats.length > 0 && (
            <div className="flex gap-[clamp(20px,4vw,48px)] justify-center mt-10 animate-[fadeIn_1s_ease_.9s_both]">
              {heroStats.map((s, i) => (
                <div key={i} className="flex items-center gap-[clamp(20px,4vw,48px)]">
                  {i > 0 && <div className="w-px h-10 bg-white/15" />}
                  <div className="text-center">
                    <div className="font-display text-[clamp(24px,3.5vw,44px)] font-normal leading-none text-white">{s.val}</div>
                    <div className="text-[9px] tracking-[2px] uppercase text-white/40 mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 animate-[fadeIn_1s_ease_1.2s_both]">
          <span className="text-[8px] tracking-[3px] uppercase text-white/40">Discover</span>
          <div className="w-px h-12 relative overflow-hidden">
            <div className="absolute top-[-48px] left-0 w-px h-12 bg-gradient-to-b from-transparent to-accent animate-scroll-drop" />
          </div>
        </div>
      </section>

      {/* ── Separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ── SPLIT: Signature / Featured Hole ── */}
      {galleryImages[0] && (
        <section className="grid md:grid-cols-2 min-h-screen">
          <SplitImage src={galleryImages[0]} alt={course.featuredHole?.title || "Course feature"} num={course.featuredHole ? "15" : "01"} />
          <div className="flex flex-col justify-center px-[clamp(32px,5vw,80px)] py-[clamp(48px,8vw,120px)]">
            <Reveal><div className="text-[10px] tracking-[5px] uppercase text-accent font-medium mb-5">{course.featuredHole ? "Signature Hole" : "The Course"}</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal leading-[1.1] tracking-[-.02em] mb-6">
                {course.featuredHole?.title ? (
                  <>The <em className="italic text-accent">{course.featuredHole.title.replace(/^The\s*/i, "")}</em></>
                ) : (
                  <>An Exceptional <em className="italic text-accent">Experience</em></>
                )}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[15px] text-dim leading-[1.8] font-light max-w-[480px]">
                {course.featuredHole?.description || para1}
              </p>
            </Reveal>
            {course.yardage && (
              <Reveal delay={0.3}>
                <div className="inline-block mt-6 p-5 px-8 border border-accent/10 rounded-[20px] bg-accent/[.04]">
                  <strong className="font-display text-[28px] text-accent block mb-1">{course.yardage.toLocaleString()} yards</strong>
                  <span className="text-xs text-dim tracking-[1px] uppercase">From championship tees</span>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ── SPLIT 2 (reversed): The Experience ── */}
      {galleryImages[1] && (
        <section className="grid md:grid-cols-2 min-h-screen" style={{ direction: "rtl" }}>
          <SplitImage src={galleryImages[1]} alt="Course view" num={course.par ? String(course.par) : "02"} />
          <div className="flex flex-col justify-center px-[clamp(32px,5vw,80px)] py-[clamp(48px,8vw,120px)]" style={{ direction: "ltr" }}>
            <Reveal><div className="text-[10px] tracking-[5px] uppercase text-accent font-medium mb-5">The Experience</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal leading-[1.1] tracking-[-.02em] mb-6">
                Championship <em className="italic text-accent">Golf & Beauty</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[15px] text-dim leading-[1.8] font-light max-w-[480px]">{para2}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="inline-block mt-6 p-5 px-8 border border-accent/10 rounded-[20px] bg-accent/[.04]">
                <strong className="font-display text-[28px] text-accent block mb-1">20+ Years</strong>
                <span className="text-xs text-dim tracking-[1px] uppercase">Golf the High Sierra · Expert Group Planning</span>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ── BIG NUMBERS ── */}
      {bigNums.length > 0 && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-px py-[clamp(80px,14vh,160px)] px-[clamp(24px,5vw,80px)] bg-black/[.025]">
          {bigNums.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="py-[clamp(32px,4vw,60px)] text-center group">
                <div className="font-display text-[clamp(48px,7vw,88px)] font-normal leading-none group-hover:text-accent transition-colors duration-400">
                  <Counter target={s.val} comma={s.comma} />
                </div>
                <div className="text-[10px] tracking-[3px] uppercase text-dim mt-2">{s.label}</div>
                <div className="mx-auto mt-3 w-0 h-px bg-accent group-hover:w-[60%] transition-all duration-600" />
              </div>
            </Reveal>
          ))}
        </section>
      )}

      {/* ── Separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ── AUTO-SCROLL GALLERY ── */}
      {galleryImages.length > 0 && (
        <section className="py-[clamp(80px,12vh,140px)] overflow-hidden">
          <div className="px-[clamp(24px,5vw,80px)] mb-12">
            <Reveal><div className="text-[10px] tracking-[5px] uppercase text-accent font-medium mb-3">Gallery</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal tracking-[-.02em]">
                See <em className="italic text-accent">{firstName}</em>
              </h2>
            </Reveal>
          </div>
          <div className="flex gap-5 px-[clamp(24px,5vw,80px)] animate-marquee hover:[animation-play-state:paused]">
            {marqueeImages.map((img, i) => (
              <div
                key={i}
                className="flex-none w-[clamp(300px,35vw,500px)] aspect-[3/2] rounded-2xl overflow-hidden relative group cursor-pointer"
                onClick={() => setLbIndex(i % galleryImages.length)}
                data-hover
              >
                <Image
                  src={img} alt={`${course.name} ${(i % galleryImages.length) + 1}`} fill
                  className="object-cover brightness-75 saturate-110 group-hover:brightness-[.85] group-hover:saturate-[1.2] group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width:768px) 80vw, 35vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h4 className="font-display text-lg text-white">{course.name}</h4>
                  <p className="text-[11px] text-dim mt-1">Photo {(i % galleryImages.length) + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ── FULLBLEED SECTION ── */}
      {galleryImages[0] && (
        <section className="relative h-[80vh] min-h-[500px] overflow-hidden flex items-center">
          <div className="absolute inset-0">
            <Image src={course.heroImage || galleryImages[0]} alt={course.name} fill className="object-cover brightness-[.35] saturate-[1.2]" sizes="100vw" />
          </div>
          <div className="relative z-[2] px-[clamp(24px,5vw,80px)] max-w-[700px]">
            <Reveal><div className="text-[10px] tracking-[5px] uppercase text-accent-light font-medium mb-5">Group Golf</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(36px,5vw,64px)] font-normal leading-[1.1] tracking-[-.02em] mb-5 text-white">
                Built for <em className="italic text-accent">Groups</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[15px] text-white/60 leading-[1.8] font-light">
                From 8 to 100 players. Consecutive tee times, rooming lists, comps for organizers. Whether it&apos;s a buddy trip, corporate outing, or charity tournament — our team handles every detail so you can focus on the game.
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ── FACILITIES ── */}
      {facilities.length > 0 && (
        <section className="py-[clamp(80px,12vh,140px)] px-[clamp(24px,5vw,80px)]">
          <Reveal><div className="text-[10px] tracking-[5px] uppercase text-accent font-medium mb-3">Amenities</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal tracking-[-.02em] mb-10">
              On <em className="italic text-accent">Course</em>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            {facilities.map((f, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div className="py-4 px-5 border border-black/[.04] rounded-2xl hover:border-accent/20 hover:bg-accent/[.03] transition-all duration-400 text-[15px] font-light text-ink">{f}</div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ── LOCATION / DISTANCES ── */}
      {addr?.streetAddress && (
        <section className="py-[clamp(80px,12vh,140px)] px-[clamp(24px,5vw,80px)]">
          <Reveal><div className="text-[10px] tracking-[5px] uppercase text-accent font-medium mb-3">Location</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal tracking-[-.02em] mb-2">
              Getting to <em className="italic text-accent">{firstName}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-sm text-dim font-light mt-2 mb-12">
              {addr.streetAddress}, {addr.addressLocality}, {addr.addressRegion} {addr.postalCode}
              {course.phone && <> · <a href={`tel:${course.phone}`} className="text-accent hover:text-accent-light transition-colors">{course.phone}</a></>}
            </p>
          </Reveal>

          {distances.length > 0 && (
            <div className="grid md:grid-cols-2 gap-x-[clamp(40px,6vw,80px)] max-w-[800px]">
              {distances.map((d, i) => (
                <Reveal key={i} delay={0.04 * i}>
                  <div className="flex justify-between py-[18px] border-b border-black/[.04] hover:pl-3 hover:border-accent/20 transition-all duration-300">
                    <span className="text-sm font-normal">{d.replace(/^\d+\s*(minutes?|mins?)\s*(from\s*)?/i, "")}</span>
                    <span className="text-sm text-accent font-medium">{d.match(/^\d+/)?.[0]} min</span>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/* Map embed */}
          {course.geo && (course.geo as CourseGeo).latitude && (
            <Reveal delay={0.2}>
              <div className="mt-12 rounded-2xl overflow-hidden aspect-[2/1] max-w-[800px]">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12000!2d${(course.geo as CourseGeo).longitude}!3d${(course.geo as CourseGeo).latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s!5e0!3m2!1sen!2sus`}
                  className="w-full h-full border-0 saturate-50 contrast-110" loading="lazy"
                />
              </div>
            </Reveal>
          )}
        </section>
      )}

      {/* ── Separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ── FAQ ── */}
      {course.faqs.length > 0 && (
        <section className="py-[clamp(80px,12vh,140px)] px-[clamp(24px,5vw,80px)] max-w-[800px] mx-auto">
          <Reveal><div className="text-[10px] tracking-[5px] uppercase text-accent font-medium mb-3">FAQ</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal tracking-[-.02em] mb-10">
              Common <em className="italic text-accent">Questions</em>
            </h2>
          </Reveal>
          {course.faqs.map((f, i) => (
            <Reveal key={i} delay={0.1 + i * 0.06}>
              <FAQ q={f.question} a={f.answer} />
            </Reveal>
          ))}
        </section>
      )}

      {/* ── Separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ── RELATED COURSES ── */}
      {relatedCourses.length > 0 && (
        <section className="py-[clamp(80px,12vh,140px)] px-[clamp(24px,5vw,80px)]">
          <Reveal><div className="text-[10px] tracking-[5px] uppercase text-accent font-medium mb-3">Nearby Courses</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-normal tracking-[-.02em] mb-10">
              More in <em className="italic text-accent">{course.regionLabel}</em>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {relatedCourses.map((rc, i) => (
              <Reveal key={rc.slug} delay={0.08 + i * 0.06}>
                <Link href={`/portfolio/${rc.slug}/`}>
                  <div className="bg-white border border-black/[.04] rounded-2xl overflow-hidden group hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,.07)] hover:border-transparent transition-all duration-500">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      {rc.heroImage ? (
                        <Image src={rc.heroImage} alt={rc.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width:768px) 100vw, 33vw" />
                      ) : (
                        <div className="w-full h-full bg-bone" />
                      )}
                      {rc.priceRange && <span className="absolute top-3 right-3 bg-ink text-white px-3 py-1 rounded-full text-[10px] font-semibold">{rc.priceRange}</span>}
                    </div>
                    <div className="p-5">
                      <h4 className="font-display text-lg font-normal text-ink mb-1">{rc.name}</h4>
                      <div className="text-[10px] text-dim uppercase tracking-wider mb-3">{rc.regionLabel}</div>
                      <div className="flex items-center justify-between pt-3 border-t border-black/[.04]">
                        {rc.rating && <div className="flex items-center gap-1 text-xs text-ink-3"><Star className="w-3 h-3 text-accent fill-accent" /> {rc.rating.value}</div>}
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

      {/* ── Separator ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ── CTA ── */}
      <section className="py-[clamp(100px,16vh,200px)] px-[clamp(24px,5vw,80px)] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,168,83,.08),transparent_70%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="relative">
          <Reveal><div className="text-[10px] tracking-[5px] uppercase text-accent font-medium mb-3">Book {firstName}</div></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-[clamp(40px,6vw,80px)] font-normal leading-none tracking-[-.03em] mb-5">
              Play <em className="italic text-accent">{firstName}</em><br />With Your Group
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[15px] text-dim leading-[1.7] max-w-[500px] mx-auto mb-8 font-light">
              {course.priceRange ? `Stay-and-play packages from ${course.priceRange.split("–")[0]}/golfer. ` : ""}Tee times, lodging, dining — one call does it all.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent/[.08] border border-accent/10 text-[11px] text-accent font-medium mb-9">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              Weekend tee times limited in peak season
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/contact-custom-golf-package/"
                className="inline-block px-12 py-[18px] bg-accent text-white rounded-full text-xs font-semibold tracking-[2px] uppercase hover:bg-accent-light hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(212,168,83,.2)] transition-all duration-400"
                data-hover
              >
                Plan My {firstName} Trip
              </Link>
              <a
                href="tel:+18885848232"
                className="inline-block px-12 py-[18px] border border-black/15 text-dim rounded-full text-xs font-medium tracking-[2px] uppercase hover:border-ink hover:text-ink transition-all duration-400"
                data-hover
              >
                Call 888-584-8232
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lbIndex !== null && <Lightbox images={galleryImages} startIndex={lbIndex} onClose={() => setLbIndex(null)} name={course.name} />}

      {/* ── Keyframe animations ── */}
      <style jsx global>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(100%) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      `}</style>
    </div>
  );
}
