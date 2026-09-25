import React, { createContext, useContext, useState, useEffect } from 'react';
import { SearchQuery, TravelOption, BudgetBreakdown, ItineraryDay } from '../types/travel';
import { planTravelWithGemini, GeminiPlanResult, getGeminiApiKey } from '../services/geminiService';

interface TravelContextType {
  searchQuery: SearchQuery;
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
  options: TravelOption[];
  budgetPlan: BudgetBreakdown | null;
  itinerary: ItineraryDay[] | null;
  isLoading: boolean;
  aiStatus: { hasKey: boolean; source: 'gemini-ai' | 'algorithmic-engine'; message?: string };
  selectedOptionForBooking: TravelOption | null;
  setSelectedOptionForBooking: (opt: TravelOption | null) => void;
  searchTravel: (customQuery?: Partial<SearchQuery>) => Promise<void>;
  filterCategory: 'all' | 'cheapest' | 'fastest' | 'recommended';
  setFilterCategory: (cat: 'all' | 'cheapest' | 'fastest' | 'recommended') => void;
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOptionForBooking, setSelectedOptionForBooking] = useState<TravelOption | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'cheapest' | 'fastest' | 'recommended'>('all');
  const [aiStatus, setAiStatus] = useState<{ hasKey: boolean; source: 'gemini-ai' | 'algorithmic-engine'; message?: string }>({
    hasKey: !!getGeminiApiKey(),
    source: 'algorithmic-engine'
  });

  const searchTravel = async (customQuery?: Partial<SearchQuery>) => {
    const activeQ = { ...searchQuery, ...customQuery };
    setIsLoading(true);

    try {
      const result: GeminiPlanResult = await planTravelWithGemini(activeQ);
      setOptions(result.options);
      if (result.budget) setBudgetPlan(result.budget);
      if (result.itinerary) setItinerary(result.itinerary);

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
        isLoading,
        aiStatus,
        selectedOptionForBooking,
        setSelectedOptionForBooking,
        searchTravel,
        filterCategory,
        setFilterCategory
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
