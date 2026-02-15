import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/config";

const footerLinks = {
  "Golf Courses": [
    { label: "All Courses", href: "/best-golf-courses-reno/" },
    { label: "Lake Tahoe Courses", href: "/best-golf-courses-lake-tahoe/" },
    { label: "Edgewood Tahoe", href: "/portfolio/edgewood-tahoe-golf-course/" },
    { label: "Wolf Run Golf Club", href: "/portfolio/wolf-run-golf-club/" },
    { label: "LakeRidge Golf Course", href: "/portfolio/lakeridge-golf-course/" },
  ],
  Lodging: [
    { label: "All Accommodations", href: "/accommodations-in-reno-tahoe/" },
    { label: "Peppermill Resort", href: "/portfolio/peppermill-resort-spa-casino/" },
    { label: "Grand Sierra Resort", href: "/portfolio/grand-sierra-resort-reno/" },
    { label: "Harvey's Lake Tahoe", href: "/portfolio/harveys-lake-tahoe/" },
    { label: "Lodging Packages", href: "/group-golf-lodging-packages/" },
  ],
  Packages: [
    { label: "Reno Golf Packages", href: "/reno-golf-packages/" },
    { label: "Lake Tahoe Packages", href: "/lake-tahoe-golf-packages/" },
    { label: "Group Golf", href: "/group-golf-reno-tahoe/" },
    { label: "Corporate Events", href: "/corporate-golf-events/" },
    { label: "Get a Quote", href: "/contact-custom-golf-package/" },
  ],
  Company: [
    { label: "About Us", href: "/about-group-golf-packages/" },
    { label: "Blog", href: "/blog-explore-the-high-sierra/" },
    { label: "TripsCaddie App", href: "/trips-caddie-app/" },
    { label: "FAQ", href: "/faq/" },
    { label: "Locations Map", href: "/locations-map/" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-pine-900 text-white">
      {/* CTA Strip */}
      <div className="bg-gold-500 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-heading font-bold text-white">
              Ready to Plan Your Golf Trip?
            </h3>
            <p className="text-white/90">
              20+ years of expert golf trip planning in Reno & Lake Tahoe.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 bg-white text-gold-600 font-bold px-6 py-3 rounded-lg hover:bg-cream-200 transition-colors"
            >
              <Phone className="w-5 h-5" />
              {siteConfig.phoneFormatted}
            </a>
            <Link
              href="/contact-custom-golf-package/"
              className="inline-flex items-center gap-2 bg-pine-800 text-white font-bold px-6 py-3 rounded-lg hover:bg-pine-700 transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={140}
              height={44}
              className="h-10 w-auto mb-4"
            />
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              The premier golf trip planner for Reno, Lake Tahoe, Carson Valley
              & Graeagle since 2004.
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                {siteConfig.phoneFormatted}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                {siteConfig.email}
              </a>
              <p className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4" />
                Reno, NV
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-gold-400 text-sm uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy/"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions/"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cancellation-policy/"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Cancellation
            </Link>
            <Link
              href="/disclaimer-policy/"
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
