import React, { useState } from 'react';
import Map from './Map';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    branch: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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
      // Send directly to WhatsApp
      const whatsappNumber = '+27659911502';
      const whatsappMessage = `*New Contact Message from Lords Driving School Website*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Branch:* ${formData.branch || 'Not specified'}\n\n*Message:*\n${formData.message}`;

      // Create WhatsApp link
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      setAlert({ type: 'success', message: 'Message sent to WhatsApp successfully!' });
      setFormData({ name: '', email: '', phone: '', message: '', branch: '' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error sending message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2>Contact Us</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginTop: '2rem' }}>
          {/* Contact Information */}
          <div>
            <div className="contact-info">
              <div className="contact-card">
                <h3 style={{ color: 'black', marginBottom: '1rem' }}>📞 Phone Numbers</h3>
                <p style={{ color: 'black' }}><strong>Main:</strong> 082 542 4692</p>
                <p style={{ color: 'black' }}><strong>Sasolburg:</strong> 078 359 1357</p>
                <p style={{ color: 'black' }}><strong>Vanderbijlpark:</strong> 072 910 9821</p>
                <p style={{ color: 'black' }}><strong>Office:</strong> 016 973 1434</p>
              </div>

              <div className="contact-card">
                <h3 style={{ color: 'black', marginBottom: '1rem' }}>📧 Email</h3>
                <p style={{ color: 'black' }}>lordsdrivingschool@gmail.com</p>
              </div>

              <div className="contact-card">
                <h3 style={{ color: 'black', marginBottom: '1rem' }}>📍 Head Office</h3>
                <p style={{ color: 'black' }}>
                  Office No. 10 Second Floor, Berjan Building<br />
                  CNR Bain & Fichard Street, Sasolburg<br />
                  (Opposite Indaba Hotel)
                </p>
              </div>

              <div className="contact-card">
                <h3 style={{ color: 'black', marginBottom: '1rem' }}>🕐 Business Hours</h3>
                <p style={{ color: 'black' }}><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                <p style={{ color: 'black' }}><strong>Saturday:</strong> 8:00 AM - 2:00 PM</p>
                <p style={{ color: 'black' }}><strong>Sunday:</strong> Closed</p>
              </div>
            </div>
            {/* Contact Form */}
            <div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#000000', marginBottom: '1.5rem' }}>Send us a Message</h3>

                {alert && (
                  <div className={`alert alert-${alert.type}`}>
                    {alert.message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" style={{ color: '#000000', fontWeight: 'bold' }}>Full Name *</label>
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
                    <label htmlFor="email" style={{ color: '#000000', fontWeight: 'bold' }}>Email Address *</label>
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
                    <label htmlFor="phone" style={{ color: '#000000', fontWeight: 'bold' }}>Phone Number *</label>
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
                    <label htmlFor="branch">Preferred Branch</label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                    >
                      <option value="">Select Branch</option>
                      <option value="sasolburg">Sasolburg</option>
                      <option value="vanderbijlpark">Vanderbijlpark</option>
                      <option value="secunda">Secunda</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" style={{ color: '#000000', fontWeight: 'bold' }}>Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading} style={{
                    width: '100%',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: '2px solid #dc2626',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    {loading ? <span className="spinner"></span> : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Google Maps Section */}
            <div style={{ gridColumn: '1 / -1' }}>
              <Map />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
