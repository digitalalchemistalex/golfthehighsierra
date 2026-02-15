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
  Quote,
  CheckCircle2,
  Navigation,
  Lightbulb,
} from "lucide-react";
import { getAllCourseSlugs, getCourseBySlug, getCoursesByRegion } from "@/data/courses";
import { getAllHotelSlugs, getHotelBySlug, getHotelsByRegion } from "@/data/hotels";
import HotelPageContent from "@/components/HotelPageContent";

export async function generateStaticParams() {
  const courseSlugs = getAllCourseSlugs().map((slug) => ({ slug }));
  const hotelSlugs = getAllHotelSlugs().map((slug) => ({ slug }));
  return [...courseSlugs, ...hotelSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = getCourseBySlug(params.slug);
  const hotel = !course ? (getHotelBySlug(params.slug) as any) : null;
  const item = course || hotel;
  if (!item) return { title: "Not Found" };
  return {
    title: item.meta.title,
    description: item.meta.description,
    robots: { index: true, follow: true },
    openGraph: {
      title: item.meta.title,
      description: item.meta.description,
      url: `https://golfthehighsierra.com/portfolio/${item.slug}/`,
      images: item.heroImage ? [{ url: item.heroImage, width: 1200, height: 630 }] : [],
    },
    twitter: { card: "summary_large_image", title: item.meta.title, description: item.meta.description },
    alternates: { canonical: `https://golfthehighsierra.com/portfolio/${item.slug}/` },
  };
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  const hotel = !course ? (getHotelBySlug(params.slug) as any) : null;

  // If it's a hotel, render hotel layout
  if (hotel) {
    const relatedHotels = getHotelsByRegion(hotel.region).filter((h) => h.slug !== hotel.slug).slice(0, 3);
    
    const hotelSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Hotel",
          name: hotel.name,
          description: hotel.description,
          url: `https://golfthehighsierra.com/portfolio/${hotel.slug}/`,
          image: hotel.heroImage,
          ...(hotel.address?.streetAddress && {
            address: {
              "@type": "PostalAddress",
              streetAddress: hotel.address.streetAddress,
              addressLocality: hotel.address.addressLocality,
              addressRegion: hotel.address.addressRegion,
              postalCode: hotel.address.postalCode,
              addressCountry: "US",
            },
          }),
          ...(hotel.geo?.latitude && {
            geo: { "@type": "GeoCoordinates", latitude: hotel.geo.latitude, longitude: hotel.geo.longitude },
          }),
          telephone: hotel.phone || "+1-888-584-8232",
          priceRange: hotel.priceRange,
          ...(hotel.rating && {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: hotel.rating.value,
              ratingCount: hotel.rating.count,
              bestRating: 5,
              worstRating: 1,
            },
          }),
          ...(hotel.starRating && { starRating: { "@type": "Rating", ratingValue: hotel.starRating } }),
        },
        {
          "@type": "Service",
          name: `${hotel.name} Golf Stay and Play Packages`,
          serviceType: "Golf travel package",
          provider: { "@type": "Organization", name: "Golf the High Sierra", url: "https://golfthehighsierra.com", telephone: "+1-888-584-8232" },
        },
        ...(hotel.faqs?.length > 0 ? [{
          "@type": "FAQPage",
          mainEntity: hotel.faqs.map((faq: { question: string; answer: string }) => ({
            "@type": "Question", name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }] : []),
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://golfthehighsierra.com" },
            { "@type": "ListItem", position: 2, name: "Accommodations", item: "https://golfthehighsierra.com/accommodations-in-reno-tahoe/" },
            { "@type": "ListItem", position: 3, name: hotel.name, item: `https://golfthehighsierra.com/portfolio/${hotel.slug}/` },
          ],
        },
      ],
    };
    
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }} />
        <HotelPageContent hotel={hotel} relatedHotels={relatedHotels} />
      </>
    );
  }

  // Course page (existing logic)
  if (!course) notFound();

  const related = getCoursesByRegion(course.region).filter((c) => c.slug !== course.slug).slice(0, 3);

  // Type assertions for dynamic JSON fields
  const geo = course.geo as { latitude?: number; longitude?: number };
  const featuredHole = course.featuredHole as { title?: string; description?: string } | undefined;
  const teeTips = (course.teeTips || []) as string[];
  const contentParagraphs = (course.contentParagraphs || []) as string[];
  const distances = (course.distances || []) as string[];
  const facilities = (course.facilities || []) as string[];
  const pointOfView = (course.pointOfView || "") as string;

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
        ...(geo?.latitude && {
          geo: { "@type": "GeoCoordinates", latitude: geo.latitude, longitude: geo.longitude },
        }),
        telephone: course.phone || "+1-888-584-8232",
        priceRange: course.priceRange,
        ...(course.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: course.rating.value,
            ratingCount: course.rating.count,
            bestRating: 5, worstRating: 1,
          },
        }),
      },
      {
        "@type": "Service",
        name: `${course.name} Golf Groups & Stay and Play Packages`,
        serviceType: "Golf travel package",
        provider: { "@type": "Organization", name: "Golf the High Sierra", url: "https://golfthehighsierra.com", telephone: "+1-888-584-8232" },
      },
      ...(course.faqs.length > 0 ? [{
        "@type": "FAQPage",
        mainEntity: course.faqs.map((faq: { question: string; answer: string }) => ({
          "@type": "Question", name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }] : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://golfthehighsierra.com" },
          { "@type": "ListItem", position: 2, name: "Golf Courses", item: "https://golfthehighsierra.com/best-golf-courses-reno/" },
          { "@type": "ListItem", position: 3, name: course.name, item: `https://golfthehighsierra.com/portfolio/${course.slug}/` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ===== HERO ===== */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end bg-pine-800">
        {course.heroImage && (
          <Image src={course.heroImage} alt={course.name} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-900/95 via-pine-900/50 to-pine-900/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-10 w-full">
          <nav className="flex items-center gap-2 text-sm text-cream-300/70 mb-4">
            <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/best-golf-courses-reno/" className="hover:text-gold-400 transition-colors">Golf Courses</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-cream-200">{course.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-block bg-gold-500 text-pine-900 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-3">
                {course.regionLabel}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
                {course.name}
              </h1>
              {course.address?.addressLocality && (
                <p className="flex items-center gap-2 text-cream-300/80 mt-3 text-lg">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  {course.address.streetAddress && `${course.address.streetAddress}, `}
                  {course.address.addressLocality}, {course.address.addressRegion}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {course.rating && (
                <div className="flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                  <span className="text-white font-bold text-lg">{course.rating.value}</span>
                  <span className="text-cream-300/60 text-sm">({course.rating.count})</span>
                </div>
              )}
              {course.priceRange && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <DollarSign className="w-5 h-5 text-gold-300" />
                  <span className="text-white font-semibold">{course.priceRange}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUICK STATS BAR ===== */}
      <section className="bg-pine-800 border-t border-pine-400/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6 text-sm">
            {course.holes && (
              <div className="flex items-center gap-2 text-cream-300">
                <Flag className="w-4 h-4 text-gold-400" />
                <span>{course.holes} Holes</span>
              </div>
            )}
            {course.par && (
              <div className="flex items-center gap-2 text-cream-300">
                <span className="text-gold-400 font-bold">Par</span> <span>{course.par}</span>
              </div>
            )}
            {course.designer && (
              <div className="text-cream-300">Designed by <span className="text-gold-300">{course.designer}</span></div>
            )}
            {course.website && (
              <a href={course.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream-300 hover:text-gold-400 transition-colors">
                <Globe className="w-4 h-4" /><span>Official Website</span>
              </a>
            )}
          </div>
          <a href="tel:1-888-584-8232"
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold text-sm transition-colors">
            <Phone className="w-4 h-4" /> (888) 584-8232
          </a>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="bg-cream-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">

              {/* About */}
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-pine-800 mb-1">
                  About {course.name}
                </h2>
                <div className="divider-gold mb-5" />
                <p className="text-charcoal leading-relaxed text-lg">{course.description}</p>
                {contentParagraphs.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {contentParagraphs.slice(0, 3).map((p, i) => (
                      <p key={i} className="text-charcoal-lighter leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Our Point of View */}
              {pointOfView && (
                <div className="bg-pine-800 rounded-2xl p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute top-4 right-6 opacity-10">
                    <Quote className="w-24 h-24 text-gold-400" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-4">Our Point of View</p>
                  <blockquote className="text-cream-100 text-lg md:text-xl leading-relaxed italic relative z-10">
                    &ldquo;{pointOfView}&rdquo;
                  </blockquote>
                  <p className="text-gold-400/70 text-sm mt-4 font-semibold">— Golf the High Sierra</p>
                </div>
              )}

              {/* Featured Hole */}
              {featuredHole?.title && featuredHole?.description && (
                <div className="bg-white rounded-2xl border border-cream-400 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                      <Flag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gold-600">Signature Hole</p>
                      <h3 className="text-xl font-heading font-bold text-pine-800">{featuredHole.title}</h3>
                    </div>
                  </div>
                  <p className="text-charcoal leading-relaxed">{featuredHole.description}</p>
                </div>
              )}

              {/* Insider Tips */}
              {teeTips.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Lightbulb className="w-6 h-6 text-gold-500" />
                    <h3 className="text-xl font-heading font-bold text-pine-800">Insider Tips</h3>
                  </div>
                  <div className="space-y-4">
                    {teeTips.map((tip, i) => (
                      <div key={i} className="bg-gold-50 border-l-4 border-gold-500 rounded-r-xl p-5">
                        <p className="text-charcoal leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {facilities.length > 0 && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-pine-800 mb-5">Facilities & Amenities</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {facilities.slice(0, 8).map((f, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-cream-400">
                        <CheckCircle2 className="w-5 h-5 text-pine-400 mt-0.5 flex-shrink-0" />
                        <span className="text-charcoal text-sm leading-relaxed">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {course.videoUrl && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-pine-800 mb-4">Course Tour</h3>
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-cream-400">
                    <iframe src={course.videoUrl.replace("watch?v=", "embed/")}
                      title={`${course.name} video tour`} className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen />
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {course.images.length > 1 && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-pine-800 mb-4">Photos of {course.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {course.images.slice(0, 6).map((img: string, i: number) => (
                      <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group border border-cream-400">
                        <Image src={img} alt={`${course.name} photo ${i + 1}`} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Distance from Key Locations */}
              {distances.length > 0 && (
                <div className="bg-pine-800 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <Navigation className="w-5 h-5 text-gold-400" />
                    <h3 className="text-xl font-heading font-bold text-white">Distance from Key Locations</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {distances.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 text-cream-200 text-sm py-2 border-b border-pine-700/50 last:border-0">
                        <MapPin className="w-4 h-4 text-gold-400/60 flex-shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {course.faqs.length > 0 && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-pine-800 mb-5">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {course.faqs.map((faq: { question: string; answer: string }, i: number) => (
                      <details key={i} className="faq-item group" {...(i === 0 ? { open: true } : {})}>
                        <summary className="faq-trigger">
                          {faq.question}
                          <ChevronRight className="w-4 h-4 text-gold-500 transition-transform group-open:rotate-90 flex-shrink-0" />
                        </summary>
                        <div className="faq-content">{faq.answer}</div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== SIDEBAR ===== */}
            <div className="space-y-6">
              <div className="bg-pine-800 rounded-2xl p-6 text-white sticky top-24 shadow-lg">
                <div className="w-12 h-1 bg-gold-500 rounded-full mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">Plan Your Trip</h3>
                <p className="text-cream-300/80 text-sm mb-6 leading-relaxed">
                  Custom {course.name} packages from{" "}
                  <span className="text-gold-400 font-semibold">{course.priceRange || "custom pricing"}</span>{" "}
                  per golfer. Lodging, tee times, carts & concierge planning included.
                </p>
                <div className="space-y-3">
                  <Link href="/contact-custom-golf-package/"
                    className="flex items-center justify-center gap-2 w-full bg-gold-500 text-pine-900 font-bold px-6 py-3.5 rounded-lg transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:-translate-y-0.5">
                    Get a Free Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a href="tel:1-888-584-8232"
                    className="flex items-center justify-center gap-2 w-full border-2 border-cream-300/30 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:bg-white/10">
                    <Phone className="w-4 h-4" /> (888) 584-8232
                  </a>
                </div>
                <div className="mt-5 pt-4 border-t border-cream-300/10 text-center space-y-1">
                  <p className="text-cream-300/50 text-xs">Custom quotes in 24 hours</p>
                  <p className="text-cream-300/50 text-xs">Groups of 4–400 · 20+ years experience</p>
                </div>
              </div>

              <div className="fact-card">
                <h4 className="font-heading font-bold text-pine-800 mb-1">Quick Facts</h4>
                <div className="divider-gold mb-4" />
                <dl className="space-y-0">
                  {course.holes && (<div className="fact-row"><dt className="fact-label">Holes</dt><dd className="fact-value">{course.holes}</dd></div>)}
                  {course.par && (<div className="fact-row"><dt className="fact-label">Par</dt><dd className="fact-value">{course.par}</dd></div>)}
                  {course.priceRange && (<div className="fact-row"><dt className="fact-label">Package Price</dt><dd className="fact-value text-gold-600">{course.priceRange}</dd></div>)}
                  <div className="fact-row"><dt className="fact-label">Region</dt><dd className="fact-value">{course.regionLabel}</dd></div>
                  {course.rating && (
                    <div className="fact-row"><dt className="fact-label">Rating</dt>
                      <dd className="fact-value flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" /> {course.rating.value}/5 ({course.rating.count})
                      </dd>
                    </div>
                  )}
                  {course.phone && (
                    <div className="fact-row"><dt className="fact-label">Phone</dt>
                      <dd className="fact-value"><a href={`tel:${course.phone}`} className="text-gold-600 hover:underline">{course.phone}</a></dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RELATED COURSES ===== */}
      {related.length > 0 && (
        <section className="bg-pine-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">More {course.regionLabel} Courses</h2>
            <div className="divider-gold mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.slug} href={`/portfolio/${r.slug}/`}
                  className="group rounded-xl overflow-hidden bg-pine-700/50 border border-pine-600/30 hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1">
                  {r.heroImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image src={r.heroImage} alt={r.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-pine-900/60 to-transparent" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-white group-hover:text-gold-400 transition-colors text-lg">{r.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-cream-300/60 text-sm">{r.regionLabel}</span>
                      {r.priceRange && <span className="text-gold-400/80 text-sm font-semibold">{r.priceRange}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== BOTTOM CTA ===== */}
      <section className="bg-gradient-to-br from-pine-900 via-pine-800 to-pine-900 py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Play {course.name}?</h2>
          <p className="text-xl text-cream-300/80 mb-8 leading-relaxed">
            Tell us your dates, group size, and budget. We&apos;ll build a custom package with {course.name} and handle every detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-custom-golf-package/"
              className="inline-flex items-center justify-center gap-2 bg-gold-500 text-pine-900 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:-translate-y-0.5">
              Get a Free Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:1-888-584-8232"
              className="inline-flex items-center justify-center gap-2 border-2 border-cream-300/30 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:bg-white/10">
              <Phone className="w-5 h-5" /> (888) 584-8232
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
