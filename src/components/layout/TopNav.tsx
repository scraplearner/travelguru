import React from 'react';
import { Compass, LogOut, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopNav: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="site-header-nav stitch-header">
      <div className="nav-inner-container">
        {/* Brand Logo matching Stitch */}
        <div className="nav-brand-section">
          <div className="brand-icon-shield">
            <Compass size={22} className="brand-nav-compass" />
          </div>
          <div className="brand-text-column">
            <span className="nav-brand-name">TRAVEL GURU</span>
            <span className="nav-brand-sub">Spatial Multi-Modal Advisor</span>
          </div>
        </div>

        {/* Center Live Corridor Synchronized Status & Region Tag (Stitch) */}
        <div className="nav-center-telemetry">
          <div className="telemetry-node-badge nav-live-pill">
            <span className="live-ping-dot"></span>
            <span className="telemetry-node-text">Live Corridors Synchronized</span>
          </div>
          <div className="nav-currency-pill">
            <Globe size={13} className="text-secondary" />
            <span>₹ INR · India / Global</span>
            <ChevronDown size={12} className="text-muted" />
          </div>
        </div>

        {/* Right Utility & Profile */}
        <div className="nav-actions-group">
          {user && (
            <div className="user-profile-widget">
              <div className="user-avatar-placeholder">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar-img" />
                ) : (
                  user.initials || user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="user-info-text">
                <span className="user-nav-name">{user.name}</span>
                <span className="user-nav-tier">{user.badgeTitle || user.membership || 'Explorer'}</span>
              </div>
              <button
                className="btn-nav-logout"
                onClick={logout}
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
