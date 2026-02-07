import React, { useState } from 'react';

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Welcome to Lords Driving School! How can I help you today?',
      time: new Date().toLocaleTimeString()
    }
  ]);

  const predefinedResponses = [
    'What are your operating hours?',
    'How much do lessons cost?',
    'Where are your branches located?',
    'What license codes do you offer?',
    'How do I book a lesson?',
    'Do you offer car hire for tests?',
    'What documents do I need?'
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const userMessage = {
        type: 'user',
        text: message,
        time: new Date().toLocaleTimeString()
      };

      setMessages([...messages, userMessage]);
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = generateBotResponse(message);
        setMessages(prev => [...prev, {
          type: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString()
        }]);
      }, 1000);

      setMessage('');
    }
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hour') || lowerMessage.includes('time')) {
      return '🕐 Our operating hours are:\nMonday - Friday: 8:00 AM - 6:00 PM\nSaturday: 8:00 AM - 2:00 PM\nSunday: Closed';
    }
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('fee')) {
      return '💰 Our pricing varies by license code:\n\nCode 8: From R220 per lesson\nCode 10: From R250 per lesson\nCode 14: From R500 per lesson\n\nPackages with car hire available!';
    }
    if (lowerMessage.includes('branch') || lowerMessage.includes('location')) {
      return '📍 We have 3 branches:\n• Vanderbijlpark (Opposite Traffic Dept)\n• Sasolburg (Opposite Indaba Hotel)\n• Secunda (Mpumalanga)';
    }
    if (lowerMessage.includes('code') || lowerMessage.includes('license')) {
      return '🚗 We offer training for:\n• Code 8 (Light Motor Vehicle)\n• Code 10 (Heavy Motor Vehicle)\n• Code 14 (Articulated Vehicle)';
    }
    if (lowerMessage.includes('book') || lowerMessage.includes('lesson')) {
      return '📅 To book lessons:\n1. Sign up/in to your account\n2. Click "Book Lessons" in pricing\n3. Fill in your details\n4. We\'ll contact you within 24hrs!';
    }
    if (lowerMessage.includes('car hire') || lowerMessage.includes('test')) {
      return '🚗 Yes! We offer car hire for tests:\nCode 8: R650 (Local)\nCode 10: R1000 (Local)\nCode 14: R1500 (Local)';
    }
    if (lowerMessage.includes('document')) {
      return '📄 Required documents:\n• Valid ID document\n• Learner\'s license\n• 4 ID photos\n• Proof of address\n• Eye test certificate';
    }
    
    return '🤔 I\'m not sure about that. For specific inquiries, please call us:\n📞 082 542 4692 (Main)\n📞 078 359 1357 (Sasolburg)\n📞 072 910 9821 (Vanderbijlpark)';
  };

  const handlePredefinedClick = (question) => {
    setMessage(question);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#25d366',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
          zIndex: 9999,
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
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.358-.737-2.522-1.746l1.497-1.453c.816.795 1.918 1.738 3.141 1.738 2.499 0 4.585-1.06 5.907-2.714l2.917 2.917c.75.75 1.764.75 3.415-.004 4.175-.754.754-1.761.756-4.166.004-4.179zM15.525 22.562c-3.582 0-6.506-2.909-6.506-6.49 0-3.581 2.924-6.49 6.506-6.49 3.582 0 6.506 2.909 6.506 6.49 0 3.581-2.924 6.49-6.506 6.49zm0-11.635c-2.833 0-5.146 2.312-5.146 5.145s2.313 5.145 5.146 5.145 5.146-2.312 5.146-5.145-2.312-5.145-5.146-5.145zm-3.359 7.838c-.297-.149-1.358-.737-2.522-1.746l1.497-1.453c.816.795 1.918 1.738 3.141 1.738 2.499 0 4.585-1.06 5.907-2.714l2.917 2.917c.75.75 1.764.75 3.415-.004 4.175-.754.754-1.761.756-4.166.004-4.179z"/>
        </svg>
        {!isOpen && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#dc2626',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            1
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '350px',
          height: '500px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #25d366'
        }}>
          {/* Header */}
          <div style={{
            background: '#25d366',
            color: 'white',
            padding: '1rem',
            borderRadius: '13px 13px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.358-.737-2.522-1.746l1.497-1.453c.816.795 1.918 1.738 3.141 1.738 2.499 0 4.585-1.06 5.907-2.714l2.917 2.917c.75.75 1.764.75 3.415-.004 4.175-.754.754-1.761.756-4.166.004-4.179zM15.525 22.562c-3.582 0-6.506-2.909-6.506-6.49 0-3.581 2.924-6.49 6.506-6.49 3.582 0 6.506 2.909 6.506 6.49 0 3.581-2.924 6.49-6.506 6.49zm0-11.635c-2.833 0-5.146 2.312-5.146 5.145s2.313 5.145 5.146 5.145 5.146-2.312 5.146-5.145-2.312-5.145-5.146-5.145zm-3.359 7.838c-.297-.149-1.358-.737-2.522-1.746l1.497-1.453c.816.795 1.918 1.738 3.141 1.738 2.499 0 4.585-1.06 5.907-2.714l2.917 2.917c.75.75 1.764.75 3.415-.004 4.175-.754.754-1.761.756-4.166.004-4.179z"/>
              </svg>
              <span style={{ fontWeight: 'bold' }}>Lords Driving School</span>
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
            gap: '0.5rem'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '0.75rem',
                  borderRadius: '15px',
                  background: msg.type === 'user' ? '#dcf8c6' : '#f8fafc',
                  color: msg.type === 'user' ? '#000' : '#333',
                  border: msg.type === 'user' ? '1px solid #25d366' : '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem', opacity: 0.7 }}>
                    {msg.time}
                  </div>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div style={{
            padding: '0.5rem 1rem',
            background: '#f8fafc',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
              Quick Questions:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {predefinedResponses.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedClick(question)}
                  style={{
                    background: '#fbbf24',
                    border: 'none',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    color: '#1e40af',
                    fontWeight: 'bold'
                  }}
                >
                  {question.substring(0, 20)}...
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
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                background: '#25d366',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l10 11z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppChat;
