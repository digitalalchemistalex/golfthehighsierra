import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Star,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  Calendar,
  Hotel,
  Mountain,
} from "lucide-react";
import { getAllRegionSlugs, getRegionBySlug } from "@/data/regions";
import { getCoursesByRegion } from "@/data/courses";

export async function generateStaticParams() {
  return getAllRegionSlugs().map((regionSlug) => ({ regionSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: { regionSlug: string };
}): Promise<Metadata> {
  const region = getRegionBySlug(params.regionSlug);
  if (!region) return {};
  return {
    title: region.meta.title,
    description: region.meta.description,
    openGraph: {
      title: region.meta.title,
      description: region.meta.description,
      images: [{ url: region.heroImage }],
    },
  };
}

export default function RegionPage({
  params,
}: {
  params: { regionSlug: string };
}) {
  const region = getRegionBySlug(params.regionSlug);
  if (!region) notFound();

  // Gather courses from all matching region keys
  const courses = region.courseRegions.flatMap((r) => getCoursesByRegion(r));

  return (
    <main className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <Image
          src={region.heroImage}
          alt={`${region.name} golf courses`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/80 via-pine-900/50 to-pine-900/90" />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 md:px-12 lg:px-20">
          <span className="mb-3 inline-block w-fit rounded-full bg-gold-500/20 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-gold-400">
            {region.tagline}
          </span>
          <h1 className="font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {region.name} Golf Packages
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-cream-300/80">
            {courses.length} championship courses · Custom stay &amp; play packages · {region.priceRange}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://golfthehighsierra.com/contact-custom-golf-package/"
              className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-bold text-pine-900 transition hover:bg-gold-400 hover:shadow-lg"
            >
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="tel:+18885848232"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Phone className="h-4 w-4" /> 888-584-8232
            </a>
          </div>
        </div>
      </section>

      {/* ─── Quick Stats ─── */}
      <section className="border-b border-pine-700 bg-pine-800">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 px-6 py-5 text-sm text-cream-300">
          <span className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-gold-400" /> {courses.length} Courses
          </span>
          <span className="flex items-center gap-2">
            <Hotel className="h-4 w-4 text-gold-400" /> {region.hotels.length} Partner Hotels
          </span>
          <span className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gold-400" /> {region.priceRange}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold-400" /> {region.season}
          </span>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="bg-cream-200">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          {/* About Region */}
          <div className="mb-16 max-w-3xl">
            <h2 className="font-heading text-3xl font-bold text-pine-800">
              Why Golf {region.name}?
            </h2>
            <div className="mt-2 h-1 w-16 rounded bg-gold-500" />
            <p className="mt-6 text-lg leading-relaxed text-charcoal-lighter">
              {region.whyPlay}
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {region.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-pine-400" />
                <span className="text-sm text-charcoal">{h}</span>
              </div>
            ))}
          </div>

          {/* Best For */}
          <div className="mb-16 rounded-2xl bg-pine-800 p-8 md:p-10">
            <h3 className="font-heading text-2xl font-bold text-white">
              Best For
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {region.bestFor.map((b, i) => (
                <span
                  key={i}
                  className="rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-400"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* ─── Course Grid ─── */}
          <h2 className="font-heading text-3xl font-bold text-pine-800">
            {region.name} Golf Courses
          </h2>
          <div className="mt-2 h-1 w-16 rounded bg-gold-500" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/portfolio/${course.slug}`}
                className="group overflow-hidden rounded-2xl border border-stone-400/30 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lg"
              >
                {/* Card Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {course.heroImage ? (
                    <Image
                      src={course.heroImage}
                      alt={course.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-pine-800/10 text-pine-400">
                      <Mountain className="h-12 w-12" />
                    </div>
                  )}
                  {course.priceRange && (
                    <span className="absolute right-3 top-3 rounded-md bg-pine-800/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      {course.priceRange}
                    </span>
                  )}
                </div>
                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-heading text-xl font-bold text-pine-800 transition-colors group-hover:text-pine-400">
                    {course.name}
                  </h3>
                  {course.address?.addressLocality && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-lighter">
                      <MapPin className="h-3 w-3" />
                      {course.address.addressLocality},{" "}
                      {course.address.addressRegion}
                    </p>
                  )}
                  {course.rating && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-md bg-gold-500/10 px-2 py-0.5">
                        <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                        <span className="text-xs font-bold text-pine-800">
                          {course.rating.value}
                        </span>
                      </div>
                      <span className="text-xs text-charcoal-lighter">
                        ({course.rating.count} reviews)
                      </span>
                    </div>
                  )}
                  <p className="mt-3 line-clamp-2 text-sm text-charcoal-lighter">
                    {course.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-pine-500 transition-colors group-hover:text-gold-500">
                    View Course <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ─── Partner Hotels ─── */}
          {region.hotels.length > 0 && (
            <div className="mt-20">
              <h2 className="font-heading text-3xl font-bold text-pine-800">
                Partner Hotels &amp; Lodging
              </h2>
              <div className="mt-2 h-1 w-16 rounded bg-gold-500" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {region.hotels.map((hotel, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-stone-400/30 bg-white p-4 shadow-sm transition hover:border-gold-500/30 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-pine-800/10">
                      <Hotel className="h-5 w-5 text-pine-500" />
                    </div>
                    <span className="text-sm font-medium text-charcoal">
                      {hotel.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pine-900 via-pine-800 to-pine-900 py-20">
        <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            Ready to Play {region.name}?
          </h2>
          <p className="mt-4 text-lg text-cream-300/70">
            Tell us your dates, group size, and budget. We&apos;ll build a custom
            {" "}{region.name} package — no obligation, no hidden fees.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://golfthehighsierra.com/contact-custom-golf-package/"
              className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-8 py-3.5 text-sm font-bold text-pine-900 transition hover:bg-gold-400 hover:shadow-lg"
            >
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="tel:+18885848232"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Phone className="h-4 w-4" /> Call 888-584-8232
            </a>
          </div>
          <p className="mt-6 text-xs text-cream-300/40">
            Trusted by 10,000+ golf groups since 2004
          </p>
        </div>
      </section>

      {/* ─── Schema.org ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            name: `${region.name} Golf`,
            description: region.description,
            image: region.heroImage,
            touristType: ["Golf Tourism", "Group Travel"],
            includesAttraction: courses.map((c) => ({
              "@type": "GolfCourse",
              name: c.name,
              url: `https://golfthehighsierra.com/portfolio/${c.slug}/`,
            })),
          }),
        }}
      />
    </main>
  );
}
