// Course data - loaded from JSON files
// Each course has: slug, name, region, regionLabel, address, geo, phone,
// website, priceRange, rating, description, holes, par, designer,
// heroImage, images, videoUrl, faqs, meta

import arrowcreekData from "./arrowcreek-golf-club.json";
import coyoteMoonData from "./coyote-moon-golf-course.json";
import daytonValleyData from "./dayton-valley-golf-club.json";
import eagleValleyData from "./eagle-valley-golf-course.json";
import edgewoodData from "./edgewood-tahoe-golf-course.json";
import genoaLakesData from "./genoa-lakes-golf-club.json";
import graeagleMeadowsData from "./graeagle-meadows-golf-course.json";
import graysCrossingData from "./grays-crossing-golf-course.json";
import grizzlyRanchData from "./grizzly-ranch-golf-club.json";
import inclineVillageData from "./incline-village-golf-courses-nv.json";
import lakeridgeData from "./lakeridge-golf-course.json";
import nakomaDragonData from "./nakoma-dragon-golf-course.json";
import northstarData from "./northstar-golf-course.json";
import oldGreenwoodData from "./old-greenwood-golf-course.json";
import plumasPinesData from "./plumas-pines-golf-resort.json";
import redHawkData from "./red-hawk-golf-resort.json";
import somersettData from "./somersett-golf-country-club.json";
import tahoeDonnerData from "./tahoe-donner-golf-course-truckee-ca.json";
import toiyabeData from "./toiyabe-golf-club.json";
import washoeData from "./washoe-county-golf-course.json";
import whitehawkData from "./whitehawk-ranch-golf-course.json";
import wolfRunData from "./wolf-run-golf-club.json";
import winchesterData from "./winchester-golf-country-club.json";

export const ALL_COURSES = [
  arrowcreekData,
  coyoteMoonData,
  daytonValleyData,
  eagleValleyData,
  edgewoodData,
  genoaLakesData,
  graeagleMeadowsData,
  graysCrossingData,
  grizzlyRanchData,
  inclineVillageData,
  lakeridgeData,
  nakomaDragonData,
  northstarData,
  oldGreenwoodData,
  plumasPinesData,
  redHawkData,
  somersettData,
  tahoeDonnerData,
  toiyabeData,
  washoeData,
  whitehawkData,
  winchesterData,
  wolfRunData,
] as const;

export type CourseData = (typeof ALL_COURSES)[number];

export function getCourseBySlug(slug: string) {
  return ALL_COURSES.find((c) => c.slug === slug);
}

export function getCoursesByRegion(region: string) {
  return ALL_COURSES.filter((c) => c.region === region);
}

export function getAllCourseSlugs(): string[] {
  return ALL_COURSES.map((c) => c.slug);
}
