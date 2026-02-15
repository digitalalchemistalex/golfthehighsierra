import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Golf the High Sierra",
  description: "Privacy Policy for Golf the High Sierra golf travel services.",
  alternates: { canonical: "https://golfthehighsierra.com/privacy-policy/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-28 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Privacy Policy</h1>
        </div>
      </section>
      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-pine">
          
          <div className="bg-white rounded-xl p-8 shadow-sm space-y-6 text-pine-700 text-sm leading-relaxed">
            <p className="text-pine-500">Last updated: February 2026</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Information We Collect</h2>
            <p>Golf the High Sierra collects information you provide when requesting a quote, contacting us, or booking a golf package. This may include your name, email address, phone number, group size, and travel preferences.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">How We Use Your Information</h2>
            <p>We use your information to build custom golf packages, communicate about your trip, and improve our services. We do not sell or share your personal information with third parties for marketing purposes.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Cookies</h2>
            <p>Our website uses cookies to improve your browsing experience and analyze site traffic. You can disable cookies in your browser settings.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Contact Us</h2>
            <p>Questions about our privacy practices? Contact us at <a href="mailto:info@golfthehighsierra.com" className="text-gold-600 hover:underline">info@golfthehighsierra.com</a> or call <a href="tel:+1-888-584-8232" className="text-gold-600 hover:underline">(888) 584-8232</a>.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
