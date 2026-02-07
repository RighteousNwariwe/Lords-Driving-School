import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';

const AdminDashboard = ({ user, onLogout, onClose }) => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [hallOfFameSubmissions, setHallOfFameSubmissions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    // Fetch pending reviews
    const pendingRef = ref(database, 'reviews');
    onValue(pendingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pending = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(review => !review.approved);
        setPendingReviews(pending);
      }
    });

    // Fetch approved reviews
    const approvedRef = ref(database, 'approvedReviews');
    onValue(approvedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const approved = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setApprovedReviews(approved);
      }
    });

    // Fetch Hall of Fame submissions
    const hallOfFameRef = ref(database, 'hallOfFameSubmissions');
    onValue(hallOfFameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const submissions = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setHallOfFameSubmissions(submissions);
      }
    });

    // Fetch bookings
    const bookingsRef = ref(database, 'bookings');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setBookings(bookingsList);
      }
    });
  }, []);

  const handleApproveReview = async (reviewId) => {
    try {
      const review = pendingReviews.find(r => r.id === reviewId);
      if (review) {
        // Add to approved reviews
        await push(ref(database, 'approvedReviews'), {
          ...review,
          approved: true,
          approvedAt: new Date().toISOString()
        });

        // Remove from pending
        await update(ref(database, `reviews/${reviewId}`), { approved: true });
      }
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await remove(ref(database, `reviews/${reviewId}`));
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await remove(ref(database, `approvedReviews/${reviewId}`));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const sendBookingNotification = async (booking) => {
    try {
      // Send email notification to admin
      const emailContent = `
        New Booking Received!
        
        Student: ${booking.studentName}
        Email: ${booking.email}
        Phone: ${booking.phone}
        License Code: ${booking.licenseCode}
        Date: ${new Date(booking.date).toLocaleDateString()}
        Time: ${booking.time}
        Branch: ${booking.branch}
        Message: ${booking.message}
        
        Please contact the student to confirm the booking.
      `;

      // For now, we'll log the notification. In production, you'd integrate with an email service
      console.log('Booking notification sent:', emailContent);

      // You could integrate with services like:
      // - EmailJS
      // - SendGrid
      // - Firebase Cloud Functions with SendGrid
      // - AWS SES

    } catch (error) {
      console.error('Error sending booking notification:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '1200px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h1>🚗 Lords Driving School Admin</h1>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="container" style={{ padding: '2rem 0' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '1rem 2rem',
                background: activeTab === 'reviews' ? '#dc2626' : 'transparent',
                color: activeTab === 'reviews' ? 'white' : '#1e40af',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '1rem'
              }}
            >
              📝 Reviews Management
            </button>
            <button
              onClick={() => setActiveTab('hallOfFame')}
              style={{
                padding: '1rem 2rem',
                background: activeTab === 'hallOfFame' ? '#dc2626' : 'transparent',
                color: activeTab === 'hallOfFame' ? 'white' : '#1e40af',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '1rem'
              }}
            >
              🏆 Hall of Fame
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              style={{
                padding: '1rem 2rem',
                background: activeTab === 'bookings' ? '#dc2626' : 'transparent',
                color: activeTab === 'bookings' ? 'white' : '#1e40af',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📅 Bookings Management
            </button>
          </div>

          {/* Reviews Management Tab */}
          {activeTab === 'reviews' && (
            <div>
              <h2 style={{ color: '#1e40af', marginBottom: '2rem' }}>
                Pending Reviews ({pendingReviews.length})
              </h2>

              {pendingReviews.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  No pending reviews to review.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {pendingReviews.map(review => (
                    <div key={review.id} style={{
                      background: 'white',
                      padding: '1.5rem',
                      borderRadius: '10px',
                      border: '2px solid #fbbf24',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>
                            {review.name}
                          </h4>
                          <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                            {review.email} • {new Date(review.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleApproveReview(review.id)}
                            style={{
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleRejectReview(review.id)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        {'⭐'.repeat(review.rating)}
                      </div>
                      <p style={{ fontStyle: 'italic', color: '#333' }}>
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <h3 style={{ color: '#1e40af', marginTop: '3rem', marginBottom: '1rem' }}>
                Approved Reviews ({approvedReviews.length})
              </h3>

              {approvedReviews.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  No approved reviews yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {approvedReviews.map(review => (
                    <div key={review.id} style={{
                      background: 'white',
                      padding: '1.5rem',
                      borderRadius: '10px',
                      border: '2px solid #10b981',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>
                            {review.name}
                          </h4>
                          <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                            {review.email} • {new Date(review.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        {'⭐'.repeat(review.rating)}
                      </div>
                      <p style={{ fontStyle: 'italic', color: '#333' }}>
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookings Management Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h2 style={{ color: '#1e40af', marginBottom: '2rem' }}>
                📅 Bookings Management ({bookings.length})
              </h2>

              {bookings.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  No bookings scheduled yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {bookings.map(booking => (
                    <div key={booking.id} style={{
                      background: 'white',
                      padding: '1.5rem',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>
                            {booking.studentName}
                          </h4>
                          <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                            � {booking.email}
                          </p>
                          <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                            📱 {booking.phone || 'Not provided'}
                          </p>
                          <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                            �� {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                          <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                            🎯 {booking.licenseCode}
                          </p>
                          <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                            � {booking.branch || 'Not specified'}
                          </p>
                          {booking.message && (
                            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontStyle: 'italic' }}>
                              💬 "{booking.message}"
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            background: booking.status === 'confirmed' ? '#10b981' : '#fbbf24',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                          }}>
                            {booking.status || 'Pending'}
                          </span>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#666' }}>
                            Booked: {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button
                              onClick={() => {
                                // Update booking status to confirmed
                                update(ref(database, `bookings/${booking.id}`), {
                                  ...booking,
                                  status: 'confirmed',
                                  confirmedAt: new Date().toISOString()
                                });
                              }}
                              style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              ✓ Confirm
                            </button>
                            <button
                              onClick={() => {
                                // Update booking status to cancelled
                                update(ref(database, `bookings/${booking.id}`), {
                                  ...booking,
                                  status: 'cancelled',
                                  cancelledAt: new Date().toISOString()
                                });
                              }}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              ✗ Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hall of Fame Management Tab */}
          {activeTab === 'hallOfFame' && (
            <div>
              <h2 style={{ color: '#1e40af', marginBottom: '2rem' }}>
                🏆 Hall of Fame Management ({hallOfFameSubmissions.length})
              </h2>

              {hallOfFameSubmissions.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  No Hall of Fame submissions yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {hallOfFameSubmissions.map(submission => (
                    <div key={submission.id} style={{
                      background: 'white',
                      padding: '1.5rem',
                      borderRadius: '10px',
                      border: `2px solid ${submission.status === 'approved' ? '#10b981' : submission.status === 'rejected' ? '#ef4444' : '#fbbf24'}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>
                            {submission.userName}
                          </h4>
                          <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                            {submission.userEmail} • {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                          <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                            Status: <span style={{
                              background: submission.status === 'approved' ? '#10b981' : submission.status === 'rejected' ? '#ef4444' : '#fbbf24',
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '10px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}>{submission.status}</span>
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {submission.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  update(ref(database, `hallOfFameSubmissions/${submission.id}`), {
                                    ...submission,
                                    status: 'approved',
                                    approvedAt: new Date().toISOString()
                                  });
                                }}
                                style={{
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.5rem 1rem',
                                  borderRadius: '5px',
                                  cursor: 'pointer'
                                }}
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => {
                                  update(ref(database, `hallOfFameSubmissions/${submission.id}`), {
                                    ...submission,
                                    status: 'rejected',
                                    rejectedAt: new Date().toISOString()
                                  });
                                }}
                                style={{
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.5rem 1rem',
                                  borderRadius: '5px',
                                  cursor: 'pointer'
                                }}
                              >
                                ✗ Reject
                              </button>
                            </>
                          )}
                          {submission.status === 'approved' && (
                            <button
                              onClick={() => {
                                update(ref(database, `hallOfFameSubmissions/${submission.id}`), {
                                  ...submission,
                                  status: 'pending'
                                });
                              }}
                              style={{
                                background: '#fbbf24',
                                color: '#1e40af',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                cursor: 'pointer'
                              }}
                            >
                              ↩️ Revert to Pending
                            </button>
                          )}
                          {submission.status === 'rejected' && (
                            <button
                              onClick={() => {
                                update(ref(database, `hallOfFameSubmissions/${submission.id}`), {
                                  ...submission,
                                  status: 'pending'
                                });
                              }}
                              style={{
                                background: '#fbbf24',
                                color: '#1e40af',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                cursor: 'pointer'
                              }}
                            >
                              ↩️ Revert to Pending
                            </button>
                          )}
                        </div>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>
                        {submission.image && (
                          <img
                            src={submission.image}
                            alt="Hall of Fame submission"
                            style={{
                              maxWidth: '200px',
                              maxHeight: '150px',
                              borderRadius: '10px',
                              border: '3px solid #fbbf24'
                            }}
                          />
                        )}
                      </div>
                      {submission.description && (
                        <p style={{ margin: '0', color: '#666', fontStyle: 'italic' }}>
                          "{submission.description}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
