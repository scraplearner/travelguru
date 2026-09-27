import { SavedTrip, ItineraryDay, TravelOption, AIPackagePlan } from '../types/travel';

const STORAGE_SAVED_TRIPS_KEY = 'travel_guru_saved_trips_db';

// Initial default trips so users immediately see pre-configured CRUD examples
const DEFAULT_SAVED_TRIPS: SavedTrip[] = [
  {
    id: 'trip_goa_coastal_01',
    userId: 'usr_guest_explorer',
    title: 'Goa Coastal & Beachside Multi-Modal Getaway',
    origin: 'New Delhi',
    destination: 'Goa',
    departureDate: '2026-10-15',
    travelers: 2,
    tripDays: 4,
    totalBudgetINR: 28500,
    notes: 'Remember to book scooter near Madgaon station. Rain forecast on Day 2 handled with museum trail.',
    status: 'planned',
    tags: ['Beach', 'Konkan Rail', 'Culture'],
    weatherAlert: 'Rain predicted on Day 2 — Indoor Museum Trail Active',
    hasWeatherAdaptation: true,
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-09-25T14:30:00.000Z',
    itinerary: []
  },
  {
    id: 'trip_mumbai_express_02',
    userId: 'usr_guest_explorer',
    title: 'Mumbai South Heritage & Kala Ghoda Art Circuit',
    origin: 'Ratnagiri',
    destination: 'Mumbai',
    departureDate: '2026-11-04',
    travelers: 1,
    tripDays: 2,
    totalBudgetINR: 8400,
    notes: 'Vande Bharat morning express route. Kala Ghoda cafes & CSMVS museum exploration.',
    status: 'in-progress',
    tags: ['Art', 'Express Rail', 'Architecture'],
    hasWeatherAdaptation: false,
    createdAt: '2026-09-22T08:15:00.000Z',
    updatedAt: '2026-09-26T18:00:00.000Z',
    itinerary: []
  }
];

/**
 * Helper to fetch all stored trips from database
 */
function getAllTripsFromStorage(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_TRIPS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_SAVED_TRIPS_KEY, JSON.stringify(DEFAULT_SAVED_TRIPS));
      return DEFAULT_SAVED_TRIPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SAVED_TRIPS;
  }
}

/**
 * Helper to persist trips
 */
function persistTrips(trips: SavedTrip[]): void {
  localStorage.setItem(STORAGE_SAVED_TRIPS_KEY, JSON.stringify(trips));
}

/**
 * READ (R): Get all saved trips for current user
 */
export function getSavedTrips(userId?: string): SavedTrip[] {
  const all = getAllTripsFromStorage();
  if (!userId) return all;
  
  // Show trips matching user, plus default guest trips if guest
  return all.filter(t => t.userId === userId || t.userId === 'usr_guest_explorer')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * READ ONE (R): Get a single trip by ID
 */
export function getSavedTripById(tripId: string): SavedTrip | null {
  const all = getAllTripsFromStorage();
  return all.find(t => t.id === tripId) || null;
}

/**
 * CREATE (C): Save a new trip to the database
 */
export function createSavedTrip(
  tripData: {
    userId: string;
    title: string;
    origin: string;
    destination: string;
    departureDate: string;
    travelers: number;
    tripDays: number;
    totalBudgetINR: number;
    itinerary?: ItineraryDay[];
    selectedOption?: TravelOption;
    notes?: string;
    tags?: string[];
    weatherAlert?: string;
    hasWeatherAdaptation?: boolean;
  }
): SavedTrip {
  const all = getAllTripsFromStorage();
  const now = new Date().toISOString();

  const newTrip: SavedTrip = {
    id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: tripData.userId,
    title: tripData.title || `${tripData.destination} Expedition (${tripData.tripDays} Days)`,
    origin: tripData.origin,
    destination: tripData.destination,
    departureDate: tripData.departureDate,
    travelers: tripData.travelers,
    tripDays: tripData.tripDays,
    totalBudgetINR: tripData.totalBudgetINR,
    itinerary: tripData.itinerary || [],
    selectedOption: tripData.selectedOption,
    notes: tripData.notes || 'Trip planned with Travel Guru AI.',
    status: 'planned',
    tags: tripData.tags || ['AI Plan', tripData.destination],
    weatherAlert: tripData.weatherAlert,
    hasWeatherAdaptation: tripData.hasWeatherAdaptation || false,
    createdAt: now,
    updatedAt: now
  };

  const updated = [newTrip, ...all];
  persistTrips(updated);
  return newTrip;
}

/**
 * UPDATE (U): Modify an existing saved trip
 */
export function updateSavedTrip(
  tripId: string,
  updates: Partial<Omit<SavedTrip, 'id' | 'userId' | 'createdAt'>>
): SavedTrip {
  const all = getAllTripsFromStorage();
  const index = all.findIndex(t => t.id === tripId);

  if (index === -1) {
    throw new Error(`Trip with ID ${tripId} not found.`);
  }

  const existing = all[index];
  const updatedTrip: SavedTrip = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  all[index] = updatedTrip;
  persistTrips(all);
  return updatedTrip;
}

/**
 * DELETE (D): Remove a saved trip from the database
 */
export function deleteSavedTrip(tripId: string): boolean {
  const all = getAllTripsFromStorage();
  const filtered = all.filter(t => t.id !== tripId);

  if (filtered.length === all.length) {
    return false; // Nothing deleted
  }

  persistTrips(filtered);
  return true;
}
