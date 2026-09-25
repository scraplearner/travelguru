import React, { useState } from 'react';
import { Search, ArrowLeftRight, Calendar, Users, Plane, Train, Bus, Car, SlidersHorizontal, Sparkles, ShieldCheck } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { TravelMode } from '../../types/travel';

const QUICK_DESTINATIONS = [
  { name: 'Mumbai', code: 'BOM' },
  { name: 'Ratnagiri', code: 'RN' },
  { name: 'Delhi', code: 'DEL' },
  { name: 'Goa', code: 'GOI' },
  { name: 'Jaipur', code: 'JAI' },
  { name: 'Bengaluru', code: 'BLR' },
  { name: 'Varanasi', code: 'VNS' },
];

export const TravelSearchForm: React.FC = () => {
  const { searchQuery, setSearchQuery, searchTravel, isLoading } = useTravel();

  const [origin, setOrigin] = useState(searchQuery.origin);
  const [destination, setDestination] = useState(searchQuery.destination);
  const [departureDate, setDepartureDate] = useState(searchQuery.departureDate);
  const [travelers, setTravelers] = useState(searchQuery.travelers);
  const [travelMode, setTravelMode] = useState<TravelMode>(searchQuery.travelMode);
  const [travelClass, setTravelClass] = useState(searchQuery.travelClass);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      origin,
      destination,
      departureDate,
      travelers,
      travelMode,
      travelClass
    };
    setSearchQuery(prev => ({ ...prev, ...updated }));
    searchTravel(updated);
  };

  const handleQuickDestination = (destName: string) => {
    setDestination(destName);
    const updated = {
      origin,
      destination: destName,
      departureDate,
      travelers,
      travelMode,
      travelClass
    };
    setSearchQuery(prev => ({ ...prev, ...updated }));
    searchTravel(updated);
  };

  return (
    <div className="travel-search-hero-card">
      <div className="search-card-top-row">
        <div className="search-title-badge">
          <Sparkles size={16} className="badge-sparkle-icon" />
          <span>Spatial Multi-Modal Journey Finder</span>
        </div>

        {/* Live Feasibility & Safety Engine Callout Banner (Stitch) */}
        <div className="stitch-feasibility-banner">
          <div className="feasibility-left">
            <ShieldCheck size={15} className="text-emerald" />
            <div className="feasibility-text">
              <span className="feasibility-status">✓ Safe Corridor</span>
              <span className="feasibility-divider">·</span>
              <span>Score: <strong>98/100</strong></span>
            </div>
          </div>
          <span className="gis-synced-pill">GIS Synced</span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mode-toggle-group">
          {(
            [
              { id: 'all', label: 'All Modes', icon: SlidersHorizontal },
              { id: 'flight', label: 'Flights', icon: Plane },
              { id: 'train', label: 'Trains', icon: Train },
              { id: 'bus', label: 'Buses', icon: Bus },
              { id: 'road', label: 'Driving / Cabs', icon: Car }
            ] as const
          ).map(tab => {
            const Icon = tab.icon;
            const isSelected = travelMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`mode-tab-button ${isSelected ? 'active' : ''}`}
                onClick={() => setTravelMode(tab.id)}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="search-inputs-grid">
        {/* Origin */}
        <div className="search-field-box">
          <label htmlFor="input-origin">From (Origin)</label>
          <div className="field-input-wrapper">
            <input
              id="input-origin"
              type="text"
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              placeholder="e.g. Ratnagiri, Delhi"
              required
            />
          </div>
        </div>

        {/* Swap Button */}
        <button
          type="button"
          className="btn-swap-locations"
          onClick={handleSwap}
          title="Swap origin and destination"
        >
          <ArrowLeftRight size={16} />
        </button>

        {/* Destination */}
        <div className="search-field-box">
          <label htmlFor="input-destination">To (Destination)</label>
          <div className="field-input-wrapper">
            <input
              id="input-destination"
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Mumbai, Goa"
              required
            />
          </div>
        </div>

        {/* Departure Date */}
        <div className="search-field-box">
          <label htmlFor="input-departure-date">Departure Date</label>
          <div className="field-input-wrapper">
            <Calendar size={16} className="field-icon" />
            <input
              id="input-departure-date"
              type="date"
              value={departureDate}
              onChange={e => setDepartureDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Travelers Count */}
        <div className="search-field-box travelers-box">
          <label htmlFor="input-travelers">Travelers</label>
          <div className="field-input-wrapper">
            <Users size={16} className="field-icon" />
            <select
              id="input-travelers"
              value={travelers}
              onChange={e => setTravelers(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Traveler' : 'Travelers'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Search Button */}
        <button type="submit" className="btn-search-submit" disabled={isLoading}>
          {isLoading ? (
            <div className="search-loading-spinner"></div>
          ) : (
            <>
              <Search size={18} />
              <span>Search Routes</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Destination Suggestions */}
      <div className="quick-destinations-row">
        <span className="quick-label">Popular Routes:</span>
        <div className="quick-pills-list">
          {QUICK_DESTINATIONS.map(hub => (
            <button
              key={hub.code}
              type="button"
              className={`quick-pill ${destination.toLowerCase() === hub.name.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleQuickDestination(hub.name)}
            >
              <span>{hub.name}</span>
              <span className="hub-code">{hub.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
