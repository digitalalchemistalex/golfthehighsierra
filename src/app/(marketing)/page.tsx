import HomepageContent from '@/components/HomepageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Golf the High Sierra — Group Golf Trips in Reno, Lake Tahoe & Carson Valley',
  description: 'Plan your perfect group golf trip to Reno, Lake Tahoe, Truckee & Carson Valley. 20+ courses, partner hotels, dining & transport — one call, one contract, zero hassle.',
  alternates: {
    canonical: 'https://golfthehighsierra.com/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Golf the High Sierra',
  url: 'https://golfthehighsierra.com/',
  logo: 'https://golfthehighsierra.com/images/gths-logo.png',
  description: 'Premier group golf trip planners for Reno, Lake Tahoe, Carson Valley & Graeagle since 2004. 20+ courses, casino-resort lodging, dining, and full event planning.',
  telephone: '+1-888-584-8232',
  email: 'info@golfthehighsierra.com',
  foundingDate: '2004',
  areaServed: [
    { '@type': 'City', name: 'Reno', addressRegion: 'NV' },
    { '@type': 'City', name: 'Lake Tahoe', addressRegion: 'CA/NV' },
    { '@type': 'City', name: 'Truckee', addressRegion: 'CA' },
    { '@type': 'City', name: 'Carson City', addressRegion: 'NV' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Reno',
    addressRegion: 'NV',
    addressCountry: 'US',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '672',
    bestRating: '5',
  },
  priceRange: '$$-$$$$',
  openingHours: 'Mo-Fr 08:00-18:00',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomepageContent />
    </>
  );
}
