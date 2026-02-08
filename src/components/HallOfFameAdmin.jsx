import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, onValue, remove, update, get } from 'firebase/database';
import { signOut } from 'firebase/auth';

const HallOfFameAdmin = () => {
  const [submissions, setSubmissions] = useState([]);
  const [approvedEntries, setApprovedEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
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
          } else {
            setSubmissions([]);
          }
        }, (error) => {
          console.error('Error fetching submissions:', error);
          setError('Failed to fetch submissions. Please check your connection.');
        });

        // Fetch approved entries
        const approvedRef = ref(database, 'lordsDrivers');
        const approvedUnsubscribe = onValue(approvedRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const approvedList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setApprovedEntries(approvedList);
          } else {
            setApprovedEntries([]);
          }
        }, (error) => {
          console.error('Error fetching approved entries:', error);
        });

        setLoading(false);

        return () => {
          submissionsUnsubscribe();
          approvedUnsubscribe();
        };
      } catch (error) {
        console.error('Error setting up data fetching:', error);
        setError('Failed to connect to database. Please check your connection.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (submission) => {
    try {
      // Add to approved entries
      const approvedData = {
        name: submission.name,
        image: submission.image,
        description: submission.description,
        licenseCode: submission.licenseCode || 'N/A',
        testimonial: submission.testimonial || '',
        date: new Date().toISOString(),
        approvedAt: new Date().toISOString()
      };

      await update(ref(database, `lordsDrivers/${submission.id}`), approvedData);
      
      // Update submission status
      await update(ref(database, `hallOfFameSubmissions/${submission.id}`), {
        ...submission,
        status: 'approved',
        approvedAt: new Date().toISOString()
      });

      alert('✅ Submission approved and added to Hall of Fame!');
    } catch (error) {
      console.error('Error approving submission:', error);
      alert('❌ Error approving submission. Please try again.');
    }
  };

  const handleReject = async (submissionId) => {
    if (window.confirm('Are you sure you want to reject this submission?')) {
      try {
        await update(ref(database, `hallOfFameSubmissions/${submissionId}`), {
          status: 'rejected',
          rejectedAt: new Date().toISOString()
        });
        alert('❌ Submission rejected.');
      } catch (error) {
        console.error('Error rejecting submission:', error);
        alert('❌ Error rejecting submission. Please try again.');
      }
    }
  };

  const handleDeleteApproved = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this Hall of Fame entry?')) {
      try {
        await remove(ref(database, `lordsDrivers/${entryId}`));
        alert('🗑️ Entry deleted successfully.');
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('❌ Error deleting entry. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem' }}>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc',
        flexDirection: 'column'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>⚠️ Error</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            🔄 Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #dc2626 100%)',
        color: 'white',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              🏆 Hall of Fame Admin
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Manage Hall of Fame submissions and entries
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: '3px solid #fbbf24',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <h3 style={{ margin: '0', color: '#1e40af', fontSize: '2rem', fontWeight: 'bold' }}>
              {submissions.length}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Pending Submissions</p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: '3px solid #10b981',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
            <h3 style={{ margin: '0', color: '#1e40af', fontSize: '2rem', fontWeight: 'bold' }}>
              {approvedEntries.length}
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Hall of Fame Entries</p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: '3px solid #dc2626',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <h3 style={{ margin: '0', color: '#1e40af', fontSize: '2rem', fontWeight: 'bold' }}>
              {Math.round((approvedEntries.length / (approvedEntries.length + submissions.length)) * 100) || 0}%
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Approval Rate</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '3px solid #e5e7eb',
          paddingBottom: '0'
        }}>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              background: activeTab === 'pending' ? '#dc2626' : 'transparent',
              color: activeTab === 'pending' ? 'white' : '#666',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '10px 10px 0 0',
              transition: 'all 0.3s ease',
              borderBottom: activeTab === 'pending' ? '3px solid #dc2626' : '3px solid transparent'
            }}
          >
            ⏳ Pending ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            style={{
              background: activeTab === 'approved' ? '#10b981' : 'transparent',
              color: activeTab === 'approved' ? 'white' : '#666',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '10px 10px 0 0',
              transition: 'all 0.3s ease',
              borderBottom: activeTab === 'approved' ? '3px solid #10b981' : '3px solid transparent'
            }}
          >
            🏆 Approved ({approvedEntries.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'pending' && (
          <div>
            <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>
              ⏳ Pending Submissions
            </h2>
            {submissions.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>No Pending Submissions</h3>
                <p style={{ color: '#999', margin: 0 }}>All submissions have been reviewed!</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
              }}>
                {submissions.map((submission) => (
                  <div key={submission.id} style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    border: '3px solid #fbbf24',
                    transition: 'all 0.3s ease'
                  }}>
                    {/* Image */}
                    <div style={{ position: 'relative' }}>
                      <img
                        src={submission.image}
                        alt={`Submission from ${submission.name}`}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#fbbf24',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        PENDING
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        color: '#1e40af',
                        margin: '0 0 1rem 0',
                        fontSize: '1.3rem',
                        fontWeight: 'bold'
                      }}>
                        {submission.name}
                      </h3>

                      {submission.licenseCode && (
                        <div style={{
                          background: '#f3f4f6',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          fontSize: '0.9rem'
                        }}>
                          <strong>License Code:</strong> {submission.licenseCode}
                        </div>
                      )}

                      <p style={{
                        color: '#666',
                        margin: '0 0 1rem 0',
                        fontStyle: 'italic'
                      }}>
                        "{submission.description}"
                      </p>

                      {submission.testimonial && (
                        <div style={{
                          background: '#fef3c7',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          fontSize: '0.9rem'
                        }}>
                          <strong>Testimonial:</strong> "{submission.testimonial}"
                        </div>
                      )}

                      <div style={{
                        color: '#999',
                        fontSize: '0.8rem',
                        marginBottom: '1.5rem'
                      }}>
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                          onClick={() => handleApprove(submission)}
                          style={{
                            flex: 1,
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#059669';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#10b981';
                          }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(submission.id)}
                          style={{
                            flex: 1,
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#b91c1c';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#dc2626';
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'approved' && (
          <div>
            <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>
              🏆 Hall of Fame Entries
            </h2>
            {approvedEntries.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '15px',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>No Hall of Fame Entries Yet</h3>
                <p style={{ color: '#999', margin: 0 }}>Approved submissions will appear here!</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '2rem'
              }}>
                {approvedEntries.map((entry) => (
                  <div key={entry.id} style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    border: '3px solid #10b981',
                    transition: 'all 0.3s ease'
                  }}>
                    {/* Image */}
                    <div style={{ position: 'relative' }}>
                      <img
                        src={entry.image}
                        alt={`${entry.name} - Hall of Fame`}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#10b981',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        APPROVED
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        color: '#1e40af',
                        margin: '0 0 1rem 0',
                        fontSize: '1.3rem',
                        fontWeight: 'bold'
                      }}>
                        🏆 {entry.name}
                      </h3>

                      {entry.licenseCode && entry.licenseCode !== 'N/A' && (
                        <div style={{
                          background: '#f3f4f6',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          fontSize: '0.9rem'
                        }}>
                          <strong>License Code:</strong> {entry.licenseCode}
                        </div>
                      )}

                      <p style={{
                        color: '#666',
                        margin: '0 0 1rem 0',
                        fontStyle: 'italic'
                      }}>
                        "{entry.description}"
                      </p>

                      {entry.testimonial && (
                        <div style={{
                          background: '#fef3c7',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          fontSize: '0.9rem'
                        }}>
                          <strong>Testimonial:</strong> "{entry.testimonial}"
                        </div>
                      )}

                      <div style={{
                        color: '#999',
                        fontSize: '0.8rem',
                        marginBottom: '1.5rem'
                      }}>
                        Approved: {new Date(entry.approvedAt || entry.date).toLocaleDateString()}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteApproved(entry.id)}
                        style={{
                          width: '100%',
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#b91c1c';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#dc2626';
                        }}
                      >
                        🗑️ Delete Entry
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfFameAdmin;
