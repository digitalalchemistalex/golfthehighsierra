import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCourseSlugs, getCourseBySlug, getCoursesByRegion } from "@/data/courses";
import CoursePageContent from "@/components/CoursePageContent";
import RelatedTrips from "@/components/RelatedTrips";
import { getBlurs } from "@/lib/blur";

/* ─── Slim helpers ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimCourse(c: any) {
  const { geo, website, videoUrl, meta, region, courseRating, logo, ...client } = c;
  void geo; void website; void videoUrl; void meta; void region; void courseRating; void logo;
  return client;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function slimRelatedCourse(c: any) {
  return { slug: c.slug, name: c.name, heroImage: c.heroImage || "", regionLabel: c.regionLabel, priceRange: c.priceRange, rating: c.rating };
}

/* ─── Static params ─── */
export async function generateStaticParams() {
  return getAllCourseSlugs().map((slug) => ({ slug }));
}

/* ─── Metadata ─── */
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = getCourseBySlug(params.slug);
  if (!course) return { title: "Not Found" };
  return {
    title: course.meta.title,
    description: course.meta.description,
    robots: { index: true, follow: true },
    openGraph: {
      title: course.meta.title, description: course.meta.description,
      url: `https://golfthehighsierra.com/portfolio/${course.slug}/`,
      images: course.heroImage ? [{ url: course.heroImage, width: 1200, height: 630 }] : [],
    },
    twitter: { card: "summary_large_image", title: course.meta.title, description: course.meta.description },
    alternates: { canonical: `https://golfthehighsierra.com/portfolio/${course.slug}/` },
  };
}

/* ─── Page ─── */
export default function CoursePortfolioPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

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
