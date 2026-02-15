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
  ChevronRight,
  Globe,
  Flag,
} from "lucide-react";
import { getAllCourseSlugs, getCourseBySlug, getCoursesByRegion } from "@/data/courses";

// Static generation for all course pages
export async function generateStaticParams() {
  return getAllCourseSlugs().map((slug) => ({ slug }));
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = getCourseBySlug(params.slug);
  if (!course) return { title: "Course Not Found" };

  return {
    title: course.meta.title,
    description: course.meta.description,
    robots: { index: true, follow: true },
    openGraph: {
      title: course.meta.title,
      description: course.meta.description,
      url: `https://golfthehighsierra.com/portfolio/${course.slug}/`,
      images: course.heroImage ? [{ url: course.heroImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: course.meta.title,
      description: course.meta.description,
    },
    alternates: {
      canonical: `https://golfthehighsierra.com/portfolio/${course.slug}/`,
    },
  };
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

  // Get related courses from same region (excluding current)
  const related = getCoursesByRegion(course.region)
    .filter((c) => c.slug !== course.slug)
    .slice(0, 3);

  // Build JSON-LD schema
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GolfCourse",
        name: course.name,
        description: course.description,
        url: `https://golfthehighsierra.com/portfolio/${course.slug}/`,
        image: course.heroImage,
        ...(course.address?.streetAddress && {
          address: {
            "@type": "PostalAddress",
            streetAddress: course.address.streetAddress,
            addressLocality: course.address.addressLocality,
            addressRegion: course.address.addressRegion,
            postalCode: course.address.postalCode,
            addressCountry: "US",
          },
        }),
        ...('latitude' in course.geo && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: (course.geo as { latitude: number; longitude: number }).latitude,
            longitude: (course.geo as { latitude: number; longitude: number }).longitude,
          },
        }),
        telephone: course.phone || "+1-888-584-8232",
        priceRange: course.priceRange,
        ...(course.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: course.rating.value,
            ratingCount: course.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      },
      {
        "@type": "Service",
        name: `${course.name} Golf Groups & Stay and Play Packages`,
        serviceType: "Golf travel package",
        description: `Custom ${course.name} packages with lodging, guaranteed tee times, carts, and concierge planning.`,
        provider: {
          "@type": "Organization",
          name: "Golf the High Sierra",
          url: "https://golfthehighsierra.com",
          telephone: "+1-888-584-8232",
        },
        ...(course.priceRange && {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: course.priceRange.match(/\$(\d+)/)?.[1] || "",
            highPrice: course.priceRange.match(/\$(\d+).*\$(\d+)/)?.[2] || "",
            availability: "https://schema.org/InStock",
            url: "https://golfthehighsierra.com/contact-custom-golf-package/",
          },
        }),
      },
      ...(course.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: course.faqs.map((faq: { question: string; answer: string }) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://golfthehighsierra.com" },
          {
            "@type": "ListItem",
            position: 2,
            name: "Golf Courses",
            item: "https://golfthehighsierra.com/best-golf-courses-reno/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: course.name,
            item: `https://golfthehighsierra.com/portfolio/${course.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        {course.heroImage && (
          <Image
            src={course.heroImage}
            alt={course.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-900/90 via-pine-900/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-10 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/best-golf-courses-reno/" className="hover:text-white transition-colors">
              Golf Courses
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{course.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-block bg-gold-500/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-3">
                {course.regionLabel}
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
                {course.name}
              </h1>
              {course.address?.addressLocality && (
                <p className="flex items-center gap-2 text-white/80 mt-2">
                  <MapPin className="w-4 h-4" />
                  {course.address.streetAddress && `${course.address.streetAddress}, `}
                  {course.address.addressLocality}, {course.address.addressRegion}{" "}
                  {course.address.postalCode}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {course.rating && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                  <span className="text-white font-bold text-lg">{course.rating.value}</span>
                  <span className="text-white/60 text-sm">({course.rating.count})</span>
                </div>
              )}
              {course.priceRange && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-semibold">{course.priceRange}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-pine-800 border-b border-pine-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6">
            {course.holes && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Flag className="w-4 h-4 text-gold-400" />
                <span>{course.holes} Holes</span>
              </div>
            )}
            {course.par && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <span className="text-gold-400 font-bold">Par</span>
                <span>{course.par}</span>
              </div>
            )}
            {course.designer && (
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <span>Designed by {course.designer}</span>
              </div>
            )}
            {course.website && (
              <a
                href={course.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Official Website</span>
              </a>
            )}
          </div>
          <a
            href="tel:1-888-584-8232"
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            (888) 584-8232
          </a>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-cream-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Content Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-pine-800 mb-4">
                  About {course.name}
                </h2>
                <p className="text-charcoal leading-relaxed text-lg">{course.description}</p>
              </div>

              {/* Video */}
              {course.videoUrl && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-pine-800 mb-4">
                    Course Tour
                  </h3>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={course.videoUrl.replace("watch?v=", "embed/")}
                      title={`${course.name} video tour`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Image Gallery */}
              {course.images.length > 1 && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-pine-800 mb-4">
                    Photo Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {course.images.slice(0, 6).map((img: string, i: number) => (
                      <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                        <Image
                          src={img}
                          alt={`${course.name} photo ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {course.faqs.length > 0 && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-pine-800 mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {course.faqs.map((faq: { question: string; answer: string }, i: number) => (
                      <details
                        key={i}
                        className="bg-white rounded-xl border border-cream-400 overflow-hidden group"
                        {...(i === 0 ? { open: true } : {})}
                      >
                        <summary className="cursor-pointer px-6 py-4 font-semibold text-pine-800 hover:bg-cream-100 transition-colors flex items-center justify-between">
                          {faq.question}
                          <ChevronRight className="w-4 h-4 text-gold-500 transition-transform group-open:rotate-90 flex-shrink-0" />
                        </summary>
                        <div className="px-6 pb-4 text-charcoal-lighter leading-relaxed">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <div className="bg-pine-800 rounded-2xl p-6 text-white sticky top-24">
                <h3 className="text-xl font-heading font-bold mb-2">
                  Plan Your {course.name} Trip
                </h3>
                <p className="text-white/70 text-sm mb-6">
                  Packages from {course.priceRange || "custom pricing"} per golfer. Includes lodging,
                  tee times, carts, and concierge planning.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/contact-custom-golf-package/"
                    className="btn-primary w-full text-center block"
                  >
                    Get a Free Quote
                    <ArrowRight className="w-4 h-4 inline ml-2" />
                  </Link>
                  <a
                    href="tel:1-888-584-8232"
                    className="btn-secondary w-full text-center block"
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    (888) 584-8232
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                  <p className="text-white/50 text-xs">
                    Custom quotes in 24 hours · Groups of 4–400
                  </p>
                </div>
              </div>

              {/* Course Quick Facts */}
              <div className="bg-white rounded-2xl p-6 border border-cream-400">
                <h4 className="font-heading font-bold text-pine-800 mb-4">Quick Facts</h4>
                <dl className="space-y-3 text-sm">
                  {course.holes && (
                    <div className="flex justify-between">
                      <dt className="text-charcoal-lighter">Holes</dt>
                      <dd className="font-semibold text-pine-800">{course.holes}</dd>
                    </div>
                  )}
                  {course.par && (
                    <div className="flex justify-between">
                      <dt className="text-charcoal-lighter">Par</dt>
                      <dd className="font-semibold text-pine-800">{course.par}</dd>
                    </div>
                  )}
                  {course.priceRange && (
                    <div className="flex justify-between">
                      <dt className="text-charcoal-lighter">Package Price</dt>
                      <dd className="font-semibold text-pine-800">{course.priceRange}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-charcoal-lighter">Region</dt>
                    <dd className="font-semibold text-pine-800">{course.regionLabel}</dd>
                  </div>
                  {course.phone && (
                    <div className="flex justify-between">
                      <dt className="text-charcoal-lighter">Phone</dt>
                      <dd className="font-semibold text-pine-800">
                        <a href={`tel:${course.phone}`} className="text-gold-500 hover:underline">
                          {course.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      {related.length > 0 && (
        <section className="section-padding bg-cream-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-2xl font-heading font-bold text-pine-800 mb-8">
              More {course.regionLabel} Courses
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/portfolio/${r.slug}/`}
                  className="card group overflow-hidden"
                >
                  {r.heroImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={r.heroImage}
                        alt={r.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-pine-800 group-hover:text-gold-500 transition-colors">
                      {r.name}
                    </h3>
                    <p className="text-charcoal-lighter text-sm mt-1">
                      {r.regionLabel} · {r.priceRange}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-pine-800 py-16 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Play {course.name}?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Tell us your dates, group size, and budget. We&apos;ll build a custom package with{" "}
            {course.name} and handle every detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-custom-golf-package/" className="btn-primary text-lg px-8 py-4">
              Get a Free Quote
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </Link>
            <a href="tel:1-888-584-8232" className="btn-secondary text-lg px-8 py-4">
              <Phone className="w-5 h-5 inline mr-2" />
              (888) 584-8232
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
