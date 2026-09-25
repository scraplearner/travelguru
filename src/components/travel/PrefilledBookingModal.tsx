import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, Plane, Train, Bus, Car, ShieldCheck, Clock, Calendar, Users, MapPin } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { generatePrefilledDeepLinks, formatTravelDate } from '../../services/deepLinks';

export const PrefilledBookingModal: React.FC = () => {
  const { selectedOptionForBooking, setSelectedOptionForBooking, searchQuery } = useTravel();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!selectedOptionForBooking) return null;

  const opt = selectedOptionForBooking;
  const dates = formatTravelDate(searchQuery.departureDate);

  // Generate deep link providers for this specific mode & route
  const providers = generatePrefilledDeepLinks(
    searchQuery.origin,
    searchQuery.destination,
    searchQuery.departureDate,
    searchQuery.travelers,
    opt.mode,
    opt.bookingDetails.classType || searchQuery.travelClass
  );

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="modal-backdrop-blur">
      <div className="booking-modal-dialog">
        {/* Header */}
        <div className="booking-modal-header">
          <div className="modal-headline">
            <span className="booking-verified-pill">
              <ShieldCheck size={14} /> Instant Prefilled Checkout
            </span>
            <h3>Direct Booking Hub for {opt.title}</h3>
            <p>Your journey details have been encoded into official carrier reservation portals.</p>
          </div>
          <button className="btn-modal-close" onClick={() => setSelectedOptionForBooking(null)}>
            <X size={20} />
          </button>
        </div>

        {/* Selected Route Summary Banner */}
        <div className="booking-route-summary-box">
          <div className="summary-left">
            <div className="carrier-title-row">
              <span className="carrier-name-bold">{opt.carrier}</span>
              <span className="service-number-pill">{opt.bookingDetails.serviceNumber}</span>
              <span className="class-pill">{opt.bookingDetails.classType}</span>
            </div>
            <div className="route-endpoints">
              <span>{opt.originHub}</span>
              <span className="arrow-sep">➔</span>
              <span>{opt.destinationHub}</span>
            </div>
          </div>

          <div className="summary-right">
            <div className="price-bold">₹{opt.priceINR.toLocaleString('en-IN')}</div>
            <span className="price-pax-sub">Total for {searchQuery.travelers} Traveler(s)</span>
          </div>
        </div>

        {/* Encoded Credentials Bar */}
        <div className="encoded-credentials-strip">
          <div className="cred-chip">
            <MapPin size={13} />
            <span>Origin: <strong>{searchQuery.origin}</strong></span>
          </div>
          <div className="cred-chip">
            <MapPin size={13} />
            <span>Destination: <strong>{searchQuery.destination}</strong></span>
          </div>
          <div className="cred-chip">
            <Calendar size={13} />
            <span>Date: <strong>{dates.readable}</strong></span>
          </div>
          <div className="cred-chip">
            <Users size={13} />
            <span>Passengers: <strong>{searchQuery.travelers} Adult(s)</strong></span>
          </div>
        </div>



        {/* Provider List */}
        <div className="booking-providers-list">
          {providers.map((provider, idx) => (
            <div key={idx} className="provider-card-row">
              <div className="provider-info-col">
                <div className="provider-name-row">
                  <h4>{provider.logoText}</h4>
                  {provider.badge && <span className="provider-badge">{provider.badge}</span>}
                </div>
                <p className="provider-desc">{provider.description}</p>
                <span className="provider-url-preview">{provider.url.substring(0, 60)}...</span>
              </div>

              <div className="provider-actions-col">
                <button
                  type="button"
                  className="btn-copy-link"
                  onClick={() => handleCopy(provider.url)}
                  title="Copy prefilled deep link"
                >
                  {copiedUrl === provider.url ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                </button>

                <a
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-proceed-booking"
                >
                  <span>Proceed to Book</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="booking-modal-footer">
          <button className="btn-cancel-booking" onClick={() => setSelectedOptionForBooking(null)}>
            Back to Options
          </button>
        </div>
      </div>
    </div>
  );
};
