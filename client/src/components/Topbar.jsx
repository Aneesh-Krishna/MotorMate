// Topbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from '../features/auth/authSlice';
import '../css/Topbar.css';

const Topbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="topbar">
      <div className="topbar-container">
        <div className="topbar-left">
          <Link to="/" className="topbar-logo">
            MotorMate
          </Link>
        </div>
        <div className="topbar-right">
          <ul className="topbar-links">
            {user ? (
              <>
                <li>
                  <Link to="/vehicles">Vehicles</Link>
                </li>
                <li>
                  <Link to="/expenses">Expenses</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
