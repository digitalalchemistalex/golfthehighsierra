"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", groupSize: "", dates: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would POST to an API endpoint
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-32 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Request A Quote</h1>
          <p className="text-lg text-cream-300/80">Tell us about your trip and we\u2019ll build a custom golf package — no obligation.</p>
        </div>
      </section>

      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <CheckCircle2 className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                <h2 className="text-2xl font-heading font-bold text-pine-800 mb-2">Thank You!</h2>
                <p className="text-pine-600">We\u2019ve received your request and will be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-heading font-bold text-pine-800 mb-2">Tell Us About Your Trip</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-pine-700 mb-1">Full Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-pine-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none" placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pine-700 mb-1">Email *</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-pine-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none" placeholder="john@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pine-700 mb-1">Phone</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border border-pine-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none" placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pine-700 mb-1">Group Size</label>
                    <input type="text" value={formData.groupSize} onChange={e => setFormData({...formData, groupSize: e.target.value})} className="w-full px-4 py-3 border border-pine-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none" placeholder="e.g. 8 golfers" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-pine-700 mb-1">Preferred Dates</label>
                  <input type="text" value={formData.dates} onChange={e => setFormData({...formData, dates: e.target.value})} className="w-full px-4 py-3 border border-pine-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none" placeholder="e.g. June 15-18, 2026 (flexible)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pine-700 mb-1">Tell Us About Your Trip</label>
                  <textarea rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 border border-pine-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none resize-none" placeholder="Courses you\u2019re interested in, budget range, special requests..." />
                </div>
                <button type="submit" className="w-full bg-gold-500 hover:bg-gold-400 text-pine-900 font-bold py-3.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" /> Send Quote Request
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-bold text-pine-800 mb-4">Contact Info</h3>
              <div className="space-y-4">
                <a href="tel:+1-888-584-8232" className="flex items-center gap-3 text-pine-700 hover:text-gold-600 transition-colors">
                  <Phone className="w-5 h-5 text-gold-500" /> <span className="font-semibold">(888) 584-8232</span>
                </a>
                <a href="mailto:info@golfthehighsierra.com" className="flex items-center gap-3 text-pine-700 hover:text-gold-600 transition-colors">
                  <Mail className="w-5 h-5 text-gold-500" /> <span>info@golfthehighsierra.com</span>
                </a>
                <div className="flex items-center gap-3 text-pine-500">
                  <MapPin className="w-5 h-5 text-gold-500" /> <span>Reno, Nevada</span>
                </div>
              </div>
            </div>
            <div className="bg-gold-50 border border-gold-200 rounded-xl p-6">
              <h3 className="font-heading font-bold text-pine-800 mb-3">What Happens Next?</h3>
              <ol className="space-y-3 text-sm text-pine-700">
                <li className="flex items-start gap-2"><span className="bg-gold-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>We review your request within 24 hours</li>
                <li className="flex items-start gap-2"><span className="bg-gold-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>We build a custom proposal with pricing</li>
                <li className="flex items-start gap-2"><span className="bg-gold-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>You review, tweak, and confirm</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
