import { GolfCourse, Hotel, Venue, BlogPost, FAQ } from "@/types";
import { siteConfig } from "./config";

// Schema script component
export function SchemaScript({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ===== ORGANIZATION / TRAVEL AGENCY =====

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: siteConfig.logo,
    image: siteConfig.logo,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    foundingDate: String(siteConfig.foundedYear),
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    sameAs: Object.values(siteConfig.socialLinks).filter(Boolean),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "672",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

// ===== GOLF COURSE =====

export function generateGolfCourseSchema(course: GolfCourse) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GolfCourse",
        "@id": `${siteConfig.url}/portfolio/${course.slug}/#course`,
        name: course.name,
        description: course.shortDescription,
        url: `${siteConfig.url}/portfolio/${course.slug}/`,
        image: course.heroImage,
        address: {
          "@type": "PostalAddress",
          ...course.address,
        },
        geo: {
          "@type": "GeoCoordinates",
          ...course.geo,
        },
        telephone: course.phone || siteConfig.phone,
        ...(course.priceRange && { priceRange: course.priceRange }),
        ...(course.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(course.rating.value),
            ratingCount: String(course.rating.count),
            bestRating: "5",
            worstRating: "1",
          },
        }),
        ...(course.holes && { numberOfHoles: course.holes }),
      },
      {
        "@type": "Service",
        "@id": `${siteConfig.url}/portfolio/${course.slug}/#packages`,
        name: `${course.name} Golf Packages`,
        serviceType: "Golf travel package",
        description: `Custom ${course.name} packages with lodging, guaranteed tee times, carts, and concierge planning.`,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: course.regionLabel,
        },
      },
      ...(course.faqs.length > 0
        ? [generateFAQSchema(course.faqs)]
        : []),
      generateBreadcrumbSchema([
        { name: "Home", url: siteConfig.url },
        { name: "Golf Courses", url: `${siteConfig.url}/best-golf-courses-reno/` },
        { name: course.name, url: `${siteConfig.url}/portfolio/${course.slug}/` },
      ]),
      generateSpeakableSchema(
        `${siteConfig.url}/portfolio/${course.slug}/`,
        ["#course-intro", "#course-facts", "#faq-section"]
      ),
      ...(course.videoUrl
        ? [
            {
              "@type": "VideoObject",
              name: `${course.name} - Course Overview`,
              description: course.shortDescription,
              thumbnailUrl: course.heroImage,
              contentUrl: course.videoUrl,
              uploadDate: new Date().toISOString().split("T")[0],
            },
          ]
        : []),
    ],
  };
}

// ===== HOTEL =====

export function generateHotelSchema(hotel: Hotel) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": hotel.type === "casino-resort" ? ["Hotel", "Casino"] : "Hotel",
        "@id": `${siteConfig.url}/portfolio/${hotel.slug}/#hotel`,
        name: hotel.name,
        description: hotel.shortDescription,
        url: `${siteConfig.url}/portfolio/${hotel.slug}/`,
        image: hotel.heroImage,
        address: {
          "@type": "PostalAddress",
          ...hotel.address,
        },
        geo: {
          "@type": "GeoCoordinates",
          ...hotel.geo,
        },
        telephone: hotel.phone || siteConfig.phone,
        ...(hotel.priceRange && { priceRange: hotel.priceRange }),
        ...(hotel.starRating && { starRating: { "@type": "Rating", ratingValue: String(hotel.starRating) } }),
        ...(hotel.totalRooms && { numberOfRooms: hotel.totalRooms }),
        ...(hotel.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(hotel.rating.value),
            ratingCount: String(hotel.rating.count),
            bestRating: "5",
            worstRating: "1",
          },
        }),
        amenityFeature: hotel.amenities.map((a) => ({
          "@type": "LocationFeatureSpecification",
          name: a,
          value: true,
        })),
      },
      {
        "@type": "Service",
        "@id": `${siteConfig.url}/portfolio/${hotel.slug}/#packages`,
        name: `${hotel.name} Golf & Stay Packages`,
        serviceType: "Golf lodging package",
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
      ...(hotel.faqs.length > 0 ? [generateFAQSchema(hotel.faqs)] : []),
      generateBreadcrumbSchema([
        { name: "Home", url: siteConfig.url },
        { name: "Lodging", url: `${siteConfig.url}/accommodations-in-reno-tahoe/` },
        { name: hotel.name, url: `${siteConfig.url}/portfolio/${hotel.slug}/` },
      ]),
      generateSpeakableSchema(
        `${siteConfig.url}/portfolio/${hotel.slug}/`,
        ["#hotel-intro", "#hotel-facts", "#faq-section"]
      ),
    ],
  };
}

// ===== VENUE (Restaurant, Bar, Spa, etc.) =====

export function generateVenueSchema(venue: Venue) {
  const typeMap: Record<string, string> = {
    restaurant: "Restaurant",
    steakhouse: "Restaurant",
    buffet: "Restaurant",
    bar: "BarOrNightClub",
    lounge: "BarOrNightClub",
    cafe: "CafeOrCoffeeShop",
    coffee: "CafeOrCoffeeShop",
    spa: "DaySpa",
    salon: "BeautySalon",
    fitness: "ExerciseGym",
    pool: "PublicSwimmingPool",
    experience: "EntertainmentBusiness",
    shopping: "ShoppingCenter",
    museum: "Museum",
    entertainment: "EntertainmentBusiness",
  };

  return {
    "@context": "https://schema.org",
    "@type": typeMap[venue.type] || "LocalBusiness",
    name: venue.name,
    description: venue.shortDescription,
    url: `${siteConfig.url}/portfolio/${venue.slug}/`,
    image: venue.heroImage,
    address: {
      "@type": "PostalAddress",
      ...venue.address,
    },
    ...(venue.cuisine && { servesCuisine: venue.cuisine }),
    ...(venue.priceRange && { priceRange: venue.priceRange }),
    ...(venue.hours && { openingHours: venue.hours }),
    ...(venue.parentHotel && {
      containedInPlace: {
        "@type": "Hotel",
        name: venue.parentHotel,
      },
    }),
  };
}

// ===== BLOG POST =====

export function generateBlogPostSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: post.heroImage,
        datePublished: post.publishDate,
        dateModified: post.updateDate || post.publishDate,
        author: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: siteConfig.logo,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteConfig.url}/${post.slug}/`,
        },
      },
      generateSpeakableSchema(`${siteConfig.url}/${post.slug}/`, [
        "#article-intro",
        "#key-takeaway",
      ]),
    ],
  };
}

// ===== HELPERS =====

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateSpeakableSchema(url: string, cssSelectors: string[]) {
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}
