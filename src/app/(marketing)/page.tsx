import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, Star, MapPin, Users, CheckCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { SchemaScript, generateOrganizationSchema, generateSpeakableSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The Only Golf Planner Covering Reno, Tahoe, Carson & Graeagle | 20+ Courses",
  description:
    "Official golf package experts since 2004. Reno & Lake Tahoe group stay and play deals with 20+ courses, tee times, lodging, and concierge planning. Call 888-584-8232.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Golf the High Sierra | Reno-Tahoe Golf Packages",
    description:
      "The premier golf trip planner for Reno, Lake Tahoe, Carson Valley & Graeagle. 20+ courses, luxury lodging, custom group packages. Call 888-584-8232.",
    url: siteConfig.url,
    images: [
      {
        url: "/images/hero-desert-golf.jpg",
        width: 1200,
        height: 630,
        alt: "Golf courses in Reno and Lake Tahoe",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <SchemaScript schema={generateOrganizationSchema()} />
      <SchemaScript
        schema={generateSpeakableSchema(siteConfig.url, [
          "#homepage-hero",
          "#homepage-destinations",
          "#trust-signals",
        ])}
      />

      {/* Hero */}
      <section className="hero-section">
        <div className="absolute inset-0 bg-[url('https://golfthehighsierra.com/wp-content/uploads/2021/05/Edgewood-Tahoe-Golf-Course-1.jpg')] bg-cover bg-center" />
        <div className="hero-overlay" />
        <div className="hero-content" id="homepage-hero">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-fade-in">
            The Unmatched Combination
            <br />
            <span className="font-display italic">
              of <span className="text-red-400">Red Rocks</span> &{" "}
              <span className="text-emerald-400">Green Fairways</span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto animate-slide-up">
            20+ championship courses, luxury casino resorts, and expert trip
            planning across Reno, Lake Tahoe, Carson Valley & Graeagle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              href="/contact-custom-golf-package/"
              className="btn-primary text-lg px-8 py-4"
            >
              Start Planning Your Trip
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${siteConfig.phone}`}
              className="btn-secondary text-lg px-8 py-4"
            >
              <Phone className="w-5 h-5" />
              {siteConfig.phoneFormatted}
            </a>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-pine-800 py-6" id="trust-signals">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="trust-badge">
            <Star className="w-4 h-4 text-gold-400" />
            4.8/5 Rating (672 Reviews)
          </div>
          <div className="trust-badge">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            20+ Years Experience
          </div>
          <div className="trust-badge">
            <MapPin className="w-4 h-4 text-gold-400" />
            20+ Partner Courses
          </div>
          <div className="trust-badge">
            <Users className="w-4 h-4 text-emerald-400" />
            Groups of 4 to 400
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section-padding bg-cream-200" id="homepage-destinations">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Choose Your Region</h2>
            <div className="divider-gold mx-auto mb-4" />
            <p className="section-subtitle">
              Four world-class golf regions, endless possibilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Reno", courses: 9, tagline: "Casino resorts & championship golf", href: "/reno-golf-packages/" },
              { name: "Lake Tahoe", courses: 8, tagline: "Mountain views & alpine fairways", href: "/lake-tahoe-golf-packages/" },
              { name: "Carson Valley", courses: 4, tagline: "Sierra foothills & wide-open courses", href: "/best-golf-courses-reno/" },
              { name: "Graeagle", courses: 4, tagline: "Secluded mountain golf paradise", href: "/best-golf-courses-lake-tahoe/" },
            ].map((region) => (
              <Link key={region.name} href={region.href} className="card group p-6 text-center">
                <h3 className="text-2xl font-heading font-bold text-pine-800 mb-2 group-hover:text-gold-500 transition-colors">
                  {region.name}
                </h3>
                <p className="text-gold-500 font-semibold mb-2">{region.courses} Courses</p>
                <p className="text-charcoal-lighter text-sm">{region.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="bg-pine-800 py-16 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            One Call Plans It All
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Tell us your dates, group size, and budget. We handle the rest —
            courses, lodging, dining, transportation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-custom-golf-package/"
              className="btn-primary text-lg px-8 py-4"
            >
              Get a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${siteConfig.phone}`}
              className="btn-secondary text-lg px-8 py-4"
            >
              <Phone className="w-5 h-5" />
              {siteConfig.phoneFormatted}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
