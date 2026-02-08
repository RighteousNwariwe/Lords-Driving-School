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
                {user.email === 'lordsdrivingschool@gmail.com' && (
                  <button
                    className="btn btn-warning"
                    onClick={() => window.showAdminDashboard()}
                    style={{ marginRight: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.9rem', background: '#dc2626', border: '#dc2626' }}
                  >
                    ⚙️ Admin Panel
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => window.showProfileModal()}
                  style={{ marginRight: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
                >
                  👤 Profile
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleSignOut}
                  style={{
                    marginRight: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    background: '#ef4444',
                    border: '#ef4444',
                    color: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#dc2626';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ef4444';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🚪 Sign Out
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
