import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone, Users, Trophy, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Group Golf Packages Reno & Lake Tahoe | Golf the High Sierra",
  description: "Group golf packages for 8 to 144 players in Reno, Lake Tahoe, and the High Sierra. Tee times, room blocks, tournament coordination, and dining — all handled. No booking fees.",
  alternates: { canonical: "https://golfthehighsierra.com/group-golf-packages/" },
  openGraph: {
    title: "Group Golf Packages Reno & Lake Tahoe | Golf the High Sierra",
    description: "Group golf packages for 8 to 144 players. Tee times, hotel blocks, and full coordination in one call.",
    images: [{ url: "https://golfthehighsierra.vercel.app/images/regions/reno.jpg" }],
  },
};

const GROUP_SIZES = [
  {
    range: "8–15 Players",
    icon: "👥",
    description: "Friend group weekends, buddy trips, and small corporate outings. We book tee times in one group, coordinate a hotel block, and set up a group dinner. Simplest format — maximum fun.",
    includes: ["1–2 tee time blocks", "Hotel room coordination", "Group dinner reservation", "Optional rental car or shuttle"],
    bestFor: "Bachelor parties, annual buddy trips, small office outings",
  },
  {
    range: "16–36 Players",
    icon: "🏌️",
    description: "Mid-size groups that benefit from a shotgun start or split tee format. We handle scoring, flight assignments, and can arrange closest-to-pin and long drive contests.",
    includes: ["Shotgun or split tee format", "Flight assignments & handicaps", "Scoring & leaderboards", "Awards ceremony coordination", "Room block with group rates"],
    bestFor: "Corporate groups, charity events, large friend groups, association outings",
  },
  {
    range: "40–144 Players",
    icon: "🏆",
    description: "Full tournament operations at courses equipped for large events — ArrowCreek, Red Hawk, Genoa Lakes, and Grand Sierra's on-site course. We serve as your full event management team.",
    includes: ["Full tournament coordination", "On-course signage & branding", "Beverage carts & F&B packages", "Awards dinner at resort venue", "Scoreboard & live scoring", "Gift bags & custom swag", "Transportation logistics"],
    bestFor: "Company tournaments, charity golf events, association championships, client entertainment days",
  },
];

const VENUES = [
  { name: "ArrowCreek Country Club", region: "Reno", capacity: "Up to 144", note: "36 holes, private club access via GTHS", slug: "arrowcreek-golf-club" },
  { name: "Red Hawk Golf Resort", region: "Reno", capacity: "Up to 144", note: "36 holes, full resort amenities", slug: "red-hawk-golf-resort" },
  { name: "Edgewood Tahoe", region: "Lake Tahoe", capacity: "Up to 72", note: "Prestige venue, lakeside finishing holes", slug: "edgewood-tahoe-golf-course" },
  { name: "Genoa Lakes Golf Club", region: "Carson Valley", capacity: "Up to 144", note: "36 holes, Peter Jacobsen & Johnny Miller designs", slug: "genoa-lakes-golf-club" },
  { name: "Lakeridge Golf Course", region: "Reno", capacity: "Up to 72", note: "Tournament history, iconic island green", slug: "lakeridge-golf-course" },
  { name: "Grizzly Ranch Golf Club", region: "Graeagle", capacity: "Up to 72", note: "#1 public course in the Sierra (Golf Digest)", slug: "grizzly-ranch-golf-club" },
];

const PROCESS = [
  { step: "01", title: "One Call", desc: "Tell us your dates, group size, budget, and preferred region. 20 minutes is all we need." },
  { step: "02", title: "Custom Proposal", desc: "Within 24 hours we send you 2–3 package options with course, hotel, and pricing." },
  { step: "03", title: "Lock It In", desc: "Choose your package. We secure tee times, room blocks, and all reservations." },
  { step: "04", title: "Show Up & Play", desc: "We handle logistics. You focus on your game. We're available throughout the trip." },
];

export default function GroupGolfPage() {
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
      <section style={{ background: "linear-gradient(135deg, #0a190f 0%, #1E3A2F 60%, #122318 100%)", padding: "clamp(80px,12vh,140px) clamp(32px,7vw,120px)", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(201,162,77,0.15)", color: "#C9A24D", fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", padding: "6px 16px", borderRadius: 100, marginBottom: 20 }}>
            Group Golf Packages
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(38px,5vw,68px)", color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
            8 Players to 144.<br />
            <em style={{ fontStyle: "italic", color: "#C9A24D" }}>We Handle All of It.</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 36px" }}>
            Group golf packages across Reno, Lake Tahoe, Truckee, Graeagle, and Carson Valley. Tee times, hotel blocks, tournament formats, dining — coordinated in one conversation. No booking fees. Trusted since 2004.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A24D", color: "#fff", padding: "15px 30px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
              Get a Group Quote <ArrowRight size={14} />
            </Link>
            <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "15px 26px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <Phone size={14} /> 888-584-8232
            </a>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 20 }}>No booking fees · Group rates guaranteed · Free consultation</p>
        </div>
      </section>

      {/* ═══ GROUP SIZES ═══ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", background: "#fff" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 12 }}>Any Group Size</div>
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(30px,3.5vw,50px)", lineHeight: 1.1 }}>
            Small Groups to <em style={{ fontStyle: "italic" }}>Full Tournaments.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="max-lg:!grid-cols-1">
          {GROUP_SIZES.map((g, i) => (
            <div key={i} style={{ background: "var(--cream)", border: "1px solid var(--bone)", borderRadius: 16, padding: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{g.icon}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>{g.range}</div>
              <p style={{ fontSize: 14, color: "var(--stone)", lineHeight: 1.7, marginBottom: 20 }}>{g.description}</p>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--stone)", fontWeight: 600, marginBottom: 10 }}>Includes</div>
                {g.includes.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                    <CheckCircle2 size={13} style={{ color: "#C9A24D", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: "#2A2A2A", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", border: "1px solid var(--bone)", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: "var(--stone)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Best For</div>
                <div style={{ fontSize: 12, color: "var(--ink)" }}>{g.bestFor}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", background: "var(--forest)" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#C9A24D", fontWeight: 500, marginBottom: 12 }}>Our Process</div>
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(30px,3.5vw,50px)", color: "#fff", lineHeight: 1.1 }}>
            Four Steps. <em style={{ fontStyle: "italic" }}>Total Simplicity.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }} className="max-lg:!grid-cols-2 max-md:!grid-cols-1">
          {PROCESS.map((p) => (
            <div key={p.step} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: 48, fontWeight: 700, color: "rgba(201,162,77,0.3)", lineHeight: 1, marginBottom: 12 }}>{p.step}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{p.title}</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <Link href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C9A24D", color: "#fff", padding: "16px 36px", borderRadius: 100, fontSize: 14, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
            Start Planning Your Group Trip <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ═══ TOURNAMENT VENUES ═══ */}
      <section style={{ padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", background: "var(--cream)" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--stone)", fontWeight: 500, marginBottom: 12 }}>Tournament Venues</div>
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3vw,44px)", lineHeight: 1.1, marginBottom: 12 }}>
            Top Group <em style={{ fontStyle: "italic" }}>Golf Venues</em>
          </h2>
          <p style={{ color: "var(--stone)", fontSize: 14, maxWidth: 520, lineHeight: 1.7 }}>Every venue below has hosted GTHS group events. We know the staff, the formats that work, and how to get the most out of each property.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="max-md:!grid-cols-1 max-lg:!grid-cols-2">
          {VENUES.map((v) => (
            <Link key={v.slug} href={`/portfolio/${v.slug}/`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "#fff", border: "1px solid var(--bone)", borderRadius: 12, padding: 24, transition: "all .3s" }} className="hover:!shadow-md hover:-translate-y-0.5">
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <MapPin size={11} style={{ color: "#C9A24D" }} />
                  <span style={{ fontSize: 10, color: "var(--stone)", letterSpacing: 1.5, textTransform: "uppercase" }}>{v.region}</span>
                </div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 19, color: "var(--ink)", marginBottom: 6 }}>{v.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Users size={11} style={{ color: "#C9A24D" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#C9A24D" }}>{v.capacity} players</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--stone)", lineHeight: 1.5 }}>{v.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section style={{ background: "#fff", borderTop: "1px solid var(--bone)", padding: "clamp(56px,9vh,100px) clamp(32px,7vw,120px)", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Trophy size={32} style={{ color: "#C9A24D", marginBottom: 20 }} />
          <h2 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 16 }}>
            Ready to Plan Your <em style={{ fontStyle: "italic" }}>Group Trip?</em>
          </h2>
          <p style={{ color: "var(--stone)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Tell us your dates, group size, and region. We&apos;ll have a custom proposal back to you within 24 hours — no obligation, no booking fees.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact-custom-golf-package/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--forest)", color: "#fff", padding: "16px 32px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textDecoration: "none" }}>
              Get a Free Group Quote <ArrowRight size={14} />
            </Link>
            <a href="tel:+18885848232" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--bone)", background: "#fff", color: "var(--ink)", padding: "16px 28px", borderRadius: 100, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <Phone size={14} /> 888-584-8232
            </a>
          </div>
          <p style={{ fontSize: 12, color: "var(--stone)", marginTop: 20 }}>Trusted by 10,000+ golf groups · Serving the High Sierra since 2004</p>
        </div>
      </section>

    </main>
  );
}
