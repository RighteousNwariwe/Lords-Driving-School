import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const LordsDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const driversRef = ref(database, 'lordsDrivers');
    onValue(driversRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const driversList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setDrivers(driversList);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner"></div>
        <p>Loading Lord's Drivers...</p>
      </div>
    );
  }

  return (
    <section id="lords-drivers" className="section">
      <div className="container">
        <h2 style={{ color: '#1e40af', marginBottom: '3rem' }}>
          🏆 Lord's Drivers Hall of Fame
        </h2>

        {drivers.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>
              Coming Soon!
            </h3>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Our successful drivers will be showcased here soon. 
              Complete your training with Lords Driving School to be featured!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {drivers.map(driver => (
              <div key={driver.id} style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                border: '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(251, 191, 36, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
              }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={driver.image}
                    alt={driver.name}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDM1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjM1MCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiNFRjVGNUY1Ii8+PHRleHQgeD0iMTc1IiB5PSIxMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RHJpdmVyIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'linear-gradient(135deg, #dc2626 0%, #fbbf24 100%)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    {driver.licenseCode}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    color: '#1e40af',
                    margin: '0 0 1rem 0',
                    fontSize: '1.3rem',
                    fontWeight: 'bold'
                  }}>
                    🏆 {driver.name}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    background: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: '#dc2626', fontWeight: 'bold' }}>
                      {driver.licenseCode}
                    </span>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      📅 {new Date(driver.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <blockquote style={{
                    margin: '0',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #fef3c7 100%)',
                    borderLeft: '4px solid #f59e0b',
                    borderRadius: '8px',
                    fontStyle: 'italic',
                    color: '#1e40af',
                    fontSize: '1rem'
                  }}>
                    "{driver.testimonial}"
                  </blockquote>
                  
                  <div style={{
                    textAlign: 'center',
                    marginTop: '1rem',
                    padding: '0.5rem',
                    background: '#dc2626',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    ✅ Licensed Driver • Lords Graduate
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>
            🚗 Want to Join Our Hall of Fame?
          </h3>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Complete your driving training with Lords Driving School and pass your license test 
            to be featured as one of our successful Lord's Drivers!
          </p>
          <button
            onClick={() => window.scrollTo({ top: document.getElementById('contact').offsetTop, behavior: 'smooth' })}
            className="btn btn-primary"
          >
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default LordsDrivers;
