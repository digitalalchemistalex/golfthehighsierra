'use client';

import { useEffect } from 'react';
import '@/styles/homepage.css';

export default function HomepageContent() {
  useEffect(() => {
    // ─── Hero Slider with progress bar ───
    const slides = document.querySelectorAll('.hero-slide');
    const navBtns = document.querySelectorAll('.hero-nav button');
    const tabs = document.querySelectorAll('.hero-tab');
    const progressBar = document.getElementById('heroProgress');
    let cur = 0;
    let tm: ReturnType<typeof setInterval>;
    const SLIDE_DURATION = 6000;

    function goTo(n: number) {
      slides[cur]?.classList.remove('active');
      navBtns[cur]?.classList.remove('active');
      tabs[cur]?.classList.remove('active');
      cur = n;
      slides[cur]?.classList.add('active');
      navBtns[cur]?.classList.add('active');
      tabs[cur]?.classList.add('active');
      resetProgress();
    }
    function next() { goTo((cur + 1) % slides.length); }
    function resetProgress() {
      if (!progressBar) return;
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
          progressBar.style.width = '100%';
        });
      });
    }
    function startSlider() {
      tm = setInterval(next, SLIDE_DURATION);
      resetProgress();
    }
    function restartSlider() { clearInterval(tm); startSlider(); }

    navBtns.forEach(b => b.addEventListener('click', () => { restartSlider(); goTo(+(b as HTMLElement).dataset.i!); }));
    tabs.forEach(b => b.addEventListener('click', () => { restartSlider(); goTo(+(b as HTMLElement).dataset.i!); }));
    startSlider();

    // ─── Scroll animations ───
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('show');
          e.target.querySelectorAll('.trust-num[data-target]').forEach(countUpEl);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.anim,.anim-left,.anim-right,.anim-scale,.trust').forEach(el => obs.observe(el));

    // ─── Journey timeline animation ───
    const journeyEl = document.getElementById('journey');
    let jObs: IntersectionObserver | null = null;
    if (journeyEl) {
      jObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            journeyEl.classList.add('active');
            document.querySelectorAll('.j-step').forEach((step, i) => {
              setTimeout(() => step.classList.add('visible'), i * 200);
            });
            jObs?.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      jObs.observe(journeyEl);
    }

    // ─── Count-up animation ───
    function countUpEl(el: Element) {
      const htmlEl = el as HTMLElement;
      if (htmlEl.dataset.counted) return;
      htmlEl.dataset.counted = '1';
      const target = parseInt(htmlEl.dataset.target || '0');
      const suffix = htmlEl.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      function tick(now: number) {
        const elapsed = now - start;
        const pct = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - pct, 3);
        const val = Math.round(eased * target);
        htmlEl.textContent = val.toLocaleString() + suffix;
        if (pct < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    // ─── FAQ accordion ───
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const wasOpen = item?.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item?.classList.add('open');
      });
    });

    // ─── Mobile Card Sliders (dot sync) ───
    const sliderPairs = [
      { track: '.exp-grid', dots: '[data-for="exp-grid"]' },
      { track: '.region-cards', dots: '[data-for="region-cards"]' },
      { track: '.journey-steps', dots: '[data-for="journey-steps"]' },
      { track: '.tg', dots: '[data-for="tg"]' },
      { track: '.trust', dots: '[data-for="trust"]' },
    ];
    sliderPairs.forEach(({ track, dots }) => {
      const el = document.querySelector(track);
      const dotsEl = document.querySelector(dots);
      if (!el || !dotsEl) return;
      const allDots = dotsEl.querySelectorAll('span');
      const children = Array.from(el.children);
      function updateDots() {
        const scrollLeft = el!.scrollLeft;
        const childW = (children[0] as HTMLElement)?.offsetWidth || 1;
        const gap = parseFloat(getComputedStyle(el!).gap) || 16;
        const idx = Math.round(scrollLeft / (childW + gap));
        const clamped = Math.min(idx, allDots.length - 1);
        allDots.forEach((d, i) => d.classList.toggle('active', i === clamped));
      }
      el.addEventListener('scroll', updateDots, { passive: true });
      allDots.forEach((d, i) => {
        d.addEventListener('click', () => {
          const childW = (children[0] as HTMLElement)?.offsetWidth || 1;
          const gap = parseFloat(getComputedStyle(el!).gap) || 16;
          el!.scrollTo({ left: i * (childW + gap), behavior: 'smooth' });
        });
        (d as HTMLElement).style.cursor = 'pointer';
      });
    });

    // ─── Parallax on scroll for hero ───
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

    // Cleanup
    return () => {
      clearInterval(tm);
      obs.disconnect();
      jObs?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="homepage" dangerouslySetInnerHTML={{ __html: HOMEPAGE_HTML }} />
  );
}

const HOMEPAGE_HTML = `
<!-- â•â•â•â•â•â•â•â•â•â•â• HERO SLIDER â•â•â•â•â•â•â•â•â•â•â• -->
<section class="hero">
  <div class="hero-slide active" data-i="0">
    <img src="/images/homepage/homepage-01.jpg" alt="Reno Nevada skyline and Sierra Nevada mountains">
    <div class="hero-ov"></div>
    <div class="hero-inner">
      <div class="hero-badge"><div class="badge-dot"></div> Reno, Nevada</div>
      <h1>Championship Golf Meets Casino Nightlife</h1>
      <p>7 courses, 8 casino-resorts, and one company that handles everything. Group golf packages built by locals since 2004.</p>
      <div class="hero-btns"><a href="#" class="btn-w">Plan Your Reno Trip</a><a href="#" class="btn-ow">View Reno Courses</a></div>
    </div>
  </div>
  <div class="hero-slide" data-i="1">
    <img src="/images/homepage/homepage-02.jpg" alt="Edgewood Tahoe 18th hole Lake Tahoe">
    <div class="hero-ov"></div>
    <div class="hero-inner">
      <div class="hero-badge"><div class="badge-dot"></div> Lake Tahoe</div>
      <h1>Alpine Golf at 6,200 Feet Elevation</h1>
      <p>Edgewood, Incline Village, and Old Greenwood — lakefront and mountain courses your group will talk about for years.</p>
      <div class="hero-btns"><a href="#" class="btn-w">Explore Tahoe Packages</a><a href="#" class="btn-ow">View Tahoe Courses</a></div>
    </div>
  </div>
  <div class="hero-slide" data-i="2">
    <img src="/images/homepage/homepage-03.jpg" alt="Old Greenwood Golf Course Truckee California">
    <div class="hero-ov"></div>
    <div class="hero-inner">
      <div class="hero-badge"><div class="badge-dot"></div> Truckee / North Tahoe</div>
      <h1>Mountain Courses Through Towering Pines</h1>
      <p>Old Greenwood, Coyote Moon, Gray's Crossing, Tahoe Donner — stay in Truckee villas, play championship courses.</p>
      <div class="hero-btns"><a href="#" class="btn-w">Truckee Packages</a><a href="#" class="btn-ow">View Courses</a></div>
    </div>
  </div>
  <div class="hero-slide" data-i="3">
    <img src="/images/homepage/homepage-04.jpg" alt="Genoa Lakes Golf Club Carson Valley Nevada">
    <div class="hero-ov"></div>
    <div class="hero-inner">
      <div class="hero-badge"><div class="badge-dot"></div> Carson Valley</div>
      <h1>Sierra Panoramas at Half the Price</h1>
      <p>Genoa Lakes, Dayton Valley, Toiyabe — uncrowded courses with mountain backdrops and the best value in the region.</p>
      <div class="hero-btns"><a href="#" class="btn-w">Carson Valley Trips</a><a href="#" class="btn-ow">View Courses</a></div>
    </div>
  </div>
  <div class="hero-slide" data-i="4">
    <img src="/images/homepage/homepage-05.jpg" alt="Red Hawk Golf Resort group golf outing">
    <div class="hero-ov"></div>
    <div class="hero-inner">
      <div class="hero-badge"><div class="badge-dot"></div> 10,000+ Trips Planned</div>
      <h1>One Call. One Contract. Zero Hassle.</h1>
      <p>20+ years arranging group golf across Reno, Tahoe, and Carson Valley. Courses, hotels, dining, transport — we book it all.</p>
      <div class="hero-btns"><a href="#" class="btn-w">Request a Free Quote</a><a href="tel:+18885848232" class="btn-ow">Call 888-584-8232</a></div>
    </div>
  </div>
  <div class="hero-progress"><div class="hero-progress-bar" id="heroProgress"></div></div>
  <div class="hero-nav">
    <button class="active" data-i="0">&nbsp;</button>
    <button data-i="1">&nbsp;</button>
    <button data-i="2">&nbsp;</button>
    <button data-i="3">&nbsp;</button>
    <button data-i="4">&nbsp;</button>
  </div>
  <div class="hero-tabs">
    <button class="hero-tab active" data-i="0">📍 Reno</button>
    <button class="hero-tab" data-i="1">📍 Lake Tahoe</button>
    <button class="hero-tab" data-i="2">📍 Truckee</button>
    <button class="hero-tab" data-i="3">📍 Carson Valley</button>
    <button class="hero-tab" data-i="4">📍 Overview</button>
  </div>
</section>

<!-- â•â•â•â•â•â•â•â•â•â•â• TRUST STRIP â•â•â•â•â•â•â•â•â•â•â• -->
<div class="trust">
  <div class="trust-chip"><div class="trust-icon">🏆</div><div class="trust-txt"><strong><span class="trust-num" data-target="20" data-suffix="+">0</span> Years</strong><span>Serving Groups Since 2004</span></div></div>
  <div class="trust-chip"><div class="trust-icon">⛳</div><div class="trust-txt"><strong><span class="trust-num" data-target="10000" data-suffix="+">0</span> Outings</strong><span>Planned &amp; Executed</span></div></div>
  <div class="trust-chip"><div class="trust-icon">🏨</div><div class="trust-txt"><strong><span class="trust-num" data-target="20" data-suffix="+">0</span> Courses</strong><span>Hotels, Casinos &amp; Resorts</span></div></div>
  <div class="trust-chip"><div class="trust-icon">⭐</div><div class="trust-txt"><strong>4.8/5 Rating</strong><span>672 Verified Reviews</span></div></div>
</div>
<div class="slider-dots" data-for="trust"><span class="active"></span><span></span><span></span><span></span></div>

<!-- â•â•â•â•â•â•â•â•â•â•â• ONE CONTRACT â•â•â•â•â•â•â•â•â•â•â• -->
<section class="contract">
  <div class="contract-grid">
    <div class="contract-img-wrap anim-left">
      <div class="dot-pattern"></div>
      <div class="contract-img">
        <img src="/images/homepage/homepage-06.jpg" alt="Group golf outing at Reno course">
      </div>
      <div class="float-card">
        <strong>10,000+</strong>
        <span>Outings Planned</span>
      </div>
    </div>
    <div class="contract-text anim-right">
      <h2>One Contract. One Deposit.<br>Your Life Made Easy.</h2>
      <p>Instead of dealing with multiple contracts and deposits from hotels and golf courses, Golf the High Sierra makes all reservations on your group's behalf. You sign once, pay once, and we handle the rest.</p>
      <div class="val-list">
        <div class="val-item"><div class="val-chk">✔</div><div><strong>One Contract for Everything</strong><span>Courses, hotels, dining, transport — one signature.</span></div></div>
        <div class="val-item"><div class="val-chk">✔</div><div><strong>Complimentary Registration Portal</strong><span>Attendees register &amp; pay online. You never chase money.</span></div></div>
        <div class="val-item"><div class="val-chk">✔</div><div><strong>Groups of 4 to 400</strong><span>Buddies trips, corporate outings, conferences, tournaments.</span></div></div>
        <div class="val-item"><div class="val-chk">✔</div><div><strong>Full-Service Event Planning</strong><span>Breakout sessions, meal selection, transport, activities.</span></div></div>
      </div>
    </div>
  </div>
</section>

<!-- â•â•â•â•â•â•â•â•â•â•â• EXPERIENCE STRIP â•â•â•â•â•â•â•â•â•â•â• -->
<div class="exp-strip">
  <div class="exp-strip-label anim">The Complete Experience</div>
  <div class="exp-grid">
    <div class="exp-card anim">
      <img src="/images/homepage/homepage-07.webp" alt="Championship golf course">
      <div class="exp-card-ov"></div>
      <div class="exp-card-content">
        <div class="exp-card-icon">⛳</div>
        <h4>20+ Courses</h4>
        <span>Championship golf across 4 regions</span>
      </div>
    </div>
    <div class="exp-card anim" style="transition-delay:.06s">
      <img src="/images/homepage/homepage-08.webp" alt="Fine dining Reno casino">
      <div class="exp-card-ov"></div>
      <div class="exp-card-content">
        <div class="exp-card-icon">🍽</div>
        <h4>Dining</h4>
        <span>Casino restaurants &amp; private events</span>
      </div>
    </div>
    <div class="exp-card anim" style="transition-delay:.12s">
      <img src="/images/homepage/homepage-09.webp" alt="Resort pool Peppermill Reno">
      <div class="exp-card-ov"></div>
      <div class="exp-card-content">
        <div class="exp-card-icon">🏨</div>
        <h4>Resorts &amp; Casinos</h4>
        <span>Atlantis, Peppermill, Grand Sierra &amp; more</span>
      </div>
    </div>
    <div class="exp-card anim" style="transition-delay:.18s">
      <img src="/images/homepage/homepage-10.webp" alt="Old Greenwood villa lodging Truckee">
      <div class="exp-card-ov"></div>
      <div class="exp-card-content">
        <div class="exp-card-icon">🏡</div>
        <h4>Villa Lodging</h4>
        <span>Mountain villas &amp; private cabins</span>
      </div>
    </div>
  </div>
</div>

<!-- â•â•â•â•â•â•â•â•â•â•â• REGIONS (ENRICHED CARDS) â•â•â•â•â•â•â•â•â•â•â• -->
<section class="regions">
  <div class="sec-head anim" style="flex-direction:column;align-items:flex-start;max-width:720px">
    <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#B8963E;font-weight:600;margin-bottom:8px">Choose Your Region</div>
    <h2>Golf by Region — From Casino Nightlife to Mountain Solitude</h2>
    <p style="max-width:720px;margin-top:8px">The Reno-Tahoe area offers four distinct golf regions, each with its own personality. Reno delivers casino resorts and value. Lake Tahoe brings alpine lakefront courses. Truckee &amp; Graeagle are mountain escapes through towering pines. Carson Valley is wide-open desert golf at half the price. Tell us your vibe and we'll match you.</p>
  </div>
  <div class="slider-dots" data-for="exp-grid"><span class="active"></span><span></span><span></span><span></span></div>
  <div class="region-cards">

    <!-- RENO -->
    <div class="rc anim">
      <div class="rc-img">
        <div class="rc-badge">7 Courses</div>
        <div class="rc-price">From $189</div>
        <img src="/images/homepage/homepage-11.jpg" alt="Lakeridge Golf Course Reno NV">
      </div>
      <div class="rc-body">
        <h3>Reno</h3>
        <div class="rc-subtitle">Casino Golf Capital</div>
        <div class="rc-chips">
          <span class="chip">Lakeridge</span>
          <span class="chip">ArrowCreek</span>
          <span class="chip">Red Hawk</span>
          <span class="chip">Wolf Run</span>
          <span class="chip">Somersett</span>
        </div>
        <div class="rc-hotels">&#127976; Atlantis · Peppermill · Grand Sierra Resort · Eldorado</div>
        <div class="rc-rating"><span class="rc-stars">★★★★★</span><span>4.8 (290 reviews)</span></div>
        <div class="rc-link">
          <a href="#">Explore Reno Packages</a>
          <div class="arrow">→</div>
        </div>
      </div>
    </div>

    <!-- LAKE TAHOE -->
    <div class="rc anim" style="transition-delay:.08s">
      <div class="rc-img">
        <div class="rc-badge">3 Courses</div>
        <div class="rc-price">From $299</div>
        <img src="/images/homepage/homepage-12.jpg" alt="Incline Village Championship Course Lake Tahoe">
      </div>
      <div class="rc-body">
        <h3>Lake Tahoe</h3>
        <div class="rc-subtitle">Lakefront &amp; Alpine</div>
        <div class="rc-chips">
          <span class="chip">Edgewood Tahoe</span>
          <span class="chip">Incline Village</span>
        </div>
        <div class="rc-hotels">&#127976; Hyatt Regency · Lodge at Edgewood · Lakeside resorts</div>
        <div class="rc-rating"><span class="rc-stars">★★★★★</span><span>4.9 (185 reviews)</span></div>
        <div class="rc-link">
          <a href="#">Explore Tahoe Packages</a>
          <div class="arrow">→</div>
        </div>
      </div>
    </div>

    <!-- TRUCKEE -->
    <div class="rc anim" style="transition-delay:.16s">
      <div class="rc-img">
        <div class="rc-badge">4 Courses</div>
        <div class="rc-price">From $249</div>
        <img src="/images/homepage/homepage-13.jpg" alt="Gray's Crossing Golf Course Truckee CA">
      </div>
      <div class="rc-body">
        <h3>Truckee</h3>
        <div class="rc-subtitle">Mountain Championship</div>
        <div class="rc-chips">
          <span class="chip">Old Greenwood</span>
          <span class="chip">Coyote Moon</span>
          <span class="chip">Gray's Crossing</span>
          <span class="chip">Tahoe Donner</span>
          <span class="chip">Plumas Pines</span>
        </div>
        <div class="rc-hotels">&#127976; Truckee villas &middot; Cedar House &middot; Graeagle Lodge · Cedar House · Hampton Inn</div>
        <div class="rc-rating"><span class="rc-stars">★★★★★</span><span>4.8 (120 reviews)</span></div>
        <div class="rc-link">
          <a href="#">Explore Truckee Packages</a>
          <div class="arrow">→</div>
        </div>
      </div>
    </div>

    <!-- CARSON VALLEY -->
    <div class="rc anim" style="transition-delay:.24s">
      <div class="rc-img">
        <div class="rc-badge">4 Courses</div>
        <div class="rc-price">From $149</div>
        <img src="/images/homepage/homepage-14.jpg" alt="Dayton Valley Golf Club Carson Valley NV">
      </div>
      <div class="rc-body">
        <h3>Carson Valley</h3>
        <div class="rc-subtitle">Best Value in the Sierra</div>
        <div class="rc-chips">
          <span class="chip">Genoa Lakes</span>
          <span class="chip">Dayton Valley</span>
          <span class="chip">Toiyabe</span>
          <span class="chip">Eagle Valley</span>
        </div>
        <div class="rc-hotels">&#127976; Carson Valley Inn · Holiday Inn · Budget-friendly options</div>
        <div class="rc-rating"><span class="rc-stars">★★★★½</span><span>4.7 (77 reviews)</span></div>
        <div class="rc-link">
          <a href="#">Explore Carson Packages</a>
          <div class="arrow">→</div>
        </div>
      </div>
    </div>

  </div>
  <div class="slider-dots" data-for="region-cards"><span class="active"></span><span></span><span></span><span></span></div>
</section>


<!-- â•â•â•â•â•â•â•â•â•â•â• TRIPS CADDIE / RMS PROMO â•â•â•â•â•â•â•â•â•â•â• -->
<section class="rms" id="tripscaddie">
  <!-- Top: Intro + Feature Grid -->
  <div class="rms-grid">
    <div class="anim-left">
      <div class="rms-eyebrow">&#127951; Trips Caddie &mdash; Our Trip Planning Tool</div>
      <h2>Browse Real Trips. Build Your Itinerary. Get an Instant Quote.</h2>
      <p><a href="https://tripscaddie.golfthehighsierra.com/" target="_blank" class="hl" style="text-decoration:underline">Trips Caddie</a> is our free online trip planner built from 10,000+ real outings we've organized. Browse past trips for inspiration, filter by region, then request a custom quote. We respond within 24 hours.</p>
      <p>It covers <span class="hl">Reno</span>, <span class="hl">Lake Tahoe</span>, <span class="hl">Truckee</span>, <span class="hl">Graeagle / Lost Sierra</span>, <span class="hl">Carson Valley</span>, <span class="hl">Mesquite</span>, <span class="hl">St. George</span>, and <span class="hl">Monterey</span> &mdash; with real courses, real hotels, and real pricing.</p>
      <div class="rms-features">
        <div class="rf"><div class="rf-icon">&#128203;</div><h5>Browse Real Trips</h5><span>See actual itineraries from past groups &mdash; courses, hotels, group size, pricing</span></div>
        <div class="rf"><div class="rf-icon">&#127760;</div><h5>Filter by Region</h5><span>Reno, Lake Tahoe, Truckee, Graeagle, Carson Valley, Mesquite, St. George, Monterey</span></div>
        <div class="rf"><div class="rf-icon">&#128176;</div><h5>Request a Quote</h5><span>Pick a trip you like, tell us your dates &amp; group size, get a custom quote in 24 hrs</span></div>
        <div class="rf"><div class="rf-icon">&#128197;</div><h5>Instant Itineraries</h5><span>Professional day-by-day itineraries with courses, tee times, lodging &amp; transport</span></div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:24px">
        <a href="https://tripscaddie.golfthehighsierra.com/" class="rms-btn" target="_blank">&#127951; Open Trips Caddie</a>
        <a href="https://tripscaddie.golfthehighsierra.com/?region=Reno" target="_blank" style="color:rgba(255,255,255,.6);font-size:13px;text-decoration:none;padding:14px 16px;border:1px solid rgba(255,255,255,.5);border-radius:8px;transition:all .2s;display:inline-flex;align-items:center;gap:4px" onmouseover="this.style.borderColor='rgba(255,255,255,.65)';this.style.color='#fff'" onmouseout="this.style.borderColor='rgba(255,255,255,.5)';this.style.color='rgba(255,255,255,.6)'">Browse Reno Trips &#8594;</a>
      </div>
    </div>
    <!-- Right side: Region quick links with REAL course counts from app data -->
    <div class="anim-right">
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px">
        <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,.5);letter-spacing:1px;text-transform:uppercase;margin-bottom:16px">Browse Trips by Destination</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <a href="https://tripscaddie.golfthehighsierra.com/?region=Reno" target="_blank" style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;text-decoration:none;transition:all .2s" onmouseover="this.style.background='rgba(255,255,255,.1)';this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.transform='none'">
            <div><div style="font-size:15px;font-weight:600;color:#fff">&#127922; Reno</div><div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">Casino resort lodging</div></div>
            <span style="color:rgba(255,255,255,.6);font-size:18px">&#8594;</span>
          </a>
          <a href="https://tripscaddie.golfthehighsierra.com/?region=Lake%20Tahoe" target="_blank" style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;text-decoration:none;transition:all .2s" onmouseover="this.style.background='rgba(255,255,255,.1)';this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.transform='none'">
            <div><div style="font-size:15px;font-weight:600;color:#fff">&#127956; Lake Tahoe</div><div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">Lakefront &amp; alpine lodging</div></div>
            <span style="color:rgba(255,255,255,.6);font-size:18px">&#8594;</span>
          </a>
          <a href="https://tripscaddie.golfthehighsierra.com/?region=Truckee" target="_blank" style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;text-decoration:none;transition:all .2s" onmouseover="this.style.background='rgba(255,255,255,.1)';this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.transform='none'">
            <div><div style="font-size:15px;font-weight:600;color:#fff">&#127794; Truckee</div><div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">Mountain lodging</div></div>
            <span style="color:rgba(255,255,255,.6);font-size:18px">&#8594;</span>
          </a>
          <a href="https://tripscaddie.golfthehighsierra.com/?region=Graeagle%2FLost%20Sierra" target="_blank" style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;text-decoration:none;transition:all .2s" onmouseover="this.style.background='rgba(255,255,255,.1)';this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.transform='none'">
            <div><div style="font-size:15px;font-weight:600;color:#fff">&#9968; Graeagle / Lost Sierra</div><div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">Secluded mountain golf</div></div>
            <span style="color:rgba(255,255,255,.6);font-size:18px">&#8594;</span>
          </a>
          <a href="https://tripscaddie.golfthehighsierra.com/?region=Carson%20Valley" target="_blank" style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;text-decoration:none;transition:all .2s" onmouseover="this.style.background='rgba(255,255,255,.1)';this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.transform='none'">
            <div><div style="font-size:15px;font-weight:600;color:#fff">&#127956; Carson Valley</div><div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">Wide-open desert golf</div></div>
            <span style="color:rgba(255,255,255,.6);font-size:18px">&#8594;</span>
          </a>
          <a href="https://tripscaddie.golfthehighsierra.com/?region=Mesquite" target="_blank" style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;text-decoration:none;transition:all .2s" onmouseover="this.style.background='rgba(255,255,255,.1)';this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.transform='none'">
            <div><div style="font-size:15px;font-weight:600;color:#fff">&#127797; Mesquite, NV</div><div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">Desert golf &middot; Year-round play</div></div>
            <span style="color:rgba(255,255,255,.6);font-size:18px">&#8594;</span>
          </a>
          <a href="https://tripscaddie.golfthehighsierra.com/?region=St.%20George" target="_blank" style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;text-decoration:none;transition:all .2s" onmouseover="this.style.background='rgba(255,255,255,.1)';this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.transform='none'">
            <div><div style="font-size:15px;font-weight:600;color:#fff">&#9728;&#65039; St. George, UT</div><div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">Red rock golf &middot; Near Zion</div></div>
            <span style="color:rgba(255,255,255,.6);font-size:18px">&#8594;</span>
          </a>
          <a href="https://tripscaddie.golfthehighsierra.com/?region=Monterey" target="_blank" style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:10px;text-decoration:none;transition:all .2s" onmouseover="this.style.background='rgba(255,255,255,.1)';this.style.transform='translateX(4px)'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.transform='none'">
            <div><div style="font-size:15px;font-weight:600;color:#fff">&#127754; Monterey, CA</div><div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">Coastal golf</div></div>
            <span style="color:rgba(255,255,255,.6);font-size:18px">&#8594;</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom: What You'll Find — describes real app features, no fabricated trips -->
  <div style="margin-top:48px;position:relative;z-index:1">
    <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,.7);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:20px;text-align:center">What You&rsquo;ll Find Inside Trips Caddie</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
      <!-- Feature 1: Real Trip Database -->
      <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px">
        <div style="font-size:28px;margin-bottom:12px">&#128203;</div>
        <div style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:700;font-size:18px;color:#fff;margin-bottom:8px">Real Trips from Real Groups</div>
        <div style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.6">Browse actual past trips with real courses, lodging, group sizes, and pricing &mdash; built from 10,000+ outings we&rsquo;ve organized over 20 years.</div>
      </div>
      <!-- Feature 2: Smart Filters -->
      <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px">
        <div style="font-size:28px;margin-bottom:12px">&#128269;</div>
        <div style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:700;font-size:18px;color:#fff;margin-bottom:8px">Filter by Region, Vibe &amp; Budget</div>
        <div style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.6">Narrow trips by destination, trip style (budget, premium, corporate, bachelor party, weekend getaway), group size, lodging type, and more.</div>
      </div>
      <!-- Feature 3: Instant Quote -->
      <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:24px">
        <div style="font-size:28px;margin-bottom:12px">&#128176;</div>
        <div style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:700;font-size:18px;color:#fff;margin-bottom:8px">Request a Custom Quote</div>
        <div style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.6">Find a trip you like, tell us your dates and group size, and get a professional day-by-day itinerary with courses, lodging, and transport.</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:24px">
      <a href="https://tripscaddie.golfthehighsierra.com/" target="_blank" style="color:rgba(255,255,255,.5);font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:color .2s" onmouseover="this.style.color='#D4AD4A'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Open Trips Caddie &#8594;</a>
    </div>
  </div>
</section>

<!-- â•â•â•â•â•â•â•â•â•â•â• REGISTRATION PORTAL â•â•â•â•â•â•â•â•â•â•â• -->
<section class="portal">
  <div class="portal-grid">
    <div class="anim-left">
      <div class="portal-eyebrow">Don't Chase the Money Anymore</div>
      <h2>Proprietary Online Registration Portal</h2>
      <p>Every group getaway booked with Golf the High Sierra has <span class="hl">complimentary use of our proprietary online registration system</span> — making your life as coordinator the easiest it has ever been.</p>
      <p>Your attendees build a package within a package, customized to their availability. They sign up themselves and pay us directly — or pay you via your own Stripe Account.</p>
      <div class="portal-features">
        <div class="pf"><div class="pf-icon">🔗</div><h5>Custom Registration Links</h5><span>Send to your group. They register themselves.</span></div>
        <div class="pf"><div class="pf-icon">💳</div><h5>Direct Payments</h5><span>No chasing deposits. Everyone pays online.</span></div>
        <div class="pf"><div class="pf-icon">🍽</div><h5>Meal &amp; Session Selection</h5><span>Breakfast, lunch, dinner, workshops, breakouts.</span></div>
        <div class="pf"><div class="pf-icon">📊</div><h5>Dashboard Tracking</h5><span>See who's registered and paid in real time.</span></div>
      </div>
    </div>
    <div class="portal-img anim-right">
      <img src="/images/homepage/homepage-15.jpg" alt="Group golf trip with Golf the High Sierra">
      <div class="portal-float">
        <p>"The registration portal alone saved me 20 hours of work. Everyone paid directly — I didn't chase a single dollar."</p>
        <cite>— Steve R., TripAdvisor</cite>
      </div>
    </div>
  </div>
</section>

<!-- â•â•â•â•â•â•â•â•â•â•â• HOW IT WORKS â•â•â•â•â•â•â•â•â•â•â• -->
<section class="journey-section" id="simpleprocess">
  <div class="sec-head anim" style="justify-content:center;text-align:center;flex-direction:column;align-items:center">
    <h2>Your Trip, Our Playbook</h2>
    <p>From first call to first tee — here’s how we make it happen.</p>
  </div>

  <div class="journey" id="journey">
    <div class="journey-track"><div class="journey-progress" id="journeyProgress"></div><div class="journey-ball" id="journeyBall"></div></div>

    <div class="journey-steps">
      <div class="j-step" data-step="1">
        <div class="j-icon-wrap"><div class="j-pulse"></div><div class="j-icon">📞</div><div class="j-num">1</div></div>
        <div class="j-card">
          <h4>You Call, We Listen</h4>
          <p>Share your dates, group size, budget & wish list. Want Edgewood at sunset? A casino dinner for 40? We’ve heard it all.</p>
          <div class="j-tag">⏱ Takes 10 minutes</div>
        </div>
      </div>
      <div class="j-step" data-step="2">
        <div class="j-icon-wrap"><div class="j-pulse"></div><div class="j-icon">🗺️</div><div class="j-num">2</div></div>
        <div class="j-card">
          <h4>We Design Your Trip</h4>
          <p>Courses matched to your skill mix, hotels that fit the vibe, dinner spots, shuttles — one package, one contract, one deposit.</p>
          <div class="j-tag">📋 Custom quote in 24 hrs</div>
        </div>
      </div>
      <div class="j-step" data-step="3">
        <div class="j-icon-wrap"><div class="j-pulse"></div><div class="j-icon">📱</div><div class="j-num">3</div></div>
        <div class="j-card">
          <h4>Your Group Registers</h4>
          <p>Everyone gets a link to our TripsCaddie portal — they pick their options, pay their share, done. Zero chasing.</p>
          <div class="j-tag">💸 No more Venmo chaos</div>
        </div>
      </div>
      <div class="j-step" data-step="4">
        <div class="j-icon-wrap"><div class="j-pulse"></div><div class="j-icon">⛳</div><div class="j-num">4</div></div>
        <div class="j-card">
          <h4>Show Up & Play</h4>
          <p>Tee times confirmed, rooms ready, dinners booked. Your only job? Enjoy the round and take all the credit.</p>
          <div class="j-tag">🏌️ You’re the hero</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- â•â•â•â•â•â•â•â•â•â•â• TESTIMONIALS â•â•â•â•â•â•â•â•â•â•â• -->
<section class="testi">
  <div class="sec-head anim"><h2>What Our Clients Say</h2><p>Rated 4.8/5 across 672 verified reviews on Google, Yelp &amp; TripAdvisor.</p></div>
  <div class="tg">
    <div class="tc anim">
      <div class="tc-stars">★★★★★</div>
      <p class="tc-q">"We've used Golf the High Sierra for our annual corporate outing 6 years running. One phone call and everything is handled. The registration portal alone saves me 20 hours."</p>
      <div class="tc-bottom">
        <div class="tc-avatar">M</div>
        <div class="tc-info"><span class="tc-a">Mark T.</span><span class="tc-m">Google · Corporate Group of 32</span></div>
      </div>
    </div>
    <div class="tc anim" style="transition-delay:.08s">
      <div class="tc-stars">★★★★★</div>
      <p class="tc-q">"Organized a 24-person buddies trip. Everyone paid directly through the portal — I didn't chase a single dollar. Courses were perfectly matched to our skill mix."</p>
      <div class="tc-bottom">
        <div class="tc-avatar">S</div>
        <div class="tc-info"><span class="tc-a">Steve R.</span><span class="tc-m">TripAdvisor · Leisure Group</span></div>
      </div>
    </div>
    <div class="tc anim" style="transition-delay:.16s">
      <div class="tc-stars">★★★★★</div>
      <p class="tc-q">"From lodging to dinner reservations to the shuttle — everything was arranged before we arrived. Best group golf experience we've ever had, hands down."</p>
      <div class="tc-bottom">
        <div class="tc-avatar">D</div>
        <div class="tc-info"><span class="tc-a">David L.</span><span class="tc-m">Yelp · Mixed Group of 16</span></div>
      </div>
    </div>
  </div>
  <div class="slider-dots" data-for="tg"><span class="active"></span><span></span><span></span></div>
</section>

<!-- â•â•â•â•â•â•â•â•â•â•â• FAQ â•â•â•â•â•â•â•â•â•â•â• -->
<section class="faq">
  <div class="sec-head anim"><h2>Frequently Asked Questions</h2><p>Everything you need to know about group golf in Reno &amp; Lake Tahoe.</p></div>
  <div class="faq-list">
    <div class="faq-item anim"><button class="faq-q">What is included in a Golf the High Sierra package?<span class="faq-toggle">+</span></button><div class="faq-a"><p>Every package includes tee times at your chosen courses, lodging at partner hotels or casinos, and access to our proprietary online registration portal. Add dining reservations, ground transportation, non-golfer activities, and corporate event planning as needed.</p></div></div>
    <div class="faq-item anim"><button class="faq-q">How many people can be in a group?<span class="faq-toggle">+</span></button><div class="faq-a"><p>We handle groups from 4 to 400+ people. Small buddies trips, mid-size corporate outings, full conferences with breakout sessions — we scale planning to fit your size and budget.</p></div></div>
    <div class="faq-item anim"><button class="faq-q">What golf courses are available in the Reno Tahoe area?<span class="faq-toggle">+</span></button><div class="faq-a"><p>We partner with 20+ courses: Reno (Lakeridge, ArrowCreek, Red Hawk, Wolf Run, Somersett, Washoe), Lake Tahoe (Edgewood, Incline Village), Truckee (Old Greenwood, Coyote Moon, Gray's Crossing, Tahoe Donner), and Carson Valley (Genoa Lakes, Dayton Valley, Toiyabe).</p></div></div>
    <div class="faq-item anim"><button class="faq-q">How does the one contract / one deposit process work?<span class="faq-toggle">+</span></button><div class="faq-a"><p>We book everything on your behalf — hotels, courses, dining, transport. You get one contract covering all arrangements and one deposit to secure them. Your group members register and pay through our online portal. No chasing payments.</p></div></div>
    <div class="faq-item anim"><button class="faq-q">Can non-golfers join the trip?<span class="faq-toggle">+</span></button><div class="faq-a"><p>Absolutely. We arrange spa packages, lake cruises, hiking, wine tours, and casino entertainment. Non-golfer packages can be built into the same group registration so everyone books through one portal.</p></div></div>
  </div>
</section>

<!-- â•â•â•â•â•â•â•â•â•â•â• CTA â•â•â•â•â•â•â•â•â•â•â• -->
<section class="cta">
  <h2 class="anim">Ready to Plan Your Group Golf Trip?</h2>
  <p class="anim">Tell us your dates, group size, and budget. We'll build a custom package — no obligation, no hidden fees.</p>
  <div class="cta-btns anim">
    <a href="#" class="btn-g">Request a Free Quote</a>
    <a href="tel:+18885848232" class="btn-ol">Call 888-584-8232</a>
  </div>
</section>
`;
