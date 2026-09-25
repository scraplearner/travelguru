export type TravelMode = 'flight' | 'train' | 'bus' | 'road' | 'all';

export type TravelStyle = 'budget' | 'balanced' | 'luxury' | 'adventure' | 'cultural';

export interface TravelOption {
  id: string;
  mode: 'flight' | 'train' | 'bus' | 'road';
  carrier: string;
  operatorLogo?: string;
  title: string;
  category: 'cheapest' | 'fastest' | 'recommended' | 'alternative';
  priceINR: number;
  durationMinutes: number;
  safetyScore: number;
  rating: number;
  reviewsCount: number;
  departureTime: string;
  arrivalTime: string;
  originHub: string;
  destinationHub: string;
  badge: string;
  carbonKg: number;
  highlights: string[];
  stops: { name: string; duration: string; arrival: string }[];
  bookingDetails: {
    serviceNumber?: string;
    classType: string;
    refundable: boolean;
    baggage: string;
  };
}

export interface BudgetBreakdown {
  totalINR: number;
  perPersonINR: number;
  transportINR: number;
  accommodationINR: number;
  foodAndDiningINR: number;
  activitiesSightseeingINR: number;
  emergencyBufferINR: number;
  currency: string;
  exchangeRateToUSD: number;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  theme: string;
  morning: {
    activity: string;
    location: string;
    costINR: number;
    tip: string;
  };
  afternoon: {
    activity: string;
    location: string;
    costINR: number;
    tip: string;
  };
  evening: {
    activity: string;
    location: string;
    costINR: number;
    tip: string;
  };
  recommendedFood: string[];
  localTransport: string;
}

export interface AIPackagePlan {
  destinationTitle: string;
  tagline: string;
  overview: string;
  bestTimeToVisit: string;
  budget: BudgetBreakdown;
  itinerary: ItineraryDay[];
  travelOptions: TravelOption[];
  localInsiderTips: string[];
  aiGenerated: boolean;
  generatedAt: string;
}

export interface SearchQuery {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  travelers: number;
  travelMode: TravelMode;
  travelClass: string;
  tripDays?: number;
  travelStyle?: TravelStyle;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  membership: 'Explorer' | 'Voyager Gold' | 'Globetrotter VIP';
  savedTripsCount: number;
  role?: 'traveler' | 'vip' | 'admin' | 'guest';
  badgeTitle?: string;
  initials?: string;
  homeHub?: string;
  preferredStyle?: TravelStyle;
  savedTrips?: string[];
  bio?: string;
}
