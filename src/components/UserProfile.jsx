import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, update, onValue } from 'firebase/database';

const UserProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load user profile data from database
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfileData(prev => ({
            ...prev,
            phone: data.phone || '',
            profilePicture: data.profilePicture || ''
          }));
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await update(ref(database, `users/${user.uid}`), {
        ...profileData,
        updatedAt: new Date().toISOString()
      });

      // Update Firebase auth profile
      if (user) {
        await user.updateProfile({
          displayName: profileData.displayName
        });
      }

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>👤 My Profile</h2>
          <button className="close-btn" onClick={() => window.closeProfileModal()}>
            &times;
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture</label>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #fbbf24'
                  }}
                />
              ) : (
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: '2rem',
                  color: '#1e40af'
                }}>
                  👤
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  display: 'none',
                  id: 'imageUpload'
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('imageUpload').click()}
                className="btn btn-secondary"
                style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}
              >
                {profileData.profilePicture ? 'Change Photo' : 'Upload Photo'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="displayName">Full Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={profileData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              disabled
              style={{ background: '#f3f4f6' }}
            />
            <small style={{ color: '#666' }}>Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              placeholder="+27 XX XXX XXXX"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? <span className="spinner"></span> : 'Save Profile'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
            💡 Your profile picture will be used when you submit reviews
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
