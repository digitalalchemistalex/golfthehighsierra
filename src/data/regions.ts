export interface RegionData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  highlights: string[];
  hotels: { name: string; slug?: string }[];
  whyPlay: string;
  bestFor: string[];
  priceRange?: string;
  season: string;
  courseRegions: string[]; // region keys matching course data
  meta: {
    title: string;
    description: string;
  };
}

export const REGIONS: RegionData[] = [
  {
    slug: "reno-golf-packages",
    name: "Reno",
    tagline: "Casino Golf Capital",
    description:
      "Experience golf in Reno, Nevada with custom stay-and-play packages. Golf the High Sierra partners with the region's top courses and resorts to build tailored trips for individuals, groups, and corporate events. With over 20 years of experience, we handle tee times, lodging, dining, and transportation so you can focus on the game. Play nearly year-round in Reno's dry, warm climate. Pair golf with world-class casinos, dining, and shows. Reno airport is less than 10 minutes from downtown play.",
    heroImage:
      "/images/regions/reno.jpg",
    highlights: [
      "7 championship courses within 30 minutes",
      "Casino resort lodging with group rates",
      "Year-round play in 300+ days of sunshine",
      "Reno airport 10 min from downtown courses",
      "Night life, dining, and entertainment after rounds",
      "Private club access through GTHS relationships",
    ],
    hotels: [
      { name: "Atlantis Casino Resort Spa", slug: "atlantis-casino-resort-spa-reno" },
      { name: "Peppermill Resort Spa Casino", slug: "peppermill-resort-spa-casino" },
      { name: "Grand Sierra Resort", slug: "grand-sierra-resort-reno" },
      { name: "Silver Legacy Resort Casino", slug: "silver-legacy-resort-casino" },
      { name: "Eldorado at The Row", slug: "eldorado-resorts-reno-eldorado-at-the-row" },
      { name: "Circus Circus Reno", slug: "circus-circus-reno" },
      { name: "Nugget Casino Resort", slug: "nugget-casino-resort-reno" },
      { name: "J Resort", slug: "j-resort-reno" },
    ],
    whyPlay:
      "Reno offers the best value-to-quality ratio in the Sierra. Seven diverse courses range from the iconic island-green at Lakeridge to the private-club exclusivity of ArrowCreek and Somersett. Casino resorts like Peppermill and Atlantis provide group-friendly lodging with pools, spas, and restaurants steps from your room. Fly into Reno-Tahoe International and be on the first tee within an hour.",
    bestFor: [
      "Casino golf weekends",
      "Corporate outings & tournaments",
      "Budget-friendly group trips",
      "Bachelor parties",
    ],
    priceRange: "$179–$429 per golfer",
    season: "Year-round (peak: April–October)",
    courseRegions: ["reno"],
    meta: {
      title: "Reno Golf Packages | Stay and Play Trips in Reno NV",
      description:
        "Build a Reno golf package with tee times, lodging, and casino resorts. 20+ years trusted planning, group discounts, and custom itineraries.",
    },
  },
  {
    slug: "best-golf-courses-lake-tahoe",
    name: "Lake Tahoe",
    tagline: "Lakefront & Alpine",
    description:
      "Experience world-class golf surrounded by the Sierra Nevada mountains with our custom Lake Tahoe golf packages. From championship courses like Edgewood — home of the American Century Celebrity Tournament — to hidden gems nestled in the pines, we create unforgettable golf vacations tailored to your group. Play courses carved through towering pines with stunning lake views. Every round offers postcard-perfect backdrops of alpine meadows and snow-capped peaks.",
    heroImage:
      "/images/regions/tahoe.jpg",
    highlights: [
      "Edgewood Tahoe — home of the Celebrity Championship",
      "Incline Village Championship & Mountain courses",
      "Stunning lakefront and alpine settings",
      "Luxury resort and casino lodging on the south shore",
      "Non-golfer activities: lake cruises, hiking, spa",
      "Tahoe Donner — family-friendly mountain golf",
    ],
    hotels: [
      { name: "Hyatt Regency Lake Tahoe", slug: "hyatt-lake-tahoe" },
      { name: "Harrah's Lake Tahoe", slug: "harrahs-lake-tahoe" },
      { name: "Harvey's Lake Tahoe", slug: "harveys-lake-tahoe" },
      { name: "Golden Nugget Lake Tahoe", slug: "golden-nugget-lake-tahoe" },
      { name: "Margaritaville Lake Tahoe", slug: "margaritaville-lake-tahoe" },
      { name: "Lake Tahoe Resort Hotel", slug: "lake-tahoe-resort-hotel" },
    ],
    whyPlay:
      "Lake Tahoe is bucket-list golf. Edgewood's finishing holes along the crystal-clear shoreline are among the most photographed in America. Incline Village offers two distinct experiences — the Championship Course for serious players and the Mountain Course for a scenic, fun round. Tahoe Donner adds a family-friendly option in the pines. Pair your rounds with south shore casino lodging or north shore luxury at the Hyatt.",
    bestFor: [
      "Bucket-list golf experiences",
      "Couples and family golf trips",
      "Luxury resort getaways",
      "Corporate retreats with mountain views",
    ],
    priceRange: "$139–$699 per golfer",
    season: "May–October",
    courseRegions: ["tahoe"],
    meta: {
      title: "Best Lake Tahoe Golf Courses | Stay and Play Packages",
      description:
        "Play Lake Tahoe's best golf courses. Edgewood, Incline Village & more championship tracks. Book tee times or packages with lodging. Groups welcome.",
    },
  },
  {
    slug: "best-golf-courses-truckee",
    name: "Truckee & North Tahoe",
    tagline: "Mountain Championship",
    description:
      "Truckee and North Lake Tahoe offer some of the most stunning mountain golf in California. Championship courses carved through towering Ponderosa Pines feature dramatic elevation changes, pristine conditions, and Sierra Nevada vistas at every turn. Old Greenwood hosts the PGA TOUR Barracuda Championship. Coyote Moon is a hidden gem among golf insiders. Villa-style lodging among the pines makes Truckee the ultimate golf retreat.",
    heroImage:
      "/images/regions/truckee.jpg",
    highlights: [
      "Old Greenwood — PGA TOUR Barracuda Championship host",
      "Coyote Moon — rated among America's top public courses",
      "Gray's Crossing — scenic Peter Jacobsen design",
      "Dramatic elevation changes through pine forests",
      "Villa and cabin-style mountain lodging",
      "30 minutes from Reno, 15 minutes from North Shore",
    ],
    hotels: [
      { name: "Hampton Inn Truckee", slug: "hampton-inn-truckee-ca" },
      { name: "Old Greenwood Lodging", slug: "old-greenwood-lodging-truckee-ca" },
    ],
    whyPlay:
      "Truckee is where serious golfers come to play. Old Greenwood, a Jack Nicklaus masterpiece, hosts PGA TOUR events and ranks among America's Top 100 Public Courses. Coyote Moon is a hidden treasure winding through granite boulders and century-old pines. Gray's Crossing blends scenic mountain golf with accessibility. Tahoe Donner adds a family-friendly option. Stay in mountain villas steps from the first tee.",
    bestFor: [
      "Serious golfers seeking championship play",
      "Buddies trips in mountain lodges",
      "PGA TOUR venue experiences",
      "Nature-focused golf retreats",
    ],
    priceRange: "$179–$499 per golfer",
    season: "May–October",
    courseRegions: ["truckee"],
    meta: {
      title: "Best Golf Courses Truckee | Mountain Golf Packages North Tahoe",
      description:
        "Play Truckee's championship mountain courses — Old Greenwood, Coyote Moon, Gray's Crossing. Custom packages with villa lodging.",
    },
  },
  {
    slug: "best-golf-courses-carson-valley",
    name: "Carson Valley",
    tagline: "Best Value in the Sierra",
    description:
      "Carson Valley delivers championship golf at the region's best prices. Three distinct courses — Genoa Lakes, Dayton Valley, and Eagle Valley — offer quality layouts in the scenic valley between Reno and Carson City. Budget-friendly lodging at the Carson Valley Inn makes this the smart choice for groups who want great golf without the premium price tag. Toiyabe Golf Club adds a semi-private option with excellent conditioning.",
    heroImage:
      "/images/regions/carson.jpg",
    highlights: [
      "Best golf-per-dollar value in the Sierra",
      "Genoa Lakes — stunning mountain backdrop",
      "Dayton Valley — challenging desert-mountain layout",
      "Carson Valley Inn — group-friendly rates",
      "30 minutes from downtown Reno",
      "Eagle Valley — municipal gem in Carson City",
    ],
    hotels: [
      { name: "Carson Valley Inn Casino", slug: "carson-valley-inn-casino" },
    ],
    whyPlay:
      "Carson Valley is the value play. Genoa Lakes sits at the base of the Sierras with dramatic mountain views and excellent conditioning. Dayton Valley is a Hale Irwin design with rolling desert terrain. Eagle Valley serves as Carson City's municipal course — affordable and well-maintained. Groups of all sizes save significantly here versus Tahoe or Truckee while still playing quality golf.",
    bestFor: [
      "Budget-conscious groups",
      "Multi-day packages with low per-golfer cost",
      "Corporate outings with large headcounts",
      "Combination trips with Reno rounds",
    ],
    priceRange: "$179–$499 per golfer",
    season: "March–November",
    courseRegions: ["carson"],
    meta: {
      title: "Carson Valley Golf Packages | Best Value Stay & Play",
      description:
        "Carson Valley golf at the Sierra's best prices. Genoa Lakes, Dayton Valley, Eagle Valley + affordable lodging. Group packages from $179.",
    },
  },
  {
    slug: "best-golf-courses-graeagle",
    name: "Graeagle & Lost Sierra",
    tagline: "Secluded Mountain Golf",
    description:
      "Graeagle is the Sierra's best-kept secret — five championship courses hidden in the Lost Sierra region of Northern California. Grizzly Ranch, Whitehawk Ranch, Nakoma Dragon (a Robin Graves design), Plumas Pines, and Graeagle Meadows offer uncrowded mountain golf through pristine forests. Stay in private residences and mountain lodges for a true golf retreat experience away from the crowds.",
    heroImage:
      "/images/regions/graeagle.jpg",
    highlights: [
      "5 courses in the secluded Lost Sierra",
      "Grizzly Ranch — exclusive mountain retreat",
      "Nakoma Dragon — Robin Graves masterpiece",
      "Uncrowded fairways through old-growth forest",
      "Private residence and lodge-style lodging",
      "90 minutes from Reno for a true getaway",
    ],
    hotels: [
      { name: "Plumas Pines Private Residency", slug: "plumas-pines-private-residency-graeagle" },
      { name: "River Pines Resort", slug: "river-pines-resort-graeagle-ca" },
    ],
    whyPlay:
      "Graeagle is where golfers go to escape. Five courses spread through pristine mountain forest offer what you can't find anywhere else: uncrowded fairways, wildlife sightings between shots, and the kind of quiet that makes you hear every birdsong. Grizzly Ranch is a private-club experience. Whitehawk Ranch winds through meadows. Nakoma Dragon challenges with its dramatic design. Stay in private homes and lodges — no casino noise, just golf and nature.",
    bestFor: [
      "Golfers seeking a secluded retreat",
      "Multi-day buddies trips",
      "Nature lovers and photographers",
      "Groups wanting private-club access",
    ],
    priceRange: "$149–$599 per golfer",
    season: "May–October",
    courseRegions: ["graeagle"],
    meta: {
      title: "Best Golf Courses Graeagle | Lost Sierra Stay & Play Packages",
      description:
        "Golf the Lost Sierra — Grizzly Ranch, Whitehawk, Nakoma Dragon + 2 more. Secluded mountain packages with lodge-style lodging from $149.",
    },
  },
];

export function getRegionBySlug(slug: string) {
  return REGIONS.find((r) => r.slug === slug);
}

export function getAllRegionSlugs(): string[] {
  return REGIONS.map((r) => r.slug);
}
