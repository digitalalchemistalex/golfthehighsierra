'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import '@/styles/homepage.css';

/* ─── Data ─── */
const SLIDES = [
  { badge: 'Reno, Nevada', h1: 'Championship Golf Meets Casino Nightlife', p: '7 courses, 8 casino-resorts, and one company that handles everything. Group golf packages built by locals since 2004.', cta1: { text: 'Plan Your Reno Trip', href: '/group-golf-reno-tahoe/' }, cta2: { text: 'View Reno Courses', href: '/best-golf-courses-reno/' }, img: '/images/homepage/homepage-01.jpg', alt: 'Reno Nevada skyline and Sierra Nevada mountains' },
  { badge: 'Lake Tahoe', h1: 'Alpine Golf at 6,200 Feet Elevation', p: 'Edgewood, Incline Village, and Old Greenwood — lakefront and mountain courses your group will talk about for years.', cta1: { text: 'Explore Tahoe Packages', href: '/best-golf-courses-lake-tahoe/' }, cta2: { text: 'View Tahoe Courses', href: '/best-golf-courses-lake-tahoe/' }, img: '/images/homepage/homepage-02.jpg', alt: 'Edgewood Tahoe 18th hole Lake Tahoe' },
  { badge: 'Truckee / North Tahoe', h1: 'Mountain Courses Through Towering Pines', p: "Old Greenwood, Coyote Moon, Gray's Crossing, Tahoe Donner — stay in Truckee villas, play championship courses.", cta1: { text: 'Truckee Packages', href: '/group-golf-reno-tahoe/' }, cta2: { text: 'View Courses', href: '/best-golf-courses-reno/' }, img: '/images/homepage/homepage-03.jpg', alt: 'Old Greenwood Golf Course Truckee California' },
  { badge: 'Carson Valley', h1: 'Sierra Panoramas at Half the Price', p: 'Genoa Lakes, Dayton Valley, Toiyabe — uncrowded courses with mountain backdrops and the best value in the region.', cta1: { text: 'Carson Valley Trips', href: '/group-golf-reno-tahoe/' }, cta2: { text: 'View Courses', href: '/best-golf-courses-reno/' }, img: '/images/homepage/homepage-04.jpg', alt: 'Genoa Lakes Golf Club Carson Valley Nevada' },
  { badge: '10,000+ Trips Planned', h1: 'One Call. One Contract. Zero Hassle.', p: '20+ years arranging group golf across Reno, Tahoe, and Carson Valley. Courses, hotels, dining, transport — we book it all.', cta1: { text: 'Request a Free Quote', href: '/contact-custom-golf-package/' }, cta2: { text: 'Call 888-584-8232', href: 'tel:+18885848232' }, img: '/images/homepage/homepage-05.jpg', alt: 'Red Hawk Golf Resort group golf outing' },
];
const TAB_LABELS = ['\u{1F4CD} Reno', '\u{1F4CD} Lake Tahoe', '\u{1F4CD} Truckee', '\u{1F4CD} Carson Valley', '\u{1F4CD} Overview'];

const TRUST = [
  { icon: '\u{1F3C6}', num: 20, suffix: '+', label: 'Years', sub: 'Serving Groups Since 2004' },
  { icon: '\u{26F3}', num: 10000, suffix: '+', label: 'Outings', sub: 'Planned & Executed' },
  { icon: '\u{1F3E8}', num: 20, suffix: '+', label: 'Courses', sub: 'Hotels, Casinos & Resorts' },
  { icon: '\u{2B50}', num: 0, suffix: '', label: '4.8/5 Rating', sub: '672 Verified Reviews' },
];

const EXP_CARDS = [
  { img: '/images/homepage/homepage-07.webp', alt: 'Championship golf course', icon: '\u{26F3}', title: '20+ Courses', sub: 'Championship golf across 5 regions' },
  { img: '/images/homepage/homepage-08.webp', alt: 'Fine dining Reno casino', icon: '\u{1F37D}', title: 'Dining', sub: 'Casino restaurants & private events' },
  { img: '/images/homepage/homepage-09.webp', alt: 'Resort pool Peppermill Reno', icon: '\u{1F3E8}', title: 'Resorts & Casinos', sub: 'Atlantis, Peppermill, Grand Sierra & more' },
  { img: '/images/homepage/homepage-10.webp', alt: 'Old Greenwood villa lodging Truckee', icon: '\u{1F3E1}', title: 'Villa Lodging', sub: 'Mountain villas & private cabins' },
];

const REGIONS = [
  { name: 'Reno', subtitle: 'Casino Golf Capital', badge: '7 Courses', price: 'From $189', img: '/images/homepage/homepage-11.jpg', alt: 'Lakeridge Golf Course Reno NV', chips: ['Lakeridge', 'ArrowCreek', 'Red Hawk', 'Wolf Run', 'Somersett'], hotels: '\u{1F3E8} Atlantis \u00B7 Peppermill \u00B7 Grand Sierra Resort \u00B7 Eldorado', rating: '4.8 (290 reviews)', href: '/group-golf-reno-tahoe/' },
  { name: 'Lake Tahoe', subtitle: 'Lakefront & Alpine', badge: '3 Courses', price: 'From $299', img: '/images/homepage/homepage-12.jpg', alt: 'Incline Village Championship Course Lake Tahoe', chips: ['Edgewood Tahoe', 'Incline Village'], hotels: '\u{1F3E8} Hyatt Regency \u00B7 Harrah\u2019s \u00B7 Harvey\u2019s \u00B7 Margaritaville', rating: '4.9 (185 reviews)', href: '/best-golf-courses-lake-tahoe/' },
  { name: 'Truckee', subtitle: 'Mountain Championship', badge: '4 Courses', price: 'From $249', img: '/images/homepage/homepage-13.jpg', alt: "Gray's Crossing Golf Course Truckee CA", chips: ['Old Greenwood', 'Coyote Moon', "Gray's Crossing", 'Tahoe Donner'], hotels: '\u{1F3E8} Gravity Haus \u00B7 Hampton Inn \u00B7 Old Greenwood Villas', rating: '4.8 (120 reviews)', href: '/group-golf-reno-tahoe/' },
  { name: 'Graeagle', subtitle: 'Hidden Gem of the Sierra', badge: '4 Courses', price: 'From $179', img: '/images/homepage/homepage-16.jpg', alt: 'Plumas Pines Golf Resort Graeagle California', chips: ['Plumas Pines', 'Graeagle Meadows', 'Whitehawk Ranch', 'Nakoma Dragon'], hotels: '\u{1F3E8} Chalet View Lodge \u00B7 River Pines Resort \u00B7 The Inn at Nakoma', rating: '4.8 (88 reviews)', href: '/group-golf-reno-tahoe/' },
  { name: 'Carson Valley', subtitle: 'Best Value in the Sierra', badge: '4 Courses', price: 'From $149', img: '/images/homepage/homepage-14.jpg', alt: 'Dayton Valley Golf Club Carson Valley NV', chips: ['Genoa Lakes', 'Dayton Valley', 'Toiyabe', 'Eagle Valley'], hotels: '\u{1F3E8} Carson Valley Inn \u00B7 Holiday Inn \u00B7 Budget-friendly options', rating: '4.7 (77 reviews)', href: '/group-golf-reno-tahoe/' },
];

const TESTIMONIALS = [
  { stars: 5, quote: "We've used Golf the High Sierra for our annual corporate outing 6 years running. One phone call and everything is handled. The registration portal alone saves me 20 hours.", author: 'Mark T.', meta: 'Google \u00B7 Corporate Group of 32', avatar: 'M' },
  { stars: 5, quote: "Organized a 24-person buddies trip. Everyone paid directly through the portal \u2014 I didn't chase a single dollar. Courses were perfectly matched to our skill mix.", author: 'Steve R.', meta: 'TripAdvisor \u00B7 Leisure Group', avatar: 'S' },
  { stars: 5, quote: "From lodging to dinner reservations to the shuttle \u2014 everything was arranged before we arrived. Best group golf experience we've ever had, hands down.", author: 'David L.', meta: 'Yelp \u00B7 Mixed Group of 16', avatar: 'D' },
];

const FAQS = [
  { q: 'What is included in a Golf the High Sierra package?', a: 'Every package includes tee times at your chosen courses, lodging at partner hotels or casinos, and access to our proprietary online registration portal. Add dining reservations, ground transportation, non-golfer activities, and corporate event planning as needed.' },
  { q: 'How many people can be in a group?', a: 'We handle groups from 4 to 400+ people. Small buddies trips, mid-size corporate outings, full conferences with breakout sessions \u2014 we scale planning to fit your size and budget.' },
  { q: 'What golf courses are available in the Reno Tahoe area?', a: "We partner with 20+ courses: Reno (Lakeridge, ArrowCreek, Red Hawk, Wolf Run, Somersett, Washoe), Lake Tahoe (Edgewood, Incline Village), Truckee (Old Greenwood, Coyote Moon, Gray's Crossing, Tahoe Donner), and Carson Valley (Genoa Lakes, Dayton Valley, Toiyabe)." },
  { q: 'How does the one contract / one deposit process work?', a: 'We book everything on your behalf \u2014 hotels, courses, dining, transport. You get one contract covering all arrangements and one deposit to secure them. Your group members register and pay through our online portal. No chasing payments.' },
  { q: 'Can non-golfers join the trip?', a: 'Absolutely. We arrange spa packages, lake cruises, hiking, wine tours, and casino entertainment. Non-golfer packages can be built into the same group registration so everyone books through one portal.' },
];

const JOURNEY_STEPS = [
  { icon: '\u{1F4DE}', title: 'You Call, We Listen', desc: "Share your dates, group size, budget & wish list. Want Edgewood at sunset? A casino dinner for 40? We've heard it all.", tag: '\u23F1 Takes 10 minutes' },
  { icon: '\u{1F5FA}\uFE0F', title: 'We Design Your Trip', desc: 'Courses matched to your skill mix, hotels that fit the vibe, dinner spots, shuttles \u2014 one package, one contract, one deposit.', tag: '\u{1F4CB} Custom quote in 24 hrs' },
  { icon: '\u{1F4F1}', title: 'Your Group Registers', desc: "Everyone gets a link to our TripsCaddie portal \u2014 they pick their options, pay their share, done. Zero chasing.", tag: '\u{1F4B8} No more Venmo chaos' },
  { icon: '\u{26F3}', title: 'Show Up & Play', desc: "Tee times confirmed, rooms ready, dinners booked. Your only job? Enjoy the round and take all the credit.", tag: '\u{1F3CC}\uFE0F You\'re the hero' },
];

/* ─── Hooks ─── */
function useCountUp(target: number, suffix: string, isVisible: boolean) {
  const [value, setValue] = useState('0' + suffix);
  const counted = useRef(false);
  useEffect(() => {
    if (!isVisible || counted.current || target === 0) return;
    counted.current = true;
    const duration = 1800;
    const start = performance.now();
    function tick(now: number) {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setValue(Math.round(eased * target).toLocaleString() + suffix);
      if (pct < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isVisible, target, suffix]);
  return value;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function Anim({ children, className = '', delay = 0, direction = '', style }: { children: React.ReactNode; className?: string; delay?: number; direction?: string; style?: any }) {
  const { ref, visible } = useInView();
  const cls = direction === 'left' ? 'anim-left' : direction === 'right' ? 'anim-right' : direction === 'scale' ? 'anim-scale' : 'anim';
  return <div ref={ref} className={`${cls} ${visible ? 'show' : ''} ${className}`} style={{ ...(delay ? { transitionDelay: `${delay}s` } : {}), ...style }}>{children}</div>;
}

function TrustNum({ target, suffix, isVisible }: { target: number; suffix: string; isVisible: boolean }) {
  const val = useCountUp(target, suffix, isVisible);
  return <span className="trust-num">{val}</span>;
}

export default function HomepageContent() {
  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const progressRef = useRef<ReturnType<typeof setInterval>>();
  const trustInView = useInView(0.1);

  const goTo = useCallback((n: number) => { setSlide(n); setProgress(0); }, []);

  useEffect(() => {
    const DURATION = 6000;
    const startTime = Date.now();
    clearInterval(progressRef.current);
    progressRef.current = setInterval(() => { setProgress(Math.min((Date.now() - startTime) / DURATION, 1)); }, 50);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => { setSlide(prev => (prev + 1) % SLIDES.length); setProgress(0); }, DURATION);
    return () => { clearInterval(timerRef.current); clearInterval(progressRef.current); };
  }, [slide]);

  const handleNav = (n: number) => { clearInterval(timerRef.current); clearInterval(progressRef.current); goTo(n); };

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < 800) {
            const active = document.querySelector('.hero-slide.active img') as HTMLElement;
            if (active) active.style.transform = `scale(${1 + y * 0.0001}) translateY(${y * 0.15}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="homepage">
      <section className="hero">
        {SLIDES.map((s, i) => (
          <div key={i} className={`hero-slide${i === slide ? ' active' : ''}`} data-i={i}>
            <img src={s.img} alt={s.alt} />
            <div className="hero-ov" />
            <div className="hero-inner">
              <div className="hero-badge"><div className="badge-dot" /> {s.badge}</div>
              <h1>{s.h1}</h1>
              <p>{s.p}</p>
              <div className="hero-btns"><Link href={s.cta1.href} className="btn-w">{s.cta1.text}</Link><Link href={s.cta2.href} className="btn-ow">{s.cta2.text}</Link></div>
            </div>
          </div>
        ))}
        <div className="hero-progress"><div className="hero-progress-bar" style={{ width: `${progress * 100}%`, transition: 'width 50ms linear' }} /></div>
        <div className="hero-nav">{SLIDES.map((_, i) => <button key={i} className={i === slide ? 'active' : ''} onClick={() => handleNav(i)}>&nbsp;</button>)}</div>
        <div className="hero-tabs">{TAB_LABELS.map((label, i) => <button key={i} className={`hero-tab${i === slide ? ' active' : ''}`} onClick={() => handleNav(i)}>{label}</button>)}</div>
      </section>

      <div className="trust" ref={trustInView.ref}>
        {TRUST.map((t, i) => (
          <div key={i} className="trust-chip">
            <div className="trust-icon">{t.icon}</div>
            <div className="trust-txt">
              <strong>{t.num > 0 ? <><TrustNum target={t.num} suffix={t.suffix} isVisible={trustInView.visible} /> {t.label}</> : t.label}</strong>
              <span>{t.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="contract"><div className="contract-grid">
        <Anim direction="left" className="contract-img-wrap"><div className="dot-pattern" /><div className="contract-img"><img src="/images/homepage/homepage-06.jpg" alt="Group golf outing at Reno course" loading="lazy" /></div><div className="float-card"><strong>10,000+</strong><span>Outings Planned</span></div></Anim>
        <Anim direction="right" className="contract-text">
          <h2>One Contract. One Deposit.<br />Your Life Made Easy.</h2>
          <p>Instead of dealing with multiple contracts and deposits from hotels and golf courses, Golf the High Sierra makes all reservations on your group&apos;s behalf. You sign once, pay once, and we handle the rest.</p>
          <div className="val-list">
            {[['One Contract for Everything','Courses, hotels, dining, transport \u2014 one signature.'],['Complimentary Registration Portal','Attendees register & pay online. You never chase money.'],['Groups of 4 to 400','Buddies trips, corporate outings, conferences, tournaments.'],['Full-Service Event Planning','Breakout sessions, meal selection, transport, activities.']].map(([t,d],i)=>(
              <div key={i} className="val-item"><div className="val-chk">{'\u2714'}</div><div><strong>{t}</strong><span>{d}</span></div></div>
            ))}
          </div>
        </Anim>
      </div></section>

      <div className="exp-strip"><Anim className="exp-strip-label">The Complete Experience</Anim><div className="exp-grid">
        {EXP_CARDS.map((c,i)=>(<Anim key={i} delay={i*.06} className="exp-card"><img src={c.img} alt={c.alt} loading="lazy" /><div className="exp-card-ov" /><div className="exp-card-content"><div className="exp-card-icon">{c.icon}</div><h4>{c.title}</h4><span>{c.sub}</span></div></Anim>))}
      </div></div>

      <section className="regions">
        <Anim className="sec-head" style={{flexDirection:'column',alignItems:'flex-start',maxWidth:720}}>
          <div style={{fontSize:12,letterSpacing:3,textTransform:'uppercase',color:'#B8963E',fontWeight:600,marginBottom:8}}>Choose Your Region</div>
          <h2>Golf by Region — From Casino Nightlife to Mountain Solitude</h2>
          <p style={{maxWidth:720,marginTop:8}}>The Reno-Tahoe area offers five distinct golf regions, each with its own personality. Tell us your vibe and we&apos;ll match you.</p>
        </Anim>
        <div className="region-cards">
          {REGIONS.map((r,i)=>(<Anim key={i} delay={i*.08} className="rc"><div className="rc-img"><div className="rc-badge">{r.badge}</div><div className="rc-price">{r.price}</div><img src={r.img} alt={r.alt} loading="lazy" /></div><div className="rc-body"><h3>{r.name}</h3><div className="rc-subtitle">{r.subtitle}</div><div className="rc-chips">{r.chips.map((c,j)=><span key={j} className="chip">{c}</span>)}</div><div className="rc-hotels">{r.hotels}</div><div className="rc-rating"><span className="rc-stars">{'\u2605'.repeat(5)}</span><span>{r.rating}</span></div><div className="rc-link"><Link href={r.href}>Explore {r.name} Packages</Link><div className="arrow">\u2192</div></div></div></Anim>))}
        </div>
      </section>

      <section className="rms" id="tripscaddie"><div className="rms-grid">
        <Anim direction="left">
          <div className="rms-eyebrow">{'\u{1F3DF}'} Trips Caddie — Our Trip Planning Tool</div>
          <h2>Browse Real Trips. Build Your Itinerary. Get an Instant Quote.</h2>
          <p><a href="https://tripscaddie.golfthehighsierra.com/" target="_blank" rel="noreferrer" className="hl" style={{textDecoration:'underline'}}>Trips Caddie</a> is our free online trip planner built from 10,000+ real outings we&apos;ve organized.</p>
          <div className="rms-features">
            {[['\u{1F4CB}','Browse Real Trips','See actual itineraries from past groups'],['\u{1F310}','Filter by Region','Reno, Tahoe, Truckee, Graeagle, Carson Valley, Mesquite, St. George, Monterey'],['\u{1F4B0}','Request a Quote','Pick a trip, tell us dates & group size, get a custom quote in 24 hrs'],['\u{1F4C5}','Instant Itineraries','Professional day-by-day itineraries with courses, tee times & lodging']].map(([icon,title,desc],i)=>(
              <div key={i} className="rf"><div className="rf-icon">{icon}</div><h5>{title}</h5><span>{desc}</span></div>
            ))}
          </div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:24}}><a href="https://tripscaddie.golfthehighsierra.com/" className="rms-btn" target="_blank" rel="noreferrer">{'\u{1F3DF}'} Open Trips Caddie</a></div>
        </Anim>
        <Anim direction="right">
          <div style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:24}}>
            <div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,.5)',marginBottom:16,letterSpacing:1,textTransform:'uppercase'}}>Browse by Region</div>
            {[{name:'Reno',courses:'7 courses \u00B7 6 casino-resorts',href:'https://tripscaddie.golfthehighsierra.com/?region=Reno'},{name:'Lake Tahoe',courses:'3 courses \u00B7 lakefront lodging',href:'https://tripscaddie.golfthehighsierra.com/?region=Lake%20Tahoe'},{name:'Truckee & Graeagle',courses:'8 courses \u00B7 mountain villas',href:'https://tripscaddie.golfthehighsierra.com/?region=Truckee'},{name:'Carson Valley',courses:'4 courses \u00B7 best value',href:'https://tripscaddie.golfthehighsierra.com/?region=Carson%20Valley'},{name:'Monterey & Pebble Beach',courses:'5 courses \u00B7 oceanfront golf',href:'https://tripscaddie.golfthehighsierra.com/?region=Monterey'},{name:'Mesquite & St. George',courses:'6 courses \u00B7 desert championship',href:'https://tripscaddie.golfthehighsierra.com/?region=Mesquite'}].map((r,i)=>(
              <a key={i} href={r.href} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,.06)',textDecoration:'none',color:'#fff',fontSize:14}}><div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:2}}>{r.courses}</div></div><div style={{color:'rgba(255,255,255,.3)',fontSize:18}}>{'\u2192'}</div></a>
            ))}
          </div>
        </Anim>
      </div></section>

      <section className="portal"><div className="portal-grid">
        <Anim direction="left">
          <div className="portal-eyebrow">Don&apos;t Chase the Money Anymore</div>
          <h2>Proprietary Online Registration Portal</h2>
          <p>Every group getaway booked with Golf the High Sierra has <span className="hl">complimentary use of our proprietary online registration system</span> — making your life as coordinator the easiest it has ever been.</p>
          <div className="portal-features">
            {[['\u{1F517}','Custom Registration Links','Send to your group. They register themselves.'],['\u{1F4B3}','Direct Payments','No chasing deposits. Everyone pays online.'],['\u{1F37D}','Meal & Session Selection','Breakfast, lunch, dinner, workshops, breakouts.'],['\u{1F4CA}','Dashboard Tracking','See who\'s registered and paid in real time.']].map(([icon,title,desc],i)=>(
              <div key={i} className="pf"><div className="pf-icon">{icon}</div><h5>{title}</h5><span>{desc}</span></div>
            ))}
          </div>
        </Anim>
        <Anim direction="right" className="portal-img"><img src="/images/homepage/homepage-15.jpg" alt="Group golf trip" loading="lazy" /><div className="portal-float"><p>&ldquo;The registration portal alone saved me 20 hours of work. Everyone paid directly — I didn&apos;t chase a single dollar.&rdquo;</p><cite>— Steve R., TripAdvisor</cite></div></Anim>
      </div></section>

      <section className="journey-section" id="simpleprocess">
        <Anim className="sec-head" style={{justifyContent:'center',textAlign:'center',flexDirection:'column',alignItems:'center'}}><h2>Your Trip, Our Playbook</h2><p>From first call to first tee — here&apos;s how we make it happen.</p></Anim>
        <div className="journey" id="journey"><div className="journey-track"><div className="journey-progress" /><div className="journey-ball" /></div>
          <div className="journey-steps">
            {JOURNEY_STEPS.map((s,i)=>(<Anim key={i} delay={i*.2} className="j-step"><div className="j-icon-wrap"><div className="j-pulse" /><div className="j-icon">{s.icon}</div><div className="j-num">{i+1}</div></div><div className="j-card"><h4>{s.title}</h4><p>{s.desc}</p><div className="j-tag">{s.tag}</div></div></Anim>))}
          </div>
        </div>
      </section>

      <section className="testi"><Anim className="sec-head"><h2>What Our Clients Say</h2><p>Rated 4.8/5 across 672 verified reviews on Google, Yelp & TripAdvisor.</p></Anim><div className="tg">
        {TESTIMONIALS.map((t,i)=>(<Anim key={i} delay={i*.08} className="tc"><div className="tc-stars">{'\u2605'.repeat(t.stars)}</div><p className="tc-q">&ldquo;{t.quote}&rdquo;</p><div className="tc-bottom"><div className="tc-avatar">{t.avatar}</div><div className="tc-info"><span className="tc-a">{t.author}</span><span className="tc-m">{t.meta}</span></div></div></Anim>))}
      </div></section>

      <section className="faq"><Anim className="sec-head"><h2>Frequently Asked Questions</h2><p>Everything you need to know about group golf in Reno & Lake Tahoe.</p></Anim><div className="faq-list">
        {FAQS.map((f,i)=>(<Anim key={i} className={`faq-item${openFaq===i?' open':''}`}><button className="faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>{f.q}<span className="faq-toggle">{openFaq===i?'\u2212':'+'}</span></button><div className="faq-a"><p>{f.a}</p></div></Anim>))}
      </div></section>

      <section className="cta"><Anim><h2>Ready to Plan Your Group Golf Trip?</h2></Anim><Anim><p>Tell us your dates, group size, and budget. We&apos;ll build a custom package — no obligation, no hidden fees.</p></Anim><Anim className="cta-btns"><Link href="/contact-custom-golf-package/" className="btn-g">Request a Free Quote</Link><a href="tel:+18885848232" className="btn-ol">Call 888-584-8232</a></Anim></section>
    </div>
  );
}


