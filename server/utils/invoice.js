import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Invoice PDF Generation Utility
 * Generates invoice PDFs for confirmed bookings
 */

/**
 * Generate invoice PDF as base64 string using PDFKit
 * @param {Object} booking - Booking object with all related data
 * @returns {Promise<string>} Base64 encoded PDF string
 */
export async function generateInvoicePDF(booking) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData.toString('base64'));
      });

      // --- Header ---
      // Add logo
      const logoPath = path.join(__dirname, '../../public/logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 40, { width: 60 });
      }

      doc
        .fillColor('#001A33')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('AsiaByLocals', 120, 50);

      doc
        .fontSize(10)
        .font('Helvetica')
        .text('118 Rani Bagh Indirapuram', 120, 80)
        .text('Agra, Uttar Pradesh, India', 120, 95)
        .text('GSTIN: 09BPLPK5079QIZU', 120, 110)
        .text('Email: info@asiabylocals.com', 120, 125);

      doc
        .strokeColor('#10B981')
        .lineWidth(3)
        .moveTo(50, 155)
        .lineTo(550, 155)
        .stroke();

      // --- Invoice Details ---
      const bookingReference = booking.bookingReference || `ABL-${booking.id.toString().padStart(6, '0')}`;
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

      doc.fontSize(20).text('INVOICE', 50, 170);
      doc.fontSize(10).font('Helvetica-Bold').text('Booking Reference:', 50, 200);
      doc.font('Helvetica').text(bookingReference, 150, 200);

      doc.font('Helvetica-Bold').text('Invoice Date:', 400, 200);
      doc.font('Helvetica').text(invoiceDate, 480, 200);

      // --- Bill To ---
      doc.fontSize(12).font('Helvetica-Bold').text('Bill To', 50, 230);
      doc.fontSize(10).font('Helvetica').text(booking.customerName, 50, 250);
      doc.text(booking.customerEmail, 50, 265);
      if (booking.customerPhone) {
        doc.text(booking.customerPhone, 50, 280);
      }

      // --- Booking Details ---
      doc.rect(50, 310, 500, 20).fill('#f9fafb');
      doc.fillColor('#000000').font('Helvetica-Bold').text('Description', 60, 315);
      doc.text('Details', 300, 315);

      let yPos = 340;

      const addRow = (label, value) => {
        doc.font('Helvetica-Bold').text(label, 60, yPos);
        doc.font('Helvetica').text(value, 300, yPos);
        yPos += 20;
        doc.moveTo(50, yPos - 5).lineTo(550, yPos - 5).strokeColor('#e5e7eb').lineWidth(1).stroke();
      };

      addRow('Tour', booking.tour?.title || 'Tour');
      if (booking.tour?.location || (booking.tour?.city && booking.tour?.country)) {
        addRow('Location', booking.tour?.location || `${booking.tour?.city}, ${booking.tour?.country}`);
      }
      addRow('Booking Date', bookingDate);
      addRow('Number of Guests', `${booking.numberOfGuests} ${booking.numberOfGuests === 1 ? 'person' : 'people'}`);
      if (booking.specialRequests) {
        addRow('Special Requests', booking.specialRequests);
      }

      // --- Payment Information ---
      yPos += 20;
      doc.fontSize(12).font('Helvetica-Bold').text('Payment Information', 50, yPos);
      yPos += 25;

      if (booking.razorpayPaymentId) {
        doc.fontSize(10).font('Helvetica-Bold').text('Payment ID:', 50, yPos);
        doc.font('Helvetica').text(booking.razorpayPaymentId, 150, yPos);
        yPos += 15;
      }

      if (booking.razorpayOrderId) {
        doc.font('Helvetica-Bold').text('Order ID:', 50, yPos);
        doc.font('Helvetica').text(booking.razorpayOrderId, 150, yPos);
        yPos += 15;
      }

      doc.font('Helvetica-Bold').text('Payment Status:', 50, yPos);
      doc.fillColor('#10B981').text('PAID', 150, yPos);
      doc.fillColor('#000000');
      yPos += 15;

      doc.font('Helvetica-Bold').text('Payment Method:', 50, yPos);
      doc.font('Helvetica').text('Online Payment (Razorpay)', 150, yPos);

      // --- Total ---
      yPos += 40;
      const currencySymbol = booking.currency === 'INR' ? '₹' : '$';
      const formattedAmount = `${currencySymbol}${booking.totalAmount.toLocaleString()}`;

      doc.moveTo(50, yPos).lineTo(550, yPos).strokeColor('#001A33').lineWidth(2).stroke();
      yPos += 15;

      doc.fontSize(12).font('Helvetica-Bold').text('Subtotal:', 350, yPos, { align: 'right', width: 100 });
      doc.font('Helvetica').text(formattedAmount, 460, yPos, { align: 'right' });

      yPos += 25;
      doc.fontSize(16).fillColor('#10B981').font('Helvetica-Bold').text('Total Amount:', 300, yPos, { align: 'right', width: 150 });
      doc.text(formattedAmount, 460, yPos, { align: 'right' });

      // --- Footer ---
      const footerY = 700;
      doc.moveTo(50, footerY).lineTo(550, footerY).strokeColor('#e5e7eb').lineWidth(1).stroke();
      doc.fontSize(10).fillColor('#6b7280').text('Thank you for booking with AsiaByLocals!', 50, footerY + 15, { align: 'center' });
      doc.text('For any queries, please contact us at info@asiabylocals.com', 50, footerY + 30, { align: 'center' });

      doc.end();

    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      reject(new Error('Failed to generate invoice PDF'));
    }
  });
}

/**
 * Generate invoice PDF URL (for storage/retrieval)
 * @param {number} bookingId - Booking ID
 * @returns {string} Invoice PDF URL path
 */
export function getInvoicePDFUrl(bookingId) {
  return `/api/invoices/${bookingId}/download`;
}
