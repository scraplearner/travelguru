import React, { createContext, useContext, useState, useEffect } from 'react';
import { SearchQuery, TravelOption, BudgetBreakdown, ItineraryDay, DestinationWeather } from '../types/travel';
import { planTravelWithGemini, GeminiPlanResult, getGeminiApiKey } from '../services/geminiService';
import { fetchDestinationWeather, adaptItineraryForWeather } from '../services/weatherService';

interface TravelContextType {
  searchQuery: SearchQuery;
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
  options: TravelOption[];
  budgetPlan: BudgetBreakdown | null;
  itinerary: ItineraryDay[] | null;
  weather: DestinationWeather | null;
  isLoading: boolean;
  aiStatus: { hasKey: boolean; source: 'gemini-ai' | 'algorithmic-engine'; message?: string };
  selectedOptionForBooking: TravelOption | null;
  setSelectedOptionForBooking: (opt: TravelOption | null) => void;
  searchTravel: (customQuery?: Partial<SearchQuery>) => Promise<void>;
  filterCategory: 'all' | 'cheapest' | 'fastest' | 'recommended';
  setFilterCategory: (cat: 'all' | 'cheapest' | 'fastest' | 'recommended') => void;
  simulateRainDay2: boolean;
  setSimulateRainDay2: (simulate: boolean) => void;
  toggleRainSimulation: () => void;
}

const defaultQuery: SearchQuery = {
  origin: 'Ratnagiri',
  destination: 'Mumbai',
  departureDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
  travelers: 1,
  travelMode: 'all',
  travelClass: 'Economy',
  tripDays: 2,
  travelStyle: 'balanced'
};

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>(defaultQuery);
  const [options, setOptions] = useState<TravelOption[]>([]);
  const [budgetPlan, setBudgetPlan] = useState<BudgetBreakdown | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [weather, setWeather] = useState<DestinationWeather | null>(null);
  const [simulateRainDay2, setSimulateRainDay2] = useState<boolean>(true); // Enabled by default to highlight dynamic AI capability
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOptionForBooking, setSelectedOptionForBooking] = useState<TravelOption | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'cheapest' | 'fastest' | 'recommended'>('all');
  const [aiStatus, setAiStatus] = useState<{ hasKey: boolean; source: 'gemini-ai' | 'algorithmic-engine'; message?: string }>({
    hasKey: !!getGeminiApiKey(),
    source: 'algorithmic-engine'
  });

  const searchTravel = async (customQuery?: Partial<SearchQuery>, overrideRainSim?: boolean) => {
    const activeQ = { ...searchQuery, ...customQuery };
    const rainSim = overrideRainSim !== undefined ? overrideRainSim : simulateRainDay2;
    setIsLoading(true);

    try {
      // 1. Fetch live or calibrated destination weather
      const weatherData = await fetchDestinationWeather(activeQ.destination, activeQ.tripDays || 4, rainSim);
      setWeather(weatherData);

      // 2. Fetch or calculate multi-modal itinerary & budget
      const result: GeminiPlanResult = await planTravelWithGemini(activeQ);
      setOptions(result.options);
      if (result.budget) setBudgetPlan(result.budget);

      // 3. Adapt itinerary for weather (if heavy rain predicted on Day 2, swap outdoor for indoor)
      if (result.itinerary) {
        const adapted = adaptItineraryForWeather(result.itinerary, weatherData);
        setItinerary(adapted);
      }

      setAiStatus({
        hasKey: !!getGeminiApiKey(),
        source: result.source,
        message: result.aiOverview
      });
    } catch (err: any) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRainSimulation = async () => {
    const nextState = !simulateRainDay2;
    setSimulateRainDay2(nextState);

    // Re-adapt active itinerary dynamically without full network reload
    if (searchQuery.destination) {
      const weatherData = await fetchDestinationWeather(searchQuery.destination, searchQuery.tripDays || 4, nextState);
      setWeather(weatherData);

      if (itinerary && itinerary.length > 0) {
        const adapted = adaptItineraryForWeather(itinerary, weatherData);
        setItinerary(adapted);
      }
    }
  };

  useEffect(() => {
    searchTravel();
  }, []);

  return (
    <TravelContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        options,
        budgetPlan,
        itinerary,
        weather,
        isLoading,
        aiStatus,
        selectedOptionForBooking,
        setSelectedOptionForBooking,
        searchTravel,
        filterCategory,
        setFilterCategory,
        simulateRainDay2,
        setSimulateRainDay2,
        toggleRainSimulation
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) throw new Error('useTravel must be used within a TravelProvider');
  return context;
};

