import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight, CheckCircle2, Star, MapPin } from "lucide-react";
import { getRegionBySlug } from "@/data/regions";
import { getCoursesByRegion } from "@/data/courses";
import { getHotelBySlug } from "@/data/hotels";

export const metadata: Metadata = {
  title: "Reno Golf Packages | Stay and Play Trips in Reno NV",
  description: "Build a Reno golf package with tee times, lodging, and casino resorts. 20+ years trusted planning, group discounts, and custom itineraries.",
  alternates: { canonical: "https://golfthehighsierra.com/reno/" },
  openGraph: {
    title: "Reno Golf Packages | Stay and Play Trips in Reno NV",
    description: "Build a Reno golf package with tee times, lodging, and casino resorts. 20+ years trusted planning, group discounts, and custom itineraries.",
    images: [{ url: "https://golfthehighsierra.vercel.app/images/regions/reno.jpg" }],
  },
};

function R({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={style}>{children}</div>;
}

export default function RenoPage() {
  const region = getRegionBySlug("best-golf-courses-reno")!;
  const courses = region.courseRegions.flatMap((r) => getCoursesByRegion(r));
  const hotels = region.hotels.map((h) => ({ ...h, data: h.slug ? getHotelBySlug(h.slug) : null }));

  const packageItems = [
    "Tee times at your chosen courses — group rates guaranteed",
    "Hotel nights with golf package pricing, not rack rate",
    "Transport between courses and hotel if needed",
    "Dining reservations at top resort restaurants",
    "Custom itinerary — 2 rounds to 5 rounds, any configuration",
  ];

  const cssVars = {
    "--forest": "#1E3A2F",
    "--gold": "#C9A24D",
    "--cream": "#FAFAF5",
    "--white": "#FFFFFF",
    "--ink": "#111111",
    "--stone": "#8B8577",
    "--bone": "#E8E2D9",
    "--charcoal": "#2A2A2A",
    "--serif": "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)",
  } as React.CSSProperties;

  return (
    <main style={{ minHeight: "100vh", background: "#FAFAF5", ...cssVars }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", height: "62vh", minHeight: 480, overflow: "hidden" }}>
        <Image src={region.heroImage} alt="Reno golf courses" fill className="object-cover" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,25,15,0.55) 0%, rgba(10,25,15,0.35) 40%, rgba(10,25,15,0.85) 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(32px,6vw,80px)", paddingBottom: "clamp(40px,7vh,80px)" }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: 14 }}>Casino Golf Capital</div>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(36px,5vw,68px)", color: "#fff", lineHeight: 1.05, marginBottom: 16 }}>Reno Golf Packages – <em style={{ fontStyle: "italic" }}>Stay and Play in Northern Nevada</em></h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", maxWidth: 580, marginBottom: 28, lineHeight: 1.6 }}>Trusted Reno golf package planner with 20+ years&apos; experience, top resorts, and group savings.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gold)", color: "#fff", padding: "14px 28px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
              Get a Free Quote <ArrowRight size={14} />
            </a>
            <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 24px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none", backdropFilter: "blur(8px)" }}>
              <Phone size={14} /> 888-584-8232
            </a>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ background: "var(--forest)", padding: "16px clamp(32px,7vw,120px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 40px", justifyContent: "center", rowGap: 8 }}>
          {[`${courses.length} Championship Courses`, `${hotels.length} Partner Hotels`, region.priceRange || "", region.season].filter(Boolean).map((item, i) => (
            <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>{item}</span>
          ))}
        </div>
      </section>

      {/* ═══ WHY RENO ═══ */}
      <section style={{ padding: "clamp(48px,8vh,96px) clamp(32px,7vw,120px)", background: "var(--white)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="max-md:!grid-cols-1">
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Why Golf Here</div>
            <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(26px,3vw,42px)", lineHeight: 1.1, marginBottom: 20 }}>Why Choose Reno <em style={{ fontStyle: "italic" }}>for Your Golf Trip</em></h2>
            <p style={{ color: "var(--stone)", fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>{region.whyPlay}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {region.bestFor.map((b, i) => (
                <span key={i} style={{ background: "var(--cream)", border: "1px solid var(--bone)", color: "var(--forest)", padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>{b}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Region Highlights</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {region.highlights.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <CheckCircle2 size={16} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: "var(--charcoal)", lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COURSES ═══ */}
      <section style={{ padding: "clamp(48px,8vh,96px) clamp(32px,7vw,120px)", background: "var(--cream)" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Golf Courses Reno, NV</div>
        <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.1, marginBottom: 32 }}>Reno <em style={{ fontStyle: "italic" }}>Golf Courses</em></h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="max-md:!grid-cols-1 max-lg:!grid-cols-2">
          {courses.map((course) => (
            <Link key={course.slug} href={`/portfolio/${course.slug}/`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--white)", transition: "all .4s" }} className="hover:!shadow-[0_16px_48px_rgba(0,0,0,.08)] hover:-translate-y-1">
                <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                  {course.heroImage
                    ? <Image src={course.heroImage} alt={course.name} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                    : <div style={{ width: "100%", height: "100%", background: "var(--bone)" }} />}
                  {course.priceRange && <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(10,25,15,0.85)", color: "#fff", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600 }}>{course.priceRange}</span>}
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 400, color: "var(--ink)", marginBottom: 4 }}>{course.name}</div>
                  {course.address?.addressLocality && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--stone)", marginBottom: 10 }}>
                      <MapPin size={10} />{course.address.addressLocality}, {course.address.addressRegion}
                    </div>
                  )}
                  {course.rating && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <Star size={12} style={{ fill: "var(--gold)", color: "var(--gold)" }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{course.rating.value}</span>
                      <span style={{ fontSize: 11, color: "var(--stone)" }}>({course.rating.count})</span>
                    </div>
                  )}
                  <p style={{ fontSize: 13, color: "var(--stone)", lineHeight: 1.5, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{course.description}</p>
                  <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View Course →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "clamp(48px,8vh,96px) clamp(32px,7vw,120px)", background: "var(--forest)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="max-md:!grid-cols-1">
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginBottom: 14 }}>How It Works</div>
            <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.1, color: "#fff", marginBottom: 16 }}>One Call.<br /><em style={{ fontStyle: "italic" }}>Complete Trip.</em></h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>Most golf groups spend weeks coordinating tee times, hotel blocks, and transport. We do it in one conversation — tell us your dates, group size, and budget, and we build the rest.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {packageItems.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <R>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 40 }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "#fff", marginBottom: 8 }}>Plan Your Reno Trip</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>Free consultation · No obligation · Group rates guaranteed</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href="/contact-custom-golf-package/" style={{ display: "block", textAlign: "center", background: "var(--gold)", color: "#fff", padding: "16px 24px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
                  Get a Free Quote →
                </a>
                <a href="tel:+18885848232" style={{ display: "block", textAlign: "center", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "15px 24px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  📞 Call 1-888-584-8232
                </a>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 16 }}>Trusted by 10,000+ golf groups since 2004</p>
            </div>
          </R>
        </div>
      </section>

      {/* ═══ PARTNER HOTELS ═══ */}
      <section style={{ padding: "clamp(48px,8vh,96px) clamp(32px,7vw,120px)", background: "var(--white)" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Where to Stay</div>
        <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.1, marginBottom: 8 }}>Partner <em style={{ fontStyle: "italic" }}>Hotels</em></h2>
        <p style={{ color: "var(--stone)", fontSize: 14, marginBottom: 32, maxWidth: 520 }}>All hotels are bookable as part of your golf package. We negotiate group rates, handle room blocks, and coordinate check-in around your tee times.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="max-md:!grid-cols-1 max-lg:!grid-cols-2">
          {hotels.map(({ name, slug, data }) => (
            slug ? (
              <Link key={slug} href={`/portfolio/${slug}/`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--cream)", transition: "all .4s" }} className="hover:!shadow-[0_16px_48px_rgba(0,0,0,.08)] hover:-translate-y-1">
                  <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                    {data?.heroImage
                      ? <Image src={data.heroImage} alt={name} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                      : <div style={{ width: "100%", height: "100%", background: "var(--bone)" }} />}
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 17, color: "var(--ink)", marginBottom: 8 }}>{name}</div>
                    <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View Hotel →</div>
                  </div>
                </div>
              </Link>
            ) : (
              <div key={name} style={{ borderRadius: 12, border: "1px solid var(--bone)", background: "var(--cream)", padding: 20 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 17, color: "var(--ink)" }}>{name}</div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section style={{ background: "var(--cream)", borderTop: "1px solid var(--bone)", padding: "clamp(48px,8vh,80px) clamp(32px,7vw,120px)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 12 }}>Ready to Play <em style={{ fontStyle: "italic" }}>Reno?</em></h2>
        <p style={{ color: "var(--stone)", fontSize: 15, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7 }}>Tell us your dates, group size, and budget. We&apos;ll build a custom Reno package — no obligation, no hidden fees.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <a href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--forest)", color: "#fff", padding: "16px 32px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
            Get a Free Quote <ArrowRight size={14} />
          </a>
          <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--bone)", background: "var(--white)", color: "var(--ink)", padding: "16px 28px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            <Phone size={14} /> 888-584-8232
          </a>
        </div>
      </section>

    </main>
  );
}
