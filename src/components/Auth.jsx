import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';

const Auth = ({ mode, onClose, setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    phone: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
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
          updatedAt: new Date().toISOString()
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
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setUser(userCredential.user);
        onClose();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        // Update profile with display name
        if (formData.displayName) {
          await updateProfile(userCredential.user, {
            displayName: formData.displayName
          });
        }

        // Save additional user data to database
        const { database } = await import('../firebase');
        const { ref, push } = await import('firebase/database');

        await push(ref(database, 'users'), {
          uid: userCredential.user.uid,
          email: formData.email,
          displayName: formData.displayName,
          phone: formData.phone,
          profilePicture: formData.profilePicture || '',
          createdAt: new Date().toISOString()
        });

        setUser(userCredential.user);
        onClose();
      }
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
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="displayName">Full Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required={mode === 'signup'}
              />
            </div>
          )}

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="profilePicture">Profile Picture</label>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile Preview"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #fbbf24',
                      marginBottom: '0.5rem'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.5rem auto',
                    fontSize: '1.5rem',
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
                    id: 'profilePictureUpload'
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('profilePictureUpload').click()}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.9rem' }}
                >
                  {formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                </button>
              </div>
            </div>
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

          {mode === 'signup' && (
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
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={mode === 'signup' ? 6 : undefined}
            />
            {mode === 'signup' && (
              <small style={{ color: '#666' }}>Password must be at least 6 characters</small>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? <span className="spinner"></span> : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>

          <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            <span style={{ color: '#666' }}>OR</span>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#4285f4',
              borderColor: '#4285f4',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {loading ? <span className="spinner"></span> : 'Continue with Google'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                className="btn btn-secondary"
                onClick={() => window.showSignUpModal()}
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                className="btn btn-secondary"
                onClick={() => window.showSignInModal()}
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
