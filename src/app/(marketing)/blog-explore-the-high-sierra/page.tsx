import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Golf the High Sierra | Reno & Lake Tahoe Golf Tips",
  description: "Golf tips, course reviews, trip planning guides, and insider knowledge for planning your Reno & Lake Tahoe golf trip with Golf the High Sierra.",
  alternates: { canonical: "https://golfthehighsierra.com/blog-explore-the-high-sierra/" },
};

const BLOG_POSTS = [
  {
    title: "The Ultimate 2026 Reno-Tahoe Golf Buddy Trip: 4 Days, 5 Courses",
    excerpt: "How to plan the perfect 4-day buddies golf trip across Reno and Lake Tahoe. We break down the best course pairings, where to stay, and how to keep everyone happy — from scratch golfers to single-digit handicappers.",
    category: "Trip Planning",
    date: "February 2026",
    readTime: "8 min",
    icon: "🏌️",
    slug: "/group-golf-reno-tahoe/",
  },
  {
    title: "Top 10 Golf Courses in the Reno-Tahoe Region for 2026",
    excerpt: "From the lakefront drama of Edgewood Tahoe to the hidden mountain gem of Nakoma Dragon, here are the 10 courses every group should have on their radar this season — with insider tips on the best tee times.",
    category: "Course Reviews",
    date: "January 2026",
    readTime: "10 min",
    icon: "⛳",
    slug: "/best-golf-courses-reno/",
  },
  {
    title: "Corporate Golf Outings in Reno: The Complete Planning Guide",
    excerpt: "From 12-person executive retreats to 200-person charity tournaments, here's everything you need to know about planning a corporate golf event in the Reno-Tahoe area — including venue options, registration logistics, and budget ranges.",
    category: "Corporate",
    date: "January 2026",
    readTime: "7 min",
    icon: "💼",
    slug: "/corporate-golf-events/",
  },
  {
    title: "Graeagle: The Sierra's Best-Kept Golf Secret",
    excerpt: "Tucked away in the Lost Sierra, Graeagle offers four stunning courses, zero crowds, and mountain scenery that rivals anything in Tahoe — at half the price. Here's why your next group trip should go north.",
    category: "Destinations",
    date: "December 2025",
    readTime: "6 min",
    icon: "🏔️",
    slug: "/lake-tahoe-golf-packages/",
  },
  {
    title: "One Contract, One Deposit: How Group Golf Booking Should Work",
    excerpt: "Stop juggling multiple hotel contracts, course deposits, and dining reservations. Learn how Golf the High Sierra simplifies group golf planning into a single contract — and why our registration portal changes everything.",
    category: "How It Works",
    date: "December 2025",
    readTime: "5 min",
    icon: "📋",
    slug: "/about-group-golf-packages/",
  },
  {
    title: "Where to Eat in Reno: A Golfer's Guide to Post-Round Dining",
    excerpt: "After 18 holes, you need a great meal. From casino steakhouses to downtown craft cocktail bars, here are the best restaurants and bars in Reno for golf groups — with options for every budget and group size.",
    category: "Dining",
    date: "November 2025",
    readTime: "6 min",
    icon: "🍽️",
    slug: "/best-restaurants-reno-nv/",
  },
  {
    title: "Father-Son Golf Trips in Reno, Lake Tahoe & Graeagle",
    excerpt: "Plan a multigenerational golf trip that works for every skill level and age. We cover the best courses for father-son groups, lodging that keeps everyone comfortable, and activities for the non-golfers in your party.",
    category: "Trip Planning",
    date: "November 2025",
    readTime: "7 min",
    icon: "👨‍👦",
    slug: "/group-golf-reno-tahoe/",
  },
  {
    title: "Reno & Tahoe Breweries: A Golfer's After-Round Guide",
    excerpt: "The Reno-Tahoe craft beer scene has exploded. Here are the best breweries and taprooms to hit after your round — from downtown Reno favorites to mountainside tasting rooms in Truckee.",
    category: "Experiences",
    date: "October 2025",
    readTime: "5 min",
    icon: "🍺",
    slug: "/experiences-things-to-do-in-reno-nv/",
  },
  {
    title: "How TripsCaddie Makes Group Golf Planning Effortless",
    excerpt: "Our proprietary trip planning tool lets you browse real itineraries from 10,000+ past trips, filter by region and budget, and request a custom quote in minutes. Here's how to use it.",
    category: "Tools",
    date: "October 2025",
    readTime: "4 min",
    icon: "📱",
    slug: "/trips-caddie-app/",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Blog</h1>
          <p className="text-lg text-cream-300/80">Golf tips, course reviews, trip planning guides, and insider knowledge for the Reno & Lake Tahoe region.</p>
        </div>
      </section>

      <section className="bg-cream-100 py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Featured Post */}
          <Link href={BLOG_POSTS[0].slug} className="block group mb-12">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-pine-100/50">
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{BLOG_POSTS[0].icon}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-500 bg-gold-500/10 px-3 py-1 rounded-full">{BLOG_POSTS[0].category}</span>
                  <span className="text-xs text-pine-400 flex items-center gap-1"><Clock className="w-3 h-3" />{BLOG_POSTS[0].readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-pine-800 mb-3 group-hover:text-gold-600 transition-colors">{BLOG_POSTS[0].title}</h2>
                <p className="text-pine-600 leading-relaxed mb-4">{BLOG_POSTS[0].excerpt}</p>
                <div className="flex items-center gap-2 text-gold-500 font-semibold text-sm">
                  Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {BLOG_POSTS.slice(1).map((post, i) => (
              <Link key={i} href={post.slug} className="block group">
                <div className="bg-white rounded-xl p-6 h-full shadow-sm hover:shadow-md transition-shadow border border-pine-100/50">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">{post.icon}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-500 bg-gold-500/10 px-3 py-1 rounded-full">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-pine-800 mb-2 group-hover:text-gold-600 transition-colors">{post.title}</h3>
                  <p className="text-sm text-pine-500 leading-relaxed mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-pine-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pine-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">Ready to Plan Your Golf Trip?</h2>
          <p className="text-cream-300/70 mb-8">20+ years planning group golf trips across Reno, Lake Tahoe, Truckee, Graeagle, and Carson Valley.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-custom-golf-package/" className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
              Get a Free Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+18885848232" className="inline-flex items-center justify-center gap-2 border-2 border-white/20 hover:border-white/40 text-white font-bold py-3.5 px-8 rounded-lg transition-colors">
              Call 888-584-8232
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
