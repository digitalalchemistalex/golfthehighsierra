"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Phone,
  MapPin,
  Star,
  ArrowRight,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Globe,
  BedDouble,
  UtensilsCrossed,
  Wine,
  Sparkles,
  CheckCircle2,
  Navigation,
  Building2,
  Car,
  Users,
} from "lucide-react";

interface HotelPageContentProps {
  hotel: any;
  relatedHotels: any[];
}

function FAQAccordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-pine-400/20 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left bg-pine-800/50 hover:bg-pine-800 transition-colors"
      >
        <span className="font-semibold text-cream-200 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gold-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="p-4 bg-pine-900/50 text-cream-300/80 text-sm leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

export default function HotelPageContent({ hotel, relatedHotels }: HotelPageContentProps) {
  const geo = hotel.geo as { latitude?: number; longitude?: number };
  const roomTypes = (hotel.roomTypes || []) as any[];
  const dining = (hotel.dining || []) as any[];
  const spaBars = (hotel.spaBars || []) as string[];
  const amenities = (hotel.amenities || []) as string[];
  const highlights = (hotel.highlights || []) as string[];
  const faqs = (hotel.faqs || []) as { question: string; answer: string }[];

  const typeLabel: Record<string, string> = {
    "casino-resort": "Casino Resort",
    hotel: "Hotel",
    resort: "Resort",
    inn: "Inn & Casino",
    "private-residence": "Private Residences",
    lodge: "Boutique Lodge",
  };

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end bg-pine-800">
        {hotel.heroImage && (
          <Image src={hotel.heroImage} alt={hotel.name} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-900/95 via-pine-900/50 to-pine-900/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-10 w-full">
          <nav className="flex items-center gap-2 text-sm text-cream-300/70 mb-4">
            <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/accommodations-in-reno-tahoe/" className="hover:text-gold-400 transition-colors">Accommodations</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-cream-200">{hotel.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-block bg-gold-500 text-pine-900 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-3">
                {hotel.regionLabel}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                {hotel.name}
              </h1>
              {hotel.address?.addressLocality && (
                <p className="flex items-center gap-2 text-cream-300/80 mt-3 text-lg">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  {hotel.address.addressLocality}, {hotel.address.addressRegion}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {hotel.rating && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                  <span className="font-bold text-white">{hotel.rating.value}</span>
                  <span className="text-cream-300/60 text-sm">({hotel.rating.count.toLocaleString()})</span>
                </div>
              )}
              {hotel.priceFrom && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-gold-400" />
                  <span className="text-white font-semibold">From {hotel.priceFrom}/night</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUICK STATS BAR ===== */}
      <section className="bg-pine-800 border-t border-pine-400/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-cream-300/70">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold-400" />
              <span>{typeLabel[hotel.type] || hotel.type}</span>
            </div>
            {hotel.aaaRating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gold-400" />
                <span>AAA {hotel.aaaRating}</span>
              </div>
            )}
            {hotel.totalRooms && (
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-gold-400" />
                <span>{hotel.totalRooms.toLocaleString()} rooms</span>
              </div>
            )}
            {hotel.parking && (
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-gold-400" />
                <span>{hotel.parking}</span>
              </div>
            )}
            {hotel.website && (
              <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
                <Globe className="w-4 h-4 text-gold-400" />
                <span>Official Site</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="bg-cream-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LEFT: Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-pine-800 mb-4">About {hotel.name}</h2>
                <p className="text-pine-700 leading-relaxed text-lg">{hotel.description}</p>
              </div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-pine-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-gold-500" /> Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {highlights.map((h: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                        <span className="text-pine-700 text-sm">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Types */}
              {roomTypes.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-pine-800 mb-4 flex items-center gap-2">
                    <BedDouble className="w-6 h-6 text-gold-500" /> Accommodations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roomTypes.map((room: any, i: number) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {room.image && (
                          <div className="relative h-40 bg-pine-200">
                            <Image src={room.image} alt={room.name} fill className="object-cover" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-pine-800">{room.name}</h3>
                          <p className="text-sm text-pine-600 mt-1">{room.description}</p>
                          {room.priceFrom && (
                            <p className="text-sm text-gold-600 font-semibold mt-2">From {room.priceFrom}/night</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dining */}
              {dining.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-pine-800 mb-4 flex items-center gap-2">
                    <UtensilsCrossed className="w-6 h-6 text-gold-500" /> Dining
                  </h2>
                  <div className="space-y-3">
                    {dining.map((d: any, i: number) => (
                      <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <UtensilsCrossed className="w-5 h-5 text-gold-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-pine-800">{d.name}</h3>
                          <p className="text-sm text-pine-500 capitalize">{d.type}</p>
                          <p className="text-sm text-pine-600 mt-1">{d.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bars, Lounges & Wellness */}
              {spaBars.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-pine-800 mb-4 flex items-center gap-2">
                    <Wine className="w-6 h-6 text-gold-500" /> Bars, Lounges & Wellness
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {spaBars.map((name: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                        <Wine className="w-4 h-4 text-gold-500 flex-shrink-0" />
                        <span className="text-pine-700 text-sm">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-pine-800 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenities.map((a: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-pine-700 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {faqs.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-pine-800 mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-3">
                    {faqs.map((faq, i) => (
                      <FAQAccordion key={i} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== SIDEBAR ===== */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <div className="bg-pine-800 rounded-xl p-6 shadow-lg text-center">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">
                    Build Your Golf Package
                  </h3>
                  <p className="text-cream-300/80 text-sm mb-5">
                    Stay at {hotel.name} with tee times at nearby courses. Custom packages for groups of any size.
                  </p>
                  <a
                    href="https://golfthehighsierra.com/contact-custom-golf-package/"
                    className="block bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3 px-6 rounded-lg transition-colors mb-3"
                  >
                    Request A Quote
                  </a>
                  <a
                    href="tel:+1-888-584-8232"
                    className="flex items-center justify-center gap-2 text-cream-300 hover:text-gold-400 transition-colors py-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-semibold">1-888-584-8232</span>
                  </a>
                </div>

                {/* Quick Facts */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-pine-800 mb-4">Quick Facts</h3>
                  <div className="space-y-3 text-sm">
                    {hotel.priceRange && (
                      <div className="flex justify-between">
                        <span className="text-pine-500">Price Range</span>
                        <span className="font-semibold text-pine-800">{hotel.priceRange}</span>
                      </div>
                    )}
                    {hotel.totalRooms && (
                      <div className="flex justify-between">
                        <span className="text-pine-500">Total Rooms</span>
                        <span className="font-semibold text-pine-800">{hotel.totalRooms.toLocaleString()}</span>
                      </div>
                    )}
                    {hotel.aaaRating && (
                      <div className="flex justify-between">
                        <span className="text-pine-500">AAA Rating</span>
                        <span className="font-semibold text-pine-800">{hotel.aaaRating}</span>
                      </div>
                    )}
                    {hotel.parking && (
                      <div className="flex justify-between">
                        <span className="text-pine-500">Parking</span>
                        <span className="font-semibold text-pine-800">{hotel.parking}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-pine-500">Region</span>
                      <span className="font-semibold text-pine-800">{hotel.regionLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {hotel.address && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-heading font-bold text-pine-800 mb-3 flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-gold-500" /> Location
                    </h3>
                    <p className="text-sm text-pine-600 mb-3">
                      {hotel.address.streetAddress}<br />
                      {hotel.address.addressLocality}, {hotel.address.addressRegion} {hotel.address.postalCode}
                    </p>
                    {geo?.latitude && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${geo.latitude},${geo.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-500 font-semibold transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        Get Directions
                      </a>
                    )}
                  </div>
                )}

                {/* Why Book With Us */}
                <div className="bg-gold-50 border border-gold-200 rounded-xl p-6">
                  <h3 className="font-heading font-bold text-pine-800 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gold-600" /> Why Book With Us?
                  </h3>
                  <ul className="space-y-2 text-sm text-pine-700">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" /><span>20+ years of group golf planning</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" /><span>Custom packages — lodging, tee times, dining</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" /><span>Group discounts up to 30%</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" /><span>Concierge service from booking to tee time</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RELATED HOTELS ===== */}
      {relatedHotels.length > 0 && (
        <section className="bg-pine-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-8">
              More Hotels in {hotel.regionLabel}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedHotels.map((rh: any) => (
                <Link key={rh.slug} href={`/portfolio/${rh.slug}/`} className="group bg-pine-900/50 rounded-xl overflow-hidden hover:ring-2 hover:ring-gold-400/50 transition-all">
                  <div className="relative h-44 bg-pine-700">
                    {rh.heroImage && <Image src={rh.heroImage} alt={rh.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-pine-900/80 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-white group-hover:text-gold-400 transition-colors">{rh.name}</h3>
                    <p className="text-cream-300/60 text-sm mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {rh.regionLabel}
                    </p>
                    {rh.priceFrom && (
                      <p className="text-gold-400 text-sm font-semibold mt-2">From {rh.priceFrom}/night</p>
                    )}
                    <span className="inline-flex items-center gap-1 text-gold-400 text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                      View Hotel <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== BOTTOM CTA ===== */}
      <section className="bg-gradient-to-br from-pine-900 via-pine-800 to-pine-900 py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Build Your<br />Golf Package?
          </h2>
          <p className="text-cream-300/80 mb-8 text-lg">
            Stay at {hotel.name} with tee times at the best courses in {hotel.regionLabel}. We handle all the details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://golfthehighsierra.com/contact-custom-golf-package/" className="bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors inline-flex items-center justify-center gap-2 shadow-lg">
              Request A Quote <ArrowRight className="w-5 h-5" />
            </a>
            <a href="tel:+1-888-584-8232" className="border-2 border-cream-300/30 hover:border-gold-400 text-white hover:text-gold-400 font-bold py-3.5 px-8 rounded-lg transition-colors inline-flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> 1-888-584-8232
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
