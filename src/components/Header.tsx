"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, ChevronDown, ChevronRight, MapPin, Star, ArrowRight, Globe, Utensils, Mountain, Calendar, Users, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/config";

/* ─── Featured cards for mega panels ─── */
const featuredCourses = [
  { name: "Edgewood Tahoe", slug: "edgewood-tahoe-golf-course", image: "https://golfthehighsierra.com/wp-content/uploads/2025/03/480305380_1022960253212508_1839293438816186105_n.jpg", tag: "Top Rated", region: "Lake Tahoe" },
  { name: "Wolf Run Golf Club", slug: "wolf-run-golf-club", image: "https://golfthehighsierra.com/wp-content/uploads/2021/09/Wolf-Run-Foto-1.jpg", tag: "Most Popular", region: "Reno" },
  { name: "Coyote Moon", slug: "coyote-moon-golf-course", image: "https://golfthehighsierra.com/wp-content/uploads/2021/09/coyote-moon2s.jpg", tag: "Scenic", region: "Truckee" },
];

const featuredHotels = [
  { name: "Peppermill Resort", slug: "peppermill-resort-spa-casino", image: "https://golfthehighsierra.com/wp-content/uploads/2021/10/peppermill-exterior.jpg", stars: 4, region: "Reno" },
  { name: "Grand Sierra Resort", slug: "grand-sierra-resort-reno", image: "https://golfthehighsierra.com/wp-content/uploads/2021/10/gsr-exterior.jpg", stars: 4, region: "Reno" },
  { name: "Hyatt Lake Tahoe", slug: "hyatt-lake-tahoe", image: "https://golfthehighsierra.com/wp-content/uploads/2021/10/hyatt-lake-tahoe.jpg", stars: 4, region: "Lake Tahoe" },
];

/* ─── Mega Menu Panel Configurations ─── */
type MegaPanel = {
  label: string;
  href: string;
  megaType: "whatwedo" | "courses" | "accommodations" | "experiences" | "packages" | "none";
};

const navItems: MegaPanel[] = [
  { label: "What We Do", href: "/about-group-golf-packages/", megaType: "whatwedo" },
  { label: "Golf Courses", href: "/best-golf-courses-reno/", megaType: "courses" },
  { label: "Accommodations", href: "/accommodations-in-reno-tahoe/", megaType: "accommodations" },
  { label: "Experiences", href: "/experiences-things-to-do-in-reno-nv/", megaType: "experiences" },
  { label: "Packages", href: "/reno-golf-packages/", megaType: "packages" },
  { label: "Blog", href: "/blog-explore-the-high-sierra/", megaType: "none" },
];

/* ─── Course Region Links ─── */
const courseRegions = [
  { label: "All 22 Courses", href: "/best-golf-courses-reno/", count: 22 },
  { label: "Reno, NV", href: "/best-golf-courses-reno/", count: 10 },
  { label: "Lake Tahoe & Truckee", href: "/best-golf-courses-lake-tahoe/", count: 7 },
  { label: "Carson Valley, NV", href: "/best-golf-courses-reno/", count: 2 },
  { label: "Graeagle / Plumas", href: "/best-golf-courses-reno/", count: 3 },
];

/* ─── Hotel Region Groups ─── */
const hotelRegions = [
  {
    label: "Reno Hotels",
    items: [
      { label: "Peppermill Resort", href: "/portfolio/peppermill-resort-spa-casino/" },
      { label: "Atlantis Casino Resort", href: "/portfolio/atlantis-casino-resort-spa-reno/" },
      { label: "Grand Sierra Resort", href: "/portfolio/grand-sierra-resort-reno/" },
      { label: "Silver Legacy", href: "/portfolio/silver-legacy-resort-casino/" },
      { label: "Eldorado / The Row", href: "/portfolio/eldorado-resorts-reno-eldorado-at-the-row/" },
      { label: "Nugget Casino", href: "/portfolio/nugget-casino-resort-reno/" },
      { label: "Circus Circus", href: "/portfolio/circus-circus-reno/" },
      { label: "J Resort", href: "/portfolio/j-resort-reno/" },
    ],
  },
  {
    label: "Lake Tahoe Hotels",
    items: [
      { label: "Harvey's Lake Tahoe", href: "/portfolio/harveys-lake-tahoe/" },
      { label: "Harrah's Lake Tahoe", href: "/portfolio/harrahs-lake-tahoe/" },
      { label: "Hyatt Lake Tahoe", href: "/portfolio/hyatt-lake-tahoe/" },
      { label: "Margaritaville", href: "/portfolio/margaritaville-lake-tahoe/" },
      { label: "Lake Tahoe Resort Hotel", href: "/portfolio/lake-tahoe-resort-hotel/" },
      { label: "Golden Nugget", href: "/portfolio/golden-nugget-lake-tahoe/" },
    ],
  },
  {
    label: "Carson & Truckee",
    items: [
      { label: "Carson Valley Inn", href: "/portfolio/carson-valley-inn-casino/" },
      { label: "Hampton Inn Truckee", href: "/portfolio/hampton-inn-truckee-ca/" },
      { label: "Old Greenwood", href: "/portfolio/old-greenwood-lodging-truckee-ca/" },
      { label: "River Pines Resort", href: "/portfolio/river-pines-resort-graeagle-ca/" },
      { label: "Plumas Pines", href: "/portfolio/plumas-pines-private-residency-graeagle/" },
    ],
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePanel(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleMouseEnter = useCallback((label: string, megaType: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (megaType !== "none") {
      setActivePanel(label);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActivePanel(null), 150);
  }, []);

  const handlePanelEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-pine-900/85 backdrop-blur-2xl shadow-2xl border-b border-white/[0.06]"
            : "bg-transparent"
        } ${activePanel ? "bg-pine-900/90 backdrop-blur-2xl" : ""}`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-[76px]">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative z-10">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={180}
                height={56}
                className="h-10 md:h-[52px] w-auto drop-shadow-lg"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  onMouseEnter={() => handleMouseEnter(item.label, item.megaType)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-1 px-3.5 py-2.5 text-[13px] font-semibold tracking-[0.02em] transition-all duration-300 rounded-lg ${
                      activePanel === item.label
                        ? "text-gold-300 bg-white/[0.06]"
                        : "text-white/85 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {item.label}
                    {item.megaType !== "none" && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 opacity-50 ${
                          activePanel === item.label ? "rotate-180 opacity-100" : ""
                        }`}
                      />
                    )}
                    {/* Active indicator bar */}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-gold-400/0 via-gold-400 to-gold-400/0 transition-all duration-300 ${
                        activePanel === item.label ? "w-8 opacity-100" : "w-0 opacity-0"
                      }`}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-3">
              <a
                href={`tel:${siteConfig.phone}`}
                className="hidden xl:flex items-center gap-2 text-white/80 hover:text-white text-[13px] font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/[0.04]"
              >
                <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                {siteConfig.phoneFormatted}
              </a>

              <Link
                href="/contact-custom-golf-package/"
                className="hidden md:inline-flex btn-primary text-[12px] px-5 py-2.5 font-bold tracking-wide"
              >
                Get a Quote
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white/90 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            MEGA MENU PANELS — Full-width, animated
        ═══════════════════════════════════════════════════ */}
        <div
          className={`absolute top-full left-0 right-0 transition-all duration-400 overflow-hidden ${
            activePanel ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-gradient-to-b from-[#0a1810] via-[#0d1f15] to-[#0a1810] border-t border-white/[0.04] shadow-2xl">
            {/* Decorative top line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />

            <div className="max-w-[1400px] mx-auto px-8 py-8">
              {/* ─── WHAT WE DO Panel ─── */}
              {activePanel === "What We Do" && (
                <div className="grid grid-cols-12 gap-8 animate-fadeUp">
                  {/* Left — Services */}
                  <div className="col-span-4">
                    <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em] mb-5">Our Services</p>
                    <div className="space-y-1">
                      {[
                        { icon: Users, label: "About Us", desc: "20+ years of group golf expertise", href: "/about-group-golf-packages/" },
                        { icon: Calendar, label: "How It Works", desc: "Simple 3-step booking process", href: "/group-golf-reno-tahoe/" },
                        { icon: Globe, label: "Corporate Events", desc: "Tailored corporate golf outings", href: "/corporate-golf-events/" },
                        { icon: Sparkles, label: "TripsCaddie App", desc: "Your trip, managed in one place", href: "/trips-caddie-app/" },
                        { icon: ArrowRight, label: "FAQ", desc: "Common questions answered", href: "/faq/" },
                      ].map((item, i) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                          style={{ animationDelay: `${i * 50}ms` }}
                          onClick={() => setActivePanel(null)}
                        >
                          <div className="w-10 h-10 rounded-xl bg-gold-400/[0.08] border border-gold-400/[0.12] flex items-center justify-center flex-shrink-0 group-hover:bg-gold-400/[0.15] group-hover:border-gold-400/[0.25] transition-all duration-300">
                            <item.icon className="w-4 h-4 text-gold-400/80" />
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors">{item.label}</p>
                            <p className="text-[12px] text-white/40 mt-0.5">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Middle — Stats */}
                  <div className="col-span-4 flex flex-col justify-center">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                      <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em]">Why Choose GTHS</p>
                      {[
                        { value: "20+", label: "Years of Experience" },
                        { value: "22", label: "Championship Courses" },
                        { value: "21", label: "Partner Hotels & Resorts" },
                        { value: "4-400", label: "Group Size Range" },
                      ].map((stat) => (
                        <div key={stat.label} className="flex items-baseline gap-3">
                          <span className="text-[28px] font-light text-gold-400 font-serif leading-none">{stat.value}</span>
                          <span className="text-[12px] text-white/50">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — CTA Card */}
                  <div className="col-span-4">
                    <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px] group">
                      <Image
                        src="https://golfthehighsierra.com/wp-content/uploads/2025/03/480305380_1022960253212508_1839293438816186105_n.jpg"
                        alt="Golf the High Sierra"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em] mb-2">Start Planning</p>
                        <h3 className="text-white text-xl font-serif mb-3">Build Your Dream Golf Trip</h3>
                        <Link
                          href="/contact-custom-golf-package/"
                          className="inline-flex items-center gap-2 btn-primary text-[11px] px-5 py-2.5"
                          onClick={() => setActivePanel(null)}
                        >
                          Get a Free Quote
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── GOLF COURSES Panel ─── */}
              {activePanel === "Golf Courses" && (
                <div className="grid grid-cols-12 gap-8 animate-fadeUp">
                  {/* Left — Browse by Region */}
                  <div className="col-span-3">
                    <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em] mb-5">Browse by Region</p>
                    <div className="space-y-1">
                      {courseRegions.map((region, i) => (
                        <Link
                          key={region.href + i}
                          href={region.href}
                          className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                          onClick={() => setActivePanel(null)}
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-3.5 h-3.5 text-gold-400/60" />
                            <span className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors">{region.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">{region.count}</span>
                            <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/[0.06]">
                      <Link
                        href="/best-golf-courses-reno/"
                        className="inline-flex items-center gap-2 text-[12px] font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                        onClick={() => setActivePanel(null)}
                      >
                        View All Courses
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right — Featured Course Cards */}
                  <div className="col-span-9">
                    <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em] mb-5">Featured Courses</p>
                    <div className="grid grid-cols-3 gap-4">
                      {featuredCourses.map((course, i) => (
                        <Link
                          key={course.slug}
                          href={`/portfolio/${course.slug}/`}
                          className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
                          style={{ animationDelay: `${i * 80}ms` }}
                          onClick={() => setActivePanel(null)}
                        >
                          <Image
                            src={course.image}
                            alt={course.name}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
                          {/* Tag */}
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-400/90 text-pine-900 text-[10px] font-bold uppercase tracking-wider">
                              <Star className="w-2.5 h-2.5" />
                              {course.tag}
                            </span>
                          </div>
                          {/* Info */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <MapPin className="w-3 h-3 text-gold-400/80" />
                              <span className="text-[10px] text-white/60 uppercase tracking-wider">{course.region}</span>
                            </div>
                            <h4 className="text-white font-semibold text-[15px] group-hover:text-gold-300 transition-colors">{course.name}</h4>
                            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              <span className="text-[11px] text-gold-400 font-semibold">Explore Course</span>
                              <ArrowRight className="w-3 h-3 text-gold-400" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── ACCOMMODATIONS Panel ─── */}
              {activePanel === "Accommodations" && (
                <div className="grid grid-cols-12 gap-8 animate-fadeUp">
                  {/* Left columns — Hotel Regions */}
                  <div className="col-span-8">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em]">21 Partner Hotels & Resorts</p>
                      <div className="flex gap-3">
                        <Link href="/accommodations-in-reno-tahoe/" className="text-[11px] text-white/50 hover:text-gold-400 transition-colors" onClick={() => setActivePanel(null)}>All Lodging</Link>
                        <Link href="/group-golf-lodging-packages/" className="text-[11px] text-white/50 hover:text-gold-400 transition-colors" onClick={() => setActivePanel(null)}>Lodging Packages</Link>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {hotelRegions.map((region) => (
                        <div key={region.label}>
                          <p className="text-[11px] font-bold text-white/60 uppercase tracking-[0.15em] mb-3 pb-2 border-b border-white/[0.06]">
                            {region.label}
                          </p>
                          <div className="space-y-0.5">
                            {region.items.map((hotel) => (
                              <Link
                                key={hotel.href}
                                href={hotel.href}
                                className="group block py-1.5 text-[13px] text-white/60 hover:text-white transition-all duration-200 hover:translate-x-1"
                                onClick={() => setActivePanel(null)}
                              >
                                <span className="group-hover:text-gold-400 transition-colors">{hotel.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — Featured Hotels */}
                  <div className="col-span-4">
                    <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em] mb-5">Featured</p>
                    <div className="space-y-3">
                      {featuredHotels.map((hotel, i) => (
                        <Link
                          key={hotel.slug}
                          href={`/portfolio/${hotel.slug}/`}
                          className="group flex gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                          style={{ animationDelay: `${i * 60}ms` }}
                          onClick={() => setActivePanel(null)}
                        >
                          <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={hotel.image}
                              alt={hotel.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white/90 group-hover:text-gold-400 transition-colors truncate">{hotel.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {Array.from({ length: hotel.stars }).map((_, si) => (
                                  <Star key={si} className="w-2.5 h-2.5 text-gold-400 fill-gold-400" />
                                ))}
                              </div>
                              <span className="text-[10px] text-white/40">{hotel.region}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-gold-400 self-center transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── EXPERIENCES Panel ─── */}
              {activePanel === "Experiences" && (
                <div className="grid grid-cols-12 gap-8 animate-fadeUp">
                  <div className="col-span-5">
                    <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em] mb-5">Beyond the Course</p>
                    <div className="space-y-1">
                      {[
                        { icon: Mountain, label: "Things To Do", desc: "Activities, nightlife, casinos & adventures", href: "/experiences-things-to-do-in-reno-nv/" },
                        { icon: Utensils, label: "Best Restaurants", desc: "Fine dining & group-friendly spots in Reno", href: "/best-restaurants-reno-nv/" },
                        { icon: MapPin, label: "Locations Map", desc: "Interactive map of courses, hotels & attractions", href: "/locations-map/" },
                      ].map((item, i) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                          onClick={() => setActivePanel(null)}
                        >
                          <div className="w-12 h-12 rounded-xl bg-gold-400/[0.06] border border-gold-400/[0.1] flex items-center justify-center flex-shrink-0 group-hover:bg-gold-400/[0.12] group-hover:border-gold-400/[0.2] transition-all duration-300">
                            <item.icon className="w-5 h-5 text-gold-400/70" />
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors">{item.label}</p>
                            <p className="text-[12px] text-white/40 mt-0.5">{item.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-gold-400 ml-auto self-center group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* Right — Promo Card */}
                  <div className="col-span-7">
                    <div className="relative rounded-2xl overflow-hidden h-full min-h-[220px] group">
                      <Image
                        src="https://golfthehighsierra.com/wp-content/uploads/2021/09/coyote-moon2s.jpg"
                        alt="Reno Tahoe Experiences"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-8 max-w-sm">
                        <span className="inline-block px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/30 text-gold-400 text-[10px] font-bold uppercase tracking-widest mb-3">Explore</span>
                        <h3 className="text-white text-2xl font-serif mb-2">More Than Just Golf</h3>
                        <p className="text-white/60 text-[13px] mb-4">Casinos, fine dining, lake activities, ski resorts, and mountain adventures — all within reach.</p>
                        <Link
                          href="/experiences-things-to-do-in-reno-nv/"
                          className="inline-flex items-center gap-2 text-gold-400 text-[12px] font-bold hover:text-gold-300 transition-colors"
                          onClick={() => setActivePanel(null)}
                        >
                          Discover Experiences <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── PACKAGES Panel ─── */}
              {activePanel === "Packages" && (
                <div className="grid grid-cols-12 gap-8 animate-fadeUp">
                  <div className="col-span-6">
                    <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em] mb-5">Stay & Play Packages</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Reno Golf Packages", desc: "Courses + casino resort lodging", href: "/reno-golf-packages/", icon: "🏌️" },
                        { label: "Lake Tahoe Packages", desc: "Lakeside courses + mountain stays", href: "/lake-tahoe-golf-packages/", icon: "🏔️" },
                        { label: "Group Packages", desc: "4-400 players, fully coordinated", href: "/group-golf-reno-tahoe/", icon: "👥" },
                        { label: "Corporate Events", desc: "Team building & tournament planning", href: "/corporate-golf-events/", icon: "🏢" },
                      ].map((pkg) => (
                        <Link
                          key={pkg.href}
                          href={pkg.href}
                          className="group p-4 rounded-xl border border-white/[0.06] hover:border-gold-400/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                          onClick={() => setActivePanel(null)}
                        >
                          <span className="text-2xl mb-2 block">{pkg.icon}</span>
                          <p className="text-[14px] font-semibold text-white/90 group-hover:text-gold-400 transition-colors">{pkg.label}</p>
                          <p className="text-[11px] text-white/40 mt-1">{pkg.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* Right — CTA */}
                  <div className="col-span-6 flex items-center justify-center">
                    <div className="text-center max-w-sm">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/[0.08] border border-gold-400/[0.15] mb-5">
                        <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                        <span className="text-[11px] font-semibold text-gold-400 tracking-wide">Response within 24 hours</span>
                      </div>
                      <h3 className="text-white text-2xl font-serif mb-3">Ready to Build<br />Your Package?</h3>
                      <p className="text-white/50 text-[13px] mb-6">Tell us your dates, group size, and budget. We handle the rest.</p>
                      <Link
                        href="/contact-custom-golf-package/"
                        className="inline-flex items-center gap-2 btn-primary px-8 py-3 text-[12px]"
                        onClick={() => setActivePanel(null)}
                      >
                        Get a Free Quote
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative bottom line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          </div>
        </div>
      </header>

      {/* ═══ Mobile Menu — Full Screen Overlay ═══ */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-pine-900/98 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />

        {/* Content */}
        <div className="relative h-full overflow-y-auto">
          {/* Mobile Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-pine-900/90 backdrop-blur-xl border-b border-white/[0.06]">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image src={siteConfig.logo} alt={siteConfig.name} width={140} height={44} className="h-9 w-auto" />
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Nav Items */}
          <div className="px-5 py-6 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.megaType === "none" ? (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 text-white/90 text-[15px] font-semibold rounded-xl hover:bg-white/[0.04] transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setMobileAccordion(mobileAccordion === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-white/90 text-[15px] font-semibold rounded-xl hover:bg-white/[0.04] transition-colors"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${mobileAccordion === item.label ? "rotate-180" : ""}`} />
                    </button>

                    {/* Mobile Accordion Content */}
                    <div className={`overflow-hidden transition-all duration-400 ${mobileAccordion === item.label ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="pl-4 pr-2 py-2 space-y-0.5">
                        {item.megaType === "courses" && courseRegions.map((region) => (
                          <Link key={region.label} href={region.href} onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-white/60 text-[13px] rounded-lg hover:bg-white/[0.04] hover:text-white transition-all">
                            <span>{region.label}</span>
                            <span className="text-[11px] text-white/30">{region.count}</span>
                          </Link>
                        ))}
                        {item.megaType === "accommodations" && hotelRegions.map((region) => (
                          <div key={region.label}>
                            <p className="px-4 py-2 text-[11px] font-bold text-gold-400/70 uppercase tracking-wider">{region.label}</p>
                            {region.items.map((hotel) => (
                              <Link key={hotel.href} href={hotel.href} onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2 text-white/60 text-[13px] rounded-lg hover:bg-white/[0.04] hover:text-white transition-all">
                                {hotel.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                        {item.megaType === "whatwedo" && [
                          { label: "About Us", href: "/about-group-golf-packages/" },
                          { label: "How It Works", href: "/group-golf-reno-tahoe/" },
                          { label: "Corporate Events", href: "/corporate-golf-events/" },
                          { label: "TripsCaddie App", href: "/trips-caddie-app/" },
                          { label: "FAQ", href: "/faq/" },
                        ].map((link) => (
                          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 text-white/60 text-[13px] rounded-lg hover:bg-white/[0.04] hover:text-white transition-all">
                            {link.label}
                          </Link>
                        ))}
                        {item.megaType === "experiences" && [
                          { label: "Things To Do", href: "/experiences-things-to-do-in-reno-nv/" },
                          { label: "Best Restaurants", href: "/best-restaurants-reno-nv/" },
                          { label: "Locations Map", href: "/locations-map/" },
                        ].map((link) => (
                          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 text-white/60 text-[13px] rounded-lg hover:bg-white/[0.04] hover:text-white transition-all">
                            {link.label}
                          </Link>
                        ))}
                        {item.megaType === "packages" && [
                          { label: "Reno Golf Packages", href: "/reno-golf-packages/" },
                          { label: "Lake Tahoe Packages", href: "/lake-tahoe-golf-packages/" },
                          { label: "Group Packages", href: "/group-golf-reno-tahoe/" },
                          { label: "Corporate Events", href: "/corporate-golf-events/" },
                        ].map((link) => (
                          <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2.5 text-white/60 text-[13px] rounded-lg hover:bg-white/[0.04] hover:text-white transition-all">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Footer */}
          <div className="px-5 pb-8 space-y-4 border-t border-white/[0.06] pt-6 mt-2">
            <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 px-4 py-3 text-white/80 font-medium rounded-xl bg-white/[0.04]">
              <Phone className="w-5 h-5 text-gold-400" />
              {siteConfig.phoneFormatted}
            </a>
            <Link
              href="/contact-custom-golf-package/"
              onClick={() => setMobileOpen(false)}
              className="block text-center btn-primary py-3.5 text-[13px] font-bold"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ Backdrop overlay when mega menu is open ═══ */}
      {activePanel && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] hidden lg:block"
          onClick={() => setActivePanel(null)}
        />
      )}

      {/* Global animation styles */}
      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}
