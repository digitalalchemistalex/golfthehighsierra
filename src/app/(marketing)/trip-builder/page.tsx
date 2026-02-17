import { Metadata } from "next";
import TripBuilderContent from "@/components/TripBuilderContent";

export const metadata: Metadata = {
  title: "Trip Builder — Browse Real Golf Trips | Golf the High Sierra",
  description:
    "Explore 73+ real golf trip packages we've organized across Reno, Tahoe, Truckee, Graeagle, and beyond. Filter by destination, vibe, and budget. Request your custom quote.",
  alternates: {
    canonical: "https://golfthehighsierra.com/trip-builder/",
  },
  openGraph: {
    title: "Trip Builder — Browse Real Golf Trips | Golf the High Sierra",
    description:
      "Explore 73+ real golf trips across Reno, Tahoe, Truckee, and Graeagle. Real prices, real courses, real itineraries.",
    url: "https://golfthehighsierra.com/trip-builder/",
    type: "website",
  },
};

export default function TripBuilderPage() {
  return <TripBuilderContent />;
}
