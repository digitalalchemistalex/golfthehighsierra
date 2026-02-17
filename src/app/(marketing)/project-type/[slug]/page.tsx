/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ALL_VENUES } from "@/data/venues";
import { ALL_COURSES } from "@/data/courses";

// Taxonomy configuration
const TAXONOMIES: Record<
  string,
  {
    title: string;
    description: string;
    filter: () => Array<{ slug: string; name: string; heroImage?: string; description?: string; shortDescription?: string; type?: string; region?: string }>;
    basePath: string;
  }
> = {
  "all-experiences": {
    title: "All Experiences",
    description:
      "Explore the best bars, lounges, spas, shopping, and entertainment across the Reno-Tahoe region.",
    filter: () =>
      ALL_VENUES.filter(
        (v: any) => !v.parentHotel
      ).map((v: any) => ({
        slug: v.slug,
        name: v.name,
        heroImage: v.heroImage,
        shortDescription: v.shortDescription || v.description?.slice(0, 120) + "...",
        type: v.type,
        region: v.regionLabel || v.region,
      })),
    basePath: "/portfolio/v/",
  },
  food: {
    title: "All Food & Dining",
    description:
      "Discover the best restaurants, steakhouses, brewpubs, and dining experiences across Reno, Lake Tahoe, and Carson Valley.",
    filter: () =>
      ALL_VENUES.filter(
        (v: any) => v.type === "restaurant" || v.type === "coffee"
      ).map((v: any) => ({
        slug: v.slug,
        name: v.name,
        heroImage: v.heroImage,
        shortDescription: v.shortDescription || v.description?.slice(0, 120) + "...",
        type: v.type,
        region: v.regionLabel || v.region,
      })),
    basePath: "/portfolio/v/",
  },
  "all-atlantis": {
    title: "All Atlantis",
    description:
      "Explore rooms, suites, bars, and dining at the Atlantis Casino Resort Spa in Reno, NV.",
    filter: () =>
      ALL_VENUES.filter(
        (v: any) => v.parentHotel === "atlantis-casino-resort-spa-reno"
      ).map((v: any) => ({
        slug: v.slug,
        name: v.name,
        heroImage: v.heroImage,
        shortDescription: v.shortDescription || v.description?.slice(0, 120) + "...",
        type: v.type,
        region: v.regionLabel || v.region,
      })),
    basePath: "/portfolio/v/",
  },
  "all-eldorado": {
    title: "All Eldorado",
    description:
      "Explore rooms, suites, restaurants, bars, and entertainment at THE ROW's Eldorado Resort Casino in Reno, NV.",
    filter: () =>
      ALL_VENUES.filter(
        (v: any) =>
          v.parentHotel === "eldorado-resorts-reno-eldorado-at-the-row"
      ).map((v: any) => ({
        slug: v.slug,
        name: v.name,
        heroImage: v.heroImage,
        shortDescription: v.shortDescription || v.description?.slice(0, 120) + "...",
        type: v.type,
        region: v.regionLabel || v.region,
      })),
    basePath: "/portfolio/v/",
  },
  "all-carson-valley-inn": {
    title: "All Carson Valley Inn",
    description:
      "Explore rooms, dining, and amenities at Carson Valley Inn & Casino in Minden, NV.",
    filter: () =>
      ALL_VENUES.filter(
        (v: any) => v.parentHotel === "carson-valley-inn-casino"
      ).map((v: any) => ({
        slug: v.slug,
        name: v.name,
        heroImage: v.heroImage,
        shortDescription: v.shortDescription || v.description?.slice(0, 120) + "...",
        type: v.type,
        region: v.regionLabel || v.region,
      })),
    basePath: "/portfolio/v/",
  },
  "all-cedar-house": {
    title: "All Cedar House",
    description:
      "Explore rooms, dining, and outdoor experiences at Cedar House Sport Hotel in Truckee, CA.",
    filter: () =>
      ALL_VENUES.filter(
        (v: any) => v.parentHotel === "cedar-house-sport-hotel"
      ).map((v: any) => ({
        slug: v.slug,
        name: v.name,
        heroImage: v.heroImage,
        shortDescription: v.shortDescription || v.description?.slice(0, 120) + "...",
        type: v.type,
        region: v.regionLabel || v.region,
      })),
    basePath: "/portfolio/v/",
  },
  "all-lake-tahoe-resort": {
    title: "All Lake Tahoe Resort",
    description:
      "Explore rooms, dining, and entertainment at Lake Tahoe Resort Hotel at Heavenly Village.",
    filter: () =>
      ALL_VENUES.filter(
        (v: any) =>
          v.parentHotel === "lake-tahoe-resort-hotel-at-heavenly-village"
      ).map((v: any) => ({
        slug: v.slug,
        name: v.name,
        heroImage: v.heroImage,
        shortDescription: v.shortDescription || v.description?.slice(0, 120) + "...",
        type: v.type,
        region: v.regionLabel || v.region,
      })),
    basePath: "/portfolio/v/",
  },
  "old-greenwood": {
    title: "Old Greenwood",
    description:
      "Explore golf, lodging, and experiences at Old Greenwood in Truckee, CA — a Tahoe Mountain Club community.",
    filter: () => {
      const course = ALL_COURSES.filter(
        (c: any) => c.slug === "old-greenwood-golf-course"
      ).map((c: any) => ({
        slug: c.slug,
        name: c.name,
        heroImage: c.heroImage,
        shortDescription: c.description?.slice(0, 120) + "...",
        type: "course",
        region: c.regionLabel || c.region,
      }));
      const venues = ALL_VENUES.filter(
        (v: any) => v.slug.includes("old-greenwood") || v.parentHotel?.includes("old-greenwood")
      ).map((v: any) => ({
        slug: v.slug,
        name: v.name,
        heroImage: v.heroImage,
        shortDescription: v.shortDescription || v.description?.slice(0, 120) + "...",
        type: v.type,
        region: v.regionLabel || v.region,
      }));
      return [...course, ...venues];
    },
    basePath: "/portfolio/",
  },
};

export async function generateStaticParams() {
  return Object.keys(TAXONOMIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tax = TAXONOMIES[slug];
  if (!tax) return { title: "Not Found" };
  return {
    title: `${tax.title} | Golf The High Sierra`,
    description: tax.description,
    alternates: {
      canonical: `https://golfthehighsierra.com/project-type/${slug}/`,
    },
  };
}

export default async function TaxonomyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tax = TAXONOMIES[slug];
  if (!tax) notFound();

  const items = tax.filter();
  const typeLabels: Record<string, string> = {
    bar: "Bar & Lounge",
    restaurant: "Restaurant",
    room: "Room & Suite",
    spa: "Spa & Wellness",
    entertainment: "Entertainment",
    shopping: "Shopping",
    coffee: "Coffee",
    course: "Golf Course",
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#1E3A2F] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-light mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {tax.title}
          </h1>
          <p
            className="text-lg text-white/80 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {tax.description}
          </p>
          <p className="mt-4 text-sm text-[#C9A24D]">
            {items.length} {items.length === 1 ? "listing" : "listings"}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const href =
              item.type === "course"
                ? `/portfolio/c/${item.slug}/`
                : `${tax.basePath}${item.slug}/`;
            return (
              <Link
                key={item.slug}
                href={href}
                className="group rounded-2xl overflow-hidden bg-[#FAFAF8] border border-[#E8E4DE] hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  {item.heroImage ? (
                    <Image
                      src={item.heroImage}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E3A2F] to-[#6B8E7F]" />
                  )}
                  {item.type && (
                    <span className="absolute top-3 left-3 bg-white/90 text-[#1E3A2F] text-xs px-3 py-1 rounded-full font-medium">
                      {typeLabels[item.type] || item.type}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3
                    className="text-lg font-semibold text-[#111] mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {item.name}
                  </h3>
                  {item.shortDescription && (
                    <p
                      className="text-sm text-[#555] line-clamp-2"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      {item.shortDescription}
                    </p>
                  )}
                  <span className="inline-block mt-3 text-sm text-[#C9A24D] font-medium group-hover:underline">
                    View Details →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 text-[#888]">
            <p className="text-lg">No listings found in this category yet.</p>
            <Link
              href="/group-golf-reno-tahoe/"
              className="inline-block mt-4 text-[#C9A24D] hover:underline"
            >
              ← Explore all destinations
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#1E3A2F] text-white py-16 px-6 text-center">
        <h2
          className="text-3xl font-light mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Plan Your Group Golf Trip
        </h2>
        <p
          className="text-white/70 mb-6 max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Custom packages with lodging, tee times, dining, and transportation
          across the High Sierra.
        </p>
        <Link
          href="/contact-custom-golf-package/"
          className="inline-block bg-[#C9A24D] hover:bg-[#B08C3A] text-white px-8 py-3 rounded-full text-sm font-medium transition-colors"
        >
          Request a Free Quote
        </Link>
      </section>
    </main>
  );
}
