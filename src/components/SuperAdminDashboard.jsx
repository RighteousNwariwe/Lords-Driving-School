import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, update, remove, get } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const SuperAdminDashboard = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [hallOfFameSubmissions, setHallOfFameSubmissions] = useState([]);
  const [hallOfFameApproved, setHallOfFameApproved] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalReviews: 0,
    pendingReviews: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalHallOfFame: 0,
    pendingHallOfFame: 0,
    totalUsers: 0,
    averageRating: 0
  });

  useEffect(() => {
    // Fetch all data
    const reviewsRef = ref(database, 'reviews');
    const bookingsRef = ref(database, 'bookings');
    const hallOfFameRef = ref(database, 'hallOfFameSubmissions');
    const hallOfFameApprovedRef = ref(database, 'hallOfFameApproved');
    const usersRef = ref(database, 'users');

    const unsubscribeReviews = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reviewsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setReviews(reviewsList);
      }
    });

    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setBookings(bookingsList);
      }
    });

    const unsubscribeHallOfFame = onValue(hallOfFameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const submissionsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setHallOfFameSubmissions(submissionsList);
      }
    });

    const unsubscribeHallOfFameApproved = onValue(hallOfFameApprovedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const approvedList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setHallOfFameApproved(approvedList);
      }
    });

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setUsers(usersList);
      }
    });

    setLoading(false);

    return () => {
      unsubscribeReviews();
      unsubscribeBookings();
      unsubscribeHallOfFame();
      unsubscribeHallOfFameApproved();
      unsubscribeUsers();
    };
  }, []);

  useEffect(() => {
    // Update analytics
    setAnalytics({
      totalReviews: reviews.length,
      pendingReviews: reviews.filter(r => !r.approved).length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      totalHallOfFame: hallOfFameApproved.length,
      pendingHallOfFame: hallOfFameSubmissions.length,
      totalUsers: users.length,
      averageRating: reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : 0
    });
  }, [reviews, bookings, hallOfFameSubmissions, hallOfFameApproved, users]);

  const handleApprove = async (type, id) => {
    try {
      const updates = {};
      if (type === 'review') {
        updates[`reviews/${id}/approved`] = true;
      } else if (type === 'booking') {
        updates[`bookings/${id}/status`] = 'confirmed';
        // Send email notification for booking confirmation
        const booking = bookings.find(b => b.id === id);
        if (booking && booking.email) {
          try {
            // Simple email notification using mailto link
            const subject = encodeURIComponent('Booking Confirmed - Lords Driving School');
            const body = encodeURIComponent(
              `Dear ${booking.name},\n\n` +
              `🎉 Great news! Your booking has been confirmed!\n\n` +
              `📅 Booking Details:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `📋 Date:       ${booking.preferredDate}\n` +
              `⏰ Time:       ${booking.preferredTime}\n` +
              `📦 Package:    ${booking.package}\n` +
              `🏢 Branch:     ${booking.branch}\n` +
              `📱 Phone:      ${booking.phone}\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
              `📍 Important Information:\n` +
              `• Please arrive 10 minutes before your scheduled time\n` +
              `• Bring your learner's license and ID document\n` +
              `• Wear comfortable shoes and appropriate clothing\n\n` +
              `📞 Contact Numbers (if you need to reschedule):\n` +
              `• Main Office:     082 542 4692\n` +
              `• Sasolburg:      078 359 1357\n` +
              `• Vanderbijlpark: 072 910 9821\n\n` +
              `💳 Payment Information:\n` +
              `• Payment can be made on the day of the lesson\n` +
              `• We accept cash and card payments\n\n` +
              `Thank you for choosing Lords Driving School!\n` +
              `We look forward to helping you become a safe and confident driver!\n\n` +
              `🚗 Lords Driving School\n` +
              `📍 Multiple Locations: Gauteng, Mpumalanga, Free State`
            );

            // Open email client
            window.open(`mailto:${booking.email}?subject=${subject}&body=${body}`);
            console.log('Booking confirmation email opened in email client');
          } catch (error) {
            console.error('Error opening email client:', error);
          }
        }
      } else if (type === 'hallOfFame') {
        const submission = hallOfFameSubmissions.find(s => s.id === id);
        if (submission) {
          updates[`hallOfFameApproved/${id}`] = { ...submission, approved: true, approvedAt: new Date().toISOString() };
          updates[`hallOfFameSubmissions/${id}`] = null;
        }
      }

      await update(ref(database), updates);
      console.log(`Successfully approved ${type} with ID: ${id}`);
    } catch (error) {
      console.error(`Error approving ${type}:`, error);
      alert(`Error approving ${type}. Please try again.`);
    }
  };

  const handleReject = async (type, id) => {
    if (!window.confirm(`Are you sure you want to reject this ${type}? This action cannot be undone.`)) {
      return;
    }

    try {
      const updates = {};
      if (type === 'review') {
        updates[`reviews/${id}`] = null;
      } else if (type === 'booking') {
        updates[`bookings/${id}/status`] = 'cancelled';
      } else if (type === 'hallOfFame') {
        updates[`hallOfFameSubmissions/${id}`] = null;
      }

      await update(ref(database), updates);
      console.log(`Successfully rejected ${type} with ID: ${id}`);
    } catch (error) {
      console.error(`Error rejecting ${type}:`, error);
      alert(`Error rejecting ${type}. Please try again.`);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      return;
    }

    try {
      const updates = {};
      if (type === 'review') {
        updates[`reviews/${id}`] = null;
      } else if (type === 'booking') {
        updates[`bookings/${id}`] = null;
      } else if (type === 'hallOfFame') {
        updates[`hallOfFameApproved/${id}`] = null;
      } else if (type === 'user') {
        updates[`users/${id}`] = null;
      }

      await update(ref(database), updates);
      console.log(`Successfully deleted ${type} with ID: ${id}`);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Error deleting ${type}. Please try again.`);
    }
  };

  const handleEdit = (item, type) => {
    setSelectedItem({ ...item, type });
    setEditForm(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updates = {};
      const { type, id } = selectedItem;

      if (type === 'review') {
        updates[`reviews/${id}`] = editForm;
      } else if (type === 'booking') {
        updates[`bookings/${id}`] = editForm;
      } else if (type === 'hallOfFame') {
        updates[`hallOfFameApproved/${id}`] = editForm;
      }

      await update(ref(database), updates);
      console.log(`Successfully edited ${type} with ID: ${id}`);
      setShowEditModal(false);
      setSelectedItem(null);
      setEditForm({});
    } catch (error) {
      console.error(`Error editing ${selectedItem?.type}:`, error);
      alert(`Error editing ${selectedItem?.type}. Please try again.`);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    onClose();
  };

  const renderAnalytics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>📊 Overview</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Reviews:</span>
            <strong>{analytics.totalReviews}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Pending Reviews:</span>
            <strong style={{ color: analytics.pendingReviews > 0 ? '#dc2626' : '#16a34a' }}>{analytics.pendingReviews}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Average Rating:</span>
            <strong>⭐ {analytics.averageRating}</strong>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>📅 Bookings</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Bookings:</span>
            <strong>{analytics.totalBookings}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Pending:</span>
            <strong style={{ color: analytics.pendingBookings > 0 ? '#dc2626' : '#16a34a' }}>{analytics.pendingBookings}</strong>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>🏆 Hall of Fame</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Approved:</span>
            <strong>{analytics.totalHallOfFame}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Pending:</span>
            <strong style={{ color: analytics.pendingHallOfFame > 0 ? '#dc2626' : '#16a34a' }}>{analytics.pendingHallOfFame}</strong>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>👥 Users</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Users:</span>
            <strong>{analytics.totalUsers}</strong>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>⭐ Reviews Management</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>User</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rating</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Comment</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {review.userPhoto && (
                      <img src={review.userPhoto} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    )}
                    <span>{review.userName || review.name || 'Anonymous'}</span>
                  </div>
                </td>
                <td style={{ padding: '0.75rem' }}>⭐ {review.rating}</td>
                <td style={{ padding: '0.75rem' }}>{review.comment}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '5px',
                    fontSize: '0.875rem',
                    background: review.approved ? '#16a34a' : '#f59e0b',
                    color: 'white'
                  }}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(review, 'review')}
                      style={{ padding: '0.25rem 0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    {!review.approved && (
                      <button
                        onClick={() => handleApprove('review', review.id)}
                        style={{ padding: '0.25rem 0.5rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete('review', review.id)}
                      style={{ padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>📅 Bookings Management</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>User</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Time</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Package</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem' }}>{booking.userName || booking.name || 'Anonymous'}</td>
                <td style={{ padding: '0.75rem' }}>{booking.date}</td>
                <td style={{ padding: '0.75rem' }}>{booking.time}</td>
                <td style={{ padding: '0.75rem' }}>{booking.package}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '5px',
                    fontSize: '0.875rem',
                    background: booking.status === 'confirmed' ? '#16a34a' : booking.status === 'cancelled' ? '#dc2626' : '#f59e0b',
                    color: 'white'
                  }}>
                    {booking.status || 'Pending'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(booking, 'booking')}
                      style={{ padding: '0.25rem 0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    {booking.status !== 'confirmed' && (
                      <button
                        onClick={() => handleApprove('booking', booking.id)}
                        style={{ padding: '0.25rem 0.5rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete('booking', booking.id)}
                      style={{ padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHallOfFame = () => (
    <div>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>🏆 Pending Hall of Fame Submissions</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {hallOfFameSubmissions.map((submission) => (
            <div key={submission.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h4>{submission.name}</h4>
                  <p style={{ color: '#666', fontSize: '0.875rem' }}>License: {submission.licenseCode}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleApprove('hallOfFame', submission.id)}
                    style={{ padding: '0.5rem 1rem', background: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject('hallOfFame', submission.id)}
                    style={{ padding: '0.5rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </div>
              </div>
              {submission.image && (
                <img src={submission.image} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
              )}
              <p>{submission.testimonial}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>🏆 Approved Hall of Fame</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {hallOfFameApproved.map((entry) => (
            <div key={entry.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h4>{entry.name}</h4>
                  <p style={{ color: '#666', fontSize: '0.875rem' }}>License: {entry.licenseCode}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(entry, 'hallOfFame')}
                    style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('hallOfFame', entry.id)}
                    style={{ padding: '0.5rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {entry.image && (
                <img src={entry.image} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
              )}
              <p>{entry.testimonial}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#f8fafc',
      zIndex: 9999,
      overflow: 'auto'
    }}>
      <div style={{ background: '#1e40af', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>🔧 Super Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Welcome Admin</span>
          <button
            onClick={handleLogout}
            style={{ padding: '0.5rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Logout
          </button>
          <button
            onClick={onClose}
            style={{ padding: '0.5rem 1rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {['analytics', 'reviews', 'bookings', 'hallOfFame'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab ? '#1e40af' : '#e5e7eb',
                color: activeTab === tab ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {tab === 'analytics' && '📊 Analytics'}
              {tab === 'reviews' && '⭐ Reviews'}
              {tab === 'bookings' && '📅 Bookings'}
              {tab === 'hallOfFame' && '🏆 Hall of Fame'}
            </button>
          ))}
        </div>

        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'reviews' && renderReviews()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'hallOfFame' && renderHallOfFame()}
      </div>

      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000
        }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ marginBottom: '1rem' }}>Edit {selectedItem?.type}</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {Object.keys(editForm).map((key) => (
                key !== 'id' && key !== 'type' && (
                  <div key={key}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </label>
                    {key === 'comment' || key === 'testimonial' ? (
                      <textarea
                        value={editForm[key] || ''}
                        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '5px' }}
                        rows="3"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editForm[key] || ''}
                        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '5px' }}
                      />
                    )}
                  </div>
                )
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ padding: '0.5rem 1rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{ padding: '0.5rem 1rem', background: '#1e40af', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
