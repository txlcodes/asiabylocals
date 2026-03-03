import React from 'react';

const GuideConfirmation: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const message = params.get('message');

  // Booking details from URL params
  const tour = params.get('tour');
  const date = params.get('date');
  const guests = params.get('guests');
  const customer = params.get('customer');
  const customerEmail = params.get('customerEmail');
  const customerPhone = params.get('customerPhone');
  const amount = params.get('amount');
  const currency = params.get('currency') || 'USD';
  const bookingId = params.get('bookingId');
  const invoiceUrl = params.get('invoice');

  const hasBookingDetails = tour && date && bookingId;

  const getContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: '✅',
          title: 'Booking Confirmed!',
          body: 'Thank you for confirming. The customer has been notified and you\'ll receive a reminder 24 hours before the tour.',
          color: '#10B981',
          bgColor: '#ecfdf5',
        };
      case 'already-confirmed':
        return {
          icon: '📋',
          title: 'Already Confirmed',
          body: 'This booking was already confirmed. No further action needed.',
          color: '#F59E0B',
          bgColor: '#fffbeb',
        };
      default:
        return {
          icon: '❌',
          title: 'Something Went Wrong',
          body: message || 'We couldn\'t process your confirmation. Please try again or contact support at info@asiabylocals.com.',
          color: '#EF4444',
          bgColor: '#fef2f2',
        };
    }
  };

  const content = getContent();

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const row = (label: string, value: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ color: '#6b7280', fontSize: 14 }}>{label}</span>
      <span style={{ color: '#111827', fontSize: 14, fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui, sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: 520, width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

        {/* Status Banner */}
        <div style={{ background: content.bgColor, padding: '32px 24px', textAlign: 'center', borderBottom: `3px solid ${content.color}` }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{content.icon}</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{content.title}</h1>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5, margin: 0 }}>{content.body}</p>
        </div>

        {/* Booking Details */}
        {hasBookingDetails && (
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📄</span> Booking Details
            </h2>

            {row('Booking ID', `#ABL-${bookingId?.padStart(6, '0')}`)}
            {tour && row('Tour', tour)}
            {date && row('Date', formatDate(date))}
            {guests && row('Guests', `${guests} ${parseInt(guests) === 1 ? 'person' : 'people'}`)}
            {amount && row('Amount', `${currency} ${parseFloat(amount).toLocaleString()}`)}

            {/* Customer Info */}
            {customer && (
              <div style={{ marginTop: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>👤</span> Customer Details
                </h2>
                {row('Name', customer)}
                {customerEmail && row('Email', customerEmail)}
                {customerPhone && row('Phone', customerPhone)}
              </div>
            )}

            {/* Invoice Download */}
            {invoiceUrl && (
              <a
                href={invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  marginTop: 24, padding: '14px 20px',
                  background: '#10B981', color: '#fff', borderRadius: 8,
                  textDecoration: 'none', fontWeight: 600, fontSize: 15,
                }}
              >
                📥 Download Invoice
              </a>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '16px 24px', textAlign: 'center', background: '#fafafa' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#10B981' }}>AsiaByLocals</span>
          <span style={{ fontSize: 13, color: '#9ca3af' }}> — Travel with locals</span>
        </div>
      </div>
    </div>
  );
};

export default GuideConfirmation;
