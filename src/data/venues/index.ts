// Venue data - loaded from JSON files
// Each venue has: slug, name, type, region, regionLabel, parentHotel,
// address, geo, phone, website, priceRange, description, shortDescription,
// highlights, hours, heroImage, images, faqs, meta

import chapelTavernData from "./chapel-tavern-reno.json";
import leadDogData from "./lead-dog-brewing-reno.json";
import emersonData from "./the-emerson-reno.json";
import eddyData from "./the-eddy-reno.json";
import rumSugarLimeData from "./rum-sugar-lime-reno.json";
import deathTaxesData from "./death-and-taxes-reno.json";
import pignicData from "./pignic-pub-and-patio-reno.json";
import scheelsData from "./scheels-sparks.json";
import outletsData from "./outlets-at-legends-sparks.json";
import autoMuseumData from "./national-automobile-museum-reno.json";
import artMuseumData from "./nevada-museum-of-art-reno.json";
import spaLegacyData from "./spa-at-silver-legacy.json";
import reflectionsSpaData from "./reflections-the-spa-nugget.json";
import clicheLoungeData from "./cliche-lounge-harrahs-tahoe.json";
import cabaretLoungeData from "./cabaret-lounge-carson-valley-inn.json";
import highlanderData from "./the-highlander-bar.json";
import slSportsBarData from "./silver-legacy-sports-bar.json";
import silverBaronData from "./silver-baron-lounge.json";
import rumBullionsData from "./rum-bullions-island-bar.json";
import drinxData from "./drinx-silver-legacy.json";
import comedyBarData from "./comedy-bar-silver-legacy.json";
import blenderBarData from "./blender-bar-silver-legacy.json";
import stadiumBarData from "./stadium-bar-eldorado.json";
import ringsideBarData from "./ringside-bar-eldorado.json";
import peppermillSportsData from "./peppermill-sports-bar.json";
import carsonAmenitiesData from "./carson-valley-inn-amenities.json";
import harveysPoolData from "./harveys-heated-pool.json";
import harveysFitnessData from "./harveys-fitness-center.json";
import playersCornerData from "./players-corner-spa-suite.json";

export const ALL_VENUES = [
  chapelTavernData,
  leadDogData,
  emersonData,
  eddyData,
  rumSugarLimeData,
  deathTaxesData,
  pignicData,
  scheelsData,
  outletsData,
  autoMuseumData,
  artMuseumData,
  spaLegacyData,
  reflectionsSpaData,
  clicheLoungeData,
  cabaretLoungeData,
  highlanderData,
  slSportsBarData,
  silverBaronData,
  rumBullionsData,
  drinxData,
  comedyBarData,
  blenderBarData,
  stadiumBarData,
  ringsideBarData,
  peppermillSportsData,
  carsonAmenitiesData,
  harveysPoolData,
  harveysFitnessData,
  playersCornerData,
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
