// Home.jsx
import React from 'react';
import Footer from '../components/Footer';
import '../css/Home.css';
import Topbar from '../components/Topbar';

const Home = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">
      <Topbar />
      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-blur hero-blur-1"></div>
            <div className="hero-blur hero-blur-2"></div>
          </div>
          
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 17h14v-2H5v2zm0-4h14V9H5v4zM7 4v5h10V4H7z"/>
                </svg>
                <span>Smart Vehicle Companion v2.0</span>
              </div>
              
              <h1>Welcome to MotorMate</h1>
              <p className="hero-subtitle">Your smart solution for vehicle expense tracking and management</p>
              
              <div className="hero-buttons">
                <button className="btn-primary">
                  <span>Get Started</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
                <button className="btn-secondary" onClick={() => scrollToSection('features')}>
                  <span>Learn More</span>
                </button>
              </div>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Vehicles Tracked</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Satisfaction Rate</div>
                </div>
              </div>
            </div>
            
            <div className="hero-image">
              <div className="hero-card">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="card-content">
                  <div className="card-title">AI-Powered Insights</div>
                  <div className="card-text">Get smart recommendations</div>
                </div>
              </div>
              
              <div className="hero-card hero-card-offset">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="card-content">
                  <div className="card-title">Trip Intelligence</div>
                  <div className="card-text">Track every journey</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Key Features</h2>
              <p>Everything you need to manage your vehicles efficiently</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3>Expense Tracking</h3>
                <p>Keep track of all your vehicle-related expenses in one place with detailed categorization.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 17h14v-2H5v2zm0-4h14V9H5v4zM7 4v5h10V4H7z"/>
                  </svg>
                </div>
                <h3>Multiple Vehicles</h3>
                <p>Manage multiple vehicles with ease and efficiency. Perfect for families or fleet managers.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <h3>Analytics</h3>
                <p>Get detailed insights about your vehicle expenses with beautiful charts and reports.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                    <line x1="6" y1="1" x2="6" y2="4"/>
                    <line x1="10" y1="1" x2="10" y2="4"/>
                    <line x1="14" y1="1" x2="14" y2="4"/>
                  </svg>
                </div>
                <h3>Smart Reminders</h3>
                <p>Never miss important dates like service, insurance renewal, or registration.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3>Trip Logging</h3>
                <p>Automatically log your trips with GPS tracking and calculate cost-per-kilometer.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3>Receipt Scanning</h3>
                <p>Upload and scan receipts with AI-powered OCR for automatic expense entry.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="section-container">
            <div className="about-content">
              <div className="about-text">
                <h2>About MotorMate</h2>
                <p className="about-description">
                  MotorMate is your comprehensive solution for managing vehicle expenses.
                  Whether you're a car enthusiast or a fleet manager, we've got you covered.
                </p>
                <p className="about-details">
                  Our platform combines cutting-edge AI technology with an intuitive interface
                  to help you make smarter decisions about your vehicle ownership. From predictive
                  maintenance alerts to detailed expense analytics, we provide everything you need
                  to optimize your vehicle costs.
                </p>
                
                <div className="about-features">
                  <div className="about-feature-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Trusted by thousands of users</span>
                  </div>
                  <div className="about-feature-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Bank-level security encryption</span>
                  </div>
                  <div className="about-feature-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
              
              <div className="about-image">
                <div className="about-card">
                  <div className="about-card-header">
                    <div className="about-card-icon">💰</div>
                    <div>
                      <div className="about-card-title">Total Savings</div>
                      <div className="about-card-value">₹45,230</div>
                    </div>
                  </div>
                  <div className="about-card-chart">
                    <div className="chart-bar" style={{height: '60%'}}></div>
                    <div className="chart-bar" style={{height: '80%'}}></div>
                    <div className="chart-bar" style={{height: '45%'}}></div>
                    <div className="chart-bar" style={{height: '90%'}}></div>
                    <div className="chart-bar" style={{height: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Get in Touch</h2>
              <p>Have questions? We'd love to hear from you</p>
            </div>
            
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-card">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Email Us</h4>
                    <p>support@motormate.com</p>
                  </div>
                </div>
                
                <div className="contact-card">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Call Us</h4>
                    <p>+91 1800-MOTORMATE</p>
                  </div>
                </div>
                
                <div className="contact-card">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Visit Us</h4>
                    <p>Bangalore, Karnataka, India</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-cta">
                <p>Send us a message and we'll respond as soon as possible.</p>
                <button className="btn-contact">
                  <span>Contact Us</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;