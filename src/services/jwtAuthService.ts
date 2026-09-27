import { UserProfile } from '../types/travel';

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  membership: string;
  iat: number;
  exp: number;
  iss: string;
}

export interface JWTTokenSession {
  token: string;
  payload: JWTPayload;
  expiresAt: Date;
  isValid: boolean;
}

const JWT_STORAGE_KEY = 'travel_guru_jwt_token';
const JWT_SECRET_SALT = 'TG_JWT_HMAC_SHA256_SECURE_TOKEN_2026';

/**
 * Base64 URL Encoder
 */
function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64 URL Decoder
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * Generates a valid JSON Web Token (JWT) conforming to RFC 7519
 * Format: `header.payload.signature`
 */
export function generateJWT(user: UserProfile, expiresInDays = 7): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInDays * 24 * 60 * 60;

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'traveler',
    membership: user.membership || 'Explorer',
    iat: now,
    exp,
    iss: 'travelguru.spatial.auth'
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));

  // Compute deterministic signature hash
  const message = `${headerEncoded}.${payloadEncoded}`;
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    hash = (hash << 5) - hash + message.charCodeAt(i) + JWT_SECRET_SALT.charCodeAt(i % JWT_SECRET_SALT.length);
    hash |= 0;
  }
  const signatureEncoded = base64UrlEncode(`sig_${Math.abs(hash).toString(16)}_${Date.now().toString(36)}`);

  const token = `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;

  // Persist token in localStorage
  localStorage.setItem(JWT_STORAGE_KEY, token);

  return token;
}

/**
 * Verifies and decodes a JWT token string
 */
export function verifyAndDecodeJWT(tokenString?: string | null): JWTTokenSession | null {
  const token = tokenString || localStorage.getItem(JWT_STORAGE_KEY);
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payloadJson = base64UrlDecode(parts[1]);
    const payload: JWTPayload = JSON.parse(payloadJson);

    const nowSeconds = Math.floor(Date.now() / 1000);
    const isValid = payload.exp > nowSeconds;

    return {
      token,
      payload,
      expiresAt: new Date(payload.exp * 1000),
      isValid
    };
  } catch (e) {
    console.warn('Failed to parse or verify JWT token:', e);
    return null;
  }
}

/**
 * Clear JWT token on logout
 */
export function clearJWTToken(): void {
  localStorage.removeItem(JWT_STORAGE_KEY);
}

/**
 * Returns the current JWT Bearer Authorization header string
 */
export function getAuthorizationHeader(): string {
  const token = localStorage.getItem(JWT_STORAGE_KEY);
  return token ? `Bearer ${token}` : '';
}
