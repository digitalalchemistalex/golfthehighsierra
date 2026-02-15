"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/config";

const navItems = [
  {
    label: "What We Do",
    href: "/about-group-golf-packages/",
    children: [
      { label: "About Us", href: "/about-group-golf-packages/" },
      { label: "How It Works", href: "/group-golf-reno-tahoe/" },
      { label: "Corporate Events", href: "/corporate-golf-events/" },
      { label: "TripsCaddie App", href: "/trips-caddie-app/" },
      { label: "FAQ", href: "/faq/" },
    ],
  },
  {
    label: "Golf Courses",
    href: "/best-golf-courses-reno/",
    children: [
      { label: "All Courses", href: "/best-golf-courses-reno/" },
      { label: "Lake Tahoe Courses", href: "/best-golf-courses-lake-tahoe/" },
      { label: "Reno Courses", href: "/best-golf-courses-reno/" },
    ],
  },
  {
    label: "Accommodations",
    href: "/accommodations-in-reno-tahoe/",
    children: [
      { label: "All Lodging", href: "/accommodations-in-reno-tahoe/" },
      { label: "Lodging Packages", href: "/group-golf-lodging-packages/" },
      {
        label: "Hotels Reno",
        href: "/accommodations-in-reno-tahoe/",
        isGroup: true,
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
        label: "Hotels Lake Tahoe",
        href: "/accommodations-in-reno-tahoe/",
        isGroup: true,
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
        label: "Carson Valley",
        href: "/accommodations-in-reno-tahoe/",
        isGroup: true,
        items: [
          { label: "Carson Valley Inn", href: "/portfolio/carson-valley-inn-casino/" },
        ],
      },
      {
        label: "Truckee / Graeagle",
        href: "/accommodations-in-reno-tahoe/",
        isGroup: true,
        items: [
          { label: "Hampton Inn Truckee", href: "/portfolio/hampton-inn-truckee-ca/" },
          { label: "Old Greenwood", href: "/portfolio/old-greenwood-lodging-truckee-ca/" },
          { label: "River Pines Resort", href: "/portfolio/river-pines-resort-graeagle-ca/" },
          { label: "Plumas Pines", href: "/portfolio/plumas-pines-private-residency-graeagle/" },
        ],
      },
    ],
  },
  {
    label: "Experiences",
    href: "/experiences-things-to-do-in-reno-nv/",
    children: [
      { label: "Things To Do", href: "/experiences-things-to-do-in-reno-nv/" },
      { label: "Restaurants", href: "/best-restaurants-reno-nv/" },
      { label: "Locations Map", href: "/locations-map/" },
    ],
  },
  {
    label: "Packages",
    href: "/reno-golf-packages/",
    children: [
      { label: "Reno Golf Packages", href: "/reno-golf-packages/" },
      { label: "Lake Tahoe Golf Packages", href: "/lake-tahoe-golf-packages/" },
      { label: "Group Packages", href: "/group-golf-reno-tahoe/" },
      { label: "Corporate Events", href: "/corporate-golf-events/" },
    ],
  },
  {
    label: "Blog",
    href: "/blog-explore-the-high-sierra/",
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-pine-800/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={160}
              height={50}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 min-w-[220px]">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                      {item.children.map((child) =>
                        "isGroup" in child && child.isGroup ? (
                          <div key={child.label} className="px-4 py-2">
                            <p className="text-xs font-bold text-pine-800 uppercase tracking-wider mb-1">
                              {child.label}
                            </p>
                            {"items" in child &&
                              child.items?.map(
                                (sub: { label: string; href: string }) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    className="block py-1 text-sm text-charcoal-light hover:text-pine-800 transition-colors"
                                  >
                                    {sub.label}
                                  </Link>
                                )
                              )}
                          </div>
                        ) : (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-charcoal hover:bg-pine-50 hover:text-pine-800 transition-colors"
                          >
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side: Phone + CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${siteConfig.phone}`}
              className="hidden md:flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              {siteConfig.phoneFormatted}
            </a>

            <Link
              href="/contact-custom-golf-package/"
              className="hidden md:inline-flex btn-primary text-sm px-4 py-2"
            >
              Get a Quote
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-pine-800/98 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </Link>
              </div>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-2 px-4 py-3 text-white font-medium"
              >
                <Phone className="w-5 h-5" />
                {siteConfig.phoneFormatted}
              </a>
              <Link
                href="/contact-custom-golf-package/"
                onClick={() => setMobileOpen(false)}
                className="block text-center btn-primary mx-4"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
