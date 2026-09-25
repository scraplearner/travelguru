/**
 * ============================================================================
 * TRAVEL GURU - USER DATA & AUTHENTICATION (data.js)
 * ============================================================================
 * Clean authentication storage with single Guest Login support and
 * dynamically registered user accounts.
 */

export const GUEST_USER = {
  id: 'usr_guest_explorer',
  name: 'Guest Explorer',
  email: 'guest@travelguru.ai',
  role: 'guest',
  membership: 'Explorer',
  badgeTitle: 'Guest Explorer',
  avatar: '',
  initials: 'GE',
  homeHub: 'DEL - Indira Gandhi International',
  preferredStyle: 'adventure',
  savedTripsCount: 1,
  savedTrips: ['Goa Coastal & Beachside Multi-Modal Getaway'],
  bio: 'Exploring smart multi-modal journeys across the globe.'
};

const STORAGE_USERS_KEY = 'travel_guru_registered_users';

/**
 * Get all registered user accounts from localStorage
 */
export function getAllUsers() {
  try {
    const custom = localStorage.getItem(STORAGE_USERS_KEY);
    return custom ? JSON.parse(custom) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Authenticate registered user with email and password
 */
export function authenticateUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail || !cleanPassword) {
    throw new Error('Please enter both your email and password.');
  }

  // Check if trying to sign in as guest via form
  if (cleanEmail === GUEST_USER.email) {
    return GUEST_USER;
  }

  const userList = getAllUsers();
  const matchedUser = userList.find(u => u.email.toLowerCase() === cleanEmail);

  if (!matchedUser) {
    throw new Error('No account found for this email. Use "Continue as Guest" or create a new account.');
  }

  if (matchedUser.password !== cleanPassword) {
    throw new Error('Incorrect password. Please try again.');
  }

  const { password: _, ...userProfile } = matchedUser;
  return userProfile;
}

/**
 * Register a new traveler account
 */
export function registerUser({ name, email, password, membership = 'Explorer', preferredStyle = 'adventure' }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (name || '').trim();
  const cleanPassword = (password || '').trim();

  if (!cleanName || !cleanEmail || !cleanPassword) {
    throw new Error('Please fill in your name, email, and password.');
  }

  if (cleanPassword.length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  const userList = getAllUsers();
  if (userList.some(u => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email already exists. Please sign in instead.');
  }

  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('') || 'TG';

  const newUser = {
    id: `usr_${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    password: cleanPassword,
    role: 'traveler',
    membership: membership,
    badgeTitle: `${membership} Traveler`,
    avatar: '',
    initials: initials,
    homeHub: 'DEL - Indira Gandhi International',
    preferredStyle: preferredStyle,
    savedTripsCount: 0,
    savedTrips: [],
    bio: 'Traveler on Travel Guru.'
  };

  try {
    userList.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(userList));
  } catch (err) {
    console.error('Failed to save user in localStorage', err);
  }

  const { password: _, ...userProfile } = newUser;
  return userProfile;
}

/**
 * Returns single guest traveler session
 */
export function createGuestUser() {
  return { ...GUEST_USER };
}

export default GUEST_USER;
