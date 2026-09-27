import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SavedTrip } from '../types/travel';
import { authenticateUser, registerUser, createGuestUser } from '../data.js';
import { generateJWT, verifyAndDecodeJWT, clearJWTToken, JWTTokenSession } from '../services/jwtAuthService';
import { getSavedTrips, createSavedTrip, updateSavedTrip, deleteSavedTrip } from '../services/savedTripsService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isTransitioning: boolean;
  jwtToken: string | null;
  jwtSession: JWTTokenSession | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; membership?: 'Explorer' | 'Voyager Gold' | 'Globetrotter VIP'; preferredStyle?: any }) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  // Saved Trips CRUD
  savedTrips: SavedTrip[];
  createTrip: (tripData: any) => SavedTrip;
  editTrip: (tripId: string, updates: Partial<SavedTrip>) => SavedTrip;
  removeTrip: (tripId: string) => boolean;
  refreshSavedTrips: () => void;
  isSavedTripsModalOpen: boolean;
  setIsSavedTripsModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('travel_guru_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [jwtToken, setJwtToken] = useState<string | null>(() => {
    return localStorage.getItem('travel_guru_jwt_token');
  });

  const [jwtSession, setJwtSession] = useState<JWTTokenSession | null>(() => {
    return verifyAndDecodeJWT();
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [isSavedTripsModalOpen, setIsSavedTripsModalOpen] = useState(false);

  // Load trips whenever user changes
  const refreshSavedTrips = () => {
    if (user) {
      const trips = getSavedTrips(user.id);
      setSavedTrips(trips);
    } else {
      setSavedTrips([]);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('travel_guru_user', JSON.stringify(user));
      // Ensure valid JWT exists
      const session = verifyAndDecodeJWT();
      if (!session || !session.isValid) {
        const token = generateJWT(user);
        setJwtToken(token);
        setJwtSession(verifyAndDecodeJWT(token));
      } else {
        setJwtToken(session.token);
        setJwtSession(session);
      }
      refreshSavedTrips();
    } else {
      localStorage.removeItem('travel_guru_user');
      clearJWTToken();
      setJwtToken(null);
      setJwtSession(null);
      setSavedTrips([]);
    }
  }, [user]);

  const triggerLoginTransition = (profile: UserProfile) => {
    setIsTransitioning(true);
    const token = generateJWT(profile);
    setJwtToken(token);
    setJwtSession(verifyAndDecodeJWT(token));

    setTimeout(() => {
      setUser(profile);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1200);
    }, 1400);
  };

  const login = async (email: string, password: string) => {
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
    clearJWTToken();
    localStorage.removeItem('travel_guru_user');
    setIsSavedTripsModalOpen(false);
  };

  // CRUD Operations for Saved Trips
  const createTrip = (tripData: any) => {
    if (!user) throw new Error('Please sign in to save trips.');
    const newTrip = createSavedTrip({
      ...tripData,
      userId: user.id
    });
    refreshSavedTrips();
    return newTrip;
  };

  const editTrip = (tripId: string, updates: Partial<SavedTrip>) => {
    const updated = updateSavedTrip(tripId, updates);
    refreshSavedTrips();
    return updated;
  };

  const removeTrip = (tripId: string) => {
    const res = deleteSavedTrip(tripId);
    refreshSavedTrips();
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isTransitioning,
        jwtToken,
        jwtSession,
        login,
        register,
        loginAsGuest,
        logout,
        savedTrips,
        createTrip,
        editTrip,
        removeTrip,
        refreshSavedTrips,
        isSavedTripsModalOpen,
        setIsSavedTripsModalOpen
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
