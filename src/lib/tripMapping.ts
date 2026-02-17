/* ═══════════════════════════════════════
   Trips Caddie ↔ GTHS Name Mapping
   
   Maps free-text course/lodging names from
   Trips Caddie API to GTHS portfolio slugs.
   
   Keys are LOWERCASED for case-insensitive matching.
   Add new mappings as new trip data comes in.
   ═══════════════════════════════════════ */

/** Course name variations → GTHS slug */
const COURSE_MAP: Record<string, string> = {
  // ArrowCreek
  "arrowcreek": "arrowcreek-golf-club",
  "arrowcreek country club": "arrowcreek-golf-club",
  "arrow creek": "arrowcreek-golf-club",
  "arrowcreek golf club": "arrowcreek-golf-club",
  "arrowcreek challenge": "arrowcreek-golf-club",
  "arrowcreek legend": "arrowcreek-golf-club",

  // Coyote Moon
  "coyote moon": "coyote-moon-golf-course",
  "coyote moon golf course": "coyote-moon-golf-course",

  // Dayton Valley
  "dayton valley": "dayton-valley-golf-club",
  "dayton valley golf club": "dayton-valley-golf-club",
  "dayton": "dayton-valley-golf-club",

  // Eagle Valley
  "eagle valley": "eagle-valley-golf-course",
  "eagle valley golf course": "eagle-valley-golf-course",

  // Edgewood Tahoe
  "edgewood": "edgewood-tahoe-golf-course",
  "edgewood tahoe": "edgewood-tahoe-golf-course",
  "edgewood tahoe golf course": "edgewood-tahoe-golf-course",

  // Genoa Lakes
  "genoa lakes": "genoa-lakes-golf-club",
  "genoa lakes golf club": "genoa-lakes-golf-club",
  "genoa": "genoa-lakes-golf-club",

  // Graeagle Meadows
  "graeagle meadows": "graeagle-meadows-golf-course",
  "graeagle meadows golf course": "graeagle-meadows-golf-course",

  // Gray's Crossing
  "gray's crossing": "grays-crossing-golf-course",
  "grays crossing": "grays-crossing-golf-course",
  "gray's crossing golf course": "grays-crossing-golf-course",

  // Grizzly Ranch
  "grizzly ranch": "grizzly-ranch-golf-club",
  "grizzly ranch golf club": "grizzly-ranch-golf-club",
  "grizzly": "grizzly-ranch-golf-club",

  // Incline Village
  "incline village": "incline-village-golf-courses-nv",
  "incline village golf courses": "incline-village-golf-courses-nv",
  "incline": "incline-village-golf-courses-nv",
  "incline championship": "incline-village-golf-courses-nv",
  "incline mountain": "incline-village-golf-courses-nv",

  // LakeRidge
  "lakeridge": "lakeridge-golf-course",
  "lakeridge golf course": "lakeridge-golf-course",
  "lake ridge": "lakeridge-golf-course",

  // Nakoma Dragon
  "nakoma": "nakoma-dragon-golf-course",
  "nakoma dragon": "nakoma-dragon-golf-course",
  "nakoma dragon golf course": "nakoma-dragon-golf-course",
  "dragon": "nakoma-dragon-golf-course",

  // Northstar
  "northstar": "northstar-golf-course",
  "northstar golf course": "northstar-golf-course",

  // Old Greenwood
  "old greenwood": "old-greenwood-golf-course",
  "old greenwood golf course": "old-greenwood-golf-course",

  // Plumas Pines
  "plumas pines": "plumas-pines-golf-resort",
  "plumas pines golf resort": "plumas-pines-golf-resort",

  // Red Hawk
  "red hawk": "red-hawk-golf-resort",
  "red hawk golf resort": "red-hawk-golf-resort",
  "redhawk": "red-hawk-golf-resort",

  // Somersett
  "somersett": "somersett-golf-country-club",
  "somersett golf & country club": "somersett-golf-country-club",
  "somersett golf": "somersett-golf-country-club",

  // Tahoe Donner
  "tahoe donner": "tahoe-donner-golf-course-truckee-ca",
  "tahoe donner golf course": "tahoe-donner-golf-course-truckee-ca",

  // Toiyabe
  "toiyabe": "toiyabe-golf-club",
  "toiyabe golf club": "toiyabe-golf-club",

  // Washoe County
  "washoe county": "washoe-county-golf-course",
  "washoe county golf course": "washoe-county-golf-course",
  "washoe": "washoe-county-golf-course",

  // Whitehawk Ranch
  "whitehawk ranch": "whitehawk-ranch-golf-course",
  "whitehawk ranch golf course": "whitehawk-ranch-golf-course",
  "whitehawk": "whitehawk-ranch-golf-course",
  "white hawk": "whitehawk-ranch-golf-course",

  // Wolf Run
  "wolf run": "wolf-run-golf-club",
  "wolf run golf club": "wolf-run-golf-club",
};

/** Lodging name variations → GTHS slug */
const LODGING_MAP: Record<string, string> = {
  // Atlantis
  "atlantis": "atlantis-casino-resort-spa-reno",
  "atlantis casino resort spa": "atlantis-casino-resort-spa-reno",
  "atlantis casino": "atlantis-casino-resort-spa-reno",
  "atlantis resort": "atlantis-casino-resort-spa-reno",

  // Carson Valley Inn
  "carson valley inn": "carson-valley-inn-casino",
  "carson valley inn & casino": "carson-valley-inn-casino",

  // Cedar House
  "cedar house": "cedar-house-sport-hotel",
  "cedar house sport hotel": "cedar-house-sport-hotel",

  // Circus Circus
  "circus circus": "circus-circus-reno",
  "circus circus reno": "circus-circus-reno",
  "circus circus reno hotel & casino": "circus-circus-reno",

  // Eldorado / THE ROW
  "eldorado": "eldorado-resorts-reno-eldorado-at-the-row",
  "eldorado resort casino": "eldorado-resorts-reno-eldorado-at-the-row",
  "the row": "eldorado-resorts-reno-eldorado-at-the-row",
  "at the row": "eldorado-resorts-reno-eldorado-at-the-row",

  // Golden Nugget
  "golden nugget": "golden-nugget-lake-tahoe",
  "golden nugget lake tahoe": "golden-nugget-lake-tahoe",

  // Grand Sierra Resort
  "grand sierra resort": "grand-sierra-resort-reno",
  "grand sierra resort & casino": "grand-sierra-resort-reno",
  "grand sierra": "grand-sierra-resort-reno",
  "gsr": "grand-sierra-resort-reno",

  // Hampton Inn Truckee
  "hampton inn": "hampton-inn-truckee-ca",
  "hampton inn truckee": "hampton-inn-truckee-ca",
  "hampton inn & suites truckee": "hampton-inn-truckee-ca",

  // Harrah's
  "harrah's": "harrahs-lake-tahoe",
  "harrahs": "harrahs-lake-tahoe",
  "harrah's lake tahoe": "harrahs-lake-tahoe",

  // Harvey's
  "harvey's": "harveys-lake-tahoe",
  "harveys": "harveys-lake-tahoe",
  "harvey's lake tahoe": "harveys-lake-tahoe",

  // Hyatt Regency
  "hyatt": "hyatt-lake-tahoe",
  "hyatt regency": "hyatt-lake-tahoe",
  "hyatt regency lake tahoe": "hyatt-lake-tahoe",
  "hyatt lake tahoe": "hyatt-lake-tahoe",

  // J Resort
  "j resort": "j-resort-reno",

  // Lake Tahoe Resort Hotel
  "lake tahoe resort hotel": "lake-tahoe-resort-hotel",

  // Margaritaville
  "margaritaville": "margaritaville-lake-tahoe",
  "margaritaville resort lake tahoe": "margaritaville-lake-tahoe",
  "margaritaville lake tahoe": "margaritaville-lake-tahoe",

  // Nugget
  "nugget": "nugget-casino-resort-reno",
  "nugget casino resort": "nugget-casino-resort-reno",
  "nugget casino": "nugget-casino-resort-reno",

  // Old Greenwood Lodging
  "old greenwood lodging": "old-greenwood-lodging-truckee-ca",
  "old greenwood cabins": "old-greenwood-lodging-truckee-ca",

  // Peppermill
  "peppermill": "peppermill-resort-spa-casino",
  "peppermill resort": "peppermill-resort-spa-casino",
  "peppermill resort spa casino": "peppermill-resort-spa-casino",
  "peppermill casino": "peppermill-resort-spa-casino",

  // Plumas Pines Residences
  "plumas pines private residences": "plumas-pines-private-residency-graeagle",
  "plumas pines residences": "plumas-pines-private-residency-graeagle",
  "plumas pines cabins": "plumas-pines-private-residency-graeagle",

  // Portola Hotel
  "portola hotel": "portola-hotel-spa-monterey",
  "portola hotel & spa": "portola-hotel-spa-monterey",

  // River Pines
  "river pines": "river-pines-resort-graeagle-ca",
  "river pines resort": "river-pines-resort-graeagle-ca",

  // Silver Legacy
  "silver legacy": "silver-legacy-resort-casino",
  "silver legacy resort casino": "silver-legacy-resort-casino",
  "silver legacy resort": "silver-legacy-resort-casino",
};

/**
 * Resolve a free-text course name to a GTHS portfolio slug.
 * Returns undefined if no match found.
 */
export function resolveCourseSlug(name: string): string | undefined {
  const key = name.trim().toLowerCase();
  // Direct match
  if (COURSE_MAP[key]) return COURSE_MAP[key];
  // Partial match — check if any key is contained in the name
  for (const [mapKey, slug] of Object.entries(COURSE_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) return slug;
  }
  return undefined;
}

/**
 * Resolve a free-text lodging name to a GTHS portfolio slug.
 * Returns undefined if no match found.
 */
export function resolveLodgingSlug(name: string): string | undefined {
  const key = name.trim().toLowerCase();
  if (LODGING_MAP[key]) return LODGING_MAP[key];
  for (const [mapKey, slug] of Object.entries(LODGING_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) return slug;
  }
  return undefined;
}

/**
 * Get the GTHS portfolio URL for a course name.
 */
export function getCourseUrl(name: string): string | undefined {
  const slug = resolveCourseSlug(name);
  return slug ? `/portfolio/${slug}/` : undefined;
}

/**
 * Get the GTHS portfolio URL for a lodging name.
 */
export function getLodgingUrl(name: string): string | undefined {
  const slug = resolveLodgingSlug(name);
  return slug ? `/portfolio/${slug}/` : undefined;
}
