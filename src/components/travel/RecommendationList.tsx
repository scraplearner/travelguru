import React from 'react';
import { Plane, Train, Bus, Car, Clock, ShieldCheck, Star, ExternalLink, ArrowRight, Sparkles, Award, Zap, DollarSign } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { TravelOption } from '../../types/travel';

export const RecommendationList: React.FC = () => {
  const { options, isLoading, setSelectedOptionForBooking, filterCategory, setFilterCategory, searchQuery, aiStatus, searchTravel } = useTravel();

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'flight':
        return <Plane size={18} className="mode-icon flight-color" />;
      case 'train':
        return <Train size={18} className="mode-icon train-color" />;
      case 'bus':
        return <Bus size={18} className="mode-icon bus-color" />;
      case 'road':
        return <Car size={18} className="mode-icon road-color" />;
      default:
        return <Plane size={18} />;
    }
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const filteredOptions = options.filter(opt => {
    if (filterCategory === 'all') return true;
    return opt.category === filterCategory;
  });

  return (
    <section className="recommendations-container">
      {/* Section Header */}
      <div className="section-header-row">
        <div>
          <h2 className="section-title">
            Curated Routes for <span className="highlight-destination">{searchQuery.destination}</span>
          </h2>
          <p className="section-subtitle">
            AI-ranked travel modes comparing speed, budget economy, and verified comfort.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="category-filter-pills">
          <button
            className={`pill-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All Modes ({options.length})
          </button>
          <button
            className={`pill-btn pill-cheapest ${filterCategory === 'cheapest' ? 'active' : ''}`}
            onClick={() => setFilterCategory('cheapest')}
          >
            <DollarSign size={14} /> Cheapest
          </button>
          <button
            className={`pill-btn pill-fastest ${filterCategory === 'fastest' ? 'active' : ''}`}
            onClick={() => setFilterCategory('fastest')}
          >
            <Zap size={14} /> Fastest
          </button>
          <button
            className={`pill-btn pill-recommended ${filterCategory === 'recommended' ? 'active' : ''}`}
            onClick={() => setFilterCategory('recommended')}
          >
            <Award size={14} /> Recommended
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-cards-state">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      ) : filteredOptions.length === 0 ? (
        <div className="empty-results-box">
          {options.length === 0 ? (
            !aiStatus.hasKey ? (
              <>
                <div className="empty-icon">⚠️</div>
                <h3>Demo Mode Active</h3>
                <p>No API key configured in <code>.env</code>. Only the demo route <strong>Ratnagiri → Mumbai</strong> is available.</p>
                <p className="hint-text">Add your API key in <code>.env</code> file as <code>VITE_GEMINI_API_KEY</code> to unlock AI planning for any route.</p>
              </>
            ) : (
              <>
                <div className="empty-icon">🌐</div>
                <h3>No Routes Found</h3>
                <p>{aiStatus.message || `No direct travel options returned for ${searchQuery.origin} → ${searchQuery.destination}.`}</p>
                <button
                  className="btn-retry-search"
                  style={{
                    marginTop: '1rem',
                    padding: '0.6rem 1.4rem',
                    background: 'var(--primary-gradient, #4f46e5)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600
                  }}
                  onClick={() => searchTravel()}
                >
                  <Sparkles size={16} /> Retry AI Search
                </button>
              </>
            )
          ) : (
            <>
              <p>No travel routes found matching the selected filter.</p>
              <button className="btn-reset-filter" onClick={() => setFilterCategory('all')}>
                Show All Options
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="recommendations-grid">
          {filteredOptions.map(opt => {
            const isCheapest = opt.category === 'cheapest';
            const isFastest = opt.category === 'fastest';
            const isRecommended = opt.category === 'recommended';

            return (
              <div
                key={opt.id}
                className={`travel-option-card ${isRecommended ? 'card-recommended' : ''} ${isCheapest ? 'card-cheapest' : ''} ${isFastest ? 'card-fastest' : ''}`}
              >
                {/* Highlight Badge */}
                <div className="card-top-badge-row">
                  <div className="category-badge-chip">
                    {isRecommended && <Award size={14} />}
                    {isFastest && <Zap size={14} />}
                    {isCheapest && <DollarSign size={14} />}
                    <span>{opt.badge}</span>
                  </div>

                  <div className="safety-rating-badge">
                    <ShieldCheck size={14} className="shield-icon" />
                    <span>{opt.safetyScore}% Safety</span>
                  </div>
                </div>

                {/* Carrier & Mode Header */}
                <div className="card-carrier-row">
                  <div className="carrier-badge">
                    {getModeIcon(opt.mode)}
                    <div>
                      <h3 className="option-title">{opt.title}</h3>
                      <span className="carrier-name">{opt.carrier}</span>
                    </div>
                  </div>

                  <div className="option-price-box">
                    <div className="price-number">₹{opt.priceINR.toLocaleString('en-IN')}</div>
                    <span className="price-sub">
                      {searchQuery.travelers > 1 ? `Total for ${searchQuery.travelers} travelers` : 'Total fare'}
                    </span>
                  </div>
                </div>

                {/* Timeline / Route Journey */}
                <div className="route-timeline-box">
                  <div className="timeline-point origin-point">
                    <span className="time-val">{opt.departureTime}</span>
                    <span className="hub-name">{opt.originHub}</span>
                  </div>

                  <div className="timeline-connector">
                    <div className="duration-tag">
                      <Clock size={12} />
                      <span>{formatDuration(opt.durationMinutes)}</span>
                    </div>
                    <div className="connector-line">
                      <div className="connector-dot start"></div>
                      <div className="connector-dash"></div>
                      <div className="connector-dot end"></div>
                    </div>
                    <span className="stops-label">
                      {opt.stops.length === 0 ? 'Non-Stop Direct' : `${opt.stops.length} Scheduled Stop(s)`}
                    </span>
                  </div>

                  <div className="timeline-point destination-point">
                    <span className="time-val">{opt.arrivalTime}</span>
                    <span className="hub-name">{opt.destinationHub}</span>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="option-highlights-row">
                  {opt.highlights.map((item, idx) => (
                    <span key={idx} className="highlight-tag">
                      ✓ {item}
                    </span>
                  ))}
                </div>

                {/* Card Action Footer */}
                <div className="card-footer-actions">
                  <div className="rating-pill">
                    <Star size={13} className="star-gold" />
                    <span className="rating-val">{opt.rating}</span>
                    <span className="reviews-val">({opt.reviewsCount} reviews)</span>
                  </div>

                  <button
                    className="btn-book-now-prefilled"
                    onClick={() => setSelectedOptionForBooking(opt)}
                  >
                    <span>Book Now (Prefilled)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
