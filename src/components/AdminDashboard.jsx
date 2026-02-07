import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';

const AdminDashboard = ({ user, onLogout }) => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({
    name: '',
    image: '',
    licenseCode: '',
    testimonial: '',
    date: ''
  });
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

    // Fetch drivers
    const driversRef = ref(database, 'lordsDrivers');
    onValue(driversRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const driversList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setDrivers(driversList);
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

  const handleAddDriver = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await push(ref(database, 'lordsDrivers'), {
        ...newDriver,
        addedAt: new Date().toISOString()
      });

      setNewDriver({
        name: '',
        image: '',
        licenseCode: '',
        testimonial: '',
        date: ''
      });
    } catch (error) {
      console.error('Error adding driver:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async (driverId) => {
    try {
      await remove(ref(database, `lordsDrivers/${driverId}`));
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #dc2626 100%)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🚗 Lords Driving School Admin</h1>
          <button
            onClick={onLogout}
            style={{
              background: 'white',
              color: '#dc2626',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
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
            onClick={() => setActiveTab('drivers')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'drivers' ? '#dc2626' : 'transparent',
              color: activeTab === 'drivers' ? 'white' : '#1e40af',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            👥 Lord's Drivers
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
          </div>
        )}

        {/* Lord's Drivers Tab */}
        {activeTab === 'drivers' && (
          <div>
            <h2 style={{ color: '#1e40af', marginBottom: '2rem' }}>
              Add New Driver
            </h2>

            <form onSubmit={handleAddDriver} style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '10px',
              marginBottom: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                    Driver Name
                  </label>
                  <input
                    type="text"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                    License Code
                  </label>
                  <select
                    value={newDriver.licenseCode}
                    onChange={(e) => setNewDriver({...newDriver, licenseCode: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                  >
                    <option value="">Select Code</option>
                    <option value="Code 8">Code 8</option>
                    <option value="Code 10">Code 10</option>
                    <option value="Code 14">Code 14</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newDriver.image}
                    onChange={(e) => setNewDriver({...newDriver, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                    License Date
                  </label>
                  <input
                    type="date"
                    value={newDriver.date}
                    onChange={(e) => setNewDriver({...newDriver, date: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                  Testimonial
                </label>
                <textarea
                  value={newDriver.testimonial}
                  onChange={(e) => setNewDriver({...newDriver, testimonial: e.target.value})}
                  placeholder="Driver's testimonial or achievement..."
                  rows="3"
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#1e40af',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  marginTop: '1rem'
                }}
              >
                {loading ? 'Adding...' : 'Add Driver'}
              </button>
            </form>

            <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>
              Current Drivers ({drivers.length})
            </h3>

            {drivers.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                textAlign: 'center',
                color: '#666'
              }}>
                No drivers added yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {drivers.map(driver => (
                  <div key={driver.id} style={{
                    background: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <img
                      src={driver.image}
                      alt={driver.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VGNUY1RjUiLz48dGV4dCB4PSIxNTAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EcnZlciBJbWFnZTwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>
                        {driver.name}
                      </h4>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                        {driver.licenseCode} • {new Date(driver.date).toLocaleDateString()}
                      </p>
                      <p style={{ fontStyle: 'italic', color: '#333', margin: '0 0 1rem 0' }}>
                        "{driver.testimonial}"
                      </p>
                      <button
                        onClick={() => handleDeleteDriver(driver.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        Delete
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

export default AdminDashboard;
