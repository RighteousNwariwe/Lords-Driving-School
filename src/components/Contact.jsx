import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    branch: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('sasolburg');

  // Branch locations with coordinates
  const branchLocations = {
    sasolburg: {
      name: 'Sasolburg Head Office',
      address: 'Office No. 10 Second Floor, Berjan Building, CNR Bain & Fichard Street, Sasolburg',
      lat: -26.6406,
      lng: 27.8565,
      phone: '078 359 1357'
    },
    vanderbijlpark: {
      name: 'Vanderbijlpark Branch',
      address: 'Opposite Traffic Department, Vanderbijlpark',
      lat: -26.8709,
      lng: 27.8264,
      phone: '072 910 9821'
    },
    secunda: {
      name: 'Secunda Branch',
      address: 'Mpumalanga, Secunda',
      lat: -26.5475,
      lng: 29.1573,
      phone: '082 542 4692'
    }
  };

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        // Map already loaded, initialize it
        window.initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error('Failed to load Google Maps');
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
          mapDiv.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 1.1rem;">🗺️ Map unavailable. Please check your internet connection.</div>';
        }
      };
      document.head.appendChild(script);
    };

    // Initialize map when script loads
    window.initMap = () => {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps API not loaded');
        return;
      }

      const mapDiv = document.getElementById('map');
      if (!mapDiv) return;

      const map = new window.google.maps.Map(mapDiv, {
        center: branchLocations[selectedBranch],
        zoom: 15,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      const marker = new window.google.maps.Marker({
        position: branchLocations[selectedBranch],
        map: map,
        title: branchLocations[selectedBranch].name,
        animation: window.google.maps.Animation.DROP
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af;">${branchLocations[selectedBranch].name}</h4>
            <p style="margin: 0 0 5px 0; font-size: 14px;">📍 ${branchLocations[selectedBranch].address}</p>
            <p style="margin: 0; font-size: 14px;">📞 ${branchLocations[selectedBranch].phone}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Auto-open info window for selected branch
      setTimeout(() => {
        infoWindow.open(map, marker);
      }, 500);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      delete window.initMap;
    };
  }, [selectedBranch, branchLocations]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send directly to WhatsApp
      const whatsappNumber = '0659911502';
      const whatsappMessage = `*New Contact Message from Lords Driving School Website*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Branch:* ${formData.branch || 'Not specified'}\n\n*Message:*\n${formData.message}`;

      // Create WhatsApp link
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      setAlert({ type: 'success', message: 'Message sent to WhatsApp successfully!' });
      setFormData({ name: '', email: '', phone: '', message: '', branch: '' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error sending message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2>Contact Us</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginTop: '2rem' }}>
          {/* Contact Information */}
          <div>
            <div className="contact-info">
              <div className="contact-card">
                <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>📞 Phone Numbers</h3>
                <p><strong>Main:</strong> 082 542 4692</p>
                <p><strong>Sasolburg:</strong> 078 359 1357</p>
                <p><strong>Vanderbijlpark:</strong> 072 910 9821</p>
                <p><strong>Office:</strong> 016 973 1434</p>
              </div>

              <div className="contact-card">
                <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>📧 Email</h3>
                <p>lordsdrivingschool@gmail.com</p>
              </div>

              <div className="contact-card">
                <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>📍 Head Office</h3>
                <p>
                  Office No. 10 Second Floor, Berjan Building<br />
                  CNR Bain & Fichard Street, Sasolburg<br />
                  (Opposite Indaba Hotel)
                </p>
              </div>

              <div className="contact-card">
                <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>🕐 Business Hours</h3>
                <p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                <p><strong>Saturday:</strong> 8:00 AM - 2:00 PM</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
            </div>
          </div>

          {/* Google Maps Section */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#1e3a8a', marginBottom: '1.5rem' }}>📍 Find Our Branches</h3>

              {/* Branch Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e3a8a' }}>
                  Select Branch Location:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Object.keys(branchLocations).map(branch => (
                    <button
                      key={branch}
                      onClick={() => setSelectedBranch(branch)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: selectedBranch === branch ? '#dc2626' : '#f3f4f6',
                        color: selectedBranch === branch ? 'white' : '#1e40af',
                        border: '1px solid #e5e7eb',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {branchLocations[branch].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Container */}
              <div
                id="map"
                style={{
                  width: '100%',
                  height: '400px',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  marginBottom: '1rem'
                }}
              >
                {/* Embedded Map for Sasolburg */}
                {selectedBranch === 'sasolburg' ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56986.484702071546!2d27.777050955734424!3d-26.78725578316533!2m3!1f0!2f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e945dd798157b59%3A0x62db53d56591e1cd!2sLords%20Driving%20School!5e0!3m2!1sen!2sza!4v1770492739694!5m2!1sen!2sza"
                    width="100%"
                    height="400"
                    style={{
                      border: '0',
                      borderRadius: '8px'
                    }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lords Driving School Sasolburg Location"
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#666',
                    fontSize: '1.1rem'
                  }}>
                    Loading map...
                  </div>
                )}
              </div>

              {/* Selected Branch Details */}
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>
                  {branchLocations[selectedBranch].name}
                </h4>
                <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                  📍 {branchLocations[selectedBranch].address}
                </p>
                <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                  📞 {branchLocations[selectedBranch].phone}
                </p>
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${branchLocations[selectedBranch].lat},${branchLocations[selectedBranch].lng}`;
                    window.open(url, '_blank');
                  }}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    marginTop: '0.5rem'
                  }}
                >
                  🧭 Get Directions
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#1e3a8a', marginBottom: '1.5rem' }}>Send us a Message</h3>

              {alert && (
                <div className={`alert alert-${alert.type}`}>
                  {alert.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="branch">Preferred Branch</label>
                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                  >
                    <option value="">Select a branch</option>
                    <option value="vanderbijlpark">Vanderbijlpark</option>
                    <option value="sasolburg">Sasolburg</option>
                    <option value="secunda">Secunda</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                  {loading ? <span className="spinner"></span> : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
