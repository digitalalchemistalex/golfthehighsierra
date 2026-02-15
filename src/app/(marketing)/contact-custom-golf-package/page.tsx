import { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Request A Quote | Golf the High Sierra | Custom Golf Packages",
  description: "Request a free quote for your group golf trip to Reno & Lake Tahoe. Custom packages with tee times, lodging, and dining — no obligation.",
  alternates: { canonical: "https://golfthehighsierra.com/contact-custom-golf-package/" },
};

export default function ContactPage() {
  return <ContactContent />;
}
