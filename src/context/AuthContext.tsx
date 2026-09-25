import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/travel';
import { authenticateUser, registerUser, createGuestUser, getAllUsers } from '../data.js';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isTransitioning: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; membership?: 'Explorer' | 'Voyager Gold' | 'Globetrotter VIP'; preferredStyle?: any }) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  savedTrips: string[];
  saveTrip: (tripTitle: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('travel_guru_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [savedTrips, setSavedTrips] = useState<string[]>(() => {
    const saved = localStorage.getItem('travel_guru_saved_trips');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('travel_guru_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('travel_guru_user');
    }
  }, [user]);

  const triggerLoginTransition = (profile: UserProfile) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setUser(profile);
      if (profile.savedTrips && profile.savedTrips.length > 0) {
        setSavedTrips(prev => {
          const combined = Array.from(new Set([...prev, ...(profile.savedTrips || [])]));
          localStorage.setItem('travel_guru_saved_trips', JSON.stringify(combined));
          return combined;
        });
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1200);
    }, 1400);
  };

  const login = async (email: string, password: string) => {
    // Authenticate against data.js database
    const profile = authenticateUser(email, password) as UserProfile;
    triggerLoginTransition(profile);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    membership?: 'Explorer' | 'Voyager Gold' | 'Globetrotter VIP';
    preferredStyle?: any;
  }) => {
    const profile = registerUser(data) as UserProfile;
    triggerLoginTransition(profile);
  };

  const loginAsGuest = () => {
    const guestProfile = createGuestUser() as UserProfile;
    triggerLoginTransition(guestProfile);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travel_guru_user');
  };

  const saveTrip = (tripTitle: string) => {
    setSavedTrips(prev => {
      const updated = prev.includes(tripTitle) ? prev : [...prev, tripTitle];
      localStorage.setItem('travel_guru_saved_trips', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isTransitioning,
        login,
        register,
        loginAsGuest,
        logout,
        savedTrips,
        saveTrip
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
