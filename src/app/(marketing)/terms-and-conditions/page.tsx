import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Golf the High Sierra",
  description: "Terms and Conditions for Golf the High Sierra golf travel services.",
  alternates: { canonical: "https://golfthehighsierra.com/terms-and-conditions/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-28 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Terms and Conditions</h1>
        </div>
      </section>
      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-pine">
          
          <div className="bg-white rounded-xl p-8 shadow-sm space-y-6 text-pine-700 text-sm leading-relaxed">
            <p className="text-pine-500">Last updated: February 2026</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Agreement to Terms</h2>
            <p>By using golfthehighsierra.com and our golf travel planning services, you agree to these terms and conditions.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Services</h2>
            <p>Golf the High Sierra provides custom golf travel packages including tee time reservations, lodging coordination, dining arrangements, and transportation logistics across the Reno, Lake Tahoe, Truckee, Graeagle, and Carson Valley regions.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Booking & Payment</h2>
            <p>All packages require a deposit to confirm. Final payment is due prior to your trip date as specified in your contract. Payment terms are outlined in your individual package agreement.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Modifications</h2>
            <p>We reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of any changes.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Contact</h2>
            <p>Questions? Contact us at <a href="mailto:info@golfthehighsierra.com" className="text-gold-600 hover:underline">info@golfthehighsierra.com</a> or <a href="tel:+1-888-584-8232" className="text-gold-600 hover:underline">(888) 584-8232</a>.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
