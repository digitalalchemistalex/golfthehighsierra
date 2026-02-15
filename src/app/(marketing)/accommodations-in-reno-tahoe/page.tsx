import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Star, BedDouble, DollarSign } from "lucide-react";
import { ALL_HOTELS } from "@/data/hotels";

export const metadata: Metadata = {
  title: "Accommodations in Reno & Lake Tahoe | Hotels, Resorts & Lodging",
  description: "Browse 21 hotels and resorts for your Reno & Lake Tahoe golf trip. Casino resorts, boutique lodges, and vacation rentals — all available in custom golf packages.",
  alternates: { canonical: "https://golfthehighsierra.com/accommodations-in-reno-tahoe/" },
};

const regionOrder = ["reno", "tahoe", "truckee", "carson", "graeagle", "northern-california"];
const regionLabels: Record<string, string> = {
  reno: "Reno / Sparks",
  tahoe: "Lake Tahoe",
  truckee: "Truckee",
  carson: "Carson Valley",
  graeagle: "Graeagle",
  "northern-california": "Northern California",
};

export default function AccommodationsPage() {
  const hotelsByRegion = regionOrder.map(r => ({
    region: r,
    label: regionLabels[r] || r,
    hotels: ALL_HOTELS.filter(h => h.region === r),
  })).filter(g => g.hotels.length > 0);

  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">{ALL_HOTELS.length} Properties</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">Accommodations</h1>
          <p className="text-lg text-cream-300/80">Casino resorts, boutique lodges, and vacation rentals across Reno, Lake Tahoe, Truckee, and beyond.</p>
        </div>
      </section>

      {hotelsByRegion.map((group) => (
        <section key={group.region} className="bg-cream-200 border-b border-pine-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-pine-800 mb-8 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-gold-500" /> {group.label}
              <span className="text-sm font-normal text-pine-500 bg-white px-3 py-1 rounded-full">{group.hotels.length} {group.hotels.length === 1 ? "property" : "properties"}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.hotels.map((hotel) => (
                <Link key={hotel.slug} href={`/portfolio/${hotel.slug}/`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="relative h-48 bg-pine-200">
                    {hotel.heroImage && <Image src={hotel.heroImage} alt={hotel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-pine-900/60 to-transparent" />
                    {hotel.priceFrom && (
                      <span className="absolute top-3 right-3 bg-pine-800/80 text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> From {hotel.priceFrom}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-pine-800 text-lg group-hover:text-gold-600 transition-colors">{hotel.name}</h3>
                    <p className="text-pine-500 text-sm mt-1">{hotel.shortDescription}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-pine-500">
                      {hotel.totalRooms && <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {hotel.totalRooms} rooms</span>}
                      {hotel.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold-500" /> {hotel.rating.value}</span>}
                    </div>
                    <span className="inline-flex items-center gap-1 text-gold-600 text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-pine-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Need Help Choosing?</h2>
          <p className="text-cream-300/80 mb-8">Tell us your group size and budget — we\u2019ll recommend the perfect hotel.</p>
          <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
            Request A Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
