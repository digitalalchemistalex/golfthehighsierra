import { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight, CheckCircle2, MessageCircle, CalendarCheck, Plane } from "lucide-react";

export const metadata: Metadata = {
  title: "Group Golf Reno & Lake Tahoe | How It Works | Golf the High Sierra",
  description: "Planning a group golf trip to Reno or Lake Tahoe? Here\u2019s how Golf the High Sierra makes it easy — from your first call to the final putt.",
  alternates: { canonical: "https://golfthehighsierra.com/group-golf-reno-tahoe/" },
};

export default function GroupGolfPage() {
  const steps = [
    { icon: MessageCircle, num: "01", title: "Tell Us What You Want", desc: "Call or fill out our quote form. Share your group size, dates, budget, and skill levels." },
    { icon: CalendarCheck, num: "02", title: "We Build Your Package", desc: "We curate courses, lock in tee times, book lodging, and arrange dining — all in one custom proposal." },
    { icon: CheckCircle2, num: "03", title: "Review & Confirm", desc: "One contract, one payment. Review your itinerary, make tweaks, and confirm when ready." },
    { icon: Plane, num: "04", title: "Show Up & Play", desc: "We handle everything. You show up, tee off, and enjoy a stress-free golf trip." },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">How It Works</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">Group Golf Made Easy</h1>
          <p className="text-lg text-cream-300/80">From your first call to the final putt — we handle every detail of your Reno & Lake Tahoe golf trip.</p>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-sm relative">
                <span className="absolute top-4 right-4 text-5xl font-heading font-bold text-pine-100">{s.num}</span>
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-heading font-bold text-pine-800 text-xl mb-2">{s.title}</h3>
                <p className="text-pine-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pine-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Ready to Start Planning?</h2>
          <p className="text-cream-300/80 mb-8">Tell us about your group and we\u2019ll build your perfect golf trip.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
              Get a Free Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+1-888-584-8232" className="inline-flex items-center gap-2 border-2 border-cream-300/30 text-white font-bold py-3.5 px-8 rounded-lg transition-colors hover:border-gold-400 hover:text-gold-400">
              <Phone className="w-5 h-5" /> (888) 584-8232
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
