"use client";

import { useEffect, useRef } from "react";
import { Phone, Mail, MapPin, CheckCircle2, Clock, Shield, Users } from "lucide-react";

export default function ContactContent() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // === Auto-resize listener ===
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "gths-resize" && e.data.height > 100) {
        const iframe = iframeRef.current;
        if (iframe) {
          iframe.style.height = e.data.height + "px";
        }
      }
    };
    window.addEventListener("message", handleMessage);

    // === WordPress Intelligence Bridge ===
    // Reads browsing history from sessionStorage (set by course/hotel pages)
    // and passes it as URL params to the iframe so the form pre-selects
    // courses/hotels the visitor was already looking at
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("gths_quote_selections") || "{}"
      );
      const iframe = iframeRef.current;
      if (
        iframe &&
        ((saved.courses && saved.courses.length) || saved.hotel)
      ) {
        const u = new URL(iframe.src);
        if (saved.regions && saved.regions.length)
          u.searchParams.set("regions", saved.regions.join(","));
        if (saved.courses && saved.courses.length)
          u.searchParams.set("courses", saved.courses.join(","));
        if (saved.hotel) u.searchParams.set("hotel", saved.hotel);
        iframe.src = u.toString();
      }
    } catch {
      // sessionStorage may not be available
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <main className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative bg-pine-800 pt-28 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            Free Quote — No Obligation
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Build Your Golf Package
          </h1>
          <p className="text-lg text-cream-300/80 max-w-2xl mx-auto">
            Tell us about your group and we&apos;ll build a custom stay &amp;
            play package — courses, lodging, dining, transportation — all in
            one proposal.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-cream-300/80">
              <Clock className="w-4 h-4 text-gold-400" />
              Response within 24 hours
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-cream-300/80">
              <Shield className="w-4 h-4 text-gold-400" />
              No obligation
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-cream-300/80">
              <Users className="w-4 h-4 text-gold-400" />
              Groups of 4 to 400
            </div>
          </div>
        </div>
      </section>

      {/* ===== FORM SECTION ===== */}
      <section className="bg-cream-200">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Form (iframe) — takes 3/4 width on desktop */}
            <div className="lg:col-span-3">
              <iframe
                ref={iframeRef}
                src="https://mesquitestgeorgegolftours.com/embed/gths"
                style={{
                  width: "100%",
                  border: "none",
                  overflow: "hidden",
                  minHeight: "3000px",
                }}
                scrolling="no"
                frameBorder="0"
                id="gthsForm"
                title="Golf the High Sierra Quote Request Form"
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-pine-800 mb-4">
                    Prefer to Talk?
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="tel:+1-888-584-8232"
                      className="flex items-center gap-3 text-pine-700 hover:text-gold-600 transition-colors"
                    >
                      <Phone className="w-5 h-5 text-gold-500" />
                      <div>
                        <span className="font-semibold block">
                          (888) 584-8232
                        </span>
                        <span className="text-xs text-pine-400">
                          Mon-Fri 8am-5pm PT
                        </span>
                      </div>
                    </a>
                    <a
                      href="mailto:info@golfthehighsierra.com"
                      className="flex items-center gap-3 text-pine-700 hover:text-gold-600 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-gold-500" />
                      <span className="text-sm">
                        info@golfthehighsierra.com
                      </span>
                    </a>
                    <div className="flex items-center gap-3 text-pine-500">
                      <MapPin className="w-5 h-5 text-gold-500" />
                      <span className="text-sm">Reno, Nevada</span>
                    </div>
                  </div>
                </div>

                {/* What Happens Next */}
                <div className="bg-gold-50 border border-gold-200 rounded-xl p-6">
                  <h3 className="font-heading font-bold text-pine-800 mb-3">
                    What Happens Next?
                  </h3>
                  <ol className="space-y-4 text-sm text-pine-700">
                    <li className="flex items-start gap-3">
                      <span className="bg-gold-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <span className="font-semibold block text-pine-800">
                          We Review Your Request
                        </span>
                        Within 24 hours our team reviews your trip details.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-gold-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <span className="font-semibold block text-pine-800">
                          Custom Proposal
                        </span>
                        We build a detailed package with pricing — courses,
                        hotels, dining, transport.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-gold-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <span className="font-semibold block text-pine-800">
                          Tweak &amp; Confirm
                        </span>
                        One contract, one payment. Adjust anything until
                        it&apos;s perfect.
                      </div>
                    </li>
                  </ol>
                </div>

                {/* Trust / Why Us */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-pine-800 mb-3">
                    Why Book With Us
                  </h3>
                  <ul className="space-y-2.5 text-sm text-pine-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>20+ years planning group golf trips</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>22+ courses across 5 regions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>One contract — tee times, lodging, dining</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Group discounts up to 30%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>Concierge service from booking to tee time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span>4.8/5 rating across 672 reviews</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
