'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

/* ── Types ── */
interface CourseProps {
  slug: string; name: string; region: string; regionLabel: string;
  description: string; holes: number; par: number; designer: string;
  heroImage: string; images: string[]; videoUrl?: string;
  address: { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string };
  geo: { latitude?: number; longitude?: number };
  phone: string; website: string; priceRange: string;
  rating: { value: number; count: number };
  faqs: { question: string; answer: string }[];
  meta: { title: string; description: string };
  bodyText: string[]; tips: { title: string; content: string }[];
  facilities: string[]; pointOfView: string;
  contentParagraphs: string[]; featuredHole: { title: string; description: string };
  distances?: string[]; yardage: number; slope: number; courseRating: number; yearBuilt: number;
  hack?: string; teeTimeInfo?: string; teeTips?: string[];
}

/* ── Helpers ── */
function parseDistances(bodyText: string[]): { place: string; mins: number }[] {
  const out: { place: string; mins: number }[] = [];
  for (const block of bodyText) {
    const lines = block.split('\n');
    for (const l of lines) {
      const m = l.match(/(\d+)\s*[Mm]inutes?\s*(?:from|–)\s*(.+)/);
      if (m) out.push({ mins: parseInt(m[1]), place: m[2].trim() });
    }
  }
  return out;
}
function isLogo(url: string) { return /golfball|logo|tee_/i.test(url) && /\.png/i.test(url); }
function isScorecard(url: string) { return /scorecard/i.test(url); }
function cleanName(name: string): { before: string; em: string } {
  const words = name.split(' ');
  if (words.length <= 2) return { before: '', em: name };
  const em = words.slice(-2).join(' ');
  const before = words.slice(0, -2).join(' ');
  return { before, em };
}

/* ── Scroll Reveal hook ── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold, rootMargin: '-30px' });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}
function R({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(50px)', transition: `opacity 1s cubic-bezier(.16,1,.3,1) ${delay}s, transform 1s cubic-bezier(.16,1,.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

/* ── Counter component ── */
function Counter({ target, comma = false }: { target: number; comma?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1800, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, [target]);
  return <div ref={ref}>{comma ? val.toLocaleString() : val}</div>;
}

/* ── Canvas Particles ── */
function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const pts: { x: number; y: number; s: number; vx: number; vy: number; o: number }[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < 50; i++) pts.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, s: Math.random() * 1.5 + .5, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, o: Math.random() * .35 + .1 });
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 120) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - d / 120)})`; ctx.lineWidth = .5; ctx.stroke(); }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none opacity-30" />;
}

/* ── Custom Cursor ── */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return;
    let cx = 0, cy = 0, dx = 0, dy = 0;
    const move = (e: MouseEvent) => { cx = e.clientX; cy = e.clientY; if (dotRef.current) { dotRef.current.style.left = cx + 'px'; dotRef.current.style.top = cy + 'px'; } };
    const loop = () => { dx += (cx - dx) * .12; dy += (cy - dy) * .12; if (cursorRef.current) { cursorRef.current.style.left = dx + 'px'; cursorRef.current.style.top = dy + 'px'; } requestAnimationFrame(loop); };
    document.addEventListener('mousemove', move);
    loop();
    const hovers = document.querySelectorAll('a,button,[data-hover]');
    const enter = () => cursorRef.current?.classList.add('cursor-hover');
    const leave = () => cursorRef.current?.classList.remove('cursor-hover');
    hovers.forEach(el => { el.addEventListener('mouseenter', enter); el.addEventListener('mouseleave', leave); });
    return () => { document.removeEventListener('mousemove', move); hovers.forEach(el => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); }); };
  }, []);
  return (
    <>
      <div ref={cursorRef} className="fixed w-3 h-3 border-[1.5px] border-[#d4a853] rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background] duration-300 hidden md:block [&.cursor-hover]:w-12 [&.cursor-hover]:h-12 [&.cursor-hover]:bg-[rgba(212,168,83,.12)] [&.cursor-hover]:border-[#e8c97a]" />
      <div ref={dotRef} className="fixed w-1 h-1 bg-[#d4a853] rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 hidden md:block" />
      <style jsx global>{`@media(min-width:768px){html{cursor:none!important}}`}</style>
    </>
  );
}

/* ── Split Image (zoom in on scroll) ── */
function SplitImage({ src, alt, num }: { src: string; alt: string; num: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative overflow-hidden">
      <Image src={src} alt={alt} fill className={`object-cover brightness-[.6] saturate-[1.2] transition-transform duration-[8000ms] ease-[cubic-bezier(.16,1,.3,1)] ${inView ? 'scale-100' : 'scale-[1.15]'}`} sizes="50vw" />
      <div className="absolute bottom-8 left-8 font-display text-[clamp(80px,12vw,160px)] font-bold text-white/[.06] leading-none">{num}</div>
    </div>
  );
}

/* ── FAQ Item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/[.05]">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-6 text-left text-[16px] font-normal text-[#1a1a18] hover:text-[#d4a853] transition-colors gap-5" style={{ fontFamily: 'var(--body)' }}>
        {q}
        <span className={`w-8 h-8 rounded-full border border-black/[.06] flex items-center justify-center text-lg text-[#8a857e] transition-all duration-400 flex-shrink-0 ${open ? 'bg-[#d4a853] text-white border-[#d4a853] rotate-45' : ''}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-[max-height] duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)] ${open ? 'max-h-[200px]' : 'max-h-0'}`}>
        <p className="pb-6 text-sm text-[#8a857e] leading-[1.8] font-light">{a}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════ */
export default function CoursePageContent({ course, relatedCourses }: { course: CourseProps; relatedCourses: CourseProps[] }) {
  const { name, regionLabel, designer, heroImage, images, holes, par, yardage, slope, yearBuilt, pointOfView, featuredHole, faqs, bodyText, tips, priceRange, phone, address, rating, contentParagraphs } = course;
  const distances = parseDistances(bodyText);
  const { before, em } = cleanName(name);
  const galleryImages = images.filter(i => !isLogo(i) && !isScorecard(i));
  const shortName = name.replace(/ Golf (Course|Club|Resort|& Country Club)/, '');
  const heroRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll effects
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${y / h})`;
      if (heroRef.current && y < window.innerHeight * 1.5) heroRef.current.style.transform = `scale(${1.1 + y * .00005}) translateY(${y * .3}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Description for sub-header
  const firstParagraph = contentParagraphs?.[0] || featuredHole?.description || '';

  return (
    <div className="font-sans overflow-x-hidden" style={{ background: '#f7f5f0', color: '#1a1a18', fontFamily: '"DM Sans",system-ui,sans-serif' }}>
      <CustomCursor />

      {/* Progress */}
      <div ref={progressRef} className="fixed top-0 left-0 h-px bg-[#d4a853] z-[10001]" style={{ transformOrigin: 'left', transform: 'scaleX(0)', width: '100%' }} />

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div ref={heroRef} className="absolute -inset-[60px]" style={{ background: `url(${heroImage}) center/cover`, filter: 'brightness(.35) saturate(1.3)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,.7))' }} />
        <HeroCanvas />

        <div className="relative z-[2] text-center max-w-[900px] px-6">
          <div className="text-[11px] tracking-[6px] uppercase text-white/40 mb-6 overflow-hidden">
            <span className="inline-block animate-[slideUp_.8s_cubic-bezier(.16,1,.3,1)_.3s_forwards] opacity-0 translate-y-full">{regionLabel} · Est. {yearBuilt} </span>
          </div>
          <h1 className="font-display font-normal text-[clamp(48px,10vw,120px)] leading-[.9] tracking-[-.04em] text-white">
            <span className="block overflow-hidden"><span className="inline-block animate-[slideUp_1s_cubic-bezier(.16,1,.3,1)_.4s_forwards] opacity-0 translate-y-[110%]">{before || name.split(' ')[0]}</span></span>
            <span className="block overflow-hidden"><span className="inline-block animate-[slideUp_1s_cubic-bezier(.16,1,.3,1)_.55s_forwards] opacity-0 translate-y-[110%]"><em className="italic text-[#d4a853]">{em || name}</em></span></span>
          </h1>
          <div className="flex gap-[clamp(20px,4vw,48px)] justify-center mt-10 animate-[fadeIn_1s_ease_.9s_forwards] opacity-0">
            {[{ v: holes, l: 'Holes' }, null, { v: par, l: 'Par' }, null, { v: yardage.toLocaleString(), l: 'Yards' }, null, { v: slope, l: 'Slope' }, null, { v: rating.value, l: 'Rating' }].map((s, i) =>
              s === null ? <div key={i} className="w-px h-10 bg-white/15 self-center" /> :
              <div key={i} className="text-center"><div className="font-display text-[clamp(24px,3.5vw,44px)] font-normal text-white leading-none">{s.v}</div><div className="text-[9px] tracking-[2px] uppercase text-white/40 mt-1">{s.l}</div></div>
            )}
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 animate-[fadeIn_1s_ease_1.2s_forwards] opacity-0">
          <span className="text-[8px] tracking-[3px] uppercase text-white/40">Discover</span>
          <div className="w-px h-12 relative overflow-hidden"><div className="absolute -top-12 left-0 w-px h-12 bg-gradient-to-b from-transparent to-[#d4a853] animate-[scrollDrop_2s_ease-in-out_infinite]" /></div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ═══ SPLIT: SIGNATURE HOLE ═══ */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
        <SplitImage src={galleryImages[0] || heroImage} alt={name} num={featuredHole?.title?.match(/\d+/)?.[0] || '15'} />
        <div className="flex flex-col justify-center px-[clamp(32px,5vw,80px)] py-[clamp(48px,8vw,120px)]">
          <R><div className="text-[10px] tracking-[5px] uppercase text-[#d4a853] font-medium mb-5">Signature Hole</div></R>
          <R delay={0.1}><h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal leading-[1.1] tracking-[-.02em] mb-6">{featuredHole?.title || 'The Signature Hole'}</h2></R>
          <R delay={0.2}><p className="text-[15px] text-[#8a857e] leading-[1.8] font-light max-w-[480px]">{featuredHole?.description}</p></R>
          {yardage > 0 && (
            <R delay={0.3}>
              <div className="inline-block mt-6 px-8 py-5 border border-[rgba(212,168,83,.12)] rounded-[20px] bg-[rgba(212,168,83,.05)]">
                <strong className="font-display text-[28px] text-[#d4a853] block">{yardage.toLocaleString()} yards</strong>
                <span className="text-[12px] text-[#8a857e] tracking-[1px] uppercase">From championship tees</span>
              </div>
            </R>
          )}
        </div>
      </section>

      {/* ═══ SPLIT: THE EXPERIENCE (reversed) ═══ */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
        <div className="flex flex-col justify-center px-[clamp(32px,5vw,80px)] py-[clamp(48px,8vw,120px)] md:order-1">
          <R><div className="text-[10px] tracking-[5px] uppercase text-[#d4a853] font-medium mb-5">The Experience</div></R>
          <R delay={0.1}><h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal leading-[1.1] tracking-[-.02em] mb-6">An Exceptional Blend of <em className="italic text-[#d4a853]">Challenge &amp; Beauty</em></h2></R>
          <R delay={0.2}><p className="text-[15px] text-[#8a857e] leading-[1.8] font-light max-w-[480px]">{pointOfView}</p></R>
          <R delay={0.3}>
            <div className="inline-block mt-6 px-8 py-5 border border-[rgba(212,168,83,.12)] rounded-[20px] bg-[rgba(212,168,83,.05)]">
              <strong className="font-display text-[28px] text-[#d4a853] block">20+ Years</strong>
              <span className="text-[12px] text-[#8a857e] tracking-[1px] uppercase">Golf the High Sierra · Expert Group Planning</span>
            </div>
          </R>
        </div>
        <div className="md:order-2">
          <SplitImage src={galleryImages[1] || heroImage} alt={name} num={String(par)} />
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ═══ BIG NUMBERS ═══ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/[.025] px-[clamp(24px,5vw,80px)] py-[clamp(80px,14vh,160px)]">
        {[{ v: holes, l: 'Holes' }, { v: yardage, l: 'Yards', comma: true }, { v: yearBuilt, l: 'Established' }, { v: rating.count, l: 'Reviews', comma: true }].map((s, i) => (
          <R key={i} delay={i * .1}>
            <div className="text-center py-[clamp(32px,4vw,60px)] group relative">
              <div className="font-display text-[clamp(48px,7vw,88px)] font-normal leading-none group-hover:text-[#d4a853] transition-colors duration-400"><Counter target={s.v} comma={s.comma} /></div>
              <div className="text-[10px] tracking-[3px] uppercase text-[#8a857e] mt-2">{s.l}</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#d4a853] group-hover:w-[60%] transition-all duration-600" />
            </div>
          </R>
        ))}
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ═══ AUTO-SCROLL GALLERY ═══ */}
      {galleryImages.length > 0 && (
        <section className="py-[clamp(80px,12vh,140px)] overflow-hidden">
          <div className="px-[clamp(24px,5vw,80px)] mb-12">
            <R><div className="text-[10px] tracking-[5px] uppercase text-[#d4a853] font-medium">Gallery</div></R>
            <R delay={0.1}><h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal tracking-[-.02em] mt-3">See <em className="italic text-[#d4a853]">{shortName}</em></h2></R>
          </div>
          <div className="flex gap-5 px-[clamp(24px,5vw,80px)] animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
            {[...galleryImages, ...galleryImages].map((img, i) => (
              <div key={i} className="flex-none w-[clamp(300px,35vw,500px)] aspect-[3/2] rounded-2xl overflow-hidden relative group" data-hover>
                <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover brightness-75 saturate-110 group-hover:brightness-[.85] group-hover:saturate-[1.2] group-hover:scale-105 transition-all duration-700" sizes="40vw" />
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h4 className="font-display text-lg text-white">{name}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ═══ FULL BLEED: GROUPS ═══ */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0"><Image src={heroImage} alt={name} fill className="object-cover brightness-[.35] saturate-[1.2]" sizes="100vw" /></div>
        <div className="relative z-[2] px-[clamp(24px,5vw,80px)] max-w-[700px] text-white">
          <R><div className="text-[10px] tracking-[5px] uppercase text-[#e8c97a] font-medium mb-5">Group Golf</div></R>
          <R delay={0.1}><h2 className="font-display text-[clamp(36px,5vw,64px)] font-normal leading-[1.1] tracking-[-.02em] mb-5 text-white">Built for <em className="italic text-[#d4a853]">Groups</em></h2></R>
          <R delay={0.2}><p className="text-[15px] text-white/50 leading-[1.8] font-light">From 8 to 100 players. Consecutive tee times, rooming lists, comps for organizers. Whether it&rsquo;s a buddy trip, corporate outing, or charity tournament — our team handles every detail so you can focus on the game.</p></R>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ═══ LOCATION ═══ */}
      {distances.length > 0 && (
        <section className="px-[clamp(24px,5vw,80px)] py-[clamp(80px,12vh,140px)]">
          <R><div className="text-[10px] tracking-[5px] uppercase text-[#d4a853] font-medium">Location</div></R>
          <R delay={0.1}><h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal tracking-[-.02em] mt-3">Getting to <em className="italic text-[#d4a853]">{shortName}</em></h2></R>
          <R delay={0.2}><p className="text-sm text-[#8a857e] mt-2 font-light">{address.streetAddress}, {address.addressLocality}, {address.addressRegion} {address.postalCode} · <a href={`tel:${phone}`} className="text-[#d4a853]">{phone}</a></p></R>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(40px,6vw,80px)] max-w-[800px] mt-12">
            {distances.map((d, i) => (
              <R key={i} delay={Math.min(i * .05, .4)}>
                <div className="flex justify-between py-[18px] border-b border-black/[.04] hover:pl-3 transition-all text-sm">
                  <span className="font-normal">{d.place}</span>
                  <span className="text-[#d4a853] font-medium">{d.mins} min</span>
                </div>
              </R>
            ))}
          </div>
        </section>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ═══ FAQ ═══ */}
      {faqs.length > 0 && (
        <section className="px-[clamp(24px,5vw,80px)] py-[clamp(80px,12vh,140px)] max-w-[800px] mx-auto">
          <R><div className="text-[10px] tracking-[5px] uppercase text-[#d4a853] font-medium">FAQ</div></R>
          <R delay={0.1}><h2 className="font-display text-[clamp(32px,4vw,56px)] font-normal tracking-[-.02em] mt-3 mb-10">Common <em className="italic text-[#d4a853]">Questions</em></h2></R>
          {faqs.map((f, i) => <R key={i} delay={Math.min(.1 + i * .1, .4)}><FaqItem q={f.question} a={f.answer} /></R>)}
        </section>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ═══ RELATED COURSES ═══ */}
      {relatedCourses.length > 0 && (
        <section className="px-[clamp(24px,5vw,80px)] py-[clamp(80px,12vh,140px)]" style={{ background: '#f1efec' }}>
          <R><div className="text-[10px] tracking-[5px] uppercase text-[#d4a853] font-medium">Nearby Courses</div></R>
          <R delay={0.1}><h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-normal tracking-[-.02em] mt-3">More in <em className="italic text-[#d4a853]">{regionLabel}</em></h2></R>
          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {relatedCourses.slice(0, 3).map((c, i) => (
              <R key={c.slug} delay={i * .1}>
                <Link href={`/portfolio/${c.slug}/`}>
                  <div className="bg-white border border-[#e5e2dc] rounded-[32px] overflow-hidden group hover:-translate-y-2 hover:shadow-[0_24px_64px_rgba(0,0,0,.07)] hover:border-transparent transition-all duration-500">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <Image src={c.heroImage} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                      <span className="absolute top-3 right-3 bg-[#1a1a18] text-white px-3 py-1 rounded-full text-[10px] font-semibold">{c.priceRange?.replace(/^\$/, '')}</span>
                    </div>
                    <div className="p-5">
                      <h4 className="font-display text-lg font-normal mb-1">{c.name}</h4>
                      <div className="text-[10px] text-[#8a857e] uppercase tracking-[1.5px] mb-3">{c.regionLabel}</div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#f1efec]">
                        <span className="flex items-center gap-1 text-xs text-[#8a857e]"><Star className="w-3 h-3 text-[#d4a853] fill-[#d4a853]" />{c.rating.value}</span>
                        <span className="text-[11px] text-[#d4a853] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">View Course <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              </R>
            ))}
          </div>
        </section>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(180,170,150,.25)] to-transparent" />

      {/* ═══ CTA ═══ */}
      <section className="px-[clamp(24px,5vw,80px)] py-[clamp(100px,16vh,200px)] text-center relative overflow-hidden" style={{ background: '#f7f5f0' }}>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,168,83,.08), transparent 70%)' }} />
        <div className="relative">
          <R><div className="text-[10px] tracking-[5px] uppercase text-[#d4a853] font-medium">Book {shortName}</div></R>
          <R delay={0.1}><h2 className="font-display text-[clamp(40px,6vw,80px)] font-normal leading-none tracking-[-.03em] mt-2 mb-5">Play <em className="italic text-[#d4a853]">{shortName}</em><br />With Your Group</h2></R>
          <R delay={0.2}><p className="text-[15px] text-[#8a857e] font-light max-w-[500px] mx-auto mb-8">Stay-and-play packages from {priceRange?.split('–')[0] || '$219'}/golfer. Tee times, lodging, dining — one call does it all.</p></R>
          <R delay={0.3}>
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[rgba(212,168,83,.08)] border border-[rgba(212,168,83,.12)] text-[11px] text-[#d4a853] font-medium mb-9">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] animate-[pulseDot_2s_infinite]" />
              Weekend tee times limited in peak season
            </div>
          </R>
          <R delay={0.4}>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact-custom-golf-package/" className="inline-block px-12 py-[18px] bg-[#d4a853] text-white rounded-full text-xs font-semibold tracking-[2px] uppercase hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(212,168,83,.2)] hover:bg-[#e8c97a] transition-all duration-400" data-hover>Plan My {shortName} Trip</Link>
              <a href={`tel:${phone}`} className="inline-block px-12 py-[18px] border border-black/[.15] text-[#8a857e] rounded-full text-xs font-medium tracking-[2px] uppercase hover:border-[#1a1a18] hover:text-[#1a1a18] transition-all duration-400" data-hover>Call {phone.replace('+1-', '')}</a>
            </div>
          </R>
        </div>
      </section>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes slideUp{to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{to{opacity:1}}
        @keyframes scrollDrop{0%{top:-48px}100%{top:48px}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(2)}}
      `}</style>
    </div>
  );
}
