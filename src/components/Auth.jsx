import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';

const Auth = ({ mode, onClose, setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    phone: '',
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, profilePicture: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Save Google profile picture to database
      const { database } = await import('../firebase');
      const { ref, push, update } = await import('firebase/database');

      if (result.user.photoURL) {
        await update(ref(database, `users/${result.user.uid}`), {
          profilePicture: result.user.photoURL,
          lastUpdated: new Date().toISOString()
        });
      }

      setUser(result.user);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        // Update profile with display name and profile pictures
        await updateProfile(result.user, {
          displayName: formData.displayName
        });

        // Save profile pictures to database
        const { database } = await import('../firebase');
        const { ref, update } = await import('firebase/database');

        if (formData.profilePicture) {
          await update(ref(database, `users/${result.user.uid}`), {
            displayName: formData.displayName,
            phone: formData.phone,
            profilePicture: formData.profilePicture,
            createdAt: new Date().toISOString()
          });
        }
      }

      setUser(auth.currentUser);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label htmlFor="displayName">Full Name</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  style={{
                    display: 'none',
                    id: 'profilePictureUpload'
                  }}
                />
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="btn btn-primary"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    background: '#3b82f6',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#2563eb';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#3b82f6';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  📸 {formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                </button>

                {formData.profilePicture && (
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <img
                      src={formData.profilePicture}
                      alt="Profile preview"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? <span className="spinner"></span> : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn btn-secondary"
            disabled={loading}
            style={{ width: '100%', background: '#4285f4', border: '#4285f4' }}
          >
            {loading ? <span className="spinner"></span> : '🔗 Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
