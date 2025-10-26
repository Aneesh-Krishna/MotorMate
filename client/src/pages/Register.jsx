// Register.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Register.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  };

  const handleGoogleSignup = () => {
    // Implement Google OAuth logic here
    console.log('Google signup clicked');
  };

  return (
    <div className="register-container">
      {/* Left Panel - Branding & Features */}
      <div className="register-left-panel">
        <div className="background-blur blur-1"></div>
        <div className="background-blur blur-2"></div>
        
        <div className="left-panel-content">
          <div className="logo-section">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 17h14v-2H5v2zm0-4h14V9H5v4zM7 4v5h10V4H7z"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>Smart Vehicle Companion</h1>
              <p>Version 2.0</p>
            </div>
          </div>

          <div className="features-section">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="feature-text">
                <h3>Track Everything</h3>
                <p>Monitor fuel, maintenance, expenses, and trips all in one place</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <div className="feature-text">
                <h3>Smart Analytics</h3>
                <p>Get AI-powered insights to optimize your vehicle costs</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/>
                  <line x1="10" y1="1" x2="10" y2="4"/>
                  <line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <div className="feature-text">
                <h3>Never Miss a Date</h3>
                <p>Smart reminders for service, insurance, and renewals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="left-panel-footer">
          <p>"Start your journey to smarter vehicle management"</p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="register-right-panel">
        <div className="register-form-wrapper">
          {/* Mobile Logo */}
          <div className="mobile-logo">
            <div className="mobile-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 17h14v-2H5v2zm0-4h14V9H5v4zM7 4v5h10V4H7z"/>
              </svg>
            </div>
            <h1>Smart Vehicle Companion</h1>
          </div>

          <div className="register-card">
            <div className="card-header">
              <h2>Create your account</h2>
              <p>Start managing your vehicles smarter today</p>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <p className="password-hint">Must be at least 8 characters</p>
              </div>

              <div className="accept-terms">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <label htmlFor="terms">
                  I agree to the{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <span>Create account</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>Or sign up with</span>
            </div>

            <button type="button" className="google-button" onClick={handleGoogleSignup}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign up with Google</span>
            </button>

            <p className="login-link">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>

          <p className="footer-text">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}