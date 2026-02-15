import { Metadata } from "next";
import FAQContent from "./FAQContent";

export const metadata: Metadata = {
  title: "FAQ | Golf the High Sierra | Group Golf Trip Questions",
  description: "Frequently asked questions about planning group golf trips with Golf the High Sierra — booking, pricing, courses, cancellations, and more.",
  alternates: { canonical: "https://golfthehighsierra.com/faq/" },
};

export default function FAQPage() {
  return <FAQContent />;
}
