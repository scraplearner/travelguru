import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Compass, 
  Utensils, 
  MapPin, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  CloudRain,
  Sun,
  Umbrella,
  BookmarkCheck,
  FolderHeart,
  RefreshCw
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { useAuth } from '../../context/AuthContext';
import { TravelStyle } from '../../types/travel';

export const AIPlannerSection: React.FC = () => {
  const { searchQuery, setSearchQuery, budgetPlan, itinerary, weather, simulateRainDay2, toggleRainSimulation, searchTravel, isLoading } = useTravel();
  const { createTrip, setIsSavedTripsModalOpen } = useAuth();

  const [days, setDays] = useState(searchQuery.tripDays || 4);
  const [startDate, setStartDate] = useState(searchQuery.departureDate);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(searchQuery.travelStyle || 'balanced');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      tripDays: days,
      departureDate: startDate,
      travelStyle
    };
    setSearchQuery(prev => ({ ...prev, ...updated }));
    searchTravel(updated);
  };

  const toggleDay = (dayNum: number) => {
    setExpandedDay(prev => (prev === dayNum ? null : dayNum));
  };

  const handleSaveTripToDatabase = () => {
    if (!itinerary || !budgetPlan) return;
    try {
      createTrip({
        title: `${searchQuery.destination} ${days}-Day Expedition`,
        origin: searchQuery.origin,
        destination: searchQuery.destination,
        departureDate: startDate,
        travelers: searchQuery.travelers,
        tripDays: days,
        totalBudgetINR: budgetPlan.totalINR,
        itinerary,
        notes: weather?.hasRainAlert 
          ? `Day ${weather.rainAlertDay} Rain adaptation active: Outdoor activities proactively swapped for indoor art and heritage museums.` 
          : 'Planned with Travel Guru AI multi-modal engine.',
        hasWeatherAdaptation: weather?.hasRainAlert,
        weatherAlert: weather?.hasRainAlert ? `Day ${weather.rainAlertDay} Rain-Adapted` : undefined
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (e: any) {
      alert(e.message || 'Please log in to save trips.');
    }
  };

  return (
    <section className="ai-planner-section">
      <div className="planner-glass-container">
        {/* Planner Header */}
        <div className="planner-header-block">
          <div className="ai-tag-pill">
            <Sparkles size={16} />
            <span>AI Itinerary & Budget Architect</span>
          </div>
          <h2>
            Plan Your Complete Expedition with <span className="text-gradient-sky">Travel Guru AI</span>
          </h2>
          <p>
            Decide your entire voyage with us: enter your trip duration, starting date, and travel style.
            Our AI calculates a complete itemized budget, optimal routes, and a tailored day-by-day itinerary.
          </p>
        </div>

        {/* Input Controls Form */}
        <form onSubmit={handleGeneratePlan} className="planner-input-strip">
          <div className="planner-input-field">
            <label htmlFor="planner-days">
              <Clock size={15} /> Travel Duration (Days)
            </label>
            <div className="select-with-unit">
              <select
                id="planner-days"
                value={days}
                onChange={e => setDays(Number(e.target.value))}
              >
                {[2, 3, 4, 5, 6, 7, 8, 10, 14].map(d => (
                  <option key={d} value={d}>
                    {d} Days ({d - 1} Nights)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="planner-input-field">
            <label htmlFor="planner-start-date">
              <Calendar size={15} /> Start Date
            </label>
            <input
              id="planner-start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="planner-input-field">
            <label htmlFor="planner-style">
              <Compass size={15} /> Travel Style & Comfort
            </label>
            <select
              id="planner-style"
              value={travelStyle}
              onChange={e => setTravelStyle(e.target.value as TravelStyle)}
            >
              <option value="budget">💰 Budget-Savvy Explorer</option>
              <option value="balanced">⚖️ Balanced Comfort</option>
              <option value="luxury">👑 Luxury Retreat</option>
              <option value="adventure">⛰️ High Adventure</option>
            </select>
          </div>

          <button type="submit" className="btn-generate-ai-plan" disabled={isLoading}>
            <Sparkles size={18} />
            <span>{isLoading ? 'Architecting Plan...' : 'Calculate Budget & Itinerary'}</span>
          </button>
        </form>

        {/* Active Route Summary Callout */}
        <div className="planner-current-context-bar">
          <span>
            Route: <strong>{searchQuery.origin}</strong> ➔ <strong>{searchQuery.destination}</strong>
          </span>
          <span className="dot-sep">•</span>
          <span>
            Travelers: <strong>{searchQuery.travelers} Person(s)</strong>
          </span>
          <span className="dot-sep">•</span>
          <span>
            Duration: <strong>{days} Days</strong> starting on <strong>{startDate}</strong>
          </span>
        </div>

        {/* Dynamic Weather Forecast & Rain Adaptation Showcase */}
        {weather && (
          <div className="destination-weather-showcase">
            <div className="weather-overview-bar">
              <div className="weather-city-meta">
                <div className="weather-temp-badge">
                  {weather.condition.includes('Rain') ? <CloudRain size={22} className="text-flight-sky" /> : <Sun size={22} className="text-amber" />}
                  <span className="weather-temp-num">{weather.currentTempC}°C</span>
                </div>
                <div className="weather-city-details">
                  <span className="weather-dest-name">{weather.destination}</span>
                  <span className="weather-cond-label">{weather.condition} • {weather.source}</span>
                </div>
              </div>

              {/* Day-by-Day Forecast Mini Pills */}
              <div className="weather-days-mini-strip">
                {weather.forecast.map(f => (
                  <div key={f.dayNumber} className={`weather-mini-day-pill ${f.isRainy ? 'rainy' : 'sunny'}`}>
                    <span className="mini-day-num">Day {f.dayNumber}</span>
                    <span className="mini-day-icon">{f.isRainy ? '🌧️' : '☀️'}</span>
                    <span className="mini-day-temp">{f.tempMaxC}°</span>
                    {f.isRainy && <span className="mini-rain-pct">{f.precipitationChance}% rain</span>}
                  </div>
                ))}
              </div>

              {/* Interactive Rain Simulation Toggle */}
              <button
                type="button"
                className={`btn-rain-simulation-toggle ${simulateRainDay2 ? 'active' : ''}`}
                onClick={toggleRainSimulation}
                title="Toggle simulation of heavy rain on Day 2 to test dynamic indoor activity adaptation"
              >
                <Umbrella size={14} />
                <span>Day 2 Rain Sim: <strong>{simulateRainDay2 ? 'ACTIVE' : 'OFF'}</strong></span>
                <RefreshCw size={12} />
              </button>
            </div>

            {/* Smart Rain Adaptation Callout Banner */}
            {weather.hasRainAlert && (
              <div className="weather-adaptation-alert-banner">
                <div className="alert-banner-icon">
                  <CloudRain size={22} className="text-flight-sky" />
                </div>
                <div className="alert-banner-content">
                  <div className="alert-banner-title">
                    <span>🌧️ Weather-Based Itinerary Adaptation: Heavy Rain Predicted on Day {weather.rainAlertDay} ({weather.rainDayPrecipitation}% Precip)</span>
                  </div>
                  <p className="alert-banner-desc">
                    To prevent weather disruptions, our AI planner automatically swapped outdoor sightseeing (beaches, fort treks & walking trails) for premier indoor museums, contemporary art galleries, and covered heritage dining!
                  </p>
                </div>
                <span className="adaptation-verified-tag">✓ Dynamic AI Swap</span>
              </div>
            )}
          </div>
        )}

        {/* Budget Breakdown & Daily Plan Display */}
        {budgetPlan && (
          <div className="budget-results-showcase">
            {/* Top Total Budget Banner */}
            <div className="budget-hero-summary">
              <div className="budget-stat-item">
                <span className="stat-label">Estimated Total Expedition Budget</span>
                <div className="stat-value-large">
                  ₹{budgetPlan.totalINR.toLocaleString('en-IN')}
                </div>
                <span className="stat-sub">
                  ≈ ${(budgetPlan.totalINR / (budgetPlan.exchangeRateToUSD || 84.5)).toFixed(0)} USD for all travelers
                </span>
              </div>

              <div className="budget-stat-item divider-left">
                <span className="stat-label">Per-Person Average</span>
                <div className="stat-value-medium">
                  ₹{budgetPlan.perPersonINR.toLocaleString('en-IN')}
                </div>
                <span className="stat-sub">
                  ₹{Math.round(budgetPlan.perPersonINR / days).toLocaleString('en-IN')} / person / day
                </span>
              </div>
            </div>

            {/* Itemized Category Grid */}
            <div className="budget-categories-grid">
              <div className="budget-cat-card">
                <div className="cat-icon-row">
                  <span className="cat-icon transport">🚆</span>
                  <span className="cat-title">Transport & Intercity</span>
                </div>
                <div className="cat-amount">₹{budgetPlan.transportINR.toLocaleString('en-IN')}</div>
                <div className="cat-meter">
                  <div
                    className="meter-fill"
                    style={{ width: `${Math.min(100, (budgetPlan.transportINR / budgetPlan.totalINR) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="budget-cat-card">
                <div className="cat-icon-row">
                  <span className="cat-icon hotel">🏨</span>
                  <span className="cat-title">Accommodations ({days - 1} Nights)</span>
                </div>
                <div className="cat-amount">₹{budgetPlan.accommodationINR.toLocaleString('en-IN')}</div>
                <div className="cat-meter">
                  <div
                    className="meter-fill"
                    style={{ width: `${Math.min(100, (budgetPlan.accommodationINR / budgetPlan.totalINR) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="budget-cat-card">
                <div className="cat-icon-row">
                  <span className="cat-icon food">🍲</span>
                  <span className="cat-title">Dining & Local Flavors</span>
                </div>
                <div className="cat-amount">₹{budgetPlan.foodAndDiningINR.toLocaleString('en-IN')}</div>
                <div className="cat-meter">
                  <div
                    className="meter-fill"
                    style={{ width: `${Math.min(100, (budgetPlan.foodAndDiningINR / budgetPlan.totalINR) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="budget-cat-card">
                <div className="cat-icon-row">
                  <span className="cat-icon sight">🏛️</span>
                  <span className="cat-title">Sightseeing & Tickets</span>
                </div>
                <div className="cat-amount">₹{budgetPlan.activitiesSightseeingINR.toLocaleString('en-IN')}</div>
                <div className="cat-meter">
                  <div
                    className="meter-fill"
                    style={{ width: `${Math.min(100, (budgetPlan.activitiesSightseeingINR / budgetPlan.totalINR) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="budget-cat-card">
                <div className="cat-icon-row">
                  <span className="cat-icon buffer">🛡️</span>
                  <span className="cat-title">Contingency Buffer</span>
                </div>
                <div className="cat-amount">₹{budgetPlan.emergencyBufferINR.toLocaleString('en-IN')}</div>
                <div className="cat-meter">
                  <div
                    className="meter-fill"
                    style={{ width: `${Math.min(100, (budgetPlan.emergencyBufferINR / budgetPlan.totalINR) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Day-by-Day Itinerary Section with Weather Badges & Save Action */}
        {itinerary && itinerary.length > 0 && (
          <div className="itinerary-accordion-section">
            <div className="itinerary-section-header-row">
              <h3 className="itinerary-section-heading">
                📅 Curated {itinerary.length}-Day Itinerary for {searchQuery.destination}
              </h3>
              <div className="itinerary-header-buttons">
                <button
                  type="button"
                  className={`btn-save-itinerary-db ${savedSuccess ? 'saved' : ''}`}
                  onClick={handleSaveTripToDatabase}
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>Saved to Database!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkCheck size={16} />
                      <span>Save Trip (CRUD)</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn-view-saved-modal"
                  onClick={() => setIsSavedTripsModalOpen(true)}
                >
                  <FolderHeart size={16} />
                  <span>My Saved Trips</span>
                </button>
              </div>
            </div>

            <div className="days-stack">
              {itinerary.map(day => {
                const isOpen = expandedDay === day.dayNumber;

                return (
                  <div key={day.dayNumber} className={`day-accordion-card ${isOpen ? 'open' : ''} ${day.isAdaptedIndoor ? 'adapted-weather' : ''}`}>
                    <button
                      type="button"
                      className="day-accordion-header"
                      onClick={() => toggleDay(day.dayNumber)}
                    >
                      <div className="day-header-left">
                        <span className="day-badge-chip">Day {day.dayNumber}</span>
                        <h4>{day.title}</h4>
                        <span className="day-theme-tag">{day.theme}</span>
                        {day.weather && (
                          <span className={`day-weather-status-chip ${day.weather.isRainy ? 'rainy' : 'sunny'}`}>
                            {day.weather.isRainy ? '🌧️' : '☀️'} {day.weather.tempMaxC}°C · {day.isAdaptedIndoor ? 'Indoor Adapted' : 'Clear Outdoor'}
                          </span>
                        )}
                      </div>
                      <div className="day-header-right">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="day-accordion-body">
                        {/* Weather adaptation callout banner inside day */}
                        {day.adaptationNotice && (
                          <div className="day-adaptation-notice-box">
                            <Umbrella size={16} className="text-flight-sky" />
                            <span>{day.adaptationNotice}</span>
                          </div>
                        )}
                        <div className="activity-slots-grid">
                          {/* Morning */}
                          <div className="activity-slot-item">
                            <div className="slot-badge morning">🌅 Morning</div>
                            <p className="activity-desc">{day.morning.activity}</p>
                            <div className="slot-meta">
                              <span className="slot-loc">
                                <MapPin size={13} /> {day.morning.location}
                              </span>
                              <span className="slot-cost">₹{day.morning.costINR}</span>
                            </div>
                            <div className="slot-tip">💡 Tip: {day.morning.tip}</div>
                          </div>

                          {/* Afternoon */}
                          <div className="activity-slot-item">
                            <div className="slot-badge afternoon">☀️ Afternoon</div>
                            <p className="activity-desc">{day.afternoon.activity}</p>
                            <div className="slot-meta">
                              <span className="slot-loc">
                                <MapPin size={13} /> {day.afternoon.location}
                              </span>
                              <span className="slot-cost">₹{day.afternoon.costINR}</span>
                            </div>
                            <div className="slot-tip">💡 Tip: {day.afternoon.tip}</div>
                          </div>

                          {/* Evening */}
                          <div className="activity-slot-item">
                            <div className="slot-badge evening">🌙 Evening</div>
                            <p className="activity-desc">{day.evening.activity}</p>
                            <div className="slot-meta">
                              <span className="slot-loc">
                                <MapPin size={13} /> {day.evening.location}
                              </span>
                              <span className="slot-cost">₹{day.evening.costINR}</span>
                            </div>
                            <div className="slot-tip">💡 Tip: {day.evening.tip}</div>
                          </div>
                        </div>

                        {/* Culinary & Local Commute Callouts */}
                        <div className="day-extras-row">
                          <div className="extras-box">
                            <Utensils size={15} />
                            <span>
                              <strong>Must-Taste Flavors:</strong> {day.recommendedFood.join(' • ')}
                            </span>
                          </div>
                          <div className="extras-box">
                            <Compass size={15} />
                            <span>
                              <strong>Recommended Commute:</strong> {day.localTransport}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
