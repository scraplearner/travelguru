import React from 'react';
import { useAuth } from './context/AuthContext';
import { useTravel } from './context/TravelContext';
import { LoginPage } from './components/auth/LoginPage';
import { AuthTransition } from './components/auth/AuthTransition';
import { TopNav } from './components/layout/TopNav';
import { Footer } from './components/layout/Footer';
import { TravelSearchForm } from './components/travel/TravelSearchForm';
import { RecommendationList } from './components/travel/RecommendationList';
import { AIPlannerSection } from './components/travel/AIPlannerSection';
import { PrefilledBookingModal } from './components/travel/PrefilledBookingModal';

export const App: React.FC = () => {
  const { isAuthenticated, isTransitioning, user } = useAuth();

  return (
    <div className="travel-guru-app-root">
      {/* Stitch GIS Precision Cartography Grid */}
      <div className="gis-grid-overlay"></div>

      {/* Dynamic ambient spatial glowing orbs */}
      <div className="bg-floating-glow glow-1"></div>
      <div className="bg-floating-glow glow-2"></div>
      <div className="bg-floating-glow glow-3"></div>

      {/* Stitch Vector Polyline GIS Overlay Decoration (Multimodal Transit Lines) */}
      <svg className="gis-background-transit-svg" preserveAspectRatio="none" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="globalFlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#0284C7" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="globalRailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
          <filter id="globalGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M 80,720 Q 550,220 1360,160" fill="none" stroke="url(#globalFlightGrad)" strokeWidth="3" strokeDasharray="8 6" filter="url(#globalGlow)" />
        <path d="M 180,820 C 440,680 620,480 1180,360" fill="none" stroke="url(#globalRailGrad)" strokeWidth="2.5" />
        <circle cx="80" cy="720" r="5" fill="#0284C7" className="animate-pulse" />
        <circle cx="1360" cy="160" r="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
        <circle cx="180" cy="820" r="5" fill="#059669" />
        <circle cx="1180" cy="360" r="5" fill="#10B981" />
      </svg>

      {isTransitioning && <AuthTransition userName={user?.name || 'Explorer'} />}

      {!isAuthenticated ? (
        <LoginPage />
      ) : (
        <div className="main-site-experience">
          <TopNav />

          <main className="site-main-content">
            <div className="explorer-view-wrapper view-enter-animation">
              <TravelSearchForm />
              <RecommendationList />
              <AIPlannerSection />
            </div>
          </main>

          <PrefilledBookingModal />
          <Footer />
        </div>
      )}
    </div>
  );
};
