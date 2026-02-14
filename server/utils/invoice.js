/**
 * Invoice PDF Generation Utility
 * Generates invoice PDFs for confirmed bookings
 */

/**
 * Generate invoice PDF as base64 string
 * @param {Object} booking - Booking object with all related data
 * @returns {Promise<string>} Base64 encoded PDF string
 */
export async function generateInvoicePDF(booking) {
  try {
    // For now, we'll generate an HTML invoice that can be converted to PDF
    // In production, you can use libraries like pdfkit, puppeteer, or html-pdf-node
    
    const bookingReference = booking.bookingReference || `ABL-${booking.id.toString().padStart(6, '0')}-${new Date(booking.createdAt).getFullYear()}`;
    const invoiceDate = new Date(booking.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${bookingReference}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      border-bottom: 3px solid #10B981;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-info {
      margin-bottom: 20px;
    }
    .invoice-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .bill-to {
      margin-bottom: 30px;
    }
    .booking-details {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .amount-summary {
      text-align: right;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #001A33;
    }
    .total {
      font-size: 24px;
      font-weight: bold;
      color: #10B981;
      margin-top: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background-color: #f9fafb;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AsiaByLocals</h1>
    <div class="company-info">
      <p>118 Rani Bagh Indirapuram</p>
      <p>Ghaziabad, Uttar Pradesh, India</p>
      <p>GSTIN: 09BPLPK5079QIZU</p>
    </div>
  </div>

  <div class="invoice-details">
    <div>
      <h2>Invoice</h2>
      <p><strong>Booking Reference:</strong> ${bookingReference}</p>
    </div>
    <div>
      <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
    </div>
  </div>

  <div class="bill-to">
    <h3>Bill To</h3>
    <p>${booking.customerName}</p>
    <p>${booking.customerEmail}</p>
    ${booking.customerPhone ? `<p>${booking.customerPhone}</p>` : ''}
  </div>

  <div class="booking-details">
    <h3>Booking Details</h3>
    <table>
      <tr>
        <th>Tour</th>
        <td>${booking.tour?.title || 'Tour'}</td>
      </tr>
      <tr>
        <th>Location</th>
        <td>${booking.tour?.city || ''}, ${booking.tour?.country || ''}</td>
      </tr>
      <tr>
        <th>Booking Date</th>
        <td>${bookingDate}</td>
      </tr>
      <tr>
        <th>Number of Guests</th>
        <td>${booking.numberOfGuests} ${booking.numberOfGuests === 1 ? 'person' : 'people'}</td>
      </tr>
      ${booking.specialRequests ? `
      <tr>
        <th>Special Requests</th>
        <td>${booking.specialRequests}</td>
      </tr>
      ` : ''}
    </table>
  </div>

  <div>
    <h3>Payment Information</h3>
    <table>
      ${booking.razorpayPaymentId ? `
      <tr>
        <th>Payment ID</th>
        <td>${booking.razorpayPaymentId}</td>
      </tr>
      ` : ''}
      ${booking.razorpayOrderId ? `
      <tr>
        <th>Order ID</th>
        <td>${booking.razorpayOrderId}</td>
      </tr>
      ` : ''}
      <tr>
        <th>Payment Status</th>
        <td>Paid</td>
      </tr>
      <tr>
        <th>Payment Method</th>
        <td>Online Payment (Razorpay)</td>
      </tr>
    </table>
  </div>

  <div class="amount-summary">
    <p><strong>Subtotal:</strong> ${booking.currency === 'INR' ? '₹' : '$'}${booking.totalAmount.toLocaleString()}</p>
    <p class="total">Total Amount: ${booking.currency === 'INR' ? '₹' : '$'}${booking.totalAmount.toLocaleString()}</p>
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
    <p>Thank you for booking with AsiaByLocals!</p>
    <p>For any queries, please contact us at info@asiabylocals.com</p>
  </div>
</body>
</html>
    `;

    // Return HTML for now - can be converted to PDF using a service or library
    // In production, use pdfkit, puppeteer, or html-pdf-node to generate actual PDF
    return Buffer.from(invoiceHTML).toString('base64');
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw new Error('Failed to generate invoice PDF');
  }
}

/**
 * Generate invoice PDF URL (for storage/retrieval)
 * @param {number} bookingId - Booking ID
 * @returns {string} Invoice PDF URL path
 */
export function getInvoicePDFUrl(bookingId) {
  return `/api/invoices/${bookingId}/download`;
}
