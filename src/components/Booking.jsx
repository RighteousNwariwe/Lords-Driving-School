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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await push(ref(database, 'bookings'), {
        ...formData,
        userId: user?.uid || null,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
      
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
              <label htmlFor="preferredDate">Preferred Date</label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
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
    </div>
  );
};

export default Booking;
