"use client";

import { useState, useEffect } from "react";
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
  X,
  ChevronLeft,
  Camera,
  Play,
  Zap,
} from "lucide-react";

/* ─── Types ─── */
interface CourseAddress {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
}

interface CourseGeo {
  latitude?: number;
  longitude?: number;
}

interface CourseRating {
  value: number;
  count: number;
}

interface CourseFAQ {
  question: string;
  answer: string;
}

interface FeaturedHole {
  title?: string;
  description?: string;
}

interface CourseTip {
  title?: string;
  content?: string;
}

export interface CourseProps {
  slug: string;
  name: string;
  region: string;
  regionLabel: string;
  address?: CourseAddress;
  geo?: CourseGeo;
  phone?: string;
  website?: string;
  priceRange?: string;
  rating?: CourseRating;
  description: string;
  holes?: number;
  par?: number | null;
  designer?: string;
  heroImage?: string;
  images: string[];
  videoUrl?: string;
  faqs: CourseFAQ[];
  meta: { title: string; description: string };
  bodyText?: string[];
  distances?: string[];
  facilities?: string[];
  tips?: CourseTip[];
  pointOfView?: string;
  hack?: string;
  contentParagraphs?: string[];
  featuredHole?: FeaturedHole;
  teeTimeInfo?: string;
  teeTips?: string[];
}

interface RelatedCourse {
  slug: string;
  name: string;
  regionLabel: string;
  heroImage?: string;
  priceRange?: string;
  rating?: CourseRating;
}

/* ─── Helpers ─── */
function isScorecard(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.includes("scorecard") || lower.includes("score-card");
}

function isLogo(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    (lower.includes("logo") || lower.includes("golfball") || lower.includes("golf_ball")) &&
    (lower.endsWith(".png") || lower.endsWith(".webp") || lower.endsWith(".svg"))
  );
}

function parseDistancesFromBody(bodyText: string[]): string[] {
  // Try to extract distance lines like "15 Minutes from Peppermill"
  const distances: string[] = [];
  for (const block of bodyText) {
    const lines = block.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^\d+\s*(minutes?|mins?)\s/i.test(trimmed)) {
        distances.push(trimmed);
      }
    }
  }
  return distances;
}

function cleanFacilities(facilities: string[]): string[] {
  const junk = [
    "trips caddie",
    "all lake tahoe",
    "all hotels",
    "all golf",
    "all food",
    "all experiences",
    "all carson",
    "all cedar",
    "all eldorado",
    "old greenwood",
    "all atlantis",
  ];
  return facilities.filter(
    (f) => !junk.some((j) => f.toLowerCase().includes(j)) && f.trim().length > 3
  );
}

/* ─── Lightbox Component ─── */
function Lightbox({
  images,
  startIndex,
  onClose,
  courseName,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
  courseName: string;
}) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
      >
        <X className="w-8 h-8" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIdx((i) => (i - 1 + images.length) % images.length);
        }}
        className="absolute left-4 text-white/70 hover:text-white z-10 p-2"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIdx((i) => (i + 1) % images.length);
        }}
        className="absolute right-4 text-white/70 hover:text-white z-10 p-2"
      >
        <ChevronRight className="w-10 h-10" />
      </button>
      <div
        className="relative w-full max-w-5xl max-h-[85vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[idx]}
          alt={`${courseName} photo ${idx + 1}`}
          width={1200}
          height={800}
          className="object-contain w-full h-full max-h-[85vh]"
        />
        <p className="text-center text-white/50 text-sm mt-3">
          {idx + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function CoursePageContent({
  course,
  relatedCourses,
}: {
  course: CourseProps;
  relatedCourses: RelatedCourse[];
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Separate images
  const scorecardImages = course.images.filter(isScorecard);
  const logoImages = course.images.filter(isLogo);
  const galleryImages = course.images.filter((img) => !isScorecard(img) && !isLogo(img));

  // Parse distances if empty
  const distances =
    course.distances && course.distances.length > 0
      ? course.distances
      : parseDistancesFromBody(course.bodyText || []);

  // Clean facilities
  const facilities = cleanFacilities(course.facilities || []);

  // Extract hack from tips
  const hackTip = course.tips?.find(
    (t) =>
      t.title?.toLowerCase().includes("hack") &&
      t.content &&
      t.content.length > 10 &&
      !t.content.includes("{")
  );
  const hackContent = course.hack || hackTip?.content || "";

  // Clean content paragraphs
  const contentParagraphs = (course.contentParagraphs || []).filter(
    (p) => p.length > 20 && !p.includes("T: 1-888")
  );

  const teeTips = (course.teeTips || []).filter(
    (t) => t.length > 20 && !t.includes("{") && !t.includes("golfthehighsierra")
  );

  const featuredHole = course.featuredHole;
  const pointOfView = course.pointOfView || "";

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  return (
    <main className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end bg-pine-800">
        {course.heroImage && (
          <Image
            src={course.heroImage}
            alt={course.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-900/95 via-pine-900/50 to-pine-900/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-10 w-full">
          <nav className="flex items-center gap-2 text-sm text-cream-300/70 mb-4">
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/best-golf-courses-reno/"
              className="hover:text-gold-400 transition-colors"
            >
              Golf Courses
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-cream-200">{course.name}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-end gap-5">
              {/* Course Logo */}
              {logoImages.length > 0 && (
                <div className="hidden md:block w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl p-2 flex-shrink-0">
                  <Image
                    src={logoImages[0]}
                    alt={`${course.name} logo`}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
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
                    {course.address.streetAddress &&
                      `${course.address.streetAddress}, `}
                    {course.address.addressLocality},{" "}
                    {course.address.addressRegion}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {course.rating && (
                <div className="flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
                  <span className="text-white font-bold text-lg">
                    {course.rating.value}
                  </span>
                  <span className="text-cream-300/60 text-sm">
                    ({course.rating.count})
                  </span>
                </div>
              )}
              {course.priceRange && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <DollarSign className="w-5 h-5 text-gold-300" />
                  <span className="text-white font-semibold">
                    {course.priceRange}
                  </span>
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
                <span className="text-gold-400 font-bold">Par</span>{" "}
                <span>{course.par}</span>
              </div>
            )}
            {course.designer && (
              <div className="text-cream-300">
                Designed by{" "}
                <span className="text-gold-300">{course.designer}</span>
              </div>
            )}
            {course.website && (
              <a
                href={course.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cream-300 hover:text-gold-400 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Official Website</span>
              </a>
            )}
          </div>
          <a
            href="tel:1-888-584-8232"
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold text-sm transition-colors"
          >
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
                <p className="text-charcoal leading-relaxed text-lg">
                  {course.description}
                </p>
                {contentParagraphs.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {contentParagraphs.slice(0, 3).map((p, i) => (
                      <p
                        key={i}
                        className="text-charcoal-lighter leading-relaxed"
                      >
                        {p}
                      </p>
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
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-4">
                    Our Point of View
                  </p>
                  <blockquote className="text-cream-100 text-lg md:text-xl leading-relaxed italic relative z-10">
                    &ldquo;{pointOfView}&rdquo;
                  </blockquote>
                  <p className="text-gold-400/70 text-sm mt-4 font-semibold">
                    — Golf the High Sierra
                  </p>
                </div>
              )}

              {/* The Hack */}
              {hackContent && (
                <div className="bg-gold-50 border border-gold-200 rounded-2xl p-8 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gold-600">
                        The Hack
                      </p>
                      <p className="text-pine-500 text-sm">
                        Insider tip from our team
                      </p>
                    </div>
                  </div>
                  <p className="text-charcoal leading-relaxed">
                    {hackContent}
                  </p>
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
                      <p className="text-xs font-bold uppercase tracking-widest text-gold-600">
                        Signature Hole
                      </p>
                      <h3 className="text-xl font-heading font-bold text-pine-800">
                        {featuredHole.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-charcoal leading-relaxed">
                    {featuredHole.description}
                  </p>
                </div>
              )}

              {/* Insider Tips */}
              {teeTips.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <Lightbulb className="w-6 h-6 text-gold-500" />
                    <h3 className="text-xl font-heading font-bold text-pine-800">
                      Insider Tips
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {teeTips.map((tip, i) => (
                      <div
                        key={i}
                        className="bg-gold-50 border-l-4 border-gold-500 rounded-r-xl p-5"
                      >
                        <p className="text-charcoal leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {facilities.length > 0 && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-pine-800 mb-5">
                    Facilities &amp; Amenities
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {facilities.slice(0, 8).map((f, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-white rounded-xl p-4 border border-cream-400"
                      >
                        <CheckCircle2 className="w-5 h-5 text-pine-400 mt-0.5 flex-shrink-0" />
                        <span className="text-charcoal text-sm leading-relaxed">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {course.videoUrl && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Play className="w-6 h-6 text-gold-500" />
                    <h3 className="text-xl font-heading font-bold text-pine-800">
                      Course Tour
                    </h3>
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-cream-400">
                    <iframe
                      src={course.videoUrl.replace("watch?v=", "embed/")}
                      title={`${course.name} video tour`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Scorecard */}
              {scorecardImages.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Flag className="w-6 h-6 text-gold-500" />
                    <h3 className="text-xl font-heading font-bold text-pine-800">
                      Course Scorecard
                    </h3>
                    {(course.holes || course.par) && (
                      <span className="text-pine-500 text-sm">
                        {course.holes && `${course.holes} Holes`}
                        {course.holes && course.par && " | "}
                        {course.par && `Par ${course.par}`}
                      </span>
                    )}
                  </div>
                  <div
                    className="bg-white rounded-2xl border border-cream-400 p-4 cursor-pointer group"
                    onClick={() => {
                      const allImgs = [...galleryImages, ...scorecardImages];
                      const scorecardIdx = allImgs.indexOf(scorecardImages[0]);
                      openLightbox(scorecardIdx >= 0 ? scorecardIdx : 0);
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={scorecardImages[0]}
                        alt={`${course.name} scorecard`}
                        width={900}
                        height={400}
                        className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-pine-800 text-sm font-semibold px-4 py-2 rounded-lg">
                          Click to enlarge
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {galleryImages.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Camera className="w-6 h-6 text-gold-500" />
                    <h3 className="text-xl font-heading font-bold text-pine-800">
                      Photos of {course.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {galleryImages.slice(0, 6).map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden group border border-cream-400 cursor-pointer"
                        onClick={() => openLightbox(i)}
                      >
                        <Image
                          src={img}
                          alt={`${course.name} photo ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
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
                    <h3 className="text-xl font-heading font-bold text-white">
                      Distance from Key Locations
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {distances.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-cream-200 text-sm py-2 border-b border-pine-700/50 last:border-0"
                      >
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
                  <h3 className="text-xl font-heading font-bold text-pine-800 mb-5">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {course.faqs.map((faq, i) => (
                      <details
                        key={i}
                        className="faq-item group"
                        {...(i === 0 ? { open: true } : {})}
                      >
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
                <h3 className="text-xl font-heading font-bold mb-2">
                  Plan Your Trip
                </h3>
                <p className="text-cream-300/80 text-sm mb-6 leading-relaxed">
                  Custom {course.name} packages from{" "}
                  <span className="text-gold-400 font-semibold">
                    {course.priceRange || "custom pricing"}
                  </span>{" "}
                  per golfer. Lodging, tee times, carts &amp; concierge
                  planning included.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/contact-custom-golf-package/"
                    className="flex items-center justify-center gap-2 w-full bg-gold-500 text-pine-900 font-bold px-6 py-3.5 rounded-lg transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Get a Free Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="tel:1-888-584-8232"
                    className="flex items-center justify-center gap-2 w-full border-2 border-cream-300/30 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
                  >
                    <Phone className="w-4 h-4" /> (888) 584-8232
                  </a>
                </div>
                <div className="mt-5 pt-4 border-t border-cream-300/10 text-center space-y-1">
                  <p className="text-cream-300/50 text-xs">
                    Custom quotes in 24 hours
                  </p>
                  <p className="text-cream-300/50 text-xs">
                    Groups of 4–400 · 20+ years experience
                  </p>
                </div>
              </div>

              <div className="fact-card">
                <h4 className="font-heading font-bold text-pine-800 mb-1">
                  Quick Facts
                </h4>
                <div className="divider-gold mb-4" />
                <dl className="space-y-0">
                  {course.holes && (
                    <div className="fact-row">
                      <dt className="fact-label">Holes</dt>
                      <dd className="fact-value">{course.holes}</dd>
                    </div>
                  )}
                  {course.par && (
                    <div className="fact-row">
                      <dt className="fact-label">Par</dt>
                      <dd className="fact-value">{course.par}</dd>
                    </div>
                  )}
                  {course.priceRange && (
                    <div className="fact-row">
                      <dt className="fact-label">Package Price</dt>
                      <dd className="fact-value text-gold-600">
                        {course.priceRange}
                      </dd>
                    </div>
                  )}
                  <div className="fact-row">
                    <dt className="fact-label">Region</dt>
                    <dd className="fact-value">{course.regionLabel}</dd>
                  </div>
                  {course.rating && (
                    <div className="fact-row">
                      <dt className="fact-label">Rating</dt>
                      <dd className="fact-value flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />{" "}
                        {course.rating.value}/5 ({course.rating.count})
                      </dd>
                    </div>
                  )}
                  {course.designer && (
                    <div className="fact-row">
                      <dt className="fact-label">Designer</dt>
                      <dd className="fact-value">{course.designer}</dd>
                    </div>
                  )}
                  {course.phone && (
                    <div className="fact-row">
                      <dt className="fact-label">Phone</dt>
                      <dd className="fact-value">
                        <a
                          href={`tel:${course.phone}`}
                          className="text-gold-600 hover:underline"
                        >
                          {course.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RELATED COURSES ===== */}
      {relatedCourses.length > 0 && (
        <section className="bg-pine-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
              More {course.regionLabel} Courses
            </h2>
            <div className="divider-gold mb-8" />
            <div className="grid md:grid-cols-3 gap-6">
              {relatedCourses.map((r) => (
                <Link
                  key={r.slug}
                  href={`/portfolio/${r.slug}/`}
                  className="group rounded-xl overflow-hidden bg-pine-700/50 border border-pine-600/30 hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  {r.heroImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={r.heroImage}
                        alt={r.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-pine-900/60 to-transparent" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-white group-hover:text-gold-400 transition-colors text-lg">
                      {r.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-cream-300/60 text-sm">
                        {r.regionLabel}
                      </span>
                      {r.priceRange && (
                        <span className="text-gold-400/80 text-sm font-semibold">
                          {r.priceRange}
                        </span>
                      )}
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
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Play {course.name}?
          </h2>
          <p className="text-xl text-cream-300/80 mb-8 leading-relaxed">
            Tell us your dates, group size, and budget. We&apos;ll build a
            custom package with {course.name} and handle every detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-custom-golf-package/"
              className="inline-flex items-center justify-center gap-2 bg-gold-500 text-pine-900 font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:-translate-y-0.5"
            >
              Get a Free Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:1-888-584-8232"
              className="inline-flex items-center justify-center gap-2 border-2 border-cream-300/30 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <Phone className="w-5 h-5" /> (888) 584-8232
            </a>
          </div>
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {lightboxOpen && (
        <Lightbox
          images={[...galleryImages, ...scorecardImages]}
          startIndex={lightboxIdx}
          onClose={() => setLightboxOpen(false)}
          courseName={course.name}
        />
      )}
    </main>
  );
}
