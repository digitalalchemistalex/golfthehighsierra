import { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight, Users, Award, Shield, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "About Golf the High Sierra | Group Golf Trip Experts Since 2004",
  description: "20+ years planning group golf trips across Reno, Lake Tahoe, Truckee, Graeagle & Carson Valley. One contract, one contact — we handle tee times, lodging, dining, and transportation.",
  alternates: { canonical: "https://golfthehighsierra.com/about-group-golf-packages/" },
};

export default function AboutPage() {
  const values = [
    { icon: Shield, title: "One Contract, One Contact", desc: "No juggling vendors. We coordinate courses, hotels, dining, and transportation so you focus on golf." },
    { icon: Users, title: "Groups of Any Size", desc: "From foursomes to 100+ corporate outings — we build custom packages for every group." },
    { icon: Award, title: "20+ Years of Expertise", desc: "Since 2004, we\u2019ve been the Reno-Tahoe region\u2019s most trusted group golf planners." },
    { icon: Calendar, title: "Flexible Scheduling", desc: "Play when you want. We lock in tee times, adjust for weather, and handle last-minute changes." },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">Since 2004</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">Your Golf Trip. Our Expertise.</h1>
          <p className="text-lg text-cream-300/80 max-w-2xl mx-auto">Golf the High Sierra has been planning unforgettable group golf experiences across Reno, Lake Tahoe, Truckee, Graeagle, and Carson Valley for over 20 years.</p>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-pine-800 text-center mb-4">Why Groups Choose Us</h2>
          <p className="text-pine-600 text-center max-w-2xl mx-auto mb-12">We take the complexity out of group golf travel. One call, one contract — and your entire trip is handled.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-6 h-6 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-pine-800 text-lg mb-1">{v.title}</h3>
                  <p className="text-pine-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-pine-800 mb-6">What We Offer</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[{ n: "22+", l: "Golf Courses" }, { n: "21", l: "Hotels & Resorts" }, { n: "4", l: "Regions" }, { n: "20+", l: "Years Experience" }].map((s, i) => (
              <div key={i} className="bg-cream-200 rounded-xl p-6">
                <p className="text-3xl font-heading font-bold text-gold-600">{s.n}</p>
                <p className="text-sm text-pine-600 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="text-pine-600 leading-relaxed max-w-2xl mx-auto mb-8">From Reno\u2019s championship courses to Lake Tahoe\u2019s stunning mountain layouts, we curate every detail of your golf getaway — tee times, lodging, dining reservations, airport transfers, and more.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
              Request A Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+1-888-584-8232" className="inline-flex items-center gap-2 border-2 border-pine-300 hover:border-pine-800 text-pine-800 font-bold py-3.5 px-8 rounded-lg transition-colors">
              <Phone className="w-5 h-5" /> (888) 584-8232
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
