import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';

const HallOfFame = ({ user }) => {
  const [submissions, setSubmissions] = useState([]);
  const [approvedEntries, setApprovedEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pending submissions
    const submissionsRef = ref(database, 'hallOfFameSubmissions');
    const submissionsUnsubscribe = onValue(submissionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const submissionsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setSubmissions(submissionsList.filter(sub => sub.status === 'pending'));
      }
    });

    // Fetch approved entries
    const approvedRef = ref(database, 'hallOfFameApproved');
    const approvedUnsubscribe = onValue(approvedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const approvedList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setApprovedEntries(approvedList);
      }
    });

    setLoading(false);

    return () => {
      submissionsUnsubscribe();
      approvedUnsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner"></div>
        <p>Loading Hall of Fame...</p>
      </div>
    );
  }

  return (
    <section id="hall-of-fame" className="section" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          padding: '3rem 0',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #dc2626 100%)',
          borderRadius: '20px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }}></div>

          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            position: 'relative',
            zIndex: 1
          }}>
            🏆 Lord's Drivers Hall of Fame
          </h1>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 2rem',
            position: 'relative',
            zIndex: 1
          }}>
            Celebrating the success stories of our amazing students who passed their driving tests and earned their licenses!
          </p>
        </div>

        {/* Approved Hall of Fame Entries */}
        {approvedEntries.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{
              textAlign: 'center',
              color: '#1e40af',
              marginBottom: '3rem',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>
              ⭐ Our Successful Graduates
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {approvedEntries.map((entry) => (
                <div key={entry.id} style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s ease',
                  border: '3px solid transparent',
                  position: 'relative'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.boxShadow = '0 30px 60px rgba(251, 191, 36, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  }}>

                  {/* Success Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                    zIndex: 10
                  }}>
                    🎉 LICENSED DRIVER
                  </div>

                  {/* Image */}
                  <div style={{ position: 'relative' }}>
                    <img
                      src={entry.image}
                      alt={`${entry.name} - Hall of Fame`}
                      style={{
                        width: '100%',
                        height: '280px',
                        objectFit: 'cover',
                        borderBottom: '4px solid #fbbf24'
                      }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDQwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyODAiIGZpbGw9IiNGM0Y0RjYiLz48dGV4dCB4PSIyMDAiIHk9IjE0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5IYWxsIG9mIEZhbWUgSW1hZ2U8L3RleHQ+PC9zdmc+';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      padding: '1rem',
                      color: 'white'
                    }}>
                      <div style={{
                        background: 'rgba(220, 38, 38, 0.9)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        📅 {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{
                      color: '#1e40af',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      🏆 {entry.name}
                    </h3>

                    {entry.licenseCode && (
                      <div style={{
                        textAlign: 'center',
                        marginBottom: '1rem'
                      }}>
                        <span style={{
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                        }}>
                          🎓 {entry.licenseCode}
                        </span>
                      </div>
                    )}

                    {entry.testimonial && (
                      <blockquote style={{
                        margin: '1rem 0',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
                        borderLeft: '4px solid #f59e0b',
                        borderRadius: '10px',
                        fontStyle: 'italic',
                        color: '#1e40af',
                        fontSize: '1rem',
                        textAlign: 'center'
                      }}>
                        "{entry.testimonial}"
                      </blockquote>
                    )}

                    <div style={{
                      textAlign: 'center',
                      marginTop: '1.5rem',
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      ✅ Lords Driving School Graduate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Section */}
        <HallOfFameUpload user={user} />
      </div>
    </section>
  );
};

// Hall of Fame Upload Component with Enhanced Styling
const HallOfFameUpload = ({ user }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [licenseCode, setLicenseCode] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

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
        setUploadProgress(100);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    setUploadProgress(0);

    try {
      const { database } = await import('../firebase');
      const { ref, push } = await import('firebase/database');

      await push(ref(database, 'hallOfFameSubmissions'), {
        name: name,
        image: selectedImage,
        description: description,
        licenseCode: licenseCode,
        testimonial: testimonial,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });

      // Reset form
      setSelectedImage(null);
      setName('');
      setDescription('');
      setLicenseCode('');
      setTestimonial('');
      setUploadProgress(0);

      setAlert({
        type: 'success',
        message: '🎉 Congratulations! Your submission has been received. Our admin team will review and approve it shortly for the Hall of Fame!'
      });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error submitting. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '25px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        border: '2px solid #fbbf24',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #dc2626 0%, #fbbf24 100%)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)'
          }}>
            🏆 Join Our Hall of Fame
          </div>

          <h2 style={{
            color: '#1e40af',
            marginTop: '1rem',
            marginBottom: '1rem',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            Want to Join Our Hall of Fame?
          </h2>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Upload your success photo and share your achievement! Show off your new license or test certificate and inspire future drivers.
          </p>
        </div>

        {/* Login Requirement Check */}
        {!user ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fee2e2 100%)',
            borderRadius: '15px',
            border: '2px solid #fbbf24'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Login Required</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Please sign in to submit your Hall of Fame entry and share your success story with others.
            </p>
            <button
              onClick={() => {
                window.closeAllModals(); // Close all current modals
                setTimeout(() => window.showSignInModal(), 100); // Then open sign-in modal
              }}
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #fbbf24 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)'
              }}
            >
              Sign In to Submit
            </button>
          </div>
        ) : (
          <div>
            {alert && (
              <div className={`alert alert-${alert.type}`} style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                borderRadius: '10px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {alert.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: '#1e40af',
                    fontSize: '1rem'
                  }}>
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
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: '#1e40af',
                    fontSize: '1rem'
                  }}>
                    License Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={licenseCode}
                    onChange={(e) => setLicenseCode(e.target.value)}
                    placeholder="e.g., Code 8, Code 10"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Enhanced Image Upload Section */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  fontSize: '1rem'
                }}>
                  Upload Success Photo *
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                  id="hallOfFameImage"
                />

                <div style={{
                  border: '3px dashed #dc2626',
                  borderRadius: '15px',
                  padding: '2rem',
                  textAlign: 'center',
                  background: selectedImage ? 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 20%)' : '#f8fafc',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                  onClick={() => document.getElementById('hallOfFameImage').click()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = selectedImage
                      ? 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 30%)'
                      : '#f3f4f6';
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = selectedImage
                      ? 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 20%)'
                      : '#f8fafc';
                    e.currentTarget.style.borderColor = '#dc2626';
                  }}>

                  {selectedImage ? (
                    <div>
                      <img
                        src={selectedImage}
                        alt="Hall of Fame submission"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '250px',
                          borderRadius: '10px',
                          border: '3px solid #fbbf24',
                          boxShadow: '0 10px 25px rgba(251, 191, 36, 0.3)'
                        }}
                      />
                      <div style={{
                        marginTop: '1rem',
                        background: '#10b981',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        ✅ Image Selected
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        color: '#dc2626'
                      }}>
                        📸
                      </div>
                      <h3 style={{
                        color: '#1e40af',
                        marginBottom: '0.5rem',
                        fontSize: '1.2rem'
                      }}>
                        Click to Upload Your Success Photo
                      </h3>
                      <p style={{
                        color: '#666',
                        fontSize: '0.9rem',
                        margin: 0
                      }}>
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>

                {uploadProgress > 0 && (
                  <div style={{
                    marginTop: '1rem',
                    background: '#e5e7eb',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${uploadProgress}%`,
                      height: '8px',
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  fontSize: '1rem'
                }}>
                  Achievement Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your achievement (e.g., passed my Code 8 test, got my first license, etc.)"
                  rows="3"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  fontSize: '1rem'
                }}>
                  Testimonial (Optional)
                </label>
                <textarea
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder="Share your experience with Lords Driving School..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedImage || !name || !description}
                style={{
                  width: '100%',
                  background: loading
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading
                    ? 'none'
                    : '0 10px 25px rgba(220, 38, 38, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(220, 38, 38, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(220, 38, 38, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                    Submitting...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🏆 Submit for Hall of Fame
                  </span>
                )}
              </button>
            </form>

            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '15px',
              textAlign: 'center',
              border: '2px solid #0ea5e9'
            }}>
              <p style={{
                margin: '0',
                fontSize: '0.9rem',
                color: '#0c4a6e',
                fontWeight: '500'
              }}>
                💡 <strong>Note:</strong> All submissions are reviewed by our admin team before being published to ensure quality and authenticity.
                You'll receive a confirmation once your entry is approved!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfFame;
