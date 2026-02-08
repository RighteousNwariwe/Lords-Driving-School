import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push } from 'firebase/database';
import { whatsappReviews } from '../data/whatsappReviews.js';

const LordsDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

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

        {/* Hall of Fame Testimonials */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '2rem' }}>

          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {/* WhatsApp Reviews */}
            {whatsappReviews.map((review) => (
              <div key={review.id} style={{
                background: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center',
                border: '2px solid #dc2626',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '20px',
                  background: '#dc2626',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  Hall of Fame
                </div>

                {/* Customer Image - Rectangular */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <img
                    src={review.image}
                    alt={`Hall of Fame member ${review.author}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #fbbf24'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '200px',
                    borderRadius: '8px',
                    background: '#fbbf24',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem'
                  }}>
                    👤
                  </div>
                </div>

                <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                  {review.author}
                </h4>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                  "{review.text}"
                </p>
                <div style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'inline-block'
                }}>
                  🏆 Hall of Fame
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Drivers Display */}
        {drivers.length > 0 && (
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

        {/* Hall of Fame Upload Section */}
        <div style={{ maxWidth: '800px', margin: '3rem auto 0' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e40af', marginBottom: '1.5rem', textAlign: 'center' }}>
              🏆 Want to Join Our Hall of Fame?
            </h3>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
              Upload a picture showing you acquiring your learner's license or passing your test.
              Our admin team will review and approve it for Hall of Fame!
            </p>

            <HallOfFameUpload />
          </div>
        </div>
      </div>
    </section>
  );
};

// Hall of Fame Upload Component
const HallOfFameUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ type: 'error', message: 'Image size should be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const { database } = await import('../firebase');
      const { ref, push } = await import('firebase/database');

      await push(ref(database, 'hallOfFameSubmissions'), {
        name: name,
        image: selectedImage,
        description: description,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });

      setSelectedImage(null);
      setDescription('');
      setName('');
      setAlert({ type: 'success', message: 'Submitted for review! Our admin team will approve it shortly.' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error submitting. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {alert && (
        <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1rem' }}>
          {alert.message}
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
          Your Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
          Upload Image (License/Success Photo) *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{
            display: 'none',
            id: 'hallOfFameImage'
          }}
        />
        <button
          type="button"
          onClick={() => document.getElementById('hallOfFameImage').click()}
          className="btn btn-secondary"
          style={{
            marginBottom: '1rem',
            width: '100%',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: '2px solid #dc2626',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {selectedImage ? 'Change Image' : 'Select Image'}
        </button>

        {selectedImage && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <img
              src={selectedImage}
              alt="Hall of Fame submission"
              style={{
                maxWidth: '300px',
                maxHeight: '200px',
                borderRadius: '10px',
                border: '3px solid #fbbf24'
              }}
            />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us about your achievement (e.g., passed my Code 8 test, first license, etc.)"
          rows="3"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !selectedImage || !name || !description}
        style={{
          width: '100%',
          backgroundColor: '#dc2626',
          color: '#ffffff',
          border: '2px solid #dc2626',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        {loading ? <span className="spinner"></span> : 'Submit for Hall of Fame'}
      </button>
    </form>
  );
};

export default LordsDrivers;
