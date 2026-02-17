import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllVenueSlugs, getVenueBySlug, getVenuesByRegion, getVenuesByType } from "@/data/venues";
import VenuePageContent from "@/components/VenuePageContent";
import { getBlurs } from "@/lib/blur";

/* ─── Slim helpers ─── */
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
  return getAllVenueSlugs().map((slug) => ({ slug }));
}

/* ─── Metadata ─── */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return { title: "Not Found" };
  return {
    title: venue.meta.title,
    description: venue.meta.description,
    robots: { index: true, follow: true },
    openGraph: {
      title: venue.meta.title, description: venue.meta.description,
      url: `https://golfthehighsierra.com/portfolio/${venue.slug}/`,
      images: venue.heroImage ? [{ url: venue.heroImage, width: 1200, height: 630 }] : [],
    },
    twitter: { card: "summary_large_image", title: venue.meta.title, description: venue.meta.description },
    alternates: { canonical: `https://golfthehighsierra.com/portfolio/${venue.slug}/` },
  };
}

/* ─── Page ─── */
export default function VenuePortfolioPage({ params }: { params: { slug: string } }) {
  const venue = getVenueBySlug(params.slug);
  if (!venue) notFound();

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
