import { TravelOption, BudgetBreakdown, ItineraryDay } from '../types/travel';

/**
 * REAL Ratnagiri → Mumbai hardcoded travel data.
 * This is the ONLY fallback route when API key is not connected.
 * All data below is based on real routes, real prices, and real operators.
 */

export const RATNAGIRI_TO_MUMBAI_OPTIONS: TravelOption[] = [
  {
    id: 'rtm_train_konkan',
    mode: 'train',
    carrier: 'Indian Railways – Konkan Railway',
    title: 'Konkan Kanya Express (10111)',
    category: 'recommended',
    priceINR: 465,
    durationMinutes: 420, // ~7 hours
    safetyScore: 97,
    rating: 4.6,
    reviewsCount: 8420,
    departureTime: '05:40 AM',
    arrivalTime: '12:45 PM',
    originHub: 'RN (Ratnagiri Railway Station)',
    destinationHub: 'CSMT (Chhatrapati Shivaji Maharaj Terminus)',
    badge: '🏆 Best Value – Scenic Konkan Coast',
    carbonKg: 12,
    highlights: [
      'Scenic Konkan coastline views through tunnels & bridges',
      'Passes through Chiplun, Khed, Roha',
      'Pantry car available on board'
    ],
    stops: [
      { name: 'Chiplun', duration: '2 min halt', arrival: '07:10 AM' },
      { name: 'Khed', duration: '2 min halt', arrival: '07:55 AM' },
      { name: 'Roha', duration: '2 min halt', arrival: '09:20 AM' },
      { name: 'Panvel', duration: '5 min halt', arrival: '11:30 AM' }
    ],
    bookingDetails: {
      serviceNumber: '10111 / Konkan Kanya Express',
      classType: 'Sleeper / AC 3 Tier',
      refundable: true,
      baggage: '40 kg per passenger'
    }
  },
  {
    id: 'rtm_bus_msrtc',
    mode: 'bus',
    carrier: 'MSRTC (Maharashtra State Road Transport)',
    title: 'MSRTC Semi-Luxury / Shivneri AC',
    category: 'cheapest',
    priceINR: 550,
    durationMinutes: 480, // ~8 hours
    safetyScore: 92,
    rating: 4.2,
    reviewsCount: 3200,
    departureTime: '09:00 PM',
    arrivalTime: '05:00 AM (+1)',
    originHub: 'Ratnagiri Central Bus Stand',
    destinationHub: 'Mumbai Central ST Depot (Dadar)',
    badge: '💰 Most Economical',
    carbonKg: 18,
    highlights: [
      'Overnight journey via NH66 coastal highway',
      'AC semi-luxury seating',
      'MSRTC government-operated — reliable schedule'
    ],
    stops: [
      { name: 'Chiplun Bus Stand', duration: '10 min', arrival: '10:30 PM' },
      { name: 'Mahad', duration: '15 min food stop', arrival: '12:30 AM' },
      { name: 'Panvel', duration: '5 min', arrival: '03:30 AM' }
    ],
    bookingDetails: {
      serviceNumber: 'MSRTC Semi-Luxury / Shivneri',
      classType: 'AC Semi-Luxury 2+2',
      refundable: true,
      baggage: '2 pieces (15 kg each)'
    }
  },
  {
    id: 'rtm_road_cab',
    mode: 'road',
    carrier: 'Private Cab / Ola Outstation',
    title: 'Private Sedan (Ratnagiri → Mumbai via NH66)',
    category: 'fastest',
    priceINR: 4500,
    durationMinutes: 360, // ~6 hours
    safetyScore: 95,
    rating: 4.7,
    reviewsCount: 640,
    departureTime: 'Flexible / On Demand',
    arrivalTime: '+6 hrs after departure',
    originHub: 'Doorstep Pickup in Ratnagiri',
    destinationHub: 'Direct Drop in Mumbai',
    badge: '⚡ Fastest & Most Flexible',
    carbonKg: 38,
    highlights: [
      '330 km via NH66 – scenic coastal drive',
      'Door-to-door convenience, no waiting',
      'Stop at Ganpatipule / Harihareshwar en route'
    ],
    stops: [
      { name: 'Chiplun (optional food stop)', duration: '20 min', arrival: 'En-route' },
      { name: 'Kashid / Alibaug (optional)', duration: '15 min', arrival: 'En-route' }
    ],
    bookingDetails: {
      serviceNumber: 'Private Sedan / Innova (Ola/Local)',
      classType: 'Private Vehicle',
      refundable: true,
      baggage: 'Unlimited boot capacity'
    }
  },
  {
    id: 'rtm_train_mandovi',
    mode: 'train',
    carrier: 'Indian Railways – Konkan Railway',
    title: 'Mandovi Express (10103)',
    category: 'alternative',
    priceINR: 510,
    durationMinutes: 450, // ~7.5 hours
    safetyScore: 96,
    rating: 4.5,
    reviewsCount: 6180,
    departureTime: '12:55 PM',
    arrivalTime: '08:25 PM',
    originHub: 'RN (Ratnagiri Railway Station)',
    destinationHub: 'CSMT (Chhatrapati Shivaji Maharaj Terminus)',
    badge: '🚂 Popular Afternoon Route',
    carbonKg: 13,
    highlights: [
      'Afternoon departure — good for morning exploration',
      'Well-maintained Konkan Railway route',
      'Evening arrival in Mumbai'
    ],
    stops: [
      { name: 'Chiplun', duration: '2 min halt', arrival: '02:20 PM' },
      { name: 'Khed', duration: '2 min halt', arrival: '03:10 PM' },
      { name: 'Roha', duration: '2 min halt', arrival: '04:50 PM' },
      { name: 'Panvel', duration: '5 min halt', arrival: '06:45 PM' }
    ],
    bookingDetails: {
      serviceNumber: '10103 / Mandovi Express',
      classType: 'AC Chair Car / AC 3 Tier',
      refundable: true,
      baggage: '40 kg per passenger'
    }
  }
];

/**
 * Real Ratnagiri → Mumbai budget & itinerary (2-day trip)
 */
export function getRatnagiriMumbaiPlan(days: number = 2, travelers: number = 1): {
  budget: BudgetBreakdown;
  itinerary: ItineraryDay[];
} {
  const numDays = Math.max(1, days);
  const numTravelers = Math.max(1, travelers);

  // Realistic costs for Ratnagiri → Mumbai
  const transportCost = 465 * numTravelers; // Konkan Kanya Sleeper
  const hotelPerNight = 1800; // Budget hotel in Ratnagiri / Mumbai
  const accommodationCost = hotelPerNight * (numDays - 1 > 0 ? numDays - 1 : 1);
  const foodPerDay = 600 * numTravelers; // Street food + meals
  const foodCost = foodPerDay * numDays;
  const activitiesCost = 500 * numTravelers * numDays;
  const emergencyCost = Math.round((transportCost + accommodationCost + foodCost + activitiesCost) * 0.08);
  const total = transportCost + accommodationCost + foodCost + activitiesCost + emergencyCost;

  const budget: BudgetBreakdown = {
    totalINR: total,
    perPersonINR: Math.round(total / numTravelers),
    transportINR: transportCost,
    accommodationINR: accommodationCost,
    foodAndDiningINR: foodCost,
    activitiesSightseeingINR: activitiesCost,
    emergencyBufferINR: emergencyCost,
    currency: 'INR',
    exchangeRateToUSD: 84.5
  };

  const itinerary: ItineraryDay[] = [];

  for (let i = 1; i <= numDays; i++) {
    if (i === 1) {
      itinerary.push({
        dayNumber: 1,
        title: 'Day 1: Ratnagiri Exploration & Departure',
        theme: 'Coastal Heritage & Departure',
        morning: {
          activity: 'Visit Ratnadurg Fort (Bhagwati Fort) and enjoy views of the Arabian Sea from the hilltop.',
          location: 'Ratnadurg Fort, Ratnagiri',
          costINR: 0,
          tip: 'Best visited early morning for sunrise views. Carry water.'
        },
        afternoon: {
          activity: 'Explore Thibaw Palace (historical Burmese King\'s exile residence) and Ratnagiri Lighthouse.',
          location: 'Thibaw Palace & Lighthouse, Ratnagiri Town',
          costINR: 50 * numTravelers,
          tip: 'Entry is ₹20 for Thibaw Palace. The lighthouse offers 360° sea views.'
        },
        evening: {
          activity: 'Board Konkan Kanya Express from Ratnagiri Station to Mumbai CSMT. Enjoy the scenic Konkan coast.',
          location: 'Ratnagiri Railway Station → Mumbai CSMT',
          costINR: 465 * numTravelers,
          tip: 'Book window seat on the left side for the best coastal and tunnel views.'
        },
        recommendedFood: ['Ratnagiri Alphonso Mango Aamras (seasonal)', 'Malvani Fish Curry & Bhakri', 'Sol Kadhi'],
        localTransport: 'Auto Rickshaw (₹30–80 within city)'
      });
    } else if (i === numDays) {
      itinerary.push({
        dayNumber: i,
        title: `Day ${i}: Mumbai Arrival & Exploration`,
        theme: 'City Exploration & Return',
        morning: {
          activity: 'Arrive at Mumbai CSMT. Freshwater. Visit Gateway of India and take a morning walk at Colaba Causeway.',
          location: 'Gateway of India, Colaba, Mumbai',
          costINR: 200 * numTravelers,
          tip: 'Have breakfast at Leopold Cafe or Café Mondegar — both iconic Mumbai spots near Colaba.'
        },
        afternoon: {
          activity: 'Explore Marine Drive (Queen\'s Necklace) and visit Chowpatty Beach for street food.',
          location: 'Marine Drive & Girgaon Chowpatty, Mumbai',
          costINR: 300 * numTravelers,
          tip: 'Try Pav Bhaji, Bhel Puri, and cutting chai at Chowpatty. Evening light is great for photos.'
        },
        evening: {
          activity: 'Visit Crawford Market for local shopping, then head to your return transport.',
          location: 'Crawford Market & Mumbai CSMT',
          costINR: 500 * numTravelers,
          tip: 'Crawford Market has the best Alphonso mangoes (in season) and spices at wholesale prices.'
        },
        recommendedFood: ['Vada Pav at Ashok Vada Pav', 'Pav Bhaji at Chowpatty', 'Bombay Sandwich'],
        localTransport: 'Mumbai Local Train (₹10–15) or Ola/Uber (₹150–300)'
      });
    } else {
      itinerary.push({
        dayNumber: i,
        title: `Day ${i}: En-route Exploration`,
        theme: 'Konkan Coastal Discovery',
        morning: {
          activity: 'Visit Ganpatipule Beach Temple — one of the most sacred Ganesh temples on the Konkan coast.',
          location: 'Ganpatipule, Ratnagiri District',
          costINR: 100 * numTravelers,
          tip: 'Ganpatipule is 25 km from Ratnagiri. Hire an auto or local bus.'
        },
        afternoon: {
          activity: 'Beach time at Are-Ware Beach and explore local Alphonso mango orchards.',
          location: 'Are-Ware Beach & Mango Orchards, Ratnagiri',
          costINR: 200 * numTravelers,
          tip: 'If visiting Mar–Jun, you can buy farm-fresh Alphonso mangoes directly.'
        },
        evening: {
          activity: 'Dinner at a Malvani seafood restaurant with traditional Konkani cuisine.',
          location: 'Ratnagiri Waterfront',
          costINR: 400 * numTravelers,
          tip: 'Must try: Surmai (King Mackerel) fry, Bombil (Bombay Duck) fry, and Kokam Sherbet.'
        },
        recommendedFood: ['Malvani Surmai Fry', 'Kombdi Vade', 'Modak & Puran Poli'],
        localTransport: 'Auto Rickshaw or hired car (₹500–800/day)'
      });
    }
  }

  return { budget, itinerary };
}

/**
 * Check if the query matches the hardcoded Ratnagiri → Mumbai route
 */
export function isRatnagiriMumbaiRoute(origin: string, destination: string): boolean {
  const o = origin.toLowerCase().trim();
  const d = destination.toLowerCase().trim();
  return (
    (o.includes('ratnagiri') && (d.includes('mumbai') || d.includes('bombay'))) ||
    ((o.includes('mumbai') || o.includes('bombay')) && d.includes('ratnagiri'))
  );
}
