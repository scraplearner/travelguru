import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Edit3, 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CloudRain, 
  ShieldCheck, 
  Plus, 
  FolderHeart,
  ExternalLink,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';
import { SavedTrip } from '../../types/travel';

export const SavedTripsModal: React.FC = () => {
  const { user, savedTrips, editTrip, removeTrip, createTrip, isSavedTripsModalOpen, setIsSavedTripsModalOpen, jwtSession } = useAuth();
  const { setSearchQuery, searchTravel } = useTravel();

  // Edit trip state
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<'planned' | 'in-progress' | 'completed'>('planned');

  // Create new manual trip state
  const [isCreating, setIsCreating] = useState(false);
  const [newDestination, setNewDestination] = useState('');
  const [newOrigin, setNewOrigin] = useState('New Delhi');
  const [newDays, setNewDays] = useState(3);
  const [newNotes, setNewNotes] = useState('');

  if (!isSavedTripsModalOpen) return null;

  const startEditing = (trip: SavedTrip) => {
    setEditingTripId(trip.id);
    setEditTitle(trip.title);
    setEditNotes(trip.notes);
    setEditStatus(trip.status);
  };

  const handleSaveEdit = (tripId: string) => {
    if (!editTitle.trim()) return;
    editTrip(tripId, {
      title: editTitle,
      notes: editNotes,
      status: editStatus
    });
    setEditingTripId(null);
  };

  const handleDelete = (tripId: string) => {
    if (window.confirm('Are you sure you want to remove this saved trip?')) {
      removeTrip(tripId);
      if (editingTripId === tripId) setEditingTripId(null);
    }
  };

  const handleLoadTrip = (trip: SavedTrip) => {
    setSearchQuery(prev => ({
      ...prev,
      origin: trip.origin,
      destination: trip.destination,
      departureDate: trip.departureDate,
      tripDays: trip.tripDays,
      travelers: trip.travelers
    }));
    searchTravel({
      origin: trip.origin,
      destination: trip.destination,
      departureDate: trip.departureDate,
      tripDays: trip.tripDays,
      travelers: trip.travelers
    });
    setIsSavedTripsModalOpen(false);
  };

  const handleCreateManualTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestination.trim()) return;

    createTrip({
      title: `${newDestination} Planned Voyage`,
      origin: newOrigin,
      destination: newDestination,
      departureDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      travelers: 2,
      tripDays: newDays,
      totalBudgetINR: newDays * 4200,
      notes: newNotes || 'Created manually via Travel Guru Saved Trips manager.'
    });

    setIsCreating(false);
    setNewDestination('');
    setNewNotes('');
  };

  return (
    <div className="saved-trips-modal-backdrop" onClick={() => setIsSavedTripsModalOpen(false)}>
      <div className="saved-trips-modal-container" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="saved-trips-header">
          <div className="header-left-col">
            <div className="header-title-row">
              <FolderHeart size={22} className="text-flight-sky" />
              <h3>Saved Expeditions & Itineraries</h3>
              <span className="trips-count-chip">{savedTrips.length} Saved</span>
            </div>
            <p className="header-sub">
              Manage your personal database of trips with full CRUD support, notes, and live weather adaptation.
            </p>
          </div>

          <div className="header-right-col">
            {/* JWT Token Session Pill */}
            <div className="jwt-session-badge" title="JSON Web Token RFC 7519 Verified Session">
              <KeyRound size={13} className="text-secondary" />
              <span>JWT Bearer Active</span>
              <span className="jwt-dot"></span>
            </div>

            <button
              type="button"
              className="btn-modal-close"
              onClick={() => setIsSavedTripsModalOpen(false)}
              aria-label="Close saved trips modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="saved-trips-toolbar">
          <div className="toolbar-user-info">
            <span className="user-name-bold">{user?.name || 'Explorer'}</span>
            <span className="user-email-dim">({user?.email || 'guest@travelguru.ai'})</span>
            <span className="tier-pill">{user?.membership || 'Explorer'}</span>
          </div>

          <button
            type="button"
            className="btn-add-new-trip"
            onClick={() => setIsCreating(!isCreating)}
          >
            <Plus size={16} />
            <span>{isCreating ? 'Cancel' : 'New Trip'}</span>
          </button>
        </div>

        {/* Inline Create Trip Form (CRUD: Create) */}
        {isCreating && (
          <form onSubmit={handleCreateManualTrip} className="create-trip-form-card">
            <div className="form-card-title">
              <Sparkles size={16} className="text-flight-sky" />
              <span>Create New Expedition Record (Database CRUD)</span>
            </div>
            <div className="create-form-grid">
              <div className="create-field">
                <label>Origin Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi, Mumbai"
                  value={newOrigin}
                  onChange={e => setNewOrigin(e.target.value)}
                  required
                />
              </div>
              <div className="create-field">
                <label>Destination Terminal</label>
                <input
                  type="text"
                  placeholder="e.g. Goa, Manali, Jaipur"
                  value={newDestination}
                  onChange={e => setNewDestination(e.target.value)}
                  required
                />
              </div>
              <div className="create-field">
                <label>Trip Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newDays}
                  onChange={e => setNewDays(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div className="create-field">
              <label>Expedition Notes & Packing Reminders</label>
              <input
                type="text"
                placeholder="e.g. Bring umbrella for rain, book museum passes early..."
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
              />
            </div>
            <div className="create-form-actions">
              <button type="button" className="btn-cancel-mini" onClick={() => setIsCreating(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-submit-mini">
                Save to Database (Create)
              </button>
            </div>
          </form>
        )}

        {/* Trips List (CRUD: Read, Update, Delete) */}
        <div className="saved-trips-list-body">
          {savedTrips.length === 0 ? (
            <div className="empty-saved-trips-card">
              <FolderHeart size={44} className="text-muted mb-2" />
              <h4>No Saved Expeditions Yet</h4>
              <p>Explore routes or calculate an AI itinerary, then click "Save Trip" to store them in your database.</p>
            </div>
          ) : (
            <div className="trips-grid-wrapper">
              {savedTrips.map(trip => {
                const isEditing = editingTripId === trip.id;

                return (
                  <div key={trip.id} className={`saved-trip-item-card status-${trip.status}`}>
                    {/* Top Row: Title & Status */}
                    <div className="trip-item-top-row">
                      {isEditing ? (
                        <div className="edit-title-group">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="edit-title-input"
                            autoFocus
                          />
                          <select
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value as any)}
                            className="edit-status-select"
                          >
                            <option value="planned">Planned 📅</option>
                            <option value="in-progress">In-Progress 🚀</option>
                            <option value="completed">Completed ✓</option>
                          </select>
                        </div>
                      ) : (
                        <div className="trip-title-col">
                          <h4 className="trip-item-title">{trip.title}</h4>
                          <div className="trip-badges-strip">
                            <span className={`status-pill ${trip.status}`}>
                              {trip.status === 'completed' ? '✓ Completed' : trip.status === 'in-progress' ? '🚀 In Progress' : '📅 Planned'}
                            </span>
                            {trip.hasWeatherAdaptation && (
                              <span className="weather-adapted-chip">
                                <CloudRain size={12} />
                                <span>Day 2 Rain-Adapted</span>
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="trip-card-actions">
                        {isEditing ? (
                          <button
                            type="button"
                            className="btn-action-icon save"
                            onClick={() => handleSaveEdit(trip.id)}
                            title="Save changes (Update)"
                          >
                            <Check size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-action-icon edit"
                            onClick={() => startEditing(trip)}
                            title="Edit trip notes & title (Update)"
                          >
                            <Edit3 size={15} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn-action-icon delete"
                          onClick={() => handleDelete(trip.id)}
                          title="Delete trip from database (Delete)"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Meta Corridor Row */}
                    <div className="trip-corridor-row">
                      <div className="corridor-endpoint">
                        <MapPin size={13} className="text-flight-sky" />
                        <span>{trip.origin} ➔ <strong>{trip.destination}</strong></span>
                      </div>
                      <div className="corridor-meta-item">
                        <Calendar size={13} className="text-muted" />
                        <span>{trip.departureDate}</span>
                      </div>
                      <div className="corridor-meta-item">
                        <Clock size={13} className="text-muted" />
                        <span>{trip.tripDays} Days</span>
                      </div>
                      <div className="corridor-meta-item">
                        <Users size={13} className="text-muted" />
                        <span>{trip.travelers} Pax</span>
                      </div>
                      {trip.totalBudgetINR > 0 && (
                        <div className="corridor-budget-item">
                          <span>₹{trip.totalBudgetINR.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>

                    {/* Notes & Weather Alert Box */}
                    {isEditing ? (
                      <div className="edit-notes-box">
                        <label>Traveler Notes & Checklist:</label>
                        <textarea
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          rows={2}
                          placeholder="Add packing list, restaurant names, flight PNRs..."
                        />
                      </div>
                    ) : (
                      trip.notes && (
                        <div className="trip-notes-preview">
                          <span className="notes-label">Notes:</span>
                          <span className="notes-text">{trip.notes}</span>
                        </div>
                      )
                    )}

                    {/* Footer Row: Load in Planner */}
                    <div className="trip-card-footer">
                      <span className="trip-timestamp">
                        Updated {new Date(trip.updatedAt).toLocaleDateString()}
                      </span>
                      <button
                        type="button"
                        className="btn-load-planner"
                        onClick={() => handleLoadTrip(trip)}
                      >
                        <span>Load in Planner</span>
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
