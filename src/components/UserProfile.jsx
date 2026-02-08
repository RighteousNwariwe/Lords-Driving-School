import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, update, onValue } from 'firebase/database';

const UserProfile = ({ user, onClose }) => {
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    // Load user's profile picture from database
    const loadProfilePicture = async () => {
      try {
        onValue(ref(database, `users/${user.uid}`), (snapshot) => {
          const data = snapshot.val();
          if (data && data.profilePicture) {
            setProfileData(prev => ({
              ...prev,
              profilePicture: data.profilePicture
            }));
          }
        });
      } catch (error) {
        console.error('Error loading profile picture:', error);
      }
    };

    loadProfilePicture();
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setAlert({ type: 'error', message: 'Image size should be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({ ...prev, profilePicture: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemovePicture = async () => {
    setProfileData(prev => ({ ...prev, profilePicture: null }));

    // Remove profile picture from database
    try {
      await update(ref(database, `users/${user.uid}`), {
        profilePicture: null,
        lastUpdated: new Date().toISOString()
      });

      setAlert({ type: 'success', message: 'Profile picture removed successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error removing profile picture. Please try again.' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      // Validate required fields
      if (!profileData.displayName.trim()) {
        setAlert({ type: 'error', message: 'Display name is required' });
        setLoading(false);
        return;
      }

      // Update database
      await update(ref(database, `users/${user.uid}`), {
        displayName: profileData.displayName.trim(),
        phone: profileData.phone.trim(),
        profilePicture: profileData.profilePicture,
        updatedAt: new Date().toISOString()
      });

      // Update Firebase auth profile
      if (user && profileData.displayName.trim() !== user.displayName) {
        await user.updateProfile({
          displayName: profileData.displayName.trim()
        });
      }

      setAlert('Profile updated successfully!');
      setTimeout(() => setAlert(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setAlert(`Error updating profile: ${error.message || 'Please try again.'}`);
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

        {alert && (
          <div className={`alert ${alert.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {alert}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Pictures</label>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Profile Picture</h3>

              {profileData.profilePicture ? (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #dc2626'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  border: '3px solid #dc2626'
                }}>
                  <span style={{ color: '#666', fontSize: '2rem' }}>👤</span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{
                  display: 'none',
                  id: 'imageUpload'
                }}
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="btn btn-primary"
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  background: '#8b5cf6',
                  border: '2px solid #8b5cf6',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#7c3aed';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#8b5cf6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📸 {profileData.profilePicture ? 'Change Photo' : 'Upload Photo'}
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
