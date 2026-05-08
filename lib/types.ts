export type PriceTier = "$" | "$$" | "$$$" | "$$$$";

export type TrendingBadge =
  | "Trending on TikTok"
  | "Reddit local pick"
  | "Local blog favorite"
  | "Hidden gem"
  | "Classic must-see";

export type TravelMode = "walk" | "metro" | "taxi" | "bus";

export type Spot = {
  name: string;
  description: string;
  price_tier: PriceTier;
  estimated_cost_usd_pp: number;
  time_at_spot_minutes: number;
  travel_to_next: { minutes: number; mode: TravelMode } | null;
  trending_badge: TrendingBadge;
  trending_source_note: string;
  lat: number;
  lng: number;
  google_maps_url: string;
  official_url: string | null;
  booking_url: string | null;
};

export type Day = {
  day_number: number;
  theme: string;
  morning: Spot[];
  afternoon: Spot[];
  evening: Spot[];
  day_total_usd: number;
};

export type TripPlan = {
  city: string;
  month: string;
  weather_note: string;
  total_cost_estimate_usd: number;
  cost_per_day_usd: number;
  budget_status: "within" | "slightly_over" | "over";
  days: Day[];
  themed_lists: {
    best_food: Spot[];
    best_views: Spot[];
    best_nightlife: Spot[];
    best_hidden_gems: Spot[];
  };
};

export type TripFormData = {
  city: string;
  days: number;
  trip_type: "first_time" | "been_before" | "live_here";
  vibes: string[];
  pace: "slow" | "balanced" | "packed";
  travel_style: "solo" | "couple" | "family" | "friends";
  budget_tier: "backpacker" | "mid" | "luxury";
  daily_budget: number;
  walking: "minimal" | "moderate" | "lots";
  dietary: string[];
  month: string;
};
