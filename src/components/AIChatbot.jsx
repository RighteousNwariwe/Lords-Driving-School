import React, { useState, useEffect, useRef } from 'react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Hi! I\'m the Lords Driving School AI assistant. I can help you with information about our services, pricing, branches, and booking. How can I assist you today?',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const drivingSchoolData = {
    hours: 'Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 8:00 AM - 2:00 PM, Sunday: Closed',
    branches: {
      'Vanderbijlpark': 'Opposite Traffic Department',
      'Sasolburg': 'Opposite Indaba Hotel',
      'Secunda': 'Mpumalanga'
    },
    pricing: {
      'Code 8': {
        '1 lesson': 'R220',
        '5 lessons & Car Hire': 'R1750',
        '10 lessons & Car Hire': 'R2800',
        '12 lessons & Car Hire': 'R3100',
        'Car hire (Local)': 'R650'
      },
      'Code 10': {
        '1 lesson': 'R250',
        '5 lessons & Truck Hire': 'R2250',
        '10 lessons & Truck Hire': 'R3400',
        '12 lessons & Truck Hire': 'R3800',
        'Truck Hire (Local)': 'R1000',
        'Full package': 'R5000'
      },
      'Code 14': {
        '1 lesson': 'R500',
        '5 lessons & Truck Hire': 'R4000',
        '10 lessons & Truck Hire': 'R6400',
        'Truck Hire (Local)': 'R1500',
        'Full Package': 'R8000'
      }
    },
    contacts: {
      main: '082 542 4692',
      vanderbijlpark: '072 910 9821',
      sasolburg: '078 359 1357',
      office: '016 973 1434',
      email: 'lordsdrivingschool@gmail.com'
    },
    documents: ['Valid ID document', 'Learner\'s license', '4 ID photos', 'Proof of address', 'Eye test certificate'],
    services: ['Code 8 training', 'Code 10 training', 'Code 14 training', 'Car hire for tests', 'License booking assistance']
  };

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting patterns
    if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return `👋 Welcome to Lords Driving School! I'm here to help you with any questions about our driving school services. What would you like to know?`;
    }

    // Hours inquiry
    if (lowerMessage.includes('hour') || lowerMessage.includes('time') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
      return `🕐 **Our Operating Hours:**\n\n${drivingSchoolData.hours}\n\nWe're open most of the week to serve you better!`;
    }

    // Pricing inquiries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('how much')) {
      if (lowerMessage.includes('code 8')) {
        return `💰 **Code 8 Pricing:**\n\n${Object.entries(drivingSchoolData.pricing['Code 8']).map(([item, price]) => `• ${item}: ${price}`).join('\n')}\n\nBest value for new drivers!`;
      } else if (lowerMessage.includes('code 10')) {
        return `💰 **Code 10 Pricing:**\n\n${Object.entries(drivingSchoolData.pricing['Code 10']).map(([item, price]) => `• ${item}: ${price}`).join('\n')}\n\nProfessional truck training!`;
      } else if (lowerMessage.includes('code 14')) {
        return `💰 **Code 14 Pricing:**\n\n${Object.entries(drivingSchoolData.pricing['Code 14']).map(([item, price]) => `• ${item}: ${price}`).join('\n')}\n\nAdvanced articulated vehicle training!`;
      } else {
        return `💰 **Our Pricing Structure:**\n\nWe offer competitive pricing for all license codes:\n\n**Code 8 (Light Motor Vehicle)**\n• Starting from R220 per lesson\n• Packages with car hire available\n\n**Code 10 (Heavy Motor Vehicle)**\n• Starting from R250 per lesson\n• Truck hire included in packages\n\n**Code 14 (Articulated Vehicle)**\n• Starting from R500 per lesson\n• Full packages available\n\nWhich code are you interested in?`;
      }
    }

    // Branch inquiries
    if (lowerMessage.includes('branch') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return `📍 **Our Branches:**\n\n${Object.entries(drivingSchoolData.branches).map(([branch, details]) => `• **${branch}**: ${details}`).join('\n')}\n\nAll branches are fully equipped with professional instructors!`;
    }

    // Service inquiries
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('provide')) {
      return `🚗 **Our Services:**\n\n${drivingSchoolData.services.map((service, index) => `${index + 1}. ${service}`).join('\n')}\n\nWith over 20 years of experience in the industry!`;
    }

    // Booking inquiries
    if (lowerMessage.includes('book') || lowerMessage.includes('lesson') || lowerMessage.includes('schedule')) {
      return `📅 **How to Book Lessons:**\n\n1. **Sign Up/In** to your account on our website\n2. **Visit the Pricing section** and click "Book Lessons"\n3. **Fill in your details** (name, contact, preferred date/time)\n4. **Choose your package** (Code 8, 10, or 14)\n5. **Submit** and we'll contact you within 24 hours!\n\n📞 For immediate booking, call: ${drivingSchoolData.contacts.main}`;
    }

    // Document inquiries
    if (lowerMessage.includes('document') || lowerMessage.includes('require') || lowerMessage.includes('need')) {
      return `📄 **Required Documents:**\n\n${drivingSchoolData.documents.map((doc, index) => `${index + 1}. ${doc}`).join('\n')}\n\nMake sure you have all documents ready before your first lesson!`;
    }

    // Contact inquiries
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('call')) {
      return `📞 **Contact Information:**\n\n**Main:** ${drivingSchoolData.contacts.main}\n**Vanderbijlpark:** ${drivingSchoolData.contacts.vanderbijlpark}\n**Sasolburg:** ${drivingSchoolData.contacts.sasolburg}\n**Office:** ${drivingSchoolData.contacts.office}\n**Email:** ${drivingSchoolData.contacts.email}\n\nWe're here to help!`;
    }

    // Experience/About inquiries
    if (lowerMessage.includes('experience') || lowerMessage.includes('about') || lowerMessage.includes('year') || lowerMessage.includes('history')) {
      return `🏆 **About Lords Driving School:**\n\n• **20+ years** of driving education excellence\n• **Top 10** driving school in South Africa\n• **Government accredited** and trusted\n• **3 provinces** coverage (Gauteng, Mpumalanga, Free State)\n• **All license codes** (Code 8, 10, 14)\n• **Professional instructors** with proven success rates\n\n"Thatha lento ayina bungozi" - Take this safe thing!`;
    }

    // License code information
    if (lowerMessage.includes('code 8') || lowerMessage.includes('light motor')) {
      return `🚗 **Code 8 Information:**\n\n**Vehicle Type:** Light motor vehicles (cars)\n**Minimum Age:** 17 years\n**Requirements:** Learner's license\n\n**Our Code 8 Training:**\n• Professional patient instructors\n• Modern training vehicles\n• Flexible scheduling\n• Affordable packages\n• High success rate\n\nPerfect for new drivers!`;
    }

    if (lowerMessage.includes('code 10') || lowerMessage.includes('heavy motor')) {
      return `🚚 **Code 10 Information:**\n\n**Vehicle Type:** Heavy motor vehicles\n**Minimum Age:** 18 years\n**Requirements:** Code 8 license + 1 year experience\n\n**Our Code 10 Training:**\n• Experienced truck instructors\n• Modern training trucks\n• Comprehensive safety training\n• License test preparation\n• Job placement assistance\n\nStart your truck driving career!`;
    }

    if (lowerMessage.includes('code 14') || lowerMessage.includes('articulated')) {
      return `🚌 **Code 14 Information:**\n\n**Vehicle Type:** Articulated vehicles\n**Minimum Age:** 22 years\n**Requirements:** Code 10 license + 2 years experience\n\n**Our Code 14 Training:**\n• Advanced articulated vehicle training\n• Expert instructors\n• Modern equipment\n• Safety certification\n• Industry connections\n\nBecome a professional truck driver!`;
    }

    // Test preparation
    if (lowerMessage.includes('test') || lowerMessage.includes('exam') || lowerMessage.includes('license')) {
      return `📝 **License Test Preparation:**\n\n**What We Cover:**\n• K53 test preparation\n• Practical driving test\n• Vehicle inspection\n• Road sign recognition\n• Parking maneuvers\n• Highway driving\n\n**Success Rate:** Over 95% first-time pass rate!\n\n**Car Hire for Tests:**\n• Code 8: R650 (Local)\n• Code 10: R1000 (Local)\n• Code 14: R1500 (Local)\n\nWe'll make sure you're test-ready!`;
    }

    // Payment methods
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('cash')) {
      return `💳 **Payment Options:**\n\n• **Cash payments** accepted at all branches\n• **EFT transfers** to our business account\n• **Card payments** available at main office\n• **Payment plans** available for packages\n\nContact us for payment details!`;
    }

    // Default response
    return `🤔 I'm not sure I understand that. Here's what I can help you with:\n\n📅 **Booking lessons**\n💰 **Pricing information**\n📍 **Branch locations**\n📞 **Contact details**\n📄 **Required documents**\n🚗 **License codes (8, 10, 14)**\n📝 **Test preparation**\n🏆 **About our school**\n\nTry asking about any of these topics, or call ${drivingSchoolData.contacts.main} for immediate assistance!`;
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const userMessage = {
        type: 'user',
        text: message,
        time: new Date().toLocaleTimeString()
      };

      setMessages([...messages, userMessage]);
      setMessage('');
      setIsTyping(true);

      // Simulate AI response delay
      setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        setMessages(prev => [...prev, {
          type: 'bot',
          text: aiResponse,
          time: new Date().toLocaleTimeString()
        }]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'What are your prices?',
    'Where are your branches?',
    'How do I book lessons?',
    'What documents do I need?',
    'What are your hours?',
    'Tell me about Code 8',
    'Tell me about Code 10',
    'Tell me about Code 14'
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e40af 0%, #dc2626 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(30, 64, 175, 0.4)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span style={{ color: 'white', fontSize: '24px' }}>🤖</span>
        {!isOpen && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#fbbf24',
            color: '#1e40af',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            ?
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '20px',
          width: '380px',
          height: '550px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #1e40af'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #dc2626 100%)',
            color: 'white',
            padding: '1rem',
            borderRadius: '13px 13px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <span style={{ fontWeight: 'bold' }}>Lords AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '0.75rem',
                  borderRadius: '15px',
                  background: msg.type === 'user' 
                    ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
                    : '#f8fafc',
                  color: msg.type === 'user' ? '#1e40af' : '#333',
                  border: msg.type === 'user' ? '2px solid #fbbf24' : '1px solid #e5e7eb',
                  wordBreak: 'break-word'
                }}>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    marginBottom: '0.5rem', 
                    opacity: 0.7,
                    fontWeight: 'bold'
                  }}>
                    {msg.type === 'bot' ? '🤖 AI Assistant' : '👤 You'} • {msg.time}
                  </div>
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '15px',
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                    <span style={{ color: '#666' }}>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div style={{
            padding: '0.75rem 1rem',
            background: '#f8fafc',
            borderTop: '1px solid #e5e7eb',
            borderRadius: '0 0 13px 13px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              💡 Quick Questions:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(question)}
                  style={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    color: '#1e40af',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fbbf24';
                    e.currentTarget.style.color = '#1e40af';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#1e40af';
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Lords Driving School..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              style={{
                background: message.trim() && !isTyping 
                  ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
                  : '#e5e7eb',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: message.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: message.trim() && !isTyping ? '#1e40af' : '#666'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l10 11z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
