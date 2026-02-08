import React, { useState, useEffect, useMemo } from 'react';

const Map = () => {
  const [selectedBranch, setSelectedBranch] = useState('sasolburg');

  // Branch locations with coordinates
  const branchLocations = useMemo(() => ({
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
  }), []);

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

    // Only load Google Maps if not Sasolburg (since Sasolburg uses embedded map)
    if (selectedBranch !== 'sasolburg') {
      loadGoogleMaps();
    }

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      delete window.initMap;
    };
  }, [selectedBranch, branchLocations]);

  return (
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56970.61141589162!2d27.77866089254234!3d-26.81885031823946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e945dd798157b59%3A0x62db53d56591e1cd!2sLords%20Driving%20School!5e0!3m2!1sen!2sza!4v1770494212773!5m2!1sen!2sza"
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
  );
};

export default Map;
