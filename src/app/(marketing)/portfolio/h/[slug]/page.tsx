import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllHotelSlugs, getHotelBySlug, getHotelsByRegion } from "@/data/hotels";
import HotelPageContent from "@/components/HotelPageContent";
import RelatedTrips from "@/components/RelatedTrips";
import { getBlurs } from "@/lib/blur";

/* ─── Slim helpers ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimHotel(h: any) {
  const { geo, website, meta, region, ...client } = h;
  void geo; void website; void meta; void region;
  return client;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimRelatedHotel(h: any) {
  return { slug: h.slug, name: h.name, heroImage: h.heroImage || "", regionLabel: h.regionLabel, priceFrom: h.priceFrom, rating: h.rating };
}

/* ─── Static params ─── */
export async function generateStaticParams() {
  return getAllHotelSlugs().map((slug) => ({ slug }));
}

/* ─── Metadata ─── */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const hotel = getHotelBySlug(params.slug);
  if (!hotel) return { title: "Not Found" };
  return {
    title: hotel.meta.title,
    description: hotel.meta.description,
    robots: { index: true, follow: true },
    openGraph: {
      title: hotel.meta.title, description: hotel.meta.description,
      url: `https://golfthehighsierra.com/portfolio/${hotel.slug}/`,
      images: hotel.heroImage ? [{ url: hotel.heroImage, width: 1200, height: 630 }] : [],
    },
    twitter: { card: "summary_large_image", title: hotel.meta.title, description: hotel.meta.description },
    alternates: { canonical: `https://golfthehighsierra.com/portfolio/${hotel.slug}/` },
  };
}

/* ─── Page ─── */
export default function HotelPortfolioPage({ params }: { params: { slug: string } }) {
  const hotel = getHotelBySlug(params.slug);
  if (!hotel) notFound();

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
        ...(hotel.geo?.latitude && {
          geo: { "@type": "GeoCoordinates", latitude: hotel.geo.latitude, longitude: hotel.geo.longitude },
        }),
        telephone: hotel.phone || "+1-888-584-8232",
        ...(hotel.priceRange ? { priceRange: hotel.priceRange } : {}),
        ...(hotel.rating && {
          aggregateRating: { "@type": "AggregateRating", ratingValue: hotel.rating.value, ratingCount: hotel.rating.count, bestRating: 5, worstRating: 1 },
        }),
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
