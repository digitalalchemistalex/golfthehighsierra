import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Smartphone, MapPin, Calendar, Users, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "TripsCaddie App | Manage Your Golf Trip | Golf the High Sierra",
  description: "TripsCaddie puts your entire golf trip in your pocket — itineraries, tee times, course details, dining reservations, and group coordination.",
  alternates: { canonical: "https://golfthehighsierra.com/trips-caddie-app/" },
};

export default function TripsCaddiePage() {
  const features = [
    { icon: Calendar, title: "Live Itinerary", desc: "Your full trip schedule — tee times, check-in, dinners — all in one place." },
    { icon: MapPin, title: "Course & Hotel Info", desc: "Directions, scorecards, hotel details, and local tips at your fingertips." },
    { icon: Users, title: "Group Coordination", desc: "Share the itinerary with your group. Everyone stays on the same page." },
    { icon: Bell, title: "Real-Time Updates", desc: "Weather alerts, tee time changes, and trip updates pushed to your phone." },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">Trip Management</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">TripsCaddie App</h1>
          <p className="text-lg text-cream-300/80">Your entire golf trip — tee times, hotels, dining, and group coordination — all in your pocket.</p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Smartphone className="w-6 h-6 text-gold-400" />
            <span className="text-cream-300 font-medium">Available for all booked groups</span>
          </div>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-pine-800 text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-6 h-6 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-pine-800 text-lg mb-1">{f.title}</h3>
                  <p className="text-pine-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pine-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Book a Trip to Get Access</h2>
          <p className="text-cream-300/80 mb-8">TripsCaddie is included with every Golf the High Sierra package.</p>
          <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
            Request A Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
