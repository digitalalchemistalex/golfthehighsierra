import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Golf the High Sierra",
  description: "Disclaimer for Golf the High Sierra golf travel services.",
  alternates: { canonical: "https://golfthehighsierra.com/disclaimer-policy/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-28 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Disclaimer</h1>
        </div>
      </section>
      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-pine">
          
          <div className="bg-white rounded-xl p-8 shadow-sm space-y-6 text-pine-700 text-sm leading-relaxed">
            <p className="text-pine-500">Last updated: February 2026</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">General Disclaimer</h2>
            <p>The information on golfthehighsierra.com is provided for general informational purposes. While we strive to keep information accurate and up-to-date, we make no warranties about the completeness or reliability of this information.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Third-Party Services</h2>
            <p>Golf the High Sierra coordinates services with third-party golf courses, hotels, restaurants, and transportation providers. We are not responsible for the actions, services, or policies of these third parties.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Pricing</h2>
            <p>All pricing on this website is subject to change without notice. Final pricing is confirmed in your individual package agreement. Green fees, lodging rates, and other costs may vary by season and availability.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Contact</h2>
            <p>Questions? Contact us at <a href="mailto:info@golfthehighsierra.com" className="text-gold-600 hover:underline">info@golfthehighsierra.com</a> or <a href="tel:+1-888-584-8232" className="text-gold-600 hover:underline">(888) 584-8232</a>.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
