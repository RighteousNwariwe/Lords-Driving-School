import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Header = ({ user, setUser }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="nav-container">
          <div className="logo">
            🚗 Lords Driving School
          </div>

          <nav>
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#lords-drivers">Lord's Drivers</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#reviews">Reviews</a></li>
            </ul>
          </nav>

          <div className="auth-buttons">
            {user ? (
              <>
                <span style={{ color: '#fbbf24', marginRight: '1rem' }}>
                  Welcome, {user.displayName || user.email}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => window.showProfileModal()}
                  style={{ marginRight: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                >
                  👤 Profile
                </button>
                <button className="btn btn-secondary" onClick={handleSignOut}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => window.showSignInModal()}>
                  Sign In
                </button>
                <button className="btn btn-primary" onClick={() => window.showSignUpModal()}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
