/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ALL_VENUES } from "@/data/venues";

export const metadata: Metadata = {
  title: "Eldorado Room Types & Suites – Reno NV | Golf The High Sierra",
  description:
    "Browse all Eldorado Resort Casino room types and suites in Reno, NV. From Virginia Petite rooms to Skyline VIP Hospitality suites.",
  alternates: {
    canonical: "https://golfthehighsierra.com/portfolio/eldorado-rooms/",
  },
};

export default function EldoradoRoomsPage() {
  const rooms = ([...ALL_VENUES] as any[]).filter(
    (v) =>
      v.parentHotel === "eldorado-resorts-reno-eldorado-at-the-row" &&
      v.type === "room"
  );

  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-[#1E3A2F] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#C9A24D] text-sm tracking-widest uppercase mb-3">
            THE ROW — Reno, NV
          </p>
          <h1
            className="text-4xl md:text-5xl font-light mb-4"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Eldorado Rooms & Suites
          </h1>
          <p
            className="text-lg text-white/80 max-w-2xl mx-auto"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {rooms.length} room types available for your group golf stay
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room: any) => (
            <Link
              key={room.slug}
              href={`/portfolio/v/${room.slug}/`}
              className="group rounded-2xl overflow-hidden bg-[#FAFAF8] border border-[#E8E4DE] hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                {room.heroImage ? (
                  <Image
                    src={room.heroImage}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1E3A2F] to-[#6B8E7F]" />
                )}
                <span className="absolute top-3 right-3 bg-white/90 text-[#1E3A2F] text-xs px-3 py-1 rounded-full font-medium">
                  {room.priceRange || "$$"}
                </span>
              </div>
              <div className="p-5">
                <h3
                  className="text-lg font-semibold text-[#111] mb-2"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {room.name}
                </h3>
                {room.shortDescription && (
                  <p
                    className="text-sm text-[#555] line-clamp-2"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {room.shortDescription}
                  </p>
                )}
                <span className="inline-block mt-3 text-sm text-[#C9A24D] font-medium group-hover:underline">
                  View Room →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#1E3A2F] text-white py-16 px-6 text-center">
        <h2
          className="text-3xl font-light mb-4"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Book Your Eldorado Golf Package
        </h2>
        <p
          className="text-white/70 mb-6 max-w-xl mx-auto"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          Group rates, tee times, and room blocks at THE ROW in downtown Reno.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/contact-custom-golf-package/"
            className="inline-block bg-[#C9A24D] hover:bg-[#B08C3A] text-white px-8 py-3 rounded-full text-sm font-medium transition-colors"
          >
            Request a Free Quote
          </Link>
          <Link
            href="/portfolio/h/eldorado-resorts-reno-eldorado-at-the-row/"
            className="inline-block border border-white/30 hover:border-white text-white px-8 py-3 rounded-full text-sm font-medium transition-colors"
          >
            View Eldorado Hotel
          </Link>
        </div>
      </section>
    </main>
  );
}
