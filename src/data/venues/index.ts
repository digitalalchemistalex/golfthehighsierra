// Venue data - loaded from JSON files
// Each venue has: slug, name, type, region, regionLabel, address, geo, phone,
// website, hours, priceRange, description, highlights, insiderTips, parking,
// groupEvents, distances, heroImage, images, faqs, meta

import chapelTavernData from "./chapel-tavern-reno.json";

export const ALL_VENUES = [
  chapelTavernData,
] as const;

export type VenueData = (typeof ALL_VENUES)[number];

export function getVenueBySlug(slug: string) {
  return ALL_VENUES.find((v) => v.slug === slug);
}

export function getVenuesByRegion(region: string) {
  return ALL_VENUES.filter((v) => v.region === region);
}

export function getVenuesByType(type: string) {
  return ALL_VENUES.filter((v) => v.type === type);
}

export function getAllVenueSlugs(): string[] {
  return ALL_VENUES.map((v) => v.slug);
}
