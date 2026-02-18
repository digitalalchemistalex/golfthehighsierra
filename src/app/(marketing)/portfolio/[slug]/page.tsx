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
  const { geo, website, videoUrl, meta, region, courseRating, logo, hack, teeTimeInfo, teeTips, tips, facilities, ...client } = c;
  void geo; void website; void videoUrl; void meta; void region; void courseRating; void logo; void hack; void teeTimeInfo; void teeTips; void tips; void facilities;
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
    return {
      title: course.meta.title, description: course.meta.description,
      robots: { index: true, follow: true },
      openGraph: { title: course.meta.title, description: course.meta.description, url: `https://golfthehighsierra.com/portfolio/${course.slug}/`, images: course.heroImage ? [{ url: course.heroImage, width: 1200, height: 630 }] : [] },
      twitter: { card: "summary_large_image", title: course.meta.title, description: course.meta.description },
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
    const related = getCoursesByRegion(course.region).filter((c) => c.slug !== course.slug).slice(0, 3);
    const geo = course.geo as { latitude?: number; longitude?: number };
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "GolfCourse", name: course.name, description: course.description,
          url: `https://golfthehighsierra.com/portfolio/${course.slug}/`,
          image: course.heroImage,
          ...(course.address?.streetAddress && {
            address: { "@type": "PostalAddress", streetAddress: course.address.streetAddress, addressLocality: course.address.addressLocality, addressRegion: course.address.addressRegion, postalCode: course.address.postalCode, addressCountry: "US" },
          }),
          ...(geo?.latitude && { geo: { "@type": "GeoCoordinates", latitude: geo.latitude, longitude: geo.longitude } }),
          telephone: course.phone || "+1-888-584-8232",
          priceRange: course.priceRange,
          ...(course.rating && { aggregateRating: { "@type": "AggregateRating", ratingValue: course.rating.value, ratingCount: course.rating.count, bestRating: 5, worstRating: 1 } }),
        },
        { "@type": "Service", name: `${course.name} Golf Groups & Stay and Play Packages`, serviceType: "Golf travel package", provider: { "@type": "Organization", name: "Golf the High Sierra", url: "https://golfthehighsierra.com", telephone: "+1-888-584-8232" } },
        ...(course.faqs.length > 0 ? [{ "@type": "FAQPage", mainEntity: course.faqs.map((faq: { question: string; answer: string }) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://golfthehighsierra.com" },
          { "@type": "ListItem", position: 2, name: "Golf Courses", item: "https://golfthehighsierra.com/best-golf-courses-reno/" },
          { "@type": "ListItem", position: 3, name: course.name, item: `https://golfthehighsierra.com/portfolio/${course.slug}/` },
        ]},
      ],
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <CoursePageContent course={slimCourse(course)} relatedCourses={related.map(slimRelatedCourse)} blurs={getBlurs([course.heroImage || "", ...(course.images || []), ...related.map(c => c.heroImage || "")])} />
        <RelatedTrips slug={course.slug} type="course" />
      </>
    );
  }

  /* ── Hotel ── */
  if (type === "hotel") {
    const hotel = getHotelBySlug(params.slug)!;
    const relatedHotels = getHotelsByRegion(hotel.region).filter((h) => h.slug !== hotel.slug).slice(0, 3);
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
        <HotelPageContent hotel={slimHotel(hotel)} relatedHotels={relatedHotels.map(slimRelatedHotel)} blurs={getBlurs([hotel.heroImage, ...(hotel.images || []), ...relatedHotels.map(h => h.heroImage || "")])} />
        <RelatedTrips slug={hotel.slug} type="hotel" />
      </>
    );
  }

  /* ── Venue ── */
  const venue = getVenueBySlug(params.slug)!;
  const sameType = getVenuesByType(venue.type).filter((v) => v.slug !== venue.slug);
  const sameRegion = getVenuesByRegion(venue.region).filter((v) => v.slug !== venue.slug && !sameType.find((s) => s.slug === v.slug));
  const relatedVenues = [...sameType, ...sameRegion].slice(0, 3);

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
      <VenuePageContent venue={slimVenue(venue)} relatedVenues={relatedVenues.map(slimRelatedVenue)} blurs={getBlurs([venue.heroImage || "", ...(venue.images || []), ...relatedVenues.map(v => v.heroImage || "")])} />
    </>
  );
}
