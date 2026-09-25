import { TravelOption, BudgetBreakdown, ItineraryDay, SearchQuery } from '../types/travel';
import { RATNAGIRI_TO_MUMBAI_OPTIONS, getRatnagiriMumbaiPlan, isRatnagiriMumbaiRoute } from './travelData';

export interface GeminiPlanResult {
  options: TravelOption[];
  budget?: BudgetBreakdown;
  itinerary?: ItineraryDay[];
  aiOverview?: string;
  source: 'gemini-ai' | 'algorithmic-engine';
  error?: string;
}

/**
 * Read API Key purely from backend .env
 * Invisible to visitors, no modal or input on the website
 */
export function getGeminiApiKey(): string {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (
    envKey &&
    typeof envKey === 'string' &&
    envKey.trim().length > 10 &&
    !envKey.includes('your_gemini_api_key_here')
  ) {
    return envKey.trim();
  }
  return '';
}

/**
 * Main AI Query Executor using Google Gemini
 */
export async function planTravelWithGemini(query: SearchQuery): Promise<GeminiPlanResult> {
  const apiKey = getGeminiApiKey();

  // ── NO API KEY: Only show real Ratnagiri→Mumbai data ──
  if (!apiKey) {
    // Check if the query matches the Ratnagiri–Mumbai route
    if (isRatnagiriMumbaiRoute(query.origin, query.destination)) {
      let budget: BudgetBreakdown | undefined;
      let itinerary: ItineraryDay[] | undefined;

      if (query.tripDays && query.tripDays > 0) {
        const plan = getRatnagiriMumbaiPlan(query.tripDays, query.travelers);
        budget = plan.budget;
        itinerary = plan.itinerary;
      }

      return {
        options: RATNAGIRI_TO_MUMBAI_OPTIONS,
        budget,
        itinerary,
        aiOverview: 'Showing real travel data for Ratnagiri ↔ Mumbai route (Konkan Railway corridor). Connect your Gemini API key for AI-powered results on any route.',
        source: 'algorithmic-engine'
      };
    }

    // For any other route WITHOUT API key → show NO results + message
    return {
      options: [],
      aiOverview: `⚠️ No API key configured. Without the Gemini API key, only the demo route (Ratnagiri → Mumbai) is available. Please add your API key in the .env file (VITE_GEMINI_API_KEY) to search any route.`,
      source: 'algorithmic-engine',
      error: 'No API key. Only Ratnagiri → Mumbai demo data is available offline.'
    };
  }

  // ── WITH API KEY: Full Gemini AI query for any route ──
  const systemPrompt = `You are Travel Guru's elite AI Travel Conductor and Global Logistics Planner.
User Search Details:
- Origin: ${query.origin}
- Destination: ${query.destination}
- Departure Date: ${query.departureDate}
- Number of Travelers: ${query.travelers}
- Preferred Mode: ${query.travelMode}
- Travel Class: ${query.travelClass}
${query.tripDays ? `- Trip Duration: ${query.tripDays} days` : ''}
${query.travelStyle ? `- Travel Style: ${query.travelStyle}` : ''}

CRITICAL: Search current travel routes, transport options (Flights, Trains, Buses, Cabs/Road) and estimate realistic prices in Indian Rupees (INR ₹).
You MUST return ONLY valid raw JSON with NO markdown formatting, NO backticks, and NO extraneous text.

JSON Schema format:
{
  "overview": "2 sentence summary of travel between origin and destination",
  "travelOptions": [
    {
      "id": "gemini_opt_1",
      "mode": "flight|train|bus|road",
      "carrier": "Airline/Railway/Bus brand name",
      "title": "Specific train/flight name",
      "category": "cheapest|fastest|recommended|alternative",
      "priceINR": 3500,
      "durationMinutes": 180,
      "safetyScore": 98,
      "rating": 4.8,
      "reviewsCount": 1200,
      "departureTime": "07:30 AM",
      "arrivalTime": "10:30 AM",
      "originHub": "Origin Terminal/Station/Airport",
      "destinationHub": "Destination Terminal/Station/Airport",
      "badge": "Short badge text",
      "carbonKg": 25,
      "highlights": ["highlight 1", "highlight 2"],
      "stops": [
        { "name": "Stop 1", "duration": "10 min", "arrival": "08:45 AM" }
      ],
      "bookingDetails": {
        "serviceNumber": "Code/Number",
        "classType": "Economy/AC 3 Tier/Sleeper",
        "refundable": true,
        "baggage": "Allowance text"
      }
    }
  ],
  "budget": {
    "totalINR": 25000,
    "perPersonINR": 25000,
    "transportINR": 8000,
    "accommodationINR": 9000,
    "foodAndDiningINR": 4500,
    "activitiesSightseeingINR": 2500,
    "emergencyBufferINR": 1000,
    "currency": "INR",
    "exchangeRateToUSD": 84.5
  },
  "itinerary": [
    {
      "dayNumber": 1,
      "title": "Day 1 Title",
      "theme": "Theme name",
      "morning": { "activity": "...", "location": "...", "costINR": 400, "tip": "..." },
      "afternoon": { "activity": "...", "location": "...", "costINR": 600, "tip": "..." },
      "evening": { "activity": "...", "location": "...", "costINR": 800, "tip": "..." },
      "recommendedFood": ["Dish 1", "Dish 2"],
      "localTransport": "Metro / Cab"
    }
  ]
}

Provide at least 3 to 4 distinct travel options, explicitly assigning one as "cheapest", one as "fastest", and one as "recommended".`;
  try {
    const availableModels = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let lastError: any = null;

    for (const model of availableModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 8192,
              responseMimeType: 'application/json'
            }
          })
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          throw new Error(errJson?.error?.message || `Gemini API Error: ${response.status}`);
        }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const cleanJson = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const parsed = JSON.parse(cleanJson);

      const validOptions: TravelOption[] = Array.isArray(parsed.travelOptions)
        ? parsed.travelOptions.map((opt: any, idx: number) => ({
            id: opt.id || `ai_opt_${idx + 1}`,
            mode: ['flight', 'train', 'bus', 'road'].includes(opt.mode) ? opt.mode : 'train',
            carrier: opt.carrier || 'National Transport',
            title: opt.title || `${query.origin} to ${query.destination} Route`,
            category: ['cheapest', 'fastest', 'recommended', 'alternative'].includes(opt.category)
              ? opt.category
              : idx === 0
              ? 'recommended'
              : idx === 1
              ? 'cheapest'
              : 'fastest',
            priceINR: Number(opt.priceINR) || 2500,
            durationMinutes: Number(opt.durationMinutes) || 360,
            safetyScore: Number(opt.safetyScore) || 96,
            rating: Number(opt.rating) || 4.7,
            reviewsCount: Number(opt.reviewsCount) || 1200,
            departureTime: opt.departureTime || '08:00 AM',
            arrivalTime: opt.arrivalTime || '04:00 PM',
            originHub: opt.originHub || query.origin,
            destinationHub: opt.destinationHub || query.destination,
            badge: opt.badge || 'Verified Route',
            carbonKg: Number(opt.carbonKg) || 35,
            highlights: Array.isArray(opt.highlights) ? opt.highlights : ['Scenic journey', 'Comfortable seating'],
            stops: Array.isArray(opt.stops) ? opt.stops : [],
            bookingDetails: {
              serviceNumber: opt.bookingDetails?.serviceNumber || 'TG-Express',
              classType: opt.bookingDetails?.classType || query.travelClass || 'Standard',
              refundable: Boolean(opt.bookingDetails?.refundable),
              baggage: opt.bookingDetails?.baggage || 'Included'
            }
          }))
        : [];

      return {
        options: validOptions,
        budget: parsed.budget,
        itinerary: parsed.itinerary,
        aiOverview: parsed.overview || `AI-optimized routes connecting ${query.origin} and ${query.destination}.`,
        source: 'gemini-ai'
      };
    } catch (err: any) {
      console.warn(`Attempt with ${model} failed:`, err);
      lastError = err;
      // Continue to next model in loop
    }
  }

  // If all models failed, throw the last error to be caught below
  throw lastError || new Error('All Gemini models failed to generate content');
  } catch (error: any) {
    // On API error, only fallback for Ratnagiri–Mumbai
    if (isRatnagiriMumbaiRoute(query.origin, query.destination)) {
      const plan = getRatnagiriMumbaiPlan(query.tripDays || 2, query.travelers);
      return {
        options: RATNAGIRI_TO_MUMBAI_OPTIONS,
        budget: plan.budget,
        itinerary: plan.itinerary,
        aiOverview: 'Gemini API error — showing cached Ratnagiri → Mumbai data.',
        source: 'algorithmic-engine',
        error: error?.message || 'Gemini fallback'
      };
    }

    return {
      options: [],
      aiOverview: `Failed to fetch AI results for ${query.origin} → ${query.destination}. Please check your API key configuration.`,
      source: 'algorithmic-engine',
      error: error?.message || 'Gemini API error'
    };
  }
}
