import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, DollarSign, Compass, Utensils, MapPin, Shield, CheckCircle2, ChevronDown, ChevronUp, Wallet } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { TravelStyle } from '../../types/travel';

export const AIPlannerSection: React.FC = () => {
  const { searchQuery, setSearchQuery, budgetPlan, itinerary, searchTravel, isLoading } = useTravel();

  const [days, setDays] = useState(searchQuery.tripDays || 4);
  const [startDate, setStartDate] = useState(searchQuery.departureDate);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(searchQuery.travelStyle || 'balanced');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

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

        {/* Day-by-Day Itinerary Section */}
        {itinerary && itinerary.length > 0 && (
          <div className="itinerary-accordion-section">
            <h3 className="itinerary-section-heading">
              📅 Curated {itinerary.length}-Day Itinerary for {searchQuery.destination}
            </h3>

            <div className="days-stack">
              {itinerary.map(day => {
                const isOpen = expandedDay === day.dayNumber;

                return (
                  <div key={day.dayNumber} className={`day-accordion-card ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="day-accordion-header"
                      onClick={() => toggleDay(day.dayNumber)}
                    >
                      <div className="day-header-left">
                        <span className="day-badge-chip">Day {day.dayNumber}</span>
                        <h4>{day.title}</h4>
                        <span className="day-theme-tag">{day.theme}</span>
                      </div>
                      <div className="day-header-right">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="day-accordion-body">
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
