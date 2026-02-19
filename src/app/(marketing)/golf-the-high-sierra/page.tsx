import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Golf the High Sierra | Custom Golf Packages Since 2004",
  description: "Golf the High Sierra is the Sierra Nevada's premier golf trip planning service. We book custom stay-and-play packages across Reno, Lake Tahoe, Truckee, Graeagle, and Carson Valley. No fees. Real expertise.",
  alternates: { canonical: "https://golfthehighsierra.com/golf-the-high-sierra/" },
  openGraph: {
    title: "Golf the High Sierra | Custom Golf Packages Since 2004",
    description: "The Sierra Nevada's premier golf trip planning service. Custom packages across 5 regions, 25+ courses, 20+ partner hotels.",
    images: [{ url: "https://golfthehighsierra.vercel.app/images/regions/reno.jpg" }],
  },
};

const REGIONS = [
  { name: "Reno", tagline: "Casino Golf Capital", courses: 8, slug: "best-golf-courses-reno", price: "From $179", image: "/images/regions/reno.jpg" },
  { name: "Lake Tahoe", tagline: "Lakefront & Alpine", courses: 4, slug: "best-golf-courses-lake-tahoe", price: "From $299", image: "/images/regions/tahoe.jpg" },
  { name: "Truckee", tagline: "Jack Nicklaus Country", courses: 4, slug: "best-golf-courses-truckee", price: "From $249", image: "/images/courses/old-greenwood-golf-course/old-greenwood.jpg" },
  { name: "Graeagle", tagline: "Lost Sierra Secret", courses: 5, slug: "best-golf-courses-graeagle", price: "From $149", image: "/images/regions/graeagle.jpg" },
  { name: "Carson Valley", tagline: "Nevada's Hidden Gem", courses: 3, slug: "best-golf-courses-carson-valley", price: "From $129", image: "/images/regions/carson-valley.jpg" },
];

const WHY = [
  { title: "20+ Years of Relationships", desc: "We've been booking golf in the High Sierra since 2004. Every course pro, hotel GM, and F&B director knows us by name. Those relationships get you tee times that others can't get, at prices that aren't published." },
  { title: "Zero Booking Fees", desc: "We don't charge you to use us. Our revenue comes from the courses and hotels — meaning our incentive is to find you the best match for your group, not the most expensive one." },
  { title: "One Contact. Everything Done.", desc: "No more emailing four courses and three hotels, then trying to align them. One conversation with us and we build the whole trip. You get one itinerary, one point of contact, one seamless experience." },
  { title: "5 Regions, 25+ Courses", desc: "From ArrowCreek's private-access fairways in Reno to Edgewood's lakeside closing holes in Tahoe, from the Jack Nicklaus Signature at Old Greenwood to the Dragon at Nakoma — we cover the best of the Sierra." },
  { title: "Groups of Any Size", desc: "8 players on a buddy trip. 144 players at a company tournament. We scale our service to match your group — including tournament formats, scoring, awards ceremonies, and F&B packages." },
  { title: "Custom, Not Cookie-Cutter", desc: "We don't sell packages off a shelf. Every trip is built around your specific dates, budget, skill levels, and preferences. First-time visitors get different recommendations than annual regulars." },
];

const COURSES_HIGHLIGHT = [
  { name: "Edgewood Tahoe", note: "Home of the Celebrity Championship — lakeside finishing holes", slug: "edgewood-tahoe-golf-course" },
  { name: "ArrowCreek Country Club", note: "Private-access, 36 holes — the best golf in Reno", slug: "arrowcreek-golf-club" },
  { name: "Old Greenwood", note: "Jack Nicklaus Signature — top 10 new public course in the US", slug: "old-greenwood-golf-course" },
  { name: "Nakoma Dragon", note: "Most unique course in the Sierra — perched above the Feather River", slug: "nakoma-dragon-golf-course" },
  { name: "Grizzly Ranch", note: "#1 public course in the Sierra Nevada (Golf Digest)", slug: "grizzly-ranch-golf-club" },
  { name: "Genoa Lakes Golf Club", note: "36 holes by Peter Jacobsen & Johnny Miller — Nevada's best kept secret", slug: "genoa-lakes-golf-club" },
];

export default function GolfTheHighSierraPage() {
  const css = {
    ["--forest" as string]: "#1E3A2F",
    ["--gold" as string]: "#C9A24D",
    ["--cream" as string]: "#FAFAF5",
    ["--white" as string]: "#FFFFFF",
    ["--ink" as string]: "#111111",
    ["--stone" as string]: "#8B8577",
    ["--bone" as string]: "#E8E2D9",
    ["--serif" as string]: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FAFAF5", ...css }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", height: "70vh", minHeight: 520, overflow: "hidden" }}>
        <Image src="/images/regions/reno.jpg" alt="Golf the High Sierra — Reno and Lake Tahoe golf packages" fill className="object-cover" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,25,15,0.5) 0%, rgba(10,25,15,0.4) 40%, rgba(10,25,15,0.88) 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(32px,6vw,80px)", paddingBottom: "clamp(48px,8vh,96px)" }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#C9A24D", fontWeight: 600, marginBottom: 14 }}>Sierra Nevada Golf Since 2004</div>
            <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(40px,5.5vw,72px)", color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
              Golf the High Sierra.<br /><em style={{ fontStyle: "italic" }}>The Way It Should Be.</em>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", maxWidth: 540, marginBottom: 32, lineHeight: 1.7 }}>
              Custom golf trip planning across 5 Sierra Nevada regions. 25+ championship courses. 20+ partner hotels. One call gets you tee times, rooms, dining, and logistics — no fees, no stress.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A24D", color: "#fff", padding: "14px 28px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
                Plan My Trip <ArrowRight size={14} />
              </Link>
              <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 24px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                <Phone size={14} /> 888-584-8232
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ background: "var(--forest)", padding: "18px clamp(32px,7vw,120px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 48px", justifyContent: "center", rowGap: 8 }}>
          {["20+ Years in Business", "5 Regions", "25+ Championship Courses", "10,000+ Groups Planned", "Zero Booking Fees"].map((s, i) => (
            <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>{s}</span>
          ))}
        </div>
      </section>

      {/* ═══ 5 REGIONS ═══ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", background: "#fff" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 12 }}>Where We Play</div>
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(30px,3.5vw,50px)", lineHeight: 1.1, marginBottom: 12 }}>
            5 Regions. <em style={{ fontStyle: "italic" }}>All the Best Golf.</em>
          </h2>
          <p style={{ color: "var(--stone)", fontSize: 15, maxWidth: 540, lineHeight: 1.7 }}>
            From the casino courses of Reno to the Jack Nicklaus Signature at Truckee, from the lakeside finish at Edgewood to the secluded gems of Graeagle — the High Sierra is the most underrated golf destination in the American West.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="max-md:!grid-cols-1 max-lg:!grid-cols-2">
          {REGIONS.map((r) => (
            <Link key={r.slug} href={`/${r.slug}/`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--bone)", transition: "all .3s" }} className="hover:!shadow-[0_16px_48px_rgba(0,0,0,.1)] hover:-translate-y-1">
                <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                  <Image src={r.image} alt={`${r.name} golf courses`} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,25,15,0.65) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: 14, left: 16 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 600, color: "#fff" }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>{r.tagline}</div>
                  </div>
                  <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(10,25,15,0.85)", color: "#C9A24D", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{r.price}</div>
                </div>
                <div style={{ padding: "14px 16px", background: "var(--cream)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--stone)" }}>{r.courses} championship courses</span>
                  <span style={{ fontSize: 11, color: "#C9A24D", fontWeight: 600 }}>Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ WHY GTHS ═══ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", background: "var(--cream)" }}>
        <div style={{ marginBottom: 48, maxWidth: 600 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 12 }}>Why Golf the High Sierra</div>
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(30px,3.5vw,50px)", lineHeight: 1.1 }}>
            Not a Booking Engine.<br /><em style={{ fontStyle: "italic" }}>A Trusted Planner.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="max-md:!grid-cols-1">
          {WHY.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <CheckCircle2 size={18} style={{ color: "#C9A24D", flexShrink: 0, marginTop: 3 }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{w.title}</div>
                <p style={{ fontSize: 13, color: "var(--stone)", lineHeight: 1.7 }}>{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SIGNATURE COURSES ═══ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", background: "var(--forest)" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#C9A24D", fontWeight: 500, marginBottom: 12 }}>Signature Courses</div>
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3vw,44px)", color: "#fff", lineHeight: 1.1 }}>
            The Courses That <em style={{ fontStyle: "italic" }}>Define the Sierra.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="max-md:!grid-cols-1 max-lg:!grid-cols-2">
          {COURSES_HIGHLIGHT.map((c) => (
            <Link key={c.slug} href={`/portfolio/${c.slug}/`} style={{ textDecoration: "none" }}>
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, transition: "all .3s" }} className="hover:!bg-white/10">
                <div style={{ fontFamily: "var(--serif)", fontSize: 19, color: "#fff", marginBottom: 8 }}>{c.name}</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 14 }}>{c.note}</p>
                <span style={{ fontSize: 11, color: "#C9A24D", fontWeight: 600, letterSpacing: 1 }}>View Course →</span>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link href="/group-golf-reno-tahoe/" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "14px 28px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            View All 25+ Courses <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section style={{ background: "#fff", borderTop: "1px solid var(--bone)", padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", textAlign: "center" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 16 }}>
            Ready to Play the <em style={{ fontStyle: "italic" }}>High Sierra?</em>
          </h2>
          <p style={{ color: "var(--stone)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Tell us your dates, group size, and budget. We&apos;ll build a custom itinerary — tee times, hotel, dining, and everything in between. Free consultation, no booking fees.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--forest)", color: "#fff", padding: "16px 32px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
              Get a Free Quote <ArrowRight size={14} />
            </Link>
            <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--bone)", background: "#fff", color: "var(--ink)", padding: "16px 28px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <Phone size={14} /> 888-584-8232
            </a>
          </div>
          <p style={{ fontSize: 12, color: "var(--stone)", marginTop: 20 }}>No booking fees · Trusted since 2004 · 1-888-584-8232</p>
        </div>
      </section>

    </main>
  );
}
