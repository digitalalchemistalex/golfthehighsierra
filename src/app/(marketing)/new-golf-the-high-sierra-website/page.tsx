import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "New Golf The High Sierra Website | Faster, Modern, Mobile-First",
  description:
    "Introducing the all-new Golf The High Sierra website — rebuilt from the ground up with modern technology for faster browsing, better mobile experience, and stunning visuals.",
  alternates: {
    canonical: "https://golfthehighsierra.com/new-golf-the-high-sierra-website/",
  },
};

export default function NewWebsiteBlogPost() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#1E3A2F] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#C9A24D] text-sm tracking-widest uppercase mb-3">
            News & Updates
          </p>
          <h1
            className="text-4xl md:text-5xl font-light mb-4 leading-tight"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Introducing the New Golf The High Sierra Website
          </h1>
          <p
            className="text-white/70 text-sm"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            February 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div
          className="prose prose-lg max-w-none text-[#333]"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          <p className="text-xl text-[#555] leading-relaxed">
            We&apos;re thrilled to unveil the completely redesigned Golf The
            High Sierra website — rebuilt from scratch with cutting-edge
            technology to deliver a faster, more beautiful, and mobile-first
            experience for planning your group golf trips across Reno, Lake
            Tahoe, and the High Sierra.
          </p>

          <h2
            className="text-2xl mt-12 mb-4 text-[#1E3A2F]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            What&apos;s New
          </h2>
          <p>
            Every page has been redesigned with a focus on speed and visual
            impact. Our new course pages feature immersive hero sections with
            zoom animations, detailed course data including par, slope, rating,
            and signature holes, plus stunning photo galleries.
          </p>
          <p>
            Hotel pages now showcase room types, dining options, and amenities
            in a clean, luxury layout. And for the first time, individual room
            types, restaurants, and bars at partner properties like the
            Eldorado and Atlantis each have their own dedicated pages.
          </p>

          <h2
            className="text-2xl mt-12 mb-4 text-[#1E3A2F]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Built for Speed
          </h2>
          <p>
            The new site is built on Next.js and hosted on Vercel&apos;s global
            edge network, delivering pages in milliseconds instead of seconds.
            Images are automatically optimized and served in modern formats.
            The homepage alone is 97% smaller than before.
          </p>

          <h2
            className="text-2xl mt-12 mb-4 text-[#1E3A2F]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Mobile-First Design
          </h2>
          <p>
            Every page is designed mobile-first, with touch-friendly
            navigation, responsive galleries, and optimized layouts for phones
            and tablets. Whether you&apos;re planning at your desk or browsing
            from the golf cart, the experience is seamless.
          </p>

          <h2
            className="text-2xl mt-12 mb-4 text-[#1E3A2F]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            140+ Pages of Content
          </h2>
          <p>
            With over 140 pages covering 26 golf courses, 23 hotels, 65+
            venues and experiences, plus detailed room types and dining guides,
            you&apos;ll find everything you need to plan the perfect group golf
            trip across the High Sierra region.
          </p>

          <h2
            className="text-2xl mt-12 mb-4 text-[#1E3A2F]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Ready to Plan Your Trip?
          </h2>
          <p>
            Explore the new site and start planning your next group golf
            adventure. Our concierge team is ready to help with custom packages
            covering tee times, lodging, dining, and transportation.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 flex gap-4 flex-wrap">
          <Link
            href="/contact-custom-golf-package/"
            className="inline-block bg-[#C9A24D] hover:bg-[#B08C3A] text-white px-8 py-3 rounded-full text-sm font-medium transition-colors"
          >
            Request a Free Quote
          </Link>
          <Link
            href="/group-golf-reno-tahoe/"
            className="inline-block border border-[#1E3A2F] text-[#1E3A2F] hover:bg-[#1E3A2F] hover:text-white px-8 py-3 rounded-full text-sm font-medium transition-colors"
          >
            Explore Destinations
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-16 pt-8 border-t border-[#E8E4DE]">
          <Link
            href="/blog-explore-the-high-sierra/"
            className="text-[#C9A24D] hover:underline text-sm"
          >
            ← Back to News
          </Link>
        </div>
      </article>
    </main>
  );
}
