import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy | Golf the High Sierra",
  description: "Cancellation Policy for Golf the High Sierra golf travel services.",
  alternates: { canonical: "https://golfthehighsierra.com/cancellation-policy/" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-pine-800 py-28 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-pine-900/90 to-pine-800" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Cancellation Policy</h1>
        </div>
      </section>
      <section className="bg-cream-200 py-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-pine">
          
          <div className="bg-white rounded-xl p-8 shadow-sm space-y-6 text-pine-700 text-sm leading-relaxed">
            <p className="text-pine-500">Last updated: February 2026</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Cancellation Terms</h2>
            <p>We understand that plans can change. Our cancellation policy is designed to be fair while respecting the commitments made to our course and hotel partners.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">General Guidelines</h2>
            <p>Cancellation terms vary by package and are outlined in your individual booking agreement. In general:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cancellations made 60+ days before arrival: Full refund minus administrative fee</li>
              <li>Cancellations 30-59 days before arrival: 50% refund</li>
              <li>Cancellations less than 30 days before arrival: No refund</li>
            </ul>
            <p>Specific terms may vary based on hotel and course policies. Your booking confirmation will include exact cancellation details.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Weather & Force Majeure</h2>
            <p>In cases of extreme weather or events beyond our control, we will work with you to reschedule or provide credit for future bookings.</p>
            <h2 className="text-xl font-heading font-bold text-pine-800">Contact</h2>
            <p>To cancel or modify a booking, contact us at <a href="tel:+1-888-584-8232" className="text-gold-600 hover:underline">(888) 584-8232</a> or <a href="mailto:info@golfthehighsierra.com" className="text-gold-600 hover:underline">info@golfthehighsierra.com</a>.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
