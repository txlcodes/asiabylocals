import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Mail, Phone, MessageCircle, User, Calendar, Users, MapPin, ArrowLeft, X, AlertCircle } from 'lucide-react';

const BookingPage: React.FC = () => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      // Extract booking ID from URL
      const pathMatch = window.location.pathname.match(/^\/booking\/(\d+)$/);
      const bookingId = pathMatch ? pathMatch[1] : null;

      // Check for status query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const statusParam = urlParams.get('status');

      if (statusParam === 'failed') {
        setStatus('failed');
      }

      if (!bookingId) {
        setError('Invalid booking ID');
        setLoading(false);
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/bookings/${bookingId}/confirmation`);
        const data = await response.json();

        if (data.success) {
          setBooking(data.booking);
          // Determine status from booking data
          if (data.booking.paymentStatus === 'paid' && data.booking.status === 'confirmed') {
            setStatus('success');
          } else if (data.booking.paymentStatus === 'failed' || data.booking.status === 'payment_failed') {
            setStatus('failed');
          }
        } else {
          setError(data.message || 'Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, []);

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <X className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-black text-[#001A33] mb-2">Booking Not Found</h2>
          <p className="text-gray-600 font-semibold mb-6">{error || 'The booking you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-[#10B981] text-white font-black rounded-xl hover:bg-[#059669] transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Show payment failed state
  if (status === 'failed' || booking?.status === 'payment_failed' || booking?.paymentStatus === 'failed') {
    const bookingId = window.location.pathname.match(/^\/booking\/(\d+)$/)?.[1];

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
            <h1 className="text-3xl font-black text-[#001A33] mb-4">Payment Failed</h1>
            <p className="text-gray-600 font-semibold mb-6">
              Your payment could not be processed. Please try again or contact support if the amount was deducted.
            </p>
            {bookingId && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 font-semibold mb-2">Booking ID: {bookingId}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {bookingId && (
                <button
                  onClick={async () => {
                    try {
                      // Retry payment - redirect to tour page to rebook
                      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                      const bookingResponse = await fetch(`${API_URL}/api/bookings/${bookingId}`);
                      const bookingData = await bookingResponse.json();

                      if (bookingData.success && bookingData.booking?.tourId) {
                        // Get tour slug from booking
                        const tourResponse = await fetch(`${API_URL}/api/tours/${bookingData.booking.tourId}`);
                        const tourData = await tourResponse.json();

                        if (tourData.success && tourData.tour?.slug) {
                          window.location.href = `/tour/${tourData.tour.slug}`;
                        } else {
                          window.location.href = '/';
                        }
                      } else {
                        window.location.href = '/';
                      }
                    } catch (error) {
                      console.error('Error retrying payment:', error);
                      window.location.href = '/';
                    }
                  }}
                  className="px-6 py-3 bg-[#10B981] text-white font-black rounded-xl hover:bg-[#059669] transition-colors"
                >
                  Retry Payment
                </button>
              )}
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-white border-2 border-[#001A33] text-[#001A33] font-black rounded-xl hover:bg-gray-50 transition-colors"
              >
                Return to Homepage
              </button>
              <button
                onClick={() => window.location.href = '/support'}
                className="px-6 py-3 bg-white border-2 border-[#001A33] text-[#001A33] font-black rounded-xl hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success state (same as BookingConfirmation)
  const bookingReference = booking.bookingReference || `ABL-${booking.id.toString().padStart(6, '0')}-${new Date(booking.createdAt).getFullYear()}`;
  const formattedDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between h-16 sm:h-20 md:h-24 bg-white px-6 rounded-2xl shadow-sm mb-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-[#001A33] font-semibold hover:text-[#10B981] transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
            <a href="/" className="flex items-center h-full cursor-pointer">
              <img
                src="/logo.png"
                alt="Asia By Locals"
                className="h-[110px] sm:h-[100px] md:h-[105px] lg:h-[110px] xl:h-[120px] w-auto object-contain"
                style={{ transform: 'translateY(3px)' }}
              />
            </a>
          </div>
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-[#10B981]" size={40} />
            </div>
            <h1 className="text-3xl font-black text-[#001A33] mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 font-semibold">Your payment has been received successfully</p>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#001A33] mb-2">Invoice</h2>
              <p className="text-gray-600 font-semibold">Booking Reference: <span className="font-black text-[#001A33]">{bookingReference}</span></p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 font-semibold mb-1">Invoice Date</div>
              <div className="font-black text-[#001A33]">
                {new Date(booking.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="border-b-2 border-gray-200 pb-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-black text-[#001A33] mb-2">AsiaByLocals</h3>
                <p className="text-sm text-gray-600 font-semibold">118 Rani Bagh Indirapuram</p>
                <p className="text-sm text-gray-600 font-semibold">Ghaziabad, Uttar Pradesh, India</p>
                <p className="text-sm text-gray-600 font-semibold mt-2">GSTIN: 09BPLPK5079QIZU</p>
              </div>
              <div>
                <h3 className="font-black text-[#001A33] mb-2">Bill To</h3>
                <p className="text-sm text-gray-600 font-semibold">{booking.customerName}</p>
                <p className="text-sm text-gray-600 font-semibold">{booking.customerEmail}</p>
                {booking.customerPhone && (
                  <p className="text-sm text-gray-600 font-semibold">{booking.customerPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="mb-6">
            <h3 className="font-black text-[#001A33] text-lg mb-4">Booking Details</h3>
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#10B981] mt-1" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-semibold mb-1">Tour</div>
                  <div className="font-black text-[#001A33]">{booking.tour?.title || 'Tour'}</div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    {booking.tour?.city}, {booking.tour?.country}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-[#10B981] mt-1" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-semibold mb-1">Booking Date</div>
                  <div className="font-black text-[#001A33]">{formattedDate}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="text-[#10B981] mt-1" size={20} />
                <div className="flex-1">
                  <div className="text-sm text-gray-500 font-semibold mb-1">Number of Guests</div>
                  <div className="font-black text-[#001A33]">{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'person' : 'people'}</div>
                </div>
              </div>
              {booking.specialRequests && (
                <div className="flex items-start gap-4">
                  <User className="text-[#10B981] mt-1" size={20} />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 font-semibold mb-1">Special Requests</div>
                    <div className="text-[#001A33] font-semibold">{booking.specialRequests}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-[#10B981]/5 rounded-xl p-6 mb-6 border-2 border-[#10B981]/20">
            <h3 className="font-black text-[#001A33] text-lg mb-4">Payment Information</h3>
            <div className="space-y-3">
              {booking.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-semibold">Payment ID:</span>
                  <span className="font-black text-[#001A33] text-sm">{booking.razorpayPaymentId}</span>
                </div>
              )}
              {booking.razorpayOrderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600 font-semibold">Order ID:</span>
                  <span className="font-black text-[#001A33] text-sm">{booking.razorpayOrderId}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-600 font-semibold">Payment Status:</span>
                <span className="font-black text-[#10B981]">✓ Paid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Payment Method:</span>
                <span className="font-black text-[#001A33]">Online Payment (Razorpay)</span>
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-semibold">Subtotal:</span>
              <span className="font-black text-[#001A33]">
                {booking.currency === 'INR' ? '₹' : '$'}{booking.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2 border-[#001A33] mt-4">
              <span className="text-xl font-black text-[#001A33]">Total Amount:</span>
              <span className="text-2xl font-black text-[#10B981]">
                {booking.currency === 'INR' ? '₹' : '$'}{booking.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 print:hidden">
            <button
              onClick={handlePrintInvoice}
              className="flex-1 flex items-center justify-center gap-2 bg-[#001A33] hover:bg-[#003366] text-white font-black py-4 rounded-xl transition-all"
            >
              <Download size={20} />
              Print Invoice
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-xl transition-all"
            >
              Continue Browsing
            </button>
          </div>
        </div>

        {/* Guide Contact Card */}
        {booking.supplier && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-black text-[#001A33] mb-6 flex items-center gap-2">
              <User className="text-[#10B981]" size={24} />
              Contact Your Guide
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 font-bold uppercase mb-2">Guide Name</div>
                <div className="text-lg font-black text-[#001A33]">
                  {booking.supplier.fullName || booking.supplier.companyName || 'Your Guide'}
                </div>
              </div>

              {booking.supplier.whatsapp || booking.supplier.phone ? (
                <div>
                  <div className="text-sm text-gray-500 font-bold uppercase mb-2">WhatsApp</div>
                  <a
                    href={`https://wa.me/${(booking.supplier.whatsapp || booking.supplier.phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#10B981] text-white font-black py-4 px-6 rounded-xl hover:bg-[#059669] transition-all"
                  >
                    <MessageCircle size={20} />
                    <span>{booking.supplier.whatsapp || booking.supplier.phone}</span>
                  </a>
                </div>
              ) : null}

              {booking.supplier.phone && booking.supplier.phone !== booking.supplier.whatsapp && (
                <div>
                  <div className="text-sm text-gray-500 font-bold uppercase mb-2">Phone</div>
                  <a
                    href={`tel:${booking.supplier.phone}`}
                    className="flex items-center gap-3 bg-white border-2 border-gray-200 text-[#001A33] font-black py-4 px-6 rounded-xl hover:border-[#10B981] transition-all"
                  >
                    <Phone size={20} />
                    <span>{booking.supplier.phone}</span>
                  </a>
                </div>
              )}

              {booking.supplier.email && (
                <div>
                  <div className="text-sm text-gray-500 font-bold uppercase mb-2">Email</div>
                  <a
                    href={`mailto:${booking.supplier.email}`}
                    className="flex items-center gap-3 bg-white border-2 border-gray-200 text-[#001A33] font-black py-4 px-6 rounded-xl hover:border-[#10B981] transition-all"
                  >
                    <Mail size={20} />
                    <span className="break-all">{booking.supplier.email}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .max-w-4xl, .max-w-4xl * {
            visibility: visible;
          }
          .max-w-4xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
