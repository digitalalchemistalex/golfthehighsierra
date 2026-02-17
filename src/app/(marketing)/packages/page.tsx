import { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight, Users, MapPin, Building2, Utensils, Bus, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Golf Packages | Reno & Lake Tahoe Stay-and-Play Deals",
  description:
    "Custom group golf packages across Reno, Lake Tahoe, Truckee, Graeagle & Carson Valley. One contract covers tee times, lodging, dining, transportation — groups of 4 to 400+.",
  alternates: { canonical: "https://golfthehighsierra.com/packages/" },
  openGraph: {
    title: "Golf Packages | Reno & Lake Tahoe Stay-and-Play Deals",
    description: "Custom group golf packages — one contract covers tee times, lodging, dining, and transportation across the High Sierra.",
    url: "https://golfthehighsierra.com/packages/",
  },
};

export default function PackagesPage() {
  const packageTypes = [
    {
      icon: Users,
      title: "Buddies Trip",
      desc: "Gather your crew for a weekend of championship golf, casino nightlife, and world-class dining. We handle the details so you can focus on the competition.",
      courses: "2–3 rounds",
      nights: "2–4 nights",
    },
    {
      icon: Building2,
      title: "Corporate Outing",
      desc: "Impress clients and reward your team with a professionally planned golf event. Conference rooms, banquet dining, and tournament coordination included.",
      courses: "1–4 rounds",
      nights: "1–5 nights",
    },
    {
      icon: Trophy,
      title: "Tournament Package",
      desc: "Full tournament management for groups of 20 to 400+. Scoring, awards, signage, box lunches on-course, and post-round banquets.",
      courses: "1–2 rounds",
      nights: "2–3 nights",
    },
    {
      icon: MapPin,
      title: "Multi-Region Tour",
      desc: "Play across Reno, Lake Tahoe, Truckee, and Graeagle in one trip. We coordinate lodging moves, tee times, and transportation between regions.",
      courses: "4–6 rounds",
      nights: "4–7 nights",
    },
  ];

  const included = [
    { icon: MapPin, label: "26+ Championship Courses", detail: "Reno, Lake Tahoe, Truckee, Graeagle, Carson Valley" },
    { icon: Building2, label: "Premium Lodging", detail: "Casinos, resorts, mountain lodges, vacation rentals" },
    { icon: Utensils, label: "Dining Reservations", detail: "Steakhouses, craft breweries, poolside dining" },
    { icon: Bus, label: "Airport Transfers", detail: "Group shuttles from RNO to your hotel and courses" },
    { icon: Trophy, label: "Tournament Services", detail: "Scoring, prizes, signage, on-course catering" },
    { icon: Users, label: "Online Registration", detail: "Custom registration portal for your attendees" },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            Custom Packages
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Golf Packages Built for Your Group
          </h1>
          <p className="text-lg text-cream-300/80 max-w-2xl mx-auto">
            From a foursome weekend to a 400-person corporate tournament — one contract, one deposit, one contact. We handle tee times, lodging, dining, transportation, and everything in between.
          </p>
        </div>
      </section>

      {/* Package Types */}
      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-pine-800 text-center mb-4">
            Choose Your Package Style
          </h2>
          <p className="text-pine-600 text-center max-w-2xl mx-auto mb-12">
            Every package is fully customizable. Tell us your group size, budget, and preferred dates — we build the rest.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packageTypes.map((pkg, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <pkg.icon className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-pine-800 text-lg mb-1">{pkg.title}</h3>
                    <p className="text-pine-600 text-sm leading-relaxed mb-3">{pkg.desc}</p>
                    <div className="flex gap-4 text-xs text-pine-500">
                      <span className="bg-cream-200 px-3 py-1 rounded-full">{pkg.courses}</span>
                      <span className="bg-cream-200 px-3 py-1 rounded-full">{pkg.nights}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-pine-800 text-center mb-4">
            What Every Package Includes
          </h2>
          <p className="text-pine-600 text-center max-w-2xl mx-auto mb-12">
            One contract covers everything. No juggling vendors, no surprise deposits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item, i) => (
              <div key={i} className="bg-cream-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-lg mx-auto flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-semibold text-pine-800 mb-1">{item.label}</h3>
                <p className="text-pine-600 text-sm">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-pine-800 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "26+", l: "Golf Courses" },
              { n: "23", l: "Hotels & Resorts" },
              { n: "4", l: "Regions" },
              { n: "20+", l: "Years Experience" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-heading font-bold text-gold-400">{s.n}</p>
                <p className="text-sm text-cream-300/70 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-pine-800 mb-4">
            Ready to Plan Your Trip?
          </h2>
          <p className="text-pine-600 max-w-xl mx-auto mb-8">
            Tell us your dates, group size, and budget. We&apos;ll send you a custom package with courses, lodging, and pricing within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-custom-golf-package/"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors"
            >
              Request A Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+1-888-584-8232"
              className="inline-flex items-center gap-2 border-2 border-pine-300 hover:border-pine-800 text-pine-800 font-bold py-3.5 px-8 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" /> (888) 584-8232
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
