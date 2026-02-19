import { MetadataRoute } from 'next';
import { getAllCourseSlugs } from '@/data/courses';
import { getAllHotelSlugs } from '@/data/hotels';
import { getAllVenueSlugs } from '@/data/venues';
import { getAllRegionSlugs } from '@/data/regions';

// Duplicate/thin pages — excluded from sitemap, redirected in next.config.mjs
const EXCLUDED_VENUE_SLUGS = new Set([
  'atlantis-bar-suites', 'atlantis-tower-rooms', 'atlantis-luxury-tower-rooms',
  'atlantis-concierge-tower-rooms', 'atlantis-spa-suites', 'atlantis-executive-spa-suites',
  'atlantis-steakhouse-reno', 'atlantis-bar-centro',
  'atlantis-tower-room', 'atlantis-luxury-tower-room', 'atlantis-concierge-tower-room',
  'atlantis-bar-suite', 'atlantis-spa-suite', 'atlantis-executive-spa-suite', 'atlantis-atrium-paradise-suite',
  'eldorado-virginia-petite-1-queen', 'eldorado-virginia-deluxe-2-queens',
  'eldorado-skyline-superior-1-king', 'eldorado-skyline-superior-2-queens',
  'eldorado-skyline-deluxe-1-king', 'eldorado-sierra-luxury-1-king', 'eldorado-sierra-luxury-2-queen',
  'eldorado-sierra-studio-suite', 'eldorado-sierra-executive-suite', 'eldorado-corner-spa-suite',
  'eldorado-spa-one-bedroom-suite', 'eldorado-skyline-player-spa-small', 'eldorado-skyline-player-spa-large',
  'eldorado-skyline-vip-hospitality', 'eldorado-virginia-twenty-one-suite',
  'players-corner-spa-suite',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://golfthehighsierra.com';
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about-group-golf-packages/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/accommodations-in-reno-tahoe/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/best-restaurants-reno-nv/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog-explore-the-high-sierra/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/cancellation-policy/`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/contact-custom-golf-package/`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/corporate-golf-events/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/disclaimer-policy/`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/experiences-things-to-do-in-reno-nv/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/group-golf-reno-tahoe/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/locations-map/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/packages/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy-policy/`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms-and-conditions/`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/trip-builder/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const regionPages: MetadataRoute.Sitemap = getAllRegionSlugs().map((slug) => ({
    url: `${base}/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const coursePages: MetadataRoute.Sitemap = getAllCourseSlugs().map((slug) => ({
    url: `${base}/portfolio/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const hotelPages: MetadataRoute.Sitemap = getAllHotelSlugs().map((slug) => ({
    url: `${base}/portfolio/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const venuePages: MetadataRoute.Sitemap = getAllVenueSlugs()
    .filter((slug) => !EXCLUDED_VENUE_SLUGS.has(slug))
    .map((slug) => ({
      url: `${base}/portfolio/${slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [...staticPages, ...regionPages, ...coursePages, ...hotelPages, ...venuePages];
}
