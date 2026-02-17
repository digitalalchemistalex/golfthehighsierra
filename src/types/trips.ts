/* ═══════════════════════════════════════
   Trips Caddie — TypeScript Interfaces
   Matches the PHP API data model exactly
   ═══════════════════════════════════════ */

export type TripVibe = 'Budget' | 'Value' | 'Premium' | 'Bucket List' | 'Bachelor Party' | 'Corporate';

export type TripRegion =
  | 'Reno'
  | 'Lake Tahoe'
  | 'Truckee'
  | 'Graeagle/Lost Sierra'
  | 'Carson Valley'
  | 'Monterey/Carmel'
  | 'Scotland';

export interface ItineraryItem {
  day: number;
  date: string;       // MM/DD/YYYY
  time: string;       // Pickup time
  activity: string;
  location: string;
  notes: string;
}

export interface LogisticsDetails {
  transportType: string;    // "56 PAX MC", "Rental Car", "Private Van", etc.
  passengerCount: number;
  specialRequests: string[];
}

export interface TripRecap {
  id: string;
  groupName: string;
  groupSize: number;
  month: string;              // "January", "February", etc.
  year: number;
  imageUrl?: string;          // Custom cover image URL
  courses: string[];          // Array of course names (free text)
  lodging: string;            // Lodging name (free text)
  nights: number;
  rounds: number;             // 0 = charter/bus trip (no golf)
  pricePerPerson: number;
  vibe: TripVibe;
  synopsis: string;           // Marketing blurb shown on card
  whyItWorked: string;        // Internal planner note
  highlights: string[];
  dailyItinerary: ItineraryItem[];
  logistics: LogisticsDetails;
  region?: string;            // Optional explicit region override
}

/** Computed stats for a course/hotel social proof section */
export interface TripStats {
  totalTrips: number;
  avgPricePerPerson: number;
  avgGroupSize: number;
  commonVibes: TripVibe[];
  commonNightsRounds: string;   // e.g. "3N / 2R"
  featuredTrips: TripRecap[];   // 2-3 recent trips to display
}
