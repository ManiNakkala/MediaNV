import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin, isCandidate } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Job Portal
        </Link>

        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-link-primary">Register</Link>
            </>
          ) : (
            <>
              {isAdmin && (
                <Link to="/admin/jobs" className="nav-link">My Jobs</Link>
              )}
              {isCandidate && (
                <>
                  <Link to="/jobs" className="nav-link">Browse Jobs</Link>
                  <Link to="/my-applications" className="nav-link">My Applications</Link>
                  <Link to="/my-favourites" className="nav-link">Saved Jobs</Link>
                </>
              )}
              <span className="nav-user">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="nav-link nav-link-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
