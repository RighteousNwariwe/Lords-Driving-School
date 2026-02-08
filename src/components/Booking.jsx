import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

const Booking = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    code: '',
    package: '',
    branch: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [dateError, setDateError] = useState('');

  const packages = {
    code8: [
      '1 lesson @R220',
      '5 lessons & Car Hire @R1750',
      '10 lessons & Car Hire @R2800',
      '12 lessons & Car Hire @R3100',
      'Car hire (Local) @R650'
    ],
    code10: [
      '1 lesson @R250',
      '5 lessons & Truck Hire @R2250',
      '10 lessons & Truck Hire @R3400',
      '12 lessons & Truck Hire @R3800',
      'Truck Hire (Local) @R1000',
      'Full package @R5000'
    ],
    code14: [
      '1 lesson @R500',
      '5 lessons & Truck Hire @R4000',
      '10 lessons & Truck Hire @R6400',
      'Truck Hire (Local) @R1500',
      'Full Package @R8000'
    ]
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear date error when user changes date
    if (e.target.name === 'preferredDate') {
      setDateError('');
    }
  };

  const validateDate = (dateString) => {
    if (!dateString) return '';

    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison

    // Check if date is in the past
    if (selectedDate < today) {
      return 'Please select a future date for your booking';
    }

    // Check if date is too far in the future (more than 3 months)
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setHours(23, 59, 59, 999); // End of day

    if (selectedDate > maxDate) {
      return 'Please select a date within the next 3 months';
    }

    // Check if date is on Sunday (closed day)
    if (selectedDate.getDay() === 0) {
      return 'We are closed on Sundays. Please select a weekday or Saturday.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date first
    const dateValidationError = validateDate(formData.preferredDate);
    if (dateValidationError) {
      setDateError(dateValidationError);
      return;
    }

    setLoading(true);

    try {
      await push(ref(database, 'bookings'), {
        ...formData,
        userId: user?.uid || null,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });

      // Send email notification to admin
      try {
        const subject = encodeURIComponent('New Booking Request - Lords Driving School');
        const body = encodeURIComponent(
          `New booking request received!\n\n` +
          `Customer Details:\n` +
          `Name: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `Phone: ${formData.phone}\n\n` +
          `Booking Details:\n` +
          `License Code: ${formData.code}\n` +
          `Package: ${formData.package}\n` +
          `Branch: ${formData.branch}\n` +
          `Preferred Date: ${formData.preferredDate}\n` +
          `Preferred Time: ${formData.preferredTime}\n\n` +
          `Message: ${formData.message}\n\n` +
          `Please log in to the admin dashboard to approve this booking:\n` +
          `https://lords-driving-school.web.app\n\n` +
          `Thank you!`
        );

        // Open email client with admin email
        window.open(`mailto:lordsdrivingschool@gmail.com?subject=${subject}&body=${body}`);
        console.log('Admin notification email opened');
      } catch (emailError) {
        console.error('Error opening admin email:', emailError);
      }

      setAlert({ type: 'success', message: 'Booking request submitted successfully! We will contact you within 24 hours.' });
      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        code: '',
        package: '',
        branch: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
      });
      setDateError('');
    } catch (error) {
      setAlert({ type: 'error', message: 'Error submitting booking. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Book Your Driving Lessons</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}

        {dateError && (
          <div className="alert alert-error">
            {dateError}
          </div>
        )}

        {!user ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fee2e2 100%)',
            borderRadius: '15px',
            border: '2px solid #fbbf24',
            margin: '2rem 0'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem', fontSize: '1.5rem' }}>Login Required</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Please sign in to book your driving lessons. This helps us provide you with better service and track your booking history.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  window.closeAllModals(); // Close all current modals
                  setTimeout(() => window.showSignInModal(), 100); // Then open sign-in modal
                }}
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #fbbf24 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)'
                }}
              >
                Sign In to Book
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
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
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="code">License Code *</label>
                <select
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select License Code</option>
                  <option value="code8">Code 8 (Light Motor Vehicle)</option>
                  <option value="code10">Code 10 (Heavy Motor Vehicle)</option>
                  <option value="code14">Code 14 (Articulated Vehicle)</option>
                </select>
              </div>

              {formData.code && (
                <div className="form-group">
                  <label htmlFor="package">Training Package *</label>
                  <select
                    id="package"
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Package</option>
                    {packages[formData.code].map((pkg, index) => (
                      <option key={index} value={pkg}>{pkg}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="branch">Preferred Branch *</label>
                <select
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="vanderbijlpark">Vanderbijlpark (Opposite Traffic Department)</option>
                  <option value="sasolburg">Sasolburg (Opposite Indaba Hotel)</option>
                  <option value="secunda">Secunda (Mpumalanga)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="preferredDate">Preferred Date *</label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    required
                    style={{
                      borderColor: dateError ? '#ef4444' : '#ddd'
                    }}
                  />
                  {dateError && (
                    <small style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      {dateError}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="preferredTime">Preferred Time</label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                  >
                    <option value="">Select Time</option>
                    <option value="08:00">08:00 AM</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Additional Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any special requirements or questions..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? <span className="spinner"></span> : 'Submit Booking Request'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '5px' }}>
              <h4 style={{ color: '#1e3a8a', marginBottom: '0.5rem' }}>📞 Need immediate assistance?</h4>
              <p style={{ margin: '0.5rem 0' }}>Call us now:</p>
              <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
                <li>082 542 4692 (Main)</li>
                <li>078 359 1357 (Sasolburg)</li>
                <li>072 910 9821 (Vanderbijlpark)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
