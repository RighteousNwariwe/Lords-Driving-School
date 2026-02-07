import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Reviews from './components/Reviews';
import LordsDrivers from './components/LordsDrivers';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Booking from './components/Booking';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import WhatsAppChat from './components/WhatsAppChat';
import AIChatbot from './components/AIChatbot';

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Check if admin user
      if (user && user.email === 'lordsdrivingschool@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Global functions for auth modals
  window.showSignInModal = () => setAuthMode('signin');
  window.showSignUpModal = () => setAuthMode('signup');
  window.showBookingModal = () => setShowBooking(true);
  window.showProfileModal = () => setShowProfile(true);

  const closeAuthModal = () => setAuthMode(null);
  const closeBookingModal = () => setShowBooking(false);
  const closeProfileModal = () => setShowProfile(false);
  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#1e40af'
      }}>
        <div className="spinner"></div>
        <p style={{ color: 'white', marginTop: '1rem' }}>Loading Lords Driving School...</p>
      </div>
    );
  }

  // Show admin dashboard if admin is logged in
  if (isAdmin) {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  // Show main website for all users
  return (
    <div className="App">
      <Header user={user} setUser={setUser} />
      
      <main>
        <Hero />
        
        {/* About Section */}
        <section id="about" className="section">
          <div className="container">
            <h2>About Lords Driving School</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3>Top 10 Driving School</h3>
                <p>Recognized as one of the best and biggest driving schools in South Africa, trusted by everyone including the government.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>20+ Years Experience</h3>
                <p>With over two decades in the industry, we have perfected the art of teaching safe and confident driving.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚗</div>
                <h3>All Vehicle Codes</h3>
                <p>Comprehensive training for Code 8, Code 10, and Code 14 licenses with experienced instructors.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📍</div>
                <h3>3 Provinces</h3>
                <p>Conveniently located in Gauteng (Vanderbijlpark & Vereeniging), Mpumalanga (Secunda), and Free State (Sasolburg).</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✅</div>
                <h3>Government Accredited</h3>
                <p>Fully registered and accredited driving school meeting all government standards and requirements.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💪</div>
                <h3>"Thatha lento ayina bungozi"</h3>
                <p>Take this safe thing - our motto reflects our commitment to safe driving education.</p>
              </div>
            </div>
          </div>
        </section>

        <Pricing />
        <LordsDrivers />
        <Contact />
        <Reviews user={user} />
      </main>

      <Footer />
      <WhatsAppChat />
      <AIChatbot />

      {/* Auth Modal */}
      {authMode && (
        <Auth 
          mode={authMode} 
          onClose={closeAuthModal} 
          setUser={setUser}
        />
      )}

      {/* Booking Modal */}
      {showBooking && (
        <Booking 
          user={user}
          onClose={closeBookingModal}
        />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <UserProfile 
          user={user}
        />
      )}
    </div>
  );
}

export default App;
