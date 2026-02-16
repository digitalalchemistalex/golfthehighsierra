import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCourseSlugs, getCourseBySlug, getCoursesByRegion } from "@/data/courses";
import { getAllHotelSlugs, getHotelBySlug, getHotelsByRegion } from "@/data/hotels";
import { getAllVenueSlugs, getVenueBySlug, getVenuesByRegion, getVenuesByType } from "@/data/venues";
import HotelPageContent from "@/components/HotelPageContent";
import CoursePageContent from "@/components/CoursePageContent";
import VenuePageContent from "@/components/VenuePageContent";

export async function generateStaticParams() {
  const courseSlugs = getAllCourseSlugs().map((slug) => ({ slug }));
  const hotelSlugs = getAllHotelSlugs().map((slug) => ({ slug }));
  const venueSlugs = getAllVenueSlugs().map((slug) => ({ slug }));
  return [...courseSlugs, ...hotelSlugs, ...venueSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = getCourseBySlug(params.slug);
  const hotel = !course ? getHotelBySlug(params.slug) : undefined;
  const venue = !course && !hotel ? getVenueBySlug(params.slug) : undefined;
  const item = course || hotel || venue;
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

export default function PortfolioPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  const hotel = !course ? getHotelBySlug(params.slug) : undefined;

  // Hotel page
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
          ...("starRating" in hotel && hotel.starRating ? { starRating: { "@type": "Rating", ratingValue: hotel.starRating } } : {}),
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

  // Venue page
  const venue = !course && !hotel ? getVenueBySlug(params.slug) : undefined;
  if (venue) {
    const relatedVenues = [
      ...getVenuesByRegion(venue.region).filter((v) => v.slug !== venue.slug),
      ...getVenuesByType(venue.type).filter((v) => v.slug !== venue.slug && v.region !== venue.region),
    ].slice(0, 3);

    const venueSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": venue.type === "bar" || venue.type === "lounge" ? "BarOrPub"
            : venue.type === "spa" ? "HealthAndBeautyBusiness"
            : venue.type === "museum" ? "Museum"
            : venue.type === "restaurant" ? "Restaurant"
            : "LocalBusiness",
          name: venue.name,
          description: venue.description,
          url: `https://golfthehighsierra.com/portfolio/${venue.slug}/`,
          image: venue.heroImage,
          ...(venue.address?.streetAddress && {
            address: {
              "@type": "PostalAddress",
              streetAddress: venue.address.streetAddress,
              addressLocality: venue.address.addressLocality,
              addressRegion: venue.address.addressRegion,
              postalCode: venue.address.postalCode,
              addressCountry: "US",
            },
          }),
          ...(venue.geo?.latitude && {
            geo: { "@type": "GeoCoordinates", latitude: venue.geo.latitude, longitude: venue.geo.longitude },
          }),
          ...(venue.phone ? { telephone: venue.phone } : {}),
          ...(venue.priceRange ? { priceRange: venue.priceRange } : {}),
        },
        {
          "@type": "Service",
          name: `${venue.name} + Golf Package`,
          serviceType: "Golf travel package",
          provider: { "@type": "Organization", name: "Golf the High Sierra", url: "https://golfthehighsierra.com", telephone: "+1-888-584-8232" },
        },
        ...(venue.faqs?.length > 0 ? [{
          "@type": "FAQPage",
          mainEntity: venue.faqs.map((faq: { question: string; answer: string }) => ({
            "@type": "Question", name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }] : []),
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://golfthehighsierra.com" },
            { "@type": "ListItem", position: 2, name: "Experiences", item: "https://golfthehighsierra.com/experiences-things-to-do-in-reno-nv/" },
            { "@type": "ListItem", position: 3, name: venue.name, item: `https://golfthehighsierra.com/portfolio/${venue.slug}/` },
          ],
        },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(venueSchema) }} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <VenuePageContent venue={venue as unknown as any} relatedVenues={relatedVenues as unknown as any[]} />
      </>
    );
  }

  // Course page
  if (!course) notFound();

  const related = getCoursesByRegion(course.region).filter((c) => c.slug !== course.slug).slice(0, 3);

  const geo = course.geo as { latitude?: number; longitude?: number };

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
      <CoursePageContent course={course} relatedCourses={related} />
    </>
  );
}
