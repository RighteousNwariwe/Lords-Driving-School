import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🚗 Lords Driving School</h3>
            <p>
              Siyanakekela Lords Driving School - i driving school yodumo.<br />
              Thatha lento ayina bungozi!<br />
              Over 20 years of excellence in driving education.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <strong>Operating in 3 Provinces:</strong><br />
              🏢 Gauteng (Vanderbijlpark & Vereeniging)<br />
              🏢 Mpumalanga (Secunda)<br />
              🏢 Free State (Sasolburg)
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#reviews">Reviews</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Information</h3>
            <ul>
              <li>📞 082 542 4692</li>
              <li>📞 078 359 1357 (Sasolburg)</li>
              <li>📞 072 910 9821 (Vanderbijlpark)</li>
              <li>📞 016 973 1434 (Office)</li>
              <li>📧 lordsdrivingschool@gmail.com</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Office Address</h3>
            <p>
              <strong>Head Office:</strong><br />
              Office No. 10 Second Floor, Berjan Building<br />
              CNR Bain & Fichard Street, Sasolburg<br />
              (Opposite Indaba Hotel)
            </p>
            <div style={{ marginTop: '1rem' }}>
              <strong>Business Hours:</strong><br />
              Monday - Friday: 8:00 AM - 6:00 PM<br />
              Saturday: 8:00 AM - 2:00 PM<br />
              Sunday: Closed
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Lords Driving School. All rights reserved. | Infront of phambi kwabantu</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
            Trusted by the government • Top 10 Driving School in South Africa • Code 8, 10 & 14
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
