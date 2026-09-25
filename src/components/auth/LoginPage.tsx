import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Globe, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, register, loginAsGuest } = useAuth();
  
  // Navigation tab: 'signin' | 'register'
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMembership, setRegMembership] = useState<'Explorer' | 'Voyager Gold' | 'Globetrotter VIP'>('Explorer');
  const [regStyle, setRegStyle] = useState('adventure');

  // UI state
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sign In handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
      setSubmitting(false);
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please fill in all registration fields.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        membership: regMembership,
        preferredStyle: regStyle
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to create traveler account.');
      setSubmitting(false);
    }
  };

  // Single Guest Login handler
  const handleGuestLogin = () => {
    setSubmitting(true);
    loginAsGuest();
  };

  // Social Auth
  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setSubmitting(true);
    setTimeout(() => {
      loginAsGuest();
    }, 400);
  };

  return (
    <div className="login-root-container">
      {/* Stitch GIS Precision Cartography Grid Texture */}
      <div className="gis-grid-overlay"></div>

      {/* Dynamic ambient glowing orbs */}
      <div className="login-ambient-orb orb-1"></div>
      <div className="login-ambient-orb orb-2"></div>
      <div className="login-ambient-orb orb-3"></div>

      {/* Main Container: Centered Authentication Workspace */}
      <div className="login-grid-wrapper stitch-layout centered">
        {/* Authentication Card: Modern High-Density Spatial Workspace */}
        <div className="login-card-panel centered">
          <div className="login-card-glass stitch-card">
            
            {/* Brand & Advisory Subtitle (Stitch) */}
            <div className="card-header-stitch">
              <div className="brand-tag-row">
                <span className="brand-icon-chip">
                  <Compass size={18} />
                </span>
                <span className="brand-subtitle-tag">TRAVEL GURU SPATIAL ADVISOR</span>
              </div>
              <h2>Welcome back, Traveler</h2>
              <p>
                Sign in to access your saved multi-modal corridors, transfer feasibility alerts, and verified carrier handoffs.
              </p>
            </div>

            {/* Navigation Tabs: Sign In / Create Account */}
            <div className="auth-tab-switch">
              <button
                type="button"
                className={`tab-btn ${tab === 'signin' ? 'active' : ''}`}
                onClick={() => { setTab('signin'); setError(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`tab-btn ${tab === 'register' ? 'active' : ''}`}
                onClick={() => { setTab('register'); setError(''); }}
              >
                Create Account
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="login-error-alert">
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {tab === 'signin' && (
              <>
                {/* 1-Click Social / SSO Authentication Buttons */}
                <div className="social-auth-grid">
                  <button
                    type="button"
                    className="btn-social-auth"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={submitting}
                  >
                    <svg className="social-icon-svg" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    className="btn-social-auth"
                    onClick={() => handleSocialLogin('Apple')}
                    disabled={submitting}
                  >
                    <svg className="social-icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.92-2.84-.9.04-1.99.6-2.64 1.36-.57.66-.99 1.73-.86 2.76 1.01.08 2.03-.53 2.58-1.28z"/>
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>

                <div className="auth-divider">
                  <span>OR SIGN IN WITH EMAIL</span>
                </div>

                <form onSubmit={handleSignIn} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="user-email">Email Address or Travel ID</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="field-icon" />
                      <input
                        id="user-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="label-row">
                      <label htmlFor="user-password">Password</label>
                    </div>
                    <div className="input-with-icon">
                      <Lock size={18} className="field-icon" />
                      <input
                        id="user-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn-toggle-eye"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-row-remember">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-text">Remember this device for 30 days</span>
                    </label>
                  </div>

                  <button type="submit" className="btn-primary-auth" disabled={submitting}>
                    <span>{submitting ? 'Authenticating...' : 'Sign In to Travel Guru'}</span>
                    <ArrowRight size={18} className="btn-arrow-icon" />
                  </button>
                </form>

                {/* Single Guest Login Option */}
                <div className="auth-divider">
                  <span>INSTANT ACCESS</span>
                </div>

                <button
                  type="button"
                  className="btn-guest-access"
                  onClick={handleGuestLogin}
                  disabled={submitting}
                >
                  <Globe size={18} />
                  <span>Continue As Guest Traveler</span>
                </button>
              </>
            )}

            {/* TAB 2: REGISTER */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="auth-form reg-form">
                <div className="form-group">
                  <label htmlFor="reg-name">Full Name</label>
                  <div className="input-with-icon">
                    <User size={18} className="field-icon" />
                    <input
                      id="reg-name"
                      type="text"
                      placeholder="e.g. Jordan Lee"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-email">Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="field-icon" />
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="e.g. jordan@travelguru.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-password">Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="field-icon" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn-toggle-eye"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Preferred Travel Style</label>
                  <div className="style-chips-selector">
                    {[
                      { id: 'adventure', label: '🏔️ Adventure' },
                      { id: 'cultural', label: '🏛️ Cultural' },
                      { id: 'luxury', label: '✨ Luxury' },
                      { id: 'budget', label: '🎒 Budget' },
                      { id: 'balanced', label: '⚖️ Balanced' }
                    ].map(style => (
                      <button
                        key={style.id}
                        type="button"
                        className={`chip-select-btn ${regStyle === style.id ? 'active' : ''}`}
                        onClick={() => setRegStyle(style.id)}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Membership Tier</label>
                  <select
                    className="membership-select"
                    value={regMembership}
                    onChange={e => setRegMembership(e.target.value as any)}
                  >
                    <option value="Explorer">Explorer (Standard Free)</option>
                    <option value="Voyager Gold">Voyager Gold (Priority Rates)</option>
                    <option value="Globetrotter VIP">Globetrotter VIP (Executive Concierge)</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary-auth" disabled={submitting}>
                  <span>{submitting ? 'Creating Traveler Profile...' : 'Complete Registration & Enter'}</span>
                  <ArrowRight size={18} className="btn-arrow-icon" />
                </button>
              </form>
            )}

            {/* Compliance & Security Badge (Stitch) */}
            <div className="stitch-compliance-badge">
              <ShieldCheck size={16} className="text-emerald" />
              <span>256-bit Bank-grade Encryption • IRCTC & IATA Protocol Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
