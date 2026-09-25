import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, Plane, MapPin } from 'lucide-react';

interface AuthTransitionProps {
  userName?: string;
}

export const AuthTransition: React.FC<AuthTransitionProps> = ({ userName = 'Explorer' }) => {
  const [phase, setPhase] = useState<'enter' | 'loading' | 'reveal'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('loading'), 400);
    const t2 = setTimeout(() => setPhase('reveal'), 1800);
    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
    };
  }, []);

  return (
    <div className={`auth-transition-overlay phase-${phase}`}>
      {/* Animated rings */}
      <div className="transition-rings">
        <div className="ring ring-1"></div>
        <div className="ring ring-2"></div>
        <div className="ring ring-3"></div>
      </div>

      {/* Center content */}
      <div className="transition-center">
        <div className="transition-compass-wrap">
          <Compass className="transition-compass-icon" size={64} />
        </div>
        <h2 className="transition-title">
          <Sparkles size={20} className="sparkle-inline" />
          Initializing Travel Intelligence
        </h2>
        <p className="transition-sub">Welcome aboard, <strong>{userName}</strong></p>

        {/* Progress bar */}
        <div className="transition-progress">
          <div className="transition-progress-fill"></div>
        </div>

        {/* Floating icons */}
        <div className="transition-floating-icons">
          <Plane className="float-icon fi-1" size={24} />
          <MapPin className="float-icon fi-2" size={20} />
          <Sparkles className="float-icon fi-3" size={18} />
        </div>
      </div>
    </div>
  );
};
