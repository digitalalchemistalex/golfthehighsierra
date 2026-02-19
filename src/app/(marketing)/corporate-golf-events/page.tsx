import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Building2, Users, Trophy, Utensils, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate Golf Events Reno & Lake Tahoe | Golf the High Sierra",
  description: "Plan your next corporate golf event in Reno or Lake Tahoe. Tournament formats, team building, client entertainment, and full event coordination at ArrowCreek, Edgewood, Red Hawk and more.",
  alternates: { canonical: "https://golfthehighsierra.com/corporate-golf-events/" },
};

const COURSES = [
  { slug: "arrowcreek-golf-club", name: "ArrowCreek Country Club", region: "Reno, NV", note: "Private-access, 36 holes — ideal for 50–144 players", heroImage: "/images/courses/arrowcreek-golf-club/ACCC-11th-Challenge-1080x720.jpg" },
  { slug: "edgewood-tahoe-golf-course", name: "Edgewood Tahoe", region: "Lake Tahoe", note: "Signature lakeside venue — perfect for prestige events", heroImage: "/images/courses/edgewood-tahoe-golf-course/480305380_1022960.jpg" },
  { slug: "red-hawk-golf-resort", name: "Red Hawk Golf Resort", region: "Reno, NV", note: "36 holes, resort amenities, full tournament services", heroImage: "/images/courses/red-hawk-golf-resort/Red-Hawk-lakes-Foto-2.jpg" },
  { slug: "lakeridge-golf-course", name: "Lakeridge Golf Course", region: "Reno, NV", note: "Island green, tournament history, flexible group sizes", heroImage: "/images/courses/lakeridge-golf-course/LakeRidgeGolfCourse.jpg" },
  { slug: "somersett-golf-country-club", name: "Somersett Golf & CC", region: "Reno, NV", note: "Private club access via GTHS — impressive client venue", heroImage: "/images/courses/somersett-golf-country-club/somersett.jpg" },
  { slug: "genoa-lakes-golf-club", name: "Genoa Lakes Golf Club", region: "Carson Valley, NV", note: "36 holes, scenic valley setting, award dinners on site", heroImage: "/images/courses/genoa-lakes-golf-club/genoa-lakes.jpg" },
];

const HOTELS = [
  { slug: "atlantis-casino-resort-spa-reno", name: "Atlantis Casino Resort Spa", note: "Group room blocks, ballrooms, full F&B" },
  { slug: "grand-sierra-resort-reno", name: "Grand Sierra Resort", note: "18,000 sq ft event space, on-site golf" },
  { slug: "peppermill-resort-spa-casino", name: "Peppermill Resort Spa", note: "Awards dinners, spa packages, group rates" },
  { slug: "harveys-lake-tahoe", name: "Harveys Lake Tahoe", note: "Lake views, casino entertainment, Edgewood minutes away" },
];

export default function CorporatePage() {
  const services = [
    { icon: Trophy, title: "Tournament Coordination", desc: "Shotgun starts, scoring systems, custom formats, closest-to-pin contests, and prizes for 16 to 144+ players." },
    { icon: Building2, title: "Venue Selection", desc: "We match your group to the right course and resort based on head count, budget, and the impression you want to make." },
    { icon: Utensils, title: "Catering & Dining", desc: "On-course beverage carts, post-round awards dinners, and group dining reservations at resort restaurants." },
    { icon: Users, title: "Team Building", desc: "Scramble formats, networking-friendly layouts, and skill contests that keep non-golfers engaged." },
  ];

  const includes = [
    "Custom tournament formats", "On-course signage & branding", "Scoring & leaderboards",
    "Awards dinner coordination", "Gift bags & swag", "Transportation & logistics",
    "Lodging room blocks", "Practice round options",
  ];

  return (
    <main style={{ minHeight: "100vh", ["--forest" as string]: "#1E3A2F", ["--gold" as string]: "#C9A24D", ["--cream" as string]: "#FAFAF5", ["--bone" as string]: "#E8E2D9", ["--stone" as string]: "#8B8577" }}>

      {/* ═══ HERO ═══ */}
      <section style={{ background: "linear-gradient(135deg, #0f2218 0%, #1E3A2F 60%, #162d22 100%)", padding: "clamp(80px,12vh,140px) clamp(32px,7vw,120px)", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(201,162,77,0.15)", color: "#C9A24D", fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", padding: "6px 16px", borderRadius: 100, marginBottom: 20 }}>Corporate Events</div>
          <h1 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)", fontWeight: 700, fontSize: "clamp(40px,5vw,72px)", color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
            Corporate Golf Events<br /><em style={{ fontStyle: "italic", color: "#C9A24D" }}>Reno & Lake Tahoe</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
            From client entertainment rounds to full company tournaments — we plan and execute corporate golf events at the region&apos;s top courses, handling everything from tee times to trophy presentation.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A24D", color: "#fff", padding: "14px 28px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
              Request a Quote <ArrowRight size={14} />
            </Link>
            <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "14px 24px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <Phone size={14} /> 888-584-8232
            </a>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section style={{ background: "#FAFAF5", padding: "clamp(48px,8vh,80px) clamp(32px,7vw,120px)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#8B8577", fontWeight: 500, marginBottom: 12 }}>What We Handle</div>
          <h2 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)", fontWeight: 700, fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.1 }}>Full-Service <em style={{ fontStyle: "italic" }}>Event Planning</em></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20, maxWidth: 900, margin: "0 auto" }} className="max-md:!grid-cols-1">
          {services.map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #E8E2D9", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ width: 48, height: 48, background: "rgba(201,162,77,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={22} style={{ color: "#C9A24D" }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, color: "#111", marginBottom: 6 }}>{s.title}</div>
                <p style={{ fontSize: 13, color: "#8B8577", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Includes checklist */}
        <div style={{ background: "#fff", border: "1px solid #E8E2D9", borderRadius: 16, padding: "32px 40px", maxWidth: 900, margin: "24px auto 0" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 20 }}>Every package includes:</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="max-md:!grid-cols-2">
            {includes.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <CheckCircle2 size={14} style={{ color: "#C9A24D", flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: "#2A2A2A", lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED COURSES ═══ */}
      <section style={{ background: "#fff", padding: "clamp(48px,8vh,80px) clamp(32px,7vw,120px)" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#8B8577", fontWeight: 500, marginBottom: 12 }}>The Venues</div>
          <h2 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)", fontWeight: 700, fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.1, marginBottom: 8 }}>Top Corporate <em style={{ fontStyle: "italic" }}>Golf Courses</em></h2>
          <p style={{ color: "#8B8577", fontSize: 14, maxWidth: 520 }}>All courses below are available for private buyouts, tournament days, and client entertainment rounds. GTHS has direct relationships and group pricing at each.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="max-md:!grid-cols-1 max-lg:!grid-cols-2">
          {COURSES.map((c) => (
            <Link key={c.slug} href={`/portfolio/${c.slug}/`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E8E2D9", background: "#FAFAF5", transition: "all .4s" }} className="hover:shadow-lg hover:-translate-y-1">
                <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                  <Image src={c.heroImage} alt={c.name} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)", padding: "24px 16px 12px" }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{c.region}</div>
                  </div>
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)", fontSize: 19, color: "#111", marginBottom: 6 }}>{c.name}</div>
                  <p style={{ fontSize: 12, color: "#8B8577", lineHeight: 1.5, marginBottom: 12 }}>{c.note}</p>
                  <div style={{ fontSize: 11, color: "#C9A24D", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View Course →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ LODGING ═══ */}
      <section style={{ background: "#FAFAF5", padding: "clamp(40px,6vh,72px) clamp(32px,7vw,120px)" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#8B8577", fontWeight: 500, marginBottom: 12 }}>Where Groups Stay</div>
          <h2 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)", fontWeight: 700, fontSize: "clamp(26px,2.5vw,38px)", lineHeight: 1.1 }}>Partner <em style={{ fontStyle: "italic" }}>Hotels</em></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="max-md:!grid-cols-1 max-lg:!grid-cols-2">
          {HOTELS.map((h) => (
            <Link key={h.slug} href={`/portfolio/${h.slug}/`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E8E2D9", transition: "all .3s" }} className="hover:shadow-md hover:-translate-y-0.5">
                <div style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)", fontSize: 16, color: "#111", marginBottom: 6 }}>{h.name}</div>
                <p style={{ fontSize: 11, color: "#8B8577", lineHeight: 1.5, marginBottom: 10 }}>{h.note}</p>
                <div style={{ fontSize: 10, color: "#C9A24D", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>View Hotel →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ background: "#1E3A2F", padding: "clamp(48px,8vh,80px) clamp(32px,7vw,120px)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>
          Plan Your <em style={{ fontStyle: "italic" }}>Corporate Event</em>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
          Tell us your dates, group size, and goals. We&apos;ll handle course selection, lodging blocks, and day-of coordination.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A24D", color: "#fff", padding: "16px 32px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
            Request a Quote <ArrowRight size={14} />
          </Link>
          <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "16px 24px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            <Phone size={14} /> 888-584-8232
          </a>
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 20 }}>Trusted by 10,000+ golf groups since 2004</p>
      </section>

    </main>
  );
}
