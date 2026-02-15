import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Golf the High Sierra | Reno & Lake Tahoe Golf Tips",
  description: "Golf tips, course reviews, trip guides, and insider knowledge for planning your Reno & Lake Tahoe golf trip.",
  alternates: { canonical: "https://golfthehighsierra.com/blog-explore-the-high-sierra/" },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Blog</h1>
          <p className="text-lg text-cream-300/80">Golf tips, course reviews, and insider guides for the High Sierra.</p>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen className="w-16 h-16 text-pine-300 mx-auto mb-6" />
          <h2 className="text-2xl font-heading font-bold text-pine-800 mb-4">More Content Coming Soon</h2>
          <p className="text-pine-600 mb-8">We\u2019re building out our blog with course reviews, trip planning guides, and insider tips. Check back soon.</p>
          <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
            Plan Your Trip Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
