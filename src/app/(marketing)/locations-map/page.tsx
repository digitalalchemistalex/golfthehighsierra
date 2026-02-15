import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ALL_COURSES } from "@/data/courses";
import { ALL_HOTELS } from "@/data/hotels";

export const metadata: Metadata = {
  title: "Locations Map | Golf Courses & Hotels | Golf the High Sierra",
  description: "Interactive map of all golf courses and hotels in the Reno, Lake Tahoe, Truckee, Graeagle, and Carson Valley regions.",
  alternates: { canonical: "https://golfthehighsierra.com/locations-map/" },
};

export default function LocationsMapPage() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Locations Map</h1>
          <p className="text-lg text-cream-300/80">{ALL_COURSES.length} courses and {ALL_HOTELS.length} hotels across the High Sierra.</p>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-pine-800 mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-gold-500" /> Golf Courses</h2>
              <div className="space-y-2">
                {ALL_COURSES.map((c) => (
                  <Link key={c.slug} href={`/portfolio/${c.slug}/`} className="flex items-center justify-between bg-white px-4 py-3 rounded-lg hover:bg-gold-50 transition-colors group">
                    <span className="text-pine-700 text-sm group-hover:text-pine-800 font-medium">{c.name}</span>
                    <span className="text-pine-400 text-xs">{c.regionLabel}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-pine-800 mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-gold-500" /> Hotels & Lodging</h2>
              <div className="space-y-2">
                {ALL_HOTELS.map((h) => (
                  <Link key={h.slug} href={`/portfolio/${h.slug}/`} className="flex items-center justify-between bg-white px-4 py-3 rounded-lg hover:bg-gold-50 transition-colors group">
                    <span className="text-pine-700 text-sm group-hover:text-pine-800 font-medium">{h.name}</span>
                    <span className="text-pine-400 text-xs">{h.regionLabel}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-pine-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Ready to Explore?</h2>
          <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
            Build Your Package <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
