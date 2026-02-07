import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push } from 'firebase/database';
import { whatsappReviews } from '../data/whatsappReviews.js';

const Reviews = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Use actual WhatsApp reviews from imported data
  const whatsappImages = whatsappReviews;

  useEffect(() => {
    // Fetch pending reviews
    const reviewsRef = ref(database, 'reviews');
    onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reviewsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setReviews(reviewsList);
      }
    });

    // Fetch approved reviews for Hall of Fame
    const approvedRef = ref(database, 'approvedReviews');
    onValue(approvedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const approvedList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setApprovedReviews(approvedList);
      }
    });
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      setAlert({ type: 'error', message: 'Please sign in to submit a review.' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      await push(ref(database, 'reviews'), {
        ...newReview,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL || null,
        timestamp: new Date().toISOString(),
        approved: false // Reviews need approval before showing
      });

      setAlert({ type: 'success', message: 'Review submitted successfully! It will be visible after admin approval.' });
      setNewReview({ name: '', rating: 5, comment: '' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error submitting review. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#fbbf24' : '#d1d5db' }}>
        ★
      </span>
    ));
  };

  return (
    <section id="reviews" className="section" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container">
        <h2>Lord's Drivers Hall of Fame</h2>

        {/* Customer Reviews */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ textAlign: 'center', color: '#1e40af', marginBottom: '2rem' }}>
            ⭐ Customer Testimonials
          </h3>
          <div className="reviews-grid">
            {/* WhatsApp Reviews */}
            {whatsappImages.map((review) => (
              <div key={review.id} className="review-card" style={{
                background: 'white',
                border: '2px solid #dc2626',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '20px',
                  background: '#dc2626',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  Customer Review
                </div>

                {/* Customer Image */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <img
                    src={review.image}
                    alt={`Customer review from ${review.author}`}
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '50px',
                    height: '50px',
                    margin: '0 auto',
                    background: '#dc2626',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}>
                    👤
                  </div>
                </div>

                <div className="review-header">
                  <div className="review-avatar" style={{ background: '#dc2626' }}>
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <strong>{review.author}</strong>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                      Customer • {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="stars">
                  {renderStars(review.rating)}
                </div>
                <p style={{ fontStyle: 'italic' }}>"{review.text}"</p>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: '#fef2f2',
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                  color: '#dc2626',
                  textAlign: 'center'
                }}>
                  📱 WhatsApp Review
                </div>
              </div>
            ))}

            {/* Approved Database Reviews */}
            {approvedReviews.map((review) => (
              <div key={review.id} className="review-card" style={{
                background: 'white',
                border: '2px solid #10b981',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '20px',
                  background: '#10b981',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  Hall of Fame
                </div>

                {/* User Profile Picture */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  {review.userPhoto ? (
                    <img
                      src={review.userPhoto}
                      alt={`Review from ${review.name}`}
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '50px',
                      height: '50px',
                      margin: '0 auto',
                      background: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem'
                    }}>
                      👤
                    </div>
                  )}
                </div>

                <div className="review-header">
                  <div className="review-avatar" style={{ background: '#10b981' }}>
                    {review.name ? review.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <strong>{review.name || 'Anonymous'}</strong>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                      Verified Customer • {new Date(review.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="stars">
                  {renderStars(review.rating)}
                </div>
                <p style={{ fontStyle: 'italic' }}>"{review.comment}"</p>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: '#f0fdf4',
                  borderRadius: '5px',
                  fontSize: '0.8rem',
                  color: '#10b981',
                  textAlign: 'center'
                }}>
                  ✅ Approved Review
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database Reviews */}
        {reviews.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '2rem' }}>
              ⭐ Recent Reviews
            </h3>
            <div className="reviews-grid">
              {reviews.filter(review => review.approved).map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">
                      {review.profilePicture ? (
                        <img
                          src={review.profilePicture}
                          alt={review.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        review.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <strong>{review.name}</strong>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        {new Date(review.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="stars">
                    {renderStars(review.rating)}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Review Form */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e40af', marginBottom: '1.5rem', textAlign: 'center' }}>
              Share Your Experience
            </h3>

            {!user && (
              <div style={{
                background: '#fef2f2',
                border: '2px solid #dc2626',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <p style={{ margin: '0', color: '#dc2626', fontWeight: 'bold' }}>
                  🔐 Please sign in to submit a review
                </p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.showSignInModal()}
                  >
                    Sign In to Review
                  </button>
                </p>
              </div>
            )}

            {alert && (
              <div className={`alert alert-${alert.type}`}>
                {alert.message}
              </div>
            )}

            <form onSubmit={handleSubmitReview}>
              {user && (
                <>
                  <div className="form-group">
                    <label htmlFor="reviewName">Your Name</label>
                    <input
                      type="text"
                      id="reviewName"
                      value={user.displayName || user.email}
                      disabled
                      style={{ background: '#f3f4f6' }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rating">Rating *</label>
                    <select
                      id="rating"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      required
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ Very Good</option>
                      <option value={3}>⭐⭐⭐ Good</option>
                      <option value={2}>⭐⭐ Fair</option>
                      <option value={1}>⭐ Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment">Your Review *</label>
                    <textarea
                      id="comment"
                      rows="4"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with Lords Driving School..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                    {loading ? <span className="spinner"></span> : 'Submit Review'}
                  </button>
                </>
              )}
            </form>

            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
                💡 <strong>Note:</strong> All reviews are reviewed by our admin team before being published to ensure quality and authenticity.
              </p>
            </div>
          </div>
        </div>

        {/* Hall of Fame Upload Section */}
        {user && (
          <div style={{ maxWidth: '800px', margin: '3rem auto 0' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '1.5rem', textAlign: 'center' }}>
                🏆 Want to Join Our Hall of Fame?
              </h3>
              <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                Upload a picture showing you acquiring your learner's license or passing your test.
                Our admin team will review and approve it for the Hall of Fame!
              </p>

              <HallOfFameUpload user={user} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Hall of Fame Upload Component
const HallOfFameUpload = ({ user }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const { database } = await import('../firebase');
      const { ref, push } = await import('firebase/database');

      await push(ref(database, 'hallOfFameSubmissions'), {
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        userPhoto: user.photoURL,
        image: selectedImage,
        description: description,
        status: 'pending', // pending, approved, rejected
        submittedAt: new Date().toISOString()
      });

      setSelectedImage(null);
      setDescription('');
      setAlert({ type: 'success', message: 'Submitted for review! Our admin team will approve it shortly.' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error submitting. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {alert && (
        <div className={`alert alert-${alert.type}`} style={{ marginBottom: '1rem' }}>
          {alert.message}
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
          Upload Image (License/Success Photo)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{
            display: 'none',
            id: 'hallOfFameImage'
          }}
        />
        <button
          type="button"
          onClick={() => document.getElementById('hallOfFameImage').click()}
          className="btn btn-secondary"
          style={{ marginBottom: '1rem', width: '100%' }}
        >
          {selectedImage ? 'Change Image' : 'Select Image'}
        </button>

        {selectedImage && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <img
              src={selectedImage}
              alt="Hall of Fame submission"
              style={{
                maxWidth: '300px',
                maxHeight: '200px',
                borderRadius: '10px',
                border: '3px solid #fbbf24'
              }}
            />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#1e40af' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us about your achievement (e.g., passed my Code 8 test, first license, etc.)"
          rows="3"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !selectedImage}
        style={{ width: '100%' }}
      >
        {loading ? <span className="spinner"></span> : 'Submit for Hall of Fame'}
      </button>
    </form>
  );
};

export default Reviews;
