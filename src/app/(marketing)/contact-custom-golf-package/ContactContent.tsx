"use client";

import { useEffect, useRef } from "react";
import { Clock, Shield, Users } from "lucide-react";

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
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
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
      </section>
    </main>
  );
}
