import React from 'react';

const GuideConfirmation: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const message = params.get('message');

  const getContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: '✅',
          title: 'Booking Confirmed!',
          body: 'Thank you for confirming this booking. The customer has been notified that you\'re all set. You\'ll receive a reminder 24 hours before the tour.',
          color: '#10B981',
        };
      case 'already-confirmed':
        return {
          icon: '📋',
          title: 'Already Confirmed',
          body: 'This booking has already been confirmed. No further action is needed.',
          color: '#F59E0B',
        };
      default:
        return {
          icon: '❌',
          title: 'Something Went Wrong',
          body: message || 'We couldn\'t process your confirmation. Please try again or contact support at info@asiabylocals.com.',
          color: '#EF4444',
        };
    }
  };

  const content = getContent();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 480, width: '100%', margin: '0 20px', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{content.icon}</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{content.title}</h1>
        <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.6, marginBottom: 32 }}>{content.body}</p>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 24 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#10B981' }}>AsiaByLocals</span>
          <span style={{ fontSize: 14, color: '#9ca3af' }}> — Travel with locals</span>
        </div>
      </div>
    </div>
  );
};

export default GuideConfirmation;
