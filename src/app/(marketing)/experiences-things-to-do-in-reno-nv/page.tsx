import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mountain, Waves, Utensils, Gamepad2, Music, Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Things To Do in Reno & Lake Tahoe | Experiences | Golf the High Sierra",
  description: "Beyond golf — discover the best restaurants, casinos, outdoor adventures, nightlife, and attractions in Reno & Lake Tahoe.",
  alternates: { canonical: "https://golfthehighsierra.com/experiences-things-to-do-in-reno-nv/" },
};

export default function ExperiencesPage() {
  const experiences = [
    { icon: Gamepad2, title: "Casino & Nightlife", desc: "World-class casinos, comedy clubs, live shows, and vibrant nightlife — Reno and Tahoe deliver after dark.", spots: "Peppermill, Grand Sierra, Silver Legacy, Atlantis" },
    { icon: Utensils, title: "Fine Dining", desc: "From Gordon Ramsay\u2019s Kitchen to lakefront steakhouses — award-winning restaurants across the region.", spots: "Ramsay\u2019s Kitchen, Lone Eagle Grille, Beaujolais Bistro" },
    { icon: Waves, title: "Lake Tahoe Water Sports", desc: "Kayaking, paddleboarding, jet skiing, and sunset cruises on America\u2019s most stunning alpine lake.", spots: "Sand Harbor, Emerald Bay, Zephyr Cove" },
    { icon: Mountain, title: "Outdoor Adventures", desc: "Hiking, biking, zip lines, and hot air balloon rides with breathtaking Sierra Nevada views.", spots: "Mt. Rose, Flume Trail, Tahoe Rim Trail" },
    { icon: Music, title: "Live Entertainment", desc: "Concerts, comedy shows, and sporting events at top venues across Reno.", spots: "Grand Theatre at GSR, Nugget Event Center, Laugh Factory" },
    { icon: Camera, title: "Sightseeing & Culture", desc: "Museums, art walks, riverwalk district, and scenic drives through the Sierra.", spots: "Riverwalk District, National Automobile Museum, Virginia City" },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">Beyond the Course</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">Experiences & Things To Do</h1>
          <p className="text-lg text-cream-300/80">Your golf trip is more than golf. Explore the best of Reno & Lake Tahoe.</p>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-4">
                <exp.icon className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-heading font-bold text-pine-800 text-xl mb-2">{exp.title}</h3>
              <p className="text-pine-600 text-sm leading-relaxed mb-3">{exp.desc}</p>
              <p className="text-xs text-pine-400">Popular: {exp.spots}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-pine-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">We Plan the Whole Trip</h2>
          <p className="text-cream-300/80 mb-8">Dining reservations, activity bookings, and transportation — all included in your package.</p>
          <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
            Build Your Trip <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
