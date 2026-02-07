import React from 'react';

const Pricing = () => {
  const pricingData = {
    code8: [
      { lessons: '1 lesson', price: 'R220', carHire: '' },
      { lessons: '5 lessons & Car Hire', price: 'R1750', carHire: '' },
      { lessons: '10 lessons & Car Hire', price: 'R2800', carHire: '' },
      { lessons: '12 lessons & Car Hire', price: 'R3100', carHire: '' },
      { lessons: 'Car hire (Local)', price: 'R650', carHire: '' }
    ],
    code10: [
      { lessons: '1 lesson', price: 'R250', carHire: '' },
      { lessons: '5 lessons & Truck Hire', price: 'R2250', carHire: '' },
      { lessons: '10 lessons & Truck Hire', price: 'R3400', carHire: '' },
      { lessons: '12 lessons & Truck Hire', price: 'R3800', carHire: '' },
      { lessons: 'Truck Hire (Local)', price: 'R1000', carHire: '' },
      { lessons: 'Full package', price: 'R5000', carHire: '' }
    ],
    code14: [
      { lessons: '1 lesson', price: 'R500', carHire: '' },
      { lessons: '5 lessons & Truck Hire', price: 'R4000', carHire: '' },
      { lessons: '10 lessons & Truck Hire', price: 'R6400', carHire: '' },
      { lessons: 'Truck Hire (Local)', price: 'R1500', carHire: '' },
      { lessons: 'Full Package', price: 'R8000', carHire: '' }
    ]
  };

  return (
    <section id="pricing" className="section" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container">
        <h2>Our Pricing Packages</h2>

        <div className="pricing-grid">
          {/* Code 8 */}
          <div className="pricing-card featured">
            <h3>🚗 Code 8</h3>
            <div className="price">Starting from R220</div>
            <ul className="pricing-features">
              {pricingData.code8.map((item, index) => (
                <li key={index}>
                  <strong>{item.lessons}</strong>
                  <span style={{ float: 'right', color: '#fbbf24', fontWeight: 'bold' }}>{item.price}</span>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => window.showBookingModal()}>
              Book Code 8 Lessons
            </button>
          </div>

          {/* Code 10 */}
          <div className="pricing-card">
            <h3>🚚 Code 10</h3>
            <div className="price">Starting from R250</div>
            <ul className="pricing-features">
              {pricingData.code10.map((item, index) => (
                <li key={index}>
                  <strong>{item.lessons}</strong>
                  <span style={{ float: 'right', color: '#fbbf24', fontWeight: 'bold' }}>{item.price}</span>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => window.showBookingModal()}>
              Book Code 10 Lessons
            </button>
          </div>

          {/* Code 14 */}
          <div className="pricing-card">
            <h3>🚌 Code 14</h3>
            <div className="price">Starting from R500</div>
            <ul className="pricing-features">
              {pricingData.code14.map((item, index) => (
                <li key={index}>
                  <strong>{item.lessons}</strong>
                  <span style={{ float: 'right', color: '#fbbf24', fontWeight: 'bold' }}>{item.price}</span>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => window.showBookingModal()}>
              Book Code 14 Lessons
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>Available Branches</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <strong>🏢 Vanderbijlpark</strong><br />
              (Opposite Traffic Department)
            </div>
            <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <strong>🏢 Sasolburg</strong><br />
              (Opposite Indaba Hotel)
            </div>
            <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <strong>🏢 Secunda</strong><br />
              (Mpumalanga)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
