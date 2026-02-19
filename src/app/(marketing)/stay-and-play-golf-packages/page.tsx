import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Phone, Star, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Stay and Play Golf Packages Reno & Lake Tahoe | Golf the High Sierra",
  description: "Stay and play golf packages in Reno and Lake Tahoe. Tee times, hotel, and full trip logistics in one call. Group rates, no booking fees. Trusted 20+ years.",
  alternates: { canonical: "https://golfthehighsierra.com/stay-and-play-golf-packages/" },
  openGraph: { title: "Stay and Play Golf Packages Reno & Lake Tahoe", description: "Stay and play golf packages in Reno and Lake Tahoe. Custom tee times, hotel blocks, and full logistics.", images: [{ url: "https://golfthehighsierra.vercel.app/images/regions/reno.jpg" }] },
};

const PACKAGES = [
  {
    name: "Reno Casino Golf Weekend",
    region: "Reno, NV",
    nights: "2–3 Nights",
    rounds: "2–3 Rounds",
    price: "From $179/golfer",
    courses: ["Lakeridge Golf Course", "ArrowCreek Country Club", "Red Hawk Golf Resort"],
    hotels: "Atlantis, Peppermill, or Silver Legacy",
    highlight: "Casino entertainment & dining after every round",
    image: "/images/regions/reno.jpg",
    slug: "best-golf-courses-reno",
  },
  {
    name: "Lake Tahoe Bucket List",
    region: "Lake Tahoe, NV/CA",
    nights: "3–4 Nights",
    rounds: "2–3 Rounds",
    price: "From $299/golfer",
    courses: ["Edgewood Tahoe", "Incline Village Championship", "Tahoe Donner"],
    hotels: "Hyatt Regency, Harrah's Tahoe, or Harveys",
    highlight: "Signature lakeside golf — Edgewood's finishing holes on the shore",
    image: "/images/regions/tahoe.jpg",
    slug: "best-golf-courses-lake-tahoe",
  },
  {
    name: "Truckee Pines Golf Retreat",
    region: "Truckee/North Tahoe, CA",
    nights: "2–3 Nights",
    rounds: "2–3 Rounds",
    price: "From $249/golfer",
    courses: ["Old Greenwood (Jack Nicklaus)", "Coyote Moon", "Gray's Crossing"],
    hotels: "Old Greenwood Lodging or Hampton Inn Truckee",
    highlight: "Jack Nicklaus Signature Golf in the High Sierra pines",
    image: "/images/courses/old-greenwood-golf-course/old-greenwood.jpg",
    slug: "best-golf-courses-truckee",
  },
  {
    name: "Lost Sierra Golf Adventure",
    region: "Graeagle, CA",
    nights: "2–3 Nights",
    rounds: "3–4 Rounds",
    price: "From $149/golfer",
    courses: ["Grizzly Ranch", "Whitehawk Ranch", "Nakoma Dragon", "Plumas Pines"],
    hotels: "River Pines Resort, The Inn at Nakoma, or Townhomes at Plumas Pines",
    highlight: "5 courses within 20 minutes — Northern California's best kept secret",
    image: "/images/regions/graeagle.jpg",
    slug: "best-golf-courses-graeagle",
  },
  {
    name: "Carson Valley Golf Gateway",
    region: "Carson Valley, NV",
    nights: "2 Nights",
    rounds: "2–3 Rounds",
    price: "From $129/golfer",
    courses: ["Genoa Lakes Golf Club (36 holes)", "Dayton Valley Golf Club", "Eagle Valley Golf Course"],
    hotels: "Carson Valley Inn & Casino",
    highlight: "Peter Jacobsen & Johnny Miller designed courses — best value in Nevada",
    image: "/images/regions/carson-valley.jpg",
    slug: "best-golf-courses-carson-valley",
  },
];

const WHAT_WE_HANDLE = [
  "Tee time reservations at group rates — guaranteed",
  "Hotel room blocks with golf package pricing",
  "Coordination between check-in, tee times, and checkout",
  "Dining reservations at resort restaurants",
  "Transportation between hotel and courses if needed",
  "Custom multi-round itineraries (2 to 5 rounds, any config)",
  "Tournament formats and scoring for competitive groups",
  "On-site concierge support throughout your trip",
];

const STATS = [
  { number: "20+", label: "Years booking group golf" },
  { number: "10,000+", label: "Groups planned" },
  { number: "5", label: "Regions covered" },
  { number: "25+", label: "Partner courses" },
];

export default function StayAndPlayPage() {
  const css = {
    ["--forest" as string]: "#1E3A2F",
    ["--gold" as string]: "#C9A24D",
    ["--cream" as string]: "#FAFAF5",
    ["--white" as string]: "#FFFFFF",
    ["--ink" as string]: "#111111",
    ["--stone" as string]: "#8B8577",
    ["--bone" as string]: "#E8E2D9",
    ["--charcoal" as string]: "#2A2A2A",
    ["--serif" as string]: "var(--font-cormorant, 'Cormorant Garamond', Georgia, serif)",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#FAFAF5", ...css }}>

      {/* ═══ HERO ═══ */}
      <section style={{ background: "linear-gradient(135deg, #0a190f 0%, #1E3A2F 60%, #122318 100%)", padding: "clamp(80px,12vh,140px) clamp(32px,7vw,120px)", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(201,162,77,0.15)", color: "#C9A24D", fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", padding: "6px 16px", borderRadius: 100, marginBottom: 20 }}>
            Stay & Play Golf Packages
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(38px,5vw,68px)", color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
            Golf. Hotel. Everything.<br />
            <em style={{ fontStyle: "italic", color: "#C9A24D" }}>One Call.</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 36, maxWidth: 580, margin: "0 auto 36px" }}>
            Custom stay and play golf packages across Reno, Lake Tahoe, Truckee, Graeagle, and Carson Valley. We handle tee times, hotel blocks, dining, and logistics — you just show up and play.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A24D", color: "#fff", padding: "15px 30px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
              Build My Package <ArrowRight size={14} />
            </Link>
            <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "15px 26px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <Phone size={14} /> 888-584-8232
            </a>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ background: "#1E3A2F", padding: "20px clamp(32px,7vw,120px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px 48px" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A24D", fontFamily: "var(--serif)" }}>{s.number}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PACKAGES ═══ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", background: "#fff" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 12 }}>Choose Your Region</div>
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(30px,3.5vw,50px)", lineHeight: 1.1, marginBottom: 12 }}>
            5 Regions. <em style={{ fontStyle: "italic" }}>Unlimited Combinations.</em>
          </h2>
          <p style={{ color: "var(--stone)", fontSize: 15, maxWidth: 540, lineHeight: 1.7 }}>
            Every package is custom-built. Tell us your dates, group size, and budget — we&apos;ll put together options across all five regions within 24 hours.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 28 }} className="max-md:!grid-cols-1">
          {PACKAGES.map((pkg) => (
            <Link key={pkg.slug} href={`/${pkg.slug}/`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--bone)", background: "var(--cream)", transition: "all .3s" }} className="hover:!shadow-[0_20px_60px_rgba(0,0,0,.1)] hover:-translate-y-1">
                <div style={{ position: "relative", aspectRatio: "16/7", overflow: "hidden" }}>
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(max-width:768px) 100vw, 50vw" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,25,15,0.7) 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <MapPin size={10} style={{ color: "#C9A24D" }} />
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", letterSpacing: 1.5, textTransform: "uppercase" }}>{pkg.region}</span>
                    </div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 600, color: "#fff" }}>{pkg.name}</div>
                  </div>
                  <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(10,25,15,0.85)", color: "#C9A24D", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>{pkg.price}</div>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <span style={{ background: "#E8F4ED", color: "#1E3A2F", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100 }}>{pkg.nights}</span>
                    <span style={{ background: "#E8F4ED", color: "#1E3A2F", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100 }}>{pkg.rounds}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--stone)", marginBottom: 10 }}>
                    <strong style={{ color: "var(--ink)", fontSize: 11 }}>COURSES:</strong> {pkg.courses.join(" · ")}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--stone)", marginBottom: 14 }}>
                    <strong style={{ color: "var(--ink)", fontSize: 11 }}>LODGING:</strong> {pkg.hotels}
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Star size={12} style={{ color: "#C9A24D", fill: "#C9A24D", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "var(--charcoal)", lineHeight: 1.5 }}>{pkg.highlight}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ WHAT WE HANDLE ═══ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", background: "var(--forest)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="max-md:!grid-cols-1">
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#C9A24D", fontWeight: 500, marginBottom: 14 }}>Full Service Planning</div>
            <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3vw,44px)", color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
              Everything Handled.<br /><em style={{ fontStyle: "italic" }}>Nothing Missed.</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
              Most golf groups spend weeks emailing courses and comparing hotels. One 20-minute call with us replaces all of it. We have the relationships, the group rates, and two decades of execution experience.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {WHAT_WE_HANDLE.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <CheckCircle2 size={15} style={{ color: "#C9A24D", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 40 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#C9A24D", fontWeight: 500, marginBottom: 8 }}>Get Started</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 24, color: "#fff", marginBottom: 8 }}>Build Your Package</div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
              Free consultation · No booking fees · Group rates guaranteed. We&apos;ve been booking group golf in the High Sierra since 2004.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/contact-custom-golf-package/" style={{ display: "block", textAlign: "center", background: "#C9A24D", color: "#fff", padding: "16px 24px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
                Request a Free Quote →
              </Link>
              <a href="tel:+18885848232" style={{ display: "block", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "15px 24px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                📞 Call 1-888-584-8232
              </a>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 16 }}>10,000+ golf groups planned since 2004</p>
          </div>
        </div>
      </section>

      {/* ═══ REGIONS GRID ═══ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", background: "var(--cream)" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 14 }}>Explore by Region</div>
        <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.1, marginBottom: 32 }}>
          5 Regions. <em style={{ fontStyle: "italic" }}>One Planner.</em>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }} className="max-lg:!grid-cols-3 max-md:!grid-cols-2">
          {[
            { name: "Reno", slug: "best-golf-courses-reno", courses: "8 courses", price: "From $179" },
            { name: "Lake Tahoe", slug: "best-golf-courses-lake-tahoe", courses: "4 courses", price: "From $299" },
            { name: "Truckee", slug: "best-golf-courses-truckee", courses: "4 courses", price: "From $249" },
            { name: "Graeagle", slug: "best-golf-courses-graeagle", courses: "5 courses", price: "From $149" },
            { name: "Carson Valley", slug: "best-golf-courses-carson-valley", courses: "3 courses", price: "From $129" },
          ].map((r) => (
            <Link key={r.slug} href={`/${r.slug}/`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", border: "1px solid var(--bone)", borderRadius: 12, padding: "20px 16px", textAlign: "center", transition: "all .3s" }} className="hover:!border-[#C9A24D] hover:!shadow-md">
                <div style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--ink)", marginBottom: 4 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "var(--stone)", marginBottom: 8 }}>{r.courses}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#C9A24D" }}>{r.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
