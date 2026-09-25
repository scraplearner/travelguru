/**
 * Deep-linking Engine for Travel Booking Providers
 * Pre-fills Origin, Destination, Departure Date, Passengers, and Travel Class
 * directly into destination URLs across Flights, Trains, Buses, and Cabs.
 */

export interface DeepLinkProvider {
  name: string;
  category: 'Flights' | 'Trains' | 'Buses' | 'Cabs / Driving';
  logoText: string;
  badge?: string;
  url: string;
  description: string;
}

// City / Hub airport & rail code mapping
const CITY_CODES: Record<string, { airport: string; rail: string; busSlug: string }> = {
  delhi: { airport: 'DEL', rail: 'NDLS', busSlug: 'delhi' },
  mumbai: { airport: 'BOM', rail: 'CSMT', busSlug: 'mumbai' },
  bengaluru: { airport: 'BLR', rail: 'SBC', busSlug: 'bangalore' },
  bangalore: { airport: 'BLR', rail: 'SBC', busSlug: 'bangalore' },
  goa: { airport: 'GOI', rail: 'MAO', busSlug: 'goa' },
  jaipur: { airport: 'JAI', rail: 'JP', busSlug: 'jaipur' },
  varanasi: { airport: 'VNS', rail: 'BSB', busSlug: 'varanasi' },
  kolkata: { airport: 'CCU', rail: 'HWH', busSlug: 'kolkata' },
  chennai: { airport: 'MAA', rail: 'MAS', busSlug: 'chennai' },
  hyderabad: { airport: 'HYD', rail: 'SC', busSlug: 'hyderabad' },
  kochi: { airport: 'COK', rail: 'ERS', busSlug: 'kochi' },
  srinagar: { airport: 'SXR', rail: 'SINA', busSlug: 'srinagar' },
  leh: { airport: 'IXL', rail: 'NDLS', busSlug: 'leh' },
  ahmedabad: { airport: 'AMD', rail: 'ADI', busSlug: 'ahmedabad' },
  pune: { airport: 'PNQ', rail: 'PUNE', busSlug: 'pune' },
  amritsar: { airport: 'ATQ', rail: 'ASR', busSlug: 'amritsar' },
  udaipur: { airport: 'UDR', rail: 'UDZ', busSlug: 'udaipur' },
  lucknow: { airport: 'LKO', rail: 'LKO', busSlug: 'lucknow' },
  chandigarh: { airport: 'IXC', rail: 'CDG', busSlug: 'chandigarh' },
  bhopal: { airport: 'BHO', rail: 'RKMP', busSlug: 'bhopal' },
  patna: { airport: 'PAT', rail: 'PNBE', busSlug: 'patna' },
  guwahati: { airport: 'GAU', rail: 'GHY', busSlug: 'guwahati' },
  london: { airport: 'LHR', rail: 'KGX', busSlug: 'london' },
  paris: { airport: 'CDG', rail: 'GDN', busSlug: 'paris' },
  zurich: { airport: 'ZRH', rail: 'ZRH', busSlug: 'zurich' },
  rome: { airport: 'FCO', rail: 'ROM', busSlug: 'rome' },
  dubai: { airport: 'DXB', rail: 'DXB', busSlug: 'dubai' },
  singapore: { airport: 'SIN', rail: 'SIN', busSlug: 'singapore' },
  bangkok: { airport: 'BKK', rail: 'BKK', busSlug: 'bangkok' },
  tokyo: { airport: 'HND', rail: 'TYO', busSlug: 'tokyo' },
  sydney: { airport: 'SYD', rail: 'SYD', busSlug: 'sydney' },
  newyork: { airport: 'JFK', rail: 'NYP', busSlug: 'new-york' },
  sanfrancisco: { airport: 'SFO', rail: 'SFO', busSlug: 'san-francisco' }
};

function cleanCity(city: string): string {
  return (city || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getCityAirportCode(city: string): string {
  const c = cleanCity(city);
  return CITY_CODES[c]?.airport || city.substring(0, 3).toUpperCase();
}

export function getCityRailCode(city: string): string {
  const c = cleanCity(city);
  return CITY_CODES[c]?.rail || city.substring(0, 4).toUpperCase();
}

export function getCitySlug(city: string): string {
  const c = cleanCity(city);
  return CITY_CODES[c]?.busSlug || (city || '').toLowerCase().replace(/\s+/g, '-');
}

/**
 * Format date for various providers:
 * - ISO: YYYY-MM-DD
 * - MMT: DD/MM/YYYY
 * - Skyscanner: YYMMDD
 */
export function formatTravelDate(dateStr?: string): {
  iso: string;
  ddmmyyyy: string;
  yymmdd: string;
  readable: string;
} {
  const d = dateStr ? new Date(dateStr) : new Date(Date.now() + 86400000 * 3);
  const valid = !isNaN(d.getTime()) ? d : new Date(Date.now() + 86400000 * 3);

  const y = valid.getFullYear();
  const m = String(valid.getMonth() + 1).padStart(2, '0');
  const day = String(valid.getDate()).padStart(2, '0');

  return {
    iso: `${y}-${m}-${day}`,
    ddmmyyyy: `${day}/${m}/${y}`,
    yymmdd: `${String(y).slice(2)}${m}${day}`,
    readable: valid.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  };
}

/**
 * Generates all deep-linking booking providers with full user parameters pre-filled.
 */
export function generatePrefilledDeepLinks(
  origin: string,
  destination: string,
  dateStr: string,
  travelers: number = 1,
  travelMode: 'flight' | 'train' | 'bus' | 'road' | 'all' = 'flight',
  travelClass: string = 'Economy'
): DeepLinkProvider[] {
  const dates = formatTravelDate(dateStr);
  const origAirport = getCityAirportCode(origin);
  const destAirport = getCityAirportCode(destination);
  const origRail = getCityRailCode(origin);
  const destRail = getCityRailCode(destination);
  const origSlug = getCitySlug(origin);
  const destSlug = getCitySlug(destination);
  const numTravelers = Math.max(1, travelers || 1);

  const links: DeepLinkProvider[] = [];

  // ===================== FLIGHTS =====================
  // 1. Google Flights with prefilled query
  const gFlightsUrl = `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destAirport)}%20from%20${encodeURIComponent(origAirport)}%20on%20${dates.iso}&adults=${numTravelers}`;
  links.push({
    name: 'Google Flights',
    category: 'Flights',
    logoText: '✈️ Google Flights',
    badge: 'Live Aggregator',
    url: gFlightsUrl,
    description: `Prefilled ${origAirport} ➔ ${destAirport} for ${numTravelers} passenger(s) on ${dates.readable}`
  });

  // 2. MakeMyTrip Flights
  // MMT format: https://www.makemytrip.com/flight/search?itinerary=DEL-BOM-15/10/2026&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E
  const mmtFlightUrl = `https://www.makemytrip.com/flight/search?itinerary=${origAirport}-${destAirport}-${dates.ddmmyyyy}&tripType=O&paxType=A-${numTravelers}_C-0_I-0&intl=false&cabinClass=${travelClass.toLowerCase().includes('bus') ? 'B' : 'E'}`;
  links.push({
    name: 'MakeMyTrip Flights',
    category: 'Flights',
    logoText: '🔴 MakeMyTrip',
    badge: 'Instant Instant Seat Lock',
    url: mmtFlightUrl,
    description: `Direct flight search for ${origAirport} to ${destAirport} (${dates.ddmmyyyy})`
  });

  // 3. Skyscanner
  const skyscannerUrl = `https://www.skyscanner.co.in/transport/flights/${origAirport.toLowerCase()}/${destAirport.toLowerCase()}/${dates.yymmdd}/?adultsv2=${numTravelers}&cabinclass=${travelClass.toLowerCase().includes('bus') ? 'business' : 'economy'}`;
  links.push({
    name: 'Skyscanner',
    category: 'Flights',
    logoText: '🌐 Skyscanner',
    badge: 'Cheapest Fares',
    url: skyscannerUrl,
    description: `International & domestic price comparison with pre-selected dates`
  });

  // ===================== TRAINS =====================
  // 4. ConfirmTkt
  const confirmTktUrl = `https://www.confirmtkt.com/rbooking-d/trains/from/${origRail}/to/${destRail}/date/${dates.ddmmyyyy}`;
  links.push({
    name: 'ConfirmTkt',
    category: 'Trains',
    logoText: '🚆 ConfirmTkt (IRCTC Partner)',
    badge: 'High Confirm Probability',
    url: confirmTktUrl,
    description: `Station ${origRail} to ${destRail} on ${dates.readable} with seat availability & PNR guarantee`
  });

  // 5. Official IRCTC e-Ticketing
  const irctcUrl = `https://www.irctc.co.in/nget/booking?src=${origRail}&dst=${destRail}&date=${dates.ddmmyyyy}`;
  links.push({
    name: 'IRCTC Official',
    category: 'Trains',
    logoText: '🇮🇳 IRCTC',
    badge: 'Govt. Official',
    url: irctcUrl,
    description: `Official railway reservation portal prefilled with ${origRail} to ${destRail}`
  });

  // 6. RailYatri
  const railYatriUrl = `https://www.railyatri.in/train-ticket/search?from_code=${origRail}&to_code=${destRail}&journey_date=${dates.ddmmyyyy}`;
  links.push({
    name: 'RailYatri',
    category: 'Trains',
    logoText: '🚉 RailYatri',
    badge: 'Live Running Status',
    url: railYatriUrl,
    description: `Fast booking with live train schedule and seat maps`
  });

  // ===================== BUSES =====================
  // 7. RedBus
  const redBusUrl = `https://www.redbus.in/bus-tickets/${origSlug}-to-${destSlug}?date=${dates.iso}`;
  links.push({
    name: 'redBus',
    category: 'Buses',
    logoText: '🚌 redBus',
    badge: '10,000+ AC Coaches',
    url: redBusUrl,
    description: `Prefilled ${origin} to ${destination} route for ${dates.readable}`
  });

  // 8. AbhiBus
  const abhibusUrl = `https://www.abhibus.com/bus_search/${origSlug}/${destSlug}/${dates.iso}`;
  links.push({
    name: 'AbhiBus',
    category: 'Buses',
    logoText: '🚍 AbhiBus',
    badge: 'Zero Convenience Fee',
    url: abhibusUrl,
    description: `Direct sleeper & seater inventory with real-time tracking`
  });

  // ===================== CABS / ROAD =====================
  // 9. Uber Intercity / Ride
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(destination)}`;
  links.push({
    name: 'Uber Intercity',
    category: 'Cabs / Driving',
    logoText: '🚗 Uber',
    badge: 'On-Demand Cab',
    url: uberUrl,
    description: `Book cab from current location to ${destination}`
  });

  // 10. Google Maps Directions
  const gMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
  links.push({
    name: 'Google Maps Driving Route',
    category: 'Cabs / Driving',
    logoText: '🗺️ Google Maps',
    badge: 'Live GPS Navigation',
    url: gMapsUrl,
    description: `Turn-by-turn navigation with toll estimates and live traffic`
  });

  // Filter based on selected mode if not 'all'
  if (travelMode === 'flight') {
    return links.filter(l => l.category === 'Flights');
  } else if (travelMode === 'train') {
    return links.filter(l => l.category === 'Trains');
  } else if (travelMode === 'bus') {
    return links.filter(l => l.category === 'Buses');
  } else if (travelMode === 'road') {
    return links.filter(l => l.category === 'Cabs / Driving');
  }

  return links;
}
