// Topbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from '../features/auth/authSlice';
import {
  Car,
  Menu,
  X,
  Home,
  TrendingUp,
  DollarSign,
  Settings,
  User,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import '../css/Topbar.css';

const Topbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Expenses', href: '/expenses', icon: DollarSign },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  ];

  return (
    <nav className="topbar">
      <div className="topbar-container">
        <div className="topbar-left">
          <Link to="/" className="topbar-logo">
            <Car size={28} />
            <span>MotorMate</span>
          </Link>
        </div>

        {user && (
          <div className="topbar-center">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search vehicles, expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        )}

        <div className="topbar-right">
          {user ? (
            <>
              {/* Desktop Navigation */}
              <ul className="topbar-links desktop-nav">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="nav-link">
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Right Actions */}
              <div className="topbar-actions">
                <button className="action-button" title="Notifications">
                  <Bell size={20} />
                  <span className="notification-badge">3</span>
                </button>

                <div className="profile-dropdown">
                  <button
                    className="profile-button"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="profile-avatar">
                      <User size={20} />
                    </div>
                    <span className="profile-name">{user.name || user.email}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="profile-menu">
                      <Link to="/profile" className="profile-menu-item">
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      <Link to="/settings" className="profile-menu-item">
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      <div className="profile-menu-divider"></div>
                      <button onClick={handleLogout} className="profile-menu-item logout">
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  className="mobile-menu-toggle"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <ul className="mobile-nav-links">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mobile-menu-footer">
              <Link to="/profile" className="mobile-menu-item">
                <User size={16} />
                <span>Profile</span>
              </Link>
              <Link to="/settings" className="mobile-menu-item">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <button onClick={handleLogout} className="mobile-menu-item logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Topbar;
