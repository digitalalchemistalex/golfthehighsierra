"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone, ArrowRight } from "lucide-react";

const faqs = [
  { q: "How do I book a group golf trip?", a: "Call us at (888) 584-8232 or fill out our quote form. Share your dates, group size, and preferences — we\u2019ll build a custom package." },
  { q: "What\u2019s included in a golf package?", a: "Typically: tee times, lodging, green fees, cart fees, and optional dining reservations and transportation. Every package is customized to your group." },
  { q: "How many people do I need for a group rate?", a: "Group rates typically start at 8+ players, but we can accommodate groups of any size — from foursomes to 100+ corporate events." },
  { q: "Can I mix and match courses?", a: "Absolutely. Most groups play 2-4 different courses. We\u2019ll recommend the best combination based on your skill levels and budget." },
  { q: "When is the best time to golf in Reno/Tahoe?", a: "The season typically runs April through October. Peak season is June through September with the best weather and course conditions." },
  { q: "Do you offer corporate event planning?", a: "Yes — full corporate tournament coordination including shotgun starts, scoring, prizes, catering, and on-course branding." },
  { q: "What\u2019s your cancellation policy?", a: "We understand plans change. Our cancellation policy varies by package — contact us for specific terms or visit our cancellation policy page." },
  { q: "Do I pay one price or pay each vendor separately?", a: "One contract, one payment. We handle all vendor coordination so you never have to deal with multiple invoices." },
  { q: "Can you arrange airport transfers?", a: "Yes — we can coordinate transportation from Reno-Tahoe International Airport to your hotel and courses." },
  { q: "What courses do you recommend for beginners?", a: "Washoe County, Lakeridge, and Tahoe Donner are great for beginners. We\u2019ll match courses to your group\u2019s skill level." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-pine-200 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-cream-200 transition-colors">
        <span className="font-semibold text-pine-800 pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gold-500 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 bg-white text-pine-600 text-sm leading-relaxed">{a}</div>}
    </div>
  );
}

export default function FAQContent() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-cream-300/80">Everything you need to know about planning a golf trip with us.</p>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
        </div>
      </section>

      <section className="bg-pine-800 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-cream-300/80 mb-8">Our team is happy to help. Call us or send a message.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact-custom-golf-package/" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 px-8 rounded-lg transition-colors">
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+1-888-584-8232" className="inline-flex items-center gap-2 border-2 border-cream-300/30 text-white font-bold py-3.5 px-8 rounded-lg transition-colors hover:border-gold-400 hover:text-gold-400">
              <Phone className="w-5 h-5" /> (888) 584-8232
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
