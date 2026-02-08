import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, onValue, remove, update, push, get } from 'firebase/database';
import { signOut } from 'firebase/auth';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalBookings: 0,
    totalHallOfFame: 0,
    pendingReviews: 0,
    pendingBookings: 0,
    pendingHallOfFame: 0
  });
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [hallOfFame, setHallOfFame] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        // Reviews
        const reviewsRef = ref(database, 'reviews');
        const reviewsUnsubscribe = onValue(reviewsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const reviewsList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setReviews(reviewsList);
          } else {
            setReviews([]);
          }
        }, (error) => {
          console.error('Error fetching reviews:', error);
        });

        // Bookings
        const bookingsRef = ref(database, 'bookings');
        const bookingsUnsubscribe = onValue(bookingsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const bookingsList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setBookings(bookingsList);
          } else {
            setBookings([]);
          }
        }, (error) => {
          console.error('Error fetching bookings:', error);
        });

        // Hall of Fame
        const hofRef = ref(database, 'hallOfFameSubmissions');
        const hofUnsubscribe = onValue(hofRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const hofList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setHallOfFame(hofList);
          } else {
            setHallOfFame([]);
          }
        }, (error) => {
          console.error('Error fetching Hall of Fame:', error);
        });

        setLoading(false);

        return () => {
          reviewsUnsubscribe();
          bookingsUnsubscribe();
          hofUnsubscribe();
        };
      } catch (error) {
        console.error('Error setting up data fetching:', error);
        setError('Failed to connect to database. Please check your connection.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update stats when data changes
    setStats({
      totalReviews: reviews.length,
      totalBookings: bookings.length,
      totalHallOfFame: hallOfFame.length,
      pendingReviews: reviews.filter(r => !r.approved).length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      pendingHallOfFame: hallOfFame.filter(h => h.status === 'pending').length
    });
  }, [reviews, bookings, hallOfFame]);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await remove(ref(database, `reviews/${reviewId}`));
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      await remove(ref(database, `bookings/${bookingId}`));
    }
  };

  const handleDeleteHallOfFame = async (hofId) => {
    if (window.confirm('Are you sure you want to delete this Hall of Fame entry?')) {
      await remove(ref(database, `hallOfFameSubmissions/${hofId}`));
    }
  };

  const handleUpdateHallOfFame = async (hofId, field, value) => {
    await update(ref(database, `hallOfFameSubmissions/${hofId}`), {
      [field]: value
    });
  };

  const handleApproveReview = async (reviewId) => {
    await update(ref(database, `reviews/${reviewId}`), {
      approved: true
    });
  };

  const handleUpdateBooking = async (bookingId, field, value) => {
    await update(ref(database, `bookings/${bookingId}`), {
      [field]: value
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
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
        background: '#1e40af',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          🛠️ Lords Driving School - Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#b91c1c';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#dc2626';
          }}
        >
          🚪 Logout
        </button>
      </header>

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
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
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h3 style={{ color: '#1e40af', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>📊 Total Reviews</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
              {stats.totalReviews}
            </p>
            <p style={{ color: '#666', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              {stats.pendingReviews} pending approval
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #10b981'
          }}>
            <h3 style={{ color: '#1e40af', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>📅 Total Bookings</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
              {stats.totalBookings}
            </p>
            <p style={{ color: '#666', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              {stats.pendingBookings} pending
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #f59e0b'
          }}>
            <h3 style={{ color: '#1e40af', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>🏆 Hall of Fame</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
              {stats.totalHallOfFame}
            </p>
            <p style={{ color: '#666', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              {stats.pendingHallOfFame} pending approval
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '1rem'
        }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard', color: '#3b82f6' },
            { id: 'reviews', label: '⭐ Reviews', color: '#10b981' },
            { id: 'bookings', label: '📅 Bookings', color: '#f59e0b' },
            { id: 'hallOfFame', label: '🏆 Hall of Fame', color: '#dc2626' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab.id ? tab.color : '#f3f4f6',
                color: activeTab === tab.id ? 'white' : '#1e40af',
                border: `2px solid ${tab.color}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>📊 Dashboard Overview</h2>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Welcome to the Lords Driving School Admin Dashboard. Here you can manage reviews, bookings, and Hall of Fame submissions.
              Use the tabs above to navigate between different management sections.
            </p>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>⭐ Reviews Management</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '1rem'
              }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Rating</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr key={review.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>{review.name || 'Anonymous'}</td>
                      <td style={{ padding: '1rem' }}>{review.userEmail || review.email}</td>
                      <td style={{ padding: '1rem' }}>
                        {'⭐'.repeat(review.rating || 5)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {formatDate(review.timestamp)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          background: review.approved ? '#10b981' : '#f59e0b',
                          color: 'white'
                        }}>
                          {review.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {!review.approved && (
                          <button
                            onClick={() => handleApproveReview(review.id)}
                            style={{
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              marginRight: '0.5rem'
                            }}
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>📅 Bookings Management</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '1rem'
              }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Phone</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Package</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Date & Time</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>{booking.name}</td>
                      <td style={{ padding: '1rem' }}>{booking.email}</td>
                      <td style={{ padding: '1rem' }}>{booking.phone}</td>
                      <td style={{ padding: '1rem' }}>{booking.packageType || booking.package || 'Standard'}</td>
                      <td style={{ padding: '1rem' }}>
                        {formatDate(booking.dateTime || booking.date)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          background: '#10b981',
                          color: 'white'
                        }}>
                          {booking.status || 'Confirmed'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hall of Fame Tab */}
        {activeTab === 'hallOfFame' && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>🏆 Hall of Fame Management</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '1rem'
              }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Description</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#1e40af', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hallOfFame.map(hof => (
                    <tr key={hof.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>{hof.name}</td>
                      <td style={{ padding: '1rem' }}>{hof.description}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          background: hof.status === 'approved' ? '#10b981' : hof.status === 'pending' ? '#f59e0b' : '#dc2626',
                          color: 'white'
                        }}>
                          {hof.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {formatDate(hof.submittedAt)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => handleUpdateHallOfFame(hof.id, 'status', hof.status === 'approved' ? 'pending' : 'approved')}
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '0.5rem'
                          }}
                        >
                          {hof.status === 'approved' ? 'Unapprove' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDeleteHallOfFame(hof.id)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
