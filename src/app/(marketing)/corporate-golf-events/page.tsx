import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Building2, Users, Trophy, Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate Golf Events Reno & Lake Tahoe | Golf the High Sierra",
  description: "Plan your next corporate golf event in Reno or Lake Tahoe. Tournament formats, team building, client entertainment, and full event coordination.",
  alternates: { canonical: "https://golfthehighsierra.com/corporate-golf-events/" },
};

export default function CorporatePage() {
  const services = [
    { icon: Trophy, title: "Tournament Coordination", desc: "Shotgun starts, scoring, prizes, and custom formats for 16 to 144+ players." },
    { icon: Building2, title: "Venue Selection", desc: "We match your group to the right course and resort based on size, budget, and style." },
    { icon: Utensils, title: "Catering & Dining", desc: "On-course beverage carts, awards dinners, and group dining reservations." },
    { icon: Users, title: "Team Building", desc: "Scramble formats, closest-to-pin contests, and networking-friendly layouts." },
  ];

  const includes = ["Custom tournament formats", "On-course signage & branding", "Scoring & leaderboards", "Awards dinner coordination", "Gift bags & swag", "Transportation & logistics", "Lodging blocks", "Practice round options"];

  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">Corporate Events</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">Corporate Golf Events</h1>
          <p className="text-lg text-cream-300/80">From client entertainment to company tournaments — we plan and execute corporate golf events across Reno & Lake Tahoe.</p>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-6 h-6 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-pine-800 text-lg mb-1">{s.title}</h3>
                  <p className="text-pine-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-bold text-pine-800 mb-6">What\u2019s Included</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-pine-700">
                  <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-pine-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Plan Your Corporate Event</h2>
          <p className="text-cream-300/80 mb-8">Tell us your dates, group size, and goals — we\u2019ll handle the rest.</p>
          <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
            Request A Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
