import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <h1>Siyanakekela Lords Driving School</h1>
        <p>
          Come and get your license at one of the best and biggest top 10 driving schools in South Africa. 
          Trusted by everyone including the government with over 20 years in the industry.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => window.scrollTo({ top: document.getElementById('pricing').offsetTop, behavior: 'smooth' })}>
            View Pricing
          </button>
          <button className="btn btn-secondary" onClick={() => window.scrollTo({ top: document.getElementById('contact').offsetTop, behavior: 'smooth' })}>
            Contact Us
          </button>
        </div>
        
        <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ color: '#fbbf24', fontSize: '1.5rem' }}>20+ Years</h3>
            <p>Experience in driving education</p>
          </div>
          <div>
            <h3 style={{ color: '#fbbf24', fontSize: '1.5rem' }}>3 Provinces</h3>
            <p>Gauteng, Mpumalanga & Free State</p>
          </div>
          <div>
            <h3 style={{ color: '#fbbf24', fontSize: '1.5rem' }}>All Codes</h3>
            <p>Code 8, 10 & 14 Training</p>
          </div>
          <div>
            <h3 style={{ color: '#fbbf24', fontSize: '1.5rem' }}>Government Trusted</h3>
            <p>Registered and accredited</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
