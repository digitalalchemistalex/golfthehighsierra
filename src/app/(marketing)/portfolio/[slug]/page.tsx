import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCourseSlugs, getCourseBySlug, getCoursesByRegion } from "@/data/courses";
import { getAllHotelSlugs, getHotelBySlug, getHotelsByRegion } from "@/data/hotels";
import { getAllVenueSlugs, getVenueBySlug, getVenuesByRegion, getVenuesByType } from "@/data/venues";
import CoursePageContent from "@/components/CoursePageContent";
import HotelPageContent from "@/components/HotelPageContent";
import VenuePageContent from "@/components/VenuePageContent";
import RelatedTrips from "@/components/RelatedTrips";
import { getBlurs } from "@/lib/blur";

export const dynamicParams = false;

/* ─── Type detection ─── */
function getItemType(slug: string): "course" | "hotel" | "venue" | null {
  if (getCourseBySlug(slug)) return "course";
  if (getHotelBySlug(slug)) return "hotel";
  if (getVenueBySlug(slug)) return "venue";
  return null;
}

/* ─── Slim helpers ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimCourse(c: any) {
  const { geo, website, videoUrl, meta, region, courseRating, logo, teeTimeInfo, teeTips, facilities, ...client } = c;
  void geo; void website; void videoUrl; void meta; void region; void courseRating; void logo; void teeTimeInfo; void teeTips; void facilities;
  return client;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimRelatedCourse(c: any) {
  return { slug: c.slug, name: c.name, heroImage: c.heroImage || "", regionLabel: c.regionLabel, priceRange: c.priceRange, rating: c.rating };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimHotel(h: any) {
  const { geo, website, meta, region, relatedCourses, relatedHotels, aaaRating, logo, parking, spaBars, ...client } = h;
  void geo; void website; void meta; void region; void relatedCourses; void relatedHotels; void aaaRating; void logo; void parking; void spaBars;
  return client;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimRelatedHotel(h: any) {
  return { slug: h.slug, name: h.name, heroImage: h.heroImage || "", regionLabel: h.regionLabel, priceFrom: h.priceFrom, rating: h.rating };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimVenue(v: any) {
  const { geo, meta, region, ...client } = v;
  void geo; void meta; void region;
  return client;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimRelatedVenue(v: any) {
  return { slug: v.slug, name: v.name, heroImage: v.heroImage || "", regionLabel: v.regionLabel, priceRange: v.priceRange, type: v.type };
}

/* ─── Static params ─── */
export async function generateStaticParams() {
  const courses = getAllCourseSlugs().map((slug) => ({ slug }));
  const hotels = getAllHotelSlugs().map((slug) => ({ slug }));
  const venues = getAllVenueSlugs().map((slug) => ({ slug }));
  return [...courses, ...hotels, ...venues];
}

/* ─── Metadata ─── */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const type = getItemType(params.slug);
  if (!type) return { title: "Not Found" };

  if (type === "course") {
    const course = getCourseBySlug(params.slug)!;
    const absImg = course.heroImage?.startsWith("/") ? `https://golfthehighsierra.com${course.heroImage}` : course.heroImage;
    return {
      title: course.meta.title, description: course.meta.description,
      robots: { index: true, follow: true },
      openGraph: { title: course.meta.title, description: course.meta.description, url: `https://golfthehighsierra.com/portfolio/${course.slug}/`, images: absImg ? [{ url: absImg, width: 1200, height: 630 }] : [], type: "website", siteName: "Golf the High Sierra" },
      twitter: { card: "summary_large_image", title: course.meta.title, description: course.meta.description, images: absImg ? [absImg] : [] },
      alternates: { canonical: `https://golfthehighsierra.com/portfolio/${course.slug}/` },
    };
  }
  if (type === "hotel") {
    const hotel = getHotelBySlug(params.slug)!;
    return {
      title: hotel.meta.title, description: hotel.meta.description,
      robots: { index: true, follow: true },
      openGraph: { title: hotel.meta.title, description: hotel.meta.description, url: `https://golfthehighsierra.com/portfolio/${hotel.slug}/`, images: hotel.heroImage ? [{ url: hotel.heroImage, width: 1200, height: 630 }] : [] },
      twitter: { card: "summary_large_image", title: hotel.meta.title, description: hotel.meta.description },
      alternates: { canonical: `https://golfthehighsierra.com/portfolio/${hotel.slug}/` },
    };
  }
  // venue
  const venue = getVenueBySlug(params.slug)!;
  return {
    title: venue.meta.title, description: venue.meta.description,
    robots: { index: true, follow: true },
    openGraph: { title: venue.meta.title, description: venue.meta.description, url: `https://golfthehighsierra.com/portfolio/${venue.slug}/`, images: venue.heroImage ? [{ url: venue.heroImage, width: 1200, height: 630 }] : [] },
    twitter: { card: "summary_large_image", title: venue.meta.title, description: venue.meta.description },
    alternates: { canonical: `https://golfthehighsierra.com/portfolio/${venue.slug}/` },
  };
}

/* ─── Page ─── */
export default function PortfolioPage({ params }: { params: { slug: string } }) {
  const type = getItemType(params.slug);
  if (!type) notFound();

  /* ── Course ── */
  if (type === "course") {
    const course = getCourseBySlug(params.slug)!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courseAny = course as any;
    const related = courseAny.relatedCourseSlugs
      ? (courseAny.relatedCourseSlugs as string[]).map((s: string) => getCourseBySlug(s)).filter((c): c is NonNullable<typeof c> => c != null).slice(0, 3)
      : getCoursesByRegion(course.region).filter((c) => c.slug !== course.slug).slice(0, 3);
    const relatedHotelSlugs: string[] = courseAny.relatedHotels || [];
    const driveTimes: Record<string, number> = courseAny.driveTimes || {};
    const relatedHotels = relatedHotelSlugs
      .map((s: string) => getHotelBySlug(s))
      .filter((h): h is NonNullable<typeof h> => h != null)
      .slice(0, 3)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((h) => ({ slug: h.slug, name: h.name, heroImage: (h as any).heroImage || "", regionLabel: h.regionLabel, priceFrom: h.priceFrom, rating: h.rating, driveMinutes: driveTimes[h.slug] }));
    const geo = course.geo as { latitude?: number; longitude?: number };
    const BASE = "https://golfthehighsierra.com";
    const pageUrl = `${BASE}/portfolio/${course.slug}/`;
    const absImage = course.heroImage?.startsWith("/") ? `${BASE}${course.heroImage}` : course.heroImage;
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "GolfCourse", name: course.name, description: course.description,
          url: pageUrl, image: absImage,
          sport: "Golf",
          isAccessibleForFree: false,
          ...(course.address?.streetAddress && {
            address: { "@type": "PostalAddress", streetAddress: course.address.streetAddress, addressLocality: course.address.addressLocality, addressRegion: course.address.addressRegion, postalCode: course.address.postalCode, addressCountry: "US" },
          }),
          ...(geo?.latitude && { geo: { "@type": "GeoCoordinates", latitude: geo.latitude, longitude: geo.longitude } }),
          telephone: course.phone || "+1-888-584-8232",
          ...(course.website && { sameAs: [course.website] }),
          ...(course.par && { numberOfHoles: course.holes || 18 }),
          ...(course.designer && { founder: course.designer }),
          ...(course.yearBuilt && { foundingDate: String(course.yearBuilt) }),
          ...(course.rating && { aggregateRating: { "@type": "AggregateRating", ratingValue: course.rating.value, ratingCount: course.rating.count, bestRating: 5, worstRating: 1 } }),
          ...(course.testimonials?.length > 0 && { review: course.testimonials.slice(0, 3).map((t: { stars: number; quote: string; author: string; source: string }) => ({
            "@type": "Review", reviewRating: { "@type": "Rating", ratingValue: t.stars, bestRating: 5 }, author: { "@type": "Person", name: t.author }, reviewBody: t.quote, publisher: { "@type": "Organization", name: t.source },
          })) }),
          amenityFeature: [
            { "@type": "LocationFeatureSpecification", name: "Group Golf Packages", value: true },
            { "@type": "LocationFeatureSpecification", name: "Corporate Events", value: true },
            { "@type": "LocationFeatureSpecification", name: "Practice Facility", value: true },
            { "@type": "LocationFeatureSpecification", name: "Clubhouse", value: true },
            { "@type": "LocationFeatureSpecification", name: "Pro Shop", value: true },
            { "@type": "LocationFeatureSpecification", name: "Golf Carts", value: true },
          ],
        },
        { "@type": "Service", name: `${course.name} Golf Groups & Stay and Play Packages`, serviceType: "Golf travel package", provider: { "@type": "Organization", name: "Golf the High Sierra", url: BASE, telephone: "+1-888-584-8232", sameAs: ["https://www.facebook.com/golfthehighsierra", "https://www.instagram.com/golfthehighsierra"] }, areaServed: { "@type": "State", name: "Nevada, California" }, description: `Custom golf group packages at ${course.name} — tee times, lodging, dining, and transportation coordinated by Golf the High Sierra.` },
        { "@type": "SportsActivityLocation", name: course.name, sport: "Golf", url: pageUrl, description: course.description, telephone: course.phone || "+1-888-584-8232", ...(geo?.latitude && { geo: { "@type": "GeoCoordinates", latitude: geo.latitude, longitude: geo.longitude } }) },
        ...(course.faqs.length > 0 ? [{ "@type": "FAQPage", mainEntity: course.faqs.map((faq: { question: string; answer: string }) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: "Golf Courses", item: `${BASE}/best-golf-courses-reno/` },
          { "@type": "ListItem", position: 3, name: course.name, item: pageUrl },
        ]},
        { "@type": "WebPage", "@id": pageUrl, name: course.meta.title, description: course.meta.description, speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".course-intro", ".course-faq"] }, isPartOf: { "@type": "WebSite", name: "Golf the High Sierra", url: BASE } },
      ],
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <CoursePageContent course={slimCourse(course)} relatedCourses={related.map(slimRelatedCourse)} relatedHotels={relatedHotels} blurs={getBlurs([course.heroImage || "", ...(course.images || []), ...related.map(c => c.heroImage || "")])} />
        <RelatedTrips slug={course.slug} type="course" />
      </>
    );
  }

  /* ── Hotel ── */
  if (type === "hotel") {
    const hotel = getHotelBySlug(params.slug)!;
    const relatedHotels = getHotelsByRegion(hotel.region).filter((h) => h.slug !== hotel.slug).slice(0, 3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hotelAny = hotel as any;
    const relatedCourseSlugs: string[] = hotelAny.relatedCourses || [];
    const courseDistances: Record<string, number> = hotelAny.courseDistances || {};
    const relatedCourses = relatedCourseSlugs
      .map((s: string) => getCourseBySlug(s))
      .filter((c): c is NonNullable<typeof c> => c != null)
      .slice(0, 3)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c) => ({ slug: c.slug, name: c.name, heroImage: (c as any).heroImage || "", regionLabel: c.regionLabel, priceRange: (c as any).priceRange, rating: c.rating, driveMinutes: courseDistances[c.slug] }));
    const hotelSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Hotel", name: hotel.name, description: hotel.description,
          url: `https://golfthehighsierra.com/portfolio/${hotel.slug}/`,
          image: hotel.heroImage,
          ...(hotel.address?.streetAddress && {
            address: { "@type": "PostalAddress", streetAddress: hotel.address.streetAddress, addressLocality: hotel.address.addressLocality, addressRegion: hotel.address.addressRegion, postalCode: hotel.address.postalCode, addressCountry: "US" },
          }),
          ...(hotel.geo?.latitude && { geo: { "@type": "GeoCoordinates", latitude: hotel.geo.latitude, longitude: hotel.geo.longitude } }),
          telephone: hotel.phone || "+1-888-584-8232",
          ...(hotel.priceRange ? { priceRange: hotel.priceRange } : {}),
          ...(hotel.rating && { aggregateRating: { "@type": "AggregateRating", ratingValue: hotel.rating.value, ratingCount: hotel.rating.count, bestRating: 5, worstRating: 1 } }),
          ...("starRating" in hotel && hotel.starRating ? { starRating: { "@type": "Rating", ratingValue: hotel.starRating } } : {}),
        },
        { "@type": "Service", name: `${hotel.name} Golf Stay and Play Packages`, serviceType: "Golf travel package", provider: { "@type": "Organization", name: "Golf the High Sierra", url: "https://golfthehighsierra.com", telephone: "+1-888-584-8232" } },
        ...(hotel.faqs?.length > 0 ? [{ "@type": "FAQPage", mainEntity: hotel.faqs.map((faq: { question: string; answer: string }) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://golfthehighsierra.com" },
          { "@type": "ListItem", position: 2, name: "Accommodations", item: "https://golfthehighsierra.com/accommodations-in-reno-tahoe/" },
          { "@type": "ListItem", position: 3, name: hotel.name, item: `https://golfthehighsierra.com/portfolio/${hotel.slug}/` },
        ]},
      ],
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }} />
        <HotelPageContent hotel={slimHotel(hotel)} relatedHotels={relatedHotels.map(slimRelatedHotel)} relatedCourses={relatedCourses} blurs={getBlurs([hotel.heroImage, ...(hotel.images || []), ...relatedHotels.map(h => h.heroImage || "")])} />
        <RelatedTrips slug={hotel.slug} type="hotel" />
      </>
    );
  }

  /* ── Venue ── */
  const venue = getVenueBySlug(params.slug)!;
  const sameType = getVenuesByType(venue.type).filter((v) => v.slug !== venue.slug);
  const sameRegion = getVenuesByRegion(venue.region).filter((v) => v.slug !== venue.slug && !sameType.find((s) => s.slug === v.slug));
  const relatedVenues = [...sameType, ...sameRegion].slice(0, 3);

  // Look up parent hotel and its nearby courses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const venueAny = venue as any;
  const parentHotelSlug: string | null = venueAny.parentHotel || null;
  const parentHotel = parentHotelSlug ? getHotelBySlug(parentHotelSlug) : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentHotelAny = parentHotel as any;
  const nearbyCourseSlugs: string[] = parentHotelAny?.relatedCourses || [];
  const nearbyGolfCourses = nearbyCourseSlugs
    .map((s: string) => getCourseBySlug(s))
    .filter((c): c is NonNullable<typeof c> => c != null)
    .slice(0, 3)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((c) => ({ slug: c.slug, name: c.name, heroImage: (c as any).heroImage || "", regionLabel: c.regionLabel, priceRange: (c as any).priceRange, rating: c.rating }));

  const venueSchemaType = (() => {
    switch (venue.type) {
      case "bar": case "lounge": return "BarOrPub";
      case "spa": return "HealthAndBeautyBusiness";
      case "museum": return "Museum";
      case "shopping": return "ShoppingCenter";
      case "pool": case "fitness": case "amenity": return "SportsActivityLocation";
      default: return "LocalBusiness";
    }
  })();

  const venueSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": venueSchemaType, name: venue.name, description: venue.description,
        url: `https://golfthehighsierra.com/portfolio/${venue.slug}/`,
        ...(venue.heroImage ? { image: venue.heroImage } : {}),
        ...(venue.address?.streetAddress && {
          address: { "@type": "PostalAddress", streetAddress: venue.address.streetAddress, addressLocality: venue.address.addressLocality, addressRegion: venue.address.addressRegion, postalCode: venue.address.postalCode, addressCountry: "US" },
        }),
        ...(venue.geo?.latitude && { geo: { "@type": "GeoCoordinates", latitude: venue.geo.latitude, longitude: venue.geo.longitude } }),
        ...(venue.phone ? { telephone: venue.phone } : {}),
        ...(venue.priceRange ? { priceRange: venue.priceRange } : {}),
      },
      ...(venue.faqs?.length > 0 ? [{ "@type": "FAQPage", mainEntity: venue.faqs.map((faq: { question: string; answer: string }) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://golfthehighsierra.com" },
        { "@type": "ListItem", position: 2, name: "Experiences", item: "https://golfthehighsierra.com" },
        { "@type": "ListItem", position: 3, name: venue.name, item: `https://golfthehighsierra.com/portfolio/${venue.slug}/` },
      ]},
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(venueSchema) }} />
      <VenuePageContent venue={slimVenue(venue)} relatedVenues={relatedVenues.map(slimRelatedVenue)} nearbyGolfCourses={nearbyGolfCourses} parentHotelName={parentHotel?.name} blurs={getBlurs([venue.heroImage || "", ...(venue.images || []), ...relatedVenues.map(v => v.heroImage || "")])} />
    </>
  );
}
