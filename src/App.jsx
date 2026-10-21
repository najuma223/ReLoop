import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  CheckCircle2,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import './App.css';

// Exact SVG Icons matching the reference design
function DropletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function WaterCanisterIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2h6v3H9z" />
      <path d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
      <path d="M4 11h16" />
      <path d="M4 16h16" />
      <path d="M10 2v3" />
      <path d="M14 2v3" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="14" height="12" rx="2" />
      <path d="M15 8h4.5a2 2 0 0 1 1.7 1l1.8 3v4h-8V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function VerifierShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function App() {
  // 'login' | 'signup'
  const [mode, setMode] = useState('login');
  // 'supplier' | 'buyer' | 'transporter' | 'verifier'
  const [selectedRole, setSelectedRole] = useState('buyer');

  // Form State (strictly empty by default - showing only placeholders)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Authenticated state
  const [currentUser, setCurrentUser] = useState(null);
  const [activePortalView, setActivePortalView] = useState('auto'); // 'auto' | 'hub' | 'buyer'

  // Clicking a role ONLY updates the selection state without modifying input values
  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
  };

  // Phone input handler: strictly numbers, maximum 10 digits
  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, ''); // strip non-numeric characters
    const maxTenDigits = digitsOnly.slice(0, 10); // cap at 10 digits
    setPhone(maxTenDigits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // SIGN UP VALIDATION
    if (mode === 'signup') {
      if (!fullName.trim()) {
        setAlert({ type: 'error', message: 'Please enter your Full Name or Organization Name.' });
        return;
      }
      if (!email.trim()) {
        setAlert({ type: 'error', message: 'Please enter an email address.' });
        return;
      }
      if (phone && phone.length !== 10) {
        setAlert({ type: 'error', message: 'Phone number must be exactly 10 digits (no country code or symbols).' });
        return;
      }
      if (!password) {
        setAlert({ type: 'error', message: 'Please enter a password.' });
        return;
      }
      if (password !== confirmPassword) {
        setAlert({ type: 'error', message: 'Passwords do not match.' });
        return;
      }
      if (!agreeTerms) {
        setAlert({ type: 'error', message: 'Please accept the Terms of Service & Privacy Policy.' });
        return;
      }
    } else {
      // SIGN IN VALIDATION
      if (!email.trim() || !password) {
        setAlert({ type: 'error', message: 'Please enter your email address and password.' });
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const payload =
        mode === 'signup'
          ? { role: selectedRole, fullName: fullName.trim(), email: email.trim(), phone, password }
          : { role: selectedRole, email: email.trim(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Fallback: check localStorage for accounts registered during this session
        const localAccounts = JSON.parse(localStorage.getItem('reloop_users') || '[]');
        if (mode === 'login') {
          const matched = localAccounts.find(
            (u) =>
              (u.email.toLowerCase() === email.trim().toLowerCase() || (phone && u.phone === phone)) &&
              u.password === password
          );

          if (matched) {
            setAlert({ type: 'success', message: 'Login successful! Redirecting to dashboard...' });
            setTimeout(() => {
              setCurrentUser({
                id: matched.id,
                role: matched.role,
                fullName: matched.fullName,
                email: matched.email,
                phone: matched.phone,
              });
              setLoading(false);
            }, 400);
            return;
          }
        }
        throw new Error(data.error || 'Authentication failed');
      }

      // If registration succeeded:
      if (mode === 'signup') {
        // Save to client localStorage as a persistent backup
        const localAccounts = JSON.parse(localStorage.getItem('reloop_users') || '[]');
        const newUserObj = {
          id: data.user.id || 'user-' + Date.now(),
          role: selectedRole,
          fullName: fullName.trim(),
          email: email.trim(),
          phone,
          password,
        };
        // Update or push
        const existingIdx = localAccounts.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (existingIdx >= 0) {
          localAccounts[existingIdx] = newUserObj;
        } else {
          localAccounts.push(newUserObj);
        }
        localStorage.setItem('reloop_users', JSON.stringify(localAccounts));

        setAlert({
          type: 'success',
          message: 'Account created successfully! Please select your account type and sign in.',
        });

        // DO NOT automatically log in. Switch to login screen as requested!
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
        return;
      } else {
        // LOGIN SUCCEEDED
        setAlert({
          type: 'success',
          message: 'Login successful! Redirecting to dashboard...',
        });

        setTimeout(() => {
          setCurrentUser(data.user);
          setLoading(false);
        }, 400);
      }
    } catch (err) {
      // Local account fallback check
      const localAccounts = JSON.parse(localStorage.getItem('reloop_users') || '[]');
      if (mode === 'login') {
        const matched = localAccounts.find(
          (u) =>
            (u.email.toLowerCase() === email.trim().toLowerCase() || (u.phone && u.phone === email.trim())) &&
            u.password === password
        );

        if (matched) {
          // Strict role matching check
          if (matched.role.toLowerCase() !== selectedRole.toLowerCase()) {
            const regCap = matched.role.charAt(0).toUpperCase() + matched.role.slice(1);
            const selCap = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
            setAlert({
              type: 'error',
              message: `Role Mismatch: This account is registered as "${regCap}", but you selected "${selCap}". Please select "${regCap}" to sign in.`,
            });
            setLoading(false);
            return;
          }

          setAlert({ type: 'success', message: 'Login successful! Redirecting to dashboard...' });
          setTimeout(() => {
            setCurrentUser(matched);
            setLoading(false);
          }, 400);
          return;
        }
      }

      setAlert({
        type: 'error',
        message: err.message || 'Unable to authenticate. Please check your credentials.',
      });
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePortalView('auto');
    setAlert(null);
    setPassword('');
    setConfirmPassword('');
  };

  // If user is logged in, show either the Buyer Dashboard or the 5-Portal Hub
  if (currentUser) {
    if (activePortalView === 'buyer' || (currentUser.role === 'buyer' && activePortalView === 'auto')) {
      return (
        <BuyerDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchPortal={() => setActivePortalView('hub')}
        />
      );
    }

    const roleCapitalized = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    return (
      <div className="dashboard-hub">
        <header className="hub-nav">
          <div className="hub-brand">
            <div className="hub-brand-icon">
              <DropletIcon />
            </div>
            <span>ReLoop 2.0</span>
          </div>

          <div className="hub-user-pill">
            <span className="hub-role-badge">{currentUser.role}</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
              {currentUser.fullName || currentUser.email}
            </span>
            <button className="hub-btn-logout" onClick={handleLogout}>
              <LogOut size={14} style={{ marginRight: '6px' }} />
              Log Out
            </button>
          </div>
        </header>

        <main className="hub-container">
          <div className="hub-welcome-card">
            <h1 className="hub-welcome-title">
              Welcome to ReLoop 2.0, {currentUser.fullName || roleCapitalized}!
            </h1>
            <p className="hub-welcome-subtitle">
              You are signed in to the <strong>{roleCapitalized} Portal</strong>. You have completed{' '}
              <strong>Dashboard 1: Login & Authentication</strong> and <strong>Dashboard 2: Buyer Dashboard</strong>.
            </p>

            <div style={{ marginTop: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                onClick={() => setActivePortalView('buyer')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#2563eb',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                🌊 Launch Buyer Dashboard
              </button>
              <button
                onClick={handleLogout}
                style={{
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                }}
              >
                Switch Role / Sign In as another user
              </button>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            5 ReLoop Platform Portals:
          </h3>

          <div className="hub-grid">
            {/* 1. Login */}
            <div className="hub-portal-card active-role">
              <div className="hub-portal-icon">
                <CheckCircle2 size={24} />
              </div>
              <div className="hub-portal-title">1. Login & Auth</div>
              <div className="hub-portal-desc">
                Role-based sign in & registration for all 4 ecosystem stakeholders.
              </div>
              <div className="hub-portal-status">
                <CheckCircle2 size={14} /> Completed
              </div>
            </div>

            {/* 2. Buyer */}
            <div
              className="hub-portal-card active-role"
              onClick={() => setActivePortalView('buyer')}
              style={{ cursor: 'pointer' }}
            >
              <div className="hub-portal-icon">
                <WaterCanisterIcon />
              </div>
              <div className="hub-portal-title">2. Buyer Dashboard</div>
              <div className="hub-portal-desc">
                Interactive spatial map with Chennai pins, demand allocations, ReLoop Rescue™ failover, and metrics.
              </div>
              <div className="hub-portal-status" style={{ color: '#10b981' }}>
                👉 Open Live Buyer Dashboard
              </div>
            </div>

            {/* 3. Seller / Supplier */}
            <div className={`hub-portal-card ${currentUser.role === 'supplier' ? 'active-role' : ''}`}>
              <div className="hub-portal-icon">
                <DropletIcon />
              </div>
              <div className="hub-portal-title">3. Seller / Supplier</div>
              <div className="hub-portal-desc">
                List STP treated water supply, schedule quality audits, monitor storage, and view payouts.
              </div>
              <div className="hub-portal-status">
                {currentUser.role === 'supplier' ? '👉 Your Active Role' : 'Ready for UI'}
              </div>
            </div>

            {/* 4. Verifier */}
            <div className={`hub-portal-card ${currentUser.role === 'verifier' ? 'active-role' : ''}`}>
              <div className="hub-portal-icon">
                <VerifierShieldIcon />
              </div>
              <div className="hub-portal-title">4. Verifier Dashboard</div>
              <div className="hub-portal-desc">
                Review water lab test certificates, conduct quality checks, and approve safety gates.
              </div>
              <div className="hub-portal-status">
                {currentUser.role === 'verifier' ? '👉 Your Active Role' : 'Ready for UI'}
              </div>
            </div>

            {/* 5. Transporter */}
            <div className={`hub-portal-card ${currentUser.role === 'transporter' ? 'active-role' : ''}`}>
              <div className="hub-portal-icon">
                <TruckIcon />
              </div>
              <div className="hub-portal-title">5. Transporter Portal</div>
              <div className="hub-portal-desc">
                Accept delivery jobs, track tanker routes via Leaflet map, confirm delivery volume, and collect transit fees.
              </div>
              <div className="hub-portal-status">
                {currentUser.role === 'transporter' ? '👉 Your Active Role' : 'Ready for UI'}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {/* -------------------------------------------------------------
          LEFT HERO PANEL (Smooth gradient & Branding matching image)
          ------------------------------------------------------------- */}
      <div className="left-hero-panel">
        <div className="hero-content">
          {/* Pill Badge */}
          <div className="brand-pill">
            <div className="brand-pill-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#38bdf8" stroke="none">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <span className="brand-pill-text">HACKHERWAY</span>
          </div>

          {/* Large Title */}
          <h1 className="hero-title">
            {mode === 'login' ? 'ReLoop 2.0' : 'Join ReLoop 2.0'}
          </h1>

          {/* Accent statement */}
          <div className="hero-statement">
            <div className="hero-accent-bar"></div>
            <p className="hero-statement-text">
              {mode === 'login' ? (
                <>
                  Bridging the Gap Between Water Waste and
                  <br />
                  Water Need.
                </>
              ) : (
                <>
                  Bridging the gap between water waste and
                  <br />
                  water need. Start sharing, saving, and sustaining
                  <br />
                  today.
                </>
              )}
            </p>
          </div>

          {/* Footer Metadata */}
          <p className="hero-meta">SUSTAINABILITY PLATFORM • VERIFIED REUSE</p>
        </div>
      </div>

      {/* -------------------------------------------------------------
          RIGHT FORM PANEL (Exact inputs, roles, no social buttons)
          ------------------------------------------------------------- */}
      <div className="right-form-panel">
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">
              {mode === 'login' ? 'Welcome Back' : 'Create your account'}
            </h2>
            <p className="form-subtitle">
              {mode === 'login'
                ? 'Please enter your details to access your dashboard.'
                : 'Join the ecosystem to provide, request, transport, or verify water.'}
            </p>
          </div>

          {/* Alert Message Banner */}
          {alert && (
            <div className={`alert-box ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {alert.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{alert.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Type Selector Label */}
            <span className="section-label">
              {mode === 'login' ? 'Select Account Type' : 'I am joining as a:'}
            </span>

            {/* 4 Role Selector Cards in 2x2 Grid */}
            <div className="role-grid">
              {/* 1. Supplier */}
              <div
                className={`role-card ${selectedRole === 'supplier' ? 'active' : ''}`}
                onClick={() => handleSelectRole('supplier')}
              >
                <div className="role-icon-box">
                  <DropletIcon />
                </div>
                <span className="role-label">Supplier</span>
                {selectedRole === 'supplier' && (
                  <div className="role-check-badge">
                    <CheckCircle2 size={16} strokeWidth={1.8} />
                  </div>
                )}
              </div>

              {/* 2. Buyer */}
              <div
                className={`role-card ${selectedRole === 'buyer' ? 'active' : ''}`}
                onClick={() => handleSelectRole('buyer')}
              >
                <div className="role-icon-box">
                  <WaterCanisterIcon />
                </div>
                <span className="role-label">Buyer</span>
                {selectedRole === 'buyer' && (
                  <div className="role-check-badge">
                    <CheckCircle2 size={16} strokeWidth={1.8} />
                  </div>
                )}
              </div>

              {/* 3. Transporter */}
              <div
                className={`role-card ${selectedRole === 'transporter' ? 'active' : ''}`}
                onClick={() => handleSelectRole('transporter')}
              >
                <div className="role-icon-box">
                  <TruckIcon />
                </div>
                <span className="role-label">Transporter</span>
                {selectedRole === 'transporter' && (
                  <div className="role-check-badge">
                    <CheckCircle2 size={16} strokeWidth={1.8} />
                  </div>
                )}
              </div>

              {/* 4. Verifier */}
              <div
                className={`role-card ${selectedRole === 'verifier' ? 'active' : ''}`}
                onClick={() => handleSelectRole('verifier')}
              >
                <div className="role-icon-box">
                  <VerifierShieldIcon />
                </div>
                <span className="role-label">Verifier</span>
                {selectedRole === 'verifier' && (
                  <div className="role-check-badge">
                    <CheckCircle2 size={16} strokeWidth={1.8} />
                  </div>
                )}
              </div>
            </div>

            {/* SIGN UP SPECIFIC: Full Name / Organization */}
            {mode === 'signup' && (
              <div className="form-group">
                <label className="input-label">Full Name / Organization Name</label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Green Valley Apartments"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* INPUTS FOR SIGN IN VS SIGN UP */}
            {mode === 'login' ? (
              <>
                {/* Email Address */}
                <div className="form-group">
                  <label className="input-label">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon-left">
                      <Mail size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="input-label">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon-left">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="options-row">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" className="forgot-password-link" onClick={(e) => e.preventDefault()}>
                    Forgot password?
                  </a>
                </div>
              </>
            ) : (
              <>
                {/* 2-column Email & Phone */}
                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="input-label">Email Address</label>
                    <div className="input-wrapper">
                      <span className="input-icon-left">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="input-label">Phone Number</label>
                    <div className="input-wrapper">
                      <span className="input-icon-left">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="9876543210"
                        maxLength={10}
                        value={phone}
                        onChange={handlePhoneChange}
                      />
                    </div>
                  </div>
                </div>

                {/* 2-column Password & Confirm Password */}
                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="input-label">Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon-left">
                        <Lock size={16} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="input-label">Confirm Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon-left">
                        <Lock size={16} />
                      </span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms of Service Checkbox */}
                <div className="terms-row">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                    />
                    <span>
                      I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and{' '}
                      <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Primary Action Button */}
            <button type="submit" className="btn-primary-action" disabled={loading}>
              {loading ? (
                <span>Authenticating...</span>
              ) : mode === 'login' ? (
                <span>Sign In</span>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            {/* Switch between Sign In and Sign Up */}
            <div className="switch-mode-box">
              {mode === 'login' ? (
                <span>
                  Don't have an account?
                  <button
                    type="button"
                    className="switch-mode-btn"
                    onClick={() => {
                      setMode('signup');
                      setAlert(null);
                    }}
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?
                  <button
                    type="button"
                    className="switch-mode-btn"
                    onClick={() => {
                      setMode('login');
                      setAlert(null);
                    }}
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
