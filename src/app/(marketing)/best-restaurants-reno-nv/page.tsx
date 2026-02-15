import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Restaurants in Reno & Lake Tahoe | Dining Guide | Golf the High Sierra",
  description: "Top restaurants for golf groups in Reno & Lake Tahoe — steakhouses, fine dining, brewpubs, and group-friendly spots near the courses.",
  alternates: { canonical: "https://golfthehighsierra.com/best-restaurants-reno-nv/" },
};

export default function RestaurantsPage() {
  const restaurants = [
    { name: "Ramsay\u2019s Kitchen", loc: "Silver Legacy, Reno", type: "Fine Dining", desc: "Gordon Ramsay\u2019s signature restaurant — Beef Wellington, Lobster Risotto, and world-class cocktails." },
    { name: "Lone Eagle Grille", loc: "Hyatt Lake Tahoe", type: "Lakefront Steakhouse", desc: "Award-winning lakefront dining with stunning Lake Tahoe views." },
    { name: "Anthony\u2019s Chophouse", loc: "Nugget Casino, Sparks", type: "Steakhouse", desc: "Premium steaks and seafood in an upscale casino setting." },
    { name: "Brew Brothers", loc: "Eldorado, Reno", type: "Craft Brewery", desc: "House-brewed beers and elevated pub fare — perfect for post-round groups." },
    { name: "Saltgrass Steak House", loc: "Golden Nugget, Lake Tahoe", type: "Steakhouse", desc: "Sizzling steaks and hearty American fare at Stateline." },
    { name: "Friday\u2019s Station", loc: "Harrah\u2019s Lake Tahoe", type: "Steak & Seafood", desc: "Fine dining steaks with mountain views at Stateline." },
    { name: "Peter B\u2019s Brewpub", loc: "Portola Hotel, Monterey", type: "Brewpub", desc: "Monterey\u2019s first craft brewpub with handcrafted beers." },
    { name: "LandShark Bar & Grill", loc: "Margaritaville, Lake Tahoe", type: "Casual", desc: "Island-inspired burgers, seafood, and tropical cocktails." },
    { name: "Stella", loc: "Cedar House, Truckee", type: "Farm-to-Table", desc: "Seasonal farm-to-table cuisine in a mountain lodge setting." },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">Dining Guide</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Best Restaurants in Reno & Lake Tahoe</h1>
          <p className="text-lg text-cream-300/80">Top dining spots near the courses — steakhouses, fine dining, and group-friendly restaurants.</p>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {restaurants.map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Utensils className="w-5 h-5 text-gold-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-semibold text-pine-800 text-lg">{r.name}</h3>
                  <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded font-medium">{r.type}</span>
                </div>
                <p className="text-pine-500 text-xs mt-0.5">{r.loc}</p>
                <p className="text-pine-600 text-sm mt-1">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-pine-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">We Book Dinner Too</h2>
          <p className="text-cream-300/80 mb-8">Group dining reservations are included in your golf package.</p>
          <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
            Request A Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
