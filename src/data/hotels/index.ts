// Hotel data - loaded from JSON files
// Each hotel has: slug, name, region, regionLabel, type, address, geo, phone,
// website, priceRange, rating, description, roomTypes, dining, spaBars, amenities,
// heroImage, images, faqs, meta

import atlantisData from "./atlantis-casino-resort-spa-reno.json";
import peppermillData from "./peppermill-resort-spa-casino.json";
import grandSierraData from "./grand-sierra-resort-reno.json";
import silverLegacyData from "./silver-legacy-resort-casino.json";
import eldoradoData from "./eldorado-resorts-reno-eldorado-at-the-row.json";
import nuggetData from "./nugget-casino-resort-reno.json";
import circusCircusData from "./circus-circus-reno.json";
import jResortData from "./j-resort-reno.json";
import hyattData from "./hyatt-lake-tahoe.json";
import harrahsData from "./harrahs-lake-tahoe.json";
import harveysData from "./harveys-lake-tahoe.json";
import lakeTahoeResortData from "./lake-tahoe-resort-hotel.json";
import goldenNuggetData from "./golden-nugget-lake-tahoe.json";
import margaritavilleData from "./margaritaville-lake-tahoe.json";
import hamptonData from "./hampton-inn-truckee-ca.json";
import oldGreenwoodLodgingData from "./old-greenwood-lodging-truckee-ca.json";
import cedarHouseData from "./cedar-house-sport-hotel.json";
import carsonValleyData from "./carson-valley-inn-casino.json";
import plumasPinesLodgingData from "./plumas-pines-private-residency-graeagle.json";
import riverPinesData from "./river-pines-resort-graeagle-ca.json";
import portolaData from "./portola-hotel-spa-monterey.json";

export const ALL_HOTELS = [
  atlantisData,
  peppermillData,
  grandSierraData,
  silverLegacyData,
  eldoradoData,
  nuggetData,
  circusCircusData,
  jResortData,
  hyattData,
  harrahsData,
  harveysData,
  lakeTahoeResortData,
  goldenNuggetData,
  margaritavilleData,
  hamptonData,
  oldGreenwoodLodgingData,
  cedarHouseData,
  carsonValleyData,
  plumasPinesLodgingData,
  riverPinesData,
  portolaData,
] as const;

export type HotelData = (typeof ALL_HOTELS)[number];

export function getHotelBySlug(slug: string) {
  return ALL_HOTELS.find((h) => h.slug === slug);
}

export function getHotelsByRegion(region: string) {
  return ALL_HOTELS.filter((h) => h.region === region);
}

export function getAllHotelSlugs(): string[] {
  return ALL_HOTELS.map((h) => h.slug);
}
