// ===== SHARED TYPES =====

export interface Address {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

export type Region = "reno" | "tahoe" | "carson" | "graeagle" | "truckee" | "northern-california";

export interface Rating {
  value: number;
  count: number;
  sources?: string; // e.g. "Google, Yelp, TripAdvisor"
}

// ===== GOLF COURSE =====

export interface GolfCourse {
  slug: string;
  name: string;
  region: Region;
  regionLabel: string;
  address: Address;
  geo: GeoCoordinates;
  phone?: string;
  website?: string;
  priceRange?: string;
  greenFees?: string;
  rating?: Rating;
  description: string;
  shortDescription: string; // For cards and AI extraction
  highlights: string[];
  facilities: string[];
  holes?: number;
  par?: number;
  yardage?: string;
  slope?: string;
  courseRating?: string;
  designer?: string;
  yearOpened?: number;
  season?: string;
  images: string[];
  heroImage: string;
  videoUrl?: string;
  faqs: FAQ[];
  gthsReview?: string; // "Our Point of View" section
  relatedHotels: string[]; // slugs
  relatedCourses: string[]; // slugs
  meta: SEOMetadata;
}

// ===== HOTEL / LODGING =====

export interface HotelRoomType {
  name: string;
  description: string;
  priceFrom?: string;
  image?: string;
}

export interface HotelDining {
  name: string;
  slug?: string; // link to venue page if exists
  type: string; // "steakhouse", "bar", "buffet", etc.
  description: string;
}

export interface Hotel {
  slug: string;
  name: string;
  region: Region;
  regionLabel: string;
  type: "casino-resort" | "hotel" | "resort" | "inn" | "private-residence" | "lodge";
  address: Address;
  geo: GeoCoordinates;
  phone?: string;
  website?: string;
  priceRange?: string;
  priceFrom?: string;
  starRating?: number;
  aaaRating?: string; // "Four Diamond", etc.
  rating?: Rating;
  description: string;
  shortDescription: string;
  highlights: string[];
  amenities: string[];
  roomTypes: HotelRoomType[];
  dining: HotelDining[];
  spaBars: string[]; // names of spa/bar/lounge on property
  totalRooms?: number;
  parking?: string;
  images: string[];
  heroImage: string;
  faqs: FAQ[];
  relatedCourses: string[]; // slugs
  relatedHotels: string[]; // slugs
  meta: SEOMetadata;
}

// ===== VENUE (Restaurant, Bar, Spa, Experience) =====

export type VenueType =
  | "restaurant"
  | "bar"
  | "lounge"
  | "steakhouse"
  | "buffet"
  | "cafe"
  | "coffee"
  | "spa"
  | "salon"
  | "fitness"
  | "pool"
  | "experience"
  | "shopping"
  | "museum"
  | "entertainment";

export interface Venue {
  slug: string;
  name: string;
  type: VenueType;
  parentHotel?: string; // slug of parent hotel
  region: Region;
  regionLabel: string;
  address: Address;
  geo: GeoCoordinates;
  phone?: string;
  website?: string;
  description: string;
  shortDescription: string;
  cuisine?: string; // for restaurants
  priceRange?: string;
  hours?: string;
  highlights: string[];
  images: string[];
  heroImage: string;
  meta: SEOMetadata;
}

// ===== BLOG POST =====

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string; // HTML content
  publishDate: string;
  updateDate?: string;
  author: string;
  heroImage: string;
  images: string[];
  tags: string[];
  relatedCourses: string[];
  relatedHotels: string[];
  meta: SEOMetadata;
}

// ===== SITE CONFIG =====

export interface SiteConfig {
  name: string;
  shortName: string;
  phone: string;
  phoneFormatted: string;
  email: string;
  url: string;
  logo: string;
  description: string;
  foundedYear: number;
  serviceAreas: string[];
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    yelp?: string;
    google?: string;
  };
}
