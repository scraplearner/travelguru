import React from 'react';
import { Compass, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="travel-guru-footer">
      <div className="footer-inner-wrapper">
        <div className="footer-brand-column">
          <div className="footer-brand-header">
            <Compass size={22} className="footer-compass" />
            <span className="footer-brand-name">TRAVEL GURU</span>
            <span className="footer-version-tag">v2.0 AI Edition</span>
          </div>
          <p className="footer-mission">
            AI-powered multi-modal travel intelligence platform.
            Comparing live routes, calculating complete journey budgets, and providing pre-filled booking passes.
          </p>
        </div>

        <div className="footer-nav-column">
          <h4>Supported Bookings</h4>
          <ul>
            <li>Google Flights & MakeMyTrip</li>
            <li>ConfirmTkt & IRCTC Railway Express</li>
            <li>redBus & AbhiBus Luxury Sleepers</li>
            <li>Uber Intercity & Road Transits</li>
          </ul>
        </div>

        <div className="footer-nav-column">
          <h4>AI Architecture</h4>
          <ul>
            <li>Google Gemini AI Integration</li>
            <li>Dynamic Budget Reasoner</li>
            <li>Multi-Modal Route Optimizer</li>
            <li>Smart Itinerary Builder</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-copyright">
        <p>© {new Date().getFullYear()} Travel Guru — AI Travel Concierge. Built for global explorers.</p>
      </div>
    </footer>
  );
};
